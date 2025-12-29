import express from 'express';
import { searchVideos, translateTextToHinglish } from '../controllers/utilityController.js';

const router = express.Router();

// Public routes (YouTube search)
router.get('/youtube/search', searchVideos);

// Translation route
router.post('/translate/hinglish', translateTextToHinglish);

export default router;
