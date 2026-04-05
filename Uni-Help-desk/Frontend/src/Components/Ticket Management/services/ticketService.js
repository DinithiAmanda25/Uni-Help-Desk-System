// Ticket service – wraps the unified fetch-based API
// The Vite proxy routes /api/* → http://localhost:5001 (no CORS in dev)
const BASE = "/api";

const request = async (path, options = {}) => {
  const res = await fetch(`${BASE}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  // Mimic axios response shape so existing pages work unchanged
  return { data };
};

export const createTicket = (formData) =>
  fetch(`${BASE}/tickets`, { method: "POST", body: formData })
    .then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
      return { data };
    });

export const getAllTickets = () => request("/tickets");

export const getStudentTickets = (email) => request(`/tickets/student/${email}`);

export const assignTicket = (id, body) =>
  request(`/tickets/assign/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const updateStatus = (id, body) =>
  request(`/tickets/status/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const deleteTicket = (id) => request(`/tickets/${id}`, { method: "DELETE" });