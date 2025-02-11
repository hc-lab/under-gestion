import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './AuthContext';
import ThemeProvider from './components/layout/ThemeProvider';
import Layout from './components/layout/Layout';
import Navbar from './components/common/Navbar';

// Componentes de características
import Login from './components/features/Login';
import ProductList from './components/features/ProductList';
import Home from './components/features/Home';
import Management from './components/features/Management';
import Blasting from './components/features/Blasting';
import Dashboard from './components/features/Dashboard';
import Personal from './components/features/Personal';
import RRHH from './components/features/RRHH';
import ProtectedRoute from './components/features/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <Router>
                    <Layout>
                        <Navbar />
                        <main className="container mx-auto px-4 py-8">
                            <Toaster position="top-right" />
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route
                                    path="/productos"
                                    element={
                                        <ProtectedRoute>
                                            <ProductList />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard"
                                    element={
                                        <ProtectedRoute>
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
                                <Route
                                    path="/personal"
                                    element={
                                        <ProtectedRoute>
                                            <Personal />
                                        </ProtectedRoute>
                                    }
                                />
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
                        </main>
                    </Layout>
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App; 