import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, UserCheck, UserX, Trash2, Eye, Users,
  Filter, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';


function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const roleConfig = {
  admin: 'badge-purple',
  staff: 'badge-blue',
  student: 'badge-green',
};

const ROLE_FILTERS = ['All', 'student', 'staff', 'admin'];

export default function AdminUsersPage() {
  const { getAllUsers, updateUser, deleteUser } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getAllUsers();
    setUsersList(data);
    setLoading(false);
  };

  useState(() => {
    fetchUsers();
  }, []);

  const filtered = usersList.filter(u => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.studentId?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    const matchStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Active' && u.isActive) ||
      (statusFilter === 'Inactive' && !u.isActive);
    return matchSearch && matchRole && matchStatus;
  });

  const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const toggleStatus = async (user) => {
    const res = await updateUser(user._id, { isActive: !user.isActive });
    if (res.success) {
      flash(`${user.name} ${!user.isActive ? 'activated' : 'deactivated'} successfully.`);
      fetchUsers();
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteUser(id);
    if (res.success) {
      setConfirmDelete(null);
      flash('User deleted successfully.');
      fetchUsers();
    }
  };

  return (
    <div className="flex flex-col gap-6 pt-2 pb-12 animate-fadeIn">
      <div className="flex-1 w-full mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-text-primary mb-1">User Management</h1>
            <p className="text-sm text-text-secondary">Manage all registered accounts — activate, deactivate, or remove users.</p>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-secondary border border-brand-border rounded-md text-[0.875rem] font-semibold text-text-secondary whitespace-nowrap">
            <Users size={16} />
            <span>{usersList.length} users</span>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && successMsg && (
          <div className="alert alert-success mt-0 mb-6 animate-fadeIn" id="admin-success-msg">
            <UserCheck size={16} /> {successMsg}
          </div>
        )}

        {/* Filters */}
        <div className="card mb-6 flex flex-col gap-4 animate-fadeInUp" id="user-filter-panel">
          <div className="input-wrapper relative w-full">
            <Search size={16} className="input-icon absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="text"
              className="form-input focus:ring-2 focus:ring-blue-500/50 bg-brand-primary border border-brand-border hover:border-blue-500/50 text-text-primary rounded-lg pl-10 pr-4 py-2 outline-none transition-all w-full text-sm"
              placeholder="Search by name, email, or ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              id="user-search-input"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-sm text-text-muted font-medium"><Filter size={14} /> Role:</div>
              <div className="flex gap-1.5 flex-wrap" id="role-filter-chips">
                {ROLE_FILTERS.map(r => (
                  <button
                    key={r}
                    className={`px-3.5 py-1.5 rounded-full text-[0.8rem] font-semibold border transition-colors outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer ${roleFilter === r ? 'bg-blue-500 text-white border-blue-500' : 'bg-transparent text-text-muted border-brand-border hover:text-text-primary hover:border-blue-500/50'}`}
                    onClick={() => setRoleFilter(r)}
                    id={`role-filter-${r.toLowerCase()}`}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-sm text-text-muted font-medium"><Filter size={14} /> Status:</div>
              <div className="flex gap-1.5 flex-wrap" id="status-filter-chips">
                {['All', 'Active', 'Inactive'].map(s => (
                  <button
                    key={s}
                    className={`px-3.5 py-1.5 rounded-full text-[0.8rem] font-semibold border transition-colors outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer ${statusFilter === s ? 'bg-blue-500 text-white border-blue-500' : 'bg-transparent text-text-muted border-brand-border hover:text-text-primary hover:border-blue-500/50'}`}
                    onClick={() => setStatusFilter(s)}
                    id={`status-filter-${s.toLowerCase()}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card p-0 w-full overflow-x-auto animate-fadeIn">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center" id="no-users-found">
              <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center text-text-muted mb-4"><Users size={32} /></div>
              <h3 className="text-lg font-bold text-text-primary mb-2">No users found</h3>
              <p className="text-sm text-text-secondary">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse" id="users-table">
              <thead>
                <tr className="border-b border-brand-border bg-brand-primary/50">
                  <th className="px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider">User</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider hidden sm:table-cell">ID</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider hidden md:table-cell">Department</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider hidden lg:table-cell">Status</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider hidden xl:table-cell">Joined</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/50 bg-brand-secondary">
                {filtered.map(user => (
                  <tr key={user._id} className="transition-colors hover:bg-brand-primary/50 group" id={`user-row-${user._id}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar w-9 h-9 text-xs shrink-0">{getInitials(user.name)}</div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm text-text-primary truncate max-w-[150px] sm:max-w-[200px]">{user.name}</div>
                          <div className="text-xs text-text-muted truncate max-w-[150px] sm:max-w-[200px]">{user.email}</div>
                          {/* Mobile-only info */}
                          <div className="lg:hidden flex flex-wrap gap-1 mt-1">
                            <span className={`badge ${user.isActive ? 'badge-green' : 'badge-red'} text-[0.65rem] px-1.5 py-0`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell"><span className="text-sm text-text-secondary">{user.studentId || '—'}</span></td>
                    <td className="px-5 py-4 whitespace-nowrap"><span className={`badge ${roleConfig[user.role] || 'badge-gray'}`}>{user.role}</span></td>
                    <td className="px-5 py-4 hidden md:table-cell"><span className="text-sm text-text-secondary">{user.department || '—'}</span></td>
                    <td className="px-5 py-4 hidden lg:table-cell whitespace-nowrap">
                      <span className={`badge ${user.isActive ? 'badge-green' : 'badge-red'}`}>
                        {user.isActive ? '● Active' : '● Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden xl:table-cell whitespace-nowrap"><span className="text-sm text-text-muted">{user.createdAt}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5 justify-end">
                        <Link
                          to={`/admin/users/${user._id}`}
                          className="btn focus:ring-2 focus:ring-brand-border focus:outline-none bg-brand-primary border border-brand-border text-text-muted hover:text-blue-400 p-1.5 h-auto rounded-md shadow-sm transition-colors"
                          title="View / Edit"
                          id={`view-user-${user._id}`}
                        >
                          <Eye size={16} />
                        </Link>
                        <button
                          className={`btn p-1.5 h-auto rounded-md text-white border-none shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none ${user.isActive ? 'bg-accent-red hover:bg-[#ff3333]' : 'bg-accent-green hover:bg-[#00cc66]'}`}
                          onClick={() => toggleStatus(user)}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                          id={`toggle-status-${user._id}`}
                        >
                          {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                        <button
                          className="btn focus:ring-2 focus:ring-accent-red focus:outline-none bg-accent-red/10 border border-accent-red/20 text-accent-red hover:bg-accent-red hover:text-white p-1.5 h-auto rounded-md shadow-sm transition-colors"
                          onClick={() => setConfirmDelete(user)}
                          title="Delete user"
                          id={`delete-user-${user._id}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {filtered.length > 0 && (
          <div className="mt-4 text-right text-sm text-text-muted">
            Showing {filtered.length} of {usersList.length} users
          </div>
        )}

        {/* Delete Confirm Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-[#000000b3] flex items-center justify-center z-[1000] p-4 animate-fadeIn" id="delete-confirm-modal">
            <div className="card relative shadow-2xl w-full max-w-[400px] text-center p-9">
              <div className="text-accent-red mx-auto mb-4 flex justify-center"><AlertCircle size={40} /></div>
              <h3 className="text-xl font-extrabold mb-2.5 text-text-primary">Delete User?</h3>
              <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-text-primary font-bold">{confirmDelete.name}</strong>?
                This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button className="btn focus:ring-2 focus:ring-brand-border focus:outline-none bg-brand-primary border border-brand-border text-text-primary hover:bg-brand-secondary transition-colors text-sm font-semibold px-4 py-2.5 rounded-lg flex-1 justify-center shadow-sm" onClick={() => setConfirmDelete(null)} id="cancel-delete-btn">
                  Cancel
                </button>
                <button className="btn focus:ring-2 focus:ring-accent-red focus:outline-none bg-accent-red hover:bg-[#ff3333] text-white border-none text-sm font-semibold px-4 py-2.5 rounded-lg flex-1 justify-center shadow-sm" onClick={() => handleDelete(confirmDelete._id)} id="confirm-delete-btn">
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
