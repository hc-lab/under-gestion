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
import { Doughnut, Pie } from 'react-chartjs-2';
import ReactSpeedometer from 'react-d3-speedometer';

// Añadir un objeto para mapear los tipos a descripciones más claras
const TIPO_TAREO_LABELS = {
    'T': 'En Unidad',
    'P': 'Permiso',
    'V': 'Vacaciones',
    'D': 'Descanso',
    'F': 'Falta',
    'NR': 'No Registrado'
};

const TIPO_TAREO_COLORS = {
    'T': 'bg-green-50 text-green-700 border-green-200',
    'P': 'bg-blue-50 text-blue-700 border-blue-200',
    'V': 'bg-purple-50 text-purple-700 border-purple-200',
    'D': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'F': 'bg-red-50 text-red-700 border-red-200',
    'NR': 'bg-gray-50 text-gray-700 border-gray-200'
};

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

    const renderMetricsOverview = () => {
        const personalEnUnidad = parseInt(stats.personalEnUnidad) || 0;
        const totalPersonal = parseInt(stats.totalPersonalRegistrado) || 1;
        const percentageActive = Math.round((personalEnUnidad / totalPersonal) * 100);

        // Datos para el gráfico principal con diseño más elegante
        const mainChartData = {
            labels: [
                'Personal\nOperativo',
                'Nivel de\nStock',
                'Actividad\nDiaria',
                'Catálogo\nProductos',
                'Puntos de\nAtención',
                'Eficiencia\nOperativa'
            ],
            datasets: [{
                label: 'Métricas Actuales',
                data: [
                    personalEnUnidad,
                    stats.enStock,
                    stats.movimientosHoy,
                    stats.totalProductos,
                    stats.alertas,
                    95
                ],
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderColor: 'rgba(37, 99, 235, 0.8)',
                borderWidth: 2,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: 'rgba(37, 99, 235, 0.8)',
                pointHoverBackgroundColor: 'rgba(37, 99, 235, 1)',
                pointBorderWidth: 2,
                pointHoverBorderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: true
            }]
        };

        // Opciones mejoradas para el gráfico
        const enhancedChartOptions = {
            ...chartOptions,
            plugins: {
                ...chartOptions.plugins,
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Panel de Control Gerencial',
                    font: {
                        size: 20,
                        weight: 'bold',
                        family: "'Inter', sans-serif"
                    },
                    padding: 25,
                    color: '#1e293b'
                }
            },
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(203, 213, 225, 0.3)',
                        lineWidth: 1
                    },
                    grid: {
                        color: 'rgba(203, 213, 225, 0.3)',
                        circular: true
                    },
                    pointLabels: {
                        font: {
                            size: 12,
                            weight: '600',
                            family: "'Inter', sans-serif"
                        },
                        padding: 20,
                        color: '#475569'
                    },
                    ticks: {
                        display: false
                    },
                    min: 0,
                    max: Math.max(...mainChartData.datasets[0].data) * 1.2
                }
            }
        };

        return (
            <div className="space-y-8">
                {/* Cards superiores con diseño mejorado */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                                        {personalEnUnidad}
                                    </p>
                                    <p className="ml-2 text-sm text-gray-500">
                                        / {totalPersonal}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card de Productos */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
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

                    {/* Card de Alertas */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-red-100 text-red-600">
                                <ExclamationTriangleIcon className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Alertas Activas</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.alertas}</p>
                            </div>
                        </div>
                    </div>

                    {/* Card de Movimientos */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
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

                {/* Panel Principal con nuevo diseño */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Gráfico Radar */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6">
                            <div className="h-[400px] relative">
                                <Radar data={mainChartData} options={enhancedChartOptions} />
                            </div>
                        </div>
                        {/* Leyenda personalizada */}
                        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {mainChartData.labels.map((label, index) => (
                                    <div key={label} className="flex items-center space-x-2">
                                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                                        <span className="text-sm text-gray-600">
                                            {label.replace('\n', ' ')}: {mainChartData.datasets[0].data[index]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Panel de Estadísticas */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Resumen Ejecutivo
                        </h3>
                        <div className="space-y-4">
                            {mainChartData.labels.map((label, index) => (
                                <div key={label} className="flex flex-col">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-600">
                                            {label.replace('\n', ' ')}
                                        </span>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {mainChartData.datasets[0].data[index]}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div
                                            className="bg-blue-600 h-1.5 rounded-full"
                                            style={{
                                                width: `${(mainChartData.datasets[0].data[index] / enhancedChartOptions.scales.r.max) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const today = new Date();
                const year = today.getFullYear();
                const month = today.getMonth() + 1;
                const day = today.getDate();

                const tareoUrl = `/tareos/?fecha__day=${day}&fecha__month=${month}&fecha__year=${year}`;
                
                // Añadir la llamada para obtener datos de productos
                const [personalRes, tareosRes, productosRes] = await Promise.all([
                    axiosInstance.get('/personal/'),
                    axiosInstance.get(tareoUrl),
                    axiosInstance.get('/dashboard-data/') // Endpoint para datos de productos
                ]);

                const totalPersonalRegistrado = personalRes.data.length;
                const tareosDia = tareosRes.data;
                const productosData = productosRes.data;

                // Contar los diferentes tipos de tareos
                const conteoTareos = tareosDia.reduce((acc, tareo) => {
                    acc[tareo.tipo] = (acc[tareo.tipo] || 0) + 1;
                    return acc;
                }, {});

                // Calcular personal no registrado
                const totalRegistradosHoy = Object.values(conteoTareos).reduce((a, b) => a + b, 0);
                const noRegistrados = totalPersonalRegistrado - totalRegistradosHoy;

                // Actualizar el estado con todos los datos
                setStats({
                    ...stats,
                    personalEnUnidad: conteoTareos['T'] || 0,
                    totalPersonalRegistrado,
                    conteoTareos: {
                        ...conteoTareos,
                        'NR': noRegistrados
                    },
                    // Añadir datos de productos
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

    const renderPersonalStats = () => {
        if (loading) {
            return <div className="text-center py-4">Cargando...</div>;
        }

        const todosLosTipos = stats.conteoTareos || {};

    return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {Object.entries(TIPO_TAREO_LABELS).map(([tipo, label]) => (
                    <div 
                        key={tipo}
                        className={`${TIPO_TAREO_COLORS[tipo]} rounded-lg p-4 border shadow-sm`}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">{label}</h3>
                                <p className="text-sm opacity-75">
                                    {tipo === 'NR' ? 'Personal sin registro' : 'Personal registrado'}
                                </p>
                            </div>
                            <div className="text-2xl font-bold">
                                {todosLosTipos[tipo] || 0}
                        </div>
                    </div>
                        <div className="mt-2">
                            <div className="w-full bg-white rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${TIPO_TAREO_COLORS[tipo].replace('bg-', 'bg-').replace('50', '500')}`}
                                    style={{
                                        width: `${((todosLosTipos[tipo] || 0) / stats.totalPersonalRegistrado) * 100}%`
                                    }}
                                />
                        </div>
                    </div>
                </div>
                ))}
                        </div>
        );
    };

    return (
        <div className="space-y-6">
            {renderMetricsOverview()}
            
            {/* Actividad Reciente */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
                <ActivityList />
            </div>
        </div>
    );
};

export default Dashboard; 