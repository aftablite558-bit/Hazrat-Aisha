export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day' | 'leave';

export interface StudentAttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  notes?: string;
  timestamp: number;
}

export interface StaffAttendanceRecord {
  staffId: string;
  status: AttendanceStatus;
  notes?: string;
  timestamp: number;
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  half_day: number;
  leave: number;
  total: number;
}
