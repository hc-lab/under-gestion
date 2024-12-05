import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './components/Login';
import ProductoList from './components/ProductList';
import Navigation from './components/Navigation';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navigation />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<ProductoList />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;