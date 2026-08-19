import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  FileText, 
  Users, 
  LogOut, 
  ShieldAlert, 
  CheckSquare, 
  Square, 
  Lock, 
  KeyRound, 
  Mail, 
  Camera, 
  Check, 
  AlertCircle,
  Search,
  ChevronDown
} from "lucide-react";
import Navbar from "../components/Navbar";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "moderator";
  avatar?: string;
}

interface Application {
  _id: string;
  name: string;
  videoCount: string;
  videoType: string;
  budget: string;
  contactMethod: "whatsapp" | "email";
  contact: string;
  checked: boolean;
  createdAt: string;
}

const AdminProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "applications" | "team">("profile");

  // User state
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Superadmin Signup Code state
  const [signupCode, setSignupCode] = useState("");
  const [newSignupCode, setNewSignupCode] = useState("");
  const [codeMsg, setCodeMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [updatingCode, setUpdatingCode] = useState(false);

  // Applications state
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // Applications filters
  const [searchTerm, setSearchTerm] = useState("");
  const [checkedFilter, setCheckedFilter] = useState<"all" | "checked" | "unchecked">("unchecked");
  const [sortBy, setSortBy] = useState<"recent" | "first">("recent");
  const [checkedFilterOpen, setCheckedFilterOpen] = useState(false);
  const [sortByOpen, setSortByOpen] = useState(false);

  // Team state
  const [team, setTeam] = useState<AdminUser[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(false);

  const token = localStorage.getItem("adminToken");

  // Check auth and fetch current user profile
  useEffect(() => {
    if (!token) {
      navigate("/admin/signin");
      return;
    }

    const fetchMe = async () => {
      try {
        const res = await fetch("https://api.gevify.media/api/admin/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          localStorage.removeItem("adminToken");
          navigate("/admin/signin");
          return;
        }
        const data = await res.json();
        setUser(data);
        setName(data.name || "");
        setEmail(data.email || "");
        setAvatarUrl(data.avatar || "");
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token, navigate]);

  // Fetch signup code if superadmin
  useEffect(() => {
    if (user && user.role === "superadmin" && activeTab === "profile") {
      fetch("https://api.gevify.media/api/admin/signup-code", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.signupCode) setSignupCode(data.signupCode);
        })
        .catch((err) => console.error(err));
    }
  }, [user, activeTab, token]);

  // Fetch applications
  useEffect(() => {
    if (activeTab === "applications" && token) {
      setLoadingApps(true);
      fetch("https://api.gevify.media/api/admin/applications", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setApplications(data);
        })
        .catch((err) => console.error("Error fetching applications:", err))
        .finally(() => setLoadingApps(false));
    }
  }, [activeTab, token]);

  // Fetch team members
  useEffect(() => {
    if (activeTab === "team" && token) {
      setLoadingTeam(true);
      fetch("https://api.gevify.media/api/admin/team", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setTeam(data);
        })
        .catch((err) => console.error("Error fetching team members:", err))
        .finally(() => setLoadingTeam(false));
    }
  }, [activeTab, token]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/signin");
  };

  // Profile update handler
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);

    if (newPassword && newPassword !== confirmPassword) {
      setProfileMsg({ type: "error", text: "New passwords do not match" });
      return;
    }

    setUpdatingProfile(true);
    try {
      const res = await fetch("https://api.gevify.media/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          email,
          avatar: avatarUrl,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setUser(data.admin);
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err.message || "Error updating profile" });
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Superadmin update signup code
  const handleUpdateSignupCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeMsg(null);
    if (!newSignupCode.trim()) {
      setCodeMsg({ type: "error", text: "Please enter a valid signup code" });
      return;
    }

    setUpdatingCode(true);
    try {
      const res = await fetch("https://api.gevify.media/api/admin/signup-code", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ signupCode: newSignupCode.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update code");
      }

      setSignupCode(data.signupCode);
      setNewSignupCode("");
      setCodeMsg({ type: "success", text: "Signup code updated successfully!" });
    } catch (err: any) {
      setCodeMsg({ type: "error", text: err.message || "Error updating signup code" });
    } finally {
      setUpdatingCode(false);
    }
  };

  // Toggle application checkbox
  const handleToggleCheck = async (id: string) => {
    try {
      const res = await fetch(`https://api.gevify.media/api/admin/applications/${id}/check`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) => (app._id === id ? { ...app, checked: !app.checked } : app))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Role change handler
  const handleRoleChange = async (memberId: string, newRole: string) => {
    // Confirm before transferring superadmin
    if (newRole === "superadmin") {
      const confirmed = window.confirm(
        "⚠️ Transfer Superadmin Role?\n\nYou will be demoted to Admin and the selected user will become the new Superadmin. This cannot be undone easily.\n\nContinue?"
      );
      if (!confirmed) return;
    }

    try {
      const res = await fetch("https://api.gevify.media/api/admin/team/role", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ memberId, role: newRole })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to change role");
        return;
      }

      setTeam((prev) => {
        let updated = prev.map((m) =>
          m._id === memberId ? { ...m, role: data.member.role } : m
        );
        // If a superadmin transfer happened, also demote the old superadmin in local state
        if (data.demotedMember) {
          updated = updated.map((m) =>
            m._id === data.demotedMember._id ? { ...m, role: data.demotedMember.role } : m
          );
          // If the current user was the one demoted, update their local user state too
          if (user && data.demotedMember._id === user._id) {
            setUser((prev) => prev ? { ...prev, role: "admin" } : prev);
          }
        }
        return updated;
      });
    } catch (err: any) {
      alert(err.message || "Error changing role");
    }
  };

  // Filtered + sorted applications for the applications tab
  const filteredApplications = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    let list = applications.filter((app) => {
      if (checkedFilter === "checked" && !app.checked) return false;
      if (checkedFilter === "unchecked" && app.checked) return false;
      if (query) {
        const haystack = `${app.name} ${app.contact} ${app.videoType} ${app.budget}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortBy === "recent" ? bTime - aTime : aTime - bTime;
    });
    return list;
  }, [applications, searchTerm, checkedFilter, sortBy]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-[#06102F] flex flex-col items-center justify-center text-white gap-3">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-[#0086F0]/20"></div>
          <div className="w-10 h-10 border-2 border-transparent border-t-[#0086F0] rounded-full animate-spin" />
        </div>
        <p className="text-sm text-[#5ACFFE]/80 tracking-widest uppercase font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-[#06102F] text-white font-sans flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex-1 min-h-0 max-w-[1500px] w-full mx-auto px-3 sm:px-6 lg:px-8 pt-24 xl:pt-28 pb-6 flex flex-col lg:flex-row gap-5 lg:gap-8 overflow-hidden">
        {/* ═══════════════════════════════════════════════════════
            SIDEBAR NAVIGATION
            ═══════════════════════════════════════════════════════ */}
        <aside className="w-full lg:w-72 min-h-0 shrink-0 bg-white/[0.06] backdrop-blur-xl border border-white/15 rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-row lg:flex-col items-start lg:justify-between gap-4 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 lg:gap-8 items-start lg:items-stretch min-w-0 flex-1 w-full">
            {/* Admin Avatar & Brief */}
            <div className="flex items-center gap-3 lg:gap-4 pb-0 lg:pb-6 border-b-0 lg:border-b border-white/10 lg:w-full">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover border border-[#0086F0]/50" />
              ) : (
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-tr from-[#0086F0] to-[#7C5CFF] flex items-center justify-center font-bold text-base lg:text-lg text-white shadow-lg shrink-0">
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </div>
              )}
              <div className="overflow-hidden min-w-0">
                <h3 className="text-sm lg:text-base font-bold text-white truncate">{user?.name}</h3>
                <span className="text-[11px] font-semibold text-[#5ACFFE] uppercase tracking-wider px-2 py-0.5 bg-[#0086F0]/15 rounded border border-[#0086F0]/30 inline-block mt-0.5">
                  {user?.role}
                </span>
              </div>
            </div>

            {/* Navigation Options */}
            <nav className="flex lg:flex-col gap-2 flex-1 w-full">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-3.5 px-3.5 sm:px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap lg:w-full ${
                  activeTab === "profile"
                    ? "bg-gradient-to-r from-[#0086F0] to-[#5ACFFE] text-white shadow-lg shadow-[#0086F0]/25"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>

              <button
                onClick={() => setActiveTab("applications")}
                className={`flex items-center gap-3.5 px-3.5 sm:px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap lg:w-full ${
                  activeTab === "applications"
                    ? "bg-gradient-to-r from-[#0086F0] to-[#5ACFFE] text-white shadow-lg shadow-[#0086F0]/25"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Applications</span>
              </button>

              <button
                onClick={() => setActiveTab("team")}
                className={`flex items-center gap-3.5 px-3.5 sm:px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap lg:w-full ${
                  activeTab === "team"
                    ? "bg-gradient-to-r from-[#0086F0] to-[#5ACFFE] text-white shadow-lg shadow-[#0086F0]/25"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Manage Team</span>
              </button>
            </nav>
          </div>

          {/* Logout Button Box */}
          <div className="hidden md:block lg:pt-6 lg:border-t border-white/10 lg:mt-8 shrink-0 ml-auto lg:ml-0 w-full">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 transition-all duration-200 cursor-pointer border border-red-500/25 shadow-lg hover:shadow-red-500/20 whitespace-nowrap w-full"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* ═══════════════════════════════════════════════════════
            MAIN CONTENT DISPLAY AREA
            ═══════════════════════════════════════════════════════ */}
        <main className="flex-1 min-h-0 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-10 shadow-2xl shadow-black/30 overflow-y-auto">
          {/* TAB 1: PROFILE */}
          {activeTab === "profile" && (
            <div className="w-full space-y-10">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Admin Profile</h1>
                <p className="text-sm text-zinc-400 mt-1">Manage your account information and password settings</p>
              </div>

              {profileMsg && (
                <div
                  className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium border ${
                    profileMsg.type === "success"
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
                >
                  {profileMsg.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{profileMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* Profile Image URL */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-zinc-400 tracking-wider flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5 text-[#5ACFFE]" /> Profile Image URL
                  </label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0086F0] transition-colors"
                  />
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-zinc-400 tracking-wider flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#5ACFFE]" /> Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0086F0] transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-zinc-400 tracking-wider flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#5ACFFE]" /> Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0086F0] transition-colors"
                  />
                </div>

                {/* Change Password Section */}
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#5ACFFE]" /> Change Password
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0086F0]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0086F0]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0086F0]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0086F0] to-[#5ACFFE] hover:brightness-110 text-white font-semibold text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-[#0086F0]/20 disabled:opacity-50"
                >
                  {updatingProfile ? "Saving Changes..." : "Save Changes"}
                </button>
              </form>

              {/* ═══════════════════════════════════════════════════════
                  SUPERADMIN EXTRA FEATURE: Update Admin Signup Code
                  ═══════════════════════════════════════════════════════ */}
              {user?.role === "superadmin" && (
                <div className="pt-10 border-t border-white/10 space-y-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0086F0]/15 to-[#7C5CFF]/15 border border-[#0086F0]/30 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#0086F0]/20 text-[#5ACFFE]">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">Superadmin Setting: Admin Registration Code</h3>
                        <p className="text-xs text-zinc-400">
                          Users require this security code to create an admin account. Only you can update it.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-zinc-400">Current Code:</span>
                      <code className="px-3 py-1 bg-white/[0.06] backdrop-blur-md rounded border border-white/10 text-[#5ACFFE] font-mono font-bold tracking-wider">
                        {signupCode || "DW6S789F"}
                      </code>
                    </div>

                    {codeMsg && (
                      <div
                        className={`p-3 rounded-lg text-xs font-medium border ${
                          codeMsg.type === "success"
                            ? "bg-green-500/10 border-green-500/30 text-green-400"
                            : "bg-red-500/10 border-red-500/30 text-red-400"
                        }`}
                      >
                        {codeMsg.text}
                      </div>
                    )}

                    <form onSubmit={handleUpdateSignupCode} className="flex flex-col sm:flex-row gap-3 pt-2">
                      <input
                        type="text"
                        placeholder="Enter new registration code..."
                        value={newSignupCode}
                        onChange={(e) => setNewSignupCode(e.target.value)}
                        className="flex-1 bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#0086F0]"
                      />
                      <button
                        type="submit"
                        disabled={updatingCode}
                        className="px-5 py-2.5 rounded-xl bg-[#0086F0] hover:bg-[#0070ce] text-white font-semibold text-sm transition-all duration-200 cursor-pointer shrink-0 disabled:opacity-50"
                      >
                        {updatingCode ? "Updating..." : "Update Code"}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: APPLICATIONS */}
          {activeTab === "applications" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Submitted Applications</h1>
                <p className="text-sm text-zinc-400 mt-1">Review contact form inquiries submitted by clients</p>
              </div>

              {/* Filter bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, contact, type or budget..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.06] backdrop-blur-md border border-white/10 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#0086F0] transition-colors"
                  />
                </div>

                {/* Checked status filter */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setCheckedFilterOpen((prev) => !prev);
                      setSortByOpen(false);
                    }}
                    className="flex items-center justify-between gap-6 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-white hover:border-[#0086F0]/60 transition-colors cursor-pointer min-w-[140px]"
                  >
                    <span className="capitalize">{checkedFilter}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${checkedFilterOpen ? "rotate-180" : ""}`} />
                  </button>
                  {checkedFilterOpen && (
                    <div className="absolute z-30 mt-2 w-full min-w-[140px] bg-[#0B1533] border border-white/10 rounded-xl py-1.5 shadow-2xl">
                      {(["all", "checked", "unchecked"] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setCheckedFilter(opt);
                            setCheckedFilterOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm capitalize transition-colors cursor-pointer ${
                            checkedFilter === opt
                              ? "text-[#5ACFFE] bg-[#0086F0]/15"
                              : "text-zinc-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sort filter */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setSortByOpen((prev) => !prev);
                      setCheckedFilterOpen(false);
                    }}
                    className="flex items-center justify-between gap-6 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-white hover:border-[#0086F0]/60 transition-colors cursor-pointer min-w-[140px]"
                  >
                    <span className="capitalize">{sortBy}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${sortByOpen ? "rotate-180" : ""}`} />
                  </button>
                  {sortByOpen && (
                    <div className="absolute z-30 mt-2 w-full min-w-[140px] bg-[#0B1533] border border-white/10 rounded-xl py-1.5 shadow-2xl">
                      {(["recent", "first"] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setSortBy(opt);
                            setSortByOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm capitalize transition-colors cursor-pointer ${
                            sortBy === opt
                              ? "text-[#5ACFFE] bg-[#0086F0]/15"
                              : "text-zinc-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {loadingApps ? (
                <div className="py-12 text-center text-[#5ACFFE]/60 text-sm">Loading applications...</div>
              ) : filteredApplications.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 text-sm">No applications match your filters.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-zinc-300">
                    <thead className="text-xs uppercase bg-white/5 text-zinc-400 border-b border-white/10">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">Checked</th>
                        <th className="py-3.5 px-4 font-semibold">Client Name</th>
                        <th className="py-3.5 px-4 font-semibold">Videos</th>
                        <th className="py-3.5 px-4 font-semibold">Video Type</th>
                        <th className="py-3.5 px-4 font-semibold">Budget</th>
                        <th className="py-3.5 px-4 font-semibold">Contact Info</th>
                        <th className="py-3.5 px-4 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredApplications.map((app) => (
                        <tr
                          key={app._id}
                          className={`hover:bg-white/[0.02] transition-colors ${
                            app.checked ? "opacity-60 bg-white/[0.01]" : ""
                          }`}
                        >
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleToggleCheck(app._id)}
                              className="text-[#5ACFFE] hover:text-[#0086F0] transition-colors cursor-pointer"
                              title={app.checked ? "Mark as unchecked" : "Mark as checked"}
                            >
                              {app.checked ? (
                                <CheckSquare className="w-5 h-5" />
                              ) : (
                                <Square className="w-5 h-5 text-zinc-600" />
                              )}
                            </button>
                          </td>
                          <td className="py-4 px-4 font-semibold text-white">{app.name}</td>
                          <td className="py-4 px-4">{app.videoCount}</td>
                          <td className="py-4 px-4">{app.videoType}</td>
                          <td className="py-4 px-4 font-medium text-[#5ACFFE]">{app.budget}</td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col">
                              <span className="text-xs uppercase font-bold text-zinc-400">{app.contactMethod}</span>
                              <span className="text-white">{app.contact}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-xs text-zinc-500">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MANAGE TEAM */}
          {activeTab === "team" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Manage Team & Roles</h1>
                <p className="text-sm text-zinc-400 mt-1">
                  Manage user roles (Superadmin, Admin, Moderator). Newly registered accounts start as Moderator.
                </p>
              </div>

              {loadingTeam ? (
                <div className="py-12 text-center text-[#5ACFFE]/60 text-sm">Loading team members...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-zinc-300">
                    <thead className="text-xs uppercase bg-white/5 text-zinc-400 border-b border-white/10">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">User</th>
                        <th className="py-3.5 px-4 font-semibold">Email</th>
                        <th className="py-3.5 px-4 font-semibold">Current Role</th>
                        <th className="py-3.5 px-4 font-semibold">Action / Change Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {team.map((member) => {
                        const isSuperAdmin = member.role === "superadmin";
                        const isSelf = member._id === user?._id;

                        // Hierarchy rule check for dropdown state
                        // Only superadmin can change admin & moderator roles
                        let canEdit = false;
                        if (user?.role === "superadmin" && !isSuperAdmin) {
                          canEdit = true;
                        }

                        return (
                          <tr key={member._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-4 flex items-center gap-3">
                              {member.avatar ? (
                                <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0086F0] to-[#7C5CFF] flex items-center justify-center font-bold text-xs text-white">
                                  {member.name?.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <span className="font-semibold text-white">{member.name} {isSelf && "(You)"}</span>
                            </td>
                            <td className="py-4 px-4 text-zinc-400">{member.email}</td>
                            <td className="py-4 px-4">
                              <span
                                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${
                                  member.role === "superadmin"
                                    ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                                    : member.role === "admin"
                                    ? "bg-[#0086F0]/15 border-[#0086F0]/30 text-[#5ACFFE]"
                                    : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                                }`}
                              >
                                {member.role}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              {isSuperAdmin ? (
                                <span className="text-xs text-zinc-500 italic flex items-center gap-1">
                                  <ShieldAlert className="w-3.5 h-3.5 text-purple-400" /> Protected Role
                                </span>
                              ) : canEdit ? (
                                <select
                                  value={member.role}
                                  onChange={(e) => handleRoleChange(member._id, e.target.value)}
                                  className="bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#0086F0] cursor-pointer"
                                >
                                  <option value="moderator">Moderator</option>
                                  <option value="admin">Admin</option>
                                  <option value="superadmin">⚠️ Transfer Superadmin</option>
                                </select>
                              ) : (
                                <span className="text-xs text-zinc-600">No permission</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;
