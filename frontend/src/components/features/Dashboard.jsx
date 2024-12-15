import React, { useEffect, useState } from 'react';
import { BoxIcon, StockIcon, AlertIcon } from '../common/Icons';
import StatCard from '../common/StatCard';
import ActivityList from './ActivityList';
import axiosInstance from '../../axiosInstance';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Dashboard = () => {
    const [totalProductos, setTotalProductos] = useState(0);
    const [enStock, setEnStock] = useState(0);
    const [alertas, setAlertas] = useState(0);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [salidaData, setSalidaData] = useState({ fechas: [], cantidades: [] });
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('dashboard-data/');
                setTotalProductos(response.data.totalProductos);
                setEnStock(response.data.enStock);
                setAlertas(response.data.alertas);
                
                // Obtener productos para el buscador
                const productosResponse = await axiosInstance.get('productos/');
                setProductos(productosResponse.data);
                
                // Cargar datos de salida del primer producto por defecto
                if (productosResponse.data.length > 0) {
                    setProductoSeleccionado(productosResponse.data[0].id);
                    await fetchSalidaData(productosResponse.data[0].id);
                }
            } catch (error) {
                console.error('Error al cargar datos del dashboard:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (productoSeleccionado) {
            fetchSalidaData(productoSeleccionado);
        }
    }, [productoSeleccionado]);

    const fetchSalidaData = async (productoId) => {
        try {
            const response = await axiosInstance.get(`salida-producto-data/${productoId}/`);
            setSalidaData(response.data);
        } catch (error) {
            console.error('Error al cargar datos de salida:', error);
        }
    };

    const handleProductoChange = (event) => {
        const id = event.target.value;
        setProductoSeleccionado(id);
        fetchSalidaData(id);
    };

    const data = {
        labels: salidaData.fechas,
        datasets: [
            {
                label: 'Salidas',
                data: salidaData.cantidades,
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    };

    // Modificar la configuración del gráfico
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: 'Fechas'
                },
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true, // Comenzar desde cero
                title: {
                    display: true,
                    text: 'Cantidad'
                },
                ticks: {
                    stepSize: 1, // Incrementos de 1 en 1
                    precision: 0  // Sin decimales
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Historial de Salidas'
            }
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Almacén</h1>
                <button className="btn-primary">Nuevo Producto</button>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Productos"
                    value={totalProductos.toLocaleString()}
                    icon={<BoxIcon />}
                />
                <StatCard 
                    title="En Stock"
                    value={enStock.toLocaleString()}
                    trend="+2.5%"
                    icon={<StockIcon />}
                />
                <StatCard 
                    title="Alertas"
                    value={alertas}
                    status="warning"
                    icon={<AlertIcon />}
                />
            </div>

            {/* Buscador de Productos */}
            <div className="mb-4">
                <label htmlFor="producto-select" className="block text-sm font-medium text-gray-700">Selecciona un Producto:</label>
                <select
                    id="producto-select"
                    value={productoSeleccionado}
                    onChange={handleProductoChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                >
                    {productos.map((producto) => (
                        <option key={producto.id} value={producto.id}>
                            {producto.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {/* Gráfico de Salidas */}
            <div className="bg-white p-4 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4">Salidas del Producto Seleccionado</h2>
                <div className="h-[400px]"> {/* Contenedor con altura fija */}
                    {salidaData.fechas.length > 0 && salidaData.cantidades.length > 0 ? (
                        <Line 
                            data={data} 
                            options={options}
                        />
                    ) : (
                        <p>No hay datos disponibles para mostrar.</p>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <section className="bg-white rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
                <ActivityList />
            </section>
        </div>
    );
};

export default Dashboard; 