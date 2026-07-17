import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Search, GraduationCap, AlertCircle, Loader2 } from 'lucide-react';
import { database } from '../../lib/firebase';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { examService } from '../../services/exam.service';
import { Exam, StudentMarks } from '../../types/exam';

export function ResultPortal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'admissionNumber' | 'rollNumber'>('admissionNumber');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [student, setStudent] = useState<any>(null);
  const [results, setResults] = useState<{ exam: Exam; marks: StudentMarks }[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setStudent(null);
    setResults([]);

    try {
      // 1. Find the student
      const studentsRef = ref(database, 'students');
      const q = query(studentsRef, orderByChild(searchType), equalTo(searchQuery.trim()));
      const snap = await get(q);

      if (!snap.exists()) {
        setError('No student found with the provided details.');
        setLoading(false);
        return;
      }

      let foundStudent = null;
      snap.forEach((child) => {
        foundStudent = { id: child.key, ...child.val() };
      });

      if (!foundStudent) {
        setError('Student not found.');
        setLoading(false);
        return;
      }

      setStudent(foundStudent);

      // 2. Fetch all published exams
      const exams = await examService.getExams();
      const publishedExams = exams.filter(e => e.status === 'published' && e.class === foundStudent.class);

      // 3. Match marks
      const matchedResults: { exam: Exam; marks: StudentMarks }[] = [];
      for (const exam of publishedExams) {
        const examMarks = await examService.getMarks(exam.id);
        if (examMarks && examMarks[foundStudent.id]) {
          matchedResults.push({
            exam,
            marks: examMarks[foundStudent.id]
          });
        }
      }

      setResults(matchedResults.sort((a, b) => b.exam.title.localeCompare(a.exam.title)));

      if (matchedResults.length === 0) {
        setError('No published results found for this student.');
      }

    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--bg-surface-raised)] min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-body">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4 border border-primary/20">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-black text-content font-display tracking-tight">
            Student Result Portal
          </h2>
          <p className="mt-2 text-sm text-content-secondary font-semibold">
            Hazrat Aisha Academy • Check your academic performance
          </p>
        </div>

        {/* Search Card */}
        <Card className="shadow-e1 border-line overflow-hidden bg-surface">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-48 shrink-0">
                  <label className="block text-xs font-bold text-content-tertiary uppercase tracking-wider mb-2">Search By</label>
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value as any)}
                    className="w-full p-2.5 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                  >
                    <option value="admissionNumber">Admission Number</option>
                    <option value="rollNumber">Roll Number</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-content-tertiary uppercase tracking-wider mb-2">
                    Enter {searchType === 'admissionNumber' ? 'Admission Number' : 'Roll Number'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={searchType === 'admissionNumber' ? 'e.g. ADM-2026-0001' : 'e.g. 101'}
                      className="w-full p-2.5 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                    />
                    <Button type="submit" disabled={loading} className="shrink-0 font-bold font-display shadow-sm">
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-danger-500/10 border border-danger-500/20 text-danger-500 rounded-xl flex items-start font-display text-sm font-semibold">
                <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {student && results.length > 0 && (
          <div className="space-y-6">
            <Card className="border-line shadow-e1 bg-surface">
              <CardContent className="p-6">
                <div>
                  <h3 className="text-xl font-extrabold text-content font-display">{student.firstName} {student.lastName}</h3>
                  <p className="text-xs text-content-secondary font-semibold mt-1">
                    Class: <span className="text-content font-bold">{student.class}-{student.section}</span> | 
                    Admin No: <span className="font-mono text-content font-bold">{student.admissionNumber}</span> | 
                    Roll No: <span className="font-mono text-content font-bold">{student.rollNumber || 'N/A'}</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6">
              {results.map((res) => (
                <Card key={res.exam.id} className="overflow-hidden border border-line hover:border-primary shadow-e1 hover:shadow-e2 transition-all duration-fast rounded-xl bg-surface">
                  <div className="bg-surface-overlay p-4 border-b border-line flex justify-between items-center">
                    <div>
                      <h4 className="font-extrabold text-lg text-content font-display">{res.exam.title}</h4>
                      <p className="text-xs text-content-tertiary font-bold uppercase tracking-wider mt-1">Academic Year: {res.exam.academicYear}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-content-tertiary uppercase tracking-wider">Grade</div>
                      <div className="text-2xl font-black text-primary font-mono">{res.marks.grade}</div>
                    </div>
                  </div>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm min-w-[500px] sm:min-w-0">
                        <thead className="bg-surface-overlay text-content-secondary border-b border-line uppercase text-xs">
                          <tr>
                            <th className="px-6 py-3 text-left font-display uppercase tracking-wider text-xs font-bold">Subject</th>
                            <th className="px-6 py-3 text-center font-display uppercase tracking-wider text-xs font-bold">Max</th>
                            <th className="px-6 py-3 text-center font-display uppercase tracking-wider text-xs font-bold">Pass</th>
                            <th className="px-6 py-3 text-right font-display uppercase tracking-wider text-xs font-bold">Obtained</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                          {res.exam.subjects.map(sub => {
                            const mark = res.marks.marks[sub.id] ?? '-';
                            const isFail = typeof mark === 'number' && mark < sub.passingMarks;
                            return (
                              <tr key={sub.id} className="bg-surface hover:bg-surface-raised transition-colors duration-fast">
                                <td className="px-6 py-3.5 font-bold text-content">{sub.name}</td>
                                <td className="px-6 py-3.5 text-center font-mono font-semibold text-content-secondary">{sub.maxMarks}</td>
                                <td className="px-6 py-3.5 text-center font-mono font-semibold text-content-secondary">{sub.passingMarks}</td>
                                <td className={`px-6 py-3.5 text-right font-mono font-bold text-base ${isFail ? 'text-danger-500' : 'text-success-500'}`}>
                                  {mark}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-surface-overlay font-bold border-t border-line text-content font-display">
                          <tr>
                            <td colSpan={2} className="px-6 py-4 text-left">
                              <span className="text-xs font-bold text-content-tertiary uppercase tracking-wider mr-2">Percentage:</span>
                              <span className="text-primary font-black font-mono text-base">{res.marks.percentage.toFixed(2)}%</span>
                            </td>
                            <td colSpan={2} className="px-6 py-4 text-right">
                              <span className="text-xs font-bold text-content-tertiary uppercase tracking-wider mr-2">Result:</span>
                              <span className={`text-base font-black uppercase ${res.marks.status === 'pass' ? 'text-success-500' : 'text-danger-500'}`}>
                                {res.marks.status}
                              </span>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
