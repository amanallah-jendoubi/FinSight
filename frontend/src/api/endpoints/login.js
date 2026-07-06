import api from '../axiosInstance';
export const login = (userData) => api.post('/login', userData);
