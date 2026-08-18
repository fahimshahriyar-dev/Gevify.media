import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  // Unique identifier for this configuration document
  key: {
    type: String,
    required: true,
    unique: true,
    default: "homepage"
  },
  logo: {
    type: String,
    default: "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786910291/logo_o11gn5.png"
  },
  hero: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    videoUrl: { type: String, default: "https://www.youtube.com/watch?v=bSl7z00Hnug" }
  },
  solutionTitle: {
    type: String,
    required: true
  },
  solutionCards: [{
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    image: { type: String }
  }],
  reviews: [{
    quote: { type: String, required: true },
    avatar: { type: String, default: "" },
    name: { type: String, required: true },
    role: { type: String, required: true }
  }],
  faqs: [{
    question: { type: String, required: true },
    answer: { type: String, required: true }
  }],
  workVideos: [{
    type: String
  }],
  brands: {
    row1: [{ type: String }],
    row2: [{ type: String }]
  },
  production: {
    sectionSubtitle: { type: String },
    title: { type: String },
    description: { type: String },
    boxes: [{
      title: { type: String },
      subtitle: { type: String }
    }]
  },
  workPage: {
    title: { type: String },
    videos: [{ type: String }]
  },
  about: {
    title: { type: String },
    subtitle: { type: String },
    description: { type: String }
  },
  contact: {
    title: { type: String },
    subtitle: { type: String },
    company: { type: String },
    email: { type: String },
    whatsapp: { type: String },
    facebook: { type: String },
    instagram: { type: String },
    youtube: { type: String }
  },
  footer: {
    brand: { type: String },
    description: { type: String },
    email: { type: String },
    whatsapp: { type: String },
    facebook: { type: String },
    instagram: { type: String },
    youtube: { type: String }
  }
}, { timestamps: true });

const Content = mongoose.model("Content", contentSchema);
export default Content;
