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

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
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
                    display: false,
                    beginAtZero: true
                }
            }
        }
    };

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

                // Contar los diferentes tipos de tareos
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
        if (loading) return <div>Cargando...</div>;

        const mainChartData = {
            labels: ['Personal', 'Stock', 'Actividad', 'Productos', 'Alertas', 'Eficiencia'],
            datasets: [{
                data: [
                    stats.personalEnUnidad,
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
                fill: true
            }]
        };

        return (
            <div className="grid grid-cols-12 gap-6">
                {/* Panel Principal - 9 columnas */}
                <div className="col-span-9 space-y-6">
                    {/* Cards superiores */}
                    <div className="grid grid-cols-4 gap-6">
                        {/* ... tus cards actuales ... */}
                    </div>

                    {/* Grid de Gráficos */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Gráfico Radar */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4">Panel de Control</h3>
                            <div className="h-[300px]">
                                <Radar data={mainChartData} options={chartOptions} />
                            </div>
                        </div>

                        {/* Otros gráficos... */}
                    </div>
                </div>

                {/* Panel Lateral - 3 columnas */}
                <div className="col-span-3">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
                        <ActivityList />
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