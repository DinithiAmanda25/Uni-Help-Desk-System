import { useEffect, useState, useCallback } from "react";
import {
  getAllTickets,
  assignTicket,
  updateStatus,
} from "../services/ticketService";
import { addComment, getComments } from "../services/commentService";

function NewTickets() {
  const [tickets, setTickets] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [selectedStaff, setSelectedStaff] = useState({});
  const [selectedStatus, setSelectedStatus] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });

  const staffList = ["Admin", "Lecturer"];

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 2500);
  };

  const loadNewTickets = useCallback(async () => {
    try {
      const res = await getAllTickets();
      const allTickets = res.data;

      const ticketsWithComments = await Promise.all(
        allTickets.map(async (ticket) => {
          try {
            const commentRes = await getComments(ticket._id);
            return {
              ...ticket,
              comments: commentRes.data,
            };
          } catch (error) {
            return {
              ...ticket,
              comments: [],
            };
          }
        })
      );

      // ✅ Only remove tickets that already have replies
      const filtered = ticketsWithComments.filter(
        (t) => !t.comments || t.comments.length === 0
      );

      setTickets(filtered);

      // keep selected values in sync
      const staffMap = {};
      const statusMap = {};

      filtered.forEach((t) => {
        staffMap[t._id] = t.assignedTo || "";
        statusMap[t._id] = t.status || "";
      });

      setSelectedStaff(staffMap);
      setSelectedStatus(statusMap);
    } catch (error) {
      console.log("Error loading new tickets:", error);
      showMessage("danger", "❌ Failed to load new tickets");
    }
  }, []);

  useEffect(() => {
    loadNewTickets();
  }, [loadNewTickets]);

  const handleAssign = async (id) => {
    const staff = selectedStaff[id];

    if (!staff) {
      showMessage("warning", "⚠️ Please select staff first");
      return;
    }

    try {
      await assignTicket(id, { assignedTo: staff });
      showMessage("success", "✅ Staff assigned successfully");

      // ✅ update UI only, do not remove ticket
      setTickets((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, assignedTo: staff } : t
        )
      );
    } catch (error) {
      console.log("Error assigning ticket:", error);
      showMessage("danger", "❌ Failed to assign staff");
    }
  };

  const handleStatusChange = async (id) => {
    const status = selectedStatus[id];

    if (!status) {
      showMessage("warning", "⚠️ Please select status first");
      return;
    }

    try {
      await updateStatus(id, { status });
      showMessage("success", "✅ Status updated successfully");

      // ✅ update UI only, do not remove ticket
      setTickets((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, status } : t
        )
      );
    } catch (error) {
      console.log("Error updating status:", error);
      showMessage("danger", "❌ Failed to update status");
    }
  };

  const handleReply = async (id) => {
    if (!replyText[id]?.trim()) {
      showMessage("warning", "⚠️ Please write a reply first");
      return;
    }

    try {
      await addComment({
        ticketId: id,
        userId: "admin",
        message: replyText[id],
        attachments: [],
      });

      setReplyText((prev) => ({
        ...prev,
        [id]: "",
      }));

      showMessage("success", "✅ Reply sent successfully");

      // ✅ only now remove from New Tickets page
      setTickets((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.log("Error sending reply:", error);
      showMessage("danger", "❌ Failed to send reply");
    }
  };

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

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return "bg-danger";
      case "Medium":
        return "bg-warning text-dark";
      case "Low":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">New Tickets</h3>

      {message.text && (
        <div className={`alert alert-${message.type} text-center`}>
          {message.text}
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="card p-4 shadow-sm">
          <p className="mb-0 text-muted">No new tickets</p>
        </div>
      ) : (
        tickets.map((t) => (
          <div key={t._id} className="card p-4 mb-4 shadow-sm border-0 rounded-4">
            <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
              <div>
                <h5 className="mb-1">{t.title}</h5>
                <p className="text-muted mb-2">{t.description}</p>
              </div>
              <div className="text-end">
                <span className={`badge ${getCategoryBadge(t.category)} me-2`}>
                  {t.category}
                </span>
                <span className={`badge ${getPriorityBadge(t.priority)}`}>
                  {t.priority}
                </span>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-md-6">
                <p><b>Student:</b> {t.studentName}</p>
                <p><b>Email:</b> {t.studentEmail}</p>
              </div>
              <div className="col-md-6">
                <p><b>Status:</b> {t.status}</p>
                <p><b>Assigned To:</b> {t.assignedTo || "Not assigned"}</p>
                <p><b>Date:</b> {new Date(t.createdDate).toLocaleDateString()}</p>
              </div>
            </div>

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
                <span className="text-muted">No attachment</span>
              )}
            </p>

            <div className="row mb-2">
              <div className="col-md-6">
                <select
                  className="form-select"
                  value={selectedStaff[t._id] || ""}
                  onChange={(e) =>
                    setSelectedStaff({
                      ...selectedStaff,
                      [t._id]: e.target.value,
                    })
                  }
                >
                  <option value="">Assign Staff</option>
                  {staffList.map((s, i) => (
                    <option key={i} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <select
                  className="form-select"
                  value={selectedStatus[t._id] || ""}
                  onChange={(e) =>
                    setSelectedStatus({
                      ...selectedStatus,
                      [t._id]: e.target.value,
                    })
                  }
                >
                  <option value="">Change Status</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={() => handleAssign(t._id)}
                >
                  Assign Staff
                </button>
              </div>

              <div className="col-md-6">
                <button
                  type="button"
                  className="btn btn-warning w-100"
                  onClick={() => handleStatusChange(t._id)}
                >
                  Update Status
                </button>
              </div>
            </div>

            <textarea
              className="form-control"
              rows="3"
              placeholder="Write a reply..."
              value={replyText[t._id] || ""}
              onChange={(e) =>
                setReplyText({
                  ...replyText,
                  [t._id]: e.target.value,
                })
              }
            />

            <button
              type="button"
              className="btn btn-success mt-3 w-100"
              onClick={() => handleReply(t._id)}
            >
              Send Reply
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default NewTickets;