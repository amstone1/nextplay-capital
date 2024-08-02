import axios from 'axios';

const api = axios.create({
<<<<<<< HEAD
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
=======
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
<<<<<<< HEAD
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
=======
    console.log('Token in interceptor:', token);
    if (token) {
      // Change this line to use 'Authorization' header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('Request config:', config);
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
    return config;
  },
  (error) => {
    console.error('Interceptor error:', error);
    return Promise.reject(error);
  }
);

<<<<<<< HEAD
// Create a separate instance for UTR API calls
const utrApiInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
});

export const utrApi = {
  get: (url) => utrApiInstance.get(`/api/utr${url}`),
  post: (url, data) => utrApiInstance.post(`/api/utr${url}`, data),
  // Add other methods as needed
};

=======
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
export default api;