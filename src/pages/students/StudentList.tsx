import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { studentService } from '../../services/student.service';
import { Student } from '../../types/student';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  Plus, Search, Edit, Trash2, Eye, FileDown,
  Filter, ArrowUpDown, Loader2, MoreVertical
} from 'lucide-react';
import { motion } from 'motion/react';

export function StudentList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'admissionNumber'; direction: 'asc' | 'desc' } | null>(null);
  
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

  const handleDelete = async (student: Student) => {
    if (!window.confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) return;
    
    try {
      await studentService.deleteStudent(student.id, student.photoUrl);
      addToast('Student deleted successfully', 'success');
      fetchStudents();
    } catch (error) {
      console.error(error);
      addToast('Failed to delete student', 'error');
    }
  };

  const handleExport = () => {
    if (students.length === 0) {
      addToast('No students to export', 'error');
      return;
    }
    
    const headers = ['Admission No', 'Roll No', 'First Name', 'Last Name', 'Gender', 'DOB', 'Class', 'Section', 'Mobile', 'Status'];
    const csvContent = [
      headers.join(','),
      ...students.map(s => [
        s.admissionNumber,
        s.rollNumber,
        s.firstName,
        s.lastName,
        s.gender,
        s.dateOfBirth,
        s.class,
        s.section,
        s.mobile,
        s.status
      ].map(v => `"${v}"`).join(','))
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'students_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Data exported successfully', 'success');
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
            Export CSV
          </Button>
          {canEdit && (
            <Button onClick={() => navigate('/students/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          )}
        </div>
      </div>

      <Card className="border-line shadow-e1">
        <CardHeader className="pb-4 border-b border-line">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-tertiary" />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-9 pr-4 py-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-content-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
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
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : currentStudents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-content-secondary">No students found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-content-secondary font-bold uppercase bg-surface-overlay border-b border-line">
                  <tr>
                    <th className="px-6 py-4 cursor-pointer hover:bg-line/40 transition-colors" onClick={() => requestSort('name')}>
                      <div className="flex items-center gap-1 font-display uppercase tracking-wider text-xs">
                        Student {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </div>
                    </th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-line/40 transition-colors" onClick={() => requestSort('admissionNumber')}>
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
                <tbody className="divide-y divide-line">
                  {currentStudents.map((student) => (
                    <motion.tr 
                      key={student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-surface hover:bg-surface-raised transition-colors duration-fast"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        {student.photoUrl ? (
                          <img src={student.photoUrl} alt="profile" className="w-9 h-9 rounded-full object-cover border border-line" referrerPolicy="no-referrer" />
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
                            student.status === 'inactive' ? 'bg-line text-content-secondary border-line-strong' :
                            'bg-info-500/10 text-info-500 border-info-500/20'}`}>
                          {student.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/students/${student.id}`)}>
                          <Eye className="h-4 w-4 text-content-secondary hover:text-content" />
                        </Button>
                        {canEdit && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/students/${student.id}/edit`)}>
                              <Edit className="h-4 w-4 text-primary hover:text-primary-hover" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(student)}>
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
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-line font-body px-4 sm:px-0">
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
    </div>
  );
}
