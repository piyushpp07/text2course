import Lesson from "../models/Lesson.js";
import User from "../models/User.js";
/**
 * Get a specific lesson by ID
 * GET /api/lessons/:id
 */
export const getLessonById = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate("module");

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update lesson content
 * PUT /api/lessons/:id
 */
export const updateLesson = async (req, res, next) => {
  try {
    const { title, objectives, content, hinglishText } = req.body;

    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    if (title) lesson.title = title;
    if (objectives) {
        lesson.objectives = objectives;
        lesson.markModified('objectives');
    }
    if (content) {
        lesson.content = content;
        lesson.markModified('content');
    }
    if (hinglishText !== undefined) lesson.hinglishText = hinglishText;

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
 * Toggle lesson completion status for a user
 * POST /api/lessons/:id/complete
 */
export const toggleLessonCompletion = async (req, res, next) => {
  try {
    const userId = req.userId;
    const lessonId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const lessonExists = await Lesson.findById(lessonId);
    if (!lessonExists) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }

    let isCompleted = false;
    const completedLessons = user.completedLessons.map(id => id.toString());

    if (completedLessons.includes(lessonId)) {
      // uncomplete it
      user.completedLessons = user.completedLessons.filter(id => id.toString() !== lessonId);
    } else {
      // complete it
      user.completedLessons.push(lessonId);
      isCompleted = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: { isCompleted }
    });
  } catch (error) {
    next(error);
  }
};
