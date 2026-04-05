import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AuthenticatedLayout() {
  return (
    <div className="flex min-h-screen bg-brand-primary">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 w-full max-w-[1400px] mx-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
