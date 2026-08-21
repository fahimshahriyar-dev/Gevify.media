import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb+srv://fahimshahriyardev_db_user:yAsfA0twNmLVYBUi@development.noel1vx.mongodb.net/broeditz?retryWrites=true&w=majority";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
