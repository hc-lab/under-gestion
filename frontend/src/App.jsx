import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/common/Navbar';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                    <Toaster position="top-right" />
                    <AppRoutes />
                </main>
            </div>
        </Router>
    );
}

export default App; 