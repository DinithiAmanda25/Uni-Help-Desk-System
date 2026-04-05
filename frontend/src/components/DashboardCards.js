import { Row, Col } from "react-bootstrap";

function DashboardCards({ tickets }) {
  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "Open").length;
  const progress = tickets.filter((t) => t.status === "In Progress").length;
  const resolved = tickets.filter((t) => t.status === "Resolved").length;
  const closed = tickets.filter((t) => t.status === "Closed").length;

  const styles = {
    total: "linear-gradient(135deg, #7c83fd, #a5b4fc)",
    open: "linear-gradient(135deg, #34d399, #6ee7b7)",
    progress: "linear-gradient(135deg, #f472b6, #fb7185)",
    resolved: "linear-gradient(135deg, #fbbf24, #fde68a)",
    closed: "linear-gradient(135deg, #f87171, #fca5a5)",
  };

  const CardBox = ({ title, value, bg }) => (
    <Col>
      <div
        className="glass-card-soft p-3"
        style={{ background: bg }}
      >
        <h6 className="mb-2">{title}</h6>
        <h3 className="mb-0">{value}</h3>
      </div>
    </Col>
  );

  return (
    <Row className="mb-4 g-3">
      <CardBox title="Total Tickets" value={total} bg={styles.total} />
      <CardBox title="Open" value={open} bg={styles.open} />
      <CardBox title="In Progress" value={progress} bg={styles.progress} />
      <CardBox title="Resolved" value={resolved} bg={styles.resolved} />
      <CardBox title="Closed" value={closed} bg={styles.closed} />
    </Row>
  );
}

export default DashboardCards;