import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    useEffect(() => {
        console.log('ProtectedRoute - Ruta actual:', location.pathname);
        console.log('ProtectedRoute - Estado de autenticación:', isAuthenticated);
    }, [location.pathname, isAuthenticated]);

    if (!isAuthenticated) {
        console.log('Redirigiendo a login - No autenticado');
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    console.log('Renderizando ruta protegida:', location.pathname);
    return children;
};

export default ProtectedRoute; 