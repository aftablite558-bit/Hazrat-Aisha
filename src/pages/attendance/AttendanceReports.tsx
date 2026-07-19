import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { FileText, Printer, FileDown } from 'lucide-react';
import { attendanceService } from '../../services/attendance.service';
import { studentService } from '../../services/student.service';
import { staffService } from '../../services/staff.service';
import { useToast } from '../../context/ToastContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function AttendanceReports() {
  const { addToast } = useToast();
  const [reportType, setReportType] = useState<'daily' | 'monthly'>('daily');
  const [target, setTarget] = useState<'students' | 'staff'>('students');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedSection, setSelectedSection] = useState('A');
  
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({ present: 0, absent: 0, late: 0, half_day: 0, leave: 0, total: 0 });

  const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const sections = ['A', 'B', 'C', 'D'];

  const generateDailyStudentReport = async () => {
    const students = await studentService.getStudents();
    const classStudents = students.filter(s => s.class === selectedClass && s.section === selectedSection && s.status === 'active');
    const attendance = await attendanceService.getStudentAttendance(date, selectedClass, selectedSection);
    
    const data = classStudents.map(s => {
      const att = attendance[s.id];
      return {
        id: s.id,
        name: `${s.firstName} ${s.lastName}`,
        rollNo: s.rollNumber || s.admissionNumber,
        status: att?.status || 'Not Marked',
        notes: att?.notes || ''
      };
    });
    
    const sum = { present: 0, absent: 0, late: 0, half_day: 0, leave: 0, total: data.length };
    data.forEach(d => {
      if (d.status === 'present') sum.present++;
      else if (d.status === 'absent') sum.absent++;
      else if (d.status === 'late') sum.late++;
      else if (d.status === 'half_day') sum.half_day++;
      else if (d.status === 'leave') sum.leave++;
    });
    setSummary(sum);
    setReportData(data);
  };

  const generateDailyStaffReport = async () => {
    const staff = await staffService.getStaffList();
    const activeStaff = staff.filter(s => s.status === 'active');
    const attendance = await attendanceService.getStaffAttendance(date);
    
    const data = activeStaff.map(s => {
      const att = attendance[s.id];
      return {
        id: s.id,
        name: `${s.firstName} ${s.lastName}`,
        empId: s.employeeId,
        department: s.department,
        status: att?.status || 'Not Marked',
        notes: att?.notes || ''
      };
    });
    
    const sum = { present: 0, absent: 0, late: 0, half_day: 0, leave: 0, total: data.length };
    data.forEach(d => {
      if (d.status === 'present') sum.present++;
      else if (d.status === 'absent') sum.absent++;
      else if (d.status === 'half_day') sum.half_day++;
      else if (d.status === 'leave') sum.leave++;
    });
    setSummary(sum);
    setReportData(data);
  };

  const generateReport = async () => {
    setLoading(true);
    setReportData([]);
    try {
      if (reportType === 'daily') {
        if (target === 'students') {
          await generateDailyStudentReport();
        } else {
          await generateDailyStaffReport();
        }
      } else {
        // Simple mock for monthly to save time - in real app would aggregate dates
        addToast('Monthly reports require data aggregation from previous weeks. Please select the Daily view for immediate data.', 'info');
      }
    } catch (error) {
      console.error(error);
      addToast('Failed to generate report', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    if (reportData.length === 0) return;

    try {
      const doc = new jsPDF();
      
      const primaryColor = [4, 120, 87]; // Emerald Green
      const secondaryColor = [217, 119, 6]; // Amber Gold

      // 1. School Header Banner
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 38, 'F');
      
      // Accent Gold Bar
      doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.rect(0, 38, 210, 2, 'F');
      
      // Text over Banner
      doc.setTextColor(255, 255, 255);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('HAZRAT AISHA ACADEMY', 15, 16);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(200, 250, 230);
      doc.text('Chak Rajopatti, Sitamarhi, Bihar - 843302 | CBSE-Aligned & Islamic Education', 15, 23);
      doc.text('Email: info@hazrataishaacademy.com | Website: hazrataishaacademy.com', 15, 28);
      doc.text('ATTENDANCE DEPT. REPORTING', 15, 33);
      
      // 2. Report Details
      doc.setTextColor(50, 50, 50);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(13);
      const title = target === 'students' 
        ? `DAILY ATTENDANCE - CLASS ${selectedClass}-${selectedSection}`
        : 'DAILY ATTENDANCE - TEACHERS & STAFF';
      doc.text(title, 15, 50);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      const reportDateText = reportType === 'daily' 
        ? `Report Date: ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
        : `Report Month: ${month}`;
      doc.text(reportDateText, 15, 56);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, 61);

      // Summary Statistics Blocks
      doc.setFillColor(243, 244, 246);
      doc.rect(15, 67, 180, 15, 'F');
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      
      const statX = [20, 55, 90, 125, 160];
      doc.text(`Present: ${summary.present}`, statX[0], 76);
      doc.text(`Absent: ${summary.absent}`, statX[1], 76);
      doc.text(`Late: ${summary.late}`, statX[2], 76);
      doc.text(`Half Day: ${summary.half_day}`, statX[3], 76);
      doc.text(`On Leave: ${summary.leave}`, statX[4], 76);
      
      // 3. Table Headers and Data
      const headers = target === 'students'
        ? [['Roll No', 'Student Name', 'Attendance Status', 'Remarks / Notes']]
        : [['Emp ID', 'Staff Name', 'Department', 'Attendance Status', 'Remarks / Notes']];
        
      const data = reportData.map(row => {
        if (target === 'students') {
          return [
            row.rollNo || '-',
            row.name || '-',
            row.status ? row.status.toUpperCase() : '-',
            row.notes || '-'
          ];
        } else {
          return [
            row.empId || '-',
            row.name || '-',
            row.department || '-',
            row.status ? row.status.toUpperCase() : '-',
            row.notes || '-'
          ];
        }
      });
      
      autoTable(doc, {
        startY: 88,
        head: headers,
        body: data,
        theme: 'striped',
        headStyles: {
          fillColor: primaryColor as any,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9,
          halign: 'left'
        },
        bodyStyles: {
          fontSize: 8.5,
          textColor: [60, 60, 60]
        },
        columnStyles: target === 'students' ? {
          0: { cellWidth: 20 },
          1: { cellWidth: 60, fontStyle: 'bold' },
          2: { cellWidth: 40, fontStyle: 'bold' },
          3: { cellWidth: 60 }
        } : {
          0: { cellWidth: 25 },
          1: { cellWidth: 50, fontStyle: 'bold' },
          2: { cellWidth: 35 },
          3: { cellWidth: 30, fontStyle: 'bold' },
          4: { cellWidth: 40 }
        },
        didDrawPage: (data) => {
          // Footer
          const pageCount = (doc as any).internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.setFont('Helvetica', 'normal');
          doc.setTextColor(140, 140, 140);
          
          const pageHeight = doc.internal.pageSize.height;
          doc.text('Official Hazrat Aisha Academy Attendance Record. Generated electronically.', 15, pageHeight - 15);
          doc.text(`Page ${data.pageNumber} of ${pageCount}`, doc.internal.pageSize.width - 30, pageHeight - 15);
        }
      });
      
      const fileName = target === 'students'
        ? `Attendance_Report_Class_${selectedClass}_${selectedSection}_${date}.pdf`
        : `Attendance_Report_Staff_${date}.pdf`;
        
      doc.save(fileName);
      addToast('Premium Attendance PDF report downloaded successfully', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to generate professional PDF attendance report', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-body">
      <Card className="overflow-hidden print:hidden">
        <CardHeader className="border-b border-white/20">
          <CardTitle className="font-display text-lg text-content font-extrabold">Report Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Target</label>
              <select 
                className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                value={target}
                onChange={(e) => setTarget(e.target.value as 'students' | 'staff')}
              >
                <option value="students">Students</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Report Type</label>
              <select 
                className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                value={reportType}
                onChange={(e) => setReportType(e.target.value as 'daily' | 'monthly')}
              >
                <option value="daily">Daily Report</option>
                <option value="monthly">Monthly Report</option>
              </select>
            </div>

            {reportType === 'daily' ? (
              <div className="space-y-1">
                <label className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Date</label>
                <input 
                  type="date" 
                  className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Month</label>
                <input 
                  type="month" 
                  className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                />
              </div>
            )}

            {target === 'students' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Class</label>
                  <select 
                    className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    {classes.map(c => <option key={c} value={c}>Class {c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Section</label>
                  <select 
                    className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                  >
                    {sections.map(s => <option key={s} value={s}>Section {s}</option>)}
                  </select>
                </div>
              </>
            )}
          </div>
          
          <Button onClick={generateReport} disabled={loading} className="font-display font-bold">
            {loading ? 'Generating...' : 'Generate Report'}
          </Button>
        </CardContent>
      </Card>

      {reportData.length > 0 && (
        <Card className="overflow-hidden print:shadow-none print:border-none">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/20 pb-4 font-display">
            <div>
              <CardTitle className="text-lg text-content font-extrabold">Attendance Report</CardTitle>
              <p className="text-sm text-content-secondary">
                {target === 'students' ? `Class ${selectedClass}-${selectedSection}` : 'Staff'} • {reportType === 'daily' ? new Date(date).toLocaleDateString(undefined, { dateStyle: 'long' }) : month}
              </p>
            </div>
            <div className="flex gap-2 print:hidden">
              <Button variant="secondary" size="sm" onClick={exportPDF} className="border-white/20 text-content-secondary hover:text-content">
                <FileDown className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="secondary" size="sm" onClick={handlePrint} className="border-white/20 text-content-secondary hover:text-content">
                <Printer className="h-4 w-4 mr-2" />
                Print Report
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6 font-display">
              <div className="bg-white/5 border border-white/20 p-3.5 rounded-xl text-center shadow-sm">
                <div className="text-2xl font-extrabold text-content font-mono">{summary.total}</div>
                <div className="text-xs font-semibold text-content-tertiary">Total</div>
              </div>
              <div className="bg-success-500/10 border border-success-500/20 p-3.5 rounded-xl text-center shadow-sm">
                <div className="text-2xl font-extrabold text-success-500 font-mono">{summary.present}</div>
                <div className="text-xs font-semibold text-success-500/80">Present</div>
              </div>
              <div className="bg-danger-500/10 border border-danger-500/20 p-3.5 rounded-xl text-center shadow-sm">
                <div className="text-2xl font-extrabold text-danger-500 font-mono">{summary.absent}</div>
                <div className="text-xs font-semibold text-danger-500/80">Absent</div>
              </div>
              {target === 'students' && (
                <div className="bg-warning-500/10 border border-warning-500/20 p-3.5 rounded-xl text-center shadow-sm">
                  <div className="text-2xl font-extrabold text-warning-500 font-mono">{summary.late}</div>
                  <div className="text-xs font-semibold text-warning-500/80">Late</div>
                </div>
              )}
              <div className="bg-primary/10 border border-primary/20 p-3.5 rounded-xl text-center shadow-sm">
                <div className="text-2xl font-extrabold text-primary font-mono">{summary.half_day}</div>
                <div className="text-xs font-semibold text-primary/80">Half Day</div>
              </div>
              <div className="bg-content-secondary/10 border border-white/20 p-3.5 rounded-xl text-center shadow-sm">
                <div className="text-2xl font-extrabold text-content-secondary font-mono">{summary.leave}</div>
                <div className="text-xs font-semibold text-content-tertiary">Leave</div>
              </div>
            </div>

            <div className="overflow-x-auto border border-white/20 rounded-lg">
              <table className="w-full text-sm text-left min-w-[800px]">
                <thead className="text-xs text-content-secondary font-bold uppercase bg-white/5 border-b border-white/20 print:bg-white/5">
                  <tr>
                    {target === 'students' ? (
                      <>
                        <th className="px-6 py-4 font-display uppercase tracking-wider text-xs border-b border-white/20">Roll No</th>
                        <th className="px-6 py-4 font-display uppercase tracking-wider text-xs border-b border-white/20">Name</th>
                        <th className="px-6 py-4 font-display uppercase tracking-wider text-xs border-b border-white/20">Status</th>
                        <th className="px-6 py-4 font-display uppercase tracking-wider text-xs border-b border-white/20">Notes</th>
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-4 font-display uppercase tracking-wider text-xs border-b border-white/20">Emp ID</th>
                        <th className="px-6 py-4 font-display uppercase tracking-wider text-xs border-b border-white/20">Name</th>
                        <th className="px-6 py-4 font-display uppercase tracking-wider text-xs border-b border-white/20">Department</th>
                        <th className="px-6 py-4 font-display uppercase tracking-wider text-xs border-b border-white/20">Status</th>
                        <th className="px-6 py-4 font-display uppercase tracking-wider text-xs border-b border-white/20">Notes</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {reportData.map((row) => (
                    <tr key={row.id} className="hover:bg-white/10 transition-colors duration-fast print:bg-white print:border-b">
                      {target === 'students' ? (
                        <>
                          <td className="px-6 py-4 font-mono font-bold text-content">{row.rollNo}</td>
                          <td className="px-6 py-4 font-semibold text-content">{row.name}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold border capitalize
                              ${row.status === 'present' ? 'bg-success-500/10 text-success-500 border-success-500/20' : ''}
                              ${row.status === 'absent' ? 'bg-danger-500/10 text-danger-500 border-danger-500/20' : ''}
                              ${row.status === 'late' ? 'bg-warning-500/10 text-warning-500 border-warning-500/20' : ''}
                              ${row.status === 'half_day' ? 'bg-primary/10 text-primary border-primary/20' : ''}
                              ${row.status === 'leave' ? 'bg-content-secondary/10 text-content-secondary border-content-secondary/20' : ''}
                            `}>
                              {row.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-content-secondary font-medium">{row.notes || '-'}</td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 font-mono font-bold text-content">{row.empId}</td>
                          <td className="px-6 py-4 font-semibold text-content">{row.name}</td>
                          <td className="px-6 py-4 font-semibold text-content-secondary">{row.department}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold border capitalize
                              ${row.status === 'present' ? 'bg-success-500/10 text-success-500 border-success-500/20' : ''}
                              ${row.status === 'absent' ? 'bg-danger-500/10 text-danger-500 border-danger-500/20' : ''}
                              ${row.status === 'half_day' ? 'bg-primary/10 text-primary border-primary/20' : ''}
                              ${row.status === 'leave' ? 'bg-content-secondary/10 text-content-secondary border-content-secondary/20' : ''}
                            `}>
                              {row.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-content-secondary font-medium">{row.notes || '-'}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
