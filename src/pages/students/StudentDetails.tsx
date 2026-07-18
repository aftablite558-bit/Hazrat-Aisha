import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { studentService } from '../../services/student.service';
import { Student } from '../../types/student';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Loader2, Edit, User, Phone, MapPin, GraduationCap, Calendar, Activity, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export function StudentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  
  const canEdit = user?.role === 'admin' || user?.role === 'principal';

  useEffect(() => {
    if (id) {
      fetchStudent();
    }
  }, [id]);

  const fetchStudent = async () => {
    try {
      const data = await studentService.getStudent(id!);
      if (data) {
        setStudent(data);
      } else {
        addToast('Student not found', 'error');
        navigate('/students');
      }
    } catch (error) {
      console.error(error);
      addToast('Failed to fetch student details', 'error');
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

  if (!student) return null;

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-10 font-body">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-display">
        <Button variant="ghost" size="sm" onClick={() => navigate('/students')} className="text-content-secondary hover:text-content">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Button>
        {canEdit && (
          <Button onClick={() => navigate(`/students/${student.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Student Details
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-1"
        >
          <Card className="border-line shadow-e1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-32 w-32 rounded-2xl overflow-hidden border-2 border-line bg-surface-raised shadow-inner">
                  {student.photoUrl ? (
                    <img src={student.photoUrl} alt="Profile" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-4xl text-primary font-black bg-primary/10 border border-primary/20">
                      {student.firstName[0]}{student.lastName[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-content font-display">
                    {student.firstName} {student.lastName}
                  </h2>
                  <p className="text-xs text-content-tertiary font-mono mt-1 font-bold">
                    ID: {student.admissionNumber}
                  </p>
                  <div className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                    Class {student.class} - {student.section}
                  </div>
                </div>
                <div className="w-full pt-4 border-t border-line flex flex-col gap-3 text-sm">
                  <div className="flex items-center justify-between text-content-secondary">
                    <span className="flex items-center text-content-tertiary font-medium"><Activity className="w-4 h-4 mr-2" /> Status</span>
                    <span className={`font-semibold ${student.status === 'active' ? 'text-success-500' : 'text-content-secondary'}`}>
                      {student.status?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-content-secondary">
                    <span className="flex items-center text-content-tertiary font-medium"><Calendar className="w-4 h-4 mr-2" /> Session</span>
                    <span className="font-semibold text-content">{student.session}</span>
                  </div>
                  <div className="flex items-center justify-between text-content-secondary">
                    <span className="flex items-center text-content-tertiary font-medium"><BookOpen className="w-4 h-4 mr-2" /> Roll No.</span>
                    <span className="font-semibold text-content">{student.rollNumber}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 space-y-6"
        >
          <Card className="border-line shadow-e1">
            <CardHeader className="pb-4 border-b border-line font-display">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 text-sm">
                <div>
                  <dt className="text-content-tertiary font-semibold">Gender</dt>
                  <dd className="font-medium text-content capitalize mt-0.5">{student.gender}</dd>
                </div>
                <div>
                  <dt className="text-content-tertiary font-semibold">Date of Birth</dt>
                  <dd className="font-medium text-content mt-0.5">{student.dateOfBirth}</dd>
                </div>
                <div>
                  <dt className="text-content-tertiary font-semibold">Blood Group</dt>
                  <dd className="font-medium text-content mt-0.5">{student.bloodGroup || '-'}</dd>
                </div>
                <div>
                  <dt className="text-content-tertiary font-semibold">Religion / Category</dt>
                  <dd className="font-medium text-content mt-0.5">{student.religion || '-'} / {student.category || '-'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-content-tertiary font-semibold">Aadhaar Number</dt>
                  <dd className="font-mono text-content mt-0.5">{student.aadhaar || '-'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="border-line shadow-e1">
            <CardHeader className="pb-4 border-b border-line font-display">
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Guardian & Contact Info
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 text-sm">
                <div>
                  <dt className="text-content-tertiary font-semibold">Father's Name</dt>
                  <dd className="font-medium text-content mt-0.5">{student.fatherName}</dd>
                </div>
                <div>
                  <dt className="text-content-tertiary font-semibold">Mother's Name</dt>
                  <dd className="font-medium text-content mt-0.5">{student.motherName}</dd>
                </div>
                <div>
                  <dt className="text-content-tertiary font-semibold">Mobile Number</dt>
                  <dd className="font-medium text-content mt-0.5">{student.mobile}</dd>
                </div>
                <div>
                  <dt className="text-content-tertiary font-semibold">Alternate Mobile</dt>
                  <dd className="font-medium text-content mt-0.5">{student.alternateMobile || '-'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-content-tertiary font-semibold flex items-center mb-1">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-primary" /> Full Address
                  </dt>
                  <dd className="font-medium text-content mt-0.5 bg-surface-overlay p-3 rounded-lg border border-line">{student.address}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="border-line shadow-e1">
            <CardHeader className="pb-4 border-b border-line font-display">
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Academic Enrollment History
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 text-sm">
                <div>
                  <dt className="text-content-tertiary font-semibold">Date of Admission</dt>
                  <dd className="font-medium text-content mt-0.5">{student.admissionDate}</dd>
                </div>
                <div>
                  <dt className="text-content-tertiary font-semibold">Previous School</dt>
                  <dd className="font-medium text-content mt-0.5">{student.previousSchool || '-'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
