import api from '../axiosInstance';
export const signup = (userData) => api.post('/signup', userData);
