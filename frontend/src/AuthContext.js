import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from './axiosInstance';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Asegurarse de que el token esté configurado en axios
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const response = await axiosInstance.get('/api/user/current/');
                if (response.data && response.data.perfil) {
                    setUser(response.data);
                    setUserRole(response.data.perfil.rol);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Error validando token:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                delete axiosInstance.defaults.headers.common['Authorization'];
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            // Primero obtener el token
            const tokenResponse = await axiosInstance.post('/api/token/', credentials);
            const { access, refresh } = tokenResponse.data;
            
            // Guardar tokens
            localStorage.setItem('token', access);
            localStorage.setItem('refreshToken', refresh);
            
            // Configurar el token en axios
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
            
            // Obtener información del usuario
            const userResponse = await axiosInstance.get('/api/user/current/');
            
            if (userResponse.data && userResponse.data.perfil) {
                setUser(userResponse.data);
                setUserRole(userResponse.data.perfil.rol);
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        delete axiosInstance.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
    };

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            userRole,
            login,
            logout,
            isLoading
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