import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
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

        // Si el error es 401 y no es un retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                        refresh: refreshToken
                    });

                    const { access } = response.data;
                    localStorage.setItem('token', access);
                    
                    // Actualizar el token en el header
                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;

                    // Reintentar la petición original
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // Si el refresh token también falla, limpiar todo
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;