// Environment Detection
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// API URLs - Forzar URL correcta
export const API_BASE_URL = 'https://under-gestion.onrender.com';

console.log('API URL:', API_BASE_URL); // Debug log

// API Configuration
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/api/token/`,
        REFRESH: `${API_BASE_URL}/api/token/refresh/`,
        VERIFY: `${API_BASE_URL}/api/token/verify/`,
    },
    USER: {
        CURRENT: `${API_BASE_URL}/api/user/me/`,  // Corregido de users a user
        PROFILE: `${API_BASE_URL}/api/user/profile/`,
    },
    PERSONAL: `${API_BASE_URL}/api/personal/`,  // Verificar si es 'personal' o 'personales'
    TAREOS: `${API_BASE_URL}/api/tareos/`,
    PRODUCTOS: `${API_BASE_URL}/api/productos/`,
    DASHBOARD: `${API_BASE_URL}/api/dashboard-data/`
};

export default API_ENDPOINTS;

// App Configuration
export const APP_CONFIG = {
    NAME: 'Under Gestión',
    VERSION: '1.0.0',
    IS_PRODUCTION: isProduction,
    IS_DEVELOPMENT: isDevelopment,
    API_URL: API_BASE_URL
};

// Development Logging
console.log('[Config] API Endpoints:', API_ENDPOINTS); // Debug log
