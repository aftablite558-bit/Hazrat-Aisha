import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { admissionService } from '../../services/admission.service';
import { AdmissionApplication } from '../../types/admission';
import { Plus, Search, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

import { useNavigate } from 'react-router';

export function AdmissionDashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await admissionService.getApplications();
      setApplications(data);
    } catch (error) {
      addToast('Failed to fetch applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: any) => {
    try {
      await admissionService.updateApplicationStatus(id, status);
      addToast(`Application ${status} successfully`, 'success');
      fetchApplications();
    } catch (error) {
      addToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="space-y-6 font-body">
      <div className="flex justify-between items-center font-display">
        <div>
          <h1 className="text-[var(--text-h3)] font-extrabold tracking-tight text-content">
            Admissions
          </h1>
          <p className="text-sm text-content-secondary">Manage new student applications and school enrollments.</p>
        </div>
        <Button onClick={() => navigate('/dashboard/admissions/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="font-display text-lg text-content font-extrabold">Recent Applications</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-tertiary" />
              <input
                type="text"
                placeholder="Search applications..."
                className="w-full pl-9 pr-4 py-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {loading ? (
            <div className="py-12 text-center text-content-secondary font-medium">Loading applications...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[800px]">
                <thead className="text-xs text-content-secondary font-bold uppercase bg-white/5 border-b border-white/20">
                  <tr>
                    <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">App No.</th>
                    <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Applicant Name</th>
                    <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Class</th>
                    <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Date</th>
                    <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Status</th>
                    <th className="px-6 py-4 text-right font-display uppercase tracking-wider text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-content-secondary font-medium">
                        No applications found.
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app.id} className="hover:bg-white/10 transition-colors duration-fast">
                        <td className="px-6 py-4 font-mono font-bold text-content">{app.applicationNumber}</td>
                        <td className="px-6 py-4 font-semibold text-content">{app.studentName}</td>
                        <td className="px-6 py-4 font-medium text-content-secondary">Class {app.appliedClass}</td>
                        <td className="px-6 py-4 text-content-secondary font-medium">{new Date(app.applicationDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize
                            ${app.status === 'approved' ? 'bg-success-500/10 text-success-500 border-success-500/20' : ''}
                            ${app.status === 'rejected' ? 'bg-danger-500/10 text-danger-500 border-danger-500/20' : ''}
                            ${app.status === 'pending' ? 'bg-warning-500/10 text-warning-500 border-warning-500/20' : ''}
                            ${app.status === 'enrolled' ? 'bg-primary/10 text-primary border border-primary/20' : ''}
                          `}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            {app.status === 'pending' && (
                              <>
                                <Button variant="secondary" size="sm" onClick={() => handleStatusChange(app.id, 'approved')} className="text-success-500 hover:text-success-600 border-white/20 hover:bg-success-500/5">
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button variant="secondary" size="sm" onClick={() => handleStatusChange(app.id, 'rejected')} className="text-danger-500 hover:text-danger-600 border-white/20 hover:bg-danger-500/5">
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button variant="secondary" size="sm" className="border-white/20 text-content-secondary hover:text-content">
                              <FileText className="h-4 w-4" />
                            </Button>
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
    </div>
  );
}
