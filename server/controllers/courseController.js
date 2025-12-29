import Course from "../models/Course.js";
import Module from "../models/Module.js";
import Lesson from "../models/Lesson.js";
import {
  generateCourseStructure,
  generateLessonContent,
} from "../services/aiService.js";

export const generateCourse = async (req, res, next) => {
  try {
    const { topic } = req.body;
    const userId = req.userId; // from auth middleware

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    // Generate course structure using AI
    const courseData = await generateCourseStructure(topic);

    // Create course document
    const course = new Course({
      title: courseData.title,
      description: courseData.description,
      creator: userId,
      tags: courseData.tags || [],
    });

    await course.save();

    // Create modules and lessons
    for (let i = 0; i < courseData.modules.length; i++) {
      const moduleData = courseData.modules[i];

      const module = new Module({
        title: moduleData.title,
        course: course._id,
        orderIndex: i,
      });

      await module.save();

      // Create lesson stubs (titles only)
      for (const lessonTitle of moduleData.lessons) {
        const lesson = new Lesson({
          title: lessonTitle,
          content: [],
          module: module._id,
        });

        await lesson.save();
        module.lessons.push(lesson._id);
      }

      await module.save();
      course.modules.push(module._id);
    }

    await course.save();

    // Populate and return full course
    const populatedCourse = await Course.findById(course._id).populate({
      path: "modules",
      populate: {
        path: "lessons",
      },
    });

    res.status(201).json({
      success: true,
      data: populatedCourse,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate detailed content for a specific lesson
 * POST /api/courses/:courseId/modules/:moduleId/lessons/:lessonId/generate
 */
export const generateLessonDetail = async (req, res, next) => {
  try {
    const { courseId, moduleId, lessonId } = req.params;

    // Fetch the course, module, and lesson
    const course = await Course.findById(courseId);
    const module = await Module.findById(moduleId);
    const lesson = await Lesson.findById(lessonId);

    if (!course || !module || !lesson) {
      return res.status(404).json({
        success: false,
        message: "Course, module, or lesson not found",
      });
    }

    // Generate detailed lesson content
    const lessonData = await generateLessonContent(
      course.title,
      module.title,
      lesson.title
    );

    // Update lesson with generated content
    lesson.objectives = lessonData.objectives || [];
    lesson.content = lessonData.content || [];
    lesson.isEnriched = true;

    await lesson.save();

    res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all courses for the authenticated user
 * GET /api/courses
 */
export const getUserCourses = async (req, res, next) => {
  try {
    const userId = req.userId;
    let courses = await Course.find({ creator: userId })
      .sort({ createdAt: -1 })
      .lean();

    // Defensive population to prevent crashes from bad data
    try {
      courses = await Course.populate(courses, {
        path: "modules",
        populate: {
          path: "lessons",
          model: "Lesson",
        },
      });
    } catch (populateError) {
      console.error("--- POPULATE ERROR ---");
      console.error("Failed to populate courses, returning unpopulated data.");
      console.error(populateError);
      // The unpopulated courses from the initial find query will be sent.
    }

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    // This will catch errors from the initial Course.find()
    next(error);
  }
};

/**
 * Get a specific course by ID
 * GET /api/courses/:id
 */
export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: "modules",
      populate: {
        path: "lessons",
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a course
 * DELETE /api/courses/:id
 */
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if user is the creator
    if (course.creator !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this course",
      });
    }

    // Delete all associated lessons and modules
    for (const moduleId of course.modules) {
      const module = await Module.findById(moduleId);
      if (module) {
        await Lesson.deleteMany({ _id: { $in: module.lessons } });
        await Module.findByIdAndDelete(moduleId);
      }
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all courses saved by the authenticated user
 * GET /api/courses/saved
 */
export const getSavedCourses = async (req, res, next) => {
  try {
    const userId = req.userId;
    let courses = await Course.find({ savedBy: userId })
      .sort({ createdAt: -1 })
      .lean();

    try {
      courses = await Course.populate(courses, {
        path: "modules",
        populate: {
          path: "lessons",
          model: "Lesson",
        },
      });
    } catch (populateError) {
      console.error("--- POPULATE ERROR (Saved Courses) ---");
      console.error("Failed to populate saved courses.");
      console.error(populateError);
    }

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Save a course for the authenticated user
 * POST /api/courses/:id/save
 */
export const saveCourse = async (req, res, next) => {
  try {
    const userId = req.userId;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (!course.savedBy.includes(userId)) {
      course.savedBy.push(userId);
      await course.save();
    }

    res.status(200).json({ success: true, message: "Course saved successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * Unsave a course for the authenticated user
 * DELETE /api/courses/:id/save
 */
export const unsaveCourse = async (req, res, next) => {
  try {
    const userId = req.userId;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    course.savedBy = course.savedBy.filter((id) => id !== userId);
    await course.save();

    res.status(200).json({ success: true, message: "Course unsaved successfully" });
  } catch (error) {
    next(error);
  }
};
