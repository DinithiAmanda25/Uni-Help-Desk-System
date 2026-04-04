import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Student Pages
import StudentDashboard from "./pages/StudentDashboard";
import CreateTicket from "./pages/CreateTicket";
import TicketList from "./pages/TicketList";
import Comments from "./pages/Comments";
import Notifications from "./pages/Notifications";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminTickets from "./pages/AdminTickets";
import NewTickets from "./pages/NewTickets";

// Components
import Navbar from "./components/Navbar";
import StudentLayout from "./components/StudentLayout";
import AdminLayout from "./components/AdminLayout";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/student" />} />

        <Route
          path="/student"
          element={
            <StudentLayout>
              <StudentDashboard />
            </StudentLayout>
          }
        />

        <Route
          path="/create"
          element={
            <StudentLayout>
              <CreateTicket />
            </StudentLayout>
          }
        />

        <Route
          path="/tickets"
          element={
            <StudentLayout>
              <TicketList />
            </StudentLayout>
          }
        />

        <Route
          path="/comments/:id"
          element={
            <StudentLayout>
              <Comments />
            </StudentLayout>
          }
        />

        <Route
          path="/notifications"
          element={
            <StudentLayout>
              <Notifications />
            </StudentLayout>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/tickets"
          element={
            <AdminLayout>
              <AdminTickets />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/new"
          element={
            <AdminLayout>
              <NewTickets />
            </AdminLayout>
          }
        />

        <Route path="*" element={<h2 className="m-4">Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;