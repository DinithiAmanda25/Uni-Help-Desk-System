import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, BookMarked, Bell, Search,
  Menu, X, LogOut, GraduationCap, Library,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
  { label: "Resource Library", icon: BookOpen, path: "/student/resources" },
  { label: "Book Catalog", icon: Library, path: "/student/library" },
  { label: "Notifications", icon: Bell, path: "/student/notifications", badge: 4 },
];

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-md">
              <GraduationCap size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="font-bold text-gray-800 text-sm">Uni Help Desk</p>
              <p className="text-[10px] text-gray-400 font-medium">Student Portal</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, icon: Icon, path, badge }) => {
            const active = location.pathname === path || (path !== "/student/dashboard" && location.pathname.startsWith(path));
            return (
              <button
                key={label}
                onClick={() => { navigate(path); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={active ? "text-blue-500" : "text-gray-400"} />
                  {label}
                </div>
                {badge && (
                  <span className="bg-red-500 text-white text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center px-1">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Role switcher */}
        <div className="px-3 py-3 border-t border-gray-100 space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 px-3 py-1">Switch Portal</p>
          <button onClick={() => navigate("/lecturer/upload")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-gray-500 hover:bg-gray-50 hover:text-violet-600 transition-all">
            <BookOpen size={14} className="text-gray-400" /> Lecturer Portal
          </button>
          <button onClick={() => navigate("/admin/dashboard")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-all">
            <LayoutDashboard size={14} className="text-gray-400" /> Admin Portal
          </button>
        </div>

        {/* User */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold shrink-0">JS</div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">Dinithi Amanda</p>
              <p className="text-[10px] text-gray-400 truncate">Student ID: IT23819788</p>
            </div>
            <button className="ml-auto p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu size={18} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
              <GraduationCap size={13} className="text-white" />
            </div>
            <span className="font-bold text-gray-800 text-sm">LibraryHub</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => navigate("/student/resources")} className="p-2 rounded-lg hover:bg-gray-100">
              <Search size={16} className="text-gray-500" />
            </button>
            <button
              onClick={() => navigate("/student/notifications")}
              className="relative p-2 rounded-lg hover:bg-gray-100"
            >
              <Bell size={16} className="text-gray-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
