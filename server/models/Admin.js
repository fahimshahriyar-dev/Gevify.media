import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Admin User"
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ""
  },
  role: {
    type: String,
    enum: ["superadmin", "admin", "moderator"],
    default: "moderator"
  }
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
