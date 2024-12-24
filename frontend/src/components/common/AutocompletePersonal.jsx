import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AutocompletePersonal = ({ onSelect, value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchPersonal = async (searchText) => {
    try {
      const response = await axios.get(`/api/personal/search/?search=${searchText}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error buscando personal:', error);
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    onChange(text);
    if (text.length > 2) {
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
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
        placeholder="Buscar personal..."
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1">
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