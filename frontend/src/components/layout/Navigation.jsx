import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { UserCircleIcon, HomeIcon, ChartBarIcon, ClipboardDocumentListIcon, ArrowsUpDownIcon, BellAlertIcon, ClockIcon, ChevronDownIcon, UsersIcon, CubeIcon } from '@heroicons/react/24/outline';

const Navigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Menú principal con las rutas
    const mainRoutes = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: ChartBarIcon
        },
        {
            name: 'Productos',
            path: '/productos',
            icon: CubeIcon
        }
    ];

    return (
        <nav className="bg-gray-900 shadow-lg border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Home a la izquierda */}
                    <div className="flex-shrink-0">
                        <Link
                            to="/"
                            className={`
                                flex items-center px-4 py-2 rounded-md
                                transition-all duration-200
                                ${location.pathname === '/'
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }
                            `}
                        >
                            <HomeIcon className="h-5 w-5 mr-1" />
                            <span className="text-sm font-medium">Home</span>
                        </Link>
                    </div>

                    {/* Enlaces principales */}
                    {isAuthenticated && (
                        <div className="flex items-center space-x-4">
                            {mainRoutes.map((route) => (
                                <Link
                                    key={route.path}
                                    to={route.path}
                                    className={`
                                        px-4 py-2 rounded-md text-sm font-medium
                                        transition-all duration-200
                                        ${location.pathname === route.path
                                            ? 'bg-indigo-600 text-white shadow-lg'
                                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        }
                                    `}
                                >
                                    <div className="flex items-center">
                                        <route.icon className="h-5 w-5 mr-1" />
                                        <span>{route.name}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Perfil/Login a la derecha */}
                    <div className="flex items-center">
                        {isAuthenticated ? (
                            <Menu as="div" className="relative ml-4">
                                <Menu.Button className="
                                    flex items-center px-3 py-2 rounded-md
                                    text-gray-300 hover:bg-gray-800 hover:text-white
                                    transition-colors duration-200
                                ">
                                    <span className="text-sm font-medium mr-2">{user?.username}</span>
                                    <UserCircleIcon className="h-8 w-8" />
                                </Menu.Button>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={handleLogout}
                                                    className={`
                                                        flex w-full items-center px-4 py-2 text-sm
                                                        text-white
                                                        ${active 
                                                            ? 'bg-rose-600 shadow-inner' 
                                                            : 'bg-rose-500 hover:bg-rose-600'
                                                        }
                                                        border-l-4 border-transparent
                                                        ${active ? 'border-l-4 border-rose-700' : ''}
                                                        transition-all duration-200 ease-in-out
                                                        group rounded-sm
                                                    `}
                                                >
                                                    <span className="flex-1 font-medium">Cerrar sesión</span>
                                                    <svg 
                                                        className={`w-5 h-5 ml-2 transform ${active ? 'translate-x-1' : ''} transition-transform duration-200`}
                                                        fill="none" 
                                                        viewBox="0 0 24 24" 
                                                        stroke="currentColor"
                                                    >
                                                        <path 
                                                            strokeLinecap="round" 
                                                            strokeLinejoin="round" 
                                                            strokeWidth={2} 
                                                            d="M17 8l4 4m0 0l-4 4m4-4H3" 
                                                        />
                                                    </svg>
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        ) : (
                            <Link
                                to="/login"
                                className="
                                    bg-indigo-600 text-white
                                    px-4 py-2 rounded-md text-sm font-medium
                                    hover:bg-indigo-700 
                                    transition-all duration-200
                                    shadow-lg hover:shadow-xl
                                "
                            >
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation; 