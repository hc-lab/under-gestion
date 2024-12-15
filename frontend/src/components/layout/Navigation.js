import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { useTheme } from './ThemeProvider';

const Navigation = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo y enlaces principales */}
          <div className="flex items-center space-x-6">
            {/* Enlace a Home */}
            <NavLink 
              to="/" 
              className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
            >
              Inicio
            </NavLink>

            {/* Separador y enlace a Management solo si está autenticado */}
            {isAuthenticated && (
              <>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <NavLink 
                  to="/management" 
                  className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Sistema de Inventario
                </NavLink>
              </>
            )}

            {/* Menú de navegación autenticado */}
            {isAuthenticated && (
              <div className="ml-10 flex items-center space-x-4">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${isActive
                      ? 'bg-gray-900 text-white dark:bg-gray-700'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/productos"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${isActive
                      ? 'bg-gray-900 text-white dark:bg-gray-700'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  Productos
                </NavLink>
              </div>
            )}
          </div>

          {/* Botones de usuario y tema */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
              aria-label="Cambiar tema"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-700 dark:text-gray-300">
                  {user?.username}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Iniciar Sesión
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;