import { useState, useEffect } from "react";
import { Bell, BookOpen, Download, AlertCircle, CheckCircle2, Info, Clock, Trash2, CheckCheck, Loader2 } from "lucide-react";
import { notificationAPI } from "../../../services/api";
import toast from "react-hot-toast";

const filters = ["All", "Unread", "Due Dates", "New Uploads", "Info"];

const typeIconMap = {
  due: AlertCircle,
  fine: AlertCircle,
  reservation: CheckCircle2,
  new_resource: BookOpen,
  download: Download,
  system: Info,
};

const typeColorMap = {
  due: "text-red-500 bg-red-50 border-red-200",
  fine: "text-red-500 bg-red-50 border-red-200",
  reservation: "text-emerald-500 bg-emerald-50 border-emerald-200",
  new_resource: "text-blue-500 bg-blue-50 border-blue-200",
  download: "text-emerald-500 bg-emerald-50 border-emerald-200",
  system: "text-purple-500 bg-purple-50 border-purple-200",
};

function formatTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr > 1 ? "s" : ""} ago`;
  const days = Math.floor(hr / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function StudentNotifications() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationAPI.getAll()
      .then(setItems)
      .catch(() => toast.error("Failed to load notifications"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(n => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !n.readStatus;
    if (activeFilter === "Due Dates") return n.type === "due" || n.type === "fine";
    if (activeFilter === "New Uploads") return n.type === "new_resource";
    if (activeFilter === "Info") return n.type === "system" || n.type === "reservation";
    return true;
  });

  const unreadCount = items.filter(n => !n.readStatus).length;

  const markAllRead = async () => {
    try {
      await notificationAPI.markAllRead();
      setItems(items.map(n => ({ ...n, readStatus: true })));
    } catch {
      setItems(items.map(n => ({ ...n, readStatus: true })));
    }
  };

  const markRead = async (id) => {
    try {
      await notificationAPI.markRead(id);
      setItems(items.map(n => n._id === id ? { ...n, readStatus: true } : n));
    } catch {
      setItems(items.map(n => n._id === id ? { ...n, readStatus: true } : n));
    }
  };

  const deleteNotif = async (id) => {
    try {
      await notificationAPI.delete(id);
      setItems(items.filter(n => n._id !== id));
      toast.success("Notification deleted");
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <p className="text-sm text-gray-400 mt-1">
            {loading ? "Loading..." : unreadCount > 0 ? `${unreadCount} unread notifications` : "All notifications read"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors">
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              activeFilter === f ? "bg-blue-500 text-white border-blue-500 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {f}
            {f === "Unread" && unreadCount > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="text-blue-400 animate-spin" />
        </div>
      )}

      {/* Notifications */}
      {!loading && (
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Bell size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No notifications here</p>
              <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
            </div>
          )}

          {filtered.map((n) => {
            const IconComp = typeIconMap[n.type] || Info;
            const color = typeColorMap[n.type] || "text-gray-500 bg-gray-50 border-gray-200";
            return (
              <div
                key={n._id}
                className={`relative bg-white rounded-2xl border p-4 transition-all duration-200 hover:shadow-sm ${
                  !n.readStatus ? "border-blue-200 bg-blue-50/30" : "border-gray-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${color}`}>
                    <IconComp size={18} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`text-sm font-semibold ${!n.readStatus ? "text-gray-900" : "text-gray-700"}`}>{n.title}</h3>
                          {!n.readStatus && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                          <Clock size={9} /> {formatTime(n.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {!n.readStatus && (
                      <button
                        onClick={() => markRead(n._id)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors"
                        title="Mark as read"
                      >
                        <CheckCircle2 size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotif(n._id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
