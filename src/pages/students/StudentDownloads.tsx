import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  Download, Search, FileText, Calendar, Filter, ExternalLink,
  Plus, Edit2, Trash2, Check, X, FilePlus, AlertCircle, ArrowLeft
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ConfirmationDialog } from '../../components/ui/confirmation-dialog';

interface DownloadableItem {
  id: number;
  title: string;
  type: 'PDF' | 'ZIP' | 'DOCX' | 'XLSX';
  size: string;
  category: 'Syllabus' | 'Exam Materials' | 'Academic Calendar' | 'Circulars' | 'Other';
  date: string;
  description: string;
  fileName: string;
}

const DEFAULT_DOWNLOADS: DownloadableItem[] = [
  {
    id: 1,
    title: 'Mid-Term Syllabus 2026-27 (Grade I to VIII)',
    type: 'PDF',
    size: '2.4 MB',
    category: 'Syllabus',
    date: 'July 15, 2026',
    description: 'Detailed unit-wise syllabus distribution and exam structure for all subjects of classes 1st to 8th.',
    fileName: 'mid_term_syllabus_2026_27.pdf'
  },
  {
    id: 2,
    title: 'Academic Calendar 2026-27',
    type: 'PDF',
    size: '1.1 MB',
    category: 'Academic Calendar',
    date: 'July 01, 2026',
    description: 'The finalized official school planner outlining term dates, holidays, events, and examination slots.',
    fileName: 'academic_calendar_2026_27.pdf'
  },
  {
    id: 3,
    title: 'School Fee Structure & Online Payment Guide',
    type: 'PDF',
    size: '500 KB',
    category: 'Circulars',
    date: 'June 20, 2026',
    description: 'Detailed instructions on fee structure components, installment deadlines, and payment modes.',
    fileName: 'fee_payment_guide_2026.pdf'
  },
  {
    id: 4,
    title: 'Class 8 Board Exam Sample Question Papers',
    type: 'ZIP',
    size: '5.6 MB',
    category: 'Exam Materials',
    date: 'May 10, 2026',
    description: 'A bundle of previous years board papers and model questions for Mathematics, Science, and Arabic.',
    fileName: 'grade_8_sample_papers.zip'
  },
  {
    id: 5,
    title: 'Extracurricular Club Registration Form',
    type: 'DOCX',
    size: '120 KB',
    category: 'Other',
    date: 'April 02, 2026',
    description: 'Registration form for speech, arts, calligraphy, and science clubs active in this semester.',
    fileName: 'club_registration_2026.docx'
  }
];

export function StudentDownloads() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const isAdminOrPrincipal = user?.role === 'admin' || user?.role === 'principal';

  const [downloads, setDownloads] = useState<DownloadableItem[]>(() => {
    const saved = localStorage.getItem('school_downloads');
    return saved ? JSON.parse(saved) : DEFAULT_DOWNLOADS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories = ['All', 'Syllabus', 'Exam Materials', 'Academic Calendar', 'Circulars', 'Other'];

  // Form states for Admin Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DownloadableItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'PDF' as DownloadableItem['type'],
    size: '',
    category: 'Syllabus' as DownloadableItem['category'],
    description: '',
    fileName: ''
  });

  // Delete states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const saveDownloads = (updated: DownloadableItem[]) => {
    setDownloads(updated);
    localStorage.setItem('school_downloads', JSON.stringify(updated));
  };

  const handleEditClick = (item: DownloadableItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      type: item.type,
      size: item.size,
      category: item.category,
      description: item.description,
      fileName: item.fileName
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = () => {
    if (deleteTargetId === null) return;
    const updated = downloads.filter(d => d.id !== deleteTargetId);
    saveDownloads(updated);
    addToast('Resource deleted successfully', 'success');
    setDeleteConfirmOpen(false);
    setDeleteTargetId(null);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.fileName.trim()) {
      addToast('Please fill out all required fields.', 'error');
      return;
    }

    if (editingItem) {
      // Edit existing document
      const updated = downloads.map(item => item.id === editingItem.id ? {
        ...item,
        title: formData.title,
        type: formData.type,
        size: formData.size || '1.0 MB',
        category: formData.category,
        description: formData.description,
        fileName: formData.fileName
      } : item);
      saveDownloads(updated);
      addToast('Resource updated successfully', 'success');
    } else {
      // Add new document
      const newItem: DownloadableItem = {
        id: Date.now(),
        title: formData.title,
        type: formData.type,
        size: formData.size || '1.0 MB',
        category: formData.category,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
        description: formData.description,
        fileName: formData.fileName
      };
      saveDownloads([newItem, ...downloads]);
      addToast('Resource added successfully', 'success');
    }

    // Reset states
    setIsFormOpen(false);
    setEditingItem(null);
    setFormData({
      title: '',
      type: 'PDF',
      size: '',
      category: 'Syllabus',
      description: '',
      fileName: ''
    });
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    setFormData({
      title: '',
      type: 'PDF',
      size: '',
      category: 'Syllabus',
      description: '',
      fileName: ''
    });
  };

  const filteredItems = downloads.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button */}
      <div className="flex items-center">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 border-white/20 bg-white/5 hover:bg-white/10 text-content-secondary hover:text-content text-xs font-bold rounded-xl px-3 py-1.5 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <Download className="h-5 w-5" />
            <span className="text-xs font-bold tracking-widest uppercase">
              {isAdminOrPrincipal ? 'Administrative Portal' : 'Student Portal'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-content tracking-tight">
            {isAdminOrPrincipal ? 'Manage Resources & Downloads' : 'Downloads & Resources Center'}
          </h1>
          <p className="text-sm text-content-secondary max-w-2xl">
            {isAdminOrPrincipal 
              ? 'Publish, edit, or remove school documents such as syllabus, fee policies, academic calendars, and exam papers.'
              : 'Securely access and download digital syllabus charts, examination routines, sample papers, and official flyers.'}
          </p>
        </div>

        {isAdminOrPrincipal && !isFormOpen && (
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="self-start sm:self-center font-display font-bold rounded-xl flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Resource</span>
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
                    <FilePlus className="w-5 h-5 text-emerald-600 dark:text-sky-400" />
                    {editingItem ? 'Edit Resource Details' : 'Register New Downloadable Resource'}
                  </CardTitle>
                  <CardDescription className="text-xs text-content-secondary">
                    Provide the document file details and metadata to populate the school download center.
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
                <form onSubmit={handleSubmitForm} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-content-secondary uppercase tracking-wider">Resource Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Annual Syllabus 2026-27"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2.5 border border-white/30 dark:border-white/10 rounded-xl bg-white/40 dark:bg-zinc-900/40 text-sm text-content focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-content-secondary uppercase tracking-wider">Category</label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value as DownloadableItem['category'] })}
                        className="w-full px-4 py-2.5 border border-white/30 dark:border-white/10 rounded-xl bg-white/40 dark:bg-zinc-900/40 text-sm text-content focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Syllabus">Syllabus</option>
                        <option value="Exam Materials">Exam Materials</option>
                        <option value="Academic Calendar">Academic Calendar</option>
                        <option value="Circulars">Circulars</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-content-secondary uppercase tracking-wider">Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Brief description about what this file contains..."
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2.5 border border-white/30 dark:border-white/10 rounded-xl bg-white/40 dark:bg-zinc-900/40 text-sm text-content focus:outline-none focus:border-emerald-500 placeholder:text-content-tertiary/60"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-content-secondary uppercase tracking-wider">Document File Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., annual_syllabus_2026.pdf"
                        value={formData.fileName}
                        onChange={e => setFormData({ ...formData, fileName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-white/30 dark:border-white/10 rounded-xl bg-white/40 dark:bg-zinc-900/40 text-sm text-content focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-content-secondary uppercase tracking-wider">File Format</label>
                      <select
                        value={formData.type}
                        onChange={e => setFormData({ ...formData, type: e.target.value as DownloadableItem['type'] })}
                        className="w-full px-4 py-2.5 border border-white/30 dark:border-white/10 rounded-xl bg-white/40 dark:bg-zinc-900/40 text-sm text-content focus:outline-none focus:border-emerald-500"
                      >
                        <option value="PDF">PDF</option>
                        <option value="ZIP">ZIP</option>
                        <option value="DOCX">DOCX</option>
                        <option value="XLSX">XLSX</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-content-secondary uppercase tracking-wider">File Size</label>
                      <input
                        type="text"
                        placeholder="e.g., 2.4 MB"
                        value={formData.size}
                        onChange={e => setFormData({ ...formData, size: e.target.value })}
                        className="w-full px-4 py-2.5 border border-white/30 dark:border-white/10 rounded-xl bg-white/40 dark:bg-zinc-900/40 text-sm text-content focus:outline-none focus:border-emerald-500"
                      />
                    </div>
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
                      {editingItem ? 'Save Changes' : 'Upload document'}
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
            placeholder="Search downloads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-white/30 dark:border-white/10 rounded-xl bg-white/40 dark:bg-zinc-900/40 text-sm text-content focus:outline-none focus:border-primary placeholder:text-content-tertiary/60"
          />
        </div>
      </div>

      {/* Downloads List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-e2 transition-all border-white/30 hover:border-white/50 flex flex-col justify-between overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-xs font-semibold text-content-tertiary flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1" /> {item.date}
                    </span>
                  </div>
                  <CardTitle className="text-base font-bold font-display tracking-tight text-content mt-2.5 line-clamp-1">{item.title}</CardTitle>
                  <CardDescription className="text-xs text-content-secondary leading-relaxed line-clamp-2 mt-1">{item.description}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0 flex items-center justify-between bg-white/10 dark:bg-zinc-950/20 border-t border-white/10 py-3.5 px-6 rounded-b-2xl mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-black">
                      {item.type}
                    </div>
                    <span className="text-xs font-bold text-content-secondary">{item.size}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAdminOrPrincipal ? (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEditClick(item)}
                          className="font-display font-bold flex items-center gap-1 border-emerald-500/10 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs px-3 rounded-xl py-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDeleteClick(item.id)}
                          className="font-display font-bold flex items-center gap-1 border-red-500/10 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs px-3 rounded-xl py-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </>
                    ) : (
                      <Button 
                        size="sm" 
                        className="font-display font-bold flex items-center gap-1.5 rounded-xl px-4 text-xs"
                        onClick={() => addToast(`Starting download for: ${item.fileName}`, 'success')}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="md:col-span-2">
            <Card className="border-dashed border-white/20 bg-white/5 dark:bg-zinc-900/5 p-12 text-center">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-white/10 dark:bg-zinc-800/20 flex items-center justify-center text-content-tertiary">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-display font-bold text-content text-lg">No materials found</p>
                  <p className="text-sm text-content-secondary max-w-sm mx-auto">There are currently no printable/downloadable materials matching your search criteria.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      {/* Custom Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Resource"
        description="Are you sure you want to delete this resource file from the system? This action cannot be undone."
        onConfirm={executeDelete}
      />
    </div>
  );
}
