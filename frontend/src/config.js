// Environment Configuration
const isDevelopment = process.env.REACT_APP_ENV === 'development';
const API_URL = process.env.REACT_APP_API_URL || (isDevelopment ? 'http://localhost:8000' : 'https://under-gestion-api.onrender.com');

// API Configuration
export const API_ENDPOINTS = {
    BASE: `${API_URL}/api`,
    AUTH: {
        LOGIN: `${API_URL}/api/token/`,
        REFRESH: `${API_URL}/api/token/refresh/`,
        VERIFY: `${API_URL}/api/token/verify/`,
    },
    USER: {
        CURRENT: `${API_URL}/api/user/current/`,
        PROFILE: `${API_URL}/api/user/profile/`,
    },
    NOTICIAS: `${API_URL}/api/noticias/`,
    PRODUCTOS: `${API_URL}/api/productos/`,
    PERSONALES: `${API_URL}/api/personales/`,
    BLASTING: `${API_URL}/api/blasting/`,
};

// App Configuration
export const APP_CONFIG = {
    NAME: 'Under Gestión',
    VERSION: '1.0.0',
    IS_DEVELOPMENT: isDevelopment,
};

// Logging Configuration
export const logConfig = (message) => {
    if (isDevelopment) {
        console.log('[Config]:', message);
    }
};
