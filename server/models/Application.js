import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  videoCount: { type: String, required: true },
  videoType: { type: String, required: true },
  budget: { type: String, required: true },
  contactMethod: { type: String, enum: ["whatsapp", "email"], required: true },
  contact: { type: String, required: true },
  checked: { type: Boolean, default: false }
}, { timestamps: true });

const Application = mongoose.model("Application", applicationSchema);
export default Application;
