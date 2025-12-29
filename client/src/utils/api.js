import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Course APIs
export const generateCourse = async (topic, token) => {
  setAuthToken(token);
  const response = await api.post('/api/courses/generate', { topic });
  return response.data;
};

export const getUserCourses = async (token) => {
  setAuthToken(token);
  const response = await api.get('/api/courses');
  return response.data;
};

export const getCourseById = async (courseId, token) => {
  setAuthToken(token);
  const response = await api.get(`/api/courses/${courseId}`);
  return response.data;
};

export const deleteCourse = async (courseId, token) => {
  setAuthToken(token);
  const response = await api.delete(`/api/courses/${courseId}`);
  return response.data;
};

export const generateLessonContent = async (courseId, moduleId, lessonId, token) => {
  setAuthToken(token);
  const response = await api.post(
    `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/generate`
  );
  return response.data;
};

// Lesson APIs
export const getLessonById = async (lessonId, token) => {
  setAuthToken(token);
  const response = await api.get(`/api/lessons/${lessonId}`);
  return response.data;
};

// Utility APIs
export const searchYouTubeVideos = async (query) => {
  const response = await api.get(`/api/youtube/search`, {
    params: { query, maxResults: 1 }
  });
  return response.data;
};

export const translateToHinglish = async (text) => {
  const response = await api.post('/api/translate/hinglish', { text });
  return response.data;
};

export default api;
