import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const testDBConnection = async () => {
  console.log('Attempting to connect to MongoDB...');
  console.log(`Using URI: ${process.env.MONGO_URI ? 'Loaded' : 'NOT LOADED'}`);

  if (process.env.MONGO_URI) {
    try {
      const uri = new URL(process.env.MONGO_URI);
      uri.password = '***';
      uri.username = '***';
      console.log(`Connecting to: ${uri.toString()}`);
    } catch(e) {
      console.error("Could not parse MONGO_URI, please check the .env file");
    }
  }

  try {
    // Adding a serverSelectionTimeoutMS to fail faster if no server is available
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // 5 seconds
    });
    console.log(`MongoDB Connected Successfully! Host: ${conn.connection.host}`);
    await mongoose.disconnect();
    console.log('MongoDB Disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('Connection Failed!');
    console.error(error);
    process.exit(1);
  }
};

testDBConnection();