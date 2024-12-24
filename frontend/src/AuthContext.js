import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from './axiosInstance';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const login = async (credentials) => {
        try {
            const response = await axiosInstance.post('/api/token/', credentials);
            const { access, refresh } = response.data;
            
            localStorage.setItem('token', access);
            localStorage.setItem('refreshToken', refresh);
            
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
            
            console.log('Token guardado:', access); // Para debugging
            setIsAuthenticated(true);
            return true;
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
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            login,
            logout
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