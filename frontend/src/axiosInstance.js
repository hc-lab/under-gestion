import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
    }
});

// Interceptor para agregar el token en cada petición
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
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
        console.error('Error en la petición:', error.response || error);
        return Promise.reject(error);
    }
);

export default axiosInstance;