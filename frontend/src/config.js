// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://under-gestion-api.onrender.com';
export const API_ENDPOINTS = {
    BASE: `${API_BASE_URL}/api`,
    AUTH: {
        LOGIN: `${API_BASE_URL}/api/token/`,
        REFRESH: `${API_BASE_URL}/api/token/refresh/`,
        VERIFY: `${API_BASE_URL}/api/token/verify/`,
    },
    NOTICIAS: `${API_BASE_URL}/api/noticias/`,
    PRODUCTOS: `${API_BASE_URL}/api/productos/`,
    PERSONALES: `${API_BASE_URL}/api/personales/`,
    BLASTING: `${API_BASE_URL}/api/blasting/`,
};

// App Configuration
export const APP_CONFIG = {
    NAME: 'Under Gestión',
    VERSION: '1.0.0',
};
