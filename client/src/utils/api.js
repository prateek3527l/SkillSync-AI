import axios from 'axios';

// Get baseline API URL from environment variable, falling back to local port 5000 if not defined.
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    // Append /api suffix if not already present
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 60000, // 60 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Automatically strip '/api/' prefix if it was included in the request url
    if (config.url && config.url.startsWith('/api/')) {
      config.url = config.url.substring(4);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
