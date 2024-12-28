import React, { createContext, useContext, useState } from 'react';

const TareoContext = createContext();

export const TareoProvider = ({ children }) => {
    const [tareos, setTareos] = useState({});
    const [shouldRefresh, setShouldRefresh] = useState(false);

    const refreshTareos = () => {
        setShouldRefresh(prev => !prev);
    };

    return (
        <TareoContext.Provider value={{ tareos, setTareos, refreshTareos, shouldRefresh }}>
            {children}
        </TareoContext.Provider>
    );
};

export const useTareo = () => useContext(TareoContext); 