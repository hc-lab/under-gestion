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
            
            // Obtener token
            const tokenResponse = await axios.post('http://localhost:8000/api/token/', credentials, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Origin': 'http://localhost:3000'
                }
            });

            const { access, refresh } = tokenResponse.data;
            localStorage.setItem('token', access);
            localStorage.setItem('refreshToken', refresh);

            // Configurar el token para futuras peticiones
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;

            // Obtener información del usuario
            const userResponse = await axiosInstance.get('/user/current/');

            if (!userResponse.data || !userResponse.data.perfil) {
                throw new Error('Perfil de usuario no encontrado');
            }

            setUser(userResponse.data);
            setUserRole(userResponse.data.perfil.rol);
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