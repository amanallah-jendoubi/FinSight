import api from '../axiosInstance';
export const createBudget = (data) => api.post('/budget',data);
export const getAllBudgets = () => api.get('/budget');
export const updateBudget = (budgetId,updatedAmount) => api.patch(`/budget/${budgetId}`, updatedAmount);
export const deleteBudget = (budgetId) => api.delete(`/budget/${budgetId}`);