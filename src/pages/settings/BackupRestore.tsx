import React, {  useState, useEffect  } from 'react';
import { AppSkeleton } from '../../components/ui/AppSkeleton';
import { SettingsService } from '../../services/settings.service';
import { BackupRecord } from '../../types/settings';
import { Button } from '../../components/ui/button';
import { ConfirmationDialog } from '../../components/ui/confirmation-dialog';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Database, Download, Upload, Clock, RefreshCw } from 'lucide-react';

export function BackupRestore() {
  const { user } = useAuth();
  const { addToast: showToast } = useToast();
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [restoreId, setRestoreId] = useState<string | null>(null);

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    if (user?.role !== 'admin') {
      setLoading(false);
      return;
    }
    try {
      const data = await SettingsService.getRecentBackups(10);
      setBackups(data);
    } catch (error) {
      showToast('Failed to load backup history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setCreating(true);
    try {
      // Mocking backup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newBackup: Omit<BackupRecord, 'id' | 'timestamp'> = {
        size: '15.4 MB',
        type: 'manual',
        status: 'completed',
        url: '#',
        triggeredBy: user!.email!
      };
      
      await SettingsService.createBackupRecord(newBackup);
      await SettingsService.logAction({
        userId: user!.uid,
        userEmail: user!.email!,
        action: 'CREATE_BACKUP',
        module: 'Backup',
        details: 'Manual database backup generated',
        status: 'success'
      });
      
      showToast('Backup created successfully', 'success');
      loadBackups();
    } catch (error) {
      showToast('Failed to create backup', 'error');
      await SettingsService.logAction({
        userId: user!.uid,
        userEmail: user!.email!,
        action: 'CREATE_BACKUP',
        module: 'Backup',
        details: 'Failed to generate manual backup',
        status: 'failure'
      });
    } finally {
      setCreating(false);
    }
  };

  const handleRestore = async () => {
    if (!restoreId) return;
    setRestoring(true);
    try {
      // Mocking restore process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await SettingsService.logAction({
        userId: user!.uid,
        userEmail: user!.email!,
        action: 'RESTORE_BACKUP',
        module: 'Backup',
        details: `Restored database from backup ID: ${restoreId}`,
        status: 'success'
      });
      
      showToast('Database restored successfully', 'success');
      setRestoreId(null);
    } catch (error) {
      showToast('Failed to restore database', 'error');
    } finally {
      setRestoring(false);
    }
  };

  if (user?.role !== 'admin') {
    return <div className="p-8 text-center text-gray-500">You do not have permission to view backup settings.</div>;
  }

  if (loading) {
    return <div className="p-8"><AppSkeleton type="dashboard" /></div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-indigo-600" /> Backup & Restore
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage system data backups and restoration</p>
        </div>
        <Button onClick={handleCreateBackup} disabled={creating || restoring}>
          {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
          Generate Backup
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" /> Recent Backups
          </h3>
          <button onClick={loadBackups} className="text-gray-500 hover:text-indigo-600">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[800px]">
            <thead className="text-xs text-gray-700 uppercase bg-white dark:bg-gray-800 dark:text-gray-300">
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 whitespace-nowrap">Date & Time</th>
                <th className="px-6 py-3 whitespace-nowrap">Size</th>
                <th className="px-6 py-3 whitespace-nowrap">Type</th>
                <th className="px-6 py-3 whitespace-nowrap">Triggered By</th>
                <th className="px-6 py-3 whitespace-nowrap">Status</th>
                <th className="px-6 py-3 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {backups.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No backup records found.
                  </td>
                </tr>
              ) : (
                backups.map((backup) => (
                  <tr key={backup.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                      {new Date(backup.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{backup.size}</td>
                    <td className="px-6 py-4 capitalize whitespace-nowrap">{backup.type}</td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{backup.triggeredBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        backup.status === 'completed' ? 'bg-green-100 text-green-800' :
                        backup.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {backup.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => setRestoreId(backup.id!)}
                        disabled={backup.status !== 'completed' || restoring || creating}
                        className="text-xs"
                      >
                        <Upload className="w-3 h-3 mr-1" /> Restore
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmationDialog
        open={!!restoreId}
        onOpenChange={(open) => !open && setRestoreId(null)}
        title="Restore Backup"
        description="Are you sure you want to restore this backup? Current data will be overwritten."
        onConfirm={handleRestore}
        isLoading={restoring}
        className="max-w-3xl"
      />
    </div>
  );
}
