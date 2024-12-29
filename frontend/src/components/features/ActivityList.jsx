import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { HiArrowUp, HiArrowDown } from 'react-icons/hi';

const ActivityList = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatMessage = (activity) => {
        if (!activity) return '';
        
        // Convertir la cantidad a número entero
        const cantidad = Math.round(activity.cantidad) || 0;
        
        // Verificar si tenemos el nombre del producto directamente o a través de la relación
        let productoNombre;
        if (activity.producto_nombre) {
            productoNombre = activity.producto_nombre;
        } else if (activity.producto && activity.producto.nombre) {
            productoNombre = activity.producto.nombre;
        } else {
            console.error('Datos del producto:', activity);
            return `${cantidad} unidades - Error al cargar producto`;
        }

        return `${cantidad} unidades de ${productoNombre}`;
    };

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axiosInstance.get('/historial-producto/');
                console.log('Datos recibidos:', response.data); // Para debug
                
                const recentActivities = response.data
                    .filter(activity => {
                        // Verificar que tengamos los datos necesarios
                        const isValid = activity && 
                                      activity.fecha && 
                                      activity.cantidad && 
                                      (activity.producto_nombre || (activity.producto && activity.producto.nombre));
                        
                        if (!isValid) {
                            console.warn('Actividad inválida:', activity);
                        }
                        return isValid;
                    })
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
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                No hay actividades recientes
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {activities.map((activity, index) => (
                <div
                    key={index}
                    className={`flex items-start p-3 rounded-lg ${
                        activity.tipo_movimiento === 'Ingreso' 
                            ? 'bg-emerald-50 hover:bg-emerald-100' 
                            : 'bg-blue-50 hover:bg-blue-100'
                    } transition-all duration-200 border border-gray-100`}
                >
                    <div className={`p-2 rounded-full ${
                        activity.tipo_movimiento === 'Ingreso' 
                            ? 'bg-emerald-100' 
                            : 'bg-blue-100'
                    } mr-3`}>
                        {activity.tipo_movimiento === 'Ingreso' ? (
                            <HiArrowUp className="w-5 h-5 text-emerald-600" />
                        ) : (
                            <HiArrowDown className="w-5 h-5 text-blue-600" />
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <p className={`text-sm font-medium ${
                                activity.tipo_movimiento === 'Ingreso' 
                                    ? 'text-emerald-700' 
                                    : 'text-blue-700'
                            }`}>
                                {activity.tipo_movimiento === 'Ingreso' ? 'Ingreso de ' : 'Salida de '}
                                {formatMessage(activity)}
                            </p>
                            <span className="text-xs text-gray-500 ml-2">
                                {formatDistanceToNow(new Date(activity.fecha), {
                                    addSuffix: true,
                                    locale: es
                                })}
                            </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-600">
                            {activity.usuario_nombre && (
                                <p>Por: {activity.usuario_nombre}</p>
                            )}
                            {activity.entregado_a && (
                                <p>Entregado a: {activity.entregado_a}</p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActivityList;    