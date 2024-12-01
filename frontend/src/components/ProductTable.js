import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 18px;
    text-align: left;
`;

const Th = styled.th`
    background-color: #f2f2f2;
    color: #333;
    padding: 12px;
    border: 1px solid #ddd;
`;

const Td = styled.td`
    padding: 12px;
    border: 1px solid #ddd;
    background-color: ${props => props.$highlight ? '#f9f9f9' : 'white'};
    &:hover {
        background-color: #f1f1f1;
    }
`;

const Tr = styled.tr`
    cursor: pointer;
    &:nth-child(even) {
        background-color: #f2f2f2;
    }
`;

const StockContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
`;

const InvisibleColumn = styled.div`
    visibility: hidden;
    width: 0;
    height: 0;
`;

const ProductTable = ({ productos, selectedProducto, handleProductoClick }) => {
    const getStockIcon = (stock) => {
        if (stock <= 1) {
            return <FontAwesomeIcon icon={faExclamationCircle} style={{ color: 'red' }} />;
        } else if (stock < 5) {
            return <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: 'yellow' }} />;
        } else {
            return <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }} />;
        }
    };

    return (
        <Table>
            <thead>
                <tr>
                    <Th>Nombre</Th>
                    <Th>Unidad de Medida</Th>
                    <Th>Estado</Th>
                    <Th>Stock</Th>
                </tr>
            </thead>
            <tbody>
                {productos.map(producto => (
                    <Tr
                        key={producto.id}
                        onClick={() => handleProductoClick(producto)}
                        style={{
                            textDecoration: selectedProducto?.id === producto.id ? 'underline' : 'none',
                            fontWeight: selectedProducto?.id === producto.id ? 'bold' : 'normal',
                        }}
                    >
                        <Td $highlight={selectedProducto?.id === producto.id}>{producto.nombre}</Td>
                        <Td $highlight={selectedProducto?.id === producto.id}>{producto.unidad_medida}</Td>
                        <Td $highlight={selectedProducto?.id === producto.id}>{producto.estado}</Td>
                        <Td $highlight={selectedProducto?.id === producto.id}>
                            <StockContainer>
                                <InvisibleColumn>{producto.stock}</InvisibleColumn>
                                {producto.stock} {getStockIcon(producto.stock)}
                            </StockContainer>
                        </Td>
                    </Tr>
                ))}
            </tbody>
        </Table>
    );
};

export default ProductTable;