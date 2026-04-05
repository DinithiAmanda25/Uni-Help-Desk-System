import { Link } from 'react-router-dom';
import { Book, LifeBuoy, Clock, Bell, Search, TrendingUp, Users, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { currentUser, unreadCount, getAllUsers, isAdmin } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const users = await getAllUsers();
      setAllUsers(users);
      setLoading(false);
    };
    fetchStats();
  }, []);
  
  // Stats calculation
  const totalUsers = allUsers.length;
  const activeUsers = allUsers.filter(u => u.isActive).length;

  return (
    <div className="flex flex-col gap-6 pt-2 pb-12 animate-fadeIn">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-400 rounded-3xl p-8 sm:p-12 text-white shadow-[0_10px_40px_-10px_rgba(59,130,246,0.5)]">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 right-32 w-48 h-48 bg-white opacity-10 rounded-full blur-xl translate-y-1/3 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">
            Welcome back, {currentUser?.name}
          </h1>
          <p className="text-blue-50 text-sm sm:text-base mb-8 opacity-90 font-medium">
            You have {isAdmin() ? '5 pending approvals' : '3 tickets requiring action'} and {unreadCount} new notifications.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Link to="#" className="btn bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm shadow-sm">
              <Search size={16} /> Browse Knowledge Base
            </Link>
            <Link to="#" className="btn bg-white text-blue-600 hover:bg-blue-50 shadow-md">
              <LifeBuoy size={16} /> Submit Ticket
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {isAdmin() ? (
          <>
            {/* Admin Stats */}
            <div className="card border-none ring-1 ring-slate-100 p-6 flex flex-col relative overflow-hidden group">
              <TrendingUp size={16} className="absolute top-6 right-6 text-slate-300" />
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <Users size={24} />
              </div>
              <div className="text-3xl font-black text-slate-800 mb-1">{totalUsers}</div>
              <div className="text-sm text-slate-500 font-medium mb-3">Total Users</div>
              <div className="text-xs font-bold text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> +{(totalUsers * 0.1).toFixed(0)} this week</div>
            </div>

            <div className="card border-none ring-1 ring-slate-100 p-6 flex flex-col relative overflow-hidden group">
              <TrendingUp size={16} className="absolute top-6 right-6 text-slate-300" />
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <UserCheck size={24} />
              </div>
              <div className="text-3xl font-black text-slate-800 mb-1">{activeUsers}</div>
              <div className="text-sm text-slate-500 font-medium mb-3">Active Accounts</div>
              <div className="text-xs font-bold text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Healthy</div>
            </div>

            <div className="card border-none ring-1 ring-slate-100 p-6 flex flex-col relative overflow-hidden group">
              <TrendingUp size={16} className="absolute top-6 right-6 text-slate-300" />
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <Clock size={24} />
              </div>
              <div className="text-3xl font-black text-slate-800 mb-1">5</div>
              <div className="text-sm text-slate-500 font-medium mb-3">Pending Requests</div>
              <div className="text-xs font-bold text-orange-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span> Needs action</div>
            </div>

            <div className="card border-none ring-1 ring-slate-100 p-6 flex flex-col relative overflow-hidden group">
              <TrendingUp size={16} className="absolute top-6 right-6 text-slate-300" />
              <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <Bell size={24} />
              </div>
              <div className="text-3xl font-black text-slate-800 mb-1">{unreadCount}</div>
              <div className="text-sm text-slate-500 font-medium mb-3">Alerts</div>
              <div className="text-xs font-bold text-purple-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span> Unread alerts</div>
            </div>
          </>
        ) : (
          <>
            {/* Student Stats exactly like image layout adaptions */}
            <div className="card border-none ring-1 ring-slate-100 p-6 flex flex-col relative overflow-hidden group">
              <TrendingUp size={16} className="absolute top-6 right-6 text-slate-300" />
              <div className="w-12 h-12 bg-[#0ea5e9] rounded-2xl flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <Book size={24} />
              </div>
              <div className="text-3xl font-black text-slate-800 mb-1">248</div>
              <div className="text-sm text-slate-500 font-medium mb-3">Total Resources</div>
              <div className="text-xs font-bold text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> +12 this week</div>
            </div>

            <div className="card border-none ring-1 ring-slate-100 p-6 flex flex-col relative overflow-hidden group">
              <TrendingUp size={16} className="absolute top-6 right-6 text-slate-300" />
              <div className="w-12 h-12 bg-[#10b981] rounded-2xl flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <LifeBuoy size={24} />
              </div>
              <div className="text-3xl font-black text-slate-800 mb-1">12</div>
              <div className="text-sm text-slate-500 font-medium mb-3">Active Tickets</div>
              <div className="text-xs font-bold text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> 4 resolved recently</div>
            </div>

            <div className="card border-none ring-1 ring-slate-100 p-6 flex flex-col relative overflow-hidden group">
              <TrendingUp size={16} className="absolute top-6 right-6 text-slate-300" />
              <div className="w-12 h-12 bg-[#f59e0b] rounded-2xl flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <Clock size={24} />
              </div>
              <div className="text-3xl font-black text-slate-800 mb-1">3</div>
              <div className="text-sm text-slate-500 font-medium mb-3">Pending Action</div>
              <div className="text-xs font-bold text-[#10b981] flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></span> Updates required</div>
            </div>

            <div className="card border-none ring-1 ring-slate-100 p-6 flex flex-col relative overflow-hidden group">
              <TrendingUp size={16} className="absolute top-6 right-6 text-slate-300" />
              <div className="w-12 h-12 bg-[#a855f7] rounded-2xl flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <Bell size={24} />
              </div>
              <div className="text-3xl font-black text-slate-800 mb-1">{unreadCount > 0 ? unreadCount : '8'}</div>
              <div className="text-sm text-slate-500 font-medium mb-3">Notifications</div>
              <div className="text-xs font-bold text-[#10b981] flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></span> {unreadCount} unread</div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
