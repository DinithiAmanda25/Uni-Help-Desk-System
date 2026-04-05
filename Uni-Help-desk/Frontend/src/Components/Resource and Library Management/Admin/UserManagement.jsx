import { useState, useEffect } from "react";
import { Search, Plus, Trash2, UserCheck, UserX, Mail, X, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { adminAPI, authAPI } from "../../../services/api";

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
      <AlertCircle size={10} /> {msg}
    </p>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STUDENT_ID_RE = /^[A-Za-z0-9-]{3,20}$/;

const roleColor = {
  student: "text-blue-600 bg-blue-50 border-blue-200",
  lecturer: "text-violet-600 bg-violet-50 border-violet-200",
  admin: "text-amber-600 bg-amber-50 border-amber-200",
};

const statusColor = {
  active: "text-emerald-600 bg-emerald-50",
  suspended: "text-red-600 bg-red-50",
  inactive: "text-gray-500 bg-gray-100",
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "Password@123", role: "student", studentId: "" });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getUsers({ limit: 100 });
      setUsers(data.users || []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this user?")) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
      toast.success("User removed");
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      const updated = await adminAPI.updateUserRole(id, role);
      setUsers(users.map(u => u._id === id ? updated : u));
      toast.success("Role updated");
    } catch (err) {
      toast.error(err.message || "Role update failed");
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      const updated = await adminAPI.updateUserStatus(id, newStatus);
      setUsers(users.map(u => u._id === id ? updated : u));
      toast.success("Status updated");
    } catch (err) {
      toast.error(err.message || "Status update failed");
    }
  };

  const [modalErrors, setModalErrors] = useState({});

  const validateAddUser = () => {
    const errs = {};
    if (!newUser.name.trim()) {
      errs.name = "Full name is required.";
    } else if (newUser.name.trim().length < 3) {
      errs.name = "Name must be at least 3 characters.";
    }
    if (!newUser.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!EMAIL_RE.test(newUser.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (!newUser.password) {
      errs.password = "Password is required.";
    } else if (newUser.password.length < 8) {
      errs.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(newUser.password)) {
      errs.password = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(newUser.password)) {
      errs.password = "Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(newUser.password)) {
      errs.password = "Password must contain at least one digit.";
    }
    if (newUser.studentId && !STUDENT_ID_RE.test(newUser.studentId.trim())) {
      errs.studentId = "ID must be 3–20 alphanumeric characters.";
    }
    setModalErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddUser = async () => {
    if (!validateAddUser()) return;
    setSaving(true);
    try {
      const result = await authAPI.register(newUser);
      if (result.user) setUsers([...users, result.user]);
      setShowAddModal(false);
      setModalErrors({});
      setNewUser({ name: "", email: "", password: "Password@123", role: "student", studentId: "" });
      toast.success("User added successfully!");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-6 py-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-sm text-gray-400 mt-1">Manage student, lecturer, and admin accounts</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md text-sm">
          <Plus size={16} /> Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Users", value: users.length, color: "text-gray-700 bg-gray-100" },
          { label: "Students", value: users.filter(u => u.role === "student").length, color: "text-blue-600 bg-blue-50" },
          { label: "Lecturers", value: users.filter(u => u.role === "lecturer").length, color: "text-violet-600 bg-violet-50" },
          { label: "Suspended", value: users.filter(u => u.status === "suspended").length, color: "text-red-600 bg-red-50" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-2xl p-4 ${color} border border-current/10`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs font-medium mt-0.5 opacity-70">{label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-amber-300 shadow-sm" />
        </div>
        {["All", "student", "lecturer", "admin"].map(r => (
          <button key={r} onClick={() => setRoleFilter(r)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium border capitalize transition-all ${roleFilter === r ? "bg-amber-500 text-white border-amber-500" : "bg-white text-gray-600 border-gray-200 hover:border-amber-300"}`}>
            {r}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="text-amber-400 animate-spin" />
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">User</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">ID</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Role</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Joined</th>
                  <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{u.name}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1"><Mail size={9} />{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{u.studentId || "—"}</span>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-lg border cursor-pointer outline-none capitalize ${roleColor[u.role]}`}
                      >
                        <option value="student">student</option>
                        <option value="lecturer">lecturer</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColor[u.status] || "text-gray-500 bg-gray-100"}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleStatusToggle(u._id, u.status)}
                          className={`p-2 rounded-xl transition-colors ${u.status === "active" ? "hover:bg-amber-50 text-gray-400 hover:text-amber-500" : "hover:bg-emerald-50 text-gray-400 hover:text-emerald-500"}`}
                          title={u.status === "active" ? "Suspend user" : "Activate user"}
                        >
                          {u.status === "active" ? <UserX size={14} /> : <UserCheck size={14} />}
                        </button>
                        <button onClick={() => handleDelete(u._id)} className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-400 text-sm">No users found</div>
          )}
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800">Add New User</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Full Name", key: "name", placeholder: "e.g. John Smith" },
                { label: "Email", key: "email", placeholder: "e.g. john@uni.edu", type: "email" },
                { label: "Temporary Password", key: "password", placeholder: "Min. 8 chars, upper, lower & number", type: "password" },
                { label: "Student/Staff ID (optional)", key: "studentId", placeholder: "e.g. 2026001" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                  <input
                    type={type || "text"}
                    value={newUser[key]}
                    onChange={(e) => {
                      setNewUser({ ...newUser, [key]: e.target.value });
                      if (modalErrors[key]) setModalErrors((p) => { const n = { ...p }; delete n[key]; return n; });
                    }}
                    placeholder={placeholder}
                    className={`w-full px-4 py-2.5 text-sm bg-gray-50 border rounded-xl outline-none focus:border-amber-300 transition-all ${
                      modalErrors[key] ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  <FieldError msg={modalErrors[key]} />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-amber-300">
                  <option value="student">Student</option>
                  <option value="lecturer">Lecturer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setShowAddModal(false); setModalErrors({}); }} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl transition-all text-sm">Cancel</button>
              <button onClick={handleAddUser} disabled={saving} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-70">
                {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Adding...</> : <><CheckCircle2 size={15} /> Add User</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
