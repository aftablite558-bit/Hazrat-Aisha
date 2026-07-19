import React, {  useState, useEffect  } from 'react';
import { AppSkeleton } from '../../components/ui/AppSkeleton';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { examService } from '../../services/exam.service';
import { Exam, StudentMarks } from '../../types/exam';
import { useToast } from '../../context/ToastContext';
import { Save, ArrowLeft, Loader2, FileCheck } from 'lucide-react';
import { database } from '../../lib/firebase';
import { ref, get } from 'firebase/database';

export function MarksEntry() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [marks, setMarks] = useState<Record<string, StudentMarks>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSubject, setActiveSubject] = useState<string>('');

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      const examData = await examService.getExam(id!);
      if (!examData) {
        addToast('Exam not found', 'error');
        navigate('/exams');
        return;
      }
      setExam(examData);
      if (examData.subjects && examData.subjects.length > 0) {
        setActiveSubject(examData.subjects[0].id);
      }

      // Fetch students of the same class & section
      const studentsRef = ref(database, 'students');
      const studentsSnap = await get(studentsRef);
      const studentList: any[] = [];
      if (studentsSnap.exists()) {
        studentsSnap.forEach((child) => {
          const s = child.val();
          if (s.class === examData.class && s.section === examData.section) {
            studentList.push({ id: child.key, ...s });
          }
        });
      }
      setStudents(studentList);

      const existingMarks = await examService.getMarks(id!);
      setMarks(existingMarks || {});
    } catch (error) {
      addToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (studentId: string, subjectId: string, value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    
    setMarks(prev => {
      const studentRecord = prev[studentId] || { 
        studentId, 
        examId: id!, 
        marks: {}, 
        graceMarks: {}, 
        total: 0, 
        percentage: 0, 
        grade: 'F', 
        rank: 0, 
        status: 'fail' 
      };

      const updatedMarks = {
        ...studentRecord.marks,
        [subjectId]: numValue
      };

      return {
        ...prev,
        [studentId]: {
          ...studentRecord,
          marks: updatedMarks
        }
      };
    });
  };

  const calculateResults = (currentMarks: Record<string, StudentMarks>) => {
    if (!exam) return currentMarks;

    const updatedMarks = { ...currentMarks };
    const studentsArr = Object.values(updatedMarks);

    // Calculate totals, percentage, grade, status
    studentsArr.forEach(s => {
      let total = 0;
      let maxTotal = 0;
      let hasFailed = false;

      exam.subjects.forEach(sub => {
        const mark = s.marks[sub.id] || 0;
        const grace = s.graceMarks?.[sub.id] || 0;
        const finalMark = mark + grace;
        
        total += finalMark;
        maxTotal += sub.maxMarks;

        if (finalMark < sub.passingMarks) {
          hasFailed = true;
        }
      });

      const percentage = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
      
      let grade = 'F';
      if (!hasFailed) {
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B';
        else if (percentage >= 60) grade = 'C';
        else if (percentage >= 50) grade = 'D';
        else grade = 'E';
      }

      s.total = total;
      s.percentage = percentage;
      s.grade = grade;
      s.status = hasFailed ? 'fail' : 'pass';
    });

    // Calculate rank
    const sorted = [...studentsArr].sort((a, b) => b.total - a.total);
    let currentRank = 1;
    let prevTotal = -1;

    sorted.forEach((s, index) => {
      if (s.total !== prevTotal) {
        currentRank = index + 1;
      }
      updatedMarks[s.studentId].rank = currentRank;
      prevTotal = s.total;
    });

    return updatedMarks;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const finalizedMarks = calculateResults(marks);
      await examService.saveAllMarks(id!, finalizedMarks);
      addToast('Marks saved successfully', 'success');
    } catch (error) {
      addToast('Failed to save marks', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!exam) return <div className="p-8 text-center">Exam not found</div>;

  const currentSubject = exam.subjects.find(s => s.id === activeSubject);

  return (
    <div className="space-y-6 font-body">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={() => navigate('/exams')} className="border-white/20 text-content-secondary hover:text-content font-bold font-display">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-content font-display">Marks Entry: {exam.title}</h1>
            <p className="text-sm text-content-secondary font-semibold mt-0.5">Class {exam.class}-{exam.section}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate(`/exams/${id}/publish`)} className="border-white/20 text-content-secondary hover:text-content font-bold font-display">
            <FileCheck className="h-4 w-4 mr-2" /> Publish Results
          </Button>
          <Button onClick={handleSave} disabled={saving} className="font-bold font-display">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save & Calculate
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Subject Selector Sidebar */}
        <Card className="w-full lg:w-64 shrink-0 overflow-hidden overflow-hidden">
          <CardHeader className="border-b border-white/20 pb-4 font-display">
            <CardTitle className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Subjects</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col divide-y divide-white/10">
              {exam.subjects.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubject(sub.id)}
                  className={`text-left px-4 py-3 text-sm font-semibold transition-all duration-fast border-l-4
                    ${activeSubject === sub.id 
                      ? 'border-primary bg-primary/10 text-primary font-bold' 
                      : 'border-transparent hover:bg-white/5 text-content-secondary hover:text-content'
                    }`}
                >
                  {sub.name}
                  <div className="text-[10px] text-content-tertiary mt-1 font-bold uppercase tracking-wider">Max: {sub.maxMarks} • Pass: {sub.passingMarks}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Marks Entry Table */}
        <Card className="flex-1 overflow-hidden">
          <CardHeader className="border-b border-white/20 pb-4">
            <CardTitle className="text-lg text-content font-extrabold font-display">Enter Marks for {currentSubject?.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {students.length === 0 ? (
              <div className="text-center py-12 text-content-secondary font-semibold font-display">No students found in Class {exam.class}-{exam.section}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[800px]">
                  <thead className="text-xs text-content-secondary font-bold uppercase bg-white/5 border-b border-white/20">
                    <tr>
                      <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Roll No</th>
                      <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Student Name</th>
                      <th className="px-6 py-4 font-display uppercase tracking-wider text-xs w-48">Marks Obtained</th>
                      <th className="px-6 py-4 font-display uppercase tracking-wider text-xs w-32">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {students.map((student) => {
                      const studentMarks = marks[student.id];
                      const currentMark = studentMarks?.marks?.[activeSubject] ?? '';
                      const isFail = currentSubject && Number(currentMark) < currentSubject.passingMarks && currentMark !== '';

                      return (
                        <tr key={student.id} className="hover:bg-white/10 transition-colors duration-fast">
                          <td className="px-6 py-4 font-mono font-bold text-content">{student.rollNumber || 'N/A'}</td>
                          <td className="px-6 py-4 font-semibold text-content">{student.firstName} {student.lastName}</td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              min="0"
                              max={currentSubject?.maxMarks}
                              value={currentMark}
                              onChange={(e) => handleMarkChange(student.id, activeSubject, e.target.value)}
                              className={`w-full p-2 border rounded-[var(--radius-sm)] bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]
                                ${isFail ? 'border-danger-500 text-danger-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.18)]' : 'border-[var(--border-default)]'}`}
                            />
                          </td>
                          <td className="px-6 py-4">
                            {currentMark !== '' && currentSubject && (
                              <span className={`px-2 py-1 text-xs font-bold rounded-full border capitalize ${isFail ? 'bg-danger-500/10 text-danger-500 border-danger-500/20' : 'bg-success-500/10 text-success-500 border-success-500/20'}`}>
                                {isFail ? 'Fail' : 'Pass'}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
