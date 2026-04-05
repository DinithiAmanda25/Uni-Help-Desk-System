import { BarChart2, TrendingUp, Download, Eye, Users, Star, BookOpen, ArrowUp, ArrowDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";

const downloadData = [
  { month: "Oct", downloads: 320 },
  { month: "Nov", downloads: 440 },
  { month: "Dec", downloads: 280 },
  { month: "Jan", downloads: 560 },
  { month: "Feb", downloads: 720 },
  { month: "Mar", downloads: 890 },
];

const viewsData = [
  { week: "Wk1", views: 240 },
  { week: "Wk2", views: 380 },
  { week: "Wk3", views: 310 },
  { week: "Wk4", views: 520 },
  { week: "Wk5", views: 680 },
  { week: "Wk6", views: 590 },
];

const categoryData = [
  { name: "Web Dev", value: 45, color: "#8B5CF6" },
  { name: "JavaScript", value: 30, color: "#06B6D4" },
  { name: "Node.js", value: 15, color: "#10B981" },
  { name: "Other", value: 10, color: "#F59E0B" },
];

const topResources = [
  { title: "React Design Patterns", downloads: 2100, views: 3400, rating: 4.9, trend: "up" },
  { title: "Node.js Best Practices", downloads: 1560, views: 2100, rating: 4.7, trend: "up" },
  { title: "Advanced CSS Techniques", downloads: 876, views: 1200, rating: 4.5, trend: "down" },
  { title: "Web Performance Guide", downloads: 420, views: 650, rating: 4.3, trend: "up" },
];

export default function LecturerAnalytics() {
  return (
    <div className="px-6 py-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <p className="text-sm text-gray-400 mt-1">Track engagement and performance of your resources</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Downloads", value: "4,956", change: "+18%", up: true, icon: Download, color: "from-violet-400 to-purple-500" },
          { label: "Total Views", value: "7,350", change: "+24%", up: true, icon: Eye, color: "from-blue-400 to-cyan-500" },
          { label: "Active Students", value: "312", change: "+8%", up: true, icon: Users, color: "from-emerald-400 to-teal-500" },
          { label: "Avg Rating", value: "4.7", change: "+0.2", up: true, icon: Star, color: "from-amber-400 to-orange-500" },
        ].map(({ label, value, change, up, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                <Icon size={18} className="text-white" />
              </div>
              <span className={`text-xs font-semibold flex items-center gap-0.5 px-2 py-0.5 rounded-full ${up ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"}`}>
                {up ? <ArrowUp size={10} /> : <ArrowDown size={10} />} {change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Downloads bar chart */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Download size={14} className="text-violet-500" /> Monthly Downloads
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={downloadData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.1)", fontSize: 12 }} />
              <Bar dataKey="downloads" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Views line chart */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Eye size={14} className="text-blue-500" /> Weekly Views
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.1)", fontSize: 12 }} />
              <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 4, fill: "#3B82F6" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category pie + Top resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pie */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart2 size={14} className="text-violet-500" /> Category Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={75} dataKey="value" stroke="none">
                {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top resources table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={14} className="text-violet-500" /> Top Performing Resources
          </h2>
          <div className="space-y-3">
            {topResources.map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-xs font-bold text-gray-400 w-5 shrink-0">#{i + 1}</span>
                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                  <BookOpen size={14} className="text-violet-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{r.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Download size={10} />{r.downloads.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Eye size={10} />{r.views.toLocaleString()}</span>
                    <span className="text-xs text-amber-500 flex items-center gap-1"><Star size={10} fill="currentColor" />{r.rating}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-lg ${r.trend === "up" ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"}`}>
                  {r.trend === "up" ? <ArrowUp size={10} /> : <ArrowDown size={10} />} {r.trend}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
