import api from '../axiosInstance';
export const createBudget = (data) => api.post('/budget',data);
export const getAllBudgets = () => api.get('/budget');