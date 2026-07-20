import api from '../axiosInstance';
export const logout = () => api.post('/logout');
