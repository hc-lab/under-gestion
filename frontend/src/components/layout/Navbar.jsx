import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-gray-200 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
  >
    {children}
  </Link>
);

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y nombre */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-light text-white tracking-tight">Under Gestión</span>
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
                    className="text-red-400 hover:text-red-300 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ml-4"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <NavLink to="/login">
                  <span className="text-blue-400 hover:text-blue-300">Iniciar Sesión</span>
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