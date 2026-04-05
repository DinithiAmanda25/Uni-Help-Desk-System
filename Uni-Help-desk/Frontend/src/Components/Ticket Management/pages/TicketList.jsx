import { useEffect, useState } from "react";
import { getAllTickets, deleteTicket } from "../services/ticketService";

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const res = await getAllTickets();
      setTickets(res.data);
    } catch (err) {
      console.log("Error fetching tickets:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure to delete this ticket?");
    if (!confirmDelete) return;

    try {
      await deleteTicket(id);
      setTickets((prev) => prev.filter((t) => t._id !== id));
      alert("✅ Ticket deleted successfully");
    } catch (error) {
      console.log("Delete error:", error);
      alert("❌ Failed to delete ticket");
    }
  };

  const filteredTickets = tickets.filter((t) =>
    (t.title || "").toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryBadge = (category) => {
    switch (category) {
      case "Account":
        return "bg-success";
      case "Technical":
        return "bg-primary";
      case "Academic":
        return "bg-warning text-dark";
      case "Other":
        return "bg-secondary";
      default:
        return "bg-dark";
    }
  };

  return (
    <div className="container mt-4">
      <h3>My Tickets</h3>

      <input
        className="form-control mb-3"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredTickets.length === 0 ? (
        <p>No tickets found</p>
      ) : (
        filteredTickets.map((t) => (
          <div key={t._id} className="card p-3 mb-3 shadow-sm position-relative">
            <button
              className="btn btn-sm btn-danger position-absolute"
              style={{ top: "10px", right: "10px" }}
              onClick={() => handleDelete(t._id)}
            >
              Delete
            </button>

            <p><b>Ticket ID:</b> {t.ticketId}</p>
            <h5>{t.title}</h5>
            <p>{t.description}</p>

            <p>
              <b>Category:</b>{" "}
              <span className={`badge ${getCategoryBadge(t.category)} ms-2`}>
                {t.category}
              </span>
            </p>

            <p><b>Status:</b> {t.status}</p>
            <p><b>Priority:</b> {t.priority}</p>
            <p><b>Assigned To:</b> {t.assignedTo || "Not assigned"}</p>
            <p><b>Date:</b> {new Date(t.createdDate).toLocaleString()}</p>

            <p>
              <b>Attachment:</b>{" "}
              {t.attachments && t.attachments.length > 0 ? (
                <a
                  href={t.attachments[0]}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-outline-primary ms-2"
                >
                  View Attachment
                </a>
              ) : (
                "No attachment"
              )}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default TicketList;