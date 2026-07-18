import React, { useState, useEffect } from 'react';
import { UserService, SystemUser } from '../../services/user.service';
import { SettingsService } from '../../services/settings.service';
import { authService } from '../../services/auth.service';
import { Button } from '../../components/ui/button';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Loader2, UserPlus, ShieldAlert, Key, Edit, Ban, CheckCircle, Save } from 'lucide-react';
import { UserRole } from '../../types';

export function UserManagement() {
  const { user: currentUser } = useAuth();
  const { addToast: showToast } = useToast();
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);

  // New user form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'teacher' as UserRole
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await UserService.getAllUsers();
      setUsers(data);
    } catch (error) {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.role !== 'admin') {
      showToast('Permission denied', 'error');
      return;
    }
    setSubmitting(true);
    try {
      // Use adminCreateUser to avoid signing out the current admin
      await authService.adminCreateUser(formData.email, formData.password, formData.displayName, formData.role);
      await SettingsService.logAction({
        userId: currentUser.uid,
        userEmail: currentUser.email!,
        action: 'CREATE_USER',
        module: 'UserManagement',
        details: `Created user ${formData.email} with role ${formData.role}`,
        status: 'success'
      });
      showToast('User created successfully', 'success');
      setShowForm(false);
      setFormData({ email: '', password: '', displayName: '', role: 'teacher' });
      loadUsers();
    } catch (error: any) {
      showToast(error.message || 'Failed to create user', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (uid: string, currentStatus: string) => {
    if (currentUser?.role !== 'admin') return;
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await UserService.updateUserStatus(uid, newStatus);
      setUsers(users.map(u => u.uid === uid ? { ...u, status: newStatus } : u));
      showToast(`User marked as ${newStatus}`, 'success');
      await SettingsService.logAction({
        userId: currentUser.uid,
        userEmail: currentUser.email!,
        action: 'UPDATE_USER_STATUS',
        module: 'UserManagement',
        details: `Changed user ${uid} status to ${newStatus}`,
        status: 'success'
      });
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    if (currentUser?.role !== 'admin') return;
    try {
      await UserService.updateUserRole(uid, newRole);
      setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole } : u));
      showToast('User role updated', 'success');
      await SettingsService.logAction({
        userId: currentUser.uid,
        userEmail: currentUser.email!,
        action: 'UPDATE_USER_ROLE',
        module: 'UserManagement',
        details: `Changed user ${uid} role to ${newRole}`,
        status: 'success'
      });
    } catch (error) {
      showToast('Failed to update role', 'error');
    }
  };

  const handleResetPassword = async (email: string) => {
    if (currentUser?.role !== 'admin') return;
    try {
      await authService.resetPassword(email);
      showToast('Password reset email sent', 'success');
      await SettingsService.logAction({
        userId: currentUser.uid,
        userEmail: currentUser.email!,
        action: 'RESET_PASSWORD',
        module: 'UserManagement',
        details: `Requested password reset for ${email}`,
        status: 'success'
      });
    } catch (error) {
      showToast('Failed to send reset email', 'error');
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="p-8 w-full max-w-none">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
        {currentUser?.role === 'admin' && (
          <Button onClick={() => setShowForm(!showForm)}>
            <UserPlus className="w-4 h-4 mr-2" />
            {showForm ? 'Cancel' : 'Add User'}
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-4">Create New User</h3>
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Display Name"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800"
              required
              minLength={6}
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="teacher">Teacher</option>
              <option value="principal">Principal</option>
              <option value="admin">Admin</option>
            </select>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Create User
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[800px]">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.uid} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">{user.displayName || 'Unknown'}</div>
                  <div className="text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  {currentUser?.role === 'admin' ? (
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.uid, e.target.value as UserRole)}
                      className="bg-transparent border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="admin">Admin</option>
                      <option value="principal">Principal</option>
                      <option value="teacher">Teacher</option>
                    </select>
                  ) : (
                    <span className="capitalize">{user.role}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.status || 'active'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleResetPassword(user.email)} className="text-indigo-600 hover:text-indigo-900" title="Reset Password">
                    <Key className="w-4 h-4 inline" />
                  </button>
                  <button onClick={() => handleStatusChange(user.uid, user.status || 'active')} className="text-gray-600 hover:text-gray-900 ml-2" title={user.status === 'active' ? 'Deactivate' : 'Activate'}>
                    {user.status === 'active' ? <Ban className="w-4 h-4 inline text-red-600" /> : <CheckCircle className="w-4 h-4 inline text-green-600" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
