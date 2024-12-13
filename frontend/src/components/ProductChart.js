import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import styled from 'styled-components';

const ChartContainer = styled.div`
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
`;

const Title = styled.h1`
    text-align: center;
    margin-bottom: 2rem;
`;

const ProductChart = () => {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('productos/');
                console.log('Datos recibidos:', response.data);
                setProductos(response.data);
                setError(null);
            } catch (error) {
                console.error('Error al cargar productos:', error);
                setError('Error al cargar los datos');
            }
        };

        fetchData();
    }, []);

    if (error) return <div>Error: {error}</div>;
    if (!productos.length) return <div>Cargando...</div>;

    return (
        <ChartContainer>
            <Title>Gráfico de Productos</Title>
            <BarChart 
                width={800} 
                height={400} 
                data={productos}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stock" fill="#8884d8" name="Stock" />
            </BarChart>
        </ChartContainer>
    );
};

export default ProductChart;
