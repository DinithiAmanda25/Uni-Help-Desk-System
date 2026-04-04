import { NavLink } from "react-router-dom";

function AdminLayout({ children }) {
  return (
    <div className="d-flex">
      <div className="sidebar">
        <h4 className="p-3"> Admin</h4>

        <ul className="nav flex-column px-3">
          <li className="nav-item mb-2">
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Dashboard
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink
              to="/admin/tickets"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              All Tickets
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink
              to="/admin/new"
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
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;