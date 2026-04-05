import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Save, X, Mail, Hash, Building, Phone,
  Shield, User, AlertCircle, CheckCircle, Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';


function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const ROLES = ['student', 'staff', 'admin'];
const roleConfig = {
  admin: 'badge-purple', staff: 'badge-blue', student: 'badge-green',
};

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const { getUserById, updateUser, deleteUser, currentUser } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '', email: '', role: 'student',
    department: '', phone: '', isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const data = await getUserById(id);
      if (data) {
        setUser(data);
        setForm({
          name: data.name, email: data.email, role: data.role,
          department: data.department || '', phone: data.phone || '', isActive: data.isActive,
        });
      }
      setLoading(false);
    };
    fetchUser();
  }, [id, getUserById]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 animate-fadeIn">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col gap-6 pt-2 pb-12 animate-fadeIn">
        <div className="flex-1 flex flex-col items-center justify-center px-4 mt-10">
          <div className="card w-full max-w-md flex flex-col items-center justify-center p-12 text-center animate-fadeInUp">
            <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center text-text-muted mb-4"><User size={32} /></div>
            <h3 className="text-xl font-extrabold text-text-primary mb-2">User not found</h3>
            <p className="text-sm text-text-secondary pt-0.5">This user may have been deleted.</p>
            <Link to="/admin/users" className="btn btn-primary mt-6">Back to Users</Link>
          </div>
        </div>
      </div>
    );
  }

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    else if (form.name.trim().length < 3) e.name = 'Name must be at least 3 characters.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (form.phone && !/^\+?[\d\s\-()]{7,15}$/.test(form.phone)) e.phone = 'Enter a valid phone number.';
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    const res = await updateUser(id, { ...form, name: form.name.trim(), email: form.email.trim() });
    if (res.success) {
      setSuccess('User updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      // Refresh user data if needed or just trust the local state
    }
  };

  const handleDelete = async () => {
    const res = await deleteUser(id);
    if (res.success) navigate('/admin/users');
  };

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const isSelf = currentUser?._id === id;

  return (
    <div className="flex flex-col gap-6 pt-2 pb-12 animate-fadeIn">
      <div className="flex-1 w-full mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/admin/users" className="btn focus:ring-2 focus:ring-brand-border focus:outline-none bg-brand-primary border border-brand-border text-text-primary hover:bg-slate-50 transition-colors text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm" id="back-to-users-btn">
            <ArrowLeft size={15} className="text-text-muted" /> Users
          </Link>
          <div>
            <h1 className="text-2xl font-black text-text-primary">Edit User</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
          {/* User Card */}
          <aside className="card p-7 flex flex-col gap-5 lg:sticky lg:top-6 animate-fadeInUp">
            <div className="flex flex-col items-center gap-2.5 text-center pb-5 border-b border-brand-border">
              <div className="avatar avatar-xl shrink-0 w-24 h-24 text-3xl mb-1">{getInitials(user.name)}</div>
              <h2 className="text-lg font-bold text-text-primary">{user.name}</h2>
              <span className={`badge ${roleConfig[user.role]}`}>{user.role}</span>
              <span className={`badge ${user.isActive ? 'badge-green' : 'badge-red'} mt-2`}>
                {user.isActive ? '● Active' : '● Inactive'}
              </span>
            </div>
            <div className="flex flex-col gap-2.5 mt-1">
              <div className="flex items-center gap-2 text-sm text-text-secondary"><Mail size={14} className="text-text-muted shrink-0" /><span className="truncate">{user.email}</span></div>
              <div className="flex items-center gap-2 text-sm text-text-secondary"><Hash size={14} className="text-text-muted shrink-0" /><span>{user.studentId}</span></div>
              {user.department && <div className="flex items-center gap-2 text-sm text-text-secondary"><Building size={14} className="text-text-muted shrink-0" /><span>{user.department}</span></div>}
              {user.phone && <div className="flex items-center gap-2 text-sm text-text-secondary"><Phone size={14} className="text-text-muted shrink-0" /><span>{user.phone}</span></div>}
              <div className="flex items-center gap-2 text-sm text-text-secondary"><Shield size={14} className="text-text-muted shrink-0" /><span>Joined {user.createdAt}</span></div>
            </div>
            {!isSelf && (
              <button className="btn focus:ring-2 focus:ring-accent-red focus:outline-none bg-accent-red hover:bg-[#ff3333] text-white border-none text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 mt-2 w-full transition-colors" onClick={() => setConfirmDelete(true)} id="delete-user-btn">
                <Trash2 size={16} /> Delete User
              </button>
            )}
          </aside>

          {/* Edit Form */}
          <div className="card animate-fadeInUp" id="edit-user-form-card">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-brand-border/50">
              <h2 className="text-lg font-bold text-text-primary">Edit Details</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <Link to="/admin/users" className="btn focus:ring-2 focus:ring-brand-border focus:outline-none bg-brand-primary border border-brand-border text-text-primary hover:bg-brand-secondary transition-colors text-xs font-semibold px-3 py-1.5 rounded-md flex items-center justify-center gap-1.5 shadow-sm flex-1 sm:flex-none" id="discard-changes-btn">
                  <X size={14} className="text-text-muted" /> Discard
                </Link>
                <button className="btn btn-primary text-xs px-3 py-1.5 h-auto rounded-md flex flex-1 sm:flex-none justify-center items-center gap-1.5" onClick={handleSave} id="save-user-btn">
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </div>

            {success && (
              <div className="alert alert-success mb-6" id="user-edit-success-msg">
                <CheckCircle size={16} /> {success}
              </div>
            )}

            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="form-group mb-0">
                  <label className="form-label" htmlFor="edit-user-name">Full Name</label>
                  <div className="input-wrapper relative">
                    <User size={16} className="input-icon absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    <input id="edit-user-name" type="text"
                      className={`form-input focus:ring-2 focus:ring-blue-500/50 bg-brand-primary border ${errors.name ? 'border-accent-red' : 'border-brand-border hover:border-blue-500/50'} text-text-primary rounded-lg pl-10 pr-4 py-2.5 outline-none transition-all w-full`}
                      value={form.name} onChange={e => set('name', e.target.value)} />
                  </div>
                  {errors.name && <span className="form-error mt-1.5 flex items-center gap-1 text-xs text-accent-red"><AlertCircle size={12} />{errors.name}</span>}
                </div>

                <div className="form-group mb-0">
                  <label className="form-label" htmlFor="edit-user-email">Email</label>
                  <div className="input-wrapper relative">
                    <Mail size={16} className="input-icon absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    <input id="edit-user-email" type="email"
                      className={`form-input focus:ring-2 focus:ring-blue-500/50 bg-brand-primary border ${errors.email ? 'border-accent-red' : 'border-brand-border hover:border-blue-500/50'} text-text-primary rounded-lg pl-10 pr-4 py-2.5 outline-none transition-all w-full`}
                      value={form.email} onChange={e => set('email', e.target.value)} />
                  </div>
                  {errors.email && <span className="form-error mt-1.5 flex items-center gap-1 text-xs text-accent-red"><AlertCircle size={12} />{errors.email}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="form-group mb-0">
                  <label className="form-label" htmlFor="edit-user-role">Role</label>
                  <div className="relative">
                    <select
                      id="edit-user-role"
                      className="form-select w-full appearance-none focus:ring-2 focus:ring-blue-500/50 bg-brand-primary border border-brand-border hover:border-blue-500/50 text-text-primary rounded-lg px-4 py-2.5 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      value={form.role}
                      onChange={e => set('role', e.target.value)}
                      disabled={isSelf}
                    >
                      {ROLES.map(r => <option key={r} value={r} className="bg-brand-primary text-text-primary">{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                    </select>
                  </div>
                  {isSelf && <span className="text-xs text-text-muted mt-1.5 inline-block font-medium">Cannot change your own role.</span>}
                </div>

                <div className="form-group mb-0">
                  <label className="form-label" htmlFor="edit-user-status">Account Status</label>
                  <div className="relative">
                    <select
                      id="edit-user-status"
                      className="form-select w-full appearance-none focus:ring-2 focus:ring-blue-500/50 bg-brand-primary border border-brand-border hover:border-blue-500/50 text-text-primary rounded-lg px-4 py-2.5 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      value={form.isActive ? 'active' : 'inactive'}
                      onChange={e => set('isActive', e.target.value === 'active')}
                      disabled={isSelf}
                    >
                      <option value="active" className="bg-brand-primary text-text-primary">Active</option>
                      <option value="inactive" className="bg-brand-primary text-text-primary">Inactive</option>
                    </select>
                  </div>
                  {isSelf && <span className="text-xs text-text-muted mt-1.5 inline-block font-medium">Cannot deactivate your own account.</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="form-group mb-0">
                  <label className="form-label" htmlFor="edit-user-dept">Department</label>
                  <div className="input-wrapper relative">
                    <Building size={16} className="input-icon absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    <input id="edit-user-dept" type="text" className="form-input focus:ring-2 focus:ring-blue-500/50 bg-brand-primary border border-brand-border hover:border-blue-500/50 text-text-primary rounded-lg pl-10 pr-4 py-2.5 outline-none transition-all w-full"
                      value={form.department} onChange={e => set('department', e.target.value)}
                      placeholder="e.g. Computer Science" />
                  </div>
                </div>

                <div className="form-group mb-0">
                  <label className="form-label" htmlFor="edit-user-phone">Phone</label>
                  <div className="input-wrapper relative">
                    <Phone size={16} className="input-icon absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    <input id="edit-user-phone" type="tel"
                      className={`form-input focus:ring-2 focus:ring-blue-500/50 bg-brand-primary border ${errors.phone ? 'border-accent-red' : 'border-brand-border hover:border-blue-500/50'} text-text-primary rounded-lg pl-10 pr-4 py-2.5 outline-none transition-all w-full`}
                      value={form.phone} onChange={e => set('phone', e.target.value)}
                      placeholder="+94 77 123 4567" />
                  </div>
                  {errors.phone && <span className="form-error mt-1.5 flex items-center gap-1 text-xs text-accent-red"><AlertCircle size={12} />{errors.phone}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirm Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-[#000000b3] flex items-center justify-center z-[1000] p-4 animate-fadeIn" id="delete-user-modal">
            <div className="card relative shadow-2xl w-full max-w-[400px] text-center p-9">
              <div className="text-accent-red mx-auto mb-4 flex justify-center"><AlertCircle size={40} /></div>
              <h3 className="text-xl font-extrabold mb-2.5 text-text-primary">Delete User?</h3>
              <p className="text-sm text-text-secondary mb-6 leading-relaxed">Are you sure you want to permanently delete <strong className="text-text-primary font-bold">{user.name}</strong>? This cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <button className="btn focus:ring-2 focus:ring-brand-border focus:outline-none bg-brand-primary border border-brand-border text-text-primary hover:bg-brand-secondary transition-colors text-sm font-semibold px-4 py-2.5 rounded-lg flex-1 justify-center shadow-sm" onClick={() => setConfirmDelete(false)} id="cancel-delete-modal-btn">Cancel</button>
                <button className="btn focus:ring-2 focus:ring-accent-red focus:outline-none bg-accent-red hover:bg-[#ff3333] text-white border-none text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 flex-1 shadow-sm transition-colors" onClick={handleDelete} id="confirm-delete-modal-btn">
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
