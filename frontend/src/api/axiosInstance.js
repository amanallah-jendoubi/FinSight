import axios from 'axios';
import { Mutex } from "async-mutex";
import { jwtDecode } from 'jwt-decode';


const mutex = new Mutex();
export let accessToken = null;
export const setAxiosAccessToken = (token) => { accessToken = token; };

const api = axios.create({
  baseURL: 'http://localhost:3500',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const logoutApi = axios.create({
  baseURL: 'http://localhost:3500',
  withCredentials: true,
});

export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000 - 10000;
  } catch {
    return true;
  }
}

api.interceptors.request.use(async (config) => {
  if (isTokenExpired(accessToken)) {
    if (mutex.isLocked()) {
      await mutex.waitForUnlock(); 
    } else {
      config._release = await mutex.acquire(); //request becomes the refresh trigger
    }
  }
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }  
  return config;
});



api.interceptors.response.use(
  async (response) => {
    // backend responded with a refreshed token instead of the actual requested data
    if (response.data?.message === 'Token refreshed successfully') {
      accessToken = response.data.accessToken;
      if (response.config._release) {
        response.config._release(); // unlock anyone waiting to proceed with the fresh token
      }

      // resend the original request, now with the real token, to actually get the data
      const retryConfig = { ...response.config };
      retryConfig.headers = { ...retryConfig.headers, Authorization: `Bearer ${accessToken}` };
      delete retryConfig._release;
      return api(retryConfig);
    }
    if (response.config._release) response.config._release();
    return response;
  },
  async (error) => {
    if (error.config?._release) error.config._release(); 
    if (error.response?.status === 403) {
      try { await logoutApi.post('/logout'); } catch {}
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;