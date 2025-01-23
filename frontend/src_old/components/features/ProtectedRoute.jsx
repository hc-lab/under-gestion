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
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return children;
};

export default ProtectedRoute; 