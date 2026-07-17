import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { staffService } from '../../services/staff.service';
import { Staff } from '../../types/staff';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  Plus, Search, Edit, Trash2, Eye, FileDown,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';

export function StaffList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
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

  const handleDelete = async (staffMember: Staff) => {
    if (!window.confirm(`Are you sure you want to delete ${staffMember.firstName} ${staffMember.lastName}?`)) return;
    
    try {
      await staffService.deleteStaff(staffMember.id, staffMember.photoUrl);
      addToast('Staff member deleted successfully', 'success');
      fetchStaff();
    } catch (error) {
      console.error(error);
      addToast('Failed to delete staff member', 'error');
    }
  };

  const handleExport = () => {
    if (staff.length === 0) {
      addToast('No staff to export', 'error');
      return;
    }
    
    const headers = ['Employee ID', 'First Name', 'Last Name', 'Department', 'Designation', 'Phone', 'Status'];
    const csvContent = [
      headers.join(','),
      ...staff.map(s => [
        s.employeeId,
        s.firstName,
        s.lastName,
        s.department,
        s.designation,
        s.phone,
        s.status
      ].map(v => `"${v}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'staff_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Data exported successfully', 'success');
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
            Export CSV
          </Button>
          {canEdit && (
            <Button onClick={() => navigate('/staff/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Staff Member
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
                placeholder="Search staff..."
                className="w-full pl-9 pr-4 py-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-content-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
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
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : currentStaff.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-content-secondary">No staff members found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-content-secondary font-bold uppercase bg-surface-overlay border-b border-line">
                  <tr>
                    <th className="px-6 py-4 cursor-pointer hover:bg-line/40 transition-colors" onClick={() => requestSort('name')}>
                      <div className="flex items-center gap-1 font-display uppercase tracking-wider text-xs">
                        Name {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </div>
                    </th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-line/40 transition-colors" onClick={() => requestSort('employeeId')}>
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
                <tbody className="divide-y divide-line">
                  {currentStaff.map((s) => (
                    <motion.tr 
                      key={s.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-surface hover:bg-surface-raised transition-colors duration-fast"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        {s.photoUrl ? (
                          <img src={s.photoUrl} alt="profile" className="w-9 h-9 rounded-full object-cover border border-line" referrerPolicy="no-referrer" />
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
                           s.status === 'inactive' ? 'bg-line text-content-secondary border border-line-strong' :
                           'bg-warning-500/10 text-warning-500 border-warning-500/20'}`}>
                          {s.status.toUpperCase().replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/staff/${s.id}`)}>
                          <Eye className="h-4 w-4 text-content-secondary hover:text-content" />
                        </Button>
                        {(canEdit || (user?.email === s.email)) && (
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/staff/${s.id}/edit`)}>
                            <Edit className="h-4 w-4 text-primary hover:text-primary-hover" />
                          </Button>
                        )}
                        {canEdit && (
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(s)}>
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-line font-body px-4 sm:px-0">
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
