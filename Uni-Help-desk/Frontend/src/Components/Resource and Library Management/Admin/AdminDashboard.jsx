import { useState, useEffect } from "react";
import { Users, BookOpen, Download, Eye, TrendingUp, AlertCircle, CheckCircle2, Clock, BarChart2, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { adminAPI } from "../../../services/api";
import toast from "react-hot-toast";

const activityData = [
  { day: "Mon", uploads: 8, downloads: 145, views: 320 },
  { day: "Tue", uploads: 12, downloads: 198, views: 410 },
  { day: "Wed", uploads: 6, downloads: 167, views: 280 },
  { day: "Thu", uploads: 15, downloads: 234, views: 520 },
  { day: "Fri", uploads: 11, downloads: 289, views: 640 },
  { day: "Sat", uploads: 4, downloads: 98, views: 180 },
  { day: "Sun", uploads: 2, downloads: 67, views: 120 },
];

const logColor = {
  upload: "text-blue-500 bg-blue-50",
  reserve: "text-purple-500 bg-purple-50",
  user: "text-emerald-500 bg-emerald-50",
  fine: "text-amber-500 bg-amber-50",
  delete: "text-red-500 bg-red-50",
  return: "text-teal-500 bg-teal-50",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [overdue, setOverdue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminAPI.getStats(),
      adminAPI.getOverdue(),
    ])
      .then(([s, o]) => { setStats(s); setOverdue(o); })
      .catch(() => toast.error("Failed to load dashboard data"))
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: "Total Users", value: stats.totalUsers?.toLocaleString() || "0", change: "Registered accounts", icon: Users, gradient: "from-blue-500 to-cyan-500" },
    { label: "Total Resources", value: stats.totalResources?.toLocaleString() || "0", change: "Published materials", icon: BookOpen, gradient: "from-violet-500 to-purple-500" },
    { label: "Total Downloads", value: stats.totalDownloads?.toLocaleString() || "0", change: "All time", icon: Download, gradient: "from-emerald-500 to-teal-500" },
    { label: "Active Loans", value: stats.totalReservations?.toLocaleString() || "0", change: `${stats.overdueBooks || 0} overdue`, icon: Eye, gradient: "from-amber-500 to-orange-500" },
  ] : [];

  const alerts = [
    stats?.overdueBooks > 0 && { text: `${stats.overdueBooks} overdue books need follow-up`, type: "warning" },
    overdue.length > 0 && { text: `${overdue.length} active overdue reservations`, type: "warning" },
    stats?.totalReservations > 0 && { text: `${stats.totalReservations} books currently on loan`, type: "info" },
  ].filter(Boolean);

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">System overview and monitoring</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="text-amber-400 animate-spin" />
        </div>
      )}

      {!loading && (
        <>
          {/* Alerts */}
          {alerts.map((a, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border text-sm ${a.type === "warning" ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-blue-50 border-blue-200 text-blue-700"}`}>
              <AlertCircle size={15} /> {a.text}
            </div>
          ))}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map(({ label, value, change, icon: Icon, gradient }) => (
              <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <TrendingUp size={13} className="text-gray-300" />
                </div>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
                <p className="text-xs text-gray-400 font-medium mt-1">{label}</p>
                <p className="text-[10px] text-emerald-500 font-semibold mt-1">{change}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart2 size={14} className="text-amber-500" /> Weekly Activity (Sample)
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={activityData} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.1)", fontSize: 12 }} />
                  <Bar dataKey="downloads" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Downloads" />
                  <Bar dataKey="uploads" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Uploads" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Eye size={14} className="text-blue-500" /> View Trends (Sample)
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.1)", fontSize: 12 }} />
                  <Area type="monotone" dataKey="views" stroke="#F59E0B" strokeWidth={2.5} fill="url(#viewGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Overdue Reservations */}
          {overdue.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <AlertCircle size={14} className="text-red-500" /> Overdue Reservations
              </h2>
              <div className="space-y-2">
                {overdue.slice(0, 6).map((o, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                      <Clock size={14} className="text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800">{o.bookId?.title || "Unknown Book"} <span className="font-normal text-gray-500">by {o.userId?.name || "Unknown"}</span></p>
                      <p className="text-xs text-red-500">Due: {new Date(o.returnDate).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs text-red-600 font-bold">{o.userId?.email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
