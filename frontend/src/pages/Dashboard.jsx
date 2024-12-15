import { BoxIcon, StockIcon, AlertIcon } from '@heroicons/react/24/outline';
import StatCard from '../components/StatCard';
import ActivityList from '../components/ActivityList';

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Almacén</h1>
        <button className="btn-primary">Nuevo Producto</button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Productos"
          value="1,234"
          icon={<BoxIcon />}
        />
        <StatCard 
          title="En Stock"
          value="890"
          trend="+2.5%"
          icon={<StockIcon />}
        />
        <StatCard 
          title="Alertas"
          value="3"
          status="warning"
          icon={<AlertIcon />}
        />
      </div>

      {/* Recent Activity */}
      <section className="bg-white rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
        <ActivityList />
      </section>
    </div>
  );
}; 