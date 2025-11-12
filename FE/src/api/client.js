import axios from 'axios';
import { getAuthHeaders } from '../hooks/useAuth.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const client = axios.create({
  baseURL: API_BASE_URL
});

client.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    ...getAuthHeaders()
  };
  return config;
});

export default client;
