import { ref, get, set, update, push, query, orderByChild, limitToLast } from 'firebase/database';
import { database, isConfigured } from '../lib/firebase';
import { SchoolSettings, SecuritySettings, SystemLog, BackupRecord } from '../types/settings';

const SETTINGS_REF = 'settings';
const LOGS_REF = 'system_logs';
const BACKUPS_REF = 'backups';

export const SettingsService = {
  // --- School Settings ---
  async getSchoolSettings(): Promise<SchoolSettings | null> {
    if (!isConfigured || !database) return null;
    try {
      const dbRef = ref(database, `${SETTINGS_REF}/school`);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        return snapshot.val() as SchoolSettings;
      }
      return null;
    } catch (error) {
      console.error('Error fetching school settings:', error);
      throw error;
    }
  },

  async updateSchoolSettings(settings: Partial<SchoolSettings>): Promise<void> {
    if (!isConfigured || !database) return;
    try {
      const dbRef = ref(database, `${SETTINGS_REF}/school`);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        await update(dbRef, { ...settings, updatedAt: Date.now() });
      } else {
        await set(dbRef, { ...settings, updatedAt: Date.now() });
      }
    } catch (error) {
      console.error('Error updating school settings:', error);
      throw error;
    }
  },

  // --- Security Settings ---
  async getSecuritySettings(): Promise<SecuritySettings | null> {
    if (!isConfigured || !database) return null;
    try {
      const dbRef = ref(database, `${SETTINGS_REF}/security`);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        return snapshot.val() as SecuritySettings;
      }
      return null;
    } catch (error) {
      console.error('Error fetching security settings:', error);
      throw error;
    }
  },

  async updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<void> {
    if (!isConfigured || !database) return;
    try {
      const dbRef = ref(database, `${SETTINGS_REF}/security`);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        await update(dbRef, { ...settings, updatedAt: Date.now() });
      } else {
        await set(dbRef, { ...settings, updatedAt: Date.now() });
      }
    } catch (error) {
      console.error('Error updating security settings:', error);
      throw error;
    }
  },

  // --- System Logs ---
  async logAction(log: Omit<SystemLog, 'id' | 'timestamp'>): Promise<void> {
    if (!isConfigured || !database) return;
    try {
      const logsRef = ref(database, LOGS_REF);
      const newLogRef = push(logsRef);
      await set(newLogRef, {
        ...log,
        id: newLogRef.key,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error logging action:', error);
    }
  },

  async getRecentLogs(limitCount = 100): Promise<SystemLog[]> {
    if (!isConfigured || !database) return [];
    try {
      const q = query(
        ref(database, LOGS_REF),
        orderByChild('timestamp'),
        limitToLast(limitCount)
      );
      const snapshot = await get(q);
      const logs: SystemLog[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          logs.push(childSnapshot.val() as SystemLog);
        });
      }
      return logs.reverse(); // Reverse to get descending order
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  },

  // --- Backups ---
  async createBackupRecord(record: Omit<BackupRecord, 'id' | 'timestamp'>): Promise<string> {
    if (!isConfigured || !database) throw new Error('Firebase not configured');
    try {
      const backupsRef = ref(database, BACKUPS_REF);
      const newBackupRef = push(backupsRef);
      await set(newBackupRef, {
        ...record,
        id: newBackupRef.key,
        timestamp: Date.now()
      });
      return newBackupRef.key as string;
    } catch (error) {
      console.error('Error creating backup record:', error);
      throw error;
    }
  },

  async getRecentBackups(limitCount = 10): Promise<BackupRecord[]> {
    if (!isConfigured || !database) return [];
    try {
      const q = query(
        ref(database, BACKUPS_REF),
        orderByChild('timestamp'),
        limitToLast(limitCount)
      );
      const snapshot = await get(q);
      const backups: BackupRecord[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          backups.push(childSnapshot.val() as BackupRecord);
        });
      }
      return backups.reverse();
    } catch (error) {
      console.error('Error fetching backups:', error);
      throw error;
    }
  }
};
