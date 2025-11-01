import api from '../utils/axios';

export const quizService = {
  getQuizzes: async (params = {}) => {
    const { data } = await api.get('/quizzes', { params });
    return data;
  },

  getQuiz: async (id) => {
    const { data } = await api.get(`/quizzes/${id}`);
    return data;
  },

  createQuiz: async (quizData) => {
    const { data } = await api.post('/quizzes', quizData);
    return data;
  },

  updateQuiz: async (id, quizData) => {
    const { data } = await api.put(`/quizzes/${id}`, quizData);
    return data;
  },

  deleteQuiz: async (id) => {
    const { data } = await api.delete(`/quizzes/${id}`);
    return data;
  },

  addQuestion: async (quizId, questionData) => {
    const { data } = await api.post(`/quizzes/${quizId}/questions`, questionData);
    return data;
  },

  submitQuiz: async (quizId, answers, timeSpent) => {
    const { data } = await api.post(`/quizzes/${quizId}/submit`, {
      answers,
      timeSpent,
    });
    return data;
  },

  getQuizAttempts: async (quizId) => {
    const { data } = await api.get(`/quizzes/${quizId}/attempts`);
    return data;
  },

  getMyAttempts: async () => {
    const { data } = await api.get('/quizzes/my-attempts');
    return data;
  },
};
