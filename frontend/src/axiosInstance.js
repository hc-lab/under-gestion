import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true  // Importante para CORS
});

axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Request config:', config);  // Para debugging
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        console.error('Error en la petición:', error);
        if (error.response) {
            console.error('Respuesta del servidor:', error.response.data);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;