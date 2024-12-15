import Dashboard from './Dashboard';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        <Dashboard />
      </main>
    </div>
  );
} 