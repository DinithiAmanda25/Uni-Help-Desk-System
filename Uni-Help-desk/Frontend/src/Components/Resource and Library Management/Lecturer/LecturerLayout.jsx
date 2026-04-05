import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Upload, BookOpen, BarChart2, LogOut, Menu, X, GraduationCap } from "lucide-react";

const navItems = [
  { label: "Upload Resource", icon: Upload, path: "/lecturer/upload" },
  { label: "Manage Resources", icon: BookOpen, path: "/lecturer/manage" },
  { label: "Analytics", icon: BarChart2, path: "/lecturer/analytics" },
];

export default function LecturerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-md">
              <GraduationCap size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="font-bold text-gray-800 text-sm">Uni Help Desk</p>
              <p className="text-[10px] text-gray-400 font-medium">Lecturer Portal</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ label, icon: Icon, path }) => {
            const active = location.pathname === path;
            return (
              <button key={label} onClick={() => { navigate(path); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? "bg-violet-50 text-violet-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}>
                <Icon size={18} className={active ? "text-violet-500" : "text-gray-400"} />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-gray-100">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 px-3 py-1">Switch Portal</p>
          <button onClick={() => navigate("/student/dashboard")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-all">
            <GraduationCap size={14} className="text-gray-400" /> Student Portal
          </button>
          <button onClick={() => navigate("/admin/dashboard")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-all">
            <BarChart2 size={14} className="text-gray-400" /> Admin Portal
          </button>
        </div>

        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">PJ</div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">Prof. Johnson</p>
              <p className="text-[10px] text-gray-400 truncate">Lecturer · Web Dev</p>
            </div>
            <button className="ml-auto p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100"><Menu size={18} className="text-gray-600" /></button>
          <span className="font-bold text-gray-800 text-sm">Uni Help Desk — Lecturer</span>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
