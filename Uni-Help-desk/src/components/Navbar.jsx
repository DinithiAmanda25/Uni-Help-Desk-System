import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, LogOut, Settings, ChevronDown, Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function Navbar() {
  const { currentUser, logout, unreadCount, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleColor = {
    admin: 'badge-purple',
    staff: 'badge-blue',
    student: 'badge-green',
  };

  return (
    <nav className="sticky top-0 z-50 bg-brand-primary/90 backdrop-blur-xl border-b border-brand-border">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto px-6 pr-4 h-16">
        {/* Logo */}
        <Link to={currentUser ? '/profile' : '/'} className="flex items-center gap-2.5 shrink-0 hover:opacity-90 transition-opacity">
          <div className="w-[34px] h-[34px] bg-gradient-to-br from-blue-500 to-accent-purple rounded-lg flex items-center justify-center text-white">
            <Shield size={18} />
          </div>
          <span className="text-[1.1rem] font-extrabold text-text-primary tracking-tight">
            UniHelp<span className="text-blue-400">Desk</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        {currentUser && (
          <div className="hidden md:flex gap-1">
            <Link to="/dashboard" className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-blue-400 bg-blue-500/10' : 'text-text-secondary hover:text-text-primary hover:bg-brand-card'}`}>Dashboard</Link>
            <Link to="/tickets" className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${location.pathname.startsWith('/tickets') ? 'text-blue-400 bg-blue-500/10' : 'text-text-secondary hover:text-text-primary hover:bg-brand-card'}`}>Tickets</Link>
            <Link to="/profile" className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/profile' ? 'text-blue-400 bg-blue-500/10' : 'text-text-secondary hover:text-text-primary hover:bg-brand-card'}`}>Profile</Link>
            {isAdmin() && (
              <Link to="/admin/users" className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${location.pathname.startsWith('/admin') ? 'text-blue-400 bg-blue-500/10' : 'text-text-secondary hover:text-text-primary hover:bg-brand-card'}`}>
                User Management
              </Link>
            )}
          </div>
        )}

        {/* Right Side */}
        <div className="flex flex-row items-center gap-2">
          {currentUser ? (
            <>
              {/* Notification Bell */}
              <Link to="/notifications" className="relative w-[38px] h-[38px] flex items-center justify-center rounded-lg text-text-secondary hover:bg-brand-card hover:text-text-primary transition-colors" title="Notifications" id="notification-bell">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-accent-red rounded-full text-[10px] font-bold text-white flex items-center justify-center px-[3px] border-[1.5px] border-brand-primary" id="notification-badge">{unreadCount}</span>
                )}
              </Link>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center gap-2 bg-brand-card border border-brand-border rounded-lg p-1 pr-2.5 cursor-pointer text-text-primary hover:border-brand-border-focus transition-colors"
                  onClick={() => setDropdownOpen(o => !o)}
                  id="user-menu-trigger"
                >
                  <div className="avatar avatar-sm">
                    {getInitials(currentUser.name)}
                  </div>
                  <span className="hidden md:block text-sm font-semibold">{currentUser.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 text-text-muted ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute top-[calc(100%+8px)] right-0 min-w-[240px] bg-brand-card border border-brand-border rounded-2xl shadow-2xl overflow-hidden z-[200] animate-fadeIn" id="user-dropdown-menu">
                    <div className="flex items-center gap-3 p-4">
                      <div className="avatar">{getInitials(currentUser.name)}</div>
                      <div>
                        <div className="text-[0.9rem] font-bold text-text-primary">{currentUser.name}</div>
                        <div className="text-[0.78rem] text-text-muted mt-[1px]">{currentUser.email}</div>
                        <span className={`badge ${roleColor[currentUser.role] || 'badge-gray'} mt-1`}>
                          {currentUser.role}
                        </span>
                      </div>
                    </div>
                    <div className="h-px bg-brand-border" />
                    <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-brand-card-hover hover:text-text-primary transition-colors w-full text-left" onClick={() => setDropdownOpen(false)} id="menu-profile">
                      <User size={15} /> My Profile
                    </Link>
                    <Link to="/notifications" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-brand-card-hover hover:text-text-primary transition-colors w-full text-left" onClick={() => setDropdownOpen(false)} id="menu-notifications">
                      <Bell size={15} /> Notifications {unreadCount > 0 && <span className="badge badge-blue">{unreadCount}</span>}
                    </Link>
                    {isAdmin() && (
                      <Link to="/admin/users" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-brand-card-hover hover:text-text-primary transition-colors w-full text-left" onClick={() => setDropdownOpen(false)} id="menu-admin">
                        <Settings size={15} /> User Management
                      </Link>
                    )}
                    <div className="h-px bg-brand-border" />
                    <button className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-accent-red hover:bg-accent-red/10 transition-colors w-full text-left" onClick={handleLogout} id="menu-logout">
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link to="/login" className="btn btn-secondary btn-sm" id="nav-login-btn">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register-btn">Register</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button className="block md:hidden p-1 text-text-secondary" onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="p-3 pt-0 border-t border-brand-border flex flex-col gap-0.5 animate-fadeIn md:hidden bg-brand-primary/95 backdrop-blur-xl absolute top-16 left-0 right-0 border-b shadow-lg z-[190]">
          {currentUser ? (
            <>
              <Link to="/dashboard" className="px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-brand-card hover:text-text-primary transition-colors text-left">Dashboard</Link>
              <Link to="/tickets" className="px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-brand-card hover:text-text-primary transition-colors text-left">Support Tickets</Link>
              <Link to="/profile" className="px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-brand-card hover:text-text-primary transition-colors text-left">Profile</Link>
              <Link to="/notifications" className="px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-brand-card hover:text-text-primary transition-colors text-left">
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </Link>
              {isAdmin() && <Link to="/admin/users" className="px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-brand-card hover:text-text-primary transition-colors text-left">User Management</Link>}
              <button className="px-3 py-2.5 rounded-lg text-sm font-medium text-accent-red hover:bg-brand-card hover:text-accent-red transition-colors text-left" onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-brand-card hover:text-text-primary transition-colors text-left">Login</Link>
              <Link to="/register" className="px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-brand-card hover:text-text-primary transition-colors text-left">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
