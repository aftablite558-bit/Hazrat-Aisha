import React, {  useState, useEffect  } from 'react';
import { AppSkeleton } from '../../components/ui/AppSkeleton';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { staffService } from '../../services/staff.service';
import { Staff } from '../../types/staff';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ConfirmationDialog } from '../../components/ui/confirmation-dialog';
import { 
  Plus, Search, Edit, Trash2, Eye, FileDown,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function StaffList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletePhotoUrl, setDeletePhotoUrl] = useState<string | null | undefined>(null);
  const [deleteName, setDeleteName] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'employeeId'; direction: 'asc' | 'desc' } | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const canEdit = user?.role === 'admin' || user?.role === 'principal';

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const data = await staffService.getStaffList();
      
      if (user?.role === 'teacher') {
        setStaff(data.filter(s => s.email === user.email));
      } else {
        setStaff(data);
      }
    } catch (error) {
      console.error(error);
      addToast('Failed to fetch staff', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await staffService.deleteStaff(deleteId, deletePhotoUrl);
      addToast('Staff member deleted successfully', 'success');
      setStaff(prev => prev.filter(s => s.id !== deleteId));
      setDeleteId(null);
      fetchStaff();
    } catch (error: any) {
      console.error(error);
      addToast('Failed to delete staff member', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = () => {
    if (staff.length === 0) {
      addToast('No staff to export', 'error');
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
      doc.text('OFFICIAL STAFF & TEACHER ROSTER', 15, 52);
      
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
      doc.text(`Total Staff Records: ${staff.length}`, 15, 63);
      doc.text(`Authorized by: ${user?.role === 'principal' ? 'Principal' : 'Administrator'} Portal`, 15, 68);
      
      // 3. Table generation
      const headers = [['Emp ID', 'Full Name', 'Department', 'Designation', 'Contact Phone', 'Status']];
      const data = staff.map(s => [
        s.employeeId || '-',
        `${s.firstName} ${s.lastName}`,
        s.department || '-',
        s.designation || '-',
        s.phone || '-',
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
          0: { cellWidth: 25 },
          1: { cellWidth: 45, fontStyle: 'bold' },
          2: { cellWidth: 35 },
          3: { cellWidth: 35 },
          4: { cellWidth: 30 },
          5: { cellWidth: 20, fontStyle: 'bold' }
        },
        didDrawPage: (data) => {
          // Footer
          const pageCount = (doc as any).internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.setFont('Helvetica', 'normal');
          doc.setTextColor(140, 140, 140);
          
          // Official Verification Stamp Message
          const pageHeight = doc.internal.pageSize.height;
          doc.text('This is an official system-generated record. Verified by Hazrat Aisha Academy School Administration.', 15, pageHeight - 15);
          doc.text(`Page ${data.pageNumber} of ${pageCount}`, doc.internal.pageSize.width - 30, pageHeight - 15);
        }
      });
      
      doc.save(`Hazrat_Aisha_Academy_Staff_Roster_${new Date().toISOString().slice(0,10)}.pdf`);
      addToast('Premium Staff PDF report exported successfully', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to generate professional PDF report', 'error');
    }
  };

  const requestSort = (key: 'name' | 'employeeId') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  let filteredStaff = staff.filter(s => {
    const matchesSearch = 
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.designation.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDept = departmentFilter === 'all' || s.department === departmentFilter;
    
    return matchesSearch && matchesDept;
  });

  if (sortConfig !== null) {
    filteredStaff.sort((a, b) => {
      if (sortConfig.key === 'name') {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        if (nameA < nameB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (nameA > nameB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }
      if (sortConfig.key === 'employeeId') {
        if (a.employeeId < b.employeeId) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a.employeeId > b.employeeId) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }
      return 0;
    });
  }

  // Get unique departments for filter
  const departments = Array.from(new Set(staff.map(s => s.department))).filter(Boolean);

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const currentStaff = filteredStaff.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-display">
        <div>
          <h1 className="text-[var(--text-h3)] font-extrabold tracking-tight text-content">
            Teacher & Staff Management
          </h1>
          <p className="text-sm text-content-secondary">
            Manage staff profiles, roles, and administrative details.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          {canEdit && (
            <Button onClick={() => navigate('/dashboard/staff/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Staff Member
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
                placeholder="Search staff..."
                className="w-full pl-9 pr-4 py-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md px-3 py-2 text-sm text-content-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {loading ? (
            <AppSkeleton type="table" />
          ) : currentStaff.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-content-secondary">No staff members found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[800px]">
                <thead className="text-xs text-content-secondary font-bold uppercase bg-white/5 border-b border-white/20">
                  <tr>
                    <th className="px-6 py-4 cursor-pointer hover:bg-white/10 dark:bg-black/20/40 transition-colors" onClick={() => requestSort('name')}>
                      <div className="flex items-center gap-1 font-display uppercase tracking-wider text-xs">
                        Name {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </div>
                    </th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-white/10 dark:bg-black/20/40 transition-colors" onClick={() => requestSort('employeeId')}>
                      <div className="flex items-center gap-1 font-display uppercase tracking-wider text-xs">
                        Emp ID {sortConfig?.key === 'employeeId' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </div>
                    </th>
                    <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Dept/Designation</th>
                    <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Contact</th>
                    <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Status</th>
                    <th className="px-6 py-4 text-right font-display uppercase tracking-wider text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {currentStaff.map((s) => (
                    <motion.tr 
                      key={s.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/10 transition-colors duration-fast"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        {s.photoUrl ? (
                          <img src={s.photoUrl} alt="profile" className="w-9 h-9 rounded-full object-cover border border-white/20" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
                            {s.firstName[0]}{s.lastName[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-content text-sm sm:text-base">
                            {s.firstName} {s.lastName}
                          </div>
                          <div className="text-xs text-content-secondary font-medium mt-0.5">
                            {s.gender}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-content-secondary">{s.employeeId}</td>
                      <td className="px-6 py-4">
                        <div className="text-content font-semibold text-sm">{s.department || '-'}</div>
                        <div className="text-xs text-content-secondary font-medium mt-0.5">{s.designation || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-content font-medium text-sm">{s.phone || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border
                          ${s.status === 'active' ? 'bg-success-500/10 text-success-500 border-success-500/20' : 
                           s.status === 'inactive' ? 'bg-white/10 dark:bg-black/20 text-content-secondary border border-white/30' :
                           'bg-warning-500/10 text-warning-500 border-warning-500/20'}`}>
                          {s.status.toUpperCase().replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/staff/${s.id}`)}>
                          <Eye className="h-4 w-4 text-content-secondary hover:text-content" />
                        </Button>
                        {(canEdit || (user?.email === s.email)) && (
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/staff/${s.id}/edit`)}>
                            <Edit className="h-4 w-4 text-primary hover:text-primary-hover" />
                          </Button>
                        )}
                        {canEdit && (
                          <Button variant="ghost" size="sm" onClick={() => {
                            setDeleteId(s.id);
                            setDeletePhotoUrl(s.photoUrl);
                            setDeleteName(`${s.firstName} ${s.lastName}`);
                          }}>
                            <Trash2 className="h-4 w-4 text-danger-500 hover:text-danger-600" />
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <ConfirmationDialog
            open={!!deleteId}
            onOpenChange={(open) => !open && setDeleteId(null)}
            title="Delete Staff Member"
            description={`Are you sure you want to delete ${deleteName}? This action cannot be undone.`}
            onConfirm={handleDelete}
            isLoading={isDeleting}
            className="max-w-3xl"
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/20 font-body px-4 sm:px-0">
              <p className="text-xs sm:text-sm text-content-secondary font-medium">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredStaff.length)} of {filteredStaff.length} entries
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
