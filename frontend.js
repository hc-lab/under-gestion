

Crear un proyecto React:

npx create-react-app frontend
cd frontend
npm install axios
npm install react-chartjs-2 chart.js


Paso 3: Configuración del Frontend (React)

    Crear Componentes: Crea frontend/src/components/ProductoList.js:

    import React, { useEffect, useState } from 'react';
    import axios from 'axios';

    const ProductoList = () => {
        const [productos, setProductos] = useState([]);

        useEffect(() => {
            axios.get('http://localhost:8000/api/productos/')
                .then(response => {
                    setProductos(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the productos!', error);
                });
        }, []);

        return (
            <div>
                <h1>Lista de Productos</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map(producto => (
                            <tr key={producto.id} style={{ backgroundColor: producto.stock < 5 ? 'red' : 'white' }}>
                                <td>{producto.nombre}</td>
                                <td>{producto.stock}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    export default ProductoList;

    Integrar el Componente en la App: Edita frontend/src/App.js:

    import React from 'react';
    import ProductoList from './components/ProductoList';

    function App() {
        return (
            <div className="App">
                <ProductoList />
            </div>
        );
    }

    export default App;

    /*Ejecutar el Frontend:*/

    npm start


    Paso 5: Crear el Gráfico de Tartas

    Instalar Chart.js:

    npm install chart.js




    Crear Componente de Gráfico: Crea frontend/src/components/ProductoChart.js:

    import React, { useEffect, useState } from 'react';
    import { Pie } from 'react-chartjs-2';
    import axios from 'axios';

    const ProductoChart = () => {
        const [chartData, setChartData] = useState({});

        useEffect(() => {
            axios.get('http://localhost:8000/api/productos/')
            .then(response => {
                const nombres = response.data.map(producto => producto.nombre);
                const stocks = response.data.map(producto => producto.stock);

                setChartData({
                    labels: nombres,
                    datasets: [
                        {
                            label: 'Stock de Productos',
                             data: stocks,
                             backgroundColor: [
                                 '#FF6384',
                             '#36A2EB',
                             '#FFCE56',
                             '#FF6384',
                             '#36A2EB',
                             '#FFCE56',
                             '#FF6384',
                             '#36A2EB',
                             '#FFCE56',
                             '#FF6384'
                             ]
                        }
                    ]
                });
            })
            .catch(error => {
                console.error('There was an error fetching the productos!', error);
            });
        }, []);

        return (
            <div>
            <h2>Gráfico de Tartas de Productos</h2>
            <Pie data={chartData} />
            </div>
        );
    };

    export default ProductoChart;


    /* corregido ProductoChart*/
    import React, { useEffect, useState } from 'react';
    import { Pie } from 'react-chartjs-2';
    import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
    import axios from 'axios';

    // Registrar los elementos necesarios
    ChartJS.register(ArcElement, Tooltip, Legend);

    const ProductoChart = () => {
        const [chartData, setChartData] = useState(null);

        useEffect(() => {
            axios.get('http://localhost:8000/api/productos/')
            .then(response => {
                const nombres = Array.isArray(response.data) ? response.data.map(producto => producto.nombre) : [];
                const stocks = Array.isArray(response.data) ? response.data.map(producto => producto.stock) : [];

                setChartData({
                    labels: nombres,
                    datasets: [
                        {
                            label: 'Stock de Productos',
                             data: stocks,
                             backgroundColor: [
                                 '#FF6384',
                             '#36A2EB',
                             '#FFCE56',
                             '#FF6384',
                             '#36A2EB',
                             '#FFCE56',
                             '#FF6384',
                             '#36A2EB',
                             '#FFCE56',
                             '#FF6384'
                             ]
                        }
                    ]
                });
            })
            .catch(error => {
                console.error('There was an error fetching the productos!', error);
            });
        }, []);

        return (
            <div>
            <h2>Gráfico de Tartas de Productos</h2>
            {chartData ? (
                <div style={{ width: '30%', height: '30%' }}>
                <Pie data={chartData} />
                </div>
            ) : (
                <p>Cargando datos...</p>
            )}
            </div>
        );
    };

    export default ProductoChart;


    /*ahora grafico de barras*/
    import React, { useEffect, useState } from 'react';
    import { Bar } from 'react-chartjs-2';
    import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
    import ChartDataLabels from 'chartjs-plugin-datalabels';
    import axios from 'axios';

    // Registrar los elementos necesarios
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

    const ProductoChart = () => {
        const [chartData, setChartData] = useState(null);

        useEffect(() => {
            axios.get('http://localhost:8000/api/productos/')
            .then(response => {
                const nombres = Array.isArray(response.data) ? response.data.map(producto => producto.nombre) : [];
                const stocks = Array.isArray(response.data) ? response.data.map(producto => producto.stock) : [];

                setChartData({
                    labels: nombres,
                    datasets: [
                        {
                            label: 'Stock de Productos',
                             data: stocks,
                             backgroundColor: nombres.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`),
                             borderColor: nombres.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`),
                             borderWidth: 1
                        }
                    ]
                });
            })
            .catch(error => {
                console.error('There was an error fetching the productos!', error);
            });
        }, []);

        const options = {
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}`;
                        }
                    }
                },
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    formatter: (value) => value,
                        color: 'black',
                        font: {
                            weight: 'bold'
                        }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        return (
            <div>
            <h2>Gráfico de Barras de Productos</h2>
            {chartData ? (
                <div style={{ width: '70%', height: '70%' }}>
                <Bar data={chartData} options={options} />
                </div>
            ) : (
                <p>Cargando datos...</p>
            )}
            </div>
        );
    };

    export default ProductoChart;


