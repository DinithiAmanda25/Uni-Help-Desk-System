import {
  Search,
  Bell,
  BookOpen,
  Clock,
  Download,
  LayoutDashboard,
  Library,
  Book,
  ArrowUpRight,
  LogOut,
  LayoutGrid,
  FileText,
  User,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const recentActivity = [
  { action: "Downloaded", title: "Machine Learning Basics.pdf", time: "2 hours ago", icon: "download" },
  { action: "Reserved",   title: "Clean Architecture",          time: "5 hours ago", icon: "book" },
  { action: "Downloaded", title: "React Design Patterns.pdf",   time: "1 day ago",   icon: "download" },
  { action: "Returned",   title: "Data Structures & Algorithms",time: "2 days ago",  icon: "return" },
  { action: "Downloaded", title: "System Design Interview.pdf", time: "3 days ago",  icon: "download" },
];

const recentResources = [
  { title: "Machine Learning Basics", category: "Computer Science", rating: 4.8, downloads: 1240, format: "PDF" },
  { title: "Data Structures & Algorithms", category: "Computer Science", rating: 4.6, downloads: 980, format: "PDF" },
  { title: "React Design Patterns", category: "Web Development", rating: 4.9, downloads: 2100, format: "EPUB" },
  { title: "Clean Architecture", category: "Software Engineering", rating: 4.7, downloads: 1560, format: "PDF" },
];

const dueBooks = [
  { title: "React Fundamentals", author: "John Doe",      due: "Mar 22, 2026", daysLeft: "1d left",  status: "urgent" },
  { title: "Clean Code",         author: "Robert Martin", due: "Mar 24, 2026", daysLeft: "3d left",  status: "soon" },
  { title: "Design Patterns",    author: "Gang of Four",  due: "Mar 26, 2026", daysLeft: "5d left",  status: "upcoming" },
];

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function StdResourceDashboard() {
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <div>
              <p className="text-[15px] font-bold text-gray-900 leading-none">LibraryHub</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Student Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <NavItem icon={<LayoutDashboard size={16} />} label="Dashboard"        active />
          <NavItem icon={<Library size={16} />}         label="Resource Library" />
          <NavItem icon={<Book size={16} />}            label="Book Catalog"     />
          <NavItem icon={<Bell size={16} />}            label="Notifications"    badge={4} />
        </nav>

        {/* Switch Portal */}
        <div className="px-3 pb-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-3 mb-2">
            Switch Portal
          </p>
          <NavItem icon={<User size={16} />}       label="Lecturer Portal" />
          <NavItem icon={<LayoutGrid size={16} />} label="Admin Portal"    />
        </div>

        {/* User */}
        <div className="px-3 pb-4 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
              JS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-gray-800 truncate">Dinithi Amanda</p>
              <p className="text-[11px] text-gray-400 truncate">Student ID: IT23819788 </p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-8 py-3 flex items-center gap-4 shrink-0">
          <div className="relative flex-1 max-w-lg">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources, books, authors..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
            />
          </div>
          <div className="relative ml-auto">
            <button className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
              <Bell size={18} />
            </button>
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full px-1">
              4
            </span>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

          {/* ── Welcome Banner ── */}
          <div
            className="rounded-2xl p-8 text-white relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1d80f5 0%, #0ea5e9 55%, #38bdf8 100%)",
            }}
          >
            {/* decorative circles */}
            <div className="absolute right-6 top-4 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute right-20 top-12 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />

            <h1 className="text-4xl font-bold mb-2">Welcome back, Dinithi Amanda</h1>
            <p className="text-blue-100 text-sm mb-6">
              You have 3 books due soon and 8 new notifications.
            </p>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg text-sm font-medium transition-all backdrop-blur-sm">
                <Search size={15} />
                Browse Resources
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg text-sm font-medium transition-all backdrop-blur-sm">
                <Book size={15} />
                Library Catalog
              </button>
            </div>
          </div>

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard
              value="248" label="Total Resources"
              sub="+12 this week"   subColor="text-emerald-500"
              iconBg="bg-blue-500"  icon={<BookOpen size={18} className="text-white" />}
            />
            <StatCard
              value="12"  label="Borrowed Books"
              sub="4 active loans"  subColor="text-emerald-500"
              iconBg="bg-emerald-500" icon={<Download size={18} className="text-white" />}
            />
            <StatCard
              value="3"   label="Due Soon"
              sub="Within 7 days"   subColor="text-amber-500"
              iconBg="bg-amber-500"  icon={<Clock size={18} className="text-white" />}
            />
            <StatCard
              value="8"   label="Notifications"
              sub="3 unread"        subColor="text-purple-500"
              iconBg="bg-purple-500" icon={<Bell size={18} className="text-white" />}
            />
          </div>

          {/* ── Recent Activity + Recently Added ── */}
          <div className="grid grid-cols-3 gap-4">

            {/* Recent Activity */}
            <div className="col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 text-sm">Recent Activity</h3>
                <button className="text-xs text-blue-600 hover:underline font-medium">View all</button>
              </div>
              <div className="space-y-3">
                {recentActivity.map((a, i) => (
                  <ActivityRow key={i} {...a} />
                ))}
              </div>
            </div>

            {/* Recently Added Resources */}
            <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 text-sm">Recently Added Resources</h3>
                <button className="text-xs text-blue-600 hover:underline font-medium">See all</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {recentResources.map((r, i) => (
                  <ResourceCard key={i} {...r} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Books Due Soon ── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 text-sm">Books Due Soon</h3>
              <button className="text-xs text-blue-600 hover:underline font-medium">View all</button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {dueBooks.map((b, i) => (
                <DueCard key={i} {...b} />
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavItem({ icon, label, active, badge }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
        active
          ? "bg-blue-50 text-blue-600"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
      }`}
    >
      <span className={active ? "text-blue-600" : "text-gray-400"}>{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({ value, label, sub, subColor, iconBg, icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start justify-between">
      <div>
        <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
        <p className="text-xs text-gray-500 mt-1 mb-2">{label}</p>
        <p className={`text-[11px] font-medium ${subColor}`}>● {sub}</p>
      </div>
      <div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <button className="mt-2 ml-auto flex justify-end text-gray-300 hover:text-gray-500 transition-colors">
          <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}

const actionColors = {
  download: "bg-blue-50 text-blue-600",
  book:     "bg-orange-50 text-orange-600",
  return:   "bg-emerald-50 text-emerald-600",
};
const actionBadge = {
  Downloaded: "bg-blue-100 text-blue-700",
  Reserved:   "bg-orange-100 text-orange-700",
  Returned:   "bg-emerald-100 text-emerald-700",
};

function ActivityRow({ action, title, time, icon }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${actionColors[icon] || "bg-gray-100 text-gray-500"}`}>
        <FileText size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${actionBadge[action] || "bg-gray-100 text-gray-600"}`}>
            {action}
          </span>
          <span className="text-[12px] font-medium text-gray-800 truncate">{title}</span>
        </div>
        <p className="text-[11px] text-gray-400 mt-0.5">{time}</p>
      </div>
    </div>
  );
}

const formatBadge = {
  PDF:  "bg-red-50 text-red-600 border border-red-100",
  EPUB: "bg-purple-50 text-purple-600 border border-purple-100",
};

function ResourceCard({ title, category, rating, downloads, format }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group">
      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
        <BookOpen size={16} className="text-gray-500 group-hover:text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-[13px] font-semibold text-gray-800 truncate flex-1">{title}</p>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0 ${formatBadge[format] || "bg-gray-100 text-gray-600"}`}>
            {format}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mb-1.5">{category}</p>
        <div className="flex items-center gap-3 text-[11px] text-gray-500">
          <span>⭐ {rating}</span>
          <span>⬇ {downloads.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

const duePalette = {
  urgent:   { card: "bg-red-50 border-red-200",    badge: "bg-red-500 text-white",    label: "Urgent" },
  soon:     { card: "bg-orange-50 border-orange-200", badge: "bg-orange-400 text-white", label: "Soon" },
  upcoming: { card: "bg-gray-50 border-gray-200",  badge: "bg-gray-400 text-white",   label: "Upcoming" },
};

function DueCard({ title, author, due, daysLeft, status }) {
  const p = duePalette[status] || duePalette.upcoming;
  return (
    <div className={`p-4 rounded-xl border ${p.card}`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-[13px] font-semibold text-gray-800 leading-snug">{title}</h4>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ml-2 ${p.badge}`}>
          {p.label}
        </span>
      </div>
      <p className="text-[11px] text-gray-500 mb-3">by {author}</p>
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-gray-400">
          Due: <span className="font-semibold text-gray-600">{due}</span>
        </p>
        <span className="text-[11px] font-bold text-gray-600">{daysLeft}</span>
      </div>
    </div>
  );
}