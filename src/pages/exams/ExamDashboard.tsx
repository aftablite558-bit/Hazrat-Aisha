import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { examService } from '../../services/exam.service';
import { Exam } from '../../types/exam';
import { useToast } from '../../context/ToastContext';
import { Plus, BookOpen, FileCheck, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { ConfirmationDialog } from '../../components/ui/confirmation-dialog';

export function ExamDashboard() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdminOrPrincipal = user?.role === 'admin' || user?.role === 'principal';

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const data = await examService.getExams();
      setExams(data);
    } catch (error) {
      addToast('Failed to fetch exams', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    
    try {
      await examService.deleteExam(deleteId);
      addToast('Exam deleted successfully', 'success');
      setDeleteId(null);
      fetchExams();
    } catch (error) {
      addToast('Failed to delete exam', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 font-body">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-content font-display">
            Examinations
          </h1>
          <p className="text-sm text-content-secondary mt-1">Manage exams, marks, and results.</p>
        </div>
        {isAdminOrPrincipal && (
          <div className="flex gap-2">
            <Button onClick={() => navigate('/dashboard/exams/new')} className="font-display font-bold">
              <Plus className="h-4 w-4 mr-2" />
              Create Exam
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 font-display">
        <Card className="overflow-hidden">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Total Exams</p>
              <h3 className="text-2xl font-extrabold text-content font-mono mt-0.5">{exams.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-warning-500/10 rounded-xl">
              <FileCheck className="h-6 w-6 text-warning-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Ongoing Exams</p>
              <h3 className="text-2xl font-extrabold text-content font-mono mt-0.5">{exams.filter(e => e.status === 'scheduled' || e.status === 'draft').length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-success-500/10 rounded-xl">
              <Eye className="h-6 w-6 text-success-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Published Results</p>
              <h3 className="text-2xl font-extrabold text-content font-mono mt-0.5">{exams.filter(e => e.status === 'published').length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-white/20 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-display">
            <CardTitle className="text-lg text-content font-extrabold">Exam List</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-content-tertiary" />
              <input
                type="text"
                placeholder="Search exams..."
                className="w-full pl-9 p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {loading ? (
            <div className="py-12 text-center text-content-secondary font-semibold">Loading exams...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[800px]">
                <thead className="text-xs text-content-secondary font-bold uppercase bg-white/5 border-b border-white/20">
                  <tr>
                    <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Title</th>
                    <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Class</th>
                    <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Type</th>
                    <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Status</th>
                    <th className="px-6 py-4 text-right font-display uppercase tracking-wider text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {exams.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-content-secondary font-medium">
                        No exams found.
                      </td>
                    </tr>
                  ) : (
                    exams.map((exam) => (
                      <tr key={exam.id} className="hover:bg-white/10 transition-colors duration-fast">
                        <td className="px-6 py-4 font-semibold text-content">{exam.title}</td>
                        <td className="px-6 py-4 font-semibold text-content-secondary">Class {exam.class}-{exam.section}</td>
                        <td className="px-6 py-4 font-semibold text-content-secondary capitalize">{exam.type}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold border capitalize
                            ${exam.status === 'published' ? 'bg-success-500/10 text-success-500 border-success-500/20' : ''}
                            ${exam.status === 'draft' ? 'bg-content-secondary/10 text-content-secondary border-content-secondary/20' : ''}
                            ${exam.status === 'scheduled' ? 'bg-primary/10 text-primary border-primary/20' : ''}
                            ${exam.status === 'completed' ? 'bg-warning-500/10 text-warning-500 border-warning-500/20' : ''}
                          `}>
                            {exam.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button variant="secondary" size="sm" onClick={() => navigate(`/dashboard/exams/${exam.id}/marks`)} title="Enter Marks" className="border-white/20 text-content-secondary hover:text-content">
                              <FileCheck className="h-4 w-4" />
                            </Button>
                            {isAdminOrPrincipal && (
                              <>
                                <Button variant="secondary" size="sm" onClick={() => navigate(`/dashboard/exams/${exam.id}/edit`)} title="Edit Exam" className="border-white/20 text-content-secondary hover:text-content">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="secondary" size="sm" onClick={() => { setDeleteId(exam.id); setDeleteName(exam.title); }} className="text-danger-500 hover:text-danger-600 hover:bg-danger-500/10 border-danger-500/20">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <ConfirmationDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Exam"
        description={`Are you sure you want to delete ${deleteName}? All related marks will also be deleted.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        className="max-w-3xl"
      />
    </div>
  );
}
