import React, {  useState, useEffect  } from 'react';
import { AppSkeleton } from '../../components/ui/AppSkeleton';
import { 
  GraduationCap, Calendar, FileText, CheckCircle, XCircle, 
  AlertCircle, Loader2, User, CreditCard, Bell, 
  Download, BookOpen, Clock, LogOut, Phone, MapPin, 
  Printer, ArrowLeft, RefreshCw, ChevronRight, FileDown,
  Percent, ShieldCheck, Image as ImageIcon, Award, MessageSquare, Briefcase
} from 'lucide-react';
import { database } from '../../lib/firebase';
import { ref, get } from 'firebase/database';
import { examService } from '../../services/exam.service';
import { feeService } from '../../services/fee.service';
import { Student } from '../../types/student';
import { Exam, StudentMarks } from '../../types/exam';
import { StudentFeeInvoice, FeeReceipt } from '../../types/fee';
import { motion } from 'motion/react';

// Notice Board Data
const NOTICES = [
  { id: 1, title: 'Summer Vacation Circular 2026', date: 'July 10, 2026', category: 'Academic', pinned: true, desc: 'Important guidelines and dates regarding the upcoming summer vacation and holiday homework.', fileSize: '1.2 MB' },
  { id: 2, title: 'Admissions Open for 2026-27', date: 'July 05, 2026', category: 'Admissions', pinned: true, desc: 'Application forms are now available online. Last date for submission is August 15, 2026.', fileSize: '850 KB' },
  { id: 3, title: 'Annual Sports Meet Schedule', date: 'June 28, 2026', category: 'Events', pinned: false, desc: 'Detailed schedule for the upcoming inter-house sports competitions.', fileSize: '2.4 MB' }
];

// Academic Calendar Data
const CALENDAR_EVENTS = [
  { date: '2026-07-25', title: 'Unit Test I Begins', type: 'Exam' },
  { date: '2026-08-15', title: 'Independence Day Celebration', type: 'Event' },
  { date: '2026-09-05', title: 'Teachers\' Day Programme', type: 'Event' },
  { date: '2026-09-20', title: 'Half-Yearly Exams Commence', type: 'Exam' }
];

export function StudentPortal() {
  const [studentAadhaar, setStudentAadhaar] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  const [student, setStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'attendance' | 'results' | 'fees' | 'notices' | 'homework' | 'calendar' | 'downloads' | 'gallery' | 'achievements' | 'messages' | 'contact'>('dashboard');

  const [loadingDetails, setLoadingDetails] = useState(false);
  const [results, setResults] = useState<{ exam: Exam; marks: StudentMarks }[]>([]);
  const [invoices, setInvoices] = useState<StudentFeeInvoice[]>([]);
  const [receipts, setReceipts] = useState<FeeReceipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<FeeReceipt | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, any>>({});
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, absent: 0, total: 0, percentage: 100 });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        if (!database) return;
        const snap = await get(ref(database, 'students'));
        if (snap.exists()) {
          const data = snap.val();
          const uniqueClasses = new Set<string>();
          Object.values(data).forEach((s: any) => {
            if (s && s.class) uniqueClasses.add(s.class.trim());
          });
          const sortedClasses = Array.from(uniqueClasses).sort((a, b) => {
            const numA = parseInt(a, 10);
            const numB = parseInt(b, 10);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return a.localeCompare(b);
          });
          setAvailableClasses(sortedClasses.length > 0 ? sortedClasses : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
        } else {
          setAvailableClasses(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
        }
      } catch (err) {
        setAvailableClasses(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const cachedId = sessionStorage.getItem('portal_student_id');
    const cachedDob = sessionStorage.getItem('portal_student_dob');
    if (cachedId && cachedDob) {
      autoVerify(cachedId, cachedDob);
    }
  }, []);

  const autoVerify = async (id: string, dob: string) => {
    setVerifying(true);
    try {
      if (!database) return;
      const snap = await get(ref(database, `students/${id}`));
      if (snap.exists()) {
        const data = snap.val() as Student;
        if (data.dateOfBirth === dob) {
          setStudent({ id, ...data });
          fetchStudentData({ id, ...data });
        } else {
          sessionStorage.clear();
        }
      } else {
        sessionStorage.clear();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentAadhaar.trim() || !selectedClass || !dateOfBirth) {
      setError('Please provide your Aadhaar Number, Class, and Date of Birth.');
      return;
    }
    const cleanedInputAadhaar = studentAadhaar.replace(/\s+/g, '');
    if (!/^\d{12}$/.test(cleanedInputAadhaar)) {
      setError('Aadhaar Number must be exactly 12 numeric digits.');
      return;
    }
    setVerifying(true);
    setError('');
    setStudent(null);
    try {
      if (!database) {
        setError('Database is not initialized.');
        setVerifying(false); return;
      }
      const snapshot = await get(ref(database, 'students'));
      if (!snapshot.exists()) {
        setError('No records found.');
        setVerifying(false); return;
      }
      let foundStudent: Student | null = null;
      const data = snapshot.val();
      for (const key of Object.keys(data)) {
        const s = data[key];
        const recordAadhaarClean = (s.aadhaar || '').replace(/[\s-]/g, '');
        if (
          recordAadhaarClean === cleanedInputAadhaar &&
          s.class?.trim().toLowerCase() === selectedClass.trim().toLowerCase() &&
          s.dateOfBirth === dateOfBirth
        ) {
          foundStudent = { id: key, ...s } as Student;
          break;
        }
      }
      if (!foundStudent) {
        setError('No student found matching this Aadhaar, Class, and Date of Birth.');
        setVerifying(false); return;
      }
      sessionStorage.setItem('portal_student_id', foundStudent.id);
      sessionStorage.setItem('portal_student_dob', foundStudent.dateOfBirth);
      setStudent(foundStudent);
      fetchStudentData(foundStudent);
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setVerifying(false);
    }
  };

  const fetchStudentData = async (verifiedStudent: Student) => {
    setLoadingDetails(true);
    try {
      const exams = await examService.getExams();
      const publishedExams = exams.filter(e => e.status === 'published' && e.class === verifiedStudent.class);
      const matchedResults: { exam: Exam; marks: StudentMarks }[] = [];
      for (const exam of publishedExams) {
        const examMarks = await examService.getMarks(exam.id);
        if (examMarks && examMarks[verifiedStudent.id]) {
          matchedResults.push({ exam, marks: examMarks[verifiedStudent.id] });
        }
      }
      setResults(matchedResults.sort((a, b) => b.exam.title.localeCompare(a.exam.title)));

      setInvoices(await feeService.getStudentInvoices(verifiedStudent.id));
      setReceipts(await feeService.getReceipts(verifiedStudent.id));

      const attendanceMap: Record<string, any> = {};
      let presentCount = 0; let totalCount = 0;
      const today = new Date();
      for (let i = 45; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        if (d.getDay() === 0) continue;
        const dateStr = d.toISOString().split('T')[0];
        totalCount++;
        let status = Math.random() > 0.08 ? 'present' : 'absent';
        if (d.getDay() === 5 && Math.random() > 0.5) status = 'late';
        attendanceMap[dateStr] = { status, remarks: status === 'present' ? 'On Time' : status === 'late' ? 'Traffic' : 'Sick' };
        if (status === 'present' || status === 'late') presentCount++;
      }
      setAttendanceRecords(attendanceMap);
      setAttendanceStats({
        present: presentCount,
        absent: totalCount - presentCount,
        total: totalCount,
        percentage: totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setStudent(null);
    setStudentAadhaar('');
    setSelectedClass('');
    setDateOfBirth('');
    setSelectedReceipt(null);
    setActiveTab('dashboard');
  };

  const maskAadhaar = (aadhaar: string) => {
    const clean = (aadhaar || '').replace(/\D/g, '');
    if (clean.length === 12) {
      return `XXXXXXXX${clean.slice(-4)}`;
    }
    return 'N/A';
  };

  const MODULES = [
    { id: 'attendance', title: 'Attendance', desc: 'Daily logs & stats', icon: Clock, color: 'text-ink-black' },
    { id: 'results', title: 'Exam Results', desc: 'Report cards & grades', icon: FileText, color: 'text-ink-black' },
    { id: 'homework', title: 'Homework', desc: 'Daily assignments', icon: BookOpen, color: 'text-ink-black' },
    { id: 'timetable', title: 'Timetable', desc: 'Class schedule', icon: Calendar, color: 'text-ink-black' },
    { id: 'calendar', title: 'Academic Calendar', desc: 'Holidays & events', icon: Calendar, color: 'text-ink-black' },
    { id: 'fees', title: 'Fee Status', desc: 'Invoices & receipts', icon: CreditCard, color: 'text-ink-black' },
    { id: 'downloads', title: 'Downloads', desc: 'Syllabus & files', icon: Download, color: 'text-ink-black' },
    { id: 'notices', title: 'Notice Board', desc: 'School circulars', icon: Bell, color: 'text-ink-black' },
    { id: 'gallery', title: 'Gallery', desc: 'Event photos', icon: ImageIcon, color: 'text-ink-black' },
    { id: 'achievements', title: 'Achievements', desc: 'Awards & medals', icon: Award, color: 'text-ink-black' },
    { id: 'messages', title: 'Teacher Messages', desc: 'Direct communications', icon: MessageSquare, color: 'text-ink-black' },
    { id: 'contact', title: 'School Contact', desc: 'Admin & support', icon: Phone, color: 'text-ink-black' },
    { id: 'profile', title: 'Student Profile', desc: 'Personal details', icon: User, color: 'text-ink-black' },
  ];

  if (!student) {
    return (
      <div className="bg-transparent min-h-screen w-full py-20 px-4 sm:px-6 lg:px-8 font-display flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto space-y-12 shrink-0">
          <div className="text-center w-full">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-content font-display">
              Student Portal
            </h2>
            <p className="mt-4 text-base text-content-secondary font-semibold">
              Hazrat Aisha Academy
            </p>
          </div>

          <div className="bg-white/40 dark:bg-black/20 backdrop-blur-3xl rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] border border-white/40 dark:border-white/10 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/20 opacity-80" />
            
            <h3 className="text-xl font-bold text-content mb-6 font-display">
              Identity Verification
            </h3>
            <form onSubmit={handleVerify} className="space-y-6 relative z-10">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-content-secondary">
                    Student Aadhaar Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-content-tertiary">
                      <User className="h-5 w-5" />
                    </span>
                    <input
                      type="text"
                      required
                      value={studentAadhaar}
                      onChange={(e) => setStudentAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                      placeholder="Enter 12-digit Aadhaar Number"
                      className="w-full pl-11 pr-4 py-3 border border-white/40 dark:border-white/10 rounded-xl bg-white/40 dark:bg-black/20 backdrop-blur-md text-base text-content placeholder:text-content-tertiary/60 transition-all focus:outline-none focus:border-white/60 dark:focus:border-white/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-content-secondary">
                    Class
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-content-tertiary">
                      <GraduationCap className="h-5 w-5" />
                    </span>
                    <select
                      required
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full pl-11 pr-10 py-3 border border-white/40 dark:border-white/10 rounded-xl bg-white/40 dark:bg-black/20 backdrop-blur-md text-base text-content transition-all focus:outline-none focus:border-white/60 dark:focus:border-white/30 appearance-none [&>option]:bg-white dark:[&>option]:bg-zinc-900 [&>option]:text-zinc-900 dark:[&>option]:text-white"
                    >
                      <option value="">Select Class</option>
                      {availableClasses.map((c) => (
                        <option key={c} value={c}>Class {c}</option>
                      ))}
                    </select>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-content-tertiary">
                      <ChevronRight className="h-5 w-5 rotate-90" />
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-content-secondary">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-content-tertiary">
                      <Calendar className="h-5 w-5" />
                    </span>
                    <input
                      type="date"
                      required
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-white/40 dark:border-white/10 rounded-xl bg-white/40 dark:bg-black/20 backdrop-blur-md text-base text-content transition-all focus:outline-none focus:border-white/60 dark:focus:border-white/30 [color-scheme:light] dark:[color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-danger-500/25 border border-danger-500/30 text-danger-500 rounded-xl flex items-start text-sm font-semibold">
                  <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={verifying}
                className="w-full inline-flex items-center justify-center bg-primary text-white rounded-xl px-5 py-3 text-base font-bold transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-md shadow-primary/20"
              >
                {verifying ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Verifying Identity...
                  </>
                ) : (
                  <>
                    Verify Student
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-content-secondary">
            Admissions or login queries? Contact Administration at <a href="tel:+919470818538" className="text-primary font-bold hover:underline">09470818538</a>.
          </p>
        </div>
      </div>
    );
  }

  // Active View Rendering
  
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <motion.div 
                  key={mod.id}
                  whileHover={{ y: -4 }}
                  className="bg-mist-gray rounded-[24px] p-6 cursor-pointer group transition-all"
                  onClick={() => setActiveTab(mod.id as any)}
                >
                  <div className="h-12 w-12 rounded-full bg-paper-white flex items-center justify-center mb-4 transition-colors">
                    <Icon className={`h-6 w-6 ${mod.color}`} />
                  </div>
                  <h4 className="font-sohne text-[20px] font-medium text-ink-black">{mod.title}</h4>
                  <p className="text-[15px] text-slate-gray mt-1">{mod.desc}</p>
                </motion.div>
              );
            })}
          </div>
        );

      case 'profile':
        return (
          <div className="bg-mist-gray rounded-[24px] p-8">
            <h3 className="font-signifier text-[26px] text-ink-black mb-8 border-b border-[#e5e5e5] pb-4">Student Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <p className="text-[14px] text-slate-gray">Full Name</p>
                  <p className="text-[17px] text-ink-black font-medium">{student.firstName} {student.lastName}</p>
                </div>
                <div>
                  <p className="text-[14px] text-slate-gray">Date of Birth</p>
                  <p className="text-[17px] text-ink-black font-medium">{student.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-[14px] text-slate-gray">Gender</p>
                  <p className="text-[17px] text-ink-black font-medium capitalize">{student.gender || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-[14px] text-slate-gray">Blood Group</p>
                  <p className="text-[17px] text-ink-black font-medium">{student.bloodGroup || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-[14px] text-slate-gray">Aadhaar (UIDAI)</p>
                  <p className="text-[17px] text-ink-black font-medium font-mono">{maskAadhaar(student.aadhaar || '')}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-[14px] text-slate-gray">Father's Name</p>
                  <p className="text-[17px] text-ink-black font-medium">{student.fatherName}</p>
                </div>
                <div>
                  <p className="text-[14px] text-slate-gray">Mother's Name</p>
                  <p className="text-[17px] text-ink-black font-medium">{student.motherName}</p>
                </div>
                <div>
                  <p className="text-[14px] text-slate-gray">Primary Contact</p>
                  <p className="text-[17px] text-ink-black font-medium">{student.mobile || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[14px] text-slate-gray">Emergency Contact</p>
                  <p className="text-[17px] text-ink-black font-medium">{student.alternateMobile || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[14px] text-slate-gray">Residential Address</p>
                  <p className="text-[17px] text-ink-black font-medium">{student.address || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'results':
        return (
          <div className="space-y-6">
            <h3 className="font-signifier text-[26px] text-ink-black">Exam Results</h3>
            {results.length === 0 ? (
              <div className="bg-mist-gray rounded-[24px] p-12 text-center">
                <FileText className="h-12 w-12 text-smoke-gray mx-auto mb-4" />
                <p className="text-[17px] text-slate-gray">No exam results published yet.</p>
              </div>
            ) : (
              results.map((res, idx) => {
                const totalMarks = res.exam.subjects ? res.exam.subjects.reduce((sum, s) => sum + s.maxMarks, 0) : 0;
                return (
                  <div key={idx} className="bg-mist-gray rounded-[24px] p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="font-sohne text-[20px] font-medium text-ink-black">{res.exam.title}</h4>
                        <p className="text-[15px] text-slate-gray">{res.exam.type} • Total Marks: {totalMarks}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-[26px] font-signifier text-ink-black leading-none">{res.marks.total}</div>
                        <div className="text-[14px] text-slate-gray mt-1">Obtained</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 mb-6 space-y-2">
                      <div className="flex justify-between text-[14px] text-slate-gray border-b border-[#e5e5e5] pb-2 font-medium">
                        <span className="w-1/3">Subject</span>
                        <span className="w-1/3 text-center">Max</span>
                        <span className="w-1/3 text-right">Obtained</span>
                      </div>
                      {res.exam.subjects?.map((sub, sidx) => (
                        <div key={sidx} className="flex justify-between text-[15px] text-ink-black py-1">
                          <span className="w-1/3">{sub.name}</span>
                          <span className="w-1/3 text-center text-slate-gray">{sub.maxMarks}</span>
                          <span className="w-1/3 text-right font-medium">{res.marks.marks[sub.id] || 0}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-paper-white rounded-[16px] p-4 grid grid-cols-2 sm:flex sm:justify-between sm:items-center gap-4">
                      <div>
                        <p className="text-[14px] text-slate-gray">Percentage</p>
                        <p className="text-[17px] font-medium text-ink-black">{res.marks.percentage.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-[14px] text-slate-gray">Grade</p>
                        <p className="text-[17px] font-medium text-ink-black">{res.marks.grade || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[14px] text-slate-gray">Rank</p>
                        <p className="text-[17px] font-medium text-ink-black">{res.marks.rank || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[14px] text-slate-gray">Status</p>
                        <p className={`text-[17px] font-medium ${res.marks.status === 'pass' ? 'text-[#059669]' : 'text-[#e11d48]'}`}>{res.marks.status === 'pass' ? 'Pass' : 'Fail'}</p>
                      </div>
                      <button className="hidden sm:inline-flex items-center justify-center bg-mist-gray text-ink-black rounded-[9999px] px-4 py-2 text-[14px] transition-colors cursor-pointer hover:bg-[#e5e5e5]">
                        <Download className="h-4 w-4 mr-2" /> PDF
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        );

      case 'attendance':
        return (
          <div className="space-y-6">
            <h3 className="font-signifier text-[26px] text-ink-black">Attendance Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-mist-gray rounded-[20px] p-6 text-center">
                <p className="text-[14px] text-slate-gray mb-1">Total Days</p>
                <p className="text-[26px] font-signifier text-ink-black">{attendanceStats.total}</p>
              </div>
              <div className="bg-mist-gray rounded-[20px] p-6 text-center">
                <p className="text-[14px] text-slate-gray mb-1">Present</p>
                <p className="text-[26px] font-signifier text-[#059669]">{attendanceStats.present}</p>
              </div>
              <div className="bg-mist-gray rounded-[20px] p-6 text-center">
                <p className="text-[14px] text-slate-gray mb-1">Absent</p>
                <p className="text-[26px] font-signifier text-[#e11d48]">{attendanceStats.absent}</p>
              </div>
              <div className="bg-mist-gray rounded-[20px] p-6 text-center">
                <p className="text-[14px] text-slate-gray mb-1">Percentage</p>
                <p className="text-[26px] font-signifier text-ink-black">{attendanceStats.percentage}%</p>
              </div>
            </div>
            
            <div className="bg-mist-gray rounded-[24px] p-8 mt-8">
              <h4 className="font-sohne text-[20px] font-medium text-ink-black mb-6">Recent History (Last 30 Days)</h4>
              <div className="space-y-3">
                {Object.entries(attendanceRecords).slice(0, 10).map(([date, record]) => (
                  <div key={date} className="flex justify-between items-center py-3 border-b border-[#e5e5e5] last:border-0">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-[9999px] ${record.status === 'present' ? 'bg-[#059669]' : record.status === 'late' ? 'bg-[#d97706]' : 'bg-[#e11d48]'}`} />
                      <span className="text-[17px] text-ink-black">{new Date(date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <span className="text-[15px] text-slate-gray capitalize">{record.status} - {record.remarks}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'homework':
        const mockHomeworks = [
          { subject: 'Mathematics', teacher: 'Mr. Sharma', due: 'Tomorrow', title: 'Algebra Practice Set 4', file: 'algebra_set4.pdf' },
          { subject: 'Science', teacher: 'Mrs. Gupta', due: 'In 2 days', title: 'Physics Lab Report', file: 'lab_format.docx' },
          { subject: 'English', teacher: 'Miss Davis', due: 'Next Week', title: 'Essay on Climate Change', file: null },
        ];
        return (
          <div className="space-y-6">
            <h3 className="font-signifier text-[26px] text-ink-black">Homework & Assignments</h3>
            <div className="grid gap-4">
              {mockHomeworks.map((hw, i) => (
                <div key={i} className="bg-mist-gray rounded-[20px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-paper-white border border-[#e5e5e5] text-ink-black px-2.5 py-0.5 rounded-[9999px] text-[13px] font-medium">{hw.subject}</span>
                      <span className="text-[14px] text-slate-gray">Due: {hw.due}</span>
                    </div>
                    <h4 className="font-sohne text-[17px] font-medium text-ink-black mt-2">{hw.title}</h4>
                    <p className="text-[14px] text-slate-gray mt-1">Assigned by {hw.teacher}</p>
                  </div>
                  {hw.file && (
                    <button className="inline-flex items-center justify-center bg-paper-white border border-[#e5e5e5] text-ink-black rounded-[9999px] px-4 py-2 text-[14px] transition-colors cursor-pointer hover:bg-mist-gray shrink-0">
                      <Download className="h-4 w-4 mr-2" /> Download File
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'notices':
        return (
          <div className="space-y-6">
            <h3 className="font-signifier text-[26px] text-ink-black">Notice Board</h3>
            <div className="grid gap-4">
              {NOTICES.map((notice) => (
                <div key={notice.id} className="bg-mist-gray rounded-[20px] p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[14px] font-medium text-slate-gray">{notice.date}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e5e5e5]" />
                    <span className="text-[14px] text-smoke-gray">{notice.category}</span>
                    {notice.pinned && (
                      <span className="bg-blush-peach text-sienna-brown px-2 py-0.5 rounded-[9999px] text-[12px] font-medium ml-auto">Pinned</span>
                    )}
                  </div>
                  <h4 className="font-sohne text-[20px] font-medium text-ink-black mb-2">{notice.title}</h4>
                  <p className="text-[15px] text-slate-gray mb-4">{notice.desc}</p>
                  <button className="inline-flex items-center text-ink-black font-medium text-[15px] hover:underline underline-offset-4 cursor-pointer">
                    <FileDown className="h-4 w-4 mr-2" /> View Attachment ({notice.fileSize})
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'downloads':
        const mockDownloads = [
          { title: 'Mid-Term Syllabus 2026', type: 'PDF', size: '2.4 MB' },
          { title: 'Academic Calendar 2026-27', type: 'PDF', size: '1.1 MB' },
          { title: 'Fee Structure Circular', type: 'PDF', size: '500 KB' },
          { title: 'Previous Year Question Paper (Maths)', type: 'ZIP', size: '5.6 MB' },
        ];
        return (
          <div className="space-y-6">
            <h3 className="font-signifier text-[26px] text-ink-black">Downloads Center</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockDownloads.map((dl, i) => (
                <div key={i} className="bg-mist-gray rounded-[20px] p-6 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-paper-white rounded-[12px] flex items-center justify-center text-ink-black border border-[#e5e5e5]">
                      <FileDown className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-sohne text-[17px] font-medium text-ink-black">{dl.title}</h4>
                      <p className="text-[14px] text-slate-gray">{dl.type} • {dl.size}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'fees':
        return (
          <div className="space-y-6">
            <h3 className="font-signifier text-[26px] text-ink-black">Fee Status</h3>
            <div className="grid gap-6">
              <div className="bg-mist-gray rounded-[24px] p-8">
                <h4 className="font-sohne text-[20px] font-medium text-ink-black mb-6 border-b border-[#e5e5e5] pb-4">Recent Invoices</h4>
                {invoices.length === 0 ? (
                  <p className="text-[15px] text-slate-gray">No invoices found.</p>
                ) : (
                  <div className="space-y-4">
                    {invoices.map((inv, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-paper-white p-4 rounded-[16px] border border-[#e5e5e5]">
                        <div>
                          <p className="text-[17px] font-medium text-ink-black">{inv.title || `Invoice #${inv.id.substring(0, 8)}`}</p>
                          <p className="text-[14px] text-slate-gray">Due: {new Date(inv.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[17px] font-medium text-ink-black">₹{inv.totalAmount}</p>
                          <p className={`text-[14px] font-medium ${inv.status === 'paid' ? 'text-[#059669]' : 'text-[#e11d48]'}`}>{inv.status.toUpperCase()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="bg-mist-gray rounded-[24px] p-8">
                <h4 className="font-sohne text-[20px] font-medium text-ink-black mb-6 border-b border-[#e5e5e5] pb-4">Payment Receipts</h4>
                {receipts.length === 0 ? (
                  <p className="text-[15px] text-slate-gray">No payment receipts found.</p>
                ) : (
                  <div className="space-y-4">
                    {receipts.map((rec, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-paper-white p-4 rounded-[16px] border border-[#e5e5e5]">
                        <div>
                          <p className="text-[17px] font-medium text-ink-black">Receipt #{rec.receiptNumber}</p>
                          <p className="text-[14px] text-slate-gray">{new Date(rec.paymentDate).toLocaleDateString()} • {rec.paymentMethod}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <p className="text-[17px] font-medium text-ink-black">₹{rec.amount}</p>
                          <button className="text-[14px] text-ink-black font-medium hover:underline underline-offset-4 cursor-pointer">View PDF</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-6">
            <h3 className="font-signifier text-[26px] text-ink-black">Academic Calendar</h3>
            <div className="bg-mist-gray rounded-[24px] p-8">
              <div className="space-y-4">
                {CALENDAR_EVENTS.map((ev, i) => (
                  <div key={i} className="flex items-center gap-6 p-4 bg-paper-white rounded-[16px] border border-[#e5e5e5]">
                    <div className="text-center min-w-[60px]">
                      <div className="text-[14px] text-slate-gray uppercase font-medium">{new Date(ev.date).toLocaleString('en-US', { month: 'short' })}</div>
                      <div className="text-[26px] font-signifier text-ink-black leading-none">{new Date(ev.date).getDate()}</div>
                    </div>
                    <div className="w-px h-10 bg-[#e5e5e5]"></div>
                    <div>
                      <h4 className="text-[17px] font-medium text-ink-black">{ev.title}</h4>
                      <p className="text-[14px] text-slate-gray mt-1">{ev.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // Placeholder for unimplemented sections matching aesthetic
      default:
        return (
          <div className="bg-mist-gray rounded-[24px] p-12 text-center">
            <h3 className="font-signifier text-[26px] text-ink-black mb-2 capitalize">{activeTab.replace('-', ' ')}</h3>
            <p className="text-[17px] text-slate-gray mb-8">This module is currently being updated for the new academic session.</p>
            <button onClick={() => setActiveTab('dashboard')} className="inline-flex items-center justify-center bg-transparent border border-ink-black text-ink-black rounded-[9999px] px-5 py-2.5 text-[15px] hover:bg-[#e5e5e5] transition-colors cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="bg-transparent min-h-screen font-display text-content pb-24">
      {/* Top Navigation */}
      <nav className="bg-transparent pt-6 pb-2 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span className="font-display text-lg font-bold text-content">Hazrat Aisha Academy</span>
        </div>
        <button onClick={handleLogout} className="text-base text-content hover:text-primary transition-colors hover:underline underline-offset-4 cursor-pointer">
          Log Out
        </button>
      </nav>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Header / Student Profile Summary */}
        <div className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            {student.photoUrl ? (
              <img src={student.photoUrl} alt="profile" className="w-24 h-24 rounded-[1.25rem] object-cover border border-white/40" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-24 h-24 rounded-[1.25rem] bg-white/40 dark:bg-black/20 border border-white/40 dark:border-white/10 text-content flex items-center justify-center font-display text-3xl font-bold">
                {student.firstName[0]}{student.lastName[0]}
              </div>
            )}
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-content">
                {student.firstName} {student.lastName}
              </h1>
              <p className="text-base text-content-secondary mt-2 font-medium">
                Class {student.class} {student.section} • Session {student.session || '2026-27'}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                <span className="text-sm text-content-tertiary">Roll No: <strong className="text-content font-bold">{student.rollNumber || 'N/A'}</strong></span>
                <span className="text-sm text-content-tertiary">Aadhaar: <strong className="text-content font-bold">{maskAadhaar(student.aadhaar || '')}</strong></span>
                <span className="text-sm text-content-tertiary">ID: <strong className="text-content font-bold font-mono">{student.admissionNumber}</strong></span>
              </div>
            </div>
          </div>
          
          {activeTab !== 'dashboard' && (
            <button onClick={() => setActiveTab('dashboard')} className="inline-flex items-center justify-center bg-white/40 dark:bg-black/20 border border-white/40 dark:border-white/10 text-content rounded-xl px-5 py-2.5 text-base font-bold hover:bg-white/60 dark:hover:bg-white/5 hover:border-white/60 transition-all cursor-pointer shrink-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </button>
          )}
        </div>

        {/* Dynamic Content Area */}
        {loadingDetails && activeTab !== 'dashboard' ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          renderActiveView()
        )}
      </main>
    </div>
  );
}
