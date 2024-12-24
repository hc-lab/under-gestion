import React, { useState } from 'react';
import AutocompletePersonal from '../common/AutocompletePersonal';

const RegistroSalida = () => {
    const [entregadoA, setEntregadoA] = useState('');
    const [personalSeleccionado, setPersonalSeleccionado] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // ... resto de la lógica de submit
        // Asegúrate de incluir personalSeleccionado.id en tu envío si es necesario
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Entregado a:
                </label>
                <AutocompletePersonal
                    value={entregadoA}
                    onChange={setEntregadoA}
                    onSelect={setPersonalSeleccionado}
                />
            </div>
        </form>
    );
};

export default RegistroSalida; 