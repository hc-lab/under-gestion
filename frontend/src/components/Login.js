import React, { useState, useContext } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

// ... (mantener todos los imports y styled components)

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setIsAuthenticated, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://192.168.1.246:8000/api/auth/token/', {
        username,
        password
      });

      console.log('Respuesta completa:', response.data);

      // Agregar logs para debugging
      console.log('Respuesta completa del servidor:', response);
      console.log('Datos de la respuesta:', response.data);

      // Verificar la estructura de los datos
      const userData = {
        username: response.data.username,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email,
        id: response.data.user_id
      };

      console.log('Datos del usuario estructurados:', userData);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(userData));

      setIsAuthenticated(true);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                         'Error al iniciar sesión. Por favor, intente nuevamente.';
      alert(errorMessage);
    }
  };

  // ... (mantener el return con el JSX existente)

  return (
    <LoginContainer>
      <h2>Iniciar Sesión</h2>
      <LoginForm onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Iniciar Sesión</Button>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;