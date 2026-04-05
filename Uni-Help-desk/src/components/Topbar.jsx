import { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Topbar() {
  const [search, setSearch] = useState('');
  const { unreadCount } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-brand-border px-6 py-4 flex items-center justify-between gap-4">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          className="w-full bg-slate-50 border border-brand-border rounded-xl pl-10 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
          placeholder="Search tickets, articles, users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Link 
          to="/notifications" 
          className="relative p-2 text-text-muted hover:text-text-primary hover:bg-slate-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-red rounded-full ring-2 ring-white"></span>
          )}
        </Link>
      </div>
    </header>
  );
}
