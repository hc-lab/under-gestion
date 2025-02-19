import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import API_ENDPOINTS from '../config';

export const AuthContext = createContext(null);

// Crear instancia de axios con configuración base
const axiosInstance = axios.create({
  baseURL: 'https://under-gestion.onrender.com'
});

// Interceptor para manejar el token en todas las peticiones
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get(API_ENDPOINTS.USER.CURRENT);
      setUser(response.data);
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      // Si hay un error de autenticación, limpiar el token
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
        username,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem('token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Obtener información del usuario después de login exitoso
      await checkAuth();
      
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      if (error.response?.data) {
        console.error('Detalles del error:', error.response.data);
      }
      throw new Error(error.response?.data?.detail || 'Error al iniciar sesión');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};