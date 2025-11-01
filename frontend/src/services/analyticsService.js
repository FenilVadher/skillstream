import api from '../utils/axios';

export const analyticsService = {
  getPerformanceAnalysis: async () => {
    const { data } = await api.get('/analytics/performance');
    return data;
  },

  getRecommendations: async () => {
    const { data } = await api.get('/analytics/recommendations');
    return data;
  },

  getSavedRecommendations: async () => {
    const { data } = await api.get('/analytics/recommendations/saved');
    return data;
  },

  markRecommendationViewed: async (id) => {
    const { data } = await api.put(`/analytics/recommendations/${id}/view`);
    return data;
  },

  acceptRecommendation: async (id) => {
    const { data } = await api.put(`/analytics/recommendations/${id}/accept`);
    return data;
  },

  getEngagementAnalytics: async () => {
    const { data } = await api.get('/analytics/engagement');
    return data;
  },

  getStrugglingTopics: async () => {
    const { data } = await api.get('/analytics/struggling-topics');
    return data;
  },

  getTraineeAnalytics: async (traineeId) => {
    const { data } = await api.get(`/analytics/trainee/${traineeId}`);
    return data;
  },
};
