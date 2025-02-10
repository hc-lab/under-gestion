import axios from 'axios';
import { API_ENDPOINTS } from './config';

const axiosInstance = axios.create({
    baseURL: API_ENDPOINTS.BASE,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
});

// Interceptor para las peticiones
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Interceptor para las respuestas
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(API_ENDPOINTS.AUTH.REFRESH, {
                    refresh: refreshToken
                });

                const { access } = response.data;
                localStorage.setItem('token', access);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                originalRequest.headers.Authorization = `Bearer ${access}`;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;