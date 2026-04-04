import API from "./api";

export const createTicket = (data) => API.post("/tickets", data);

export const getAllTickets = () => API.get("/tickets");

export const getStudentTickets = (email) =>
  API.get(`/tickets/student/${email}`);

export const assignTicket = (id, data) =>
  API.put(`/tickets/assign/${id}`, data);

export const updateStatus = (id, data) =>
  API.put(`/tickets/status/${id}`, data);

export const deleteTicket = (id) =>
  API.delete(`/tickets/${id}`);