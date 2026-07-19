import React, {  useState, useEffect  } from 'react';
import { AppSkeleton } from '../../components/ui/AppSkeleton';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { studentService } from '../../services/student.service';
import { Student } from '../../types/student';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ConfirmationDialog } from '../../components/ui/confirmation-dialog';
import { 
  Plus, Search, Edit, Trash2, Eye, FileDown,
  Filter, ArrowUpDown, Loader2, MoreVertical
} from 'lucide-react';
import { motion } from 'motion/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function StudentList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'admissionNumber'; direction: 'asc' | 'desc' } | null>(null);
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletePhotoUrl, setDeletePhotoUrl] = useState<string | null | undefined>(null);
  const [deleteName, setDeleteName] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const canEdit = user?.role === 'admin' || user?.role === 'principal';

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await studentService.getStudents();
      setStudents(data);
    } catch (error) {
      console.error(error);
      addToast('Failed to fetch students', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    
    try {
      await studentService.deleteStudent(deleteId, deletePhotoUrl);
      addToast('Student deleted successfully', 'success');
      setStudents(prev => prev.filter(s => s.id !== deleteId));
      setDeleteId(null);
      fetchStudents();
    } catch (error) {
      console.error(error);
      addToast('Failed to delete student', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = () => {
    if (students.length === 0) {
      addToast('No students to export', 'error');
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Page setup & Colors
      const primaryColor = [4, 120, 87]; // Emerald Green (#047857)
      const secondaryColor = [217, 119, 6]; // Amber/Gold (#d97706)
      
      // 1. School Header Banner
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 38, 'F');
      
      // Accent Gold Bar
      doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.rect(0, 38, 210, 2, 'F');
      
      // Text over Banner
      doc.setTextColor(255, 255, 255);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('HAZRAT AISHA ACADEMY', 15, 16);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(200, 250, 230);
      doc.text('Chak Rajopatti, Sitamarhi, Bihar - 843302 | CBSE-Aligned & Islamic Education', 15, 23);
      doc.text('Email: info@hazrataishaacademy.com | Website: hazrataishaacademy.com', 15, 28);
      doc.text('OFFICIAL ACADEMIC REGISTRY', 15, 33);
      
      // 2. Document Title and Date info
      doc.setTextColor(50, 50, 50);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('OFFICIAL STUDENT ROSTER', 15, 52);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      const today = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.text(`Generated on: ${today}`, 15, 58);
      doc.text(`Total Enrolled Students: ${students.length}`, 15, 63);
      doc.text(`Authorized by: ${user?.role === 'principal' ? 'Principal' : 'Administrator'} Portal`, 15, 68);
      
      // 3. Table generation
      const headers = [['Adm No', 'Roll', 'Full Name', 'Gender', 'Class', 'Section', 'Parent Contact', 'Status']];
      const data = students.map(s => [
        s.admissionNumber || '-',
        s.rollNumber || '-',
        `${s.firstName} ${s.lastName}`,
        s.gender || '-',
        s.class || '-',
        s.section || '-',
        s.mobile || '-',
        s.status ? s.status.toUpperCase() : 'ACTIVE'
      ]);
      
      autoTable(doc, {
        startY: 74,
        head: headers,
        body: data,
        theme: 'striped',
        headStyles: {
          fillColor: primaryColor as any,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9,
          halign: 'left'
        },
        bodyStyles: {
          fontSize: 8.5,
          textColor: [60, 60, 60]
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 15 },
          2: { cellWidth: 40, fontStyle: 'bold' },
          3: { cellWidth: 15 },
          4: { cellWidth: 20 },
          5: { cellWidth: 15 },
          6: { cellWidth: 35 },
          7: { cellWidth: 25, fontStyle: 'bold' }
        },
        didDrawPage: (data) => {
          // Footer
          const pageCount = (doc as any).internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.setFont('Helvetica', 'normal');
          doc.setTextColor(140, 140, 140);
          
          // Official Verification Stamp Message
          const pageHeight = doc.internal.pageSize.height;
          doc.text('This is an official system-generated record. Verified by Hazrat Aisha Academy Academic Registry.', 15, pageHeight - 15);
          doc.text(`Page ${data.pageNumber} of ${pageCount}`, doc.internal.pageSize.width - 30, pageHeight - 15);
        }
      });
      
      doc.save(`Hazrat_Aisha_Academy_Students_Roster_${new Date().toISOString().slice(0,10)}.pdf`);
      addToast('Premium PDF report exported successfully', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to generate professional PDF report', 'error');
    }
  };

  const requestSort = (key: 'name' | 'admissionNumber') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter & Search
  let filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (sortConfig !== null) {
    filteredStudents.sort((a, b) => {
      if (sortConfig.key === 'name') {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        if (nameA < nameB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (nameA > nameB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }
      if (sortConfig.key === 'admissionNumber') {
        if (a.admissionNumber < b.admissionNumber) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a.admissionNumber > b.admissionNumber) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }
      return 0;
    });
  }

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const currentStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-display">
        <div>
          <h1 className="text-[var(--text-h3)] font-extrabold tracking-tight text-content">
            Student Management
          </h1>
          <p className="text-sm text-content-secondary">
            Manage student records, admissions, and academic details.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          {canEdit && (
            <Button onClick={() => navigate('/dashboard/students/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          )}
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="pb-4 border-b border-white/20">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-tertiary" />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-9 pr-4 py-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md px-3 py-2 text-sm text-content-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="alumni">Alumni</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {loading ? (
            <AppSkeleton type="table" />
          ) : currentStudents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-content-secondary">No students found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[800px]">
                <thead className="text-xs text-content-secondary font-bold uppercase bg-white/5 border-b border-white/20">
                  <tr>
                    <th className="px-6 py-4 cursor-pointer hover:bg-white/10 dark:bg-black/20/40 transition-colors" onClick={() => requestSort('name')}>
                      <div className="flex items-center gap-1 font-display uppercase tracking-wider text-xs">
                        Student {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </div>
                    </th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-white/10 dark:bg-black/20/40 transition-colors" onClick={() => requestSort('admissionNumber')}>
                      <div className="flex items-center gap-1 font-display uppercase tracking-wider text-xs">
                        Adm No. {sortConfig?.key === 'admissionNumber' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </div>
                    </th>
                    <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Class/Sec</th>
                    <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Contact</th>
                    <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Status</th>
                    <th className="px-6 py-4 text-right font-display uppercase tracking-wider text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {currentStudents.map((student) => (
                    <motion.tr 
                      key={student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/10 transition-colors duration-fast"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        {student.photoUrl ? (
                          <img src={student.photoUrl} alt="profile" className="w-9 h-9 rounded-full object-cover border border-white/20" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
                            {student.firstName[0]}{student.lastName[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-content text-sm sm:text-base">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-xs text-content-secondary font-medium mt-0.5">
                            {student.gender} • {student.bloodGroup || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-content-secondary">{student.admissionNumber}</td>
                      <td className="px-6 py-4 font-medium text-content-secondary">
                        {student.class} - {student.section}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-content font-medium text-sm">{student.mobile}</div>
                        <div className="text-xs text-content-tertiary font-medium mt-0.5">{student.fatherName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border
                          ${student.status === 'active' ? 'bg-success-500/10 text-success-500 border-success-500/20' : 
                            student.status === 'inactive' ? 'bg-white/10 dark:bg-black/20 text-content-secondary border-white/30' :
                            'bg-info-500/10 text-info-500 border-info-500/20'}`}>
                          {student.status?.toUpperCase() || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/students/${student.id}`)}>
                          <Eye className="h-4 w-4 text-content-secondary hover:text-content" />
                        </Button>
                        {canEdit && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/students/${student.id}/edit`)}>
                              <Edit className="h-4 w-4 text-primary hover:text-primary-hover" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => { setDeleteId(student.id); setDeletePhotoUrl(student.photoUrl); setDeleteName(`${student.firstName} ${student.lastName}`); }}>
                              <Trash2 className="h-4 w-4 text-danger-500 hover:text-danger-600" />
                            </Button>
                          </>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/20 font-body px-4 sm:px-0">
              <p className="text-xs sm:text-sm text-content-secondary font-medium">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} entries
              </p>
              <div className="flex gap-1">
                <Button 
                  variant="secondary" 
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  Prev
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button 
                    key={i}
                    variant={currentPage === i + 1 ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button 
                  variant="secondary" 
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <ConfirmationDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Student"
        description={`Are you sure you want to delete ${deleteName}? This action cannot be undone.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        className="max-w-3xl"
      />
    </div>
  );
}
