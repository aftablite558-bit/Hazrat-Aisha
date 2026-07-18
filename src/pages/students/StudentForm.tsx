import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { studentService } from '../../services/student.service';
import { CreateStudentInput, Student } from '../../types/student';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Upload, Loader2, Save } from 'lucide-react';

export function StudentForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | undefined>(undefined);

  const [formData, setFormData] = useState<Omit<CreateStudentInput, 'photoFile'>>({
    admissionNumber: '',
    rollNumber: '',
    firstName: '',
    lastName: '',
    fatherName: '',
    motherName: '',
    gender: 'male',
    dateOfBirth: '',
    bloodGroup: '',
    mobile: '',
    alternateMobile: '',
    address: '',
    religion: '',
    category: '',
    aadhaar: '',
    previousSchool: '',
    admissionDate: new Date().toISOString().split('T')[0],
    status: 'active',
    class: '',
    section: '',
    session: new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString(),
  });

  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Only Admin & Principal can access this form
    if (user?.role === 'teacher') {
      navigate('/unauthorized');
      return;
    }

    if (isEditing && id) {
      fetchStudent();
    }
  }, [id, isEditing, user, navigate]);

  const fetchStudent = async () => {
    try {
      const student = await studentService.getStudent(id!);
      if (student) {
        setFormData({
          admissionNumber: student.admissionNumber,
          rollNumber: student.rollNumber,
          firstName: student.firstName,
          lastName: student.lastName,
          fatherName: student.fatherName,
          motherName: student.motherName,
          gender: student.gender,
          dateOfBirth: student.dateOfBirth,
          bloodGroup: student.bloodGroup || '',
          mobile: student.mobile,
          alternateMobile: student.alternateMobile || '',
          address: student.address,
          religion: student.religion || '',
          category: student.category || '',
          aadhaar: student.aadhaar || '',
          previousSchool: student.previousSchool || '',
          admissionDate: student.admissionDate,
          status: student.status,
          class: student.class,
          section: student.section,
          session: student.session,
        });
        if (student.photoUrl) {
          setExistingPhotoUrl(student.photoUrl);
          setPhotoPreview(student.photoUrl);
        }
      } else {
        addToast('Student not found', 'error');
        navigate('/dashboard/students');
      }
    } catch (error) {
      console.error(error);
      addToast('Failed to fetch student details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEditing && id) {
        await studentService.updateStudent(id, {
          ...formData,
          photoFile
        }, existingPhotoUrl);
        addToast('Student updated successfully', 'success');
      } else {
        await studentService.createStudent({
          ...formData,
          photoFile
        });
        addToast('Student created successfully', 'success');
      }
      navigate('/dashboard/students');
    } catch (error) {
      console.error(error);
      addToast('An error occurred. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-10 font-body">
      <div className="flex items-center gap-4 font-display">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/students')} className="text-content-secondary hover:text-content">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-[var(--text-h3)] font-extrabold tracking-tight text-content">
          {isEditing ? 'Edit Student Details' : 'Student Admission Form'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-line shadow-e1">
          <CardHeader className="border-b border-line font-display">
            <CardTitle>Basic Details</CardTitle>
            <CardDescription>Personal information of the student.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Photo Upload */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-32 h-32 rounded-2xl border-2 border-dashed border-[var(--border-default)] hover:border-primary/50 transition-colors overflow-hidden flex items-center justify-center bg-[var(--bg-surface)] shadow-inner">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <Upload className="h-8 w-8 text-content-tertiary" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <span className="text-xs font-semibold text-content-secondary mt-1">Upload Photo</span>
              </div>

              {/* Basic Fields */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-content-secondary">First Name *</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-content-secondary">Last Name *</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-content-secondary">Gender *</label>
                  <select required name="gender" value={formData.gender} onChange={handleInputChange} className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-content-secondary">Date of Birth *</label>
                  <input type="date" required name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-line">
               <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-content-secondary">Blood Group</label>
                  <input name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-content-secondary">Religion</label>
                  <input name="religion" value={formData.religion} onChange={handleInputChange} className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-content-secondary">Category (Gen/OBC/SC/ST)</label>
                  <input name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-line shadow-e1">
          <CardHeader className="border-b border-line font-display">
            <CardTitle>Academic Details</CardTitle>
            <CardDescription>Enrollment and school information.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
             <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Admission Number *</label>
                <input required name="admissionNumber" value={formData.admissionNumber} onChange={handleInputChange} className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Roll Number *</label>
                <input required name="rollNumber" value={formData.rollNumber} onChange={handleInputChange} className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Class *</label>
                <input required name="class" value={formData.class} onChange={handleInputChange} className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Section *</label>
                <input required name="section" value={formData.section} onChange={handleInputChange} className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Session *</label>
                <input required name="session" value={formData.session} onChange={handleInputChange} placeholder="e.g. 2024-2025" className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Admission Date *</label>
                <input type="date" required name="admissionDate" value={formData.admissionDate} onChange={handleInputChange} className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-content-secondary">Previous School</label>
                <input name="previousSchool" value={formData.previousSchool} onChange={handleInputChange} className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
              </div>
              <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-content-secondary">Status *</label>
                  <select required name="status" value={formData.status} onChange={handleInputChange} className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="alumni">Alumni</option>
                    <option value="suspended">Suspended</option>
                  </select>
              </div>
          </CardContent>
        </Card>

        <Card className="border-line shadow-e1">
          <CardHeader className="border-b border-line font-display">
            <CardTitle>Contact & Guardian Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Father's Name *</label>
                <input required name="fatherName" value={formData.fatherName} onChange={handleInputChange} className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
            </div>
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Mother's Name *</label>
                <input required name="motherName" value={formData.motherName} onChange={handleInputChange} className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
            </div>
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Mobile Number *</label>
                <input required name="mobile" value={formData.mobile} onChange={handleInputChange} className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
            </div>
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Alternate Mobile</label>
                <input name="alternateMobile" value={formData.alternateMobile} onChange={handleInputChange} className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
            </div>
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Aadhaar Number</label>
                <input name="aadhaar" value={formData.aadhaar} onChange={handleInputChange} className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-content-secondary">Full Address *</label>
                <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={() => navigate('/dashboard/students')} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Update Details' : 'Register Student'}
          </Button>
        </div>
      </form>
    </div>
  );
}
