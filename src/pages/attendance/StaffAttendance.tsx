import React, { useState, useEffect } from 'react';
import { staffService } from '../../services/staff.service';
import { attendanceService } from '../../services/attendance.service';
import { Staff } from '../../types/staff';
import { StaffAttendanceRecord, AttendanceStatus } from '../../types/attendance';
import { useToast } from '../../context/ToastContext';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Loader2, Save, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export function StaffAttendance() {
  const { addToast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [departmentFilter, setDepartmentFilter] = useState('all');
  
  const [staff, setStaff] = useState<Staff[]>([]);
  const [attendance, setAttendance] = useState<Record<string, StaffAttendanceRecord>>({});
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const fetchStaffAndAttendance = async () => {
    setLoading(true);
    try {
      const allStaff = await staffService.getStaffList();
      const activeStaff = allStaff.filter(s => s.status === 'active');
      activeStaff.sort((a, b) => a.firstName.localeCompare(b.firstName));
      setStaff(activeStaff);

      const existingAttendance = await attendanceService.getStaffAttendance(selectedDate);
      
      const currentAttendance: Record<string, StaffAttendanceRecord> = { ...existingAttendance };
      activeStaff.forEach(s => {
        if (!currentAttendance[s.id]) {
          currentAttendance[s.id] = {
            staffId: s.id,
            status: 'present', // default
            timestamp: Date.now()
          };
        }
      });
      setAttendance(currentAttendance);
      
    } catch (error) {
      console.error(error);
      addToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffAndAttendance();
  }, [selectedDate]);

  const handleStatusChange = (staffId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({
      ...prev,
      [staffId]: {
        ...prev[staffId],
        status,
        timestamp: Date.now()
      }
    }));
  };
  
  const handleNotesChange = (staffId: string, notes: string) => {
    setAttendance(prev => ({
      ...prev,
      [staffId]: {
        ...prev[staffId],
        notes,
        timestamp: Date.now()
      }
    }));
  };

  const markAll = (status: AttendanceStatus) => {
    const updated = { ...attendance };
    filteredStaff.forEach(s => {
      if (updated[s.id]) {
        updated[s.id].status = status;
      }
    });
    setAttendance(updated);
  };

  const handleSave = async () => {
    if (staff.length === 0) return;
    
    setSaving(true);
    try {
      await attendanceService.saveStaffAttendance(
        selectedDate,
        attendance
      );
      addToast('Staff attendance saved successfully', 'success');
    } catch (error) {
      console.error(error);
      addToast('Failed to save staff attendance', 'error');
    } finally {
      setSaving(false);
    }
  };

  const statuses: { value: AttendanceStatus; label: string; color: string }[] = [
    { value: 'present', label: 'P', color: 'bg-success-500/20 text-success-600 border-success-500/30' },
    { value: 'absent', label: 'A', color: 'bg-danger-500/20 text-danger-600 border-danger-500/30' },
    { value: 'half_day', label: 'HD', color: 'bg-primary/20 text-primary border-primary/30' },
    { value: 'leave', label: 'LV', color: 'bg-content-secondary/10 text-content-secondary border-content-secondary/20' },
  ];

  const departments = Array.from(new Set(staff.map(s => s.department))).filter(Boolean);
  const filteredStaff = departmentFilter === 'all' 
    ? staff 
    : staff.filter(s => s.department === departmentFilter);

  return (
    <Card className="border-line shadow-e1">
      <CardHeader className="border-b border-line">
        <div className="flex flex-col md:flex-row gap-4 items-end justify-between font-display">
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Date</label>
              <input 
                type="date" 
                className="w-full sm:w-auto p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                value={selectedDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Department</label>
              <select 
                className="w-full sm:w-auto p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => markAll('present')} className="border-line text-content-secondary hover:text-content">
              <CheckCircle2 className="h-4 w-4 mr-2 text-success-500" />
              Mark All Present
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving || staff.length === 0}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Attendance
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-content-secondary font-medium">No active staff found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-content-secondary font-bold uppercase bg-surface-overlay border-b border-line">
                <tr>
                  <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Emp ID</th>
                  <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Name</th>
                  <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Department</th>
                  <th className="px-6 py-4 text-center font-display uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredStaff.map((s) => {
                  const record = attendance[s.id];
                  if (!record) return null;
                  
                  return (
                    <motion.tr 
                      key={s.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-surface hover:bg-surface-raised transition-colors duration-fast"
                    >
                      <td className="px-6 py-4 font-mono font-bold text-content">
                        {s.employeeId}
                      </td>
                      <td className="px-6 py-4 flex items-center gap-3">
                        {s.photoUrl ? (
                          <img src={s.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-line" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-black">
                            {s.firstName[0]}
                          </div>
                        )}
                        <span className="text-content font-semibold">
                          {s.firstName} {s.lastName}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-content-secondary">
                        {s.department}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-1.5">
                          {statuses.map(status => (
                            <button
                              key={status.value}
                              type="button"
                              onClick={() => handleStatusChange(s.id, status.value)}
                              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all border
                                ${record.status === status.value 
                                  ? `${status.color} ring-2 ring-primary ring-offset-2 ring-offset-surface` 
                                  : 'bg-surface-raised text-content-tertiary border-line hover:bg-surface-overlay hover:text-content-secondary'
                                }`}
                              title={status.label}
                            >
                              {status.label}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          placeholder="Optional notes..."
                          className="w-full text-xs p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-surface-overlay text-content transition-all focus:bg-surface focus:border-primary focus:outline-none"
                          value={record.notes || ''}
                          onChange={(e) => handleNotesChange(s.id, e.target.value)}
                        />
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
