import React from 'react';
import styled from 'styled-components';

const InfoContainer = styled.div`
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
`;

const InfoHeader = styled.div`
    text-align: center;
    margin-bottom: 3rem;
`;

const Title = styled.h1`
    color: #333;
    margin-bottom: 1rem;
`;

const Subtitle = styled.p`
    color: #666;
    font-size: 1.2rem;
`;

const InfoContent = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
`;

const BlogCard = styled.div`
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 1.5rem;
    transition: transform 0.2s;

    &:hover {
        transform: translateY(-5px);
    }
`;

const CardTitle = styled.h2`
    color: #333;
    margin-bottom: 1rem;
`;

const CardContent = styled.p`
    color: #666;
    line-height: 1.6;
`;

const Info = () => {
    return (
        <InfoContainer>
            <InfoHeader>
                <Title>Bienvenido al Sistema de Almacén</Title>
                <Subtitle>Gestión eficiente de inventario y recursos</Subtitle>
            </InfoHeader>

            <InfoContent>
                <BlogCard>
                    <CardTitle>Gestión de Productos</CardTitle>
                    <CardContent>
                        Administra tu inventario de manera eficiente.
                        Controla stock, categorías y movimientos de productos.
                    </CardContent>
                </BlogCard>

                <BlogCard>
                    <CardTitle>Reportes y Estadísticas</CardTitle>
                    <CardContent>
                        Visualiza datos importantes sobre tu inventario.
                        Gráficos y reportes detallados para mejor toma de decisiones.
                    </CardContent>
                </BlogCard>

                <BlogCard>
                    <CardTitle>Control de Stock</CardTitle>
                    <CardContent>
                        Mantén un registro detallado de entradas y salidas.
                        Alertas de stock bajo y seguimiento en tiempo real.
                    </CardContent>
                </BlogCard>
            </InfoContent>
        </InfoContainer>
    );
};

export default Info; 