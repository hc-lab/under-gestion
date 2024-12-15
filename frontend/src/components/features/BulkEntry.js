import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axiosInstance from '../../axiosInstance';

const Container = styled.div`
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
`;

const Form = styled.form`
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 2rem;
`;

const Select = styled.select`
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    font-size: 1rem;
    color: #333;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        border-color: #007bff;
    }

    &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }

    option {
        padding: 10px;
    }
`;

const Input = styled.input`
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:hover {
        border-color: #007bff;
    }

    &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;

const ProductoInput = styled.div`
    display: grid;
    grid-template-columns: 3fr 2fr 2fr 1fr;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    padding: 1.5rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    align-items: center;
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transform: translateY(-2px);
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
`;

const Button = styled.button`
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: ${props => props.$secondary ? '#6c757d' : '#007bff'};
    color: white;

    &:hover {
        background-color: ${props => props.$secondary ? '#5a6268' : '#0056b3'};
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`;

const DeleteButton = styled(Button)`
    background-color: #dc3545;
    padding: 0.6rem 1rem;

    &:hover {
        background-color: #c82333;
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 2rem;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Th = styled.th`
    padding: 1rem;
    background: #f8f9fa;
    text-align: left;
    border-bottom: 2px solid #dee2e6;
`;

const Td = styled.td`
    padding: 1rem;
    border-bottom: 1px solid #dee2e6;
`;

const ResumenContainer = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-top: 2rem;
`;

const UnidadMedida = styled.div`
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f8f9fa;
    color: #666;
    font-size: 1rem;
    text-align: center;
`;

const IngresoMasivo = () => {
    const [productos, setProductos] = useState([]);
    const [productosIngresados, setProductosIngresados] = useState([]);
    const [nuevosProductos, setNuevosProductos] = useState([{
        producto_id: '',
        cantidad: '',
        unidad_medida: ''
    }]);

    useEffect(() => {
        // Cargar productos y categorías
        Promise.all([
            axiosInstance.get('productos/'),
            axiosInstance.get('categorias/')
        ]).then(([productosRes, categoriasRes]) => {
            // Ordenar productos alfabéticamente por nombre
            const productosOrdenados = productosRes.data.sort((a, b) => 
                a.nombre.localeCompare(b.nombre)
            );
            setProductos(productosOrdenados);    
        });

        // Cargar ingresos del día
        const hoy = new Date().toISOString().split('T')[0];
        axiosInstance.get(`ingresos-dia/?fecha=${hoy}`)
            .then(response => {
                setProductosIngresados(response.data);
            });
    }, []);

    const handleAddProducto = () => {
        setNuevosProductos([...nuevosProductos, {
            producto_id: '',
            cantidad: '',
            unidad_medida: ''
        }]);
    };

    const handleRemoveProducto = (index) => {
        const updatedProductos = nuevosProductos.filter((_, i) => i !== index);
        setNuevosProductos(updatedProductos);
    };

    const handleChange = (index, field, value) => {
        const updatedProductos = nuevosProductos.map((producto, i) => {
            if (i === index) {
                const newProducto = { ...producto, [field]: value };
                
                if (field === 'producto_id') {
                    const productoSeleccionado = productos.find(p => p.id === parseInt(value));
                    newProducto.unidad_medida = productoSeleccionado ? productoSeleccionado.unidad_medida : '';
                }
                
                return newProducto;
            }
            return producto;
        });
        setNuevosProductos(updatedProductos);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const promises = nuevosProductos.map(producto => 
                axiosInstance.post('ingresos/', {
                    producto: producto.producto_id,
                    cantidad: parseInt(producto.cantidad),
                    fecha: new Date().toISOString().slice(0, 19).replace('T', ' ')
                })
            );

            await Promise.all(promises);
            
            // Recargar ingresos del día
            const hoy = new Date().toISOString().slice(0, 10);
            const response = await axiosInstance.get(`ingresos-dia/?fecha=${hoy}`);
            setProductosIngresados(response.data);
            
            // Limpiar formulario
            setNuevosProductos([{
                producto_id: '',
                cantidad: '',
                unidad_medida: ''
            }]);

            alert('Productos ingresados correctamente');
        } catch (error) {
            console.error('Error al ingresar productos:', error);
            alert('Error al ingresar productos');
        }
    };

    return (
        <Container>
            <h2>Ingreso de Productos</h2>
            <Form onSubmit={handleSubmit}>
                {nuevosProductos.map((producto, index) => (
                    <ProductoInput key={index}>
                        <Select
                            value={producto.producto_id}
                            onChange={(e) => handleChange(index, 'producto_id', e.target.value)}
                            required
                        >
                            <option value="">Seleccione un producto</option>
                            {productos.map(p => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                        </Select>
                        <Input
                            type="number"
                            placeholder="Cantidad"
                            value={producto.cantidad}
                            onChange={(e) => handleChange(index, 'cantidad', e.target.value)}
                            required
                            min="1"
                        />
                        <UnidadMedida>
                            {producto.unidad_medida || '-'}
                        </UnidadMedida>
                        {index > 0 && (
                            <DeleteButton type="button" onClick={() => handleRemoveProducto(index)}>
                                Eliminar
                            </DeleteButton>
                        )}
                    </ProductoInput>
                ))}
                <ButtonContainer>
                    <Button type="button" onClick={handleAddProducto} $secondary>
                        Agregar Producto
                    </Button>
                    <Button type="submit">
                        Guardar Todos
                    </Button>
                </ButtonContainer>
            </Form>

            <ResumenContainer>
                <h3>Productos Ingresados Hoy</h3>
                <Table>
                    <thead>
                        <tr>
                            <Th>Producto</Th>
                            <Th>Cantidad</Th>
                            <Th>Usuario</Th>
                            <Th>Hora</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosIngresados.map((ingreso, index) => (
                            <tr key={index}>
                                <Td>{ingreso.producto_nombre}</Td>
                                <Td>{ingreso.cantidad}</Td>
                                <Td>{ingreso.usuario_nombre}</Td>
                                <Td>
                                    {new Date(ingreso.fecha).toLocaleString('es-ES', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </ResumenContainer>
        </Container>
    );
};

export default IngresoMasivo; 