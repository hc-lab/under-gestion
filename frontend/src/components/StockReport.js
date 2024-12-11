import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const Subtitle = styled.h2`
  color: #555;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 16px;
  text-align: left;
`;

const Th = styled.th`
  background-color: #007bff;
  color: white;
  padding: 12px;
  border: 1px solid #ddd;
`;

const Td = styled.td`
  padding: 12px;
  border: 1px solid #ddd;
  background-color: ${(props) => (props.$highlight ? '#f9f9f9' : 'white')};
  &:hover {
    background-color: #f1f1f1;
  }
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const NoDataMessage = styled.p`
  text-align: center;
  color: #777;
  font-size: 16px;
`;

const StockReport = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios
      .get('http://192.168.1.246:8000/api/productos/')
      .then((response) => {
        setProductos(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the productos!', error);
      });
  }, []);

  const criticalStockProducts = productos.filter((producto) => producto.stock <= 1);
  const lowStockProducts = productos.filter(
    (producto) => producto.stock > 1 && producto.stock < 5
  );

  return (
    <Container>
      <Title>Reporte de Productos con Stock Crítico y Bajo</Title>

      <Subtitle>
        <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#ff4d4d' }} /> Stock
        Crítico
      </Subtitle>
      {criticalStockProducts.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>Nombre</Th>
              <Th>Categoría</Th>
              <Th>Stock</Th>
              <Th>Unidad de Medida</Th>
            </tr>
          </thead>
          <tbody>
            {criticalStockProducts.map((producto) => (
              <Tr key={producto.id}>
                <Td>{producto.nombre}</Td>
                <Td>{producto.categoria}</Td>
                <Td>{producto.stock}</Td>
                <Td>{producto.unidad_medida}</Td>
              </Tr>
            ))}

          </tbody>
        </Table>
      ) : (
        <NoDataMessage>No hay productos con stock crítico.</NoDataMessage>
      )}

      <Subtitle>
        <FontAwesomeIcon icon={faBoxOpen} style={{ color: '#ffd966' }} /> Stock Bajo
      </Subtitle>
      {lowStockProducts.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>Nombre</Th>
              <Th>Categoría</Th>
              <Th>Stock</Th>
              <Th>Unidad de Medida</Th>
            </tr>
          </thead>
          <tbody>
            {lowStockProducts.map((producto) => (
              <Tr key={producto.id}>
                <Td>{producto.nombre}</Td>
                <Td>{producto.categoria}</Td>
                <Td>{producto.stock}</Td>
                <Td>{producto.unidad_medida}</Td>
              </Tr>
            ))}

          </tbody>
        </Table>
      ) : (
        <NoDataMessage>No hay productos con stock bajo.</NoDataMessage>
      )}
    </Container>
  );
};

export default StockReport;