// Environment Detection
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// API URLs - Usar la URL correcta del backend
export const API_URL = 'https://under-gestion-api.onrender.com';

// API Configuration
export const API_ENDPOINTS = {
    BASE: `${API_URL}/api`,
    AUTH: {
        LOGIN: '/token/',
        REFRESH: '/token/refresh/',
        VERIFY: '/token/verify/',
        CURRENT_USER: '/user/current/'
    },
    USER: {
        CURRENT: '/user/current/'
    },
    PERSONAL: '/personal/',
    TAREOS: '/tareos/',
    PRODUCTOS: '/productos/',
    DASHBOARD: '/dashboard-data/'
};

// App Configuration
export const APP_CONFIG = {
    NAME: 'Under Gestión',
    VERSION: '1.0.0',
    IS_PRODUCTION: isProduction,
    IS_DEVELOPMENT: isDevelopment,
    API_URL: API_URL
};

// Development Logging
if (isDevelopment) {
    console.log('[Config] API URL:', API_URL);
    console.log('[Config] API Endpoints:', API_ENDPOINTS);
}
