import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNotifications,
  markAsRead,
} from "../services/notificationService";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const loadNotifications = useCallback(async () => {
    try {
      const res = await getNotifications();

      // unread only
      const unread = res.data.filter((n) => !n.isRead);
      setNotifications(unread);
    } catch (error) {
      console.log("Error fetching notifications:", error);
    }
  }, []);

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, [loadNotifications]);

  const handleClick = async (notification) => {
    try {
      await markAsRead(notification._id);

      setNotifications((prev) =>
        prev.filter((n) => n._id !== notification._id)
      );

      if (notification.ticketId) {
        navigate(`/comments/${notification.ticketId}`);
      }
    } catch (error) {
      console.log("Error opening notification:", error);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // prevent card click navigation

    try {
      await markAsRead(id);

      setNotifications((prev) =>
        prev.filter((n) => n._id !== id)
      );
    } catch (error) {
      console.log("Error deleting notification:", error);
    }
  };

  const clearAll = async () => {
    try {
      for (const n of notifications) {
        await markAsRead(n._id);
      }
      setNotifications([]);
    } catch (error) {
      console.log("Error clearing notifications:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>🔔 Notifications</h3>

        {notifications.length > 0 && (
          <button className="btn btn-danger btn-sm" onClick={clearAll}>
            Clear All
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center mt-5">
          <h5 className="text-muted">No notifications</h5>
          <p className="text-secondary">Updates will appear here</p>
        </div>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            className="card mb-3 shadow-sm border-0"
            style={{ borderRadius: "12px", cursor: "pointer" }}
            onClick={() => handleClick(n)}
          >
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-1 fw-semibold">📩 {n.message}</p>
                <small className="text-muted">
                  📅 {new Date(n.createdAt).toLocaleString()}
                </small>
              </div>

              <button
                className="btn btn-sm btn-outline-danger"
                onClick={(e) => handleDelete(e, n._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;