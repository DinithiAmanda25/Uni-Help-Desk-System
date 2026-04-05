import { useNavigate, useLocation } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname.includes("/admin");

  const handleLogout = () => {
    alert("Logged out successfully ✅");
    navigate("/student");
  };

  return (
    <nav className="top-navbar d-flex justify-content-between align-items-center px-4">
      <div className="brand-text">
        Uni Help Desk | {isAdmin ? "Admin Panel" : "Student Panel"}
      </div>

      <button onClick={handleLogout} className="logout-btn">
        <FaSignOutAlt className="me-2" />
        Logout
      </button>
    </nav>
  );
}

export default Navbar;