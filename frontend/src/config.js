// Environment Detection
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// API URLs - Forzar URL correcta
const API_URL = 'https://under-gestion.onrender.com';

console.log('API URL:', API_URL); // Debug log

// API Configuration
export const API_ENDPOINTS = {
    BASE: `${API_URL}/api`,
    AUTH: {
        LOGIN: '/auth/token/',
        REFRESH: '/auth/token/refresh/',
        VERIFY: '/auth/token/verify/',
        CURRENT_USER: '/user/current/'
    },
    PERSONAL: '/personal/',  // Verificar si es 'personal' o 'personales'
    TAREOS: '/tareos/',
    PRODUCTOS: '/productos/',
    DASHBOARD: '/dashboard-data/'
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
