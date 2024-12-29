import React, { useEffect, useState } from 'react';
import { 
    ChartBarIcon, 
    CubeIcon, 
    ExclamationTriangleIcon,
    ClockIcon,
    UsersIcon
} from '@heroicons/react/24/outline';
import axiosInstance from '../../axiosInstance';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import ActivityList from './ActivityList';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProductos: 0,
        enStock: 0,
        alertas: 0,
        movimientosHoy: 0,
        totalPersonal: 0,
        personalActivo: 0
    });
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Resumen General'
            }
        },
        scales: {
            r: {
                beginAtZero: true,
                ticks: {
                    backdropColor: 'rgba(255, 255, 255, 0.8)',
                    font: {
                        size: 10
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                pointLabels: {
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                },
                angleLines: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        }
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, movimientosRes, personalRes] = await Promise.all([
                    axiosInstance.get('/dashboard-data/'),
                    axiosInstance.get('/historial-producto/'),
                    axiosInstance.get('/personal/')
                ]);

                // Calcular métricas adicionales
                const totalMovimientos = movimientosRes.data.length;
                const movimientosHoy = movimientosRes.data.filter(mov => 
                    new Date(mov.fecha).toDateString() === new Date().toDateString()
                ).length;

                const personalActivo = personalRes.data.filter(p => p.activo).length;
                const totalPersonal = personalRes.data.length;

                // Actualizar estadísticas
                const statsData = {
                    ...statsRes.data,
                    totalPersonal,
                    personalActivo
                };
                setStats(statsData);

                // Configurar datos para el gráfico radar
                setChartData({
                    labels: [
                        'Personal Activo',
                        'Productos en Stock',
                        'Movimientos del Día',
                        'Productos Totales',
                        'Alertas de Stock',
                        'Eficiencia de Inventario'
                    ],
                    datasets: [
                        {
                            label: 'Métricas Actuales',
                            data: [
                                (personalActivo / totalPersonal) * 100,
                                (statsData.enStock / statsData.totalProductos) * 100,
                                (movimientosHoy / totalMovimientos) * 100,
                                statsData.totalProductos,
                                statsData.alertas,
                                95 // Ejemplo de eficiencia
                            ],
                            backgroundColor: 'rgba(99, 102, 241, 0.2)',
                            borderColor: 'rgba(99, 102, 241, 0.8)',
                            borderWidth: 2,
                            pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(99, 102, 241, 1)'
                        }
                    ]
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-6">
            {/* Cards de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Card de Personal */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <UsersIcon className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Personal Total</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.totalPersonal}</p>
                        </div>
                    </div>
                </div>

                {/* Resto de cards existentes */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                            <CubeIcon className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Productos</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.totalProductos}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <ChartBarIcon className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">En Stock</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.enStock}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                            <ExclamationTriangleIcon className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Alertas</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.alertas}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <ClockIcon className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Movimientos Hoy</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.movimientosHoy}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gráficos y Actividad Reciente */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Gráfico principal */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4">Resumen General</h2>
                    <div className="h-[400px]">
                        <Radar data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Actividad Reciente */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
                    <ActivityList />
                </div>
            </div>

            {/* Alertas y Productos Críticos */}
            <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-semibold mb-4">Productos en Alerta</h2>
                {/* Lista de productos con stock bajo o alertas */}
            </div>
        </div>
    );
};

export default Dashboard; 