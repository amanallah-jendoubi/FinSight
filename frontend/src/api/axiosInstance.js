import axios from 'axios';

let accessToken = null;
export const setAxiosAccessToken = (token) => { accessToken = token; };

const api = axios.create({
  baseURL: 'http://localhost:3500',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// attaching the access token to every outgoing request
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});


//detect access token expiration
api.interceptors.response.use(
  (response) => {
    const gotRefreshedTokenInsteadOfData =
      response.data?.accessToken && response.data?.message === 'Token refreshed successfully';

    if (gotRefreshedTokenInsteadOfData) {
      const originalRequest = response.config;

      if (originalRequest._retry) {
        // already retried once and got a token again — something's wrong server-side, stop here
        return Promise.reject(new Error('Repeated token refresh without data'));
      }
      originalRequest._retry = true;

      setAxiosAccessToken(response.data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

      // Retry the ORIGINAL request now that the token is fresh
      return api(originalRequest);
    }

    return response; // normal response, pass through
  },
  (error) => Promise.reject(error)
);

export default api;

