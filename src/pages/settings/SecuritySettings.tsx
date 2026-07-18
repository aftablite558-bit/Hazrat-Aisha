import React, { useState, useEffect } from 'react';
import { SettingsService } from '../../services/settings.service';
import { SecuritySettings as ISecuritySettings } from '../../types/settings';
import { Button } from '../../components/ui/button';
import { Save, Loader2, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function SecuritySettings() {
  const { user } = useAuth();
  const { addToast: showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isAdmin = user?.role === 'admin';

  const DEFAULT_SECURITY_SETTINGS: ISecuritySettings = {
    sessionTimeoutMinutes: 30,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    maxFailedLogins: 5,
    lockoutDurationMinutes: 15
  };

  const [settings, setSettings] = useState<ISecuritySettings>(DEFAULT_SECURITY_SETTINGS);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await SettingsService.getSecuritySettings();
      if (data) {
        setSettings(data);
      } else {
        // Initialize with default settings
        try {
          await SettingsService.updateSecuritySettings(DEFAULT_SECURITY_SETTINGS);
          setSettings(DEFAULT_SECURITY_SETTINGS);
        } catch (writeError) {
          console.error("Failed to initialize security settings:", writeError);
          showToast('Failed to initialize security settings', 'error');
        }
      }
    } catch (error) {
      console.error("Failed to load security settings:", error);
      showToast('Failed to load security settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handlePolicyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, type, value } = e.target;
    setSettings(prev => ({
      ...prev,
      passwordPolicy: {
        ...prev.passwordPolicy,
        [name]: type === 'checkbox' ? checked : parseInt(value) || 0
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    setSaving(true);
    try {
      await SettingsService.updateSecuritySettings(settings);
      await SettingsService.logAction({
        userId: user.uid,
        userEmail: user.email!,
        action: 'UPDATE_SECURITY_SETTINGS',
        module: 'Security',
        details: 'Updated system security policies',
        status: 'success'
      });
      showToast('Security settings saved', 'success');
    } catch (error) {
      showToast('Failed to save security settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return <div className="p-8 text-center text-gray-500">You do not have permission to view security settings.</div>;
  }

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
        <Shield className="w-6 h-6 text-indigo-600" /> Security Settings
      </h2>
      
        <form onSubmit={handleSubmit} className="space-y-8 w-full">
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full max-w-none">
          <h3 className="text-lg font-semibold mb-4 ">Session Management</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Session Timeout (Minutes)
              </label>
              <input
                type="number"
                name="sessionTimeoutMinutes"
                value={settings.sessionTimeoutMinutes}
                onChange={handleNumChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                min="5"
                max="1440"
              />
              <p className="text-xs text-gray-500 mt-1">Users will be automatically logged out after this period of inactivity.</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full max-w-none">
          <h3 className="text-lg font-semibold mb-4 ">Password Policy</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Minimum Password Length
              </label>
              <input
                type="number"
                name="minLength"
                value={settings.passwordPolicy.minLength}
                onChange={handlePolicyChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                min="6"
                max="32"
              />
            </div>
            
            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="requireUppercase"
                  checked={settings.passwordPolicy.requireUppercase}
                  onChange={handlePolicyChange}
                  className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Require uppercase letter</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="requireNumbers"
                  checked={settings.passwordPolicy.requireNumbers}
                  onChange={handlePolicyChange}
                  className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Require numbers</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="requireSpecialChars"
                  checked={settings.passwordPolicy.requireSpecialChars}
                  onChange={handlePolicyChange}
                  className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Require special characters</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full max-w-none">
          <h3 className="text-lg font-semibold mb-4 ">Login Security</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Failed Login Attempts
              </label>
              <input
                type="number"
                name="maxFailedLogins"
                value={settings.maxFailedLogins}
                onChange={handleNumChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                min="1"
                max="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lockout Duration (Minutes)
              </label>
              <input
                type="number"
                name="lockoutDurationMinutes"
                value={settings.lockoutDurationMinutes}
                onChange={handleNumChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                min="5"
                max="1440"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Policies
          </Button>
        </div>
      </form>
    </div>
  );
}
