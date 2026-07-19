import React, {  useState, useEffect  } from 'react';
import { AppSkeleton } from '../../components/ui/AppSkeleton';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { staffService } from '../../services/staff.service';
import { CreateStaffInput } from '../../types/staff';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Upload, Loader2, Save } from 'lucide-react';

export function StaffForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | undefined>(undefined);

  const isAdminOrPrincipal = user?.role === 'admin' || user?.role === 'principal';

  const [formData, setFormData] = useState<Omit<CreateStaffInput, 'photoFile'>>({
    employeeId: '',
    firstName: '',
    lastName: '',
    gender: 'male',
    dateOfBirth: '',
    qualification: '',
    experience: '',
    joiningDate: new Date().toISOString().split('T')[0],
    department: 'Teaching',
    designation: 'Teacher',
    subjects: '',
    classes: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    salary: '',
    status: 'active',
    password: ''
  });

  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing && !isAdminOrPrincipal) {
      navigate('/unauthorized');
      return;
    }

    if (isEditing && id) {
      fetchStaff();
    }
  }, [id, isEditing, user, navigate]);

  const fetchStaff = async () => {
    try {
      const staffMember = await staffService.getStaff(id!);
      if (staffMember) {
        // Teachers can only edit their own profile
        if (!isAdminOrPrincipal && user?.email !== staffMember.email) {
          addToast('You can only edit your own profile', 'error');
          navigate('/dashboard/staff');
          return;
        }

        setFormData({
          employeeId: staffMember.employeeId,
          firstName: staffMember.firstName,
          lastName: staffMember.lastName,
          gender: staffMember.gender,
          dateOfBirth: staffMember.dateOfBirth,
          qualification: staffMember.qualification || '',
          experience: staffMember.experience || '',
          joiningDate: staffMember.joiningDate,
          department: staffMember.department,
          designation: staffMember.designation,
          subjects: staffMember.subjects || '',
          classes: staffMember.classes || '',
          email: staffMember.email,
          phone: staffMember.phone,
          address: staffMember.address,
          emergencyContact: staffMember.emergencyContact || '',
          salary: staffMember.salary || '',
          status: staffMember.status,
        });
        if (staffMember.photoUrl) {
          setExistingPhotoUrl(staffMember.photoUrl);
          setPhotoPreview(staffMember.photoUrl);
        }
      } else {
        addToast('Staff not found', 'error');
        navigate('/dashboard/staff');
      }
    } catch (error) {
      console.error(error);
      addToast('Failed to fetch staff details', 'error');
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
        await staffService.updateStaff(id, {
          ...formData,
          photoFile
        }, existingPhotoUrl);
        addToast('Staff updated successfully', 'success');
      } else {
        await staffService.createStaff({
          ...formData,
          photoFile
        });
        addToast('Staff created successfully', 'success');
      }
      navigate('/dashboard/staff');
    } catch (error: any) {
      console.error('handleSubmit error:', error);
      addToast('An error occurred. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppSkeleton type="form" />
    );
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-10 font-body">
      <div className="flex items-center gap-4 font-display">
        <Button variant="ghost" size="sm" onClick={() => navigate('/staff')} className="text-content-secondary hover:text-content">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-[var(--text-h3)] font-extrabold tracking-tight text-content">
          {isEditing ? 'Edit Staff Profile' : 'New Staff Registration'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-white/20 font-display">
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-32 h-32 rounded-2xl border-2 border-dashed border-[var(--border-default)] hover:border-primary/50 transition-colors overflow-hidden flex items-center justify-center bg-white/10 dark:bg-black/20 backdrop-blur-md shadow-inner">
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

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-content-secondary">First Name *</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleInputChange} disabled={!isAdminOrPrincipal && isEditing} className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)] disabled:opacity-50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-content-secondary">Last Name *</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleInputChange} disabled={!isAdminOrPrincipal && isEditing} className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)] disabled:opacity-50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-content-secondary">Gender *</label>
                  <select required name="gender" value={formData.gender} onChange={handleInputChange} disabled={!isAdminOrPrincipal && isEditing} className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)] disabled:opacity-50">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-content-secondary">Date of Birth *</label>
                  <input type="date" required name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} disabled={!isAdminOrPrincipal && isEditing} className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)] disabled:opacity-50" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-white/20 font-display">
            <CardTitle>Professional Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
             <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Employee ID *</label>
                <input required name="employeeId" value={formData.employeeId} onChange={handleInputChange} disabled={!isAdminOrPrincipal && isEditing} className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)] disabled:opacity-50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Department *</label>
                <select required name="department" value={formData.department} onChange={handleInputChange} disabled={!isAdminOrPrincipal && isEditing} className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)] disabled:opacity-50">
                  <option value="Teaching">Teaching</option>
                  <option value="Administration">Administration</option>
                  <option value="Library">Library</option>
                  <option value="Accounts">Accounts</option>
                  <option value="Support">Support</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Designation *</label>
                <select required name="designation" value={formData.designation} onChange={handleInputChange} disabled={!isAdminOrPrincipal && isEditing} className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)] disabled:opacity-50">
                  <option value="Principal">Principal</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Office Staff">Office Staff</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Librarian">Librarian</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Qualification</label>
                <input name="qualification" value={formData.qualification} onChange={handleInputChange} className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Experience (Years)</label>
                <input name="experience" value={formData.experience} onChange={handleInputChange} className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Joining Date *</label>
                <input type="date" required name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} disabled={!isAdminOrPrincipal && isEditing} className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)] disabled:opacity-50" />
              </div>
              
              {/* Teaching specific fields */}
              {(formData.department === 'Teaching' || formData.designation === 'Teacher') && (
                <>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-content-secondary">Subjects Taught</label>
                    <input name="subjects" value={formData.subjects} onChange={handleInputChange} placeholder="E.g., Mathematics, Science" className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-content-secondary">Classes</label>
                    <input name="classes" value={formData.classes} onChange={handleInputChange} placeholder="E.g., 9A, 10B" className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
                  </div>
                </>
              )}

              {isAdminOrPrincipal && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-content-secondary">Salary</label>
                    <input name="salary" value={formData.salary} onChange={handleInputChange} className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-content-secondary">Status *</label>
                      <select required name="status" value={formData.status} onChange={handleInputChange} className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="on_leave">On Leave</option>
                      </select>
                  </div>
                </>
              )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-white/20 font-display">
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Email Address *</label>
                <input type="email" required name="email" value={formData.email} onChange={handleInputChange} disabled={!isAdminOrPrincipal && isEditing} className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)] disabled:opacity-50" />
            </div>
            {!isEditing && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Password *</label>
                <input type="password" required name="password" value={formData.password} onChange={handleInputChange} className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
              </div>
            )}
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-content-secondary">Phone Number *</label>
                <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-content-secondary">Emergency Contact</label>
                <input name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} placeholder="Name - Relationship - Phone" className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-content-secondary">Full Address *</label>
                <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={() => navigate('/dashboard/staff')} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Update Details' : 'Register Staff'}
          </Button>
        </div>
      </form>
    </div>
  );
}
