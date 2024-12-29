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
                text: 'Panel de Control Gerencial',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const value = context.raw || 0;
                        const metrics = {
                            'Personal': `${value} personas en unidad (${Math.round((value/stats.totalPersonal)*100)}%)`,
                            'Stock': `${value} productos en stock`,
                            'Movimientos': `${value} movimientos hoy`,
                            'Productos': `${value} productos totales`,
                            'Alertas': `${value} productos en alerta`,
                            'Eficiencia': `${value}%`
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
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                suggestedMin: 0,
                suggestedMax: 100,
                ticks: {
                    stepSize: 20,
                    font: { size: 10 },
                    backdropColor: 'rgba(255, 255, 255, 0.8)'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                pointLabels: {
                    font: { size: 12, weight: 'bold' },
                    callback: function(value) {
                        return value + '\n' + getMetricValue(value);
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
                const [statsRes, movimientosRes, personalRes, tareosRes] = await Promise.all([
                    axiosInstance.get('/dashboard-data/'),
                    axiosInstance.get('/historial-producto/'),
                    axiosInstance.get('/personal/'),
                    axiosInstance.get('/tareos/por_fecha/?fecha=' + new Date().toISOString().split('T')[0])
                ]);

                // Calcular personal en unidad (con estado 'T')
                const personalEnUnidad = tareosRes.data.filter(t => t.tipo === 'T').length;
                const totalPersonal = personalRes.data.length;
                const movimientosHoy = movimientosRes.data.filter(m => 
                    new Date(m.fecha).toDateString() === new Date().toDateString()
                ).length;

                const statsData = {
                    ...statsRes.data,
                    totalPersonal,
                    personalEnUnidad,
                    movimientosHoy
                };
                setStats(statsData);

                // Actualizar datos del gráfico con valores absolutos
                setChartData({
                    labels: [
                        'Personal',
                        'Stock',
                        'Movimientos',
                        'Productos',
                        'Alertas',
                        'Eficiencia'
                    ],
                    datasets: [{
                        label: 'Valores Actuales',
                        data: [
                            personalEnUnidad,           // Valor absoluto de personal
                            statsData.enStock,          // Cantidad en stock
                            movimientosHoy,            // Movimientos del día
                            statsData.totalProductos,   // Total de productos
                            statsData.alertas,         // Número de alertas
                            95                         // Eficiencia
                        ],
                        backgroundColor: 'rgba(53, 162, 235, 0.2)',
                        borderColor: 'rgba(53, 162, 235, 0.7)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(53, 162, 235, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(53, 162, 235, 1)',
                        pointRadius: 4
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
                                    / {stats.totalPersonal} total
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