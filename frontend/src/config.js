// Environment Detection
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// API URLs - Usar la URL correcta del backend
const API_URL = 'https://under-gestion-api.onrender.com';

console.log('API URL:', API_URL); // Debug log

// API Configuration
export const API_ENDPOINTS = {
    BASE: `${API_URL}/api`,
    AUTH: {
        LOGIN: '/api/token/',
        REFRESH: '/api/token/refresh/',
        VERIFY: '/api/token/verify/',
        CURRENT_USER: '/api/user/current/'
    },
    USER: {
        CURRENT: '/api/user/current/'
    },
    PERSONAL: '/api/personal/',
    TAREOS: '/api/tareos/',
    PRODUCTOS: '/api/productos/',
    DASHBOARD: '/api/dashboard-data/'
};

export default API_ENDPOINTS;

// App Configuration
export const APP_CONFIG = {
    NAME: 'Under Gestión',
    VERSION: '1.0.0',
    IS_PRODUCTION: isProduction,
    IS_DEVELOPMENT: isDevelopment,
    API_URL: API_URL
};

// Development Logging
console.log('[Config] API Endpoints:', API_ENDPOINTS); // Debug log
