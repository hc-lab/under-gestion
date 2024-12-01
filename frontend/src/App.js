import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductoList from './components/ProductList';
import ProductChart from './components/ProductChart';
import StockReport from './components/StockReport';
import Navigation from './components/Navigation';

const App = () => {
    return (
        <Router>
            <div>
                <Navigation />
                <Routes>
                    <Route path="/" element={<ProductoList />} />
                    <Route path="/graficos" element={<ProductChart />} />
                    <Route path="/reporte-stock" element={<StockReport />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;