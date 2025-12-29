import express from "express";
import {
  generateCourse,
  generateLessonDetail,
  getUserCourses,
  getCourseById,
  deleteCourse,
} from "../controllers/courseController.js";
import { checkJwt, attachUser } from "../middlewares/auth.js";

const router = express.Router();

// Protected routes
router.use(checkJwt);
router.use(attachUser);

// Course routes
router.post("/generate", generateCourse);
router.get("/", getUserCourses);
router.get("/:id", getCourseById);
router.delete("/:id", deleteCourse);

// Lesson generation route
router.post(
  "/:courseId/modules/:moduleId/lessons/:lessonId/generate",
  generateLessonDetail
);

export default router;
