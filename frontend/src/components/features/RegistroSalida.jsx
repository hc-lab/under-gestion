import AutocompletePersonal from '../common/AutocompletePersonal';

// ... dentro del componente ...
const [entregadoA, setEntregadoA] = useState('');
const [personalSeleccionado, setPersonalSeleccionado] = useState(null);

// ... en el JSX ...
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