import axios from 'axios';

// Get base URL from environment or fallback to relative path (proxy works in dev)
const baseURL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/` 
  : '/api/';

console.log('🔗 API Base URL:', baseURL);

const api = axios.create({ baseURL });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('fo_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('❌ API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;