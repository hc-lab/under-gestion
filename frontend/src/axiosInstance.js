import axios from 'axios';
import { API_URL, API_ENDPOINTS, API_HEADERS } from './config';

const axiosInstance = axios.create({
    baseURL: API_ENDPOINTS.BASE,
    headers: API_HEADERS,
    withCredentials: true
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Agregar interceptor para refrescar token
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(
                    `${API_ENDPOINTS.BASE}${API_ENDPOINTS.AUTH.REFRESH}`,
                    { refresh: refreshToken },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        withCredentials: true
                    }
                );

                const { access } = response.data;
                localStorage.setItem('access', access);

                originalRequest.headers['Authorization'] = `Bearer ${access}`;
                return axios(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;