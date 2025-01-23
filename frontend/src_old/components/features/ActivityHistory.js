import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import styled from 'styled-components';

const Container = styled.div`
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
`;

const Title = styled.h2`
    text-align: center;
    color: #333;
    margin-bottom: 2rem;
`;

const TabContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
`;

const Tab = styled.button`
    padding: 0.5rem 2rem;
    border: none;
    background: ${props => props.$active ? '#007bff' : '#e9ecef'};
    color: ${props => props.$active ? 'white' : '#333'};
    cursor: pointer;
    transition: all 0.3s ease;
    &:first-child {
        border-radius: 4px 0 0 4px;
    }
    &:last-child {
        border-radius: 0 4px 4px 0;
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const Th = styled.th`
    background: #f8f9fa;
    padding: 1rem;
    text-align: left;
    border-bottom: 2px solid #dee2e6;
`;

const Td = styled.td`
    padding: 1rem;
    border-bottom: 1px solid #dee2e6;
    ${props => props.$tipo === 'Ingreso' && `
        color: #28a745;
        font-weight: 500;
    `}
    ${props => props.$tipo === 'Salida' && `
        color: #dc3545;
        font-weight: 500;
    `}
`;

const ActivityHistory = () => {
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'salidas', 'ingresos'
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
    }, [activeTab]);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            let responses = [];
            
            if (activeTab === 'all') {
                const [ingresosRes, salidasRes] = await Promise.all([
                    axiosInstance.get('ingresos-dia/'),
                    axiosInstance.get('historial-producto/')
                ]);
                
                const ingresos = ingresosRes.data.map(ingreso => ({
                    ...ingreso,
                    tipo: 'Ingreso'
                }));
                
                const salidas = salidasRes.data.map(salida => ({
                    ...salida,
                    tipo: 'Salida'
                }));
                
                responses = [...ingresos, ...salidas];
            } else if (activeTab === 'salidas') {
                const response = await axiosInstance.get('historial-producto/');
                responses = response.data.map(salida => ({
                    ...salida,
                    tipo: 'Salida'
                }));
            } else if (activeTab === 'ingresos') {
                const response = await axiosInstance.get('ingresos-dia/');
                responses = response.data.map(ingreso => ({
                    ...ingreso,
                    tipo: 'Ingreso'
                }));
            }

            const sortedActivities = responses.sort((a, b) => 
                new Date(b.fecha) - new Date(a.fecha)
            );
            setActivities(sortedActivities);
        } catch (error) {
            console.error('Error al cargar el historial:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Title>Historial de Actividades</Title>
            
            <TabContainer>
                <Tab 
                    $active={activeTab === 'all'} 
                    onClick={() => setActiveTab('all')}
                >
                    Todos
                </Tab>
                <Tab 
                    $active={activeTab === 'salidas'} 
                    onClick={() => setActiveTab('salidas')}
                >
                    Salidas
                </Tab>
                <Tab 
                    $active={activeTab === 'ingresos'} 
                    onClick={() => setActiveTab('ingresos')}
                >
                    Ingresos
                </Tab>
            </TabContainer>

            {loading ? (
                <div>Cargando...</div>
            ) : (
                <Table>
                    <thead>
                        <tr>
                            <Th>Fecha y Hora</Th>
                            <Th>Tipo</Th>
                            <Th>Producto</Th>
                            <Th>Cantidad</Th>
                            <Th>Usuario</Th>
                            <Th>Detalles</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities.map((activity, index) => (
                            <tr key={index}>
                                <Td>
                                    {new Date(activity.fecha).toLocaleString('es-ES', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}
                                </Td>
                                <Td $tipo={activity.tipo}>{activity.tipo}</Td>
                                <Td>{activity.producto_nombre}</Td>
                                <Td>{activity.cantidad}</Td>
                                <Td>{activity.usuario_nombre}</Td>
                                <Td>
                                    {activity.tipo === 'Salida' ? 
                                        `Entregado a: ${activity.entregado_a || '-'} ${activity.motivo ? `(${activity.motivo})` : ''}` : 
                                        'Ingreso a almacén'}
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default ActivityHistory; 