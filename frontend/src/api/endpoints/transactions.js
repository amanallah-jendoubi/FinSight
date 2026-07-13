import api from '../axiosInstance';
export const getMonthExpenseByCategory = () => api.get('/transactions/categoriesPercentage');
export const getTopCategories = () => api.get('/transactions/categories/top');
export const getMonthIncome = () => api.get('/transactions/income');
export const getMonthTransactionsCount = () => api.get('/transactions/count');
export const getAllTransactions = () => api.get('/transactions');
export const createTransaction = (accountId, transactionData) => api.post(`/transactions/${accountId}`, transactionData);
export const createTransactions = (accountId, transactionsData) => api.post(`/transactions/batch/${accountId}`, transactionsData);
export const importTransactions = (accountId, transactionData ) => api.post(`/transactions/import/${accountId}`, transactionData);
export const updateTransaction = (transactionId, transactionData) => api.put(`/transactions/${transactionId}`, transactionData);
export const deleteTransaction = (transactionId, transactionType) =>
  api.delete(`/transactions/${transactionId}`, {
    params: { type: transactionType },
  });

