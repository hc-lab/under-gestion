import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verificar token al inicio y después de cada refresh
    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            const userString = localStorage.getItem('user');

            if (token && userString) {
                try {
                    // Configurar el token en axios
                    axiosInstance.defaults.headers.common['Authorization'] = `Token ${token}`;
                    
                    
                    // Si la petición es exitosa, el token es válido
                    const userData = JSON.parse(userString);
                    setIsAuthenticated(true);
                    setUser(userData);
                } catch (error) {
                    // Si hay error, el token no es válido
                    console.error('Error al verificar token:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setIsAuthenticated(false);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        verifyToken();
    }, []);

    const logout = () => {
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Limpiar el header de autorización
        delete axiosInstance.defaults.headers.common['Authorization'];

        // Actualizar el estado
        setIsAuthenticated(false);
        setUser(null);

        // Redirigir al usuario a la página de inicio
        window.location.href = '/';
    };

    if (loading) {
        return <div>Cargando...</div>; // O tu componente de loading
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated,
            user,
            setUser,
            loading,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};