import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './components/Login';
import ProductList from './components/ProductList';
import Navigation from './components/Navigation';
import ProductChart from './components/ProductChart';
import StockReport from './components/StockReport';
import Info from './components/Info';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import BulkEntry from './components/BulkEntry';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navigation />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Home />} />
                    <Route 
                        path="/info" 
                        element={
                            <ProtectedRoute>
                                <Info />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/productos" 
                        element={
                            <ProtectedRoute>
                                <ProductList />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/product-chart" 
                        element={
                            <ProtectedRoute>
                                <ProductChart />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/stock-report" 
                        element={
                            <ProtectedRoute>
                                <StockReport />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/bulk-entry" 
                        element={
                            <ProtectedRoute>
                                <BulkEntry />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;