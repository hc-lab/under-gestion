import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import axios from 'axios';

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
                const response = await axiosInstance.get('/user/current/');
                console.log('Verificando autenticación...', response.data);
                if (response.data && response.data.perfil) {
                    setUser(response.data);
                    setUserRole(response.data.perfil.rol);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Error validando token:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            // Limpiar tokens anteriores
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            
            // Obtener token primero
            const tokenResponse = await axiosInstance.post('/token/', {
                username: credentials.username,
                password: credentials.password
            });

            const { access, refresh } = tokenResponse.data;
            localStorage.setItem('token', access);
            localStorage.setItem('refreshToken', refresh);

            // Configurar el token para futuras peticiones
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;

            try {
                // Intentar verificar el usuario primero
                await axiosInstance.post('/verify-user/', {
                    username: credentials.username
                });

                // Obtener información del usuario
                const userResponse = await axiosInstance.get('/user/current/');
                console.log('Datos del usuario:', userResponse.data);

                if (!userResponse.data) {
                    throw new Error('No se pudo obtener la información del usuario');
                }

                setUser(userResponse.data);
                setUserRole(userResponse.data.perfil?.rol || 'OPERADOR');
                setIsAuthenticated(true);
                return true;
            } catch (error) {
                console.error('Error verificando usuario:', error);
                throw error;
            }
        } catch (error) {
            console.error('Error detallado en login:', error);
            if (error.response) {
                console.error('Datos de la respuesta:', error.response.data);
            }
            throw new Error(error.response?.data?.detail || 'Error en el inicio de sesión');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
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