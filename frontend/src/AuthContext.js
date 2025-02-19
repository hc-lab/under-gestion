import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from './config';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const abortControllerRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
        setUser(null);
    };

    const login = async (credentials) => {
        try {
            // Primero obtener el token
            const tokenResponse = await axios.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
            
            if (!tokenResponse.data.access) {
                throw new Error('Token no recibido');
            }

            const { access, refresh } = tokenResponse.data;
            localStorage.setItem('token', access);
            localStorage.setItem('refreshToken', refresh);

            // Configurar el token para la siguiente petición
            const headers = {
                'Authorization': `Bearer ${access}`,
                'Content-Type': 'application/json'
            };

            // Obtener datos del usuario
            const userResponse = await axios.get(API_ENDPOINTS.USER.CURRENT, { headers });
            
            if (!userResponse.data) {
                throw new Error('No se pudo obtener la información del usuario');
            }

            setUser(userResponse.data);
            setIsAuthenticated(true);
            
            return true;
        } catch (error) {
            console.error('Error en login:', error);
            handleLogout();
            
            // Mensaje de error más específico
            if (error.response?.status === 404) {
                throw new Error('Ruta de API no encontrada');
            } else if (error.response?.status === 401) {
                throw new Error('Credenciales inválidas');
            } else {
                throw new Error(error.response?.data?.detail || 'Error en el inicio de sesión');
            }
        }
    };

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            handleLogout();
            setIsLoading(false);
            return;
        }

        try {
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const userResponse = await axios.get(API_ENDPOINTS.USER.CURRENT, { headers });
            if (userResponse.data) {
                setUser(userResponse.data);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Error verificando autenticación:', error);
            handleLogout();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            login,
            logout: handleLogout,
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