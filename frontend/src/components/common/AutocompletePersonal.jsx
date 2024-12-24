import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AutocompletePersonal = ({ onSelect, value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchPersonal = async (searchText) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/personal/search/?search=${searchText}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Respuesta de búsqueda:', response.data);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error buscando personal:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const text = e.target.value;
    onChange(text);
    if (text.length >= 1) {
      searchPersonal(text);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelect = (personal) => {
    onSelect(personal);
    onChange(`${personal.nombres} ${personal.apellidos}`);
    setShowSuggestions(false);
  };

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
        placeholder="Buscar personal..."
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((personal) => (
            <li
              key={personal.id}
              onClick={() => handleSelect(personal)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {`${personal.nombres} ${personal.apellidos}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompletePersonal; 