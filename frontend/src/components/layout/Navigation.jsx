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

    // Lista de opciones adicionales
    const menuItems = [
        {
            name: 'Estadísticas',
            description: 'Visualización de datos y métricas',
            icon: ChartBarIcon,
            path: '/product-chart'
        },
        {
            name: 'Registro de Productos',
            description: 'Ingreso y gestión de nuevos productos',
            icon: ArrowsUpDownIcon,
            path: '/bulk-entry'
        },
        {
            name: 'Historial',
            description: 'Actividad y cambios recientes',
            icon: ClockIcon,
            path: '/activity-history'
        },
        {
            name: 'Alertas',
            description: 'Notificaciones y avisos',
            icon: BellAlertIcon,
            path: '/alerts'
        },
        {
            name: 'Reportes',
            description: 'Informes y documentación',
            icon: ClipboardDocumentListIcon,
            path: '/reports'
        },
        {
            name: 'Personal',
            description: 'Gestión del personal y permisos',
            icon: UsersIcon,
            path: '/personal'
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

                    {/* Enlaces principales en el centro */}
                    {isAuthenticated && (
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/dashboard"
                                className={`
                                    px-4 py-2 rounded-md text-sm font-medium
                                    transition-all duration-200
                                    ${location.pathname === '/dashboard'
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }
                                `}
                            >
                                <div className="flex items-center">
                                    <ChartBarIcon className="h-5 w-5 mr-1" />
                                    <span>Dashboard</span>
                                </div>
                            </Link>

                            <Link
                                to="/rrhh"
                                className={`
                                    px-4 py-2 rounded-md text-sm font-medium
                                    transition-all duration-200
                                    ${location.pathname === '/rrhh'
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }
                                `}
                            >
                                <div className="flex items-center">
                                    <UsersIcon className="h-5 w-5 mr-1" />
                                    <span>RR.HH</span>
                                </div>
                            </Link>

                            <button
                                onClick={() => navigate('/productos')}
                                className={`
                                    px-4 py-2 rounded-md text-sm font-medium
                                    transition-all duration-200
                                    ${location.pathname === '/productos'
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }
                                `}
                            >
                                <div className="flex items-center">
                                    <CubeIcon className="h-5 w-5 mr-1" />
                                    <span>Productos</span>
                                </div>
                            </button>

                            {/* Menú de Herramientas */}
                            <Menu as="div" className="relative">
                                {({ open }) => (
                                    <>
                                        <Menu.Button
                                            className={`
                                                inline-flex items-center px-4 py-2 rounded-md
                                                text-sm font-medium transition-all duration-200
                                                ${open
                                                    ? 'bg-indigo-600 text-white shadow-lg'
                                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                                }
                                            `}
                                        >
                                            <span>Herramientas</span>
                                            <ChevronDownIcon
                                                className={`ml-2 h-5 w-5 transition-transform duration-200 ${open ? 'transform rotate-180' : ''}`}
                                            />
                                        </Menu.Button>

                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-200"
                                            enterFrom="opacity-0 translate-y-1"
                                            enterTo="opacity-100 translate-y-0"
                                            leave="transition ease-in duration-150"
                                            leaveFrom="opacity-100 translate-y-0"
                                            leaveTo="opacity-0 translate-y-1"
                                        >
                                            <Menu.Items className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform">
                                                <div className="overflow-hidden rounded-xl shadow-lg ring-1 ring-black ring-opacity-5">
                                                    <div className="relative grid gap-6 bg-gradient-to-br from-white to-gray-50 px-6 py-6">
                                                        {menuItems.map((item) => (
                                                            <Menu.Item key={item.name}>
                                                                {({ active }) => (
                                                                    <Link
                                                                        to={item.path}
                                                                        className={`
                                                                            flex items-center p-4 rounded-lg
                                                                            ${active 
                                                                                ? 'bg-indigo-50 transform scale-[0.98]' 
                                                                                : 'hover:bg-indigo-50'
                                                                            }
                                                                            transition-all duration-200 ease-out
                                                                            group
                                                                        `}
                                                                    >
                                                                        <div className={`
                                                                            flex h-12 w-12 items-center justify-center rounded-lg
                                                                            ${active ? 'bg-indigo-600' : 'bg-indigo-500'}
                                                                            group-hover:bg-indigo-600 transition-colors
                                                                        `}>
                                                                            <item.icon
                                                                                className="h-6 w-6 text-white"
                                                                                aria-hidden="true"
                                                                            />
                                                                        </div>
                                                                        <div className="ml-4">
                                                                            <p className="text-base font-semibold text-gray-900">
                                                                                {item.name}
                                                                            </p>
                                                                            <p className="mt-1 text-sm text-gray-500">
                                                                                {item.description}
                                                                            </p>
                                                                        </div>
                                                                    </Link>
                                                                )}
                                                            </Menu.Item>
                                                        ))}
                                                    </div>
                                                </div>
                                            </Menu.Items>
                                        </Transition>
                                    </>
                                )}
                            </Menu>
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