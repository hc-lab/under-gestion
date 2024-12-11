import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../AuthContext';


const NavContainer = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #222;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

const LeftSection = styled.div`
    flex: 1;
`;

const CenterSection = styled.div`
    flex: 2;
    display: flex;
    justify-content: center;
    gap: 2rem;
`;

const RightSection = styled.div`
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
`;

const NavLink = styled(Link)`
    text-decoration: none;
    color: #e0e0e0;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    &:hover {
        background-color: #333;
        color: #ffffff;
    }
`;

const UserInfo = styled.span`
    margin-right: 1rem;
    color: #e0e0e0;
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

const Navigation = () => {
    const { user, isAuthenticated, logout } = useContext(AuthContext);

    return (
        <NavContainer>
            <LeftSection>
                <NavLink to="/">Blog</NavLink>
            </LeftSection>

            {isAuthenticated && (
                <CenterSection>
                    <NavLink to="/productos">Lista de Productos</NavLink>
                    <NavLink to="/product-chart">Gráfico de Productos</NavLink>
                    <NavLink to="/stock-report">Reporte de Stock</NavLink>
                </CenterSection>
            )}

            <RightSection>
                {isAuthenticated ? (
                    <>
                        <UserInfo>
                            Bienvenido, {user?.first_name || user?.username}
                        </UserInfo>
                        <LogoutButton onClick={logout}>
                            Cerrar Sesión
                        </LogoutButton>
                    </>
                ) : (
                    <NavLink to="/login" style={{ color: '#fff' }}>
                        Iniciar Sesión
                    </NavLink>
                )}
            </RightSection>
        </NavContainer>
    );
};

export default Navigation;
