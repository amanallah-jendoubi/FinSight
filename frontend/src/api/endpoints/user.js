import api from '../axiosInstance';
export const getUserInfo = () => api.get('/user');
export const updateUserInfo = (newPwd) => api.patch('/user',{ newPassword: newPwd });
export const deleteUser = () => api.delete('/user');

