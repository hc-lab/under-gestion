import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const ResumenEstadistico = ({ registros }) => {
    const totales = registros.reduce((acc, registro) => {
        return {
            armadas: acc.armadas + (Number(registro.armadas) || 0),
            longitud: acc.longitud + (Number(registro.longitud) || 0),
            dias: acc.dias + (registro.turno === 'DIA' ? 1 : 0),
            noches: acc.noches + (registro.turno === 'NOCHE' ? 1 : 0),
            extraccion: acc.extraccion + (registro.perforacion === 'EXTRACCION' ? 1 : 0),
            avance: acc.avance + (registro.perforacion === 'AVANCE' ? 1 : 0)
        };
    }, { armadas: 0, longitud: 0, dias: 0, noches: 0, extraccion: 0, avance: 0 });

    const promedios = {
        armadasPorDia: totales.armadas / (registros.length || 1),
        longitudPorArmada: totales.longitud / (totales.armadas || 1)
    };

    // Función auxiliar para formatear números
    const formatNumber = (value) => {
        const num = Number(value);
        return isNaN(num) ? '0.00' : num.toFixed(2);
    };

    return (
        <div className="mt-8 space-y-8">
            {/* Totales en Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Totales</h3>
                    <div className="space-y-3">
                        <p className="text-gray-600">Total Armadas: <span className="font-bold text-indigo-600">{totales.armadas}</span></p>
                        <p className="text-gray-600">Longitud Total: <span className="font-bold text-indigo-600">{formatNumber(totales.longitud)} pies</span></p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribución de Turnos</h3>
                    <div className="space-y-3">
                        <p className="text-gray-600">Turnos Día: <span className="font-bold text-indigo-600">{totales.dias}</span></p>
                        <p className="text-gray-600">Turnos Noche: <span className="font-bold text-indigo-600">{totales.noches}</span></p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Tipo de Perforación</h3>
                    <div className="space-y-3">
                        <p className="text-gray-600">Extracción: <span className="font-bold text-indigo-600">{totales.extraccion}</span></p>
                        <p className="text-gray-600">Avance: <span className="font-bold text-indigo-600">{totales.avance}</span></p>
                    </div>
                </div>
            </div>

            {/* Análisis Gerencial */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-md p-8 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Análisis Gerencial</h3>
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <p className="text-gray-700">
                            <span className="font-semibold">Promedio de armadas por día:</span> {formatNumber(promedios.armadasPorDia)}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <p className="text-gray-700">
                            <span className="font-semibold">Longitud promedio por armada:</span> {formatNumber(promedios.longitudPorArmada)} pies
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-700">
                            <span className="font-semibold">Distribución de trabajo:</span> {' '}
                            {((totales.extraccion / registros.length) * 100).toFixed(1)}% extracción, {' '}
                            {((totales.avance / registros.length) * 100).toFixed(1)}% avance
                        </p>
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800 leading-relaxed">
                            <span className="font-semibold">Recomendaciones:</span><br />
                            {totales.dias > totales.noches ?
                                "La mayor parte del trabajo se realiza en turno día. Considerar equilibrar la carga de trabajo entre turnos para optimizar recursos." :
                                "Existe un buen balance entre turnos día y noche, lo que indica una utilización eficiente del tiempo."}
                            {promedios.armadasPorDia > 5 ?
                                " El alto promedio de armadas por día sugiere una operación eficiente." :
                                " Hay oportunidad de mejorar la eficiencia en el número de armadas por día."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Blasting = () => {
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        armadas: '',
        longitud: '',
        turno: 'DIA',
        perforacion: 'EXTRACCION',
        fecha: new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
    });

    const fetchRegistros = async () => {
        try {
            const response = await axiosInstance.get('blasting/');
            setRegistros(response.data);
        } catch (error) {
            console.error('Error al cargar registros:', error);
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
        setLoading(true);
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

            const response = await axiosInstance.post('blasting/', {
                ...formData,
                fecha: new Date().toISOString().split('T')[0] // Asegurar formato YYYY-MM-DD
            });

            if (response.data) {
                toast.success('Registro añadido exitosamente');
                // Actualizar la lista de registros inmediatamente
                setRegistros(prevRegistros => [response.data, ...prevRegistros]);
                // Limpiar el formulario
                setFormData({
                    armadas: '',
                    longitud: '',
                    turno: 'DIA',
                    perforacion: 'EXTRACCION',
                    fecha: new Date().toISOString().split('T')[0]
                });
            }
        } catch (error) {
            console.error('Error al crear el registro:', error);
            const errorMessage = error.response?.data?.error ||
                error.response?.data?.detail ||
                'Error al crear el registro';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        // Convertir números a tipo numérico
        if (name === 'armadas') {
            processedValue = value === '' ? '' : parseInt(value);
        } else if (name === 'longitud') {
            processedValue = value === '' ? '' : parseFloat(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));
    };

    if (loading && registros.length === 0) {
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
                            min="1"
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
                            min="0.01"
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
                        disabled={loading}
                        className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Registrando...' : 'Registrar'}
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

            {/* Agregar el componente de resumen al final */}
            <ResumenEstadistico registros={registros} />
        </div>
    );
};

export default Blasting;
