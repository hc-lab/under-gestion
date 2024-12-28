import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Tareo from './Tareo';

const RRHH = () => {
    const [tareos, setTareos] = useState([]);
    const [personal, setPersonal] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPersonal, setSelectedPersonal] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        tipo: 'UNIDAD',
        fecha_inicio: format(new Date(), 'yyyy-MM-dd'),
        fecha_fin: '',
        observaciones: '',
        unidad_trabajo: '',
    });

    useEffect(() => {
        fetchPersonalWithTareos();
    }, []);

    const fetchPersonalWithTareos = async () => {
        try {
            setLoading(true);
            const [personalRes, tareosRes] = await Promise.all([
                axiosInstance.get('personal/'),
                axiosInstance.get('tareos/hoy/')
            ]);

            const personalConTareos = personalRes.data.map(persona => {
                const tareoHoy = tareosRes.data.find(
                    tareo => tareo.personal === persona.id
                ) || null;

                return {
                    ...persona,
                    tareo: tareoHoy
                };
            });

            setPersonal(personalConTareos);
        } catch (error) {
            console.error('Error al cargar datos:', error);
            toast.error('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const handlePersonalClick = (persona) => {
        setSelectedPersonal(persona);
        setFormData({
            tipo: persona.tareo?.tipo || 'UNIDAD',
            fecha_inicio: format(new Date(), 'yyyy-MM-dd'),
            fecha_fin: persona.tareo?.fecha_fin || '',
            observaciones: persona.tareo?.observaciones || '',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                personal: selectedPersonal.id,
                fecha: format(new Date(), 'yyyy-MM-dd'),
                tipo: formData.tipo,
                motivo: formData.observaciones || ''
            };

            console.log('Enviando datos:', data);

            let response;
            if (selectedPersonal.tareo?.id) {
                response = await axiosInstance.put(
                    `tareos/${selectedPersonal.tareo.id}/`, 
                    data
                );
            } else {
                response = await axiosInstance.post('tareos/', data);
            }

            console.log('Respuesta:', response.data);

            toast.success('Tareo actualizado exitosamente');
            setIsModalOpen(false);
            await fetchPersonalWithTareos();
        } catch (error) {
            console.error('Error al actualizar tareo:', error);
            if (error.response?.data) {
                console.error('Detalles del error:', error.response.data);
                const errorMessage = error.response.data.non_field_errors?.[0] || 
                                   error.response.data.error ||
                                   'Error al actualizar el tareo';
                toast.error(errorMessage);
            } else {
                toast.error('Error al actualizar el tareo');
            }
        }
    };

    const filteredPersonal = personal.filter(persona => 
        persona.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        persona.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        persona.cargo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTipoColor = (tipo) => {
        switch (tipo) {
            case 'UNIDAD':
                return 'bg-green-100 text-green-800';
            case 'PERMISO':
                return 'bg-blue-100 text-blue-800';
            case 'FALTA':
                return 'bg-red-100 text-red-800';
            case 'DESCANSO':
                return 'bg-yellow-100 text-yellow-800';
            case 'DIAS_LIBRES':
                return 'bg-purple-100 text-purple-800';
            case 'OTROS':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const calcularResumen = () => {
        const resumen = {
            UNIDAD: 0,
            PERMISO: 0,
            FALTA: 0,
            DESCANSO: 0,
            DIAS_LIBRES: 0,
            OTROS: 0
        };

        personal.forEach(persona => {
            const tipo = persona.tareo?.tipo || 'UNIDAD';
            resumen[tipo] = (resumen[tipo] || 0) + 1;
        });

        return resumen;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                    Control de Asistencia - {format(new Date(), 'dd/MM/yyyy')}
                </h2>
                <p className="mt-2 text-gray-600">
                    Registro y control de asistencia del personal
                </p>
            </div>

            {/* Buscador */}
            <div className="mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Buscar personal..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabla de Personal */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cargo
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Procedencia
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Observaciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPersonal.map(persona => (
                            <tr 
                                key={persona.id}
                                onClick={() => handlePersonalClick(persona)}
                                className="hover:bg-gray-50 cursor-pointer"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {`${persona.nombres} ${persona.apellidos}`}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {persona.cargo}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTipoColor(persona.tareo?.tipo)}`}>
                                        {persona.tareo?.tipo || 'UNIDAD'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {persona.procedencia}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">
                                        {persona.tareo?.observaciones || '-'}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Agregar el resumen después de la tabla */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(calcularResumen()).map(([tipo, cantidad]) => (
                    <div 
                        key={tipo} 
                        className={`p-4 rounded-lg shadow ${getTipoColor(tipo)} flex flex-col items-center justify-center`}
                    >
                        <span className="text-2xl font-bold">{cantidad}</span>
                        <span className="text-sm mt-1">
                            {tipo === 'UNIDAD' && 'En Unidad'}
                            {tipo === 'PERMISO' && 'Permiso'}
                            {tipo === 'FALTA' && 'Falta'}
                            {tipo === 'DESCANSO' && 'Descanso Médico'}
                            {tipo === 'DIAS_LIBRES' && 'Días Libres'}
                            {tipo === 'OTROS' && 'Otros'}
                        </span>
                    </div>
                ))}
            </div>

            {/* Agregar el total */}
            <div className="mt-4 text-right">
                <span className="text-lg font-semibold">
                    Total de Personal: {personal.length}
                </span>
            </div>

            {/* Modal de Edición */}
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
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                        {`${selectedPersonal?.nombres} ${selectedPersonal?.apellidos}`}
                                    </Dialog.Title>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Estado
                                            </label>
                                            <select
                                                value={formData.tipo}
                                                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            >
                                                <option value="UNIDAD">En Unidad</option>
                                                <option value="PERMISO">Permiso</option>
                                                <option value="FALTA">Falta</option>
                                                <option value="DESCANSO">Descanso Médico</option>
                                                <option value="DIAS_LIBRES">Días Libres</option>
                                                <option value="OTROS">Otros</option>
                                            </select>
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
                                                placeholder="Ingrese las observaciones aquí..."
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

            {/* Separador */}
            <div className="border-t border-gray-200 my-8"></div>

            {/* Nuevo componente Tareo */}
            <Tareo />
        </div>
    );
};

export default RRHH; 