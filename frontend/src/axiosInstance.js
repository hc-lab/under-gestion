import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://under-gestion.onrender.com/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const access = localStorage.getItem('access');
        if (access) {
            config.headers['Authorization'] = `Bearer ${access}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;