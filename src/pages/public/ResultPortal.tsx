import React, { useState } from 'react';
import { AppSkeleton } from '../../components/ui/AppSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Search, GraduationCap, AlertCircle, Loader2 } from 'lucide-react';
import { database } from '../../lib/firebase';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { examService } from '../../services/exam.service';
import { Exam, StudentMarks } from '../../types/exam';

export function ResultPortal() {
  const [searchClass, setSearchClass] = useState('');
  const [searchRollNumber, setSearchRollNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [student, setStudent] = useState<any>(null);
  const [results, setResults] = useState<{ exam: Exam; marks: StudentMarks }[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchClass.trim() || !searchRollNumber.trim()) {
      setError('Please enter both Class and Roll Number.');
      return;
    }

    setLoading(true);
    setError('');
    setStudent(null);
    setResults([]);

    try {
      // 1. Find the student by roll number and class
      const studentsRef = ref(database, 'students');
      // We query by rollNumber as it returns fewer records, then filter by class client-side.
      // This is efficient and avoids downloading the entire class.
      const q = query(studentsRef, orderByChild('rollNumber'), equalTo(searchRollNumber.trim()));
      const snap = await get(q);

      if (!snap.exists()) {
        setError('Result not found.');
        setLoading(false);
        return;
      }

      let foundStudent = null;
      snap.forEach((child) => {
        const data = child.val();
        if (String(data.class).trim() === searchClass.trim()) {
          foundStudent = { id: child.key, ...data };
        }
      });

      if (!foundStudent) {
        setError('Result not found.');
        setLoading(false);
        return;
      }

      setStudent(foundStudent);

      // 2. Fetch all published exams
      const exams = await examService.getExams();
      const publishedExams = exams.filter(e => 
        e.status === 'published' && 
        String(e.class).trim() === String(foundStudent.class).trim()
      );

      // 3. Match marks
      const matchedResults: { exam: Exam; marks: StudentMarks }[] = [];
      for (const exam of publishedExams) {
        const studentMarks = await examService.getStudentMarks(exam.id, foundStudent.id);
        if (studentMarks) {
          matchedResults.push({
            exam,
            marks: studentMarks
          });
        }
      }

      setResults(matchedResults.sort((a, b) => b.exam.title.localeCompare(a.exam.title)));

      if (matchedResults.length === 0) {
        setError('No published results found for this student.');
      }

    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('Permission denied')) {
        setError('Database permission denied. Please ensure the Firebase Realtime Database rules have been updated from the database.rules.json file.');
      } else {
        setError('An error occurred while fetching results. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-transparent min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 font-body">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-4 bg-primary/20 border border-primary/30 rounded-[1.25rem] backdrop-blur-md mb-6 shadow-sm">
            <GraduationCap className="h-8 w-8 text-primary drop-shadow-md" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-content font-display tracking-tight">
            Student Result Portal
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-content-secondary font-semibold">
            Hazrat Aisha Academy • Check your academic performance
          </p>
        </div>

        {/* Search Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-6 mt-6">
            <form onSubmit={handleSearch} className="space-y-4 relative z-10">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/2">
                  <label className="block text-xs font-bold text-content-tertiary uppercase tracking-wider mb-2">Class</label>
                  <select
                    required
                    value={searchClass}
                    onChange={(e) => setSearchClass(e.target.value)}
                    className="w-full p-2.5 sm:p-3 border border-white/40 dark:border-white/10 rounded-xl bg-white/40 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-white/60 focus:bg-white/60 dark:focus:bg-black/40 [&>option]:bg-white dark:[&>option]:bg-zinc-900 [&>option]:text-zinc-900 dark:[&>option]:text-white"
                  >
                    <option value="">Select Class</option>
                    {['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(cls => (
                      <option key={cls} value={cls}>Class {cls}</option>
                    ))}
                  </select>
                </div>
                <div className="w-full sm:w-1/2 flex gap-2 sm:gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-content-tertiary uppercase tracking-wider mb-2">Roll Number</label>
                    <input
                      type="text"
                      required
                      value={searchRollNumber}
                      onChange={(e) => setSearchRollNumber(e.target.value)}
                      placeholder="e.g. 101"
                      className="w-full p-2.5 sm:p-3 border border-white/40 dark:border-white/10 rounded-xl bg-white/40 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-white/60 focus:bg-white/60 dark:focus:bg-black/40 placeholder:text-content-tertiary/50"
                    />
                  </div>
                  <Button type="submit" size="icon" disabled={loading} className="shrink-0 h-[46px] w-[46px] sm:h-[50px] sm:w-[50px] font-bold font-display shadow-md shadow-primary/20 rounded-[1.25rem]">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-danger-500/20 border border-danger-500/30 text-danger-500 rounded-xl flex items-start font-display text-sm font-semibold relative z-10">
                <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {student && results.length > 0 && (
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="p-6 mt-2 relative z-10">
                <div>
                  <h3 className="text-xl font-bold text-content font-display">{student.firstName} {student.lastName}</h3>
                  <p className="text-xs text-content-secondary font-semibold mt-1">
                    Class: <span className="text-primary font-bold">{student.class}-{student.section}</span> | 
                    Admin No: <span className="font-mono text-primary font-bold ml-1">{student.admissionNumber}</span> | 
                    Roll No: <span className="font-mono text-primary font-bold ml-1">{student.rollNumber || 'N/A'}</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6">
              {results.map((res) => (
                <Card key={res.exam.id} className="overflow-hidden p-0 border-0 hover:-translate-y-1 transition-transform duration-300">
                  <div className="bg-white/10 dark:bg-black/20 p-4 border-b border-white/20 flex justify-between items-center relative z-10">
                    <div>
                      <h4 className="font-bold text-lg text-content font-display">{res.exam.title}</h4>
                      <p className="text-xs text-content-tertiary font-bold uppercase tracking-wider mt-1">Academic Year: {res.exam.academicYear}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-content-tertiary uppercase tracking-wider">Grade</div>
                      <div className="text-2xl font-bold text-primary font-mono">{res.marks.grade}</div>
                    </div>
                  </div>
                  <CardContent className="p-0 relative z-10">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm min-w-[500px]">
                        <thead className="bg-white/5 text-content-secondary border-b border-white/10 uppercase text-xs">
                          <tr>
                            <th className="px-6 py-3 text-left font-display tracking-wider text-xs font-bold">Subject</th>
                            <th className="px-6 py-3 text-center font-display tracking-wider text-xs font-bold">Max</th>
                            <th className="px-6 py-3 text-center font-display tracking-wider text-xs font-bold">Pass</th>
                            <th className="px-6 py-3 text-right font-display tracking-wider text-xs font-bold">Obtained</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {res.exam.subjects.map(sub => {
                            const mark = res.marks.marks[sub.id] ?? '-';
                            const isFail = typeof mark === 'number' && mark < sub.passingMarks;
                            return (
                              <tr key={sub.id} className="hover:bg-white/5 transition-colors duration-fast">
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
                        <tfoot className="bg-white/5 font-bold border-t border-white/10 text-content font-display">
                          <tr>
                            <td colSpan={2} className="px-6 py-4 text-left">
                              <span className="text-xs font-bold text-content-tertiary uppercase tracking-wider mr-2">Percentage:</span>
                              <span className="text-primary font-bold font-mono text-base">{res.marks.percentage.toFixed(2)}%</span>
                            </td>
                            <td colSpan={2} className="px-6 py-4 text-right">
                              <span className="text-xs font-bold text-content-tertiary uppercase tracking-wider mr-2">Result:</span>
                              <span className={`text-base font-bold uppercase ${res.marks.status === 'pass' ? 'text-success-500' : 'text-danger-500'}`}>
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
