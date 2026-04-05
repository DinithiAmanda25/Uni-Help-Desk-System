// In dev, Vite proxies /api → http://localhost:5000/api (see vite.config.js)
// In production, set VITE_API_URL to your backend URL (e.g. https://api.yourdomain.com/api)
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

// ── Auth helpers ─────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ── Generic fetch wrapper ────────────────────────────────────────────────────
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (body) =>
    request("/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  register: (body) =>
    request("/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  me: () => request("/auth/me", { headers: authHeaders() }),
};

// ── Resources (digital) ──────────────────────────────────────────────────────
export const resourceAPI = {
  /** GET /api/resources?search=&category=&type=&sort=&page=&limit= */
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/resources${qs ? `?${qs}` : ""}`);
  },

  /** GET /api/resources/:id */
  getById: (id) => request(`/resources/${id}`),

  /** POST /api/resources  (multipart FormData) */
  upload: (formData) =>
    fetch(`${BASE_URL}/resources`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
      return data;
    }),

  /** PUT /api/resources/:id */
  update: (id, body) =>
    request(`/resources/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(body) }),

  /** DELETE /api/resources/:id */
  delete: (id) =>
    request(`/resources/${id}`, { method: "DELETE", headers: authHeaders() }),

  /** POST /api/resources/:id/download */
  recordDownload: (id) =>
    request(`/resources/${id}/download`, { method: "POST" }),
};

// ── Library (physical books) ─────────────────────────────────────────────────
export const libraryAPI = {
  /** GET /api/books?search=&category=&available= */
  getBooks: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/books${qs ? `?${qs}` : ""}`);
  },

  /** GET /api/books/:id */
  getBook: (id) => request(`/books/${id}`),

  /** POST /api/books – admin only */
  addBook: (body) =>
    request("/books", { method: "POST", headers: authHeaders(), body: JSON.stringify(body) }),

  /** PUT /api/books/:id – admin only */
  updateBook: (id, body) =>
    request(`/books/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(body) }),

  /** DELETE /api/books/:id – admin only */
  deleteBook: (id) =>
    request(`/books/${id}`, { method: "DELETE", headers: authHeaders() }),

  /** POST /api/books/reserve/:bookId */
  reserve: (bookId, body) =>
    request(`/books/reserve/${bookId}`, { method: "POST", headers: authHeaders(), body: JSON.stringify(body) }),

  /** GET /api/books/user/my-books */
  myReservations: () =>
    request("/books/user/my-books", { headers: authHeaders() }),

  /** PUT /api/books/return/:reservationId */
  returnBook: (reservationId) =>
    request(`/books/return/${reservationId}`, { method: "PUT", headers: authHeaders() }),
};

// ── Notifications ─────────────────────────────────────────────────────────────
export const notificationAPI = {
  /** GET /api/notifications – (add this endpoint to the backend if not present) */
  getAll: () => request("/notifications", { headers: authHeaders() }),
  markRead: (id) =>
    request(`/notifications/${id}/read`, { method: "PUT", headers: authHeaders() }),
  markAllRead: () =>
    request("/notifications/read-all", { method: "PUT", headers: authHeaders() }),
  delete: (id) =>
    request(`/notifications/${id}`, { method: "DELETE", headers: authHeaders() }),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => request("/admin/stats", { headers: authHeaders() }),
  getUsers: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/users${qs ? `?${qs}` : ""}`, { headers: authHeaders() });
  },
  updateUserRole: (id, role) =>
    request(`/admin/users/${id}/role`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ role }) }),
  updateUserStatus: (id, status) =>
    request(`/admin/users/${id}/status`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ status }) }),
  deleteUser: (id) =>
    request(`/admin/users/${id}`, { method: "DELETE", headers: authHeaders() }),
  getOverdue: () => request("/admin/overdue", { headers: authHeaders() }),
  getReservations: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/reservations${qs ? `?${qs}` : ""}`, { headers: authHeaders() });
  },
};
