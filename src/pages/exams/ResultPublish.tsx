import React, {  useState, useEffect  } from 'react';
import { AppSkeleton } from '../../components/ui/AppSkeleton';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { examService } from '../../services/exam.service';
import { Exam, StudentMarks, PublishedResult } from '../../types/exam';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, Loader2, CheckCircle, XCircle, Printer } from 'lucide-react';
import { database } from '../../lib/firebase';
import { ref, get } from 'firebase/database';
import { useAuth } from '../../context/AuthContext';

export function ResultPublish() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();
  const { user } = useAuth();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [marks, setMarks] = useState<Record<string, StudentMarks>>({});
  const [published, setPublished] = useState<PublishedResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const examData = await examService.getExam(id!);
      if (!examData) return;
      setExam(examData);

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

      const pubResult = await examService.getPublishedResult(id!);
      setPublished(pubResult);
    } catch (error) {
      addToast('Failed to load results data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      if (published) {
        await examService.unpublishResult(id!);
        setPublished(null);
        addToast('Results unpublished', 'success');
      } else {
        await examService.publishResult(id!, user?.email || 'Admin');
        setPublished({ examId: id!, publishedAt: Date.now(), publishedBy: user?.email || 'Admin' });
        addToast('Results published successfully', 'success');
      }
    } catch (error) {
      addToast('Failed to change publish status', 'error');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!exam) return <div className="p-8 text-center">Exam not found</div>;

  // Prepare leaderboard
  const studentResults = students.map(s => {
    const sMarks = marks[s.id];
    return {
      student: s,
      marks: sMarks || { total: 0, percentage: 0, grade: 'N/A', rank: 0, status: 'fail' }
    };
  }).sort((a, b) => (a.marks.rank || 999) - (b.marks.rank || 999));

  return (
    <div className="space-y-6 font-body">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={() => navigate('/exams')} className="border-white/20 text-content-secondary hover:text-content font-bold font-display">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-content font-display">Publish Results: {exam.title}</h1>
            <p className="text-sm text-content-secondary font-semibold mt-0.5">Class {exam.class}-{exam.section}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={published ? "danger" : "primary"}
            onClick={handlePublish} 
            disabled={publishing}
            className={`font-bold font-display ${published ? 'bg-danger-500 hover:bg-danger-600 text-white border-none' : ''}`}
          >
            {publishing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            {published ? 'Unpublish Results' : 'Publish Results'}
          </Button>
        </div>
      </div>

      {published && (
        <div className="p-4 bg-success-500/10 border border-success-500/20 rounded-xl flex items-start gap-3 font-display shadow-sm shadow-success-500/5">
          <CheckCircle className="h-5 w-5 text-success-500 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-success-500 text-sm">Results are Live</h4>
            <p className="text-xs text-success-500/90 font-semibold mt-1">
              Published on {new Date(published.publishedAt).toLocaleString()} by {published.publishedBy}. Students can now view their report cards.
            </p>
          </div>
        </div>
      )}

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-white/20 pb-4 font-display">
          <CardTitle className="text-lg text-content font-extrabold">Merit List & Final Results</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[800px]">
              <thead className="text-xs text-content-secondary font-bold uppercase bg-white/5 border-b border-white/20">
                <tr>
                  <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Rank</th>
                  <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Roll No</th>
                  <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Student Name</th>
                  <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Total Marks</th>
                  <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Percentage</th>
                  <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Grade</th>
                  <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-4 text-right font-display uppercase tracking-wider text-xs">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {studentResults.map((result) => (
                  <tr key={result.student.id} className="hover:bg-white/10 transition-colors duration-fast">
                    <td className="px-6 py-4 font-mono font-black text-content text-base">{result.marks.rank || '-'}</td>
                    <td className="px-6 py-4 font-mono text-content-secondary font-semibold">{result.student.rollNumber || 'N/A'}</td>
                    <td className="px-6 py-4 font-bold text-content">{result.student.firstName} {result.student.lastName}</td>
                    <td className="px-6 py-4 font-mono text-content-secondary font-bold">{result.marks.total}</td>
                    <td className="px-6 py-4 font-mono text-content-secondary font-bold">{result.marks.percentage?.toFixed(1)}%</td>
                    <td className="px-6 py-4 font-mono text-primary font-black text-base">{result.marks.grade}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold border capitalize
                        ${result.marks.status === 'pass' ? 'bg-success-500/10 text-success-500 border-success-500/20' : 'bg-danger-500/10 text-danger-500 border-danger-500/20'}
                      `}>
                        {result.marks.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Button variant="secondary" size="sm" onClick={() => navigate(`/exams/${exam.id}/report-card/${result.student.id}`)} className="border-white/20 text-content-secondary hover:text-content hover:bg-white/5 font-bold font-display">
                         <Printer className="h-4 w-4 mr-2" /> Print
                       </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
