import api from '../axiosInstance';
export const getAllAccountsByUserId = () => api.get('/account');
export const createAccount = (data) => api.post('/account',data);
export const deleteAccount = (accountId) => api.delete(`/account/${accountId}`);

