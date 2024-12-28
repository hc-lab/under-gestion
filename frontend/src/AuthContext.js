import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from './axiosInstance';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        // Inicializar el estado de autenticación basado en la existencia del token
        return !!localStorage.getItem('token');
    });
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (!token || !refreshToken) {
                setIsAuthenticated(false);
                setUser(null);
                setUserRole(null);
                setIsLoading(false);
                return;
            }

            // Configurar el token en axios
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            try {
                const response = await axiosInstance.get('/user/current/');
                if (response.data && response.data.perfil) {
                    setUser(response.data);
                    setUserRole(response.data.perfil.rol);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    try {
                        const refreshResponse = await axios.post('http://localhost:8000/api/token/refresh/', {
                            refresh: refreshToken
                        });
                        
                        const newToken = refreshResponse.data.access;
                        localStorage.setItem('token', newToken);
                        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

                        // Reintentar obtener datos del usuario con el nuevo token
                        const userResponse = await axiosInstance.get('/user/current/');
                        if (userResponse.data && userResponse.data.perfil) {
                            setUser(userResponse.data);
                            setUserRole(userResponse.data.perfil.rol);
                            setIsAuthenticated(true);
                        }
                    } catch (refreshError) {
                        console.error('Error refreshing token:', refreshError);
                        handleLogout();
                    }
                } else {
                    console.error('Error checking auth:', error);
                    handleLogout();
                }
            }
        } catch (error) {
            console.error('Error in checkAuth:', error);
            handleLogout();
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        delete axiosInstance.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
    };

    useEffect(() => {
        checkAuth();
        // Agregar un listener para eventos de storage
        const handleStorageChange = (e) => {
            if (e.key === 'token' && !e.newValue) {
                handleLogout();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const login = async (credentials) => {
        try {
            handleLogout(); // Limpiar estado anterior
            
            const tokenResponse = await axiosInstance.post('/token/', {
                username: credentials.username,
                password: credentials.password
            });

            const { access, refresh } = tokenResponse.data;
            
            localStorage.setItem('token', access);
            localStorage.setItem('refreshToken', refresh);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;

            const userResponse = await axiosInstance.get('/user/current/');
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