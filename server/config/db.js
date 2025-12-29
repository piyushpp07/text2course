import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("[DB] MONGO_URI not set in environment variables.");
    process.exit(1);
  }
  console.log(`[DB] Attempting to connect to: ${mongoUri}`);
  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database Connection Error:");
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
export { mongoose };
