import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './components/features/Login';
import ProductList from './components/features/ProductList';
import ProductChart from './components/features/ProductChart';
import Alerts from './components/common/Alerts';
import Home from './components/features/Home';
import Management from './components/features/Management';
import BulkEntry from './components/features/BulkEntry';
import Dashboard from './components/features/Dashboard';
import ProtectedRoute from './components/features/ProtectedRoute';
import ThemeProvider from './components/layout/ThemeProvider';
import Layout from './components/layout/Layout';
import ActivityHistory from './components/features/ActivityHistory';

const App = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/management" element={
                                <ProtectedRoute>
                                    <Management />
                                </ProtectedRoute>
                            } />
                            <Route path="/dashboard" element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="/productos" element={
                                <ProtectedRoute>
                                    <ProductList />
                                </ProtectedRoute>
                            } />
                            <Route path="/product-chart" element={<ProtectedRoute><ProductChart /></ProtectedRoute>} />
                            <Route path="/bulk-entry" element={<ProtectedRoute><BulkEntry /></ProtectedRoute>} />
                            <Route path="/alerts" element={<Alerts />} />
                            <Route path="/activity-history" element={
                                <ProtectedRoute>
                                    <ActivityHistory />
                                </ProtectedRoute>
                            } />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Layout>
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;