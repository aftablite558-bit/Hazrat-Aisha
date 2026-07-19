import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Bell, Download, Calendar, Pin, AlertCircle, Plus, 
  Edit2, Trash2, Check, X, FileText, PinOff, LayoutList
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ConfirmationDialog } from '../../components/ui/confirmation-dialog';

interface Notice {
  id: number;
  title: string;
  date: string;
  category: 'Academic' | 'Events' | 'Admissions' | 'General';
  pinned: boolean;
  desc: string;
  fileSize: string;
  attachmentName?: string;
}

const INITIAL_NOTICES: Notice[] = [
  {
    id: 1,
    title: 'Summer Vacation Circular 2026',
    date: 'July 10, 2026',
    category: 'Academic',
    pinned: true,
    desc: 'Important guidelines and dates regarding the upcoming summer vacation and holiday homework. Parents are requested to monitor their children\'s daily learning progress.',
    fileSize: '1.2 MB',
    attachmentName: 'summer_vacation_circular_2026.pdf'
  },
  {
    id: 2,
    title: 'Admissions Open for 2026-27',
    date: 'July 05, 2026',
    category: 'Admissions',
    pinned: true,
    desc: 'Application forms are now available online. Last date for submission of completed registrations is August 15, 2026.',
    fileSize: '850 KB',
    attachmentName: 'admission_guidelines_2026_27.pdf'
  },
  {
    id: 3,
    title: 'Annual Sports Meet Schedule',
    date: 'June 28, 2026',
    category: 'Events',
    pinned: false,
    desc: 'Detailed schedule for the upcoming inter-house sports competitions. Students must register with their respective house captains by next Wednesday.',
    fileSize: '2.4 MB',
    attachmentName: 'annual_sports_schedule_2026.pdf'
  },
  {
    id: 4,
    title: 'Revised Fee Structure Notification',
    date: 'June 15, 2026',
    category: 'General',
    pinned: false,
    desc: 'Official notice regarding minor revisions in the transport fee structure and payment timelines for the upcoming session.',
    fileSize: '500 KB',
    attachmentName: 'revised_fee_structure_2026.pdf'
  }
];

export function StudentNotices() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const isAdminOrPrincipal = user?.role === 'admin' || user?.role === 'principal';

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('school_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories = ['All', 'Academic', 'Events', 'Admissions', 'General'];

  // Form states for Admin
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'General' as Notice['category'],
    desc: '',
    pinned: false,
    attachmentName: '',
    fileSize: ''
  });

  // Delete states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const saveNotices = (updated: Notice[]) => {
    setNotices(updated);
    localStorage.setItem('school_notices', JSON.stringify(updated));
  };

  const handleEditClick = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      category: notice.category,
      desc: notice.desc,
      pinned: notice.pinned,
      attachmentName: notice.attachmentName || '',
      fileSize: notice.fileSize || ''
    });
    setIsFormOpen(true);
    // Scroll to form smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = () => {
    if (deleteTargetId === null) return;
    const updated = notices.filter(n => n.id !== deleteTargetId);
    saveNotices(updated);
    addToast('Notice deleted successfully', 'success');
    setDeleteConfirmOpen(false);
    setDeleteTargetId(null);
  };

  const handleTogglePin = (id: number) => {
    const updated = notices.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n);
    saveNotices(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.desc.trim()) {
      addToast('Please fill out the Title and Description fields.', 'error');
      return;
    }

    if (editingNotice) {
      // Edit existing
      const updated = notices.map(n => n.id === editingNotice.id ? {
        ...n,
        title: formData.title,
        category: formData.category,
        desc: formData.desc,
        pinned: formData.pinned,
        attachmentName: formData.attachmentName ? formData.attachmentName : undefined,
        fileSize: formData.attachmentName ? (formData.fileSize || '1.2 MB') : ''
      } : n);
      saveNotices(updated);
      addToast('Notice updated successfully', 'success');
    } else {
      // Create new
      const newNotice: Notice = {
        id: Date.now(),
        title: formData.title,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
        category: formData.category,
        pinned: formData.pinned,
        desc: formData.desc,
        attachmentName: formData.attachmentName ? formData.attachmentName : undefined,
        fileSize: formData.attachmentName ? (formData.fileSize || '1.2 MB') : ''
      };
      saveNotices([newNotice, ...notices]);
      addToast('Notice published successfully', 'success');
    }

    // Reset states
    setIsFormOpen(false);
    setEditingNotice(null);
    setFormData({
      title: '',
      category: 'General',
      desc: '',
      pinned: false,
      attachmentName: '',
      fileSize: ''
    });
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingNotice(null);
    setFormData({
      title: '',
      category: 'General',
      desc: '',
      pinned: false,
      attachmentName: '',
      fileSize: ''
    });
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          notice.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || notice.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort pinned notices to the top
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <Bell className="h-5 w-5" />
            <span className="text-xs font-bold tracking-widest uppercase">
              {isAdminOrPrincipal ? 'Administrative Portal' : 'Student Portal'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-content tracking-tight">
            {isAdminOrPrincipal ? 'Manage Notice Board' : 'Student & Parent Notices'}
          </h1>
          <p className="text-sm text-content-secondary max-w-2xl">
            {isAdminOrPrincipal 
              ? 'Create, edit, or delete official circulars, announcements, and files shared with students, parents, and teachers.'
              : 'View official circulars, urgent announcements, and academic updates verified for registered students and parents.'}
          </p>
        </div>

        {isAdminOrPrincipal && !isFormOpen && (
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="self-start sm:self-center font-display font-bold rounded-xl flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Notice</span>
          </Button>
        )}
      </div>

      {/* Form Card for Admin creation/edit */}
      <AnimatePresence>
        {isAdminOrPrincipal && isFormOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border border-emerald-500/20 dark:border-sky-500/20 bg-emerald-50/20 dark:bg-zinc-950/30 backdrop-blur-xl shadow-md overflow-hidden">
              <CardHeader className="bg-emerald-500/5 dark:bg-sky-500/5 border-b border-white/20 dark:border-white/10 px-6 py-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold font-display text-emerald-950 dark:text-sky-100 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600 dark:text-sky-400" />
                    {editingNotice ? 'Edit Notice Settings' : 'Publish New Notice'}
                  </CardTitle>
                  <CardDescription className="text-xs text-content-secondary">
                    {editingNotice ? 'Modify the details of this circular below.' : 'Draft an official circular or holiday announcement.'}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full w-8 h-8 text-content hover:bg-black/5 dark:hover:bg-white/5"
                  onClick={handleCancelForm}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-content-secondary uppercase tracking-wider">Notice Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Summer Vacation Circular 2026"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2.5 border border-white/30 dark:border-white/10 rounded-xl bg-white/40 dark:bg-zinc-900/40 text-sm text-content focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-content-secondary uppercase tracking-wider">Category</label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value as Notice['category'] })}
                        className="w-full px-4 py-2.5 border border-white/30 dark:border-white/10 rounded-xl bg-white/40 dark:bg-zinc-900/40 text-sm text-content focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Academic">Academic</option>
                        <option value="Events">Events</option>
                        <option value="Admissions">Admissions</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-content-secondary uppercase tracking-wider">Description / Body text</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Enter the full announcement text, key highlights, or guidelines..."
                      value={formData.desc}
                      onChange={e => setFormData({ ...formData, desc: e.target.value })}
                      className="w-full px-4 py-2.5 border border-white/30 dark:border-white/10 rounded-xl bg-white/40 dark:bg-zinc-900/40 text-sm text-content focus:outline-none focus:border-emerald-500 placeholder:text-content-tertiary/60"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-content-secondary uppercase tracking-wider">Attachment Filename (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g., summer_vacation_2026.pdf"
                        value={formData.attachmentName}
                        onChange={e => setFormData({ ...formData, attachmentName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-white/30 dark:border-white/10 rounded-xl bg-white/40 dark:bg-zinc-900/40 text-sm text-content focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-content-secondary uppercase tracking-wider">File Size (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g., 1.2 MB"
                        disabled={!formData.attachmentName}
                        value={formData.fileSize}
                        onChange={e => setFormData({ ...formData, fileSize: e.target.value })}
                        className="w-full px-4 py-2.5 border border-white/30 dark:border-white/10 rounded-xl bg-white/40 dark:bg-zinc-900/40 text-sm text-content focus:outline-none focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="pinned"
                      checked={formData.pinned}
                      onChange={e => setFormData({ ...formData, pinned: e.target.checked })}
                      className="rounded border-white/30 text-emerald-600 focus:ring-emerald-500 bg-white/40 dark:bg-zinc-900/40"
                    />
                    <label htmlFor="pinned" className="text-xs font-bold text-content select-none cursor-pointer">
                      Pin to the top of the Notice Board
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/15">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancelForm}
                      className="border-white/20 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl font-bold"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold px-6"
                    >
                      {editingNotice ? 'Update Notice' : 'Publish Notice'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border border-white/20 dark:border-white/10 shadow-sm">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-content hover:text-primary dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-tertiary" />
          <input
            type="text"
            placeholder="Search notices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-white/30 dark:border-white/10 rounded-xl bg-white/40 dark:bg-zinc-900/40 text-sm text-content focus:outline-none focus:border-primary placeholder:text-content-tertiary/60"
          />
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {sortedNotices.length > 0 ? (
          sortedNotices.map((notice, index) => (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`relative overflow-hidden hover:shadow-e2 transition-all border-white/30 hover:border-white/50 ${notice.pinned ? 'border-l-4 border-l-primary/70 bg-gradient-to-r from-primary/5 to-transparent' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {notice.pinned && (
                          <span className="flex items-center text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            <Pin className="w-3 h-3 mr-1" /> Pinned
                          </span>
                        )}
                        <span className="text-xs font-semibold text-content-tertiary flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1" /> {notice.date}
                        </span>
                        <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {notice.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-content font-display tracking-tight">{notice.title}</h3>
                      <p className="text-sm text-content-secondary leading-relaxed">{notice.desc}</p>
                    </div>

                    <div className="shrink-0 w-full md:w-auto flex flex-wrap items-center gap-2.5 justify-end">
                      {isAdminOrPrincipal ? (
                        <>
                          <Button 
                            variant="secondary"
                            size="sm"
                            onClick={() => handleTogglePin(notice.id)}
                            className="flex items-center gap-1 border-white/20 bg-white/10 hover:bg-white/20 text-content text-xs font-bold rounded-xl"
                            title={notice.pinned ? "Unpin Notice" : "Pin Notice"}
                          >
                            {notice.pinned ? (
                              <>
                                <PinOff className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Unpin</span>
                              </>
                            ) : (
                              <>
                                <Pin className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Pin</span>
                              </>
                            )}
                          </Button>

                          <Button 
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEditClick(notice)}
                            className="flex items-center gap-1 border-emerald-500/10 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-xl"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Button>

                          <Button 
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDeleteClick(notice.id)}
                            className="flex items-center gap-1 border-red-500/10 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </Button>
                        </>
                      ) : (
                        notice.attachmentName && (
                          <Button 
                            variant="secondary" 
                            className="w-full md:w-auto flex items-center justify-center gap-2 border-white/20 bg-white/10 hover:bg-white/20 text-content text-xs font-bold"
                            onClick={() => addToast(`Downloading attachment: ${notice.attachmentName}`, 'info')}
                          >
                            <Download className="w-4 h-4" />
                            <span>Download Resource</span>
                            <span className="text-[10px] text-content-tertiary">({notice.fileSize})</span>
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="border-dashed border-white/20 bg-white/5 dark:bg-zinc-900/5 p-12 text-center">
            <CardContent className="space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-white/10 dark:bg-zinc-800/20 flex items-center justify-center text-content-tertiary">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-display font-bold text-content text-lg">No announcements found</p>
                <p className="text-sm text-content-secondary max-w-sm mx-auto">There are currently no active notices in this category matching your search criteria.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      {/* Custom Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Notice"
        description="Are you sure you want to delete this notice? This action cannot be undone."
        onConfirm={executeDelete}
      />
    </div>
  );
}
