import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');

        if (token && userString) {
            try {
                const userData = JSON.parse(userString);
                console.log('Datos del usuario cargados:', userData); // Para debugging
                setIsAuthenticated(true);
                setUser(userData);
                axios.defaults.headers.common['Authorization'] = `Token ${token}`;
            } catch (error) {
                console.error('Error al cargar datos del usuario:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const logout = () => {
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Limpiar el header de autorización
        delete axios.defaults.headers.common['Authorization'];

        // Actualizar el estado
        setIsAuthenticated(false);
        setUser(null);
    };

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