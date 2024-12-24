import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { UsersIcon } from '@heroicons/react/24/outline';

const Personal = () => {
    const [personal, setPersonal] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPersonal = async () => {
            try {
                const response = await axiosInstance.get('/personal/');
                setPersonal(response.data);
            } catch (error) {
                console.error('Error al cargar personal:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPersonal();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                    Gestión de Personal
                </h2>
                <p className="mt-2 text-gray-600">
                    Administra el personal y sus permisos
                </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                DNI
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cargo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Teléfono
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Procedencia
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {personal.map((persona) => (
                            <tr key={persona.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {persona.nombres} {persona.apellidos}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {persona.dni}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {persona.cargo}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {persona.telefono}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {persona.procedencia}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Personal; 