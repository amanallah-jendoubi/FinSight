import api from '../axiosInstance';
export const getAllAccountsByUserId = () => api.get('/account');
