import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Plus, Filter, Clock, CheckCircle, AlertCircle, 
  ChevronRight, MessageSquare, Tag, User 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const statusConfig = {
  open: { label: 'Open', color: 'badge-blue' },
  pending: { label: 'Pending', color: 'badge-orange' },
  resolved: { label: 'Resolved', color: 'badge-green' },
  closed: { label: 'Closed', color: 'badge-gray' },
};

const priorityConfig = {
  low: 'text-gray-400',
  medium: 'text-blue-400',
  high: 'text-orange-400',
  urgent: 'text-red-500',
};

export default function TicketsPage() {
  const { getTickets, getAllTickets, isAdmin, isStaff } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      const data = (isAdmin() || isStaff()) ? await getAllTickets() : await getTickets();
      setTickets(data);
      setLoading(false);
    };
    fetchTickets();
  }, []);

  const filtered = tickets.filter(t => {
    const matchStatus = filter === 'all' || t.status === filter;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                       t.category.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="flex flex-col gap-6 pt-2 pb-12 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-black text-text-primary mb-1">Support Tickets</h1>
          <p className="text-sm text-text-secondary">Manage and track your support requests and inquiries.</p>
        </div>
        <Link to="/tickets/new" className="btn btn-primary shadow-lg shadow-blue-500/20 px-5">
          <Plus size={18} /> New Ticket
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="card flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-brand-secondary border-brand-border">
            <div className="flex gap-2 p-1 bg-brand-primary rounded-lg border border-brand-border w-full sm:w-auto">
              {['all', 'open', 'pending', 'resolved'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${filter === s ? 'bg-blue-500 text-white shadow-md' : 'text-text-muted hover:text-text-primary'}`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="text"
                placeholder="Search tickets..."
                className="form-input pl-10 py-2 text-sm bg-brand-primary border-brand-border focus:ring-2 focus:ring-blue-500/20"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Ticket List */}
          <div className="grid grid-cols-1 gap-4">
            {filtered.length === 0 ? (
              <div className="card py-20 flex flex-col items-center justify-center text-center opacity-70">
                <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mb-4">
                  <MessageSquare size={32} className="text-text-muted" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">No tickets found</h3>
                <p className="text-sm text-text-secondary">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              filtered.map(ticket => (
                <div key={ticket._id} className="card p-0 overflow-hidden hover:ring-2 hover:ring-blue-500/20 transition-all group">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-1 flex flex-col gap-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`badge ${statusConfig[ticket.status].color} text-[0.65rem] font-black uppercase tracking-wider`}>
                          {statusConfig[ticket.status].label}
                        </span>
                        <div className="flex items-center gap-1.5 text-[0.65rem] font-bold text-text-muted bg-brand-primary px-2 py-0.5 rounded border border-brand-border">
                          <Tag size={10} /> {ticket.category}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-black text-text-primary group-hover:text-blue-500 transition-colors">
                        {ticket.title}
                      </h3>
                      
                      <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
                        {ticket.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
                          <Clock size={14} /> Created {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                        {(isAdmin() || isStaff()) && (
                          <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
                            <User size={14} /> From: {ticket.user?.name || 'Unknown'}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <AlertCircle size={14} className={priorityConfig[ticket.priority]} />
                          <span className={priorityConfig[ticket.priority] + " uppercase tracking-tight"}>{ticket.priority} priority</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-brand-secondary dark:bg-slate-900/50 p-4 md:w-16 flex items-center justify-center border-t md:border-t-0 md:border-l border-brand-border flex-shrink-0">
                      <ChevronRight size={20} className="text-text-muted group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
