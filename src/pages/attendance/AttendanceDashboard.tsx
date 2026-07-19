import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent } from '../../components/ui/card';
import { StudentAttendance } from './StudentAttendance';
import { StaffAttendance } from './StaffAttendance';
import { AttendanceReports } from './AttendanceReports';

export function AttendanceDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'students' | 'staff' | 'reports'>('students');

  return (
    <div className="space-y-6 font-body">
      <div className="font-display">
        <h1 className="text-[var(--text-h3)] font-extrabold tracking-tight text-content">
          Attendance Management
        </h1>
        <p className="text-sm text-content-secondary">
          Manage and track attendance for students and staff.
        </p>
      </div>

      <div className="border-b border-white/20 font-display">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('students')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm transition-all duration-fast ${
              activeTab === 'students'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-content-secondary hover:text-content hover:border-white/20 font-semibold'
            }`}
          >
            Student Attendance
          </button>
          
          {(user?.role === 'admin' || user?.role === 'principal') && (
            <button
              onClick={() => setActiveTab('staff')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm transition-all duration-fast ${
                activeTab === 'staff'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-content-secondary hover:text-content hover:border-white/20 font-semibold'
              }`}
            >
              Staff Attendance
            </button>
          )}

          <button
            onClick={() => setActiveTab('reports')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm transition-all duration-fast ${
              activeTab === 'reports'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-content-secondary hover:text-content hover:border-white/20 font-semibold'
            }`}
          >
            Reports
          </button>
        </nav>
      </div>

      <div className="mt-4">
        {activeTab === 'students' && <StudentAttendance />}
        {activeTab === 'staff' && <StaffAttendance />}
        {activeTab === 'reports' && <AttendanceReports />}
      </div>
    </div>
  );
}
