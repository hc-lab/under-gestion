import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
  >
    {children}
  </Link>
);

const UserMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative ml-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
      >
        <span className="text-blue-600">{user?.username || 'Usuario'}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
          <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
            {user?.email || 'usuario@ejemplo.com'}
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-200"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y nombre */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-medium text-gray-900">Under Gestión</span>
            </Link>
          </div>

          {/* Menú principal */}
          <div className="hidden md:flex md:items-center">
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                  <NavLink to="/productos">Productos</NavLink>
                  <NavLink to="/personal">Personal</NavLink>
                  <NavLink to="/blasting">Blasting</NavLink>
                  <UserMenu user={user} onLogout={logout} />
                </>
              ) : (
                <NavLink to="/login">
                  <span className="text-blue-600 hover:text-blue-700">Iniciar Sesión</span>
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 