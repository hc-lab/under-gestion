// Environment Detection
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// API URLs
const PROD_API_URL = 'https://under-gestion.onrender.com';
const DEV_API_URL = 'http://localhost:8000';

// Use environment variable if set, otherwise fallback based on environment
const API_URL = process.env.REACT_APP_API_URL || (isProduction ? PROD_API_URL : DEV_API_URL);

console.log('API URL:', API_URL); // Debug log

// API Configuration
export const API_ENDPOINTS = {
    BASE: `${API_URL}/api`,
    AUTH: {
        LOGIN: `${API_URL}/api/auth/token/`,
        REFRESH: `${API_URL}/api/auth/token/refresh/`,
        VERIFY: `${API_URL}/api/auth/token/verify/`,
    },
    USER: {
        CURRENT: `${API_URL}/api/user/current/`,
        PROFILE: `${API_URL}/api/user/current/`,
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
    IS_PRODUCTION: isProduction,
    IS_DEVELOPMENT: isDevelopment,
    API_URL: API_URL
};

// Development Logging
console.log('[Config] API Endpoints:', API_ENDPOINTS); // Debug log
