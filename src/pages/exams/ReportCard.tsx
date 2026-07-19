import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { examService } from '../../services/exam.service';
import { Exam, StudentMarks } from '../../types/exam';
import { database } from '../../lib/firebase';
import { ref, get } from 'firebase/database';
import { Printer, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { QRCodeSVG } from 'qrcode.react';

export function ReportCard() {
  const { examId, studentId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [student, setStudent] = useState<any>(null);
  const [marks, setMarks] = useState<StudentMarks | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [examId, studentId]);

  const loadData = async () => {
    try {
      if (!examId || !studentId) return;

      const examData = await examService.getExam(examId);
      setExam(examData);

      const studentRef = ref(database, `students/${studentId}`);
      const studentSnap = await get(studentRef);
      if (studentSnap.exists()) {
        setStudent({ id: studentSnap.key, ...studentSnap.val() });
      }

      const allMarks = await examService.getMarks(examId);
      setMarks(allMarks[studentId] || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Report Card...</div>;
  if (!exam || !student || !marks) return <div className="p-8 text-center">Report Card not found.</div>;

  const verificationUrl = `${window.location.origin}/results?admissionNumber=${student.admissionNumber}`;

  return (
    <div className="bg-transparent min-h-screen pb-12 print:bg-white print:pb-0 font-body">
      <div className="max-w-4xl mx-auto pt-6 px-4 print:pt-0 print:px-0">
        
        {/* Controls - Hidden in Print */}
        <div className="flex justify-between mb-6 print:hidden">
          <Button variant="secondary" onClick={() => navigate(-1)} className="border-white/20 text-content-secondary hover:text-content font-bold font-display  hover:bg-white/5">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <Button onClick={() => window.print()} className="font-bold font-display ">
            <Printer className="h-4 w-4 mr-2" /> Print Report Card
          </Button>
        </div>

        {/* Report Card Page */}
        <div className="bg-white/5 border border-white/20 shadow-e2 rounded-2xl print:border-none print:shadow-none print:w-full print:max-w-full mx-auto print:rounded-none transition-all duration-fast font-display" style={{ width: '210mm', minHeight: '297mm', padding: '20mm' }}>
          
          {/* Header */}
          <div className="text-center border-b-2 border-primary pb-6 mb-8">
            <h1 className="text-3xl font-black text-content uppercase tracking-wider mb-2">Hazrat Aisha Academy</h1>
            <p className="text-content-secondary font-semibold text-sm">Sharif Colony, Ansari Road, Chak Rajopatti, Sitamarhi, Bihar – 843302</p>
            <p className="text-content-tertiary font-bold text-xs mb-4">Established: 2018 | English Medium | Islamic Education Wing</p>
            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 font-extrabold rounded-full uppercase text-xs tracking-widest">
              Report Card • {exam.title} ({exam.academicYear})
            </div>
          </div>

          {/* Student Info */}
          <div className="flex justify-between items-start mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3 flex-1 text-sm font-semibold text-content">
              <div><span className="text-content-tertiary font-bold w-32 inline-block uppercase text-xs tracking-wider">Student Name:</span> <span>{student.firstName} {student.lastName}</span></div>
              <div><span className="text-content-tertiary font-bold w-32 inline-block uppercase text-xs tracking-wider">Admission No:</span> <span className="font-mono font-bold text-base">{student.admissionNumber}</span></div>
              <div><span className="text-content-tertiary font-bold w-32 inline-block uppercase text-xs tracking-wider">Class & Section:</span> <span>Class {student.class} - {student.section}</span></div>
              <div><span className="text-content-tertiary font-bold w-32 inline-block uppercase text-xs tracking-wider">Roll Number:</span> <span className="font-mono">{student.rollNumber || 'N/A'}</span></div>
              <div><span className="text-content-tertiary font-bold w-32 inline-block uppercase text-xs tracking-wider">Father's Name:</span> <span className="text-content-secondary">{student.fatherName || 'N/A'}</span></div>
              <div><span className="text-content-tertiary font-bold w-32 inline-block uppercase text-xs tracking-wider">Date of Birth:</span> <span className="text-content-secondary">{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}</span></div>
            </div>
            {student.photo ? (
              <img src={student.photo} alt="Student" className="w-24 h-32 object-cover border-2 border-white/20 rounded-lg shadow-sm ml-4" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-24 h-32 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center text-content-tertiary text-xs text-center ml-4 font-bold">
                Photo<br/>Placeholder
              </div>
            )}
          </div>

          {/* Marks Table */}
          <div className="mb-8 overflow-x-auto border border-white/20 rounded-xl shadow-sm">
            <table className="w-full border-collapse text-sm min-w-[500px]">
              <thead className="bg-white/5 border-b border-white/20">
                <tr>
                  <th className="border-r border-white/20 p-3 text-center w-12 font-bold text-content-secondary text-xs uppercase tracking-wider">S.No</th>
                  <th className="border-r border-white/20 p-3 text-left font-bold text-content-secondary text-xs uppercase tracking-wider">Subject</th>
                  <th className="border-r border-white/20 p-3 text-center w-24 font-bold text-content-secondary text-xs uppercase tracking-wider">Max Marks</th>
                  <th className="border-r border-white/20 p-3 text-center w-24 font-bold text-content-secondary text-xs uppercase tracking-wider">Pass Marks</th>
                  <th className="p-3 text-center w-24 font-bold text-content-secondary text-xs uppercase tracking-wider">Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {exam.subjects.map((sub, index) => {
                  const mark = marks.marks[sub.id] ?? '-';
                  const isFail = typeof mark === 'number' && mark < sub.passingMarks;
                  return (
                    <tr key={sub.id} className="hover:bg-white/10 transition-colors duration-fast">
                      <td className="border-r border-white/20 p-3 text-center font-mono font-bold text-content-secondary">{index + 1}</td>
                      <td className="border-r border-white/20 p-3 font-bold text-content">{sub.name}</td>
                      <td className="border-r border-white/20 p-3 text-center font-mono font-semibold text-content-secondary">{sub.maxMarks}</td>
                      <td className="border-r border-white/20 p-3 text-center font-mono font-semibold text-content-secondary">{sub.passingMarks}</td>
                      <td className={`p-3 text-center font-mono font-black text-base ${isFail ? 'text-danger-500 print:text-black' : 'text-success-500'}`}>
                        {mark}
                        {isFail && <span className="text-[10px] ml-1 font-bold uppercase print:hidden bg-danger-500/10 px-1 py-0.5 rounded border border-danger-500/20">(F)</span>}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-white/5 font-black border-t border-white/20 text-content">
                  <td colSpan={2} className="border-r border-white/20 p-4 text-right uppercase tracking-wider text-xs">Grand Total</td>
                  <td className="border-r border-white/20 p-4 text-center font-mono">{exam.subjects.reduce((sum, s) => sum + s.maxMarks, 0)}</td>
                  <td className="border-r border-white/20 p-4 text-center"></td>
                  <td className="p-4 text-center text-lg font-mono text-primary font-black">{marks.total}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border border-white/20 rounded-xl overflow-hidden divide-x divide-y sm:divide-y-0 divide-white/10 font-display mb-12 shadow-sm">
            <div className="p-4 text-center">
              <p className="text-content-tertiary text-[10px] font-bold uppercase tracking-widest mb-1">Percentage</p>
              <p className="text-2xl font-black text-primary font-mono">{marks.percentage.toFixed(2)}%</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-content-tertiary text-[10px] font-bold uppercase tracking-widest mb-1">Grade</p>
              <p className="text-2xl font-black text-primary font-mono">{marks.grade}</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-content-tertiary text-[10px] font-bold uppercase tracking-widest mb-1">Rank in Class</p>
              <p className="text-2xl font-black text-primary font-mono">{marks.rank}</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-content-tertiary text-[10px] font-bold uppercase tracking-widest mb-1">Final Result</p>
              <p className={`text-2xl font-black uppercase ${marks.status === 'pass' ? 'text-success-500' : 'text-danger-500'} print:text-black`}>
                {marks.status}
              </p>
            </div>
          </div>

          {/* Signatures & Verification */}
          <div className="flex justify-between items-end pt-12">
            <div className="text-center w-48 font-display">
              <div className="border-b border-white/20 mb-2 h-12"></div>
              <p className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Class Teacher</p>
            </div>
            
            <div className="text-center flex flex-col items-center">
              <div className="p-2 bg-white rounded-xl border border-white/20 shadow-sm">
                <QRCodeSVG value={verificationUrl} size={80} level="M" />
              </div>
              <p className="text-[10px] font-bold text-content-tertiary uppercase tracking-wider mt-2">Scan to verify</p>
            </div>

            <div className="text-center w-48 font-display">
              <div className="border-b border-white/20 mb-2 h-12 flex items-end justify-center pb-1">
                <span className="font-serif italic text-content-tertiary text-sm font-bold">Md. Leyaqat Hussain</span>
              </div>
              <p className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Principal</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
