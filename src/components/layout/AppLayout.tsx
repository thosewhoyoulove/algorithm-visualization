import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';

export default function AppLayout() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Navbar />
      <main className="flex-1 min-h-0 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
