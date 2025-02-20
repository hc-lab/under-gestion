import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './config';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('access');
    });
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const abortControllerRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        delete axiosInstance.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
    };

    const login = async (credentials) => {
        try {
            handleLogout(); // Limpiar estado anterior

            console.log('Intentando login con:', API_ENDPOINTS.AUTH.LOGIN);

            const tokenResponse = await axiosInstance.post(
                API_ENDPOINTS.AUTH.LOGIN,
                credentials
            );

            console.log('Respuesta de login:', tokenResponse.data);

            const { access, refresh } = tokenResponse.data;

            localStorage.setItem('access', access);
            localStorage.setItem('refresh', refresh);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;

            const userResponse = await axiosInstance.get(API_ENDPOINTS.USER.CURRENT);
            console.log('Respuesta de usuario:', userResponse.data);

            if (!userResponse.data) {
                throw new Error('No se pudo obtener la información del usuario');
            }

            setUser(userResponse.data);
            setUserRole(userResponse.data.perfil?.rol || 'OPERADOR');
            setIsAuthenticated(true);

            return true;
        } catch (error) {
            console.error('Error en login:', error);
            console.error('Detalles del error:', error.response?.data);
            handleLogout();
            throw new Error(error.response?.data?.detail || 'Error en el inicio de sesión');
        }
    };

    const checkAuth = async () => {
        try {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            const token = localStorage.getItem('access');
            if (!token) {
                handleLogout();
                setIsLoading(false);
                return;
            }

            const userResponse = await axiosInstance.get(API_ENDPOINTS.USER.CURRENT);
            if (userResponse.data && userResponse.data.perfil) {
                setUser(userResponse.data);
                setUserRole(userResponse.data.perfil.rol);
                setIsAuthenticated(true);
            }
        } catch (error) {
            if (!axios.isCancel(error)) {
                console.error('Error checking auth:', error);
                handleLogout();
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            userRole,
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