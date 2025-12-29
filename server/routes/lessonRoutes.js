import express from 'express';
import { getLessonById, updateLesson } from '../controllers/lessonController.js';
import { checkJwt, attachUser } from '../middlewares/auth.js';

const router = express.Router();

// Protected routes
router.use(checkJwt);
router.use(attachUser);

router.get('/:id', getLessonById);
router.put('/:id', updateLesson);

export default router;
