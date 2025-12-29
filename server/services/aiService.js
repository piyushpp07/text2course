import fetch from "node-fetch";

// DeepSeek fallback
const callDeepSeek = async (prompt, options = {}) => {
  const apiKey = process.env.DEEPSEEKAI_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEKAI_API_KEY not set");
  }
  const model = options.model || "deepseek-chat";
  const max_tokens = options.max_tokens || 1500;
  const body = {
    model,
    messages: [
      {
        role: "system",
        content: options.system || "You are a helpful assistant.",
      },
      { role: "user", content: prompt },
    ],
    temperature: options.temperature ?? 0.2,
    max_tokens,
  };
  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`DeepSeek error [${res.status}]: ${txt}`);
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  return text;
};
export const listAvailableModels = async () => {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`[${res.status}] ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error listing models:", err);
    throw err;
  }
};
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const callOpenAI = async (prompt, options = {}) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not set");
  }

  const model = process.env.OPENAI_MODEL || "gpt-3.5-turbo";
  const max_tokens = options.max_tokens || 1500;

  const body = {
    model,
    messages: [
      {
        role: "system",
        content: options.system || "You are a helpful assistant.",
      },
      { role: "user", content: prompt },
    ],
    temperature: options.temperature ?? 0.2,
    max_tokens,
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI error [${res.status}]: ${txt}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  return text;
};

export const generateCourseStructure = async (topic) => {
  const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

  const prompt = `You are an expert curriculum designer. Create a comprehensive online course for the topic: "${topic}".

Generate a detailed course structure with the following specifications:
- A clear, engaging course title and description
- 3-6 modules that progress from foundational to advanced concepts
- Each module should have 3-5 lessons
- Include 3-5 relevant tags for the course

Return ONLY a valid JSON object (no markdown, no explanation) in this exact format:
{
  "title": "Course Title",
  "description": "Detailed course description explaining what students will learn",
  "tags": ["tag1", "tag2", "tag3"],
  "modules": [
    {
      "title": "Module 1 Title",
      "lessons": [
        "Lesson 1 Title",
        "Lesson 2 Title",
        "Lesson 3 Title"
      ]
    }
  ]
}`;

  // Try Google Generative API first, fallback to OpenAI, then DeepSeek
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.slice(7);
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.slice(0, -3);
    }

    const courseData = JSON.parse(cleanedText.trim());
    return courseData;
  } catch (error) {
    console.error("Error generating course (Google):", error?.message || error);
    // If OpenAI key present, fallback
    if (process.env.OPENAI_API_KEY) {
      try {
        console.log("Falling back to OpenAI for course generation");
        const openaiText = await callOpenAI(prompt, {
          system:
            "You are an expert curriculum designer. Respond with ONLY a JSON object matching the requested schema.",
          max_tokens: 2000,
        });
        let cleanedText = openaiText?.trim() || "";
        if (cleanedText.startsWith("```json"))
          cleanedText = cleanedText.slice(7);
        else if (cleanedText.startsWith("```"))
          cleanedText = cleanedText.slice(3);
        if (cleanedText.endsWith("```")) cleanedText = cleanedText.slice(0, -3);
        const courseData = JSON.parse(cleanedText.trim());
        return courseData;
      } catch (err2) {
        console.error("Error generating course (OpenAI fallback):", err2);
        // Try DeepSeek fallback
        if (process.env.DEEPSEEKAI_API_KEY) {
          try {
            console.log("Falling back to DeepSeek for course generation");
            const deepseekText = await callDeepSeek(prompt, {
              system:
                "You are an expert curriculum designer. Respond with ONLY a JSON object matching the requested schema.",
              max_tokens: 2000,
            });
            let cleanedText = deepseekText?.trim() || "";
            if (cleanedText.startsWith("```json"))
              cleanedText = cleanedText.slice(7);
            else if (cleanedText.startsWith("```"))
              cleanedText = cleanedText.slice(3);
            if (cleanedText.endsWith("```"))
              cleanedText = cleanedText.slice(0, -3);
            const courseData = JSON.parse(cleanedText.trim());
            return courseData;
          } catch (err3) {
            console.error("Error generating course (DeepSeek fallback):", err3);
            throw new Error("Failed to generate course structure");
          }
        }
        throw new Error("Failed to generate course structure");
      }
    }
    // If no OpenAI key, try DeepSeek directly
    if (process.env.DEEPSEEKAI_API_KEY) {
      try {
        console.log("Falling back to DeepSeek for course generation");
        const deepseekText = await callDeepSeek(prompt, {
          system:
            "You are an expert curriculum designer. Respond with ONLY a JSON object matching the requested schema.",
          max_tokens: 2000,
        });
        let cleanedText = deepseekText?.trim() || "";
        if (cleanedText.startsWith("```json"))
          cleanedText = cleanedText.slice(7);
        else if (cleanedText.startsWith("```"))
          cleanedText = cleanedText.slice(3);
        if (cleanedText.endsWith("```")) cleanedText = cleanedText.slice(0, -3);
        const courseData = JSON.parse(cleanedText.trim());
        return courseData;
      } catch (err3) {
        console.error("Error generating course (DeepSeek fallback):", err3);
        throw new Error("Failed to generate course structure");
      }
    }
    throw new Error("Failed to generate course structure");
  }
};

/**
 * Generate detailed lesson content
 */
export const generateLessonContent = async (
  courseTitle,
  moduleTitle,
  lessonTitle
) => {
  const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

  const prompt = `You are an expert educator creating detailed lesson content.

Course: "${courseTitle}"
Module: "${moduleTitle}"
Lesson: "${lessonTitle}"

Create comprehensive lesson content with the following structure:
- 2-3 clear learning objectives
- Structured content blocks including:
  * Headings to organize sections
  * Detailed paragraphs explaining concepts
  * Code examples (only if relevant to the topic) with proper language specification
  * A video search query (one relevant educational video topic)
  * 4-5 multiple choice questions to test understanding, each with 4 options and an explanation for the correct answer

Return ONLY a valid JSON object (no markdown, no explanation) in this exact format:
{
  "title": "${lessonTitle}",
  "objectives": [
    "Understand the fundamental concepts...",
    "Apply techniques to solve..."
  ],
  "content": [
    {
      "type": "heading",
      "text": "Introduction"
    },
    {
      "type": "paragraph",
      "text": "Detailed explanation..."
    },
    {
      "type": "code",
      "language": "python",
      "text": "print('Hello World')"
    },
    {
      "type": "video",
      "query": "Introduction to React Hooks tutorial"
    },
    {
      "type": "mcq",
      "question": "What is the main purpose of...?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 1,
      "explanation": "Option B is correct because..."
    }
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.slice(7);
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.slice(0, -3);
    }

    const lessonData = JSON.parse(cleanedText.trim());
    return lessonData;
  } catch (error) {
    console.error("Error generating lesson (Google):", error?.message || error);
    if (process.env.OPENAI_API_KEY) {
      try {
        console.log("Falling back to OpenAI for lesson generation");
        const openaiText = await callOpenAI(prompt, {
          system:
            "You are an expert educator. Respond with ONLY a JSON object matching the requested schema for lesson content.",
          max_tokens: 2000,
        });
        let cleanedText = openaiText?.trim() || "";
        if (cleanedText.startsWith("```json"))
          cleanedText = cleanedText.slice(7);
        else if (cleanedText.startsWith("```"))
          cleanedText = cleanedText.slice(3);
        if (cleanedText.endsWith("```")) cleanedText = cleanedText.slice(0, -3);
        const lessonData = JSON.parse(cleanedText.trim());
        return lessonData;
      } catch (err2) {
        console.error("Error generating lesson (OpenAI fallback):", err2);
        // Try DeepSeek fallback
        if (process.env.DEEPSEEKAI_API_KEY) {
          try {
            console.log("Falling back to DeepSeek for lesson generation");
            const deepseekText = await callDeepSeek(prompt, {
              system:
                "You are an expert educator. Respond with ONLY a JSON object matching the requested schema for lesson content.",
              max_tokens: 2000,
            });
            let cleanedText = deepseekText?.trim() || "";
            if (cleanedText.startsWith("```json"))
              cleanedText = cleanedText.slice(7);
            else if (cleanedText.startsWith("```"))
              cleanedText = cleanedText.slice(3);
            if (cleanedText.endsWith("```"))
              cleanedText = cleanedText.slice(0, -3);
            const lessonData = JSON.parse(cleanedText.trim());
            return lessonData;
          } catch (err3) {
            console.error("Error generating lesson (DeepSeek fallback):", err3);
            throw new Error("Failed to generate lesson content");
          }
        }
        throw new Error("Failed to generate lesson content");
      }
    }
    // If no OpenAI key, try DeepSeek directly
    if (process.env.DEEPSEEKAI_API_KEY) {
      try {
        console.log("Falling back to DeepSeek for lesson generation");
        const deepseekText = await callDeepSeek(prompt, {
          system:
            "You are an expert educator. Respond with ONLY a JSON object matching the requested schema for lesson content.",
          max_tokens: 2000,
        });
        let cleanedText = deepseekText?.trim() || "";
        if (cleanedText.startsWith("```json"))
          cleanedText = cleanedText.slice(7);
        else if (cleanedText.startsWith("```"))
          cleanedText = cleanedText.slice(3);
        if (cleanedText.endsWith("```")) cleanedText = cleanedText.slice(0, -3);
        const lessonData = JSON.parse(cleanedText.trim());
        return lessonData;
      } catch (err3) {
        console.error("Error generating lesson (DeepSeek fallback):", err3);
        throw new Error("Failed to generate lesson content");
      }
    }
    throw new Error("Failed to generate lesson content");
  }
};

/**
 * Translate text to Hinglish
 */
export const translateToHinglish = async (text) => {
  const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

  const prompt = `Translate the following educational content to Hinglish (Hindi-English mix commonly used in India). Keep technical terms in English but explain concepts using a natural mix of Hindi and English.

Text to translate:
${text}

Provide only the translated text without any additional explanation.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error(
      "Error translating to Hinglish (Google):",
      error?.message || error
    );
    if (process.env.OPENAI_API_KEY) {
      try {
        console.log("Falling back to OpenAI for translation");
        const openaiText = await callOpenAI(prompt, {
          system:
            "You are a translator. Return only the translated text in Hinglish, no explanation.",
          max_tokens: 800,
        });
        return openaiText;
      } catch (err2) {
        console.error("Error translating to Hinglish (OpenAI fallback):", err2);
        throw new Error("Failed to translate content");
      }
    }
    throw new Error("Failed to translate content");
  }
};
