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

    const getStatusColor = (tipo) => {
        switch (tipo) {
            case 'UNIDAD':
                return '#4ade80';
            case 'PERMISO':
                return '#60a5fa';
            case 'FALTA':
                return '#f87171';
            case 'DESCANSO':
                return '#fbbf24';
            case 'DIAS_LIBRES':
                return '#a78bfa';
            default:
                return '#9ca3af';
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
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Control de Asistencia - {format(new Date(), 'dd/MM/yyyy')}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={Object.entries(calcularResumen()).map(([key, value]) => ({
                                        name: key,
                                        value: value
                                    }))}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {Object.entries(calcularResumen()).map(([key], index) => (
                                        <Cell key={`cell-${index}`} fill={getStatusColor(key)} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(calcularResumen()).map(([tipo, cantidad]) => (
                            <div 
                                key={tipo} 
                                className="flex items-center p-3 rounded-lg"
                                style={{ backgroundColor: `${getStatusColor(tipo)}20` }}
                            >
                                <div 
                                    className="w-4 h-4 rounded-full mr-2"
                                    style={{ backgroundColor: getStatusColor(tipo) }}
                                ></div>
                                <div>
                                    <span className="font-medium">{tipo}</span>
                                    <span className="ml-2 text-gray-600">({cantidad})</span>
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