import { useEffect, useRef, useState } from "react";
import { getAllTickets, deleteTicket } from "../services/ticketService";
import { getComments } from "../services/commentService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [ticketComments, setTicketComments] = useState({});
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowDownloadMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ticket?"
    );
    if (!confirmDelete) return;

    try {
      await deleteTicket(id);
      await loadTickets();
      alert("✅ Ticket deleted successfully");
    } catch (error) {
      console.log("Error deleting ticket:", error);
      alert("❌ Failed to delete ticket");
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch = (t.ticketId || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "" || t.category === categoryFilter;

    const matchesStatus =
      statusFilter === "" || t.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const generatePDFReport = () => {
    const doc = new jsPDF();

    const totalTickets = filteredTickets.length;
    const openCount = filteredTickets.filter((t) => t.status === "Open").length;
    const inProgressCount = filteredTickets.filter(
      (t) => t.status === "In Progress"
    ).length;
    const resolvedCount = filteredTickets.filter(
      (t) => t.status === "Resolved"
    ).length;
    const closedCount = filteredTickets.filter(
      (t) => t.status === "Closed"
    ).length;

    doc.setFontSize(18);
    doc.text("Support Ticket Report", 14, 20);

    doc.setFontSize(11);
    doc.text(`Generated Date: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Tickets: ${totalTickets}`, 14, 38);
    doc.text(`Open: ${openCount}`, 14, 46);
    doc.text(`In Progress: ${inProgressCount}`, 14, 54);
    doc.text(`Resolved: ${resolvedCount}`, 14, 62);
    doc.text(`Closed: ${closedCount}`, 14, 70);

    const tableColumn = [
      "Ticket ID",
      "Student Name",
      "Student ID",
      "Email",
      "Title",
      "Category",
      "Priority",
      "Status",
      "Assigned To",
      "Created Date",
    ];

    const tableRows = filteredTickets.map((ticket) => [
      ticket.ticketId || "",
      ticket.studentName || "",
      ticket.studentId || "",
      ticket.studentEmail || "",
      ticket.title || "",
      ticket.category || "",
      ticket.priority || "",
      ticket.status || "",
      ticket.assignedTo || "Not assigned",
      ticket.createdDate
        ? new Date(ticket.createdDate).toLocaleString()
        : "",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 80,
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fillColor: [41, 128, 185],
      },
    });

    doc.save("ticket-report.pdf");
    setShowDownloadMenu(false);
  };

  const generateExcelReport = () => {
    const reportData = filteredTickets.map((ticket) => ({
      "Ticket ID": ticket.ticketId || "",
      "Student Name": ticket.studentName || "",
      "Student ID": ticket.studentId || "",
      "Student Email": ticket.studentEmail || "",
      Title: ticket.title || "",
      Description: ticket.description || "",
      Category: ticket.category || "",
      Priority: ticket.priority || "",
      Status: ticket.status || "",
      "Assigned To": ticket.assignedTo || "Not assigned",
      "Created Date": ticket.createdDate
        ? new Date(ticket.createdDate).toLocaleString()
        : "",
      "Reply Count": ticketComments[ticket._id]
        ? ticketComments[ticket._id].length
        : 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(fileData, "ticket-report.xlsx");
    setShowDownloadMenu(false);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h3 className="mb-0">All Tickets</h3>

        <div className="position-relative" ref={menuRef}>
          <button
            className="btn btn-success px-4"
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
          >
            Download ▾
          </button>

          {showDownloadMenu && (
            <div
              className="card shadow border-0 position-absolute mt-2"
              style={{
                right: 0,
                minWidth: "180px",
                zIndex: 1000,
                borderRadius: "12px",
              }}
            >
              <div className="list-group list-group-flush">
                <button
                  className="list-group-item list-group-item-action"
                  onClick={generatePDFReport}
                >
                  Download PDF
                </button>
                <button
                  className="list-group-item list-group-item-action"
                  onClick={generateExcelReport}
                >
                  Download Excel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Ticket ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Account">Account</option>
            <option value="Technical">Technical</option>
            <option value="Academic">Academic</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <p>No tickets available</p>
      ) : (
        filteredTickets.map((t) => (
          <div key={t._id} className="card p-3 mb-3 shadow-sm">
            <p>
              <b>Ticket ID:</b> {t.ticketId}
            </p>
            <p>
              <b>Student:</b> {t.studentName} ({t.studentId})
            </p>
            <p>
              <b>Email:</b> {t.studentEmail}
            </p>

            <h5>{t.title}</h5>
            <p>{t.description}</p>

            <p>
              <b>Category:</b>{" "}
              <span className={`badge ${getCategoryBadge(t.category)} ms-2`}>
                {t.category}
              </span>
            </p>

            <p>
              <b>Status:</b> {t.status}
            </p>
            <p>
              <b>Priority:</b> {t.priority}
            </p>
            <p>
              <b>Assigned To:</b> {t.assignedTo || "Not assigned"}
            </p>
            <p>
              <b>Date:</b> {new Date(t.createdDate).toLocaleString()}
            </p>

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

            <div className="mt-3">
              <h6>Replies</h6>

              {ticketComments[t._id] && ticketComments[t._id].length > 0 ? (
                ticketComments[t._id].map((c) => (
                  <div
                    key={c._id}
                    className="border rounded p-2 mb-2 bg-light"
                  >
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

            <div className="mt-2">
              <button
                className="btn btn-dark px-4 rounded-pill shadow-sm"
                onClick={() => handleDelete(t._id)}
              >
                Delete Ticket
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminTickets;