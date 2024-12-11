import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './components/Login';
import ProductList from './components/ProductList';
import Navigation from './components/Navigation';
import ProductChart from './components/ProductChart';
import StockReport from './components/StockReport';
import CategoriaAdmin from './components/CategoriaAdmin';
import Blog from './components/Blog';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navigation />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Blog />} />
                    <Route path="/productos" element={<ProductList />} />
                    <Route path="/product-chart" element={<ProductChart />} />
                    <Route path="/stock-report" element={<StockReport />} />
                    <Route path="/categorias" element={<CategoriaAdmin />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;