import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
            <div className="pt-16">
                {children}
            </div>
            {/* Efectos de luz sutiles */}
            <div className="fixed top-0 left-1/4 w-1/2 h-1/2 bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>
            <div className="fixed bottom-0 right-1/4 w-1/2 h-1/2 bg-purple-100/40 rounded-full blur-3xl pointer-events-none"></div>
        </div>
    );
};

export default Layout; 