import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Tareo from './Tareo';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, RadialBarChart, RadialBar, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useTareo } from '../../context/TareoContext';

const RRHH = () => {
    const { refreshTareos } = useTareo();
    const [tareos, setTareos] = useState([]);
    const [personal, setPersonal] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPersonal, setSelectedPersonal] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        tipo: 'T',
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
            tipo: persona.tareo?.tipo || 'T',
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
            refreshTareos();
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
            case 'P': return 'Permiso';
            case 'DL': return 'Días Libres';
            case 'DM': return 'Descanso Médico';
            case 'TL': return 'Trabaja en Lima';
            default: return 'No Registrado';
        }
    };

    const getStatusColor = (tipo) => {
        switch (tipo) {
            case 'T': return '#60a5fa';    // azul celeste (En Unidad)
            case 'PS': return '#93c5fd';   // azul celeste claro (Permiso Sin Goce)
            case 'DL': return '#94a3b8';   // gris (Días Libres)
            case 'DM': return '#86efac';   // verde claro (Descanso Médico)
            case 'TL': return '#c4b5fd';   // violeta claro (Trabaja en Lima)
            case 'PC': return '#6ee7b7';   // verde menta (Permiso Con Goce)
            default: return '#e5e7eb';     // gris muy claro (No Registrado)
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

    const calcularResumenPorCargo = () => {
        const resumen = {};
        personal.forEach(persona => {
            const cargo = persona.cargo || 'No Asignado';
            resumen[cargo] = (resumen[cargo] || 0) + 1;
        });
        return Object.entries(resumen).map(([cargo, cantidad]) => ({
            name: cargo,
            value: cantidad,
            cargo: cargo
        }));
    };

    const getCargoColor = (cargo) => {
        const colores = {
            'OPERADOR': '#bfdbfe',      // azul muy suave
            'SUPERVISOR': '#fde68a',    // amarillo suave
            'GERENTE': '#ddd6fe',      // violeta suave
            'ADMINISTRATIVO': '#fbcfe8', // rosa suave
            'TÉCNICO': '#a7f3d0',      // verde menta suave
            'AUXILIAR': '#fecaca',      // rojo suave
            'OTROS': '#e5e7eb'         // gris suave
        };
        return colores[cargo] || '#f3f4f6';
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
                                    Procedencia
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Observaciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPersonal.map((persona, index) => (
                                <tr 
                                    key={persona.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handlePersonalClick(persona)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 hover:text-indigo-600">
                                            {persona.apellidos} {persona.nombres}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{persona.cargo}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{persona.procedencia}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${persona.tareo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {getTipoNombre(persona.tareo?.tipo) || 'No registrado'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {persona.tareo?.observaciones || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Resumen de totales */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="text-sm font-medium text-gray-500">En Unidad</div>
                        <div className="mt-1 text-2xl font-semibold text-blue-600">
                            {personal.filter(p => p.tareo?.tipo === 'T').length}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="text-sm font-medium text-gray-500">Días Libres</div>
                        <div className="mt-1 text-2xl font-semibold text-gray-600">
                            {personal.filter(p => p.tareo?.tipo === 'DL').length}
                        </div>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                        <div className="text-sm font-medium text-gray-500">Permisos</div>
                        <div className="mt-1 text-2xl font-semibold text-indigo-600">
                            {personal.filter(p => p.tareo?.tipo === 'P').length}
                        </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="text-sm font-medium text-gray-500">Faltas</div>
                        <div className="mt-1 text-2xl font-semibold text-red-600">
                            {personal.filter(p => !p.tareo || !p.tareo.tipo).length}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-xl shadow-lg border border-slate-200">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">
                            Distribución por Estado
                        </h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={calcularResumen()}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={true}
                                        label={({
                                            cx,
                                            cy,
                                            midAngle,
                                            innerRadius,
                                            outerRadius,
                                            percent,
                                            value,
                                            name
                                        }) => {
                                            const RADIAN = Math.PI / 180;
                                            const radius = outerRadius * 1.2;
                                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                            const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                            return percent > 0.05 ? (
                                                <text
                                                    x={x}
                                                    y={y}
                                                    fill="#374151"
                                                    textAnchor={x > cx ? 'start' : 'end'}
                                                    dominantBaseline="central"
                                                    className="text-xs font-medium"
                                                >
                                                    {`${name} (${(percent * 100).toFixed(0)}%)`}
                                                </text>
                                            ) : null;
                                        }}
                                        outerRadius={90}
                                        innerRadius={40}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {calcularResumen().map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={getStatusColor(entry.tipo)}
                                                stroke="#ffffff"
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name) => [
                                            `${value} personas (${((value / personal.length) * 100).toFixed(1)}%)`,
                                            name
                                        ]}
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                            border: 'none',
                                            padding: '8px 12px',
                                        }}
                                    />
                                    <Legend
                                        layout="vertical"
                                        align="right"
                                        verticalAlign="middle"
                                        iconType="circle"
                                        formatter={(value) => (
                                            <span style={{
                                                color: '#374151',
                                                fontSize: '12px',
                                                fontWeight: 500
                                            }}>
                                                {value}
                                            </span>
                                        )}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-xl shadow-lg border border-slate-200">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">
                            Distribución por Cargo
                        </h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={calcularResumenPorCargo()}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({
                                            cx,
                                            cy,
                                            midAngle,
                                            innerRadius,
                                            outerRadius,
                                            percent,
                                            value,
                                            name
                                        }) => {
                                            const RADIAN = Math.PI / 180;
                                            const radius = outerRadius * 1.1;
                                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                            const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                            return percent > 0.05 ? (
                                                <text
                                                    x={x}
                                                    y={y}
                                                    fill="#374151"
                                                    textAnchor={x > cx ? 'start' : 'end'}
                                                    dominantBaseline="central"
                                                    className="text-xs font-medium"
                                                >
                                                    {`${name}: ${value}`}
                                                </text>
                                            ) : null;
                                        }}
                                        outerRadius={100}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {calcularResumenPorCargo().map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={[
                                                    '#60a5fa', // azul
                                                    '#34d399', // verde
                                                    '#a78bfa', // violeta
                                                    '#f472b6', // rosa
                                                    '#fbbf24', // amarillo
                                                    '#f87171', // rojo
                                                    '#6ee7b7', // turquesa
                                                ][index % 7]}
                                                stroke="#ffffff"
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name) => [
                                            `${value} personas (${((value / personal.length) * 100).toFixed(1)}%)`,
                                            name
                                        ]}
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                            border: 'none',
                                            padding: '8px 12px',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 my-8"></div>

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">TAREO</h2>
            </div>
            <Tareo />

            {/* Modal para editar estado */}
            <Transition show={isModalOpen} as={Fragment}>
                <Dialog onClose={() => setIsModalOpen(false)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-xl">
                            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                                Registrar Asistencia
                            </Dialog.Title>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Personal
                                    </label>
                                    <p className="text-gray-900 font-medium">
                                        {selectedPersonal?.apellidos} {selectedPersonal?.nombres}
                                    </p>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Estado
                                    </label>
                                    <select
                                        value={formData.tipo}
                                        onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                                        className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="T">En Unidad</option>
                                        <option value="P">Permiso</option>
                                        <option value="DL">Días Libres</option>
                                        <option value="DM">Descanso Médico</option>
                                        <option value="TL">Trabaja en Lima</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Observaciones
                                    </label>
                                    <textarea
                                        value={formData.observaciones}
                                        onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                                        className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        rows="3"
                                        placeholder="Ingrese las observaciones..."
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default RRHH; 