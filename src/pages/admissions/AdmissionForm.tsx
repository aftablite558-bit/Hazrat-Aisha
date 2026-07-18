import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { admissionService } from '../../services/admission.service';
import { AdmissionApplication } from '../../types/admission';
import { useToast } from '../../context/ToastContext';
import { Save, ArrowLeft, Upload, Loader2 } from 'lucide-react';

export function AdmissionForm() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<AdmissionApplication>>({
    appliedClass: '1',
    gender: 'Male',
    studentName: '',
    dateOfBirth: '',
    fatherName: '',
    motherName: '',
    contactNumber: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.dateOfBirth || !formData.fatherName || !formData.contactNumber || !formData.address) {
      addToast('Please fill all required fields', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await admissionService.createApplication({
        ...formData,
        applicationDate: Date.now()
      } as any);
      addToast('Admission application submitted successfully', 'success');
      navigate('/dashboard/admissions');
    } catch (error) {
      console.error(error);
      addToast('Failed to submit application', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-body">
      <div className="flex items-center justify-between font-display">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/admissions')} className="text-content-secondary hover:text-content">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-[var(--text-h3)] font-extrabold tracking-tight text-content">
              New Admission Application
            </h1>
            <p className="text-sm text-content-secondary">Fill academic and personal details for the new candidate.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-line shadow-e1">
          <CardHeader className="border-b border-line font-display">
            <CardTitle>Academic Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Applying For Class *</label>
                <select
                  name="appliedClass"
                  required
                  value={formData.appliedClass}
                  onChange={handleChange}
                  className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                >
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(c => (
                    <option key={c} value={c}>Class {c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Previous School Attended</label>
                <input
                  type="text"
                  name="previousSchool"
                  value={formData.previousSchool || ''}
                  onChange={handleChange}
                  placeholder="Leave empty if none"
                  className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-line shadow-e1">
          <CardHeader className="border-b border-line font-display">
            <CardTitle>Student Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Student Full Name *</label>
                <input
                  type="text"
                  name="studentName"
                  required
                  value={formData.studentName}
                  onChange={handleChange}
                  className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Gender *</label>
                <select
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Blood Group</label>
                <input
                  type="text"
                  name="bloodGroup"
                  value={formData.bloodGroup || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-line shadow-e1">
          <CardHeader className="border-b border-line font-display">
            <CardTitle>Parent / Guardian Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Father's Name *</label>
                <input
                  type="text"
                  name="fatherName"
                  required
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Mother's Name *</label>
                <input
                  type="text"
                  name="motherName"
                  required
                  value={formData.motherName}
                  onChange={handleChange}
                  className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Contact Phone Number *</label>
                <input
                  type="tel"
                  name="contactNumber"
                  required
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-content-secondary">Full Residential Address *</label>
              <textarea
                name="address"
                required
                rows={3}
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)] resize-none"
              ></textarea>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-4 font-display">
          <Button type="button" variant="secondary" onClick={() => navigate('/admissions')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Submit Application
          </Button>
        </div>
      </form>
    </div>
  );
}
