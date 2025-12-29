import { searchYouTubeVideos } from "../services/youtubeService.js";
import { translateToHinglish } from "../services/aiService.js";

export const searchVideos = async (req, res, next) => {
  try {
    const { query, maxResults = 3 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required",
      });
    }

    const videos = await searchYouTubeVideos(query, parseInt(maxResults));

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Translate text to Hinglish
 * POST /api/translate/hinglish
 */
export const translateTextToHinglish = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required for translation",
      });
    }

    const translatedText = await translateToHinglish(text);

    res.status(200).json({
      success: true,
      data: {
        original: text,
        translated: translatedText,
      },
    });
  } catch (error) {
    next(error);
  }
};
