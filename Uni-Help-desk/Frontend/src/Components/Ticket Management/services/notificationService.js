// Ticket Notification service – uses Vite proxy (/api/* → localhost:5001)
// Note: endpoint is /ticket-notifications to avoid conflict with library notifications
const BASE = "/api";

const request = async (path, options = {}) => {
  const res = await fetch(`${BASE}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return { data };
};

export const getNotifications = () => request("/ticket-notifications");

export const markAsRead = (id) =>
  request(`/ticket-notifications/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isRead: true }),
  });