import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'https://ehahiro-backend-3.onrender.com';
export const api = axios.create({
  baseURL: `${apiUrl}/api`,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);