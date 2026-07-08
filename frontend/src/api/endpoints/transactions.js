import api from '../axiosInstance';
export const getMonthExpenseByCategory = () => api.get('/transactions/categoriesPercentage');
export const getTopCategories = () => api.get('/transactions/categories/top');
export const getMonthIncome = () => api.get('/transactions/income');
export const getMonthTransactionsCount = () => api.get('/transactions/count');
export const getAllTransactions = () => api.get('/transactions');

