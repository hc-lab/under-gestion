import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import styled from 'styled-components';

const Container = styled.div`
    padding: 20px;
`;

const Form = styled.form`
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
`;

const Input = styled.input`
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
`;

const Button = styled.button`
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`;

const CategoriaAdmin = () => {
    const [categorias, setCategorias] = useState([]);
    const [nuevaCategoria, setNuevaCategoria] = useState('');

    useEffect(() => {
        fetchCategorias();
    }, []);

    const fetchCategorias = async () => {
        try {
            const response = await axiosInstance.get('categorias/');
            setCategorias(response.data);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('categorias/', { nombre: nuevaCategoria });
            setNuevaCategoria('');
            fetchCategorias();
        } catch (error) {
            console.error('Error al crear categoría:', error);
        }
    };

    return (
        <Container>
            <h2>Administrar Categorías</h2>
            <Form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                    placeholder="Nueva categoría"
                    required
                />
                <Button type="submit">Agregar</Button>
            </Form>

            <h3>Categorías existentes:</h3>
            <ul>
                {categorias.map(categoria => (
                    <li key={categoria.id}>{categoria.nombre}</li>
                ))}
            </ul>
        </Container>
    );
};

export default CategoriaAdmin; 