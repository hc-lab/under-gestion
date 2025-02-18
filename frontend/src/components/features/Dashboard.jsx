import React, { useEffect, useState } from 'react';
import { 
    CubeIcon, 
    ClockIcon,
    UsersIcon
} from '@heroicons/react/24/outline';
import axiosInstance from '../../axiosInstance';
import { Line, PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale } from 'chart.js/auto';


ChartJS.register(RadialLinearScale);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProductos: 0,
        enStock: 0,
        movimientosHoy: 0,
        personalEnUnidad: 0,
        totalPersonalRegistrado: 0,
        conteoTareos: {}
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const today = new Date();
                const year = today.getFullYear();
                const month = today.getMonth() + 1;
                const day = today.getDate();

                const tareoUrl = `/tareos/?fecha__day=${day}&fecha__month=${month}&fecha__year=${year}`;
                
                const [personalRes, tareosRes, productosRes] = await Promise.all([
                    axiosInstance.get('/personales/'),
                    axiosInstance.get(tareoUrl),
                    axiosInstance.get('/dashboard-data/')
                ]);

                // Agregamos manejo de errores más específico
                if (!personalRes.data || !tareosRes.data || !productosRes.data) {
                    throw new Error('Error al obtener datos del servidor');
                }

                const totalPersonalRegistrado = personalRes.data.length;
                const tareosDia = tareosRes.data;
                const productosData = productosRes.data;

                const conteoTareos = tareosDia.reduce((acc, tareo) => {
                    acc[tareo.tipo] = (acc[tareo.tipo] || 0) + 1;
                    return acc;
                }, {});

                const personalEnUnidad = conteoTareos['T'] || 0;

                setStats({
                    personalEnUnidad,
                    totalPersonalRegistrado,
                    conteoTareos,
                    enStock: productosData.enStock || 0,
                    totalProductos: productosData.totalProductos || 0,
                    movimientosHoy: productosData.movimientosHoy || 0,
                    alertas: productosData.alertas || 0 // Agregamos manejo de alertas
                });

                setLoading(false);
            } catch (error) {
                console.error('Error al cargar datos del dashboard:', error);
                setLoading(false);
                // Podrías agregar aquí una notificación de error al usuario
            }
        };

        fetchDashboardData();
    }, []);

    const renderDashboard = () => {
        if (loading) return <div className="text-center py-10">Cargando...</div>;

        // Datos modernos para el gráfico de personal
        const personalData = {
            labels: ['En Unidad', 'Permiso', 'Vacaciones', 'Descanso', 'Falta', 'No Registrado'],
            datasets: [{
                label: 'Personal',
                data: [
                    stats.conteoTareos['T'] || 0,
                    stats.conteoTareos['P'] || 0,
                    stats.conteoTareos['V'] || 0,
                    stats.conteoTareos['D'] || 0,
                    stats.conteoTareos['F'] || 0,
                    stats.totalPersonalRegistrado - Object.values(stats.conteoTareos).reduce((a, b) => a + b, 0)
                ],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.5)',   // Azul
                    'rgba(16, 185, 129, 0.5)',    // Verde
                    'rgba(139, 92, 246, 0.5)',    // Púrpura
                    'rgba(245, 158, 11, 0.5)',    // Ámbar
                    'rgba(239, 68, 68, 0.5)',     // Rojo
                    'rgba(107, 114, 128, 0.5)'    // Gris
                ],
                borderWidth: 2,
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(16, 185, 129)',
                    'rgb(139, 92, 246)',
                    'rgb(245, 158, 11)',
                    'rgb(239, 68, 68)',
                    'rgb(107, 114, 128)'
                ]
            }]
        };

        // Datos modernos para el gráfico de productos
        const productData = {
            labels: Array(12).fill('').map((_, i) => `${i + 1}h`),
            datasets: [
                {
                    label: 'Stock',
                    data: Array(12).fill(null).map(() => Math.floor(Math.random() * (stats.enStock))),
                    borderColor: 'rgba(16, 185, 129, 0.8)',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Alertas',
                    data: Array(12).fill(null).map(() => Math.floor(Math.random() * stats.alertas)),
                    borderColor: 'rgba(239, 68, 68, 0.8)',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    fill: true,
                    tension: 0.4
                }
            ]
        };

        return (
            <div className="space-y-6">
                {/* Cards Superiores */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card Personal */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <UsersIcon className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Personal en Unidad</p>
                                <div className="flex items-baseline">
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {stats.personalEnUnidad}
                                    </p>
                                    <p className="ml-2 text-sm text-gray-500">
                                        / {stats.totalPersonalRegistrado}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card Stock */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                                <CubeIcon className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Productos en Stock</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.enStock}</p>
                            </div>
                        </div>
                    </div>



                    {/* Card Movimientos */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                <ClockIcon className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Movimientos Hoy</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.movimientosHoy}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Panel Principal y Actividad Reciente */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Panel Principal */}
                    <div className="col-span-8 grid grid-cols-2 gap-6">
                        {/* Gráfico de Personal Moderno */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Distribución de Personal</h3>
                                <span className="text-sm text-gray-500">Total: {stats.totalPersonalRegistrado}</span>
                            </div>
                            <div className="h-[300px] relative">
                                <PolarArea 
                                    data={personalData}
                                    options={{
                                        maintainAspectRatio: false,
                                        scales: {
                                            r: {
                                                ticks: {
                                                    display: false
                                                },
                                                grid: {
                                                    color: 'rgba(0, 0, 0, 0.05)'
                                                }
                                            }
                                        },
                                        plugins: {
                                            legend: {
                                                position: 'right',
                                                labels: {
                                                    usePointStyle: true,
                                                    padding: 20,
                                                    font: {
                                                        size: 11
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Gráfico de Productos Moderno */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Tendencia de Productos</h3>
                                <div className="flex gap-2">
                                    <span className="inline-flex items-center text-sm text-emerald-600">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span>
                                        Stock
                                    </span>
                                    <span className="inline-flex items-center text-sm text-red-600">
                                        <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                                        Alertas
                                    </span>
                                </div>
                            </div>
                            <div className="h-[300px]">
                                <Line 
                                    data={productData}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: false
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                grid: {
                                                    color: 'rgba(0, 0, 0, 0.05)'
                                                }
                                            },
                                            x: {
                                                grid: {
                                                    display: false
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {renderDashboard()}
        </div>
    );
};

export default Dashboard;