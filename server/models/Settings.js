import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: "global" },
  signupCode: { type: String, default: "DW6S789F" }
}, { timestamps: true });

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
