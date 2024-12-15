import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Token ${token}`;
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        checkAuth();
    }, []);

    const cleanupAuth = () => {
        localStorage.removeItem('token');
        delete axiosInstance.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
    };

    const login = async (credentials) => {
        try {
            const response = await axiosInstance.post('login/', credentials);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                axiosInstance.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
                setUser(response.data.user);
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error en login:', error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axiosInstance.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
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