import api from '../utils/axios';

export const courseService = {
  getCourses: async (params = {}) => {
    const { data } = await api.get('/courses', { params });
    return data;
  },

  getCourse: async (id) => {
    const { data } = await api.get(`/courses/${id}`);
    return data;
  },

  createCourse: async (formData) => {
    const { data } = await api.post('/courses', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  updateCourse: async (id, formData) => {
    const { data } = await api.put(`/courses/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  deleteCourse: async (id) => {
    const { data } = await api.delete(`/courses/${id}`);
    return data;
  },

  addMaterial: async (courseId, formData) => {
    const { data } = await api.post(`/courses/${courseId}/materials`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  getMaterials: async (courseId) => {
    const { data } = await api.get(`/courses/${courseId}/materials`);
    return data;
  },

  assignCourse: async (courseId, traineeIds, dueDate) => {
    const { data } = await api.post(`/courses/${courseId}/assign`, {
      traineeIds,
      dueDate,
    });
    return data;
  },

  getCourseStats: async (courseId) => {
    const { data } = await api.get(`/courses/${courseId}/stats`);
    return data;
  },
};
