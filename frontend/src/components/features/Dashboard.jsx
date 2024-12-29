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
                labels: {
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12
                    },
                    color: '#4B5563'
                }
            },
            title: {
                display: true,
                text: 'Panel de Control Gerencial',
                font: {
                    family: "'Inter', sans-serif",
                    size: 16,
                    weight: '600'
                },
                color: '#1F2937',
                padding: 20
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1F2937',
                bodyColor: '#4B5563',
                borderColor: 'rgba(203, 213, 225, 0.5)',
                borderWidth: 1,
                padding: 12,
                bodyFont: {
                    family: "'Inter', sans-serif",
                    size: 12
                },
                callbacks: {
                    label: function(context) {
                        const value = context.raw || 0;
                        const metrics = {
                            'Personal\nOperativo': `${value} de ${stats.totalPersonalRegistrado} personas registradas`,
                            'Nivel de\nStock': `${value} unidades en almacén`,
                            'Actividad\nDiaria': `${value} operaciones realizadas hoy`,
                            'Catálogo\nProductos': `${value} productos registrados`,
                            'Puntos de\nAtención': `${value} productos requieren atención`,
                            'Índice de\nEficiencia': `${value}% de eficiencia operativa`
                        };
                        return metrics[context.label];
                    }
                }
            }
        },
        scales: {
            r: {
                angleLines: {
                    display: true,
                    color: 'rgba(203, 213, 225, 0.3)'
                },
                grid: {
                    color: 'rgba(203, 213, 225, 0.3)'
                },
                pointLabels: {
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12,
                        weight: '500'
                    },
                    color: '#4B5563'
                },
                ticks: {
                    backdropColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#6B7280',
                    font: {
                        size: 10
                    }
                }
            }
        }
    };

    // Función para obtener el valor actual de cada métrica
    const getMetricValue = (label) => {
        const values = {
            'Personal': `${stats.personalEnUnidad}/${stats.totalPersonal}`,
            'Stock': `${stats.enStock}`,
            'Movimientos': `${stats.movimientosHoy}`,
            'Productos': `${stats.totalProductos}`,
            'Alertas': `${stats.alertas}`,
            'Eficiencia': '95%'
        };
        return values[label] || '';
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                const [statsRes, movimientosRes, personalRes, tareosRes] = await Promise.all([
                    axiosInstance.get('/dashboard-data/'),
                    axiosInstance.get('/historial-producto/'),
                    axiosInstance.get('/personal/'),
                    axiosInstance.get(`/tareos/por_fecha/?fecha=${today}`)
                ]);

                // Calcular totales de personal
                const totalPersonalRegistrado = personalRes.data.length;
                
                // Obtener personal en unidad del día actual
                const tareosDia = tareosRes.data;
                console.log('Tareos del día:', tareosDia); // Para debug
                
                // Filtrar solo personal con tipo 'T' (En Unidad)
                const personalEnUnidad = tareosDia.filter(tareo => {
                    console.log('Tareo:', tareo); // Para debug
                    return tareo.tipo === 'T';
                }).length;

                console.log('Personal en unidad:', personalEnUnidad); // Para debug
                console.log('Total personal registrado:', totalPersonalRegistrado); // Para debug

                const movimientosHoy = movimientosRes.data.filter(m => 
                    new Date(m.fecha).toDateString() === new Date().toDateString()
                ).length;

                const statsData = {
                    ...statsRes.data,
                    personalEnUnidad,
                    totalPersonalRegistrado,
                    movimientosHoy
                };
                setStats(statsData);

                // Actualizar datos del gráfico
                setChartData({
                    labels: [
                        'Personal\nOperativo',
                        'Nivel de\nStock',
                        'Actividad\nDiaria',
                        'Catálogo\nProductos',
                        'Puntos de\nAtención',
                        'Índice de\nEficiencia'
                    ],
                    datasets: [{
                        label: 'Métricas Actuales',
                        data: [
                            personalEnUnidad || 0,  // Asegurar que no sea undefined
                            statsData.enStock,
                            movimientosHoy,
                            statsData.totalProductos,
                            statsData.alertas,
                            95
                        ],
                        backgroundColor: 'rgba(147, 197, 253, 0.3)',
                        borderColor: 'rgba(59, 130, 246, 0.8)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
                        pointRadius: 4,
                        fill: true
                    }]
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
                            <p className="text-sm font-medium text-gray-500">Personal en Unidad</p>
                            <div className="flex items-baseline">
                                <p className="text-2xl font-semibold text-gray-900">
                                    {stats.personalEnUnidad}
                                </p>
                                <p className="ml-2 text-sm text-gray-500">
                                    / {stats.totalPersonalRegistrado} registrados
                                </p>
                            </div>
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
                    <h2 className="text-lg font-semibold mb-4">Panel de Control Gerencial</h2>
                    <div className="h-[400px]">
                        <Radar data={chartData} options={chartOptions} />
                    </div>
                    <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center mb-3">
                            <div className="flex-shrink-0">
                                <span className="text-lg font-bold bg-blue-600 text-white px-3 py-1 rounded">
                                    KPIs
                                </span>
                            </div>
                            <div className="ml-3 flex-grow">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Indicadores Clave de Rendimiento
                                </h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                    <span className="font-medium text-sm">Asistencia</span>
                                </div>
                                <p className="mt-1 text-xs text-gray-600 pl-5">
                                    Personal presente en unidad hoy
                                </p>
                            </div>

                            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                    <span className="font-medium text-sm">Ocupación</span>
                                </div>
                                <p className="mt-1 text-xs text-gray-600 pl-5">
                                    Uso actual del almacén
                                </p>
                            </div>

                            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                    <span className="font-medium text-sm">Actividad</span>
                                </div>
                                <p className="mt-1 text-xs text-gray-600 pl-5">
                                    Movimientos registrados hoy
                                </p>
                            </div>

                            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                                    <span className="font-medium text-sm">Inventario</span>
                                </div>
                                <p className="mt-1 text-xs text-gray-600 pl-5">
                                    Disponibilidad de productos
                                </p>
                            </div>

                            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                    <span className="font-medium text-sm">Alertas</span>
                                </div>
                                <p className="mt-1 text-xs text-gray-600 pl-5">
                                    Productos que requieren atención
                                </p>
                            </div>

                            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                                    <span className="font-medium text-sm">Rendimiento</span>
                                </div>
                                <p className="mt-1 text-xs text-gray-600 pl-5">
                                    Eficiencia operativa general
                                </p>
                            </div>
                        </div>
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