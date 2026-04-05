import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Library, Settings, LogOut, Menu, X, ShieldCheck, GraduationCap, BarChart2 } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "User Management", icon: Users, path: "/admin/users" },
  { label: "Library Management", icon: Library, path: "/admin/library" },
  { label: "System Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="font-bold text-white text-sm">Uni Help Desk</p>
              <p className="text-[10px] text-slate-400 font-medium">Admin Portal</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800">
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ label, icon: Icon, path }) => {
            const active = location.pathname === path;
            return (
              <button key={label} onClick={() => { navigate(path); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? "bg-amber-500/20 text-amber-400" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
                <Icon size={18} className={active ? "text-amber-400" : "text-slate-500"} />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-slate-800">
          <p className="text-[10px] uppercase tracking-widest text-slate-600 px-3 py-1">Switch Portal</p>
          <button onClick={() => navigate("/student/dashboard")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-800 hover:text-blue-400 transition-all">
            <GraduationCap size={14} /> Student Portal
          </button>
          <button onClick={() => navigate("/lecturer/upload")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-800 hover:text-violet-400 transition-all">
            <BarChart2 size={14} /> Lecturer Portal
          </button>
        </div>

        <div className="px-4 py-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold shrink-0">AD</div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">Admin User</p>
              <p className="text-[10px] text-slate-400 truncate">System Administrator</p>
            </div>
            <button className="ml-auto p-1.5 rounded-lg hover:bg-red-900/20 text-slate-500 hover:text-red-400 transition-colors">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100"><Menu size={18} className="text-gray-600" /></button>
          <span className="font-bold text-gray-800 text-sm">LibraryHub — Admin</span>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
