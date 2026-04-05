import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import StudentLayout from "./Components/Resource and Library Management/Student/StudentLayout";
import AdminLayout from "./Components/Resource and Library Management/Admin/AdminLayout";
import LecturerLayout from "./Components/Resource and Library Management/Lecturer/LecturerLayout";

// Student pages
import StudentDashboard from "./Pages/StudentDashboard";
import ResourceSearch from "./Components/Resource and Library Management/Student/ResourceSearch";
import LibraryCatalog from "./Components/Resource and Library Management/Student/LibraryCatalog";
import BookReservation from "./Components/Resource and Library Management/Student/BookReservation";
import ResourceDetails from "./Components/Resource and Library Management/Student/ResourceDetails";
import StudentNotifications from "./Components/Resource and Library Management/Student/StudentNotifications";
import EbookReader from "./Components/Resource and Library Management/Student/EbookReader";

// Admin pages
import AdminDashboard from "./Components/Resource and Library Management/Admin/AdminDashboard";
import UserManagement from "./Components/Resource and Library Management/Admin/UserManagement";
import LibraryManagement from "./Components/Resource and Library Management/Admin/LibraryManagement";
import SystemSettings from "./Components/Resource and Library Management/Admin/SystemSettings";

// Lecturer pages
import UploadResource from "./Components/Resource and Library Management/Lecturer/UploadResource";
import ManageResources from "./Components/Resource and Library Management/Lecturer/ManageResources";
import LecturerAnalytics from "./Components/Resource and Library Management/Lecturer/LecturerAnalytics";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/student/dashboard" replace />} />

        {/* Student portal */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="resources" element={<ResourceSearch />} />
          <Route path="resources/:id" element={<ResourceDetails />} />
          <Route path="library" element={<LibraryCatalog />} />
          <Route path="library/reserve/:id" element={<BookReservation />} />
          <Route path="library/read/:id" element={<EbookReader />} />
          <Route path="notifications" element={<StudentNotifications />} />
        </Route>

        {/* Admin portal */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="library" element={<LibraryManagement />} />
          <Route path="settings" element={<SystemSettings />} />
        </Route>

        {/* Lecturer portal */}
        <Route path="/lecturer" element={<LecturerLayout />}>
          <Route index element={<Navigate to="upload" replace />} />
          <Route path="upload" element={<UploadResource />} />
          <Route path="manage" element={<ManageResources />} />
          <Route path="analytics" element={<LecturerAnalytics />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}