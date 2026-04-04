import { NavLink } from "react-router-dom";

function StudentLayout({ children }) {
  return (
    <div className="d-flex">
      <div className="sidebar">
        <h4 className="p-3">🎓 Student</h4>

        <ul className="nav flex-column px-3">
          <li className="nav-item mb-2">
            <NavLink
              to="/create"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Create Ticket
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink
              to="/tickets"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              My Tickets
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Notifications
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="flex-grow-1 p-4 dashboard-bg">
        {children}
      </div>
    </div>
  );
}

export default StudentLayout;