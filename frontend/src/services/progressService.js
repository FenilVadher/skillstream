import api from '../utils/axios';

export const progressService = {
  getMyProgress: async (courseId = null) => {
    const params = courseId ? { courseId } : {};
    const { data } = await api.get('/progress', { params });
    return data;
  },

  updateProgress: async (materialId, progressData) => {
    const { data } = await api.put(`/progress/material/${materialId}`, progressData);
    return data;
  },

  getCourseProgress: async (courseId) => {
    const { data } = await api.get(`/progress/course/${courseId}`);
    return data;
  },

  getAllProgress: async (params = {}) => {
    const { data } = await api.get('/progress/all', { params });
    return data;
  },
};
