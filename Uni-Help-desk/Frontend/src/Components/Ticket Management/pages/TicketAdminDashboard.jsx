import DashboardCards from "../components/DashboardCards";
import DashboardCharts from "../components/DashboardCharts";
import { useEffect, useState } from "react";
import { getAllTickets, deleteTicket } from "../services/ticketService";
import { getComments } from "../services/commentService";

function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ticketComments, setTicketComments] = useState({});

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const res = await getAllTickets();
      const allTickets = res.data;
      setTickets(allTickets);

      const commentsMap = {};

      for (const ticket of allTickets) {
        try {
          const commentRes = await getComments(ticket._id);
          commentsMap[ticket._id] = commentRes.data;
        } catch (error) {
          commentsMap[ticket._id] = [];
        }
      }

      setTicketComments(commentsMap);
    } catch (error) {
      console.log("Error fetching tickets:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ticket?"
    );
    if (!confirmDelete) return;

    try {
      await deleteTicket(id);

      setTickets((prev) => prev.filter((ticket) => ticket._id !== id));

      setTicketComments((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      alert("✅ Ticket deleted successfully");
    } catch (error) {
      console.log("Error deleting ticket:", error);
      alert("❌ Failed to delete ticket");
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const createdDate = new Date(t.createdDate);
    const today = new Date();
    const diffDays = (today - createdDate) / (1000 * 60 * 60 * 24);

    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "week" && diffDays <= 7) ||
      (dateFilter === "month" && diffDays <= 30);

    const matchesStatus =
      statusFilter === "all" || t.status === statusFilter;

    return matchesDate && matchesStatus;
  });

  return (
    <div className="dashboard-page">
      <div className="container mt-2">
        <div className="dashboard-header text-center p-4 mb-4">
          <h2>📊 Admin Dashboard</h2>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <select
              className="form-select glass-input"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Dates</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>

          <div className="col-md-6">
            <select
              className="form-select glass-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        <DashboardCards tickets={filteredTickets} />

        <div className="glass-panel p-3 mb-4">
          <DashboardCharts tickets={filteredTickets} />
        </div>

        <div className="mt-4">
          <h4 className="section-title mb-3">Ticket Replies</h4>

          {filteredTickets.length === 0 ? (
            <div className="glass-panel p-4">
              <p className="text-muted mb-0">No tickets available</p>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div key={ticket._id} className="glass-panel p-3 mb-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5>{ticket.title}</h5>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(ticket._id)}
                  >
                    Delete Ticket
                  </button>
                </div>

                <p>
                  <strong>Priority:</strong> {ticket.priority}
                </p>

                <p>
                  <strong>Status:</strong> {ticket.status}
                </p>

                <p>
                  <strong>Student:</strong> {ticket.studentName}
                </p>

                <p>
                  <strong>Email:</strong> {ticket.studentEmail}
                </p>

                <h6>Replies</h6>

                {ticketComments[ticket._id] &&
                ticketComments[ticket._id].length > 0 ? (
                  ticketComments[ticket._id].map((c) => (
                    <div key={c._id} className="glass-card p-2 mb-2">
                      <p className="mb-1">{c.message}</p>
                      <small className="text-muted">
                        {c.userId} • {new Date(c.createdAt).toLocaleString()}
                      </small>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No replies yet</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;