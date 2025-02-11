import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
  >
    {children}
  </Link>
);

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y nombre */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">Under Gestión</span>
            </Link>
          </div>

          {/* Menú principal */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                  <NavLink to="/productos">Productos</NavLink>
                  <NavLink to="/personal">Personal</NavLink>
                  <NavLink to="/blasting">Blasting</NavLink>
                  <button
                    onClick={logout}
                    className="text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <NavLink to="/login">Iniciar Sesión</NavLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 