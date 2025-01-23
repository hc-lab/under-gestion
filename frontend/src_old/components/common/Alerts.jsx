import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBoxOpen, 
    faExclamationTriangle, 
    faSpinner,
    faWarning,
    faCircleExclamation
} from '@fortawesome/free-solid-svg-icons';

const Alerts = () => {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('productos/');
                setProductos(response.data);
                setError(null);
            } catch (error) {
                console.error('Error al cargar productos:', error);
                setError('Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const criticalStockProducts = productos.filter((producto) => producto.stock <= 1);
    const lowStockProducts = productos.filter(
        (producto) => producto.stock > 1 && producto.stock < 5
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin text-blue-600 text-4xl">
                    <FontAwesomeIcon icon={faSpinner} />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <FontAwesomeIcon icon={faCircleExclamation} className="text-red-500" />
                    </div>
                    <div className="ml-3">
                        <p className="text-red-700">Error: {error}</p>
                    </div>
                </div>
            </div>
        );
    }

    const renderStockCard = (producto, isCritical) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
                isCritical ? 'border-red-500' : 'border-yellow-500'
            } transition-all duration-300 hover:shadow-lg`}
        >
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {producto.nombre}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Categoría: {producto.categoria.nombre}
                        </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isCritical 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        Stock: {producto.stock}
                    </span>
                </div>
                <div className="mt-3 flex items-center text-sm text-gray-500">
                    <span className="inline-block px-2 py-1 rounded bg-gray-100">
                        {producto.unidad_medida}
                    </span>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Sistema de Alertas de Inventario
                </h1>
                <p className="mt-2 text-gray-600">
                    Monitoreo de productos con niveles críticos y bajos de stock
                </p>
            </div>

            <div className="grid gap-8 mb-8">
                {/* Sección de Stock Crítico */}
                <div className="bg-red-50 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                        <FontAwesomeIcon 
                            icon={faWarning} 
                            className="text-2xl text-red-600 mr-3" 
                        />
                        <h2 className="text-xl font-semibold text-red-900">
                            Stock Crítico ({criticalStockProducts.length})
                        </h2>
                    </div>
                    <AnimatePresence>
                        {criticalStockProducts.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {criticalStockProducts.map((producto) => (
                                    <motion.div
                                        key={producto.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {renderStockCard(producto, true)}
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg p-6 text-center text-gray-500">
                                No hay productos con stock crítico
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sección de Stock Bajo */}
                <div className="bg-yellow-50 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                        <FontAwesomeIcon 
                            icon={faBoxOpen} 
                            className="text-2xl text-yellow-600 mr-3" 
                        />
                        <h2 className="text-xl font-semibold text-yellow-900">
                            Stock Bajo ({lowStockProducts.length})
                        </h2>
                    </div>
                    <AnimatePresence>
                        {lowStockProducts.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {lowStockProducts.map((producto) => (
                                    <motion.div
                                        key={producto.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {renderStockCard(producto, false)}
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg p-6 text-center text-gray-500">
                                No hay productos con stock bajo
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Alerts; 