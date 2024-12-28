import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Tareo = () => {
    const [personal, setPersonal] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);
    const [tareos, setTareos] = useState({});

    // Definir los códigos de asistencia con un valor por defecto
    const CODIGOS = {
        'T': { 
            text: 'T', 
            color: 'bg-orange-100 text-orange-800 border border-orange-200', 
            description: 'En Unidad' 
        },
        'PS': { 
            text: 'PS', 
            color: 'bg-blue-100 text-blue-800 border border-blue-200', 
            description: 'Permiso Sin Goce' 
        },
        'PC': { 
            text: 'PC', 
            color: 'bg-green-100 text-green-800 border border-green-200', 
            description: 'Permiso Con Goce' 
        },
        'DL': { 
            text: 'DL', 
            color: 'bg-slate-100 text-slate-800 border border-slate-200', 
            description: 'Días Libres' 
        },
        'DM': { 
            text: 'DM', 
            color: 'bg-amber-100 text-amber-800 border border-amber-200', 
            description: 'Descanso Médico' 
        },
        'TL': { 
            text: 'TL', 
            color: 'bg-slate-100 text-slate-800 border border-slate-200', 
            description: 'Trabaja en Lima' 
        },
        'F': { 
            text: 'F', 
            color: 'bg-red-100 text-red-800 border border-red-200', 
            description: 'Falta' 
        },
        'R': { 
            text: 'R', 
            color: 'bg-purple-100 text-purple-800 border border-purple-200', 
            description: 'Renuncia' 
        },
        'default': {  // Valor por defecto
            text: '-',
            color: 'bg-gray-100 text-gray-800 border border-gray-200',
            description: 'No registrado'
        }
    };

    // Obtener días del mes
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Generar array de días
    const generateDays = () => {
        const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
        return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    };

    useEffect(() => {
        fetchData();
    }, [selectedMonth, selectedYear]);

    const fetchTareos = async (year, month) => {
        try {
            setLoading(true);
            const daysInMonth = getDaysInMonth(year, month);
            const tareosByDay = {};

            // Obtener tareos para cada día del mes
            for (let day = 1; day <= daysInMonth; day++) {
                const fecha = format(new Date(year, month, day), 'yyyy-MM-dd');
                const response = await axiosInstance.get(`/tareos/por_fecha/?fecha=${fecha}`);
                tareosByDay[day] = response.data;
            }

            return tareosByDay;
        } catch (error) {
            console.error('Error fetching tareos:', error);
            return {};
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [personalRes, tareosData] = await Promise.all([
                axiosInstance.get('/personal/'),
                fetchTareos(selectedYear, selectedMonth)
            ]);

            setPersonal(personalRes.data);
            setTareos(tareosData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>;
    }

    const days = generateDays();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Control de Asistencia</h1>
                <div className="flex gap-4 mt-4">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="border rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i}>
                                {format(new Date(2024, i, 1), 'MMMM', { locale: es })}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="border rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {Array.from({ length: 5 }, (_, i) => (
                            <option key={i} value={2024 - i}>
                                {2024 - i}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 border-r">
                                N°
                            </th>
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 border-r">
                                Apellidos y Nombres
                            </th>
                            {days.map(day => (
                                <th key={day} className="px-1 py-1 text-center text-xs font-medium text-gray-500 w-7 border-r last:border-r-0">
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-gray-200">
                        {personal.map((persona, index) => {
                            return (
                                <tr key={persona.id} className="hover:bg-gray-50">
                                    <td className="px-2 py-1 text-gray-500 border-r">
                                        {index + 1}
                                    </td>
                                    <td className="px-2 py-1 border-r">
                                        <div className="truncate max-w-[200px]" title={`${persona.apellidos} ${persona.nombres}`}>
                                            {persona.apellidos} {persona.nombres}
                                        </div>
                                    </td>
                                    {days.map(day => {
                                        const tareo = tareos[day]?.find(t => t.personal === persona.id);
                                        const codigo = tareo?.tipo || 'F';
                                        const codigoInfo = CODIGOS[codigo] || CODIGOS['default'];
                                        
                                        return (
                                            <td key={day} 
                                                className={`px-1 py-1 text-center border-r last:border-r-0 ${codigoInfo.color}`}
                                            >
                                                {codigoInfo.text}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div className="mt-4 p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <div className="grid grid-cols-3 gap-3 text-xs">
                        {Object.entries(CODIGOS).map(([code, { text, color, description }]) => (
                            <div key={code} className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-md font-medium ${color}`}>
                                    {text}
                                </span>
                                <span className="text-gray-600">
                                    {description}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tareo; 