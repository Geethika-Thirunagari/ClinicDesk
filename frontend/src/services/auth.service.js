import api from '../api/axios';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('auth/login/', credentials);
    const { token, refresh } = response.data;
    // Store real JWT tokens in localStorage
    if (token) localStorage.setItem('token', token);
    if (refresh) localStorage.setItem('refresh_token', refresh);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    return { success: true };
  },

  getCurrentUser: async () => {
    const response = await api.get('auth/me/');
    return response.data;
  },

  refreshToken: async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) throw new Error('No refresh token found');
    const response = await api.post('auth/refresh/', { refresh });
    const { access } = response.data;
    if (access) localStorage.setItem('token', access);
    return access;
  },
};
