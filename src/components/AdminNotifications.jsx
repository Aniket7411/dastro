import { useState, useEffect, useRef } from 'react';
import API_BASE from '../utils/api';

const COLOR_MAP = {
  blue:    { bg: 'bg-blue-50',    icon: 'text-blue-500' },
  green:   { bg: 'bg-green-50',   icon: 'text-green-500' },
  cyan:    { bg: 'bg-cyan-50',    icon: 'text-cyan-500' },
  amber:   { bg: 'bg-amber-50',   icon: 'text-amber-500' },
  rose:    { bg: 'bg-rose-50',    icon: 'text-rose-500' },
  violet:  { bg: 'bg-violet-50',  icon: 'text-violet-500' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-500' },
};

const DOT_COLOR = {
  blue: '#3b82f6', green: '#22c55e', cyan: '#06b6d4',
  amber: '#f59e0b', rose: '#ef4444', violet: '#8b5cf6', emerald: '#10b981',
};

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function AdminNotifications({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const token = () => localStorage.getItem('adminToken');

  const authHeaders = () => ({ Authorization: `Bearer ${token()}` });

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/notifications/unread-count`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) setUnreadCount(data.count);
    } catch {}
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/notifications?limit=30`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch {}
    finally { setLoading(false); }
  };

  // Poll unread count every 30s
  useEffect(() => {
    fetchUnreadCount();
    const iv = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(iv);
  }, []);

  // Load full list when dropdown opens
  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markRead = async (id) => {
    await fetch(`${API_BASE}/api/admin/notifications/${id}/read`, { method: 'PUT', headers: authHeaders() });
    setNotifications((p) => p.map((n) => n._id === id ? { ...n, isRead: true } : n));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const markAllRead = async () => {
    await fetch(`${API_BASE}/api/admin/notifications/read-all`, { method: 'PUT', headers: authHeaders() });
    setNotifications((p) => p.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const deleteOne = async (e, id) => {
    e.stopPropagation();
    const notif = notifications.find((n) => n._id === id);
    await fetch(`${API_BASE}/api/admin/notifications/${id}`, { method: 'DELETE', headers: authHeaders() });
    setNotifications((p) => p.filter((n) => n._id !== id));
    if (notif && !notif.isRead) setUnreadCount((c) => Math.max(0, c - 1));
  };

  const clearAll = async () => {
    await fetch(`${API_BASE}/api/admin/notifications`, { method: 'DELETE', headers: authHeaders() });
    setNotifications([]);
    setUnreadCount(0);
  };

  const handleClick = async (notif) => {
    if (!notif.isRead) await markRead(notif._id);
    if (notif.link && onNavigate) onNavigate(notif.link);
    setOpen(false);
  };

  return (
    <div className="notif-root" ref={dropdownRef}>
      <button
        className="topbar-icon-btn notif-bell-btn"
        onClick={() => setOpen((v) => !v)}
        title="Notifications"
        aria-label="Notifications"
      >
        <i className="fas fa-bell" />
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown">
          {/* Header */}
          <div className="notif-header">
            <span className="notif-header-title">
              Notifications
              {unreadCount > 0 && <em className="notif-header-count">{unreadCount} new</em>}
            </span>
            {unreadCount > 0 && (
              <button className="notif-mark-all" onClick={markAllRead}>Mark all read</button>
            )}
          </div>

          {/* List */}
          <div className="notif-list">
            {loading && notifications.length === 0 ? (
              <div className="notif-empty">
                <div className="notif-empty-spinner" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="notif-empty">
                <i className="fas fa-bell-slash notif-empty-icon" />
                <span>No notifications yet</span>
              </div>
            ) : notifications.map((n) => {
              const c = COLOR_MAP[n.color] || COLOR_MAP.blue;
              return (
                <div
                  key={n._id}
                  className={`notif-item ${!n.isRead ? 'notif-item--unread' : ''}`}
                  onClick={() => handleClick(n)}
                >
                  <div className={`notif-icon-wrap ${c.bg}`}>
                    <i className={`fas ${n.icon || 'fa-bell'} text-sm ${c.icon}`} />
                  </div>
                  <div className="notif-body">
                    <div className="notif-title">{n.title}</div>
                    <div className="notif-msg">{n.message}</div>
                    <div className="notif-time">{timeAgo(n.createdAt)}</div>
                  </div>
                  {!n.isRead && (
                    <div
                      className="notif-unread-dot"
                      style={{ background: DOT_COLOR[n.color] || DOT_COLOR.blue }}
                    />
                  )}
                  <button
                    className="notif-delete-btn"
                    title="Remove"
                    onClick={(e) => deleteOne(e, n._id)}
                    aria-label="Remove notification"
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="notif-footer">
              <button className="notif-clear-all" onClick={clearAll}>Clear all</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
