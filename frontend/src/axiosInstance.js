import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        console.error('Error en la petición:', error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        console.error('Error en la respuesta:', error);
        if (error.response) {
            console.error('Datos del error:', error.response.data);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;