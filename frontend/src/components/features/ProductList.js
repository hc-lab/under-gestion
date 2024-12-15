import React, { useEffect, useState, Fragment, useCallback } from 'react';
import axiosInstance from '../../axiosInstance';
import { Dialog, Transition } from '@headlessui/react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

const ProductList = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategoria, setSelectedCategoria] = useState('');
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [isHistorialOpen, setIsHistorialOpen] = useState(false);
    const [isSalidaOpen, setIsSalidaOpen] = useState(false);
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cantidad, setCantidad] = useState('');
    const [entregadoA, setEntregadoA] = useState('');
    const [motivo, setMotivo] = useState('');
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [productosRes, categoriasRes] = await Promise.all([
                axiosInstance.get('productos/'),
                axiosInstance.get('categorias/')
            ]);
            setProductos(productosRes.data);
            setCategorias(categoriasRes.data);
        } catch (error) {
            console.error('Error en fetchData:', error);
            setError(error.message);
            toast.error('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
            return;
        }
        fetchData();
    }, [navigate, fetchData]);

    const handleProductoClick = async (producto) => {
        setSelectedProducto(producto);
        try {
            const response = await axiosInstance.get(`historial-producto/?producto=${producto.id}`);
            setHistorial(response.data);
            setIsHistorialOpen(true);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al cargar el historial');
        }
    };

    const handleSalidaSubmit = async (e) => {
        e.preventDefault();

        try {
            const cantidadNum = Number(cantidad);

            if (!cantidad || cantidadNum <= 0) {
                toast.error('La cantidad debe ser mayor a 0');
                return;
            }

            if (cantidadNum > selectedProducto?.stock) {
                toast.error('La cantidad no puede ser mayor al stock disponible');
                return;
            }

            if (selectedProducto?.stock - cantidadNum < 0) {
                toast.error('No hay suficiente stock disponible');
                return;
            }

            if (!entregadoA.trim()) {
                toast.error('Debe especificar a quién se entrega el producto');
                return;
            }

            const response = await axiosInstance.post('salidas/', {
                producto: selectedProducto.id,
                cantidad: cantidadNum,
                entregado_a: entregadoA.trim(),
                motivo: motivo.trim() || 'Sin motivo especificado',
                fecha_hora: new Date().toISOString()
            });

            if (response.status === 201) {
                // Limpiar el formulario
                setCantidad('');
                setEntregadoA('');
                setMotivo('');
                setIsSalidaOpen(false);
                toast.success('Salida registrada correctamente');

                // Recargar los datos para asegurar sincronización
                fetchData();
            }
        } catch (error) {
            console.error('Error detallado:', error.response || error);
            toast.error(
                error.response?.data?.error || 
                error.response?.data?.message || 
                'Error al registrar la salida. Por favor, intente nuevamente.'
            );
        }
    };

    const filteredProductos = productos.filter(producto => {
        const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategoria = !selectedCategoria ||
            (producto.categoria?.nombre === selectedCategoria) ||
            (producto.categoria_id && categorias.find(c => c.id === producto.categoria_id)?.nombre === selectedCategoria);
        return matchesSearch && matchesCategoria;
    });

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="page-container">
            <Toaster position="top-right" />
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
                <button
                    onClick={() => navigate('/productos/nuevo')}
                    className="btn-primary flex items-center gap-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    Nuevo Producto
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 input-field"
                        />
                    </div>
                    <div className="w-64">
                        <select
                            value={selectedCategoria}
                            onChange={(e) => setSelectedCategoria(e.target.value)}
                            className="input-field"
                        >
                            <option value="">Todas las categorías</option>
                            {categorias.map(cat => (
                                <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabla de Productos */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Categoría
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProductos.length > 0 ? (
                            filteredProductos.map(producto => (
                                <tr key={producto.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{producto.nombre}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${producto.categoria_id || producto.categoria ?
                                            'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                            }`}>
                                            {(() => {
                                                if (producto.categoria && producto.categoria.nombre) {
                                                    return producto.categoria.nombre;
                                                }
                                                if (producto.categoria_id) {
                                                    const cat = categorias.find(c => c.id === producto.categoria_id);
                                                    return cat ? cat.nombre : 'Sin categoría';
                                                }
                                                return 'Sin categoría';
                                            })()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{producto.stock}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => {
                                                setSelectedProducto(producto);
                                                setIsSalidaOpen(true);
                                            }}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Registrar Salida
                                        </button>
                                        <button
                                            onClick={() => handleProductoClick(producto)}
                                            className="text-gray-600 hover:text-gray-900"
                                        >
                                            Ver Historial
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-gray-500">
                                    No hay productos disponibles.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de Historial */}
            <Transition appear show={isHistorialOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsHistorialOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        Historial de {selectedProducto?.nombre}
                                    </Dialog.Title>

                                    <div className="mt-4 overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entregado a</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {historial.map((entry) => (
                                                    <tr key={entry.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {new Date(entry.fecha).toLocaleString('es-ES', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                hour12: true
                                                            })}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {entry.cantidad}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {entry.entregado_a}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {entry.motivo}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() => setIsHistorialOpen(false)}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Modal de Salida */}
            <Transition appear show={isSalidaOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsSalidaOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        Registrar Salida - {selectedProducto?.nombre}
                                    </Dialog.Title>

                                    <form onSubmit={handleSalidaSubmit} className="mt-4 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Cantidad (Disponible: {selectedProducto?.stock})
                                            </label>
                                            <input
                                                type="number"
                                                value={cantidad}
                                                onChange={(e) => setCantidad(e.target.value)}
                                                max={selectedProducto?.stock}
                                                min="1"
                                                step="1"
                                                onKeyDown={(e) => {
                                                    // Prevenir entrada de números negativos y decimales
                                                    if (e.key === '-' || e.key === '.' || e.key === ',') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                className="input-field"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Entregado a
                                            </label>
                                            <input
                                                type="text"
                                                value={entregadoA}
                                                onChange={(e) => setEntregadoA(e.target.value)}
                                                className="input-field"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Motivo
                                            </label>
                                            <textarea
                                                value={motivo}
                                                onChange={(e) => setMotivo(e.target.value)}
                                                className="input-field"
                                                rows="3"
                                            />
                                        </div>

                                        <div className="flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsSalidaOpen(false)}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                            >
                                                Registrar Salida
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default ProductList;