import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './config';

const API_BASE_URL = axiosInstance.defaults.baseURL;

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('token');
    });
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const abortControllerRef = useRef(null);
    const checkAuthTimeoutRef = useRef(null);

    const checkAuth = async () => {
        try {
            // Cancelar petición anterior si existe
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            // Crear nuevo controlador para esta petición
            abortControllerRef.current = new AbortController();

            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (!token || !refreshToken) {
                setIsAuthenticated(false);
                setUser(null);
                setUserRole(null);
                setIsLoading(false);
                return;
            }

            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            try {
                const response = await axiosInstance.get(API_ENDPOINTS.USER.CURRENT, {
                    signal: abortControllerRef.current.signal
                });
                
                if (response.data && response.data.perfil) {
                    setUser(response.data);
                    setUserRole(response.data.perfil.rol);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log('Request canceled');
                    return;
                }

                if (error.response?.status === 401) {
                    try {
                        const refreshResponse = await axios.post(
                            API_ENDPOINTS.AUTH.REFRESH,
                            { refresh: refreshToken },
                            { signal: abortControllerRef.current.signal }
                        );
                        
                        const newToken = refreshResponse.data.access;
                        localStorage.setItem('token', newToken);
                        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

                        const userResponse = await axiosInstance.get(API_ENDPOINTS.USER.CURRENT, {
                            signal: abortControllerRef.current.signal
                        });
                        
                        if (userResponse.data && userResponse.data.perfil) {
                            setUser(userResponse.data);
                            setUserRole(userResponse.data.perfil.rol);
                            setIsAuthenticated(true);
                        }
                    } catch (refreshError) {
                        if (!axios.isCancel(refreshError)) {
                            console.error('Error refreshing token:', refreshError);
                            handleLogout();
                        }
                    }
                } else if (!axios.isCancel(error)) {
                    console.error('Error checking auth:', error);
                    handleLogout();
                }
            }
        } catch (error) {
            if (!axios.isCancel(error)) {
                console.error('Error in checkAuth:', error);
                handleLogout();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const debouncedCheckAuth = useCallback(() => {
        if (checkAuthTimeoutRef.current) {
            clearTimeout(checkAuthTimeoutRef.current);
        }
        checkAuthTimeoutRef.current = setTimeout(checkAuth, 100);
    }, []);

    useEffect(() => {
        debouncedCheckAuth();
        
        const handleStorageChange = (e) => {
            if (e.key === 'token' && !e.newValue) {
                handleLogout();
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (checkAuthTimeoutRef.current) {
                clearTimeout(checkAuthTimeoutRef.current);
            }
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        delete axiosInstance.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
    };

    const login = async (credentials) => {
        try {
            handleLogout();
            
            const tokenResponse = await axios.post(
                API_ENDPOINTS.AUTH.LOGIN,
                credentials,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                }
            );

            const { access, refresh } = tokenResponse.data;
            
            localStorage.setItem('token', access);
            localStorage.setItem('refreshToken', refresh);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;

            const userResponse = await axiosInstance.get(API_ENDPOINTS.USER.CURRENT);
            if (!userResponse.data) {
                throw new Error('No se pudo obtener la información del usuario');
            }

            setUser(userResponse.data);
            setUserRole(userResponse.data.perfil?.rol || 'OPERADOR');
            setIsAuthenticated(true);
            
            return true;
        } catch (error) {
            console.error('Error en login:', error);
            handleLogout();
            throw new Error(error.response?.data?.detail || 'Error en el inicio de sesión');
        }
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