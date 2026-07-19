import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { examService } from '../../services/exam.service';
import { Exam, ExamSubject, ExamStatus } from '../../types/exam';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';

export function ExamForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);

  const [formData, setFormData] = useState<{
    title: string;
    academicYear: string;
    type: string;
    class: string;
    section: string;
    status: ExamStatus;
  }>({
    title: '',
    academicYear: '2026-2027',
    type: 'Mid Term',
    class: '1',
    section: 'A',
    status: 'draft'
  });

  const [subjects, setSubjects] = useState<ExamSubject[]>([
    { id: 'english', name: 'English', date: Date.now(), startTime: '09:00', endTime: '12:00', roomAllocation: 'Room 101', maxMarks: 100, passingMarks: 33 }
  ]);

  useEffect(() => {
    if (id) {
      loadExam();
    }
  }, [id]);

  const loadExam = async () => {
    try {
      const exam = await examService.getExam(id!);
      if (exam) {
        setFormData({
          title: exam.title,
          academicYear: exam.academicYear,
          type: exam.type,
          class: exam.class,
          section: exam.section,
          status: exam.status
        });
        setSubjects(exam.subjects || []);
      }
    } catch (error) {
      addToast('Failed to load exam', 'error');
    } finally {
      setFetching(false);
    }
  };

  const addSubject = () => {
    setSubjects([...subjects, { 
      id: `subj_${Date.now()}`, 
      name: '', 
      date: Date.now(), 
      startTime: '09:00', 
      endTime: '12:00', 
      roomAllocation: '', 
      maxMarks: 100, 
      passingMarks: 33 
    }]);
  };

  const removeSubject = (index: number) => {
    const newSubjects = [...subjects];
    newSubjects.splice(index, 1);
    setSubjects(newSubjects);
  };

  const updateSubject = (index: number, field: keyof ExamSubject, value: any) => {
    const newSubjects = [...subjects];
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setSubjects(newSubjects);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (subjects.length === 0) {
      addToast('Please add at least one subject', 'error');
      return;
    }

    setLoading(true);
    try {
      const examData = {
        ...formData,
        subjects
      };

      if (id) {
        await examService.updateExam(id, examData);
        addToast('Exam updated successfully', 'success');
      } else {
        await examService.createExam(examData);
        addToast('Exam created successfully', 'success');
      }
      navigate('/dashboard/exams');
    } catch (error) {
      addToast(id ? 'Failed to update exam' : 'Failed to create exam', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6 font-body">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate('/dashboard/exams')} className="border-white/20 text-content-secondary hover:text-content font-bold font-display">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-extrabold tracking-tight text-content font-display">{id ? 'Edit Exam' : 'Create Exam'}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="border-b border-white/20 pb-4">
            <CardTitle className="text-lg text-content font-extrabold font-display">Exam Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-content-tertiary uppercase tracking-wider font-display">Exam Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Mid Term Examination 2026"
                  className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-content-tertiary uppercase tracking-wider font-display">Academic Year</label>
                <input
                  type="text"
                  required
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-content-tertiary uppercase tracking-wider font-display">Exam Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                >
                  <option value="Mid Term">Mid Term</option>
                  <option value="Final">Final</option>
                  <option value="Unit Test">Unit Test</option>
                  <option value="Pre Board">Pre Board</option>
                </select>
              </div>
              <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                  <label className="text-xs font-bold text-content-tertiary uppercase tracking-wider font-display">Class</label>
                  <select
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content-secondary focus:outline-none focus:border-primary"
                  >
                    {['1','2','3','4','5','6','7','8','9','10','11','12'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2 flex-1">
                  <label className="text-xs font-bold text-content-tertiary uppercase tracking-wider font-display">Section</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content-secondary focus:outline-none focus:border-primary"
                  >
                    {['A','B','C','D'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-content-tertiary uppercase tracking-wider font-display">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as ExamStatus })}
                  className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-white/20 pb-4 font-display">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg text-content font-extrabold">Schedule & Subjects</CardTitle>
              <Button type="button" variant="secondary" size="sm" onClick={addSubject} className="border-white/20 text-content-secondary hover:text-content font-bold font-display">
                <Plus className="h-4 w-4 mr-2" /> Add Subject
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {subjects.map((subject, index) => (
                <div key={subject.id} className="p-5 border border-white/20 rounded-xl space-y-4 transition-all duration-fast hover:border-content-tertiary">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-content font-display uppercase tracking-wider">Subject {index + 1}</h4>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeSubject(index)} className="text-danger-500 hover:text-danger-600 hover:bg-danger-500/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-content-tertiary uppercase tracking-wider font-display">Subject Name</label>
                      <input
                        type="text"
                        required
                        value={subject.name}
                        onChange={(e) => updateSubject(index, 'name', e.target.value)}
                        className="w-full p-2 text-sm border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-content focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-content-tertiary uppercase tracking-wider font-display">Date</label>
                      <input
                        type="date"
                        required
                        value={new Date(subject.date).toISOString().split('T')[0]}
                        onChange={(e) => updateSubject(index, 'date', new Date(e.target.value).getTime())}
                        className="w-full p-2 text-sm border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-content focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-content-tertiary uppercase tracking-wider font-display">Start Time</label>
                      <input
                        type="time"
                        required
                        value={subject.startTime}
                        onChange={(e) => updateSubject(index, 'startTime', e.target.value)}
                        className="w-full p-2 text-sm border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-content focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-content-tertiary uppercase tracking-wider font-display">End Time</label>
                      <input
                        type="time"
                        required
                        value={subject.endTime}
                        onChange={(e) => updateSubject(index, 'endTime', e.target.value)}
                        className="w-full p-2 text-sm border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-content focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-content-tertiary uppercase tracking-wider font-display">Room</label>
                      <input
                        type="text"
                        value={subject.roomAllocation}
                        onChange={(e) => updateSubject(index, 'roomAllocation', e.target.value)}
                        className="w-full p-2 text-sm border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-content focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-content-tertiary uppercase tracking-wider font-display">Max Marks</label>
                      <input
                        type="number"
                        required
                        value={subject.maxMarks}
                        onChange={(e) => updateSubject(index, 'maxMarks', Number(e.target.value))}
                        className="w-full p-2 text-sm border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-content focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-content-tertiary uppercase tracking-wider font-display">Passing Marks</label>
                      <input
                        type="number"
                        required
                        value={subject.passingMarks}
                        onChange={(e) => updateSubject(index, 'passingMarks', Number(e.target.value))}
                        className="w-full p-2 text-sm border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-content focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={loading} className="font-bold font-display">
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Exam'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
