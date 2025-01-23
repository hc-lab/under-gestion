import React from 'react';

const Card = ({ children }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
            {children}
        </div>
    );
};

export default Card; 