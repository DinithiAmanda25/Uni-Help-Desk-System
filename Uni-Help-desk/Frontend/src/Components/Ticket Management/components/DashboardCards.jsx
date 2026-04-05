// DashboardCards – Uses Bootstrap grid classes (no react-bootstrap dependency)
function DashboardCards({ tickets }) {
  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "Open").length;
  const progress = tickets.filter((t) => t.status === "In Progress").length;
  const resolved = tickets.filter((t) => t.status === "Resolved").length;
  const closed = tickets.filter((t) => t.status === "Closed").length;

  const cards = [
    { title: "Total Tickets", value: total, bg: "linear-gradient(135deg, #7c83fd, #a5b4fc)" },
    { title: "Open", value: open, bg: "linear-gradient(135deg, #34d399, #6ee7b7)" },
    { title: "In Progress", value: progress, bg: "linear-gradient(135deg, #f472b6, #fb7185)" },
    { title: "Resolved", value: resolved, bg: "linear-gradient(135deg, #fbbf24, #fde68a)" },
    { title: "Closed", value: closed, bg: "linear-gradient(135deg, #f87171, #fca5a5)" },
  ];

  return (
    <div className="row mb-4 g-3">
      {cards.map((card, i) => (
        <div key={i} className="col">
          <div
            className="glass-card-soft p-3"
            style={{ background: card.bg }}
          >
            <h6 className="mb-2">{card.title}</h6>
            <h3 className="mb-0">{card.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;