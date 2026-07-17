import { database } from '../lib/firebase';
import { ref, get, set, update, query, orderByChild, equalTo } from 'firebase/database';
import { AttendanceStatus, StudentAttendanceRecord, StaffAttendanceRecord } from '../types/attendance';
import { Student } from '../types/student';
import { Staff } from '../types/staff';

class AttendanceService {
  private getDbRef(path: string) {
    if (!database) throw new Error('Database not initialized');
    return ref(database, path);
  }

  // --- Student Attendance ---
  
  async saveStudentAttendance(
    date: string, // YYYY-MM-DD
    className: string,
    sectionName: string,
    records: Record<string, StudentAttendanceRecord>
  ): Promise<void> {
    const path = `attendance/students/${date}/${className}/${sectionName}`;
    const attendanceRef = this.getDbRef(path);
    await set(attendanceRef, records);
  }

  async getStudentAttendance(
    date: string,
    className: string,
    sectionName: string
  ): Promise<Record<string, StudentAttendanceRecord>> {
    const path = `attendance/students/${date}/${className}/${sectionName}`;
    const attendanceRef = this.getDbRef(path);
    const snapshot = await get(attendanceRef);
    
    if (snapshot.exists()) {
      return snapshot.val() as Record<string, StudentAttendanceRecord>;
    }
    return {};
  }
  
  async getStudentAttendanceByDateRange(
    studentId: string,
    className: string,
    sectionName: string,
    startDate: string,
    endDate: string
  ): Promise<Record<string, StudentAttendanceRecord>> {
    // For a single student, we have to fetch all dates in range.
    // In a real production app we'd restructure this or use Firestore for better querying.
    // For Realtime DB with this structure, we fetch the dates.
    const result: Record<string, StudentAttendanceRecord> = {};
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    
    for (let d = d1; d <= d2; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const path = `attendance/students/${dateStr}/${className}/${sectionName}/${studentId}`;
      const snap = await get(this.getDbRef(path));
      if (snap.exists()) {
        result[dateStr] = snap.val() as StudentAttendanceRecord;
      }
    }
    
    return result;
  }

  // --- Staff Attendance ---

  async saveStaffAttendance(
    date: string, // YYYY-MM-DD
    records: Record<string, StaffAttendanceRecord>
  ): Promise<void> {
    const path = `attendance/staff/${date}`;
    const attendanceRef = this.getDbRef(path);
    await set(attendanceRef, records);
  }

  async getStaffAttendance(date: string): Promise<Record<string, StaffAttendanceRecord>> {
    const path = `attendance/staff/${date}`;
    const attendanceRef = this.getDbRef(path);
    const snapshot = await get(attendanceRef);
    
    if (snapshot.exists()) {
      return snapshot.val() as Record<string, StaffAttendanceRecord>;
    }
    return {};
  }
}

export const attendanceService = new AttendanceService();
