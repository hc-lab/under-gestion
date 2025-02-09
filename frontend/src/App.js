import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './components/features/Login';
import ProductList from './components/features/ProductList';
import Home from './components/features/Home';
import Management from './components/features/Management';
import Blasting from './components/features/Blasting';
import Dashboard from './components/features/Dashboard';
import ProtectedRoute from './components/features/ProtectedRoute';
import ThemeProvider from './components/layout/ThemeProvider';
import Layout from './components/layout/Layout';
import Personal from './components/features/Personal';
import RRHH from './components/features/RRHH';

const App = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route 
                                path="/productos" 
                                element={
                                    <ProtectedRoute>
                                        {console.log('Intentando renderizar ProductList')}
                                        <ProductList />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/dashboard" 
                                element={
                                    <ProtectedRoute>
                                        {console.log('Intentando renderizar Dashboard')}
                                        <Dashboard />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/management" 
                                element={
                                    <ProtectedRoute>
                                        <Management />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route path="/personal" element={<ProtectedRoute><Personal /></ProtectedRoute>} />
                            <Route 
                                path="/rrhh" 
                                element={
                                    <ProtectedRoute>
                                        <RRHH />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/blasting" 
                                element={
                                    <ProtectedRoute>
                                        <Blasting />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Layout>
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;