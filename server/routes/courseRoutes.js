import express from "express";
import {
  generateCourse,
  generateLessonDetail,
  getUserCourses,
  getCourseById,
  deleteCourse,
  getSavedCourses,
  saveCourse,
  unsaveCourse,
} from "../controllers/courseController.js";
import { checkJwt, attachUser } from "../middlewares/auth.js";

const router = express.Router();

// Protected routes
router.use(checkJwt);
router.use(attachUser);

// Course routes
router.post("/generate", generateCourse);
router.get("/", getUserCourses);
router.get("/saved", getSavedCourses); // New route for saved courses
router.post("/:id/save", saveCourse); // New route to save a course
router.delete("/:id/save", unsaveCourse); // New route to unsave a course
router.get("/:id", getCourseById);
router.delete("/:id", deleteCourse);

// Lesson generation route
router.post(
  "/:courseId/modules/:moduleId/lessons/:lessonId/generate",
  generateLessonDetail
);

export default router;
