import api from '../utils/axios';

export const gamificationService = {
  getLeaderboard: async (limit = 10) => {
    const { data } = await api.get('/gamification/leaderboard', {
      params: { limit },
    });
    return data;
  },

  getMyStats: async () => {
    const { data } = await api.get('/gamification/me');
    return data;
  },

  getAllBadges: async () => {
    const { data } = await api.get('/gamification/badges');
    return data;
  },

  createBadge: async (badgeData) => {
    const { data } = await api.post('/gamification/badges', badgeData);
    return data;
  },

  getTraineeBadges: async (traineeId) => {
    const { data } = await api.get(`/gamification/trainee/${traineeId}/badges`);
    return data;
  },

  getOverview: async () => {
    const { data } = await api.get('/gamification/overview');
    return data;
  },

  awardPoints: async (traineeId, points, reason) => {
    const { data } = await api.post('/gamification/award-points', {
      traineeId,
      points,
      reason,
    });
    return data;
  },
};
