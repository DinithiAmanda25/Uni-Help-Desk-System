import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Building, Hash, Shield, Edit2, Save, X,
  Lock, CheckCircle, AlertCircle, Eye, EyeOff, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';


function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const roleConfig = {
  admin: { label: 'Administrator', badge: 'badge-purple', icon: <Shield size={14} /> },
  staff: { label: 'Staff', badge: 'badge-blue', icon: <User size={14} /> },
  student: { label: 'Student', badge: 'badge-green', icon: <User size={14} /> },
};

export default function ProfilePage() {
  const { currentUser, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', department: '' });
  const [editErrors, setEditErrors] = useState({});
  const [editSuccess, setEditSuccess] = useState(false);

  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });

  const rc = roleConfig[currentUser?.role] || roleConfig.student;

  const startEditing = () => {
    setEditForm({
      name: currentUser.name,
      phone: currentUser.phone || '',
      department: currentUser.department || '',
    });
    setEditErrors({});
    setEditSuccess(false);
    setEditing(true);
  };

  const validateEdit = () => {
    const e = {};
    if (!editForm.name.trim()) e.name = 'Name is required.';
    else if (editForm.name.trim().length < 3) e.name = 'Name must be at least 3 characters.';
    if (editForm.phone && !/^\+?[\d\s\-()]{7,15}$/.test(editForm.phone))
      e.phone = 'Enter a valid phone number.';
    return e;
  };

  const handleEditSave = async () => {
    const e = validateEdit();
    setEditErrors(e);
    if (Object.keys(e).length) return;
    const res = await updateProfile({ name: editForm.name.trim(), phone: editForm.phone, department: editForm.department });
    if (res.success) {
      setEditing(false);
      setEditSuccess(true);
      setTimeout(() => setEditSuccess(false), 3000);
    } else {
      setEditErrors({ server: res.error });
    }
  };

  const validatePw = () => {
    const e = {};
    if (!pwForm.current) e.current = 'Current password is required.';
    if (!pwForm.newPw) e.newPw = 'New password is required.';
    else if (pwForm.newPw.length < 8) e.newPw = 'Must be at least 8 characters.';
    else if (!/[A-Z]/.test(pwForm.newPw)) e.newPw = 'Must include at least one uppercase letter.';
    else if (!/[a-z]/.test(pwForm.newPw)) e.newPw = 'Must include at least one lowercase letter.';
    else if (!/[0-9]/.test(pwForm.newPw)) e.newPw = 'Must include at least one number.';
    else if (!/[^A-Za-z0-9]/.test(pwForm.newPw)) e.newPw = 'Must include at least one special character.';
    else if (pwForm.newPw === pwForm.current) e.newPw = 'New password must differ from current.';
    
    if (!pwForm.confirm) e.confirm = 'Please confirm new password.';
    else if (pwForm.confirm !== pwForm.newPw) e.confirm = 'Passwords do not match.';
    return e;
  };

  const handlePwSave = async (ev) => {
    ev.preventDefault();
    const e = validatePw();
    setPwErrors(e);
    if (Object.keys(e).length) return;
    
    const res = await updatePassword(pwForm.current, pwForm.newPw);
    if (res.success) {
      setPwSuccess(true);
      setPwForm({ current: '', newPw: '', confirm: '' });
      setTimeout(() => setPwSuccess(false), 3000);
    } else {
      setPwErrors({ current: res.error });
    }
  };

  const setPw = (k, v) => { setPwForm(f => ({ ...f, [k]: v })); setPwErrors(e => ({ ...e, [k]: '' })); };
  const toggleShowPw = (k) => setShowPw(s => ({ ...s, [k]: !s[k] }));

  const handleLogout = () => { logout(); navigate('/login'); };

  if (!currentUser) return null;

  return (
    <div className="flex flex-col gap-6 pt-2 pb-12 animate-fadeIn">
      <div className="flex-1 w-full mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
          {/* Sidebar Card */}
          <aside className="card p-7 flex flex-col gap-5 lg:sticky lg:top-6 animate-fadeInUp">
            <div className="flex flex-col items-center gap-2.5 text-center pb-5 border-b border-brand-border">
              <div className="avatar avatar-xl shrink-0 w-24 h-24 text-3xl mb-1">{getInitials(currentUser.name)}</div>
              <h2 className="text-lg font-bold text-text-primary">{currentUser.name}</h2>
              <span className={`badge ${rc.badge}`}>{rc.icon}&nbsp;{rc.label}</span>
              <span className={`badge ${currentUser.isActive ? 'badge-green' : 'badge-red'} mt-2`}>
                {currentUser.isActive ? '● Active' : '● Inactive'}
              </span>
            </div>

            <div className="flex flex-col gap-2.5 mt-1">
              <div className="flex items-center gap-2 text-sm text-text-secondary"><Mail size={14} className="text-text-muted shrink-0" /><span>{currentUser.email}</span></div>
              <div className="flex items-center gap-2 text-sm text-text-secondary"><Hash size={14} className="text-text-muted shrink-0" /><span>{currentUser.studentId}</span></div>
              {currentUser.department && <div className="flex items-center gap-2 text-sm text-text-secondary"><Building size={14} className="text-text-muted shrink-0" /><span>{currentUser.department}</span></div>}
              {currentUser.phone && <div className="flex items-center gap-2 text-sm text-text-secondary"><Phone size={14} className="text-text-muted shrink-0" /><span>{currentUser.phone}</span></div>}
              <div className="flex items-center gap-2 text-sm text-text-secondary"><Shield size={14} className="text-text-muted shrink-0" /><span>Member since {currentUser.createdAt}</span></div>
            </div>

            <button className="btn btn-danger w-full justify-center mt-2" onClick={handleLogout} id="profile-logout-btn">
              <LogOut size={16} /> Sign Out
            </button>
          </aside>

          {/* Main Panel */}
          <div className="flex flex-col gap-6">
            {/* Personal Info */}
            <div className="card animate-fadeInUp" id="personal-info-card">
              <div className="flex justify-between items-center mb-5 pb-4 border-b border-brand-border/50">
                <h2 className="text-lg font-bold text-text-primary">Personal Information</h2>
                {!editing ? (
                  <button className="btn focus:ring-2 focus:ring-brand-border focus:outline-none bg-brand-primary border border-brand-border text-text-primary hover:bg-brand-secondary transition-colors text-xs font-semibold px-3 py-1.5 rounded-md flex items-center justify-center gap-2 shadow-sm" onClick={startEditing} id="edit-profile-btn">
                    <Edit2 size={14} /> Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button className="btn focus:ring-2 focus:ring-brand-border focus:outline-none bg-brand-primary border border-brand-border text-text-primary hover:bg-brand-secondary transition-colors text-xs font-semibold px-3 py-1.5 rounded-md flex items-center justify-center gap-2 shadow-sm" onClick={() => setEditing(false)} id="cancel-edit-btn">
                      <X size={14} /> Cancel
                    </button>
                    <button className="btn btn-primary text-xs px-3 py-1.5 h-auto rounded-md" onClick={handleEditSave} id="save-profile-btn">
                      <Save size={14} /> Save
                    </button>
                  </div>
                )}
              </div>

              {editSuccess && (
                <div className="alert alert-success mb-5" id="edit-success-msg">
                  <CheckCircle size={16} /> Profile updated successfully!
                </div>
              )}

              {editing ? (
                <div className="flex flex-col gap-4">
                  <div className="form-group mb-0">
                    <label className="form-label" htmlFor="edit-name">Full Name</label>
                    <input id="edit-name" type="text" className={`form-input focus:ring-2 focus:ring-blue-500/50 bg-brand-primary border ${editErrors.name ? 'border-accent-red' : 'border-brand-border hover:border-blue-500/50'} text-text-primary rounded-lg px-4 py-2.5 outline-none transition-all w-full`}
                      value={editForm.name} onChange={e => { setEditForm(f => ({ ...f, name: e.target.value })); setEditErrors(er => ({ ...er, name: '' })); }} />
                    {editErrors.name && <span className="form-error mt-1.5 flex items-center gap-1 text-xs text-accent-red"><AlertCircle size={12} />{editErrors.name}</span>}
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label" htmlFor="edit-phone">Phone Number</label>
                    <input id="edit-phone" type="tel" className={`form-input focus:ring-2 focus:ring-blue-500/50 bg-brand-primary border ${editErrors.phone ? 'border-accent-red' : 'border-brand-border hover:border-blue-500/50'} text-text-primary rounded-lg px-4 py-2.5 outline-none transition-all w-full`}
                      placeholder="+94 77 123 4567"
                      value={editForm.phone} onChange={e => { setEditForm(f => ({ ...f, phone: e.target.value })); setEditErrors(er => ({ ...er, phone: '' })); }} />
                    {editErrors.phone && <span className="form-error mt-1.5 flex items-center gap-1 text-xs text-accent-red"><AlertCircle size={12} />{editErrors.phone}</span>}
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label" htmlFor="edit-dept">Department</label>
                    <input id="edit-dept" type="text" className="form-input focus:ring-2 focus:ring-blue-500/50 bg-brand-primary border border-brand-border hover:border-blue-500/50 text-text-primary rounded-lg px-4 py-2.5 outline-none transition-all w-full"
                      placeholder="e.g. Computer Science"
                      value={editForm.department} onChange={e => setEditForm(f => ({ ...f, department: e.target.value }))} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  {[
                    { icon: <User size={15} />, label: 'Full Name', value: currentUser.name },
                    { icon: <Mail size={15} />, label: 'Email', value: currentUser.email },
                    { icon: <Hash size={15} />, label: 'ID', value: currentUser.studentId },
                    { icon: <Building size={15} />, label: 'Department', value: currentUser.department || '—' },
                    { icon: <Phone size={15} />, label: 'Phone', value: currentUser.phone || '—' },
                    { icon: <Shield size={15} />, label: 'Role', value: rc.label },
                  ].map((r, i) => (
                    <div key={i} className="flex justify-between items-center py-3.5 border-b border-blue-400/10 last:border-0 last:pb-1 first:pt-1">
                      <div className="flex items-center gap-2 text-[0.85rem] text-text-muted font-medium"><span className="shrink-0">{r.icon}</span>{r.label}</div>
                      <div className="text-[0.875rem] text-text-primary font-medium text-right">{r.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Change Password */}
            <div className="card animate-fadeInUp" id="change-password-card">
              <h2 className="text-lg font-bold text-text-primary mb-5 pb-4 border-b border-brand-border/50">Change Password</h2>
              {pwSuccess && (
                <div className="alert alert-success mb-5" id="pw-success-msg">
                  <CheckCircle size={16} /> Password changed successfully!
                </div>
              )}
              <form onSubmit={handlePwSave} className="flex flex-col gap-4" id="change-password-form" noValidate>
                {[
                  { key: 'current', label: 'Current Password', id: 'pw-current' },
                  { key: 'newPw', label: 'New Password', id: 'pw-new' },
                  { key: 'confirm', label: 'Confirm New Password', id: 'pw-confirm' },
                ].map(({ key, label, id }) => (
                  <div className="form-group mb-0" key={key}>
                    <label className="form-label" htmlFor={id}>{label}</label>
                    <div className="input-wrapper icon-right relative">
                      <Lock size={16} className="input-icon absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      <input id={id} type={showPw[key] ? 'text' : 'password'}
                        className={`form-input focus:ring-2 focus:ring-blue-500/50 bg-brand-primary border ${pwErrors[key] ? 'border-accent-red' : 'border-brand-border hover:border-blue-500/50'} text-text-primary rounded-lg pl-10 pr-10 py-2.5 outline-none transition-all w-full`}
                        placeholder="••••••••"
                        value={pwForm[key]} onChange={e => setPw(key, e.target.value)} />
                      <button type="button" className="input-icon-right absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer" onClick={() => toggleShowPw(key)}>
                        {showPw[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {key === 'newPw' && pwForm.newPw && (
                      <div className="mt-3 flex flex-col gap-2 bg-[#f8fafc] p-3 rounded-xl border border-gray-100">
                        <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Requirements</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {[
                            { label: 'Min. 8 chars', met: pwForm.newPw.length >= 8 },
                            { label: 'Uppercase', met: /[A-Z]/.test(pwForm.newPw) },
                            { label: 'Lowercase', met: /[a-z]/.test(pwForm.newPw) },
                            { label: 'Number', met: /[0-9]/.test(pwForm.newPw) },
                            { label: 'Special char', met: /[^A-Za-z0-9]/.test(pwForm.newPw) },
                          ].map((req, i) => (
                            <div key={i} className={`flex items-center gap-2 text-[0.65rem] font-medium transition-colors ${req.met ? 'text-green-500' : 'text-gray-400'}`}>
                              {req.met ? <CheckCircle size={10} className="text-green-500" /> : <div className="w-1.5 h-1.5 bg-gray-300 rounded-full ml-1" />}
                              {req.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {pwErrors[key] && <span className="form-error mt-1.5 flex items-center gap-1 text-xs text-accent-red"><AlertCircle size={12} />{pwErrors[key]}</span>}
                  </div>
                ))}
                <button type="submit" className="btn btn-primary w-max mt-2" id="change-pw-submit-btn">
                  <Lock size={15} /> Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
