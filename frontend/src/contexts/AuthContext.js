import API_ENDPOINTS from '../config';

// ...existing code...

const checkAuth = async () => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.USER.CURRENT);
        // ...existing code...
    } catch (error) {
        console.error('Error checking auth:', error);
    }
};

const login = async (username, password) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
            username,
            password
        });
        // ...existing code...
    } catch (error) {
        console.error('Error en login:', error);
        // ...existing code...
    }
};

// ...existing code...
