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
        const personalEnUnidad = stats.personalEnUnidad || 0;
        const totalPersonal = stats.totalPersonalRegistrado || 1;
        const percentageActive = Math.round((personalEnUnidad / totalPersonal) * 100);

        // Definir los datos para el gráfico de productos
        const productChartData = {
            labels: ['En Stock', 'Alertas', 'Otros'],
            datasets: [{
                data: [
                    stats.enStock || 0,
                    stats.alertas || 0,
                    (stats.totalProductos || 0) - (stats.enStock || 0) - (stats.alertas || 0)
                ],
                backgroundColor: ['#10B981', '#EF4444', '#E5E7EB'],
                borderWidth: 0
            }]
        };

        // Función para calcular el personal no registrado
        const calcularNoRegistrados = () => {
            const totalTareos = Object.values(stats.conteoTareos || {}).reduce((a, b) => a + b, 0);
            return stats.totalPersonalRegistrado - totalTareos;
        };

        // Combinar los conteos con el personal no registrado
        const todosLosTipos = {
            ...stats.conteoTareos,
            'NR': calcularNoRegistrados()
        };

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                    {/* Velocímetro de Personal */}
                    <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm relative">
                        <div className="relative h-64">
                            <ReactSpeedometer
                                maxValue={100}
                                value={percentageActive}
                                currentValueText={`${personalEnUnidad} de ${totalPersonal}`}
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
                                    }
                                ]}
                                segments={3}
                                ringWidth={25}
                                needleHeightRatio={0.7}
                                needleColor="#2563EB"
                                textColor="#1F2937"
                                valueTextFontSize="20px"
                                labelFontSize="14px"
                                segmentColors={[
                                    "#FEE2E2",
                                    "#FEF3C7",
                                    "#DCFCE7"
                                ]}
                                forceRender={true}
                            />
                        </div>
                        <div className="text-center mt-4">
                            <div className="flex justify-center items-center space-x-2">
                                <span className="text-3xl font-bold text-blue-600">
                                    {personalEnUnidad}
                                </span>
                                <span className="text-gray-500 text-sm">
                                    de {totalPersonal}
                                </span>
                            </div>
                            <div className="mt-4">
                                <h4 className="font-medium text-gray-700 mb-2">Estado del Personal</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {Object.entries(todosLosTipos).map(([tipo, cantidad]) => (
                                        <div key={tipo} 
                                             className={`flex justify-between items-center px-3 py-1 rounded-lg ${
                                                 tipo === 'T' ? 'bg-blue-50 text-blue-700' :
                                                 tipo === 'NR' ? 'bg-red-50 text-red-700' :
                                                 'bg-gray-50 text-gray-700'
                                             }`}
                                        >
                                            <span className="font-medium">
                                                {TIPO_TAREO_LABELS[tipo] || tipo}:
                                            </span>
                                            <span className="font-bold">
                                                {cantidad}
                                            </span>
                                        </div>
                                    ))}
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
            <div className="bg-white rounded-xl shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Estado del Personal - {new Date().toLocaleDateString()}
                    </h2>
                </div>
                {renderPersonalStats()}
            </div>

            {/* ... resto del componente ... */}
        </div>
    );
};

export default Dashboard; 