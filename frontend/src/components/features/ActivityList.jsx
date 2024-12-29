import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { HiArrowUp, HiArrowDown } from 'react-icons/hi';

const ActivityList = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axiosInstance.get('/historial-producto/');
                // Tomar solo los últimos 5 movimientos
                const recentActivities = response.data
                    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                    .slice(0, 5);
                setActivities(recentActivities);
            } catch (error) {
                console.error('Error fetching activities:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No hay actividades recientes
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {activities.map((activity) => (
                <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <div className={`mt-1 ${
                        activity.tipo_movimiento === 'Ingreso' 
                            ? 'text-green-500' 
                            : 'text-red-500'
                    }`}>
                        {activity.tipo_movimiento === 'Ingreso' 
                            ? <HiArrowUp className="h-5 w-5" />
                            : <HiArrowDown className="h-5 w-5" />
                        }
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-900">
                            {activity.tipo_movimiento === 'Ingreso' ? 'Ingreso de ' : 'Salida de '}
                            <span className="font-medium">{activity.cantidad} unidades</span>
                            {activity.producto && ` de ${activity.producto.nombre}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {formatDistanceToNow(new Date(activity.fecha), {
                                addSuffix: true,
                                locale: es
                            })}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActivityList;    