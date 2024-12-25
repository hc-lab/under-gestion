import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const RRHH = () => {
    const [tareos, setTareos] = useState([]);
    const [personal, setPersonal] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroTipo, setFiltroTipo] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        personal: '',
        tipo: 'UNIDAD', // Por defecto en unidad
        fecha_inicio: format(new Date(), 'yyyy-MM-dd'),
        fecha_fin: '',
        observaciones: '',
        unidad_trabajo: '',
    });

    useEffect(() => {
        fetchTareos();
        fetchPersonal();
    }, []);

    const fetchPersonal = async () => {
        try {
            const response = await axiosInstance.get('personal/');
            setPersonal(response.data);
        } catch (error) {
            console.error('Error al cargar personal:', error);
            toast.error('Error al cargar lista de personal');
        }
    };

    const fetchTareos = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('tareos/');
            setTareos(response.data);
        } catch (error) {
            console.error('Error al cargar tareos:', error);
            toast.error('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('tareos/', formData);
            toast.success('Tareo registrado exitosamente');
            setIsModalOpen(false);
            fetchTareos(); // Recargar la lista
            // Resetear el formulario
            setFormData({
                personal: '',
                tipo: 'UNIDAD',
                fecha_inicio: format(new Date(), 'yyyy-MM-dd'),
                fecha_fin: '',
                observaciones: '',
                unidad_trabajo: '',
            });
        } catch (error) {
            console.error('Error al registrar tareo:', error);
            toast.error('Error al registrar el tareo');
        }
    };

    const getTareoStatusColor = (estado) => {
        switch (estado) {
            case 'APROBADO':
                return 'bg-green-100 text-green-800';
            case 'RECHAZADO':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Gestión de Personal - Tareo
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Control y seguimiento de asistencia del personal
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                    Registrar Tareo
                </button>
            </div>

            {/* Modal de Registro */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={() => setIsModalOpen(false)}
                >
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
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 mb-4"
                                    >
                                        Registrar Tareo
                                    </Dialog.Title>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Personal
                                            </label>
                                            <select
                                                value={formData.personal}
                                                onChange={(e) => setFormData({...formData, personal: e.target.value})}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            >
                                                <option value="">Seleccione personal</option>
                                                {personal.map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {`${p.nombres} ${p.apellidos}`}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Tipo
                                            </label>
                                            <select
                                                value={formData.tipo}
                                                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            >
                                                <option value="UNIDAD">En Unidad</option>
                                                <option value="PERMISO">Permiso</option>
                                                <option value="DIA_LIBRE">Día Libre</option>
                                                <option value="RENUNCIA">Renuncia</option>
                                                <option value="FALTA">Falta</option>
                                                <option value="DESCANSO_MEDICO">Descanso Médico</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Fecha Inicio
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.fecha_inicio}
                                                onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Fecha Fin (opcional)
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.fecha_fin}
                                                onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Unidad de Trabajo
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.unidad_trabajo}
                                                onChange={(e) => setFormData({...formData, unidad_trabajo: e.target.value})}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Observaciones
                                            </label>
                                            <textarea
                                                value={formData.observaciones}
                                                onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                rows="3"
                                            />
                                        </div>

                                        <div className="mt-4 flex justify-end space-x-2">
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                                                onClick={() => setIsModalOpen(false)}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                            >
                                                Guardar
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Filtros */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                    className="input-field"
                >
                    <option value="">Todos los tipos</option>
                    <option value="PERMISO">Permiso</option>
                    <option value="DIA_LIBRE">Día Libre</option>
                    <option value="UNIDAD">En Unidad</option>
                    <option value="RENUNCIA">Renuncia</option>
                    <option value="FALTA">Falta</option>
                    <option value="DESCANSO_MEDICO">Descanso Médico</option>
                </select>

                <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="input-field"
                >
                    <option value="">Todos los estados</option>
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="APROBADO">Aprobado</option>
                    <option value="RECHAZADO">Rechazado</option>
                </select>
            </div>

            {/* Tabla de Tareos */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Personal
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tipo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha Inicio
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha Fin
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Unidad
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tareos
                            .filter(tareo => 
                                (!filtroTipo || tareo.tipo === filtroTipo) &&
                                (!filtroEstado || tareo.estado === filtroEstado)
                            )
                            .map((tareo) => (
                                <tr key={tareo.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {`${tareo.personal.nombres} ${tareo.personal.apellidos}`}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {tareo.tipo}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {format(new Date(tareo.fecha_inicio), 'dd/MM/yyyy', { locale: es })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {tareo.fecha_fin ? 
                                                format(new Date(tareo.fecha_fin), 'dd/MM/yyyy', { locale: es }) : 
                                                '-'
                                            }
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTareoStatusColor(tareo.estado)}`}>
                                            {tareo.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {tareo.unidad_trabajo || '-'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RRHH; 