import React, { createContext, useContext, useEffect, useState } from 'react';

// Crear contexto para el tema
export const ThemeContext = createContext();

// Hook personalizado para usar el tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  // Obtener el tema inicial desde localStorage o preferencia del sistema
  const [darkMode, setDarkMode] = useState(() => {
    // Verificar localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Verificar preferencia del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Función para cambiar el tema
  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Actualizar localStorage y clase del documento cuando cambia el tema
  useEffect(() => {
    // Guardar en localStorage
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');

    // Actualizar clase en el documento
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <div className={`${darkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          {children}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;