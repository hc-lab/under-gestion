// frontend/src/components/Navigations.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../AuthContext';

const Nav = styled.nav`
    background-color: #1a1a1a;
    padding: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
`;

const NavLink = styled(Link)`
    margin: 0 15px;
    text-decoration: none;
    color: #00e5ff;
    font-weight: bold;
    transition: color 0.3s ease, transform 0.3s ease;

    &:hover {
        color: #ff4081;
        transform: scale(1.1);
        text-shadow: 0 0 5px rgba(255, 64, 129, 0.8);
    }
`;

const UnderText = styled.div`
    position: absolute;
    left: 15px;
    color: #fff;
    font-weight: bold;

    &::after {
        content: '◆';
        margin-left: 5px;
        font-size: 0.8em;
    }
`;

const UserInfo = styled.div`
    color: #fff;
    font-size: 0.8em;
    margin-right: 15px;
`;

const LogoutButton = styled.button`
    background-color: #ff4081;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #e91e63;
    }
`;

const Navigation = () => {
    const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <Nav>
            <div>
                <UnderText>UNDER</UnderText>
                <NavLink to="/">Lista de Productos</NavLink>
                <NavLink to="/graficos">Gráficos de Productos</NavLink>
                <NavLink to="/reporte-stock">Reporte de Stock</NavLink>
            </div>
            {isAuthenticated && user ? (
                <div>
                    <UserInfo>Hola, {user?.username || 'Usuario'}</UserInfo>
                    <LogoutButton onClick={handleLogout}>Cerrar Sesión</LogoutButton>
                </div>
            ) : (
                <NavLink to="/login">Iniciar Sesión</NavLink>
            )}
        </Nav>
    );
};

export default Navigation;