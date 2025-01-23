import React, { createContext, useContext, useState } from 'react';

const TareoContext = createContext(null);

export const TareoProvider = ({ children }) => {
    const [tareos, setTareos] = useState({});
    const [shouldRefresh, setShouldRefresh] = useState(false);

    const refreshTareos = () => {
        setShouldRefresh(prev => !prev);
    };

    const value = {
        tareos,
        setTareos,
        refreshTareos,
        shouldRefresh
    };

    return (
        <TareoContext.Provider value={value}>
            {children}
        </TareoContext.Provider>
    );
};

export const useTareo = () => {
    const context = useContext(TareoContext);
    if (context === null) {
        throw new Error('useTareo must be used within a TareoProvider');
    }
    return context;
};

export default TareoContext; 