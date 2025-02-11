import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
            <div className="pt-16">
                {children}
            </div>
            {/* Efecto de luz sutil */}
            <div className="fixed top-0 left-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="fixed bottom-0 right-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>
    );
};

export default Layout; 