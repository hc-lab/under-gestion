import React from 'react';
import Navigation from './Navigation';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="pt-16">
                {children}
            </main>
        </div>
    );
};

export default Layout; 