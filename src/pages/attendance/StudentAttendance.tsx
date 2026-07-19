import React, {  useState, useEffect  } from 'react';
import { AppSkeleton } from '../../components/ui/AppSkeleton';
import { studentService } from '../../services/student.service';
import { attendanceService } from '../../services/attendance.service';
import { Student } from '../../types/student';
import { StudentAttendanceRecord, AttendanceStatus } from '../../types/attendance';
import { useToast } from '../../context/ToastContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Loader2, Save, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export function StudentAttendance() {
  const { addToast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedSection, setSelectedSection] = useState('A');
  
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, StudentAttendanceRecord>>({});
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const sections = ['A', 'B', 'C', 'D'];

  const fetchStudentsAndAttendance = async () => {
    setLoading(true);
    try {
      const allStudents = await studentService.getStudents();
      const filtered = allStudents.filter(
        s => s.class === selectedClass && s.section === selectedSection && s.status === 'active'
      );
      // Sort by roll number or admission number
      filtered.sort((a, b) => (a.rollNumber || a.admissionNumber).localeCompare(b.rollNumber || b.admissionNumber));
      setStudents(filtered);

      const existingAttendance = await attendanceService.getStudentAttendance(selectedDate, selectedClass, selectedSection);
      
      // Initialize with default 'present' if not exists, but don't save yet
      const currentAttendance: Record<string, StudentAttendanceRecord> = { ...existingAttendance };
      filtered.forEach(s => {
        if (!currentAttendance[s.id]) {
          currentAttendance[s.id] = {
            studentId: s.id,
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
    fetchStudentsAndAttendance();
  }, [selectedDate, selectedClass, selectedSection]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        timestamp: Date.now()
      }
    }));
  };
  
  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes,
        timestamp: Date.now()
      }
    }));
  };

  const markAll = (status: AttendanceStatus) => {
    const updated = { ...attendance };
    students.forEach(s => {
      if (updated[s.id]) {
        updated[s.id].status = status;
      }
    });
    setAttendance(updated);
  };

  const handleSave = async () => {
    if (students.length === 0) {
      addToast('No students to mark attendance for', 'error');
      return;
    }
    
    setSaving(true);
    try {
      await attendanceService.saveStudentAttendance(
        selectedDate,
        selectedClass,
        selectedSection,
        attendance
      );
      addToast('Attendance saved successfully', 'success');
    } catch (error) {
      console.error(error);
      addToast('Failed to save attendance', 'error');
    } finally {
      setSaving(false);
    }
  };

  const statuses: { value: AttendanceStatus; label: string; color: string }[] = [
    { value: 'present', label: 'P', color: 'bg-success-500/20 text-success-600 border-success-500/30' },
    { value: 'absent', label: 'A', color: 'bg-danger-500/20 text-danger-600 border-danger-500/30' },
    { value: 'late', label: 'L', color: 'bg-warning-500/20 text-warning-600 border-warning-500/30' },
    { value: 'half_day', label: 'HD', color: 'bg-primary/20 text-primary border-primary/30' },
    { value: 'leave', label: 'LV', color: 'bg-content-secondary/10 text-content-secondary border-content-secondary/20' },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-white/20">
        <div className="flex flex-col md:flex-row gap-4 items-end justify-between font-display">
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Date</label>
              <input 
                type="date" 
                className="w-full sm:w-auto p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                value={selectedDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Class</label>
              <select 
                className="w-full sm:w-auto p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                {classes.map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Section</label>
              <select 
                className="w-full sm:w-auto p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                {sections.map(s => <option key={s} value={s}>Section {s}</option>)}
              </select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => markAll('present')} className="border-white/20 text-content-secondary hover:text-content">
              <CheckCircle2 className="h-4 w-4 mr-2 text-success-500" />
              Mark All Present
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving || students.length === 0}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Attendance
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        {loading ? (
          <AppSkeleton type="card" />
        ) : students.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-content-secondary font-medium">No active students found in this class and section.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[800px]">
              <thead className="text-xs text-content-secondary font-bold uppercase bg-white/5 border-b border-white/20">
                <tr>
                  <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Roll/Adm No.</th>
                  <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Student Name</th>
                  <th className="px-6 py-4 text-center font-display uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {students.map((student) => {
                  const record = attendance[student.id];
                  if (!record) return null;
                  
                  return (
                    <motion.tr 
                      key={student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/10 transition-colors duration-fast"
                    >
                      <td className="px-6 py-4 font-mono font-bold text-content">
                        {student.rollNumber || student.admissionNumber}
                      </td>
                      <td className="px-6 py-4 flex items-center gap-3">
                        {student.photoUrl ? (
                          <img src={student.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-white/20" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-black">
                            {student.firstName[0]}
                          </div>
                        )}
                        <span className="text-content font-semibold">
                          {student.firstName} {student.lastName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-1.5">
                          {statuses.map(status => (
                            <button
                              key={status.value}
                              type="button"
                              onClick={() => handleStatusChange(student.id, status.value)}
                              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all border
                                ${record.status === status.value 
                                  ? `${status.color} ring-2 ring-primary ring-offset-2 ring-offset-surface` 
                                  : 'bg-white/5 text-content-tertiary border-white/20 hover:bg-white/5 hover:text-content-secondary'
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
                          className="w-full text-xs p-2 border border-white/20 rounded-xl bg-white/5 text-content transition-all focus:bg-white/5 focus:border-primary focus:outline-none"
                          value={record.notes || ''}
                          onChange={(e) => handleNotesChange(student.id, e.target.value)}
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
