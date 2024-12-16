import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        console.log('AuthContext - token:', token);
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            try {
                const response = await axiosInstance.get('user/current/');
                if (response.status === 200) {
                    setUser(response.data);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Error verificando autenticación:', error);
                cleanupAuth();
                toast.error('Error de autenticación');
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const cleanupAuth = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        delete axiosInstance.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
    };

    const login = async (credentials) => {
        try {
            console.log('Intentando login con:', credentials);
            const response = await axiosInstance.post('token/', {
                username: credentials.username,
                password: credentials.password
            });
            
            console.log('Respuesta del servidor:', response.data);

            if (response.data.access) {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                setUser({ username: credentials.username });
                setIsAuthenticated(true);
                toast.success('Inicio de sesión exitoso');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error detallado:', error);
            console.error('Respuesta del servidor:', error.response?.data);
            
            const errorMessage = error.response?.data?.detail || 
                               error.response?.data?.message || 
                               'Error al iniciar sesión';
            
            toast.error(errorMessage);
            return false;
        }
    };

    const logout = () => {
        cleanupAuth();
        toast.success('Sesión cerrada');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            login,
            logout,
            checkAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export default AuthContext;