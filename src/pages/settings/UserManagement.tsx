import React, { useState, useEffect } from 'react';
import { AppSkeleton } from '../../components/ui/AppSkeleton';
import { UserService, SystemUser, RegistrationRequest } from '../../services/user.service';
import { SettingsService } from '../../services/settings.service';
import { authService } from '../../services/auth.service';
import { Button } from '../../components/ui/button';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Loader2, UserPlus, Key, Ban, CheckCircle, Save, Check, X, FileText, Calendar } from 'lucide-react';
import { UserRole } from '../../types';

export function UserManagement() {
  const { user: currentUser } = useAuth();
  const { addToast: showToast } = useToast();
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'requests'>('users');

  // New user form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'teacher' as UserRole
  });
  const [submitting, setSubmitting] = useState(false);
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allUsers, allRequests] = await Promise.all([
        UserService.getAllUsers().catch(err => {
          console.error("Error loading users:", err);
          showToast('Failed to load active users list', 'error');
          return [] as SystemUser[];
        }),
        UserService.getRegistrationRequests().catch(err => {
          console.error("Error loading registration requests:", err);
          showToast('Failed to load registration requests', 'error');
          return [] as RegistrationRequest[];
        })
      ]);
      setUsers(allUsers);
      setRequests(allRequests);
    } catch (error) {
      showToast('Failed to load user management data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await UserService.getAllUsers();
      setUsers(data);
    } catch (error) {
      showToast('Failed to load users', 'error');
    }
  };

  const loadRequests = async () => {
    try {
      const data = await UserService.getRegistrationRequests();
      setRequests(data);
    } catch (error) {
      showToast('Failed to load registration requests', 'error');
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
      await loadUsers();
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

  const handleApproveRequest = async (requestId: string) => {
    setProcessingRequestId(requestId);
    try {
      await UserService.approveRegistrationRequest(requestId);
      showToast('Registration request approved! Account is now active.', 'success');
      await Promise.all([loadUsers(), loadRequests()]);
      await SettingsService.logAction({
        userId: currentUser?.uid || 'unknown',
        userEmail: currentUser?.email || 'unknown',
        action: 'APPROVE_REGISTRATION',
        module: 'UserManagement',
        details: `Approved registration request ${requestId}`,
        status: 'success'
      });
    } catch (error: any) {
      showToast(error.message || 'Failed to approve request', 'error');
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    setProcessingRequestId(requestId);
    try {
      await UserService.rejectRegistrationRequest(requestId);
      showToast('Registration request rejected.', 'success');
      await loadRequests();
      await SettingsService.logAction({
        userId: currentUser?.uid || 'unknown',
        userEmail: currentUser?.email || 'unknown',
        action: 'REJECT_REGISTRATION',
        module: 'UserManagement',
        details: `Rejected registration request ${requestId}`,
        status: 'success'
      });
    } catch (error: any) {
      showToast(error.message || 'Failed to reject request', 'error');
    } finally {
      setProcessingRequestId(null);
    }
  };

  if (loading) {
    return <div className="p-8"><AppSkeleton type="dashboard" /></div>;
  }

  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="p-8 w-full max-w-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User & Account Requests</h2>
          <p className="text-sm text-gray-500 mt-1">Manage portal user accounts and pending signup requests</p>
        </div>
        {currentUser?.role === 'admin' && activeTab === 'users' && (
          <Button onClick={() => setShowForm(!showForm)}>
            <UserPlus className="w-4 h-4 mr-2" />
            {showForm ? 'Cancel' : 'Add User'}
          </Button>
        )}
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-200 dark:border-zinc-800 mb-6 gap-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
            activeTab === 'users'
              ? 'border-emerald-600 dark:border-sky-500 text-emerald-600 dark:text-sky-400 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          Active Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`relative pb-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
            activeTab === 'requests'
              ? 'border-emerald-600 dark:border-sky-500 text-emerald-600 dark:text-sky-400 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          Registration Requests
          {pendingRequestsCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full animate-pulse">
              {pendingRequestsCount} Pending
            </span>
          )}
        </button>
      </div>

      {activeTab === 'users' && (
        <>
          {showForm && (
            <div className="mb-8 p-6 bg-gray-50 dark:bg-zinc-900/50 rounded-xl border border-gray-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold mb-4">Create New User</h3>
              <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Display Name"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="px-4 py-2 border dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="px-4 py-2 border dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="px-4 py-2 border dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950"
                  required
                  minLength={6}
                />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="px-4 py-2 border dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950"
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

          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-zinc-800">
            <table className="w-full text-sm text-left min-w-[800px]">
              <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-zinc-900/60">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.uid} className="bg-white border-b dark:bg-zinc-950 dark:border-zinc-800 hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{user.displayName || 'Unknown'}</div>
                      <div className="text-gray-500 dark:text-zinc-400 text-xs">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {currentUser?.role === 'admin' ? (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.uid, e.target.value as UserRole)}
                          className="bg-transparent border border-gray-200 dark:border-zinc-800 rounded px-2.5 py-1 text-sm dark:text-zinc-300"
                        >
                          <option value="admin">Admin</option>
                          <option value="principal">Principal</option>
                          <option value="teacher">Teacher</option>
                          <option value="student">Student</option>
                        </select>
                      ) : (
                        <span className="capitalize px-2 py-1 rounded bg-gray-100 dark:bg-zinc-800 text-xs font-semibold">{user.role}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-100 text-red-800 dark:bg-rose-500/10 dark:text-rose-400'}`}>
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleResetPassword(user.email)} className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10 transition-colors" title="Reset Password">
                        <Key className="w-4 h-4 inline" />
                      </button>
                      <button onClick={() => handleStatusChange(user.uid, user.status || 'active')} className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors ml-2" title={user.status === 'active' ? 'Deactivate' : 'Activate'}>
                        {user.status === 'active' ? <Ban className="w-4 h-4 inline text-red-600 dark:text-rose-500" /> : <CheckCircle className="w-4 h-4 inline text-green-600 dark:text-emerald-500" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800">
              <FileText className="w-12 h-12 text-gray-300 dark:text-zinc-700 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-zinc-400 text-sm">No registration requests found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-zinc-800">
              <table className="w-full text-sm text-left min-w-[800px]">
                <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-zinc-900/60">
                  <tr>
                    <th className="px-6 py-3">Requested Account</th>
                    <th className="px-6 py-3">Assigned Role</th>
                    <th className="px-6 py-3">Requested Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id} className="bg-white border-b dark:bg-zinc-950 dark:border-zinc-800 hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">{req.displayName}</div>
                        <div className="text-gray-500 dark:text-zinc-400 text-xs">{req.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize px-2.5 py-1 rounded bg-blue-50 text-blue-700 dark:bg-sky-500/10 dark:text-sky-400 text-xs font-semibold">
                          {req.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-zinc-400 text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(req.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          req.status === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400' :
                          req.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-emerald-500/10 dark:text-emerald-400' :
                          'bg-red-100 text-red-800 dark:bg-rose-500/10 dark:text-rose-400'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {req.status === 'pending' ? (
                          <div className="flex justify-end gap-2">
                            <button
                              disabled={processingRequestId !== null}
                              onClick={() => handleRejectRequest(req.id!)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                            >
                              <X className="w-3.5 h-3.5" />
                              Reject
                            </button>
                            <button
                              disabled={processingRequestId !== null}
                              onClick={() => handleApproveRequest(req.id!)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                            >
                              {processingRequestId === req.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                              Approve
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-zinc-600 font-medium">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
