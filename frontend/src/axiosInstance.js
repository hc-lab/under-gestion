import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://192.168.1.246:8000/api/', 
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
    },
    withCredentials: true  // Importante para CORS
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Agregar interceptores para depuración
axiosInstance.interceptors.request.use(request => {
    console.log('Request:', request);
    return request;
});

axiosInstance.interceptors.response.use(
    response => {
        console.log('Response:', response);
        return response;
    },
    error => {
        console.error('Error:', error.response || error);
        return Promise.reject(error);
    }
);

export default axiosInstance;