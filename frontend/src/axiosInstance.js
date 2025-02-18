import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://under-gestion.onrender.com/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);

export default axiosInstance;