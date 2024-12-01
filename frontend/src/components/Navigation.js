import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
    background-color: #1a1a1a;
    padding: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
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

const Navigation = () => {
    return (
        <Nav>
            <UnderText>UNDER</UnderText>
            <NavLink to="/">Lista de Productos</NavLink>
            <NavLink to="/graficos">Gráficos de Productos</NavLink>
            <NavLink to="/reporte-stock">Reporte de Stock</NavLink>
        </Nav>
    );
};

export default Navigation;

