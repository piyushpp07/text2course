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
        const creators = await Course.distinct('creator');
        console.log('Creators in DB:', creators);
        
        for (const c_id of creators) {
            const count = await Course.countDocuments({ creator: c_id });
            console.log(`Creator ${c_id}: ${count} courses`);
        }
        await mongoose.disconnect();
    } catch (e) { console.error(e); }
};
check();
