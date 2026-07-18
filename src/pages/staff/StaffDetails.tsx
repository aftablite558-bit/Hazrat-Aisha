import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { staffService } from '../../services/staff.service';
import { Staff } from '../../types/staff';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Briefcase, Calendar, GraduationCap, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export function StaffDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdminOrPrincipal = user?.role === 'admin' || user?.role === 'principal';

  useEffect(() => {
    if (id) {
      fetchStaff();
    }
  }, [id]);

  const fetchStaff = async () => {
    try {
      const data = await staffService.getStaff(id!);
      
      if (data && user?.role === 'teacher' && data.email !== user.email) {
        addToast('You can only view your own profile', 'error');
        navigate('/staff');
        return;
      }
      
      setStaff(data);
    } catch (error) {
      console.error(error);
      addToast('Failed to fetch staff details', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Staff not found</h2>
        <Button className="mt-4" onClick={() => navigate('/staff')}>Back to Staff List</Button>
      </div>
    );
  }

  const canEdit = isAdminOrPrincipal || user?.email === staff.email;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 w-full max-w-7xl mx-auto pb-10 font-body"
    >
      <div className="flex items-center justify-between font-display">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/staff')} className="text-content-secondary hover:text-content">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        {canEdit && (
          <Button onClick={() => navigate(`/staff/${staff.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-line shadow-e1">
          <CardContent className="pt-6 text-center">
            <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden bg-surface-raised mb-4 border-2 border-line shadow-inner">
              {staff.photoUrl ? (
                <img src={staff.photoUrl} alt={`${staff.firstName} ${staff.lastName}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-primary font-black bg-primary/10">
                  {staff.firstName[0]}{staff.lastName[0]}
                </div>
              )}
            </div>
            <h2 className="text-xl font-extrabold text-content font-display">
              {staff.firstName} {staff.lastName}
            </h2>
            <p className="text-content-secondary font-semibold text-sm mt-1">
              {staff.designation}
            </p>
            <p className="text-xs text-content-tertiary font-mono mt-1 font-bold">
              ID: {staff.employeeId}
            </p>
            
            <div className="mt-4 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-primary/10 text-primary border-primary/20">
              <span className={`w-2 h-2 rounded-full mr-2 ${
                staff.status === 'active' ? 'bg-success-500 animate-pulse' : 
                staff.status === 'inactive' ? 'bg-content-tertiary' : 'bg-warning-500'
              }`}></span>
              {staff.status.toUpperCase().replace('_', ' ')}
            </div>

            <div className="mt-8 space-y-4 text-left border-t border-line pt-6">
              <div className="flex items-start gap-3 text-sm">
                <Mail className="h-5 w-5 text-content-tertiary shrink-0" />
                <span className="text-content-secondary font-medium break-words">{staff.email}</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Phone className="h-5 w-5 text-content-tertiary shrink-0" />
                <span className="text-content-secondary font-medium">{staff.phone}</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 text-content-tertiary shrink-0" />
                <span className="text-content-secondary font-medium">{staff.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-line shadow-e1">
            <CardHeader className="pb-4 border-b border-line font-display">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 text-sm">
                <div>
                  <dt className="text-content-tertiary font-semibold">Department</dt>
                  <dd className="font-semibold text-content mt-0.5">{staff.department}</dd>
                </div>
                <div>
                  <dt className="text-content-tertiary font-semibold">Joining Date</dt>
                  <dd className="font-semibold text-content mt-0.5">
                    {new Date(staff.joiningDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </dd>
                </div>
                {(staff.department === 'Teaching' || staff.designation === 'Teacher') && (
                  <>
                    <div className="sm:col-span-2">
                      <dt className="text-content-tertiary font-semibold">Subjects Taught</dt>
                      <dd className="font-semibold text-content mt-0.5 bg-surface-overlay p-3 rounded-lg border border-line">{staff.subjects || '-'}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-content-tertiary font-semibold">Classes Assigned</dt>
                      <dd className="font-semibold text-content mt-0.5 bg-surface-overlay p-3 rounded-lg border border-line">{staff.classes || '-'}</dd>
                    </div>
                  </>
                )}
                {isAdminOrPrincipal && (
                  <div>
                    <dt className="text-content-tertiary font-semibold">Monthly Salary</dt>
                    <dd className="font-extrabold text-content mt-0.5 font-mono text-base text-primary">
                      {staff.salary ? `₹${staff.salary}` : 'Not specified'}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card className="border-line shadow-e1">
            <CardHeader className="pb-4 border-b border-line font-display">
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 text-sm">
                <div>
                  <dt className="text-content-tertiary font-semibold">Gender</dt>
                  <dd className="font-semibold text-content capitalize mt-0.5">{staff.gender}</dd>
                </div>
                <div>
                  <dt className="text-content-tertiary font-semibold">Date of Birth</dt>
                  <dd className="font-semibold text-content mt-0.5">
                    {new Date(staff.dateOfBirth).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </dd>
                </div>
                <div>
                  <dt className="text-content-tertiary font-semibold">Qualification</dt>
                  <dd className="font-semibold text-content mt-0.5">{staff.qualification || '-'}</dd>
                </div>
                <div>
                  <dt className="text-content-tertiary font-semibold">Experience</dt>
                  <dd className="font-semibold text-content mt-0.5">
                    {staff.experience ? `${staff.experience} Years` : '-'}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-content-tertiary font-semibold">Emergency Contact</dt>
                  <dd className="font-semibold text-content mt-0.5 bg-surface-overlay p-3 rounded-lg border border-line">{staff.emergencyContact || '-'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
