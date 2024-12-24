import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

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

const ErrorMessage = styled.div`
  color: #dc3545;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login({
        username: username.trim(),
        password: password
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error en login:', error);
      if (error.response) {
        setError('Credenciales inválidas');
      } else {
        setError('Error de conexión');
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <LoginContainer>
      <h2>Iniciar Sesión</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <LoginForm onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
        />
        <Input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;