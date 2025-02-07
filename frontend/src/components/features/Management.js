import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { motion } from 'framer-motion';
import { FaChartLine, FaClipboardList, FaBell } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const FeatureCard = ({ icon: Icon, title, description, link }) => (
    <Link to={link}>
        <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 cursor-pointer group hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300"
            data-aos="fade-up"
        >
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                <Icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {description}
            </p>
            <div className="flex items-center text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="font-medium">Ver más</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </motion.div>
    </Link>
);

const Management = () => {


    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-16">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900"/>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
                            Sistema de Gestión de
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                                {" "}Inventario
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
                            Optimiza y controla tu inventario de manera eficiente
                        </p>
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Comenzar ahora
                            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
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
                            title="Dashboard"
                            description="Visualiza el estado actual de tu inventario con estadísticas en tiempo real y gráficos interactivos."
                            link="/dashboard"
                        />
                        <FeatureCard
                            icon={FaClipboardList}
                            title="Gestión de Stock"
                            description="Administra entradas, salidas y transferencias de productos con un sistema intuitivo y eficiente."
                            link="/productos"
                        />
                        <FeatureCard
                            icon={FaBell}
                            title="Gestión de Personal"
                            description="Administra el personal, registra asistencias y gestiona permisos de manera eficiente."
                            link="/personal"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Management;