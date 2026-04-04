import { Link } from "react-router-dom";

function StudentDashboard() {
  return (
    <div className="dashboard-page">
      <div className="container mt-2">
        <div className="dashboard-header text-center mb-4">
          <h2>🎓 Student Dashboard</h2>
          <p>Access your support ticket services</p>
        </div>

        <div className="row mt-4 g-4">
          <div className="col-md-3">
            <div className="card glass-card p-4 text-center border-0 shadow-sm h-100">
              <h5>Create Ticket</h5>
              <p className="text-muted">Submit a new support request</p>
              <Link to="/create" className="btn btn-primary mt-2">
                Go
              </Link>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card glass-card p-4 text-center border-0 shadow-sm h-100">
              <h5>My Tickets</h5>
              <p className="text-muted">View all your submitted tickets</p>
              <Link to="/tickets" className="btn btn-success mt-2">
                View
              </Link>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card glass-card p-4 text-center border-0 shadow-sm h-100">
              <h5>View Replies</h5>
              <p className="text-muted">Check admin responses</p>
              <Link to="/tickets" className="btn btn-warning mt-2">
                Open
              </Link>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card glass-card p-4 text-center border-0 shadow-sm h-100">
              <h5>Notifications</h5>
              <p className="text-muted">See important reply alerts</p>
              <Link to="/notifications" className="btn btn-danger mt-2">
                Check
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;