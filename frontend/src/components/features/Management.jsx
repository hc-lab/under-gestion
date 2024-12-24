import React from 'react';
import { Link } from 'react-router-dom';
import { 
    ChartBarIcon, 
    UsersIcon,
    CubeIcon,
    DocumentTextIcon 
} from '@heroicons/react/24/outline';

const ManagementCard = ({ title, description, icon: Icon, to, color }) => (
    <Link 
        to={to}
        className="relative group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
    >
        <div className={`absolute right-6 top-6 w-12 h-12 rounded-lg ${color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="pr-16">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-500">{description}</p>
        </div>
    </Link>
);

const Management = () => {
    const sections = [
        {
            title: "Análisis de Inventario",
            description: "Visualiza y analiza las tendencias de stock y movimientos de productos.",
            icon: ChartBarIcon,
            to: "/analytics",
            color: "bg-blue-500"
        },
        {
            title: "Gestión de Personal",
            description: "Administra los usuarios, roles y permisos del sistema.",
            icon: UsersIcon,
            to: "/personal",
            color: "bg-green-500"
        },
        {
            title: "Categorización Inteligente",
            description: "Organiza y clasifica productos de manera eficiente.",
            icon: CubeIcon,
            to: "/categories",
            color: "bg-purple-500"
        },
        {
            title: "Reportes Avanzados",
            description: "Genera informes detallados y personalizados.",
            icon: DocumentTextIcon,
            to: "/reports",
            color: "bg-orange-500"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                    Gestión del Sistema
                </h2>
                <p className="mt-2 text-gray-600">
                    Accede a las diferentes herramientas de administración
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section) => (
                    <ManagementCard key={section.title} {...section} />
                ))}
            </div>
        </div>
    );
};

export default Management; 