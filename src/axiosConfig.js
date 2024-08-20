import axios from 'axios';
import { API_URL } from './config';
import { decrypt } from './utils/crypto'; 

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const encryptedUserData = localStorage.getItem('userData');
    let token = null;

    if (encryptedUserData) {
      const userData = decrypt(encryptedUserData);
      if (userData && userData.token) {
        token = userData.token;
      }
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;