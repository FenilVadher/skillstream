import { create } from 'zustand';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      set({
        user: data.data,
        token: data.token,
        isAuthenticated: true,
        loading: false,
      });
      toast.success('Login successful!');
      return data.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  },

  register: async (name, email, password, role = 'trainee') => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      set({
        user: data.data,
        token: data.token,
        isAuthenticated: true,
        loading: false,
      });
      toast.success('Registration successful!');
      return data.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    toast.success('Logged out successfully');
  },

  updateUser: (userData) => {
    const updatedUser = { ...useAuthStore.getState().user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  fetchUser: async () => {
    try {
      const { data } = await api.get('/auth/me');
      localStorage.setItem('user', JSON.stringify(data.data));
      set({ user: data.data });
      return data.data;
    } catch (error) {
      console.error('Fetch user error:', error);
      throw error;
    }
  },
}));

export default useAuthStore;
