import api from '../axiosInstance';
export const getAllAlerts = () => api.get('/alerts');
export const getUnreadAlertsCount = () => api.get('/alerts/unreadAlertsCount');
export const updateAlert = (alertId) => api.patch(`/alerts/${alertId}`);


