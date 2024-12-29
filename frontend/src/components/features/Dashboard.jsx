import React, { useEffect, useState } from 'react';
import { 
    ChartBarIcon, 
    CubeIcon, 
    ExclamationTriangleIcon,
    ClockIcon,
    UsersIcon
} from '@heroicons/react/24/outline';
import axiosInstance from '../../axiosInstance';
import { Radar, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import ActivityList from './ActivityList';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProductos: 0,
        enStock: 0,
        alertas: 0,
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
                    axiosInstance.get('/personal/'),
                    axiosInstance.get(tareoUrl),
                    axiosInstance.get('/dashboard-data/')
                ]);

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
                    alertas: productosData.alertas || 0,
                    totalProductos: productosData.totalProductos || 0,
                    movimientosHoy: productosData.movimientosHoy || 0
                });

                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const renderDashboard = () => {
        if (loading) return <div className="text-center py-10">Cargando...</div>;

        // Datos para el gráfico de personal
        const personalData = {
            labels: ['En Unidad', 'Otros'],
            datasets: [{
                data: [stats.personalEnUnidad, stats.totalPersonalRegistrado - stats.personalEnUnidad],
                backgroundColor: ['#3B82F6', '#E5E7EB'],
                borderWidth: 0
            }]
        };

        // Datos para el gráfico de productos
        const productData = {
            labels: ['En Stock', 'Alertas', 'Total'],
            datasets: [{
                data: [stats.enStock, stats.alertas, stats.totalProductos],
                backgroundColor: ['#10B981', '#EF4444', '#6366F1'],
                borderWidth: 0
            }]
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

                    {/* Card Alertas */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-red-100 text-red-600">
                                <ExclamationTriangleIcon className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Alertas</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.alertas}</p>
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
                        {/* Gráfico de Personal */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4">Personal</h3>
                            <div className="h-[300px]">
                                <Doughnut 
                                    data={personalData}
                                    options={{
                                        maintainAspectRatio: false,
                                        cutout: '70%',
                                        plugins: {
                                            legend: {
                                                position: 'bottom'
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Gráfico de Productos */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4">Productos</h3>
                            <div className="h-[300px]">
                                <Bar 
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
                                                beginAtZero: true
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actividad Reciente */}
                    <div className="col-span-4">
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="p-4 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Actividad Reciente
                                </h2>
                            </div>
                            <div className="p-4">
                                <ActivityList />
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