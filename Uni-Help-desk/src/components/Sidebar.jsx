import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, LifeBuoy, Book, Bell, Users, 
  LogOut, ShieldCheck, GraduationCap, Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function Sidebar() {
  const { currentUser, logout, unreadCount } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  
  const navLinkClass = (path) => {
    const active = isActive(path);
    return `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors mt-1 ${
      active 
        ? 'bg-blue-50 text-blue-600' 
        : 'text-text-secondary hover:bg-slate-50 hover:text-text-primary'
    }`;
  };

  const navIconClass = (path) => {
    return isActive(path) ? 'text-blue-600' : 'text-text-muted';
  };

  if (!currentUser) return null;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-brand-border flex flex-col z-40 overflow-y-auto">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-brand-border/50">
        <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
          <LifeBuoy size={20} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-text-primary leading-tight tracking-tight">UniHelpDesk</span>
          <span className="text-[0.65rem] font-bold text-text-muted uppercase tracking-wider">{currentUser.role} Portal</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="px-3 py-5 flex-1 flex flex-col gap-1">
        <Link to="/profile" className={navLinkClass('/profile')}>
          <div className="flex items-center gap-3">
            <LayoutDashboard size={18} className={navIconClass('/profile')} />
            Dashboard
          </div>
        </Link>
        <Link to="#" className={navLinkClass('/tickets')} onClick={(e) => e.preventDefault()}>
          <div className="flex items-center gap-3">
            <LifeBuoy size={18} className={navIconClass('/tickets')} />
            My Tickets
          </div>
        </Link>
        <Link to="#" className={navLinkClass('/knowledge')} onClick={(e) => e.preventDefault()}>
          <div className="flex items-center gap-3">
            <Book size={18} className={navIconClass('/knowledge')} />
            Knowledge Base
          </div>
        </Link>
        <Link to="/notifications" className={navLinkClass('/notifications')}>
          <div className="flex items-center gap-3">
            <Bell size={18} className={navIconClass('/notifications')} />
            Notifications
          </div>
          {unreadCount > 0 && (
            <span className="bg-accent-red text-white text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
              {unreadCount}
            </span>
          )}
        </Link>

        {currentUser.role === 'admin' && (
          <>
            <div className="mt-6 mb-2 px-3 text-[0.65rem] font-bold text-text-muted uppercase tracking-wider">Administration</div>
            <Link to="/admin/users" className={navLinkClass('/admin/users')}>
              <div className="flex items-center gap-3">
                <Users size={18} className={navIconClass('/admin/users')} />
                User Management
              </div>
            </Link>
          </>
        )}
      </div>

      {/* Switch Portal Mock (From design req) */}
      <div className="px-6 py-4 border-t border-brand-border/50">
        <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-wider mb-3">Switch Portal</div>
        <div className="flex flex-col gap-2.5">
          <button className="flex items-center gap-2.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors text-left">
            <GraduationCap size={15} className="text-text-muted" /> Student Portal
          </button>
          <button className="flex items-center gap-2.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors text-left">
            <Briefcase size={15} className="text-text-muted" /> Staff Portal
          </button>
          <button className="flex items-center gap-2.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors text-left">
            <ShieldCheck size={15} className="text-text-muted" /> Admin Portal
          </button>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-brand-border bg-slate-50/50 mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar w-9 h-9 text-xs shrink-0">{getInitials(currentUser.name)}</div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-text-primary truncate">{currentUser.name}</div>
            <div className="text-xs text-text-muted truncate">ID: {currentUser.studentId || currentUser.id.split('-')[0].toUpperCase()}</div>
          </div>
          <button 
            onClick={logout}
            className="p-1.5 text-text-muted hover:text-accent-red hover:bg-red-50 rounded-lg transition-colors shrink-0"
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
