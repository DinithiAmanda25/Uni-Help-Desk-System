import { NavLink, Outlet } from "react-router-dom";

function TicketAdminLayout() {
  return (
    <div className="d-flex">
      <div className="sidebar">
        <h4 className="p-3">⚙️ Admin</h4>

        <ul className="nav flex-column px-3">
          <li className="nav-item mb-2">
            <NavLink
              to="/tickets/admin"
              end
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Dashboard
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink
              to="/tickets/admin/tickets"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              All Tickets
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink
              to="/tickets/admin/new"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              New Tickets
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="flex-grow-1 p-4 dashboard-bg">
        <Outlet />
      </div>
    </div>
  );
}

export default TicketAdminLayout;