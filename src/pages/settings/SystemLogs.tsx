import React, { useState, useEffect } from 'react';
import { SettingsService } from '../../services/settings.service';
import { SystemLog } from '../../types/settings';
import { Loader2, Activity, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function SystemLogs() {
  const { user } = useAuth();
  const { addToast: showToast } = useToast();
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    if (user?.role !== 'admin') {
      setLoading(false);
      return;
    }
    try {
      const data = await SettingsService.getRecentLogs(100);
      setLogs(data);
    } catch (error) {
      showToast('Failed to load system logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return <div className="p-8 text-center text-gray-500">You do not have permission to view system logs.</div>;
  }

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-600" /> System Logs
          </h2>
          <p className="text-sm text-gray-500 mt-1">Audit trail and activity tracking</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-6 py-3">Timestamp</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">Module</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No logs available</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {log.userEmail}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{log.action}</div>
                    <div className="text-xs text-gray-500">{log.details}</div>
                  </td>
                  <td className="px-6 py-4">
                    {log.module}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
