import api from '../utils/axios';

export const adminService = {
  getDashboardStats: async () => {
    const { data } = await api.get('/admin/dashboard');
    return data;
  },

  getTrainees: async () => {
    const { data } = await api.get('/admin/trainees');
    return data;
  },

  getTraineeDetails: async (traineeId) => {
    const { data } = await api.get(`/admin/trainees/${traineeId}`);
    return data;
  },

  toggleTraineeStatus: async (traineeId) => {
    const { data } = await api.put(`/admin/trainees/${traineeId}/toggle-status`);
    return data;
  },

  generateTraineeReport: async (traineeId) => {
    const response = await api.get(`/admin/reports/trainee/${traineeId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  generateBulkReport: async () => {
    const response = await api.get('/admin/reports/bulk', {
      responseType: 'blob',
    });
    return response.data;
  },

  getSystemAnalytics: async (params = {}) => {
    const { data } = await api.get('/admin/analytics', { params });
    return data;
  },
};
