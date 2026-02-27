import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Course from './models/Course.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const courses = await Course.find({}).sort({ createdAt: -1 }).limit(10);
        console.log('--- LATEST 10 COURSES ---');
        courses.forEach(c => {
            console.log(`Time: ${c.createdAt.toISOString()}, ID: ${c._id}, Creator: ${c.creator}, SavedBy: ${JSON.stringify(c.savedBy)}`);
        });
        await mongoose.disconnect();
    } catch (e) { console.error(e); }
};
check();
