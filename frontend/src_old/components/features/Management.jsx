import React from 'react';
import { Link } from 'react-router-dom';
import { 
    ChartBarIcon, 
    UsersIcon,
    CubeIcon,
    DocumentTextIcon 
} from '@heroicons/react/24/outline';
import { FaChartLine, FaClipboardList, FaBell, FaUsers } from 'react-icons/fa';

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                    Gestión del Sistema
                </h2>
                <p className="mt-2 text-gray-600">
                    Accede a las diferentes herramientas de administración
                </p>
            </div>

            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Funcionalidades del Sistema
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Todo lo que necesitas para gestionar tu inventario
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={FaChartLine}
                            title="Control en Tiempo Real"
                            description="Monitorea tus existencias en tiempo real, con actualizaciones automáticas y seguimiento preciso de cada movimiento."
                            link="/activity-history"
                        />
                        <FeatureCard
                            icon={FaClipboardList}
                            title="Gestión de Stock"
                            description="Administra entradas, salidas, devoluciones y transferencias de productos con un sistema intuitivo y eficiente."
                            link="/stock-report"
                        />
                        <FeatureCard
                            icon={FaBell}
                            title="Sistema de Alertas"
                            description="Configuración de niveles mínimos de stock y notificaciones automáticas para reabastecimiento oportuno."
                            link="/alerts"
                        />
                        <FeatureCard
                            icon={FaChartLine}
                            title="Análisis de Datos"
                            description="Visualiza tendencias, genera reportes detallados y toma decisiones basadas en datos precisos."
                            link="/product-chart"
                        />
                        <FeatureCard
                            icon={FaUsers}
                            title="Gestión de Personal"
                            description="Administra el personal, roles y permisos del sistema de manera eficiente y segura."
                            link="/personal"
                        />
                        <FeatureCard
                            icon={FaBell}
                            title="Ingreso de Productos"
                            description="Registra la entrada de nuevos productos al inventario de manera eficiente y mantén un control preciso del stock."
                            link="/bulk-entry"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Management; 