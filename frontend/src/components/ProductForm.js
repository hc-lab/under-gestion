import React from 'react';
import styled from 'styled-components';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
`;

const Button = styled.button`
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background-color: #45a049;
    }
`;

const ProductForm = ({ cantidad, setCantidad, entregadoA, setEntregadoA, motivo, setMotivo, handleSalidaSubmit }) => (
    <Form onSubmit={handleSalidaSubmit}>
        <h2>Registrar Salida de Producto</h2>
        <Input
            type="number"
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
        />
        <Input
            type="text"
            placeholder="Entregado a"
            value={entregadoA}
            onChange={(e) => setEntregadoA(e.target.value)}
            required
        />
        <Input
            type="text"
            placeholder="Motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            required
        />
        <Button type="submit">Registrar Salida</Button>
    </Form>
);

export default ProductForm;