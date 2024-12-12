import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './components/Login';
import ProductList from './components/ProductList';
import Navigation from './components/Navigation';
import ProductChart from './components/ProductChart';
import StockReport from './components/StockReport';
import Blog from './components/Blog';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navigation />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/blog" element={<Blog />} />
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
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;