import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ProductTable from './ProductTable';
import ProductForm from './ProductForm';
import SearchBar from './SearchBar';

const Container = styled.div`
    display: flex;
    width: 100%;
`;

const Column = styled.div`
    flex: ${props => props.$flex};
    padding: 20px;
`;

const Tabs = styled.div`
    display: flex;
    margin-bottom: 20px;
`;

const Tab = styled.button`
    flex: 1;
    padding: 10px;
    cursor: pointer;
    background-color: ${props => props.$active ? '#ccc' : '#f2f2f2'};
    border: 1px solid #ddd;
    border-bottom: ${props => props.$active ? 'none' : '1px solid #ddd'};
    &:hover {
        background-color: #ddd;
    }
`;

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
    &:nth-child(even) {
        background-color: #f2f2f2;
    }
`;

const ProductoList = () => {
    const [productos, setProductos] = useState([]);
    const [historial, setHistorial] = useState([]);
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [activeTab, setActiveTab] = useState('Cocina');
    const [cantidad, setCantidad] = useState('');
    const [entregadoA, setEntregadoA] = useState('');
    const [motivo, setMotivo] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/productos/')
            .then(response => {
                setProductos(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the productos!', error);
            });
    }, []);

    const handleProductoClick = (producto) => {
        setSelectedProducto(producto);
        axios.get(`http://localhost:8000/api/historial/?producto=${producto.id}`)
            .then(response => {
                setHistorial(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the historial!', error);
            });
    };

    const handleSalidaSubmit = (e) => {
        e.preventDefault();
        const salidaData = {
            producto: selectedProducto.id,
            cantidad: parseInt(cantidad),
            entregado_a: entregadoA,
            motivo: motivo,
        };

        axios.post('http://localhost:8000/api/salidas/', salidaData)
            .then(response => {
                setHistorial([...historial, response.data]);
                setSelectedProducto({
                    ...selectedProducto,
                    stock: selectedProducto.stock - salidaData.cantidad,
                });
                setCantidad('');
                setEntregadoA('');
                setMotivo('');
            })
            .catch(error => {
                console.error('There was an error creating the salida!', error);
            });
    };

    const filteredProductos = productos.filter(producto => 
        searchTerm
            ? producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            : producto.categoria === activeTab
    );

    return (
        <Container>
            <Column $flex="3">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <Tabs>
                    <Tab $active={activeTab === 'Cocina'} onClick={() => setActiveTab('Cocina')}>Cocina</Tab>
                    <Tab $active={activeTab === 'Almacen'} onClick={() => setActiveTab('Almacen')}>Almacén</Tab>
                    <Tab $active={activeTab === 'EPPS'} onClick={() => setActiveTab('EPPS')}>EPPS</Tab>
                    <Tab $active={activeTab === 'Mina'} onClick={() => setActiveTab('Mina')}>Mina</Tab>
                    <Tab $active={activeTab === 'Medicamento'} onClick={() => setActiveTab('Medicamento')}>Medicamento</Tab>
                </Tabs>
                <h1>Lista de Productos</h1>
                <ProductTable
                    productos={filteredProductos}
                    selectedProducto={selectedProducto}
                    handleProductoClick={handleProductoClick}
                />
                {selectedProducto && (
                    <ProductForm
                        cantidad={cantidad}
                        setCantidad={setCantidad}
                        entregadoA={entregadoA}
                        setEntregadoA={setEntregadoA}
                        motivo={motivo}
                        setMotivo={setMotivo}
                        handleSalidaSubmit={handleSalidaSubmit}
                    />
                )}
            </Column>
            <Column $flex="2">
                {selectedProducto && (
                    <div>
                        <h2>Historial de Producto: {selectedProducto.nombre}</h2>
                        <Table>
                            <thead>
                                <tr>
                                    <Th>Fecha y Hora</Th>
                                    <Th>Cantidad</Th>
                                    <Th>Entregado a</Th>
                                    <Th>Motivo</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {historial.length > 0 ? (
                                    historial.map((entry, index) => (
                                        <Tr key={entry.id}>
                                            <Td>{entry.fecha_hora}</Td>
                                            <Td>{entry.cantidad}</Td>
                                            <Td>{entry.entregado_a}</Td>
                                            <Td>{entry.motivo}</Td>
                                        </Tr>
                                    ))
                                ) : (
                                    <Tr>
                                        <Td colSpan="4">Producto sin movimiento</Td>
                                    </Tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Column>
        </Container>
    );
};

export default ProductoList;