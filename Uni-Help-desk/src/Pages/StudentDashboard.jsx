import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, BookMarked, Bell, Search, Upload, Download,
  RotateCcw, Clock, TrendingUp, Star, AlertCircle, ChevronRight,
} from "lucide-react";

const stats = [
  { label: "Total Resources", value: "248", change: "+12 this week", icon: BookOpen, gradient: "from-sky-400 to-blue-500" },
  { label: "Borrowed Books", value: "12", change: "4 active loans", icon: Download, gradient: "from-teal-400 to-emerald-500" },
  { label: "Due Soon", value: "3", change: "Within 7 days", icon: Clock, gradient: "from-amber-400 to-orange-500" },
  { label: "Notifications", value: "8", change: "3 unread", icon: Bell, gradient: "from-purple-400 to-violet-500" },
];

const recentResources = [
  { title: "Machine Learning Basics", category: "Computer Science", type: "PDF", stars: 4.8, downloads: 1240, color: "from-blue-400 to-cyan-400" },
  { title: "Data Structures & Algorithms", category: "Computer Science", type: "PDF", stars: 4.6, downloads: 980, color: "from-violet-400 to-purple-500" },
  { title: "React Design Patterns", category: "Web Development", type: "PDF", stars: 4.9, downloads: 2100, color: "from-rose-400 to-pink-500" },
  { title: "Clean Architecture", category: "Software Engineering", type: "EPUB", stars: 4.7, downloads: 1560, color: "from-amber-400 to-orange-400" },
];

const recentActivity = [
  { type: "Downloaded", title: "Machine Learning Basics.pdf", time: "2 hours ago", icon: Download, color: "text-blue-500 bg-blue-50" },
  { type: "Reserved", title: "Clean Architecture", time: "5 hours ago", icon: BookMarked, color: "text-purple-500 bg-purple-50" },
  { type: "Downloaded", title: "React Design Patterns.pdf", time: "1 day ago", icon: Download, color: "text-blue-500 bg-blue-50" },
  { type: "Returned", title: "Data Structures & Algorithms", time: "2 days ago", icon: RotateCcw, color: "text-green-500 bg-green-50" },
  { type: "Downloaded", title: "System Design Interview.pdf", time: "3 days ago", icon: Download, color: "text-blue-500 bg-blue-50" },
];

const dueSoonBooks = [
  { title: "React Fundamentals", author: "John Doe", due: "Mar 22, 2026", daysLeft: 1, urgency: "high" },
  { title: "Clean Code", author: "Robert Martin", due: "Mar 24, 2026", daysLeft: 3, urgency: "medium" },
  { title: "Design Patterns", author: "Gang of Four", due: "Mar 26, 2026", daysLeft: 5, urgency: "low" },
];

const urgencyStyle = {
  high: { badge: "text-red-600 bg-red-50 border-red-200", text: "Urgent" },
  medium: { badge: "text-orange-500 bg-orange-50 border-orange-200", text: "Soon" },
  low: { badge: "text-yellow-600 bg-yellow-50 border-yellow-200", text: "Upcoming" },
};

export default function StudentDashboard() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  return (
    <div className="px-6 py-6 space-y-6 max-w-7xl mx-auto">
      {/* Top bar */}
      <div className="hidden lg:flex items-center gap-4">
        <div className="flex-1 relative max-w-lg">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources, books, authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && navigate("/student/resources")}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-300 transition-all duration-150 shadow-sm"
          />
        </div>
        <button
          onClick={() => navigate("/student/notifications")}
          className="relative w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 shadow-sm transition-colors"
        >
          <Bell size={16} className="text-gray-500" />
          <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-1">4</span>
        </button>
      </div>

      {/* Welcome banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="relative z-10">
          <h1 className="text-4xl font-semibold text-gray-600">Welcome back, Dinithi Amanda</h1>
          <p className="text-blue-100 text-sm mt-1">You have 3 books due soon and 8 new notifications.</p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => navigate("/student/resources")}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-xl transition-all border border-white/20"
            >
              <Search size={14} /> Browse Resources
            </button>
            <button
              onClick={() => navigate("/student/library")}
              className="flex items-center gap-2 bg-white text-blue-600 text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-50 transition-all shadow-md"
            >
              <BookOpen size={14} /> Library Catalog
            </button>
          </div>
        </div>
        {/* decorative circles */}
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full" />
        <div className="absolute -right-5 -bottom-12 w-36 h-36 bg-white/5 rounded-full" />
        <div className="absolute right-24 top-4 w-12 h-12 bg-white/10 rounded-full" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, icon: Icon, gradient }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group cursor-default">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
                <Icon size={20} className="text-white" />
              </div>
              <TrendingUp size={14} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-xs text-gray-400 font-medium mt-1">{label}</p>
            <p className="text-[10px] text-emerald-500 font-semibold mt-1 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />{change}
            </p>
          </div>
        ))}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Recent Activity</h2>
            <button className="text-xs text-blue-500 hover:text-blue-700 font-medium flex items-center gap-1">
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="space-y-1">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-4 py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors duration-150">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${a.color}`}>
                  <a.icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${a.type === "Downloaded" ? "text-blue-600 bg-blue-50" :
                      a.type === "Reserved" ? "text-purple-600 bg-purple-50" :
                        "text-green-600 bg-green-50"
                      }`}>{a.type}</span>
                    <span className="text-sm font-medium text-gray-700 truncate">{a.title}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-fit">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-2.5">
            {[
              { label: "Search Resources", icon: Search, color: "text-blue-500 bg-blue-50", path: "/student/resources" },
              { label: "Upload Resource", icon: Upload, color: "text-emerald-500 bg-emerald-50", path: "/student/resources" },
              { label: "Reserve a Book", icon: BookMarked, color: "text-purple-500 bg-purple-50", path: "/student/library" },
              { label: "View Notifications", icon: Bell, color: "text-amber-500 bg-amber-50", path: "/student/notifications" },
            ].map(({ label, icon: Icon, color, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-150 text-left"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon size={15} />
                </div>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recently Added Resources */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">Recently Added Resources</h2>
          <button onClick={() => navigate("/student/resources")} className="text-xs text-blue-500 hover:text-blue-700 font-medium flex items-center gap-1">
            See all <ChevronRight size={13} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentResources.map((r, i) => (
            <div
              key={i}
              onClick={() => navigate(`/student/resources/${i + 1}`)}
              className="group cursor-pointer rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <div className={`h-24 bg-gradient-to-br ${r.color} flex items-center justify-center relative`}>
                <BookOpen size={32} className="text-white/80" />
                <span className="absolute top-2 right-2 bg-white/20 backdrop-blur text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">{r.type}</span>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">{r.title}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">{r.category}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star size={11} fill="currentColor" />
                    <span className="text-[11px] font-semibold text-gray-600">{r.stars}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Download size={11} />
                    <span className="text-[11px]">{r.downloads.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Books Due Soon */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-800">Books Due Soon</h2>
            <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100 flex items-center gap-1">
              <AlertCircle size={10} /> 3 alerts
            </span>
          </div>
          <button className="text-xs text-blue-500 hover:text-blue-700 font-medium flex items-center gap-1">
            View all <ChevronRight size={13} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {dueSoonBooks.map((b, i) => (
            <div key={i} className={`p-4 rounded-xl border ${b.urgency === "high" ? "bg-red-50 border-red-200" :
              b.urgency === "medium" ? "bg-orange-50 border-orange-200" :
                "bg-yellow-50 border-yellow-200"
              }`}>
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-800 text-sm">{b.title}</h4>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${urgencyStyle[b.urgency].badge}`}>
                  {urgencyStyle[b.urgency].text}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">by {b.author}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={11} /> Due: {b.due}
                </span>
                <span className={`text-xs font-bold ${b.urgency === "high" ? "text-red-600" :
                  b.urgency === "medium" ? "text-orange-500" : "text-yellow-600"
                  }`}>{b.daysLeft}d left</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
