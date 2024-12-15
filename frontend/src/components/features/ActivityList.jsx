import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { HiArrowUp, HiArrowDown } from 'react-icons/hi';

const ActivityList = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatMessage = (activity) => {
        const cantidad = activity.cantidad;
        const producto = activity.producto?.nombre;
        const unidad = activity.producto?.unidad_medida?.toLowerCase() || 'unidades';

        if (activity.tipo_movimiento === 'Ingreso') {
            return `Ingreso de ${cantidad} ${unidad} de ${producto}`;
        } else {
            return `Salida de ${cantidad} ${unidad} de ${producto}`;
        }
    };

    useEffect(() => {
        fetchActivities();
        // Actualizar cada 5 minutos
        const interval = setInterval(fetchActivities, 300000);
        return () => clearInterval(interval);
    }, []);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('historial-producto/');

            // Obtener fecha actual en hora local
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            const allActivities = response.data.map(activity => ({
                ...activity,
                mensaje: formatMessage(activity),
                color: activity.tipo_movimiento === 'Ingreso' ? 'text-emerald-600' : 'text-blue-600',
                bgColor: activity.tipo_movimiento === 'Ingreso' ? 'bg-emerald-50' : 'bg-blue-50',
                fecha: new Date(activity.fecha.replace('Z', ''))  // Remover el UTC
            }))
            .filter(activity => {
                const activityDate = new Date(activity.fecha);
                return activityDate.getDate() === now.getDate() &&
                       activityDate.getMonth() === now.getMonth() &&
                       activityDate.getFullYear() === now.getFullYear();
            })
            .sort((a, b) => b.fecha - a.fecha)
            .slice(0, 5);

            setActivities(allActivities);
        } catch (error) {
            console.error('Error al cargar actividades:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {activities.map((activity, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex items-start p-4 rounded-lg ${activity.bgColor} hover:bg-opacity-75 transition-all duration-200 border border-gray-100 shadow-sm`}
                >
                    <div className={`p-2 rounded-full ${activity.tipo_movimiento === 'Ingreso' ? 'bg-emerald-100' : 'bg-blue-100'} mr-3`}>
                        {activity.tipo_movimiento === 'Ingreso' ? (
                            <HiArrowUp className="w-5 h-5 text-emerald-600" />
                        ) : (
                            <HiArrowDown className="w-5 h-5 text-blue-600" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <p className={`text-base font-semibold truncate ${activity.color}`}>
                                {activity.mensaje}
                            </p>
                            <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                {formatDistanceToNow(activity.fecha, { 
                                    addSuffix: true,
                                    locale: es 
                                })}
                            </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-600 space-y-1">
                            <p className="truncate">
                                <span className="font-medium">Registrado por:</span> {activity.usuario_nombre}
                            </p>
                            {activity.tipo_movimiento === 'Salida' ? (
                                <>
                                    <p className="truncate">
                                        <span className="font-medium">Entregado a:</span> {activity.entregado_a}
                                    </p>
                                    {activity.motivo && (
                                        <p className="truncate">
                                            <span className="font-medium">Motivo:</span> {activity.motivo}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className="truncate">
                                    <span className="font-medium">Tipo:</span> Ingreso al inventario
                                </p>
                            )}
                            <p className="truncate text-gray-400">
                                <span className="font-medium">Fecha:</span>{' '}
                                {activity.fecha.toLocaleString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                })}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
            {activities.length === 0 && (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    No hay movimientos de productos registrados
                </div>
            )}
        </div>
    );
};

export default ActivityList;    