
import axios from 'axios';

const ApiRequest = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

ApiRequest.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
  return config;
});

export default ApiRequest;
