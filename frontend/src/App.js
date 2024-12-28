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
import Reports from './components/features/Reports';
import Personal from './components/features/Personal';
import RRHH from './components/features/RRHH';
import Tareo from './components/features/Tareo';

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
                            <Route path="/product-chart" element={<ProtectedRoute><ProductChart /></ProtectedRoute>} />
                            <Route path="/bulk-entry" element={<ProtectedRoute><BulkEntry /></ProtectedRoute>} />
                            <Route path="/alerts" element={<Alerts />} />
                            <Route path="/activity-history" element={
                                <ProtectedRoute>
                                    <ActivityHistory />
                                </ProtectedRoute>
                            } />
                            <Route 
                                path="/reports" 
                                element={
                                    <ProtectedRoute>
                                        <Reports />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route path="/personal" element={<Personal />} />
                            <Route 
                                path="/rrhh" 
                                element={
                                    <ProtectedRoute>
                                        <Tareo />
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