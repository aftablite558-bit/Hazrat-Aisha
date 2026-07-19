import React, {  useState, useEffect  } from 'react';
import { AppSkeleton } from '../../components/ui/AppSkeleton';
import { SettingsService } from '../../services/settings.service';
import { SchoolSettings } from '../../types/settings';
import { Button } from '../../components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function GeneralSettings() {
  const { user } = useAuth();
  const { addToast: showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isAdmin = user?.role === 'admin';

  const [settings, setSettings] = useState<SchoolSettings>({
    schoolName: 'Hazrat Aisha Academy',
    principalName: 'Md. Leyaqat Hussain',
    address: 'Sharif Colony, Ansari Road, Chak Rajopatti, Sitamarhi, Bihar – 843302',
    phone: '+91 9470818538',
    whatsapp: '+91 9470818538',
    email: 'Coming Soon',
    academicSession: '2026-2027',
    timezone: 'Asia/Kolkata',
    language: 'English',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    theme: 'system'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await SettingsService.getSchoolSettings();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      showToast('Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('You do not have permission to change settings', 'error');
      return;
    }
    setSaving(true);
    try {
      await SettingsService.updateSchoolSettings(settings);
      await SettingsService.logAction({
        userId: user.uid,
        userEmail: user.email!,
        action: 'UPDATE_SETTINGS',
        module: 'GeneralSettings',
        details: 'Updated school general settings',
        status: 'success'
      });
      showToast('Settings saved successfully', 'success');
    } catch (error) {
      showToast('Failed to save settings', 'error');
      await SettingsService.logAction({
        userId: user.uid,
        userEmail: user.email!,
        action: 'UPDATE_SETTINGS',
        module: 'GeneralSettings',
        details: 'Failed to update settings',
        status: 'failure'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8"><AppSkeleton type="dashboard" /></div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">School Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">School Name</label>
            <input
              type="text"
              name="schoolName"
              value={settings.schoolName}
              onChange={handleChange}
              disabled={!isAdmin}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 disabled:opacity-50"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Principal Name</label>
            <input
              type="text"
              name="principalName"
              value={settings.principalName}
              onChange={handleChange}
              disabled={!isAdmin}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 disabled:opacity-50"
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
            <input
              type="text"
              name="address"
              value={settings.address}
              onChange={handleChange}
              disabled={!isAdmin}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 disabled:opacity-50"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
            <input
              type="text"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              disabled={!isAdmin}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 disabled:opacity-50"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">WhatsApp</label>
            <input
              type="text"
              name="whatsapp"
              value={settings.whatsapp}
              onChange={handleChange}
              disabled={!isAdmin}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 disabled:opacity-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              disabled={!isAdmin}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 disabled:opacity-50"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Academic Session</label>
            <select
              name="academicSession"
              value={settings.academicSession}
              onChange={handleChange}
              disabled={!isAdmin}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 disabled:opacity-50"
            >
              <option value="2025-2026">2025-2026</option>
              <option value="2026-2027">2026-2027</option>
              <option value="2027-2028">2027-2028</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
            <select
              name="timezone"
              value={settings.timezone}
              onChange={handleChange}
              disabled={!isAdmin}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 disabled:opacity-50"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
              disabled={!isAdmin}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 disabled:opacity-50"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Urdu">Urdu</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Format</label>
            <select
              name="dateFormat"
              value={settings.dateFormat}
              onChange={handleChange}
              disabled={!isAdmin}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 disabled:opacity-50"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Format</label>
            <select
              name="timeFormat"
              value={settings.timeFormat}
              onChange={handleChange}
              disabled={!isAdmin}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 disabled:opacity-50"
            >
              <option value="12h">12-hour (AM/PM)</option>
              <option value="24h">24-hour</option>
            </select>
          </div>
        </div>

        {isAdmin && (
          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Settings
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
