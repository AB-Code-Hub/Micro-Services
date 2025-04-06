import mongoose from "mongoose";
import { DB_URL } from "../config/env.js";

const connectDb = async () => {
  try {
    await mongoose.connect(DB_URL);   
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error); 
    process.exit(1); 
  }
};

export default connectDb;