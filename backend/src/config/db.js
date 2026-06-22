import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
import { ensureDefaultPlans } from "../utils/seedPlans.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    await ensureDefaultPlans();
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`, error);
    // Only exit in production if connection completely fails, otherwise allow retry/graceful degraded state
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

export default connectDB;
