import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #333;
  color: white;
`;


const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #c82333;
  }
`;

const UserName = styled.span`
  font-weight: 500;
`;

const Navigation = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <NavContainer>
            {isAuthenticated && user && (
                <UserInfo>
                    <UserName>
                        {console.log('Renderizando nombre:', user)}
                        Bienvenido, {user?.first_name || user?.username || 'Usuario'}
                    </UserName>
                    <LogoutButton onClick={handleLogout}>
                        Cerrar Sesión
                    </LogoutButton>
                </UserInfo>
            )}
        </NavContainer>
    );
};



export default Navigation;