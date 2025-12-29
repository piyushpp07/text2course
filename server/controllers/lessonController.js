import Lesson from "../models/Lesson.js";
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
    const { title, objectives, content } = req.body;

    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    if (title) lesson.title = title;
    if (objectives) lesson.objectives = objectives;
    if (content) lesson.content = content;

    await lesson.save();

    res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};
