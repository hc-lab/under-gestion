import React from 'react';
import styled from 'styled-components';

const Input = styled.input`
    padding: 10px;
    margin: 20px 0;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
`;

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    return (
        <Input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
    );
};

export default SearchBar;