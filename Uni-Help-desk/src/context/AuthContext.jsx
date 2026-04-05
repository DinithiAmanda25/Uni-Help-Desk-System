import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE = 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Restore session and verify with backend
  useEffect(() => {
    const initializeAuth = async () => {
      const saved = localStorage.getItem('uhd_user');
      if (saved) {
        try {
          const userData = JSON.parse(saved);
          // Verify token/get fresh profile
          const res = await fetch(`${API_BASE}/users/profile`, {
            headers: { 'Authorization': `Bearer ${userData.token}` }
          });
          if (res.ok) {
            const freshData = await res.json();
            setCurrentUser({ ...freshData, token: userData.token });
          } else {
            localStorage.removeItem('uhd_user');
          }
        } catch (err) {
          localStorage.removeItem('uhd_user');
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.message };
      
      setCurrentUser(data);
      localStorage.setItem('uhd_user', JSON.stringify(data));
      return { success: true, user: data };
    } catch (err) {
      return { success: false, error: 'Server connection failed.' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.message };
      
      setCurrentUser(data);
      localStorage.setItem('uhd_user', JSON.stringify(data));
      return { success: true, user: data };
    } catch (err) {
      return { success: false, error: 'Registration failed. Server error.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('uhd_user');
  };

  const updateProfile = async (updates) => {
    try {
      const res = await fetch(`${API_BASE}/users/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.message };
      
      const updated = { ...currentUser, ...data };
      setCurrentUser(updated);
      localStorage.setItem('uhd_user', JSON.stringify(updated));
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Update failed.' };
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const res = await fetch(`${API_BASE}/users/profile/password`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.message };
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Password update failed.' };
    }
  };

  const getAllUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`, {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        return data;
      }
    } catch (err) { console.error(err); }
    return [];
  };

  const updateUser = async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(prev => prev.map(u => u._id === id ? { ...u, ...data } : u));
        return { success: true };
      }
    } catch (err) { console.error(err); }
    return { success: false };
  };

  const deleteUser = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u._id !== id));
        return { success: true };
      }
    } catch (err) { console.error(err); }
    return { success: false };
  };

  const getUserById = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      if (res.ok) return await res.json();
    } catch (err) { console.error(err); }
    return null;
  };

  const getNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications`, {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) { console.error(err); }
  };

  const markNotificationRead = async (id) => {
    try {
      await fetch(`${API_BASE}/notifications/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) { console.error(err); }
  };

  const markAllRead = async () => {
    try {
      await fetch(`${API_BASE}/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) { console.error(err); }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const isAdmin = () => currentUser?.role === 'admin';
  const isStaff = () => currentUser?.role === 'staff';
  const isStudent = () => currentUser?.role === 'student';

  useEffect(() => {
    if (currentUser) {
      getNotifications();
      const interval = setInterval(getNotifications, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{
      currentUser, loading, login, register, logout, updateProfile, updatePassword,
      getAllUsers, updateUser, deleteUser, getUserById,
      notifications, markNotificationRead, markAllRead, unreadCount,
      isAdmin, isStaff, isStudent,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
