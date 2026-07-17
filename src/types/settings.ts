export interface SchoolSettings {
  id?: string;
  schoolName: string;
  principalName: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  academicSession: string;
  timezone: string;
  language: string;
  dateFormat: string;
  timeFormat: string;
  theme: 'light' | 'dark' | 'system';
  logoUrl?: string;
  updatedAt?: number;
}

export interface SecuritySettings {
  id?: string;
  sessionTimeoutMinutes: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  maxFailedLogins: number;
  lockoutDurationMinutes: number;
  updatedAt?: number;
}

export interface SystemLog {
  id?: string;
  userId: string;
  userEmail: string;
  action: string;
  module: string;
  details: string;
  ipAddress?: string;
  status: 'success' | 'failure';
  timestamp: number;
}

export interface BackupRecord {
  id?: string;
  timestamp: number;
  size: string;
  type: 'manual' | 'auto';
  status: 'completed' | 'failed' | 'in_progress';
  url?: string;
  triggeredBy: string;
}
