import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

console.log('API Base URL:', API_BASE_URL);

// Add auth token to requests
export const setAuthToken = (token) => {
  const finalToken = token || localStorage.getItem('token');
  if (finalToken) {
    api.defaults.headers.common['Authorization'] = `Bearer ${finalToken}`;
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

export const updateLesson = async (lessonId, data, token) => {
  setAuthToken(token);
  const response = await api.put(`/api/lessons/${lessonId}`, data);
  return response.data;
};

export const toggleLessonComplete = async (lessonId, token) => {
  setAuthToken(token);
  const response = await api.post(`/api/lessons/${lessonId}/complete`);
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

// Saved Course APIs
export const getSavedCourses = async (token) => {
  setAuthToken(token);
  const response = await api.get('/api/courses/saved');
  return response.data;
};

export const saveCourse = async (courseId, token) => {
  setAuthToken(token);
  const response = await api.post(`/api/courses/${courseId}/save`);
  return response.data;
};

export const unsaveCourse = async (courseId, token) => {
  setAuthToken(token);
  const response = await api.delete(`/api/courses/${courseId}/save`);
  return response.data;
};

export default api;
