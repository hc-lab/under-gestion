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
        const percentageActive = Math.round((stats.personalEnUnidad / stats.totalPersonalRegistrado) * 100) || 0;
        
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                    {/* Velocímetro de Personal */}
                    <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm relative">
                        <div className="relative h-64">
                            <ReactSpeedometer
                                maxValue={100}
                                value={percentageActive}
                                currentValueText="Personal Activo"
                                customSegmentLabels={[
                                    {
                                        text: 'Bajo',
                                        position: 'INSIDE',
                                        color: '#555',
                                    },
                                    {
                                        text: 'Medio',
                                        position: 'INSIDE',
                                        color: '#555',
                                    },
                                    {
                                        text: 'Alto',
                                        position: 'INSIDE',
                                        color: '#555',
                                    },
                                ]}
                                ringWidth={25}
                                needleHeightRatio={0.7}
                                needleColor="#2563EB"
                                textColor="#1F2937"
                                valueTextFontSize="24px"
                                labelFontSize="14px"
                                segmentColors={[
                                    "#FEE2E2",
                                    "#FEF3C7",
                                    "#DCFCE7"
                                ]}
                            />
                        </div>
                        <div className="text-center mt-4">
                            <div className="flex justify-center items-center space-x-2">
                                <span className="text-3xl font-bold text-blue-600">
                                    {stats.personalEnUnidad}
                                </span>
                                <span className="text-gray-500 text-sm">
                                    de {stats.totalPersonalRegistrado}
                                </span>
                            </div>
                            <div className="mt-2 flex justify-center items-center space-x-4">
                                <div className="flex items-center">
                                    <div className="h-3 w-3 rounded-full bg-green-100 mr-1"></div>
                                    <span className="text-xs text-gray-600">En Unidad</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="h-3 w-3 rounded-full bg-gray-100 mr-1"></div>
                                    <span className="text-xs text-gray-600">Otros</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gráfico de Productos */}
                    <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm">
                        <div className="h-48">
                            <Pie data={productChartData} />
                        </div>
                        <div className="text-center mt-4">
                            <h3 className="text-lg font-semibold text-gray-800">Estado de Inventario</h3>
                            <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                                <div className="text-emerald-600">
                                    <div className="font-semibold">{stats.enStock}</div>
                                    <div className="text-xs">En Stock</div>
                                </div>
                                <div className="text-red-600">
                                    <div className="font-semibold">{stats.alertas}</div>
                                    <div className="text-xs">Alertas</div>
                                </div>
                                <div className="text-gray-600">
                                    <div className="font-semibold">{stats.totalProductos}</div>
                                    <div className="text-xs">Total</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Métricas de Actividad */}
                    <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm">
                        <div className="space-y-4">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Actividad del Día
                                </h3>
                                <div className="text-4xl font-bold text-indigo-600">
                                    {stats.movimientosHoy}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    movimientos registrados
                                </div>
                            </div>
                            <div className="mt-6">
                                <div className="relative pt-1">
                                    <div className="flex mb-2 items-center justify-between">
                                        <div className="text-xs text-gray-600">
                                            Eficiencia del día
                                        </div>
                                        <div className="text-xs font-semibold text-indigo-600">
                                            95%
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-2 text-xs flex rounded bg-indigo-100">
                                        <div 
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                                            style={{ width: '95%' }}
                                        />
                                    </div>
                                </div>
                            </div>
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
                const month = today.getMonth() + 1; // getMonth() devuelve 0-11
                const day = today.getDate();

                // Usar los parámetros de filtro en la URL
                const tareoUrl = `/tareos/por_fecha/?fecha__day=${day}&fecha__month=${month}&fecha__year=${year}`;
                
                const [statsRes, movimientosRes, personalRes, tareosRes] = await Promise.all([
                    axiosInstance.get('/dashboard-data/'),
                    axiosInstance.get('/historial-producto/'),
                    axiosInstance.get('/personal/'),
                    axiosInstance.get(tareoUrl)
                ]);

                // Obtener personal en unidad del día actual
                const tareosDia = tareosRes.data;
                console.log('URL de tareos:', tareoUrl);
                console.log('Tareos del día:', tareosDia);

                // Contar personal en unidad (tipo 'T')
                const personalEnUnidad = tareosDia.reduce((count, tareo) => {
                    return tareo.tipo === 'T' ? count + 1 : count;
                }, 0);

                // Total de personal registrado
                const totalPersonalRegistrado = personalRes.data.length;

                console.log('Personal en unidad:', personalEnUnidad);
                console.log('Total personal registrado:', totalPersonalRegistrado);

                const movimientosHoy = movimientosRes.data.filter(m => {
                    const fechaMov = new Date(m.fecha);
                    return fechaMov.getDate() === day && 
                           fechaMov.getMonth() === month - 1 && 
                           fechaMov.getFullYear() === year;
                }).length;

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
                            personalEnUnidad,  // Ahora debería mostrar el número correcto
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
                {/* Panel Principal */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">
                        Panel de Control
                    </h2>
                    {renderMetricsOverview()}
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