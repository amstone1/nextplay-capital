import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Interceptor error:', error);
    return Promise.reject(error);
  }
);

// Create a separate instance for UTR API calls
const utrApiInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
});

export const utrApi = {
  get: (url) => utrApiInstance.get(`/api/utr${url}`),
  post: (url, data) => utrApiInstance.post(`/api/utr${url}`, data),
  // Add other methods as needed
};

export default api;