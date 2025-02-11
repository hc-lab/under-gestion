import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const Blasting = () => {
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        armadas: '',
        longitud: '',
        turno: 'DIA',
        perforacion: 'EXTRACCION'
    });

    const fetchRegistros = async () => {
        try {
            const response = await axiosInstance.get('blasting/');
            setRegistros(response.data);
        } catch (error) {
            toast.error('Error al cargar los registros');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistros();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validar datos antes de enviar
            if (!formData.armadas || formData.armadas <= 0) {
                toast.error('El número de armadas debe ser mayor que 0');
                return;
            }
            if (!formData.longitud || formData.longitud <= 0) {
                toast.error('La longitud debe ser mayor que 0');
                return;
            }

            const response = await axiosInstance.post('blasting/', formData);

            if (response.data) {
                toast.success('Registro añadido exitosamente');
                await fetchRegistros();
                setFormData({
                    armadas: '',
                    longitud: '',
                    turno: 'DIA',
                    perforacion: 'EXTRACCION'
                });
            }
        } catch (error) {
            console.error('Error al crear el registro:', error);
            const errorMessage = error.response?.data?.error ||
                error.response?.data?.detail ||
                'Error al crear el registro';
            toast.error(errorMessage);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        // Convertir números a tipo numérico
        if (name === 'armadas') {
            processedValue = parseInt(value);
        } else if (name === 'longitud') {
            processedValue = parseFloat(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Registro de Voladura</h2>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="armadas">
                            Armadas
                        </label>
                        <input
                            type="number"
                            name="armadas"
                            value={formData.armadas}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="longitud">
                            Longitud (pies)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            name="longitud"
                            value={formData.longitud}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="turno">
                            Turno
                        </label>
                        <select
                            name="turno"
                            value={formData.turno}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="DIA">Día</option>
                            <option value="NOCHE">Noche</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="perforacion">
                            Perforación
                        </label>
                        <select
                            name="perforacion"
                            value={formData.perforacion}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="EXTRACCION">Extracción</option>
                            <option value="AVANCE">Avance</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6">
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Registrar
                    </button>
                </div>
            </form>

            {/* Tabla de registros */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Fecha
                            </th>
                            <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Armadas
                            </th>
                            <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Longitud (pies)
                            </th>
                            <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Turno
                            </th>
                            <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Perforación
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {registros.map((registro) => (
                            <tr key={registro.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                    {format(new Date(registro.fecha), 'dd/MM/yyyy')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                    {registro.armadas}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                    {registro.longitud}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                    {registro.turno === 'DIA' ? 'Día' : 'Noche'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                    {registro.perforacion === 'EXTRACCION' ? 'Extracción' : 'Avance'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Blasting;
