import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Tareo from './Tareo';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

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
            // Primero obtenemos el personal
            const personalRes = await axiosInstance.get('personal/');
            
            let tareos = [];
            try {
                // Intentamos obtener los tareos
                const tareosRes = await axiosInstance.get('tareos/hoy/');
                tareos = tareosRes.data;
            } catch (error) {
                console.warn('No se pudieron cargar los tareos:', error);
                // Continuamos sin los tareos
            }

            // Combinamos la información
            const personalConTareos = personalRes.data.map(persona => ({
                ...persona,
                tareo: tareos.find(t => t.personal === persona.id) || null
            }));

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
                observaciones: formData.observaciones || ''
            };

            let response;
            if (selectedPersonal.tareo?.id) {
                response = await axiosInstance.put(
                    `tareos/${selectedPersonal.tareo.id}/`, 
                    data
                );
            } else {
                response = await axiosInstance.post('tareos/', data);
            }

            toast.success('Tareo actualizado exitosamente');
            setIsModalOpen(false);
            await fetchPersonalWithTareos();
        } catch (error) {
            console.error('Error al actualizar tareo:', error);
            toast.error(error.response?.data?.detail || 'Error al actualizar el tareo');
        }
    };

    const filteredPersonal = personal.filter(persona => 
        persona.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        persona.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        persona.cargo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTipoNombre = (tipo) => {
        switch (tipo) {
            case 'T': return 'En Unidad';
            case 'PS': return 'Permiso Sin Goce';
            case 'DL': return 'Días Libres';
            case 'DM': return 'Descanso Médico';
            case 'TL': return 'Trabaja en Lima';
            case 'PC': return 'Permiso Con Goce';
            default: return 'No Registrado';
        }
    };

    const getStatusColor = (tipo) => {
        switch (tipo) {
            case 'T': return '#4ade80';  // verde
            case 'PS': return '#f87171'; // rojo
            case 'DL': return '#fbbf24'; // amarillo
            case 'DM': return '#60a5fa'; // azul
            case 'TL': return '#a78bfa'; // púrpura
            case 'PC': return '#34d399'; // verde esmeralda
            default: return '#9ca3af';   // gris
        }
    };

    const calcularResumen = () => {
        const resumen = {};
        personal.forEach(persona => {
            const tipo = persona.tareo?.tipo || 'NR';
            resumen[tipo] = (resumen[tipo] || 0) + 1;
        });
        return Object.entries(resumen).map(([tipo, cantidad]) => ({
            name: getTipoNombre(tipo),
            value: cantidad,
            tipo: tipo
        }));
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
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Control de Asistencia - {format(new Date(), 'dd/MM/yyyy')}
                </h2>
                
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar personal..."
                            className="w-full px-4 py-2 border rounded-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-3 text-gray-400" />
                    </div>
                </div>

                <div className="overflow-x-auto mb-8">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    N°
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Apellidos y Nombres
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cargo
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPersonal.map((persona, index) => (
                                <tr 
                                    key={persona.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {persona.apellidos} {persona.nombres}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{persona.cargo}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${persona.tareo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {persona.tareo?.tipo || 'No registrado'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            onClick={() => handlePersonalClick(persona)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-white p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Distribución de Personal</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={calcularResumen()}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({name, value}) => `${value}`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {calcularResumen().map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={getStatusColor(entry.tipo)}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value, name) => [`${value} personas`, name]}
                                />
                                <Legend 
                                    formatter={(value) => <span style={{color: '#374151'}}>{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-start content-start">
                        {calcularResumen().map((item) => (
                            <div 
                                key={item.tipo} 
                                className="flex items-center p-3 rounded-lg bg-gray-50"
                            >
                                <div 
                                    className="w-4 h-4 rounded-full mr-2"
                                    style={{ backgroundColor: getStatusColor(item.tipo) }}
                                ></div>
                                <div>
                                    <span className="font-medium">{item.name}</span>
                                    <span className="ml-2 text-gray-600">({item.value})</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 my-8"></div>

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">TAREO</h2>
            </div>
            <Tareo />
        </div>
    );
};

export default RRHH; 