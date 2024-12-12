import React from 'react';
import styled from 'styled-components';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
`;

const TextArea = styled.textarea`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    min-height: 100px;
`;

const Button = styled.button`
    padding: 10px;
    background-color: #26a69a;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background-color: #2bbbad;
    }
`;

const ProductForm = ({
    cantidad,
    setCantidad,
    entregadoA,
    setEntregadoA,
    motivo,
    setMotivo,
    handleSalidaSubmit
}) => {
    return (
        <Form onSubmit={handleSalidaSubmit}>
            <h3>Registrar Salida</h3>
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
            <TextArea
                placeholder="Motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                required
            />
            <Button type="submit">Registrar Salida</Button>
        </Form>
    );
};

export default ProductForm;