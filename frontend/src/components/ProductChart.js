import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ProductChart = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/productos/')
      .then(response => {
        setProductos(response.data);
      })
      .catch(error => {
        console.error('Hubo un error al obtener los productos:', error);
      });
  }, []);

  return (
    <div>
      <h1>Gráfico de Productos</h1>
      <BarChart width={600} height={300} data={productos}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nombre" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="stock" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default ProductChart;
