import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Application from "../models/Application.js";
import Settings from "../models/Settings.js";

const JWT_SECRET = process.env.JWT_SECRET || "broeditz_admin_secret_key_12345!@#";

// Get or initialize global settings
const getSettings = async () => {
  let settings = await Settings.findOne({ key: "global" });
  if (!settings) {
    settings = new Settings({ key: "global", signupCode: process.env.SIGNUP_CODE || "DW6S789F" });
    await settings.save();
  }
  return settings;
};

// Admin Signup (New users become 'moderator', first registered becomes 'superadmin')
export const adminSignup = async (req, res) => {
  const { email, password, name, signupCode } = req.body;

  try {
    const settings = await getSettings();
    if (!signupCode || signupCode.trim() !== settings.signupCode) {
      return res.status(400).json({ message: "Invalid signup code" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const count = await Admin.countDocuments({});
    const role = count === 0 ? "superadmin" : "moderator";

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      name: name || email.split("@")[0],
      email,
      password: hashedPassword,
      role
    });

    await newAdmin.save();

    const token = jwt.sign(
      { id: newAdmin._id, email: newAdmin.email, role: newAdmin.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      admin: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email, role: newAdmin.role, avatar: newAdmin.avatar }
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Admin Login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role, avatar: admin.avatar }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during authentication" });
  }
};

// Verify Session
export const verifySession = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Profile Update (Name, Email, Password, Avatar)
export const updateProfile = async (req, res) => {
  const { name, email, currentPassword, newPassword, avatar } = req.body;

  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ message: "User not found" });

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to set new password" });
      }
      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      admin.password = await bcrypt.hash(newPassword, 10);
    }

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (avatar !== undefined) admin.avatar = avatar;

    await admin.save();
    res.json({
      message: "Profile updated successfully",
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role, avatar: admin.avatar }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

// Get Signup Code (Superadmin only)
export const getSignupCode = async (req, res) => {
  try {
    if (req.admin.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied. Superadmin only." });
    }
    const settings = await getSettings();
    res.json({ signupCode: settings.signupCode });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Signup Code (Superadmin only)
export const updateSignupCode = async (req, res) => {
  const { signupCode } = req.body;
  try {
    if (req.admin.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied. Superadmin only." });
    }
    if (!signupCode || !signupCode.trim()) {
      return res.status(400).json({ message: "Signup code cannot be empty" });
    }
    const settings = await getSettings();
    settings.signupCode = signupCode.trim();
    await settings.save();
    res.json({ message: "Signup code updated successfully", signupCode: settings.signupCode });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Manage Team: Get All Users
export const getTeamMembers = async (req, res) => {
  try {
    const members = await Admin.find().select("-password").sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching team members" });
  }
};

// Manage Team: Update Role
export const updateMemberRole = async (req, res) => {
  const { memberId, role } = req.body;
  const currentUserId = req.admin.id;
  const currentUserRole = req.admin.role;

  try {
    // Only superadmin can change roles
    if (currentUserRole !== "superadmin") {
      return res.status(403).json({ message: "Only superadmin can change roles" });
    }

    if (!["superadmin", "admin", "moderator"].includes(role)) {
      return res.status(400).json({ message: "Invalid role target" });
    }

    const targetMember = await Admin.findById(memberId);
    if (!targetMember) return res.status(404).json({ message: "User not found" });

    // Cannot change a superadmin's role unless we are doing a superadmin swap
    if (targetMember.role === "superadmin") {
      return res.status(403).json({ message: "Superadmin role cannot be changed directly" });
    }

    // --- Superadmin transfer: demote current superadmin → admin first ---
    if (role === "superadmin") {
      const currentSuperAdmin = await Admin.findById(currentUserId);
      if (!currentSuperAdmin) {
        return res.status(404).json({ message: "Current superadmin not found" });
      }

      currentSuperAdmin.role = "admin";
      targetMember.role = "superadmin";

      await currentSuperAdmin.save();
      await targetMember.save();

      return res.json({
        message: "Superadmin role transferred successfully",
        member: targetMember,
        demotedMember: currentSuperAdmin
      });
    }

    // Standard role change (admin ↔ moderator)
    targetMember.role = role;
    await targetMember.save();
    res.json({ message: "Role updated successfully", member: targetMember });
  } catch (error) {
    console.error("Role update error:", error);
    res.status(500).json({ message: "Server error updating role" });
  }
};

// Applications: Submit Application (Contact form)
export const submitApplication = async (req, res) => {
  const { name, videoCount, videoType, budget, contactMethod, contact } = req.body;
  try {
    if (!name || !videoCount || !videoType || !budget || !contactMethod || !contact) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const app = new Application({
      name,
      videoCount,
      videoType,
      budget,
      contactMethod,
      contact
    });

    await app.save();
    res.status(201).json({ message: "Application submitted successfully", application: app });
  } catch (error) {
    console.error("Submit application error:", error);
    res.status(500).json({ message: "Server error submitting application" });
  }
};

// Applications: Get All Applications (Admin/Moderator)
export const getApplications = async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching applications" });
  }
};

// Applications: Toggle Check Application
export const toggleCheckApplication = async (req, res) => {
  const { id } = req.params;
  try {
    const app = await Application.findById(id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    app.checked = !app.checked;
    await app.save();
    res.json({ message: "Status updated", application: app });
  } catch (error) {
    res.status(500).json({ message: "Server error updating application" });
  }
};
