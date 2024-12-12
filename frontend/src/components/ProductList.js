import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
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

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const ProductoList = () => {
    const [productos, setProductos] = useState([]);
    const [historial, setHistorial] = useState([]);
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [activeTab, setActiveTab] = useState(null);
    const [cantidad, setCantidad] = useState('');
    const [entregadoA, setEntregadoA] = useState('');
    const [motivo, setMotivo] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const filteredProductos = productos.filter(producto => {
        if (searchTerm) {
            return producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        }
        
        if (activeTab) {
            console.log('Filtrando por categoría:', activeTab);
            console.log('Producto:', producto);
            console.log('Categoría del producto:', producto.categoria);
            
            const categoriaProducto = typeof producto.categoria === 'string' 
                ? producto.categoria 
                : producto.categoria?.nombre;
            
            return categoriaProducto === activeTab;
        }
        
        return true;  // Mostrar todos si no hay filtro
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productosResponse, categoriasResponse] = await Promise.all([
                    axiosInstance.get('productos/'),
                    axiosInstance.get('categorias/')
                ]);
                
                console.log('Productos recibidos (raw):', productosResponse.data);
                if (productosResponse.data.length > 0) {
                    console.log('Ejemplo de producto:', productosResponse.data[0]);
                    console.log('Categoría del primer producto:', productosResponse.data[0].categoria);
                }
                
                setProductos(productosResponse.data);
                setCategorias(categoriasResponse.data);
                setError(null);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setError('Error al cargar los datos');
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log('Active Tab:', activeTab);
        console.log('Productos filtrados:', filteredProductos);
    }, [activeTab, filteredProductos]);

    const handleProductoClick = (producto) => {
        setSelectedProducto(producto);
        axiosInstance.get(`historial-producto/?producto=${producto.id}`)
            .then(response => {
                setHistorial(response.data);
            })
            .catch(error => {
                console.error('Error al obtener el historial:', error);
                setError('Error al cargar el historial del producto');
            });
    };

    const handleSalidaSubmit = (e) => {
        e.preventDefault();
        
        // Validaciones
        if (!cantidad || cantidad <= 0) {
            alert('La cantidad debe ser mayor a 0');
            return;
        }
        
        if (parseInt(cantidad) > selectedProducto.stock) {
            alert('No hay suficiente stock disponible');
            return;
        }

        if (!entregadoA.trim()) {
            alert('Debe especificar a quién se entrega el producto');
            return;
        }

        const salidaData = {
            producto: selectedProducto.id,
            cantidad: parseInt(cantidad),
            entregado_a: entregadoA.trim(),
            motivo: motivo.trim(),
        };

        axiosInstance.post('salidas/', salidaData)
            .then(response => {
                axiosInstance.get(`historial-producto/?producto=${selectedProducto.id}`)
                    .then(historialResponse => {
                        setHistorial(historialResponse.data);
                    })
                    .catch(error => {
                        console.error('Error al actualizar el historial:', error);
                    });
                
                setSelectedProducto({
                    ...selectedProducto,
                    stock: selectedProducto.stock - salidaData.cantidad,
                });
                setCantidad('');
                setEntregadoA('');
                setMotivo('');
            })
            .catch(error => {
                console.error('Error al registrar la salida:', error);
                alert('Error al registrar la salida del producto');
            });
    };

    const handleTabClick = (categoria) => {
        console.log('------- Cambio de Tab -------');
        console.log('Categoría seleccionada:', categoria);
        console.log('Productos disponibles:', productos);
        setActiveTab(categoria.nombre);
        setSearchTerm('');  
        
        const productosFiltrados = productos.filter(p => 
            (typeof p.categoria === 'string' ? p.categoria : p.categoria?.nombre) === categoria.nombre
        );
        console.log('Productos filtrados:', productosFiltrados);
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Container>
            <Column $flex="3">
                <SearchBar 
                    searchTerm={searchTerm} 
                    setSearchTerm={setSearchTerm}
                    placeholder={activeTab ? `Buscar en ${activeTab}...` : "Buscar producto..."}
                />
                <Tabs>
                    <Tab
                        $active={!activeTab}
                        onClick={() => setActiveTab(null)}
                    >
                        Todos
                    </Tab>
                    {categorias.map(categoria => (
                        <Tab
                            key={categoria.id}
                            $active={activeTab === categoria.nombre}
                            onClick={() => handleTabClick(categoria)}
                        >
                            {categoria.nombre}
                        </Tab>
                    ))}
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
                                            <Td>{formatDate(entry.fecha_hora)}</Td>
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