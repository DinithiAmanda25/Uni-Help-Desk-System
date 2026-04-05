// Comment service – uses Vite proxy (/api/* → localhost:5001)
const BASE = "/api";

const request = async (path, options = {}) => {
  const res = await fetch(`${BASE}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return { data };
};

export const addComment = (body) =>
  request("/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const getComments = (ticketId) => request(`/comments/${ticketId}`);