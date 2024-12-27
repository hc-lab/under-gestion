import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: false
});

// Interceptor para las peticiones
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Asegurarse de que el origen esté permitido
        config.headers['Origin'] = 'http://localhost:3000';
        return config;
    },
    error => Promise.reject(error)
);

// Interceptor para las respuestas
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;