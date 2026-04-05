import { useState } from 'react';
import { Bell, CheckCheck, Check, Info, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


const typeIcon = {
  success: <CheckCircle size={18} className="text-accent-green" />,
  info: <Info size={18} className="text-blue-400" />,
  warning: <AlertTriangle size={18} className="text-accent-yellow" />,
  error: <X size={18} className="text-accent-red" />,
};

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllRead, unreadCount } = useAuth();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  return (
    <div className="flex flex-col gap-6 pt-2 pb-12 animate-fadeIn">
      <div className="flex-1 w-full mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-text-primary">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-text-secondary mt-1">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button className="btn btn-secondary btn-sm" onClick={markAllRead} id="mark-all-read-btn">
              <CheckCheck size={15} /> Mark all as read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-6 bg-brand-secondary border border-brand-border rounded-lg p-1 w-max" id="notification-filter-tabs">
          {['all', 'unread'].map(f => (
            <button
              key={f}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-semibold border-none cursor-pointer transition-colors ${filter === f ? 'bg-brand-primary text-text-primary shadow-sm' : 'bg-transparent text-text-muted hover:text-text-primary'}`}
              onClick={() => setFilter(f)}
              id={`filter-${f}`}
            >
              {f === 'all' ? 'All' : 'Unread'}
              {f === 'unread' && unreadCount > 0 && (
                <span className="bg-accent-red text-white py-[1px] px-1.5 rounded-full text-[0.7rem] font-bold min-w-[18px] text-center ml-1">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Notification List */}
        {filtered.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-16 text-center animate-fadeIn" id="empty-notifications">
            <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center text-text-muted mb-4"><Bell size={32} /></div>
            <h3 className="text-lg font-bold text-text-primary mb-2">No notifications</h3>
            <p className="text-sm text-text-secondary">{filter === 'unread' ? "You're all caught up!" : 'No notifications yet.'}</p>
          </div>
        ) : (
          <div className="card p-0 flex flex-col overflow-hidden animate-fadeIn" id="notification-list">
            {filtered.map(n => (
              <div
                key={n._id}
                className={`flex items-start gap-4 px-5 py-4 border-b border-brand-border/50 border-l-4 transition-colors hover:bg-brand-primary last:border-b-0 ${!n.read ? 'border-l-blue-500 bg-blue-500/5' : 'border-l-transparent'}`}
                id={`notification-${n._id}`}
              >
                <div className="w-10 h-10 rounded-lg bg-brand-primary flex items-center justify-center shrink-0 border border-brand-border/50">{typeIcon[n.type] || typeIcon.info}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.95rem] text-text-primary leading-relaxed font-medium">{n.message}</p>
                  <span className="text-xs text-text-muted mt-1.5 block">{timeAgo(n.createdAt)}</span>
                </div>
                {!n.read && (
                  <button
                    className="btn focus:ring-2 focus:ring-brand-border focus:outline-none bg-brand-primary border border-brand-border text-text-primary hover:bg-brand-secondary transition-colors text-xs font-semibold w-8 h-8 rounded-md flex items-center justify-center shrink-0 shadow-sm"
                    onClick={() => markNotificationRead(n._id)}
                    id={`mark-read-${n._id}`}
                    title="Mark as read"
                  >
                    <Check size={14} className="text-text-muted hover:text-blue-400" />
                  </button>
                )}
                {n.read && <span className="w-2 h-2 rounded-full bg-text-muted opacity-30 shrink-0 mt-3 mr-2" title="Read" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
