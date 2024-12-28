import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Tareo = () => {
    const [personal, setPersonal] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);

    // Códigos de asistencia y sus colores
    const CODIGOS = {
        'T': { text: 'T', color: 'bg-green-100', description: 'En Unidad' },
        'PS': { text: 'PS', color: 'bg-red-100', description: 'Permiso Sin Goce' },
        'DL': { text: 'DL', color: 'bg-yellow-100', description: 'Días Libres' },
        'DM': { text: 'DM', color: 'bg-orange-100', description: 'Descanso Médico' },
        'TL': { text: 'TL', color: 'bg-blue-100', description: 'Trabaja en Lima' },
        'PC': { text: 'PC', color: 'bg-purple-100', description: 'Permiso Con Goce' }
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

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/personal/');
            setPersonal(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calcular totales por persona
    const calculateTotals = (asistencias) => {
        return Object.keys(CODIGOS).reduce((acc, code) => {
            acc[code] = asistencias.filter(a => a === code).length;
            return acc;
        }, {});
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
                        className="border rounded-md px-3 py-2"
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
                        className="border rounded-md px-3 py-2"
                    >
                        {Array.from({ length: 5 }, (_, i) => (
                            <option key={i} value={2024 - i}>
                                {2024 - i}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="border border-gray-200 px-4 py-2 text-left">N°</th>
                            <th className="border border-gray-200 px-4 py-2 text-left">Apellidos y Nombres</th>
                            {days.map(day => (
                                <th key={day} className="border border-gray-200 px-2 py-2 text-center w-10">
                                    {day}
                                </th>
                            ))}
                            {Object.keys(CODIGOS).map(code => (
                                <th key={code} className="border border-gray-200 px-2 py-2 text-center">
                                    {code}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {personal.map((persona, index) => {
                            // Simulación de asistencias (aquí deberías usar datos reales)
                            const asistencias = days.map(() => 
                                Object.keys(CODIGOS)[Math.floor(Math.random() * Object.keys(CODIGOS).length)]
                            );
                            const totales = calculateTotals(asistencias);

                            return (
                                <tr key={persona.id} className="hover:bg-gray-50">
                                    <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
                                    <td className="border border-gray-200 px-4 py-2">
                                        {persona.apellidos} {persona.nombres}
                                    </td>
                                    {asistencias.map((codigo, dayIndex) => (
                                        <td key={dayIndex} 
                                            className={`border border-gray-200 px-2 py-2 text-center ${CODIGOS[codigo].color}`}>
                                            {codigo}
                                        </td>
                                    ))}
                                    {Object.keys(CODIGOS).map(code => (
                                        <td key={code} className="border border-gray-200 px-2 py-2 text-center">
                                            {totales[code]}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
                {Object.entries(CODIGOS).map(([code, { text, color, description }]) => (
                    <div key={code} className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded ${color}`}>{text}</span>
                        <span>{description}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tareo; 