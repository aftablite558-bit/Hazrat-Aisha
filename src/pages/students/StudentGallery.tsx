import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  X, Play, Image as ImageIcon, Camera, ZoomIn, Plus, 
  Trash2, Video, FileImage, Sparkles, Link as LinkIcon, ArrowLeft,
  Upload
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ConfirmationDialog } from '../../components/ui/confirmation-dialog';

const DEFAULT_PHOTOS = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?fm=webp&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?fm=webp&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?fm=webp&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?fm=webp&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?fm=webp&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1546410531-bea422915462?fm=webp&fit=crop&w=800&q=80",
];

const DEFAULT_VIDEOS = [
  { title: "Annual Day Celebrations 2025", thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?fm=webp&fit=crop&w=800&q=80" },
  { title: "Inter-School Science Exhibition", thumbnail: "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?fm=webp&fit=crop&w=800&q=80" },
];

const SAMPLE_PRESET_IMAGES = [
  { label: 'Classroom study', url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?fm=webp&fit=crop&w=800&q=80' },
  { label: 'Graduation ceremony', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?fm=webp&fit=crop&w=800&q=80' },
  { label: 'Kids coding class', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?fm=webp&fit=crop&w=800&q=80' },
  { label: 'Islamic calligraphy study', url: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?fm=webp&fit=crop&w=800&q=80' },
  { label: 'School library reading', url: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?fm=webp&fit=crop&w=800&q=80' },
];

const compressImage = (base64Str: string, maxWidth = 1024, maxHeight = 1024): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

const generateVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    
    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;
    
    video.onloadeddata = () => {
      video.currentTime = Math.min(1, video.duration / 2 || 0);
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        } else {
          resolve('');
        }
      } catch (err) {
        resolve('');
      }
    };

    video.onerror = () => {
      resolve('');
    };
  });
};

export function StudentGallery() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const isAdminOrPrincipal = user?.role === 'admin' || user?.role === 'principal';

  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ title: string; thumbnail: string; videoUrl?: string } | null>(null);

  // Load photos and videos from localStorage
  const [photos, setPhotos] = useState<string[]>(() => {
    const saved = localStorage.getItem('school_gallery_photos');
    return saved ? JSON.parse(saved) : DEFAULT_PHOTOS;
  });

  const [videos, setVideos] = useState<{ title: string; thumbnail: string; videoUrl?: string }[]>(() => {
    const saved = localStorage.getItem('school_gallery_videos');
    return saved ? JSON.parse(saved) : DEFAULT_VIDEOS;
  });

  // Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [videoUploadMethod, setVideoUploadMethod] = useState<'file' | 'url'>('file');
  const [photoUrl, setPhotoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoThumbnail, setVideoThumbnail] = useState('');
  const [videoFileUrl, setVideoFileUrl] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (PNG, JPG, WEBP, etc.)', 'error');
      return;
    }

    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        const compressed = await compressImage(base64);
        setPhotoUrl(compressed);
        addToast('Image loaded and optimized successfully', 'success');
      } catch (err) {
        console.error('Compression failed:', err);
        setPhotoUrl(base64);
      } finally {
        setIsCompressing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select an image file (PNG, JPG, WEBP, etc.)', 'error');
      return;
    }

    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        const compressed = await compressImage(base64);
        setPhotoUrl(compressed);
        addToast('Image loaded and optimized successfully', 'success');
      } catch (err) {
        console.error('Compression failed:', err);
        setPhotoUrl(base64);
      } finally {
        setIsCompressing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Delete Confirmation States
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'photo' | 'video'; index: number } | null>(null);

  const savePhotos = (updated: string[]) => {
    setPhotos(updated);
    localStorage.setItem('school_gallery_photos', JSON.stringify(updated));
  };

  const saveVideos = (updated: { title: string; thumbnail: string; videoUrl?: string }[]) => {
    setVideos(updated);
    localStorage.setItem('school_gallery_videos', JSON.stringify(updated));
  };

  const handleAddPhoto = (url: string) => {
    if (!url.trim()) return;
    const updated = [url.trim(), ...photos];
    savePhotos(updated);
    setPhotoUrl('');
    setIsFormOpen(false);
    addToast('Photo added successfully to the gallery', 'success');
  };

  const handleAddVideo = (title: string, thumbnail: string, videoUrl?: string) => {
    if (!title.trim() || !thumbnail.trim()) return;
    const updated = [{ title: title.trim(), thumbnail: thumbnail.trim(), videoUrl }, ...videos];
    saveVideos(updated);
    setVideoTitle('');
    setVideoThumbnail('');
    setVideoFileUrl('');
    setIsFormOpen(false);
    addToast('Video added successfully to the gallery', 'success');
  };

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      setIsCompressing(true);
      try {
        const objectUrl = URL.createObjectURL(file);
        setVideoFileUrl(objectUrl);

        const thumbnail = await generateVideoThumbnail(file);
        if (thumbnail) {
          setVideoThumbnail(thumbnail);
          addToast('Video file loaded and thumbnail generated successfully!', 'success');
        } else {
          setVideoThumbnail('https://images.unsplash.com/photo-1511512578047-dfb367046420?fm=webp&fit=crop&w=800&q=80');
          addToast('Video file loaded successfully', 'success');
        }
      } catch (err) {
        console.error('Error reading video:', err);
        setVideoThumbnail('https://images.unsplash.com/photo-1511512578047-dfb367046420?fm=webp&fit=crop&w=800&q=80');
        addToast('Video loaded', 'success');
      } finally {
        setIsCompressing(false);
      }
    } else if (file.type.startsWith('image/')) {
      setIsCompressing(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        try {
          const compressed = await compressImage(base64);
          setVideoThumbnail(compressed);
          addToast('Thumbnail loaded and optimized', 'success');
        } catch (err) {
          setVideoThumbnail(base64);
        } finally {
          setIsCompressing(false);
        }
      };
      reader.readAsDataURL(file);
    } else {
      addToast('Please select a valid video or image file', 'error');
    }
  };

  const handleVideoDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      setIsCompressing(true);
      try {
        const objectUrl = URL.createObjectURL(file);
        setVideoFileUrl(objectUrl);
        const thumbnail = await generateVideoThumbnail(file);
        if (thumbnail) {
          setVideoThumbnail(thumbnail);
        } else {
          setVideoThumbnail('https://images.unsplash.com/photo-1511512578047-dfb367046420?fm=webp&fit=crop&w=800&q=80');
        }
        addToast('Video file dropped and thumbnail generated!', 'success');
      } catch (err) {
        setVideoThumbnail('https://images.unsplash.com/photo-1511512578047-dfb367046420?fm=webp&fit=crop&w=800&q=80');
        addToast('Video loaded', 'success');
      } finally {
        setIsCompressing(false);
      }
    } else if (file.type.startsWith('image/')) {
      setIsCompressing(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        try {
          const compressed = await compressImage(base64);
          setVideoThumbnail(compressed);
          addToast('Thumbnail loaded and optimized successfully', 'success');
        } catch (err) {
          setVideoThumbnail(base64);
        } finally {
          setIsCompressing(false);
        }
      };
      reader.readAsDataURL(file);
    } else {
      addToast('Please drop a valid video or image file', 'error');
    }
  };

  const executeDelete = () => {
    if (!deleteTarget) return;
    const { type, index } = deleteTarget;
    if (type === 'photo') {
      const targetPhoto = photos[index];
      const updated = photos.filter((_, i) => i !== index);
      savePhotos(updated);
      addToast('Photo deleted successfully from the gallery', 'success');
      if (selectedImage === targetPhoto) {
        setSelectedImage(null);
      }
    } else {
      const updated = videos.filter((_, i) => i !== index);
      saveVideos(updated);
      addToast('Video deleted successfully from the gallery', 'success');
    }
    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
  };

  const handlePresetSelect = (url: string) => {
    if (mediaType === 'photo') {
      setPhotoUrl(url);
    } else {
      setVideoThumbnail(url);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mediaType === 'photo') {
      if (!photoUrl) {
        addToast('Please select or enter a photo', 'error');
        return;
      }
      handleAddPhoto(photoUrl);
    } else {
      if (!videoTitle) {
        addToast('Please enter a video title', 'error');
        return;
      }
      if (!videoThumbnail) {
        addToast('Please provide a video file or a thumbnail cover', 'error');
        return;
      }
      handleAddVideo(videoTitle, videoThumbnail, videoFileUrl || undefined);
    }
  };

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
            <Camera className="h-5 w-5" />
            <span className="text-xs font-bold tracking-widest uppercase">
              {isAdminOrPrincipal ? 'Administrative Portal' : 'Student Portal'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-content tracking-tight">
            {isAdminOrPrincipal ? 'Manage Media Gallery' : 'Authenticated Media Gallery'}
          </h1>
          <p className="text-sm text-content-secondary max-w-2xl">
            {isAdminOrPrincipal
              ? 'Add or remove campus photographs and celebration videos showcasing academic excellence and life at Hazrat Aisha Academy.'
              : 'Glimpses of life, learning, celebrations, and achievements at Hazrat Aisha Academy. Restricted to authenticated members.'}
          </p>
        </div>

        {isAdminOrPrincipal && !isFormOpen && (
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="self-start sm:self-center font-display font-bold rounded-xl flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Media</span>
          </Button>
        )}
      </div>

      {/* Media Addition Form */}
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
                    <Sparkles className="w-5 h-5 text-emerald-600 dark:text-sky-400" />
                    Upload Gallery Resource
                  </CardTitle>
                  <CardDescription className="text-xs text-content-secondary">
                    Add high-quality visual content to the online academic portal.
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full w-8 h-8 text-content hover:bg-black/5 dark:hover:bg-white/5"
                  onClick={() => setIsFormOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Select Media Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-content-secondary uppercase tracking-wider block">Media Type</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm font-bold text-content cursor-pointer">
                        <input
                          type="radio"
                          name="mediaType"
                          checked={mediaType === 'photo'}
                          onChange={() => setMediaType('photo')}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="flex items-center gap-1.5"><FileImage className="w-4 h-4 text-emerald-600" /> Photo</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm font-bold text-content cursor-pointer">
                        <input
                          type="radio"
                          name="mediaType"
                          checked={mediaType === 'video'}
                          onChange={() => setMediaType('video')}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="flex items-center gap-1.5"><Video className="w-4 h-4 text-emerald-600" /> Video</span>
                      </label>
                    </div>
                  </div>

                  {mediaType === 'photo' ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-xs font-bold text-content-secondary uppercase tracking-wider">Photo Selection Method</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setUploadMethod('file');
                              setPhotoUrl('');
                            }}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                              uploadMethod === 'file'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-white/10 text-content-secondary hover:text-content hover:bg-white/20'
                            }`}
                          >
                            Device Upload
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setUploadMethod('url');
                              setPhotoUrl('');
                            }}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                              uploadMethod === 'url'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-white/10 text-content-secondary hover:text-content hover:bg-white/20'
                            }`}
                          >
                            Image URL
                          </button>
                        </div>
                      </div>

                      {uploadMethod === 'file' ? (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-content-secondary uppercase tracking-wider flex items-center gap-1">
                            <Upload className="w-3.5 h-3.5 text-emerald-600" /> Choose Image from Device
                          </label>
                          
                          {/* Drag and Drop Zone */}
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-300 text-center flex flex-col items-center justify-center min-h-[160px] cursor-pointer ${
                              isDragging
                                ? 'border-emerald-500 bg-emerald-500/10'
                                : photoUrl
                                ? 'border-emerald-500/50 bg-emerald-500/5'
                                : 'border-white/30 dark:border-white/10 bg-white/10 dark:bg-zinc-900/10 hover:border-emerald-500/40 hover:bg-emerald-500/5'
                            }`}
                            onClick={() => document.getElementById('device-photo-upload')?.click()}
                          >
                            <input
                              id="device-photo-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            
                            {isCompressing ? (
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-xs font-bold text-content-secondary">Optimizing Image...</span>
                              </div>
                            ) : photoUrl ? (
                              <div className="space-y-3 w-full max-w-xs flex flex-col items-center">
                                <img
                                  src={photoUrl}
                                  alt="Selected Preview"
                                  className="h-24 w-auto rounded-lg shadow-md object-cover border border-white/20"
                                />
                                <div className="text-center">
                                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">Image Selected Successfully</span>
                                  <span className="text-[10px] text-content-secondary block">Click or drag another to replace</span>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2 flex flex-col items-center">
                                <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                                  <Upload className="w-6 h-6 animate-pulse" />
                                </div>
                                <div className="text-sm">
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">Choose a file</span> or drag and drop
                                </div>
                                <p className="text-xs text-content-secondary">
                                  PNG, JPG, WEBP, or GIF (max size 10MB)
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-content-secondary uppercase tracking-wider flex items-center gap-1">
                            <LinkIcon className="w-3.5 h-3.5" /> Photo Image URL
                          </label>
                          <input
                            type="url"
                            required
                            placeholder="Paste image address (e.g. https://images.unsplash.com/...)"
                            value={photoUrl}
                            onChange={e => setPhotoUrl(e.target.value)}
                            className="w-full px-4 py-2.5 border border-white/30 dark:border-white/10 rounded-xl bg-white/40 dark:bg-zinc-900/40 text-sm text-content focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-content-secondary uppercase tracking-wider block">Video Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., Independence Day Celebrations 2026"
                          value={videoTitle}
                          onChange={e => setVideoTitle(e.target.value)}
                          className="w-full px-4 py-2.5 border border-white/30 dark:border-white/10 rounded-xl bg-white/40 dark:bg-zinc-900/40 text-sm text-content focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-xs font-bold text-content-secondary uppercase tracking-wider">Video Selection Method</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setVideoUploadMethod('file');
                              setVideoThumbnail('');
                              setVideoFileUrl('');
                            }}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                              videoUploadMethod === 'file'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-white/10 text-content-secondary hover:text-content hover:bg-white/20'
                            }`}
                          >
                            Device Upload
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setVideoUploadMethod('url');
                              setVideoThumbnail('');
                              setVideoFileUrl('');
                            }}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                              videoUploadMethod === 'url'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-white/10 text-content-secondary hover:text-content hover:bg-white/20'
                            }`}
                          >
                            Image URL
                          </button>
                        </div>
                      </div>

                      {videoUploadMethod === 'file' ? (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-content-secondary uppercase tracking-wider flex items-center gap-1">
                            <Upload className="w-3.5 h-3.5 text-emerald-600" /> Choose Video from Device
                          </label>
                          
                          {/* Drag and Drop Zone */}
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleVideoDrop}
                            className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-300 text-center flex flex-col items-center justify-center min-h-[160px] cursor-pointer ${
                              isDragging
                                ? 'border-emerald-500 bg-emerald-500/10'
                                : videoThumbnail
                                ? 'border-emerald-500/50 bg-emerald-500/5'
                                : 'border-white/30 dark:border-white/10 bg-white/10 dark:bg-zinc-900/10 hover:border-emerald-500/40 hover:bg-emerald-500/5'
                            }`}
                            onClick={() => document.getElementById('device-video-upload')?.click()}
                          >
                            <input
                              id="device-video-upload"
                              type="file"
                              accept="video/*,image/*"
                              onChange={handleVideoFileChange}
                              className="hidden"
                            />
                            
                            {isCompressing ? (
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-xs font-bold text-content-secondary">Processing Video &amp; Generating Thumbnail...</span>
                              </div>
                            ) : videoThumbnail ? (
                              <div className="space-y-3 w-full max-w-xs flex flex-col items-center">
                                <div className="relative rounded-lg overflow-hidden aspect-video w-48 shadow-md border border-white/20">
                                  <img
                                    src={videoThumbnail}
                                    alt="Selected Video Preview"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <Play className="w-8 h-8 text-white drop-shadow-md" />
                                  </div>
                                </div>
                                <div className="text-center">
                                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">Video &amp; Thumbnail Loaded</span>
                                  <span className="text-[10px] text-content-secondary block">Click or drag another to replace</span>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2 flex flex-col items-center">
                                <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                                  <Video className="w-6 h-6 animate-pulse" />
                                </div>
                                <div className="text-sm">
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">Choose a video file</span> or drag and drop
                                </div>
                                <p className="text-xs text-content-secondary">
                                  MP4, WEBM, OGG, or Thumbnail image (max 50MB)
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-content-secondary uppercase tracking-wider flex items-center gap-1">
                            <LinkIcon className="w-3.5 h-3.5" /> Video Thumbnail Image URL
                          </label>
                          <input
                            type="url"
                            required
                            placeholder="Paste thumbnail image URL..."
                            value={videoThumbnail}
                            onChange={e => setVideoThumbnail(e.target.value)}
                            className="w-full px-4 py-2.5 border border-white/30 dark:border-white/10 rounded-xl bg-white/40 dark:bg-zinc-900/40 text-sm text-content focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* High Quality Presets */}
                  <div className="pt-2">
                    <span className="text-xs font-bold text-content-secondary uppercase tracking-wider block mb-2">Preset High-Quality Images (Click to use)</span>
                    <div className="flex flex-wrap gap-2">
                      {SAMPLE_PRESET_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handlePresetSelect(preset.url)}
                          className="px-3 py-1.5 rounded-lg bg-white/50 dark:bg-zinc-900/50 border border-white/30 dark:border-white/10 text-[11px] font-bold text-content hover:bg-emerald-500 hover:text-white dark:hover:bg-sky-500 transition-all shadow-sm"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/15">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsFormOpen(false)}
                      className="border-white/20 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl font-bold"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold px-6"
                    >
                      Add to Gallery
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex justify-start">
        <div className="inline-flex p-1 shadow-sm rounded-2xl bg-white/50 dark:bg-zinc-900/50 border border-white/20 dark:border-white/10">
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'photos' 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-content hover:text-primary dark:hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4 mr-1.5" /> Photos
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'videos' 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-content hover:text-primary dark:hover:text-white'
            }`}
          >
            <Play className="w-4 h-4 mr-1.5" /> Videos
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'photos' ? (
          <motion.div
            key="photos"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {photos.map((photo, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl aspect-video border border-white/20 dark:border-white/10 shadow-sm"
              >
                <img 
                  src={photo} 
                  alt={`Gallery Image ${index + 1}`} 
                  loading="lazy" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  referrerPolicy="no-referrer" 
                />
                
                {/* Regular Hover overlay */}
                <div 
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer z-0"
                  onClick={() => setSelectedImage(photo)}
                >
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white border border-white/30 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>

                {/* Administrative Delete Badge */}
                {isAdminOrPrincipal && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget({ type: 'photo', index });
                      setDeleteConfirmOpen(true);
                    }}
                    className="absolute top-3 right-3 z-10 bg-red-600/90 hover:bg-red-600 text-white p-2 rounded-xl border border-red-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md pointer-events-auto hover:scale-105"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="videos"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {videos.map((video, index) => (
              <Card key={index} className="overflow-hidden border border-white/20 dark:border-white/10 hover:shadow-e2 transition-all group relative">
                <CardContent className="p-3">
                  <div 
                    onClick={() => setSelectedVideo(video)}
                    className="relative rounded-xl overflow-hidden aspect-video bg-black/20 group cursor-pointer"
                  >
                    <img 
                      src={video.thumbnail} 
                      alt={`Thumbnail for ${video.title}`} 
                      loading="lazy" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      referrerPolicy="no-referrer" 
                    />
                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center transition-colors group-hover:bg-black/50">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white transform group-hover:scale-105 transition-transform">
                        <Play className="w-6 h-6 ml-0.5" />
                      </div>
                    </div>

                    {/* Administrative Delete Badge for Video */}
                    {isAdminOrPrincipal && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget({ type: 'video', index });
                          setDeleteConfirmOpen(true);
                        }}
                        className="absolute top-3 right-3 bg-red-600/90 hover:bg-red-600 text-white p-2.5 rounded-xl border border-red-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md pointer-events-auto hover:scale-105 z-20"
                        title="Delete Video"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-content font-display mt-3 px-1">{video.title}</h3>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedImage(null)}
          >
            {/* Top Bar Actions */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10 pointer-events-none">
              <div className="pointer-events-auto">
                {isAdminOrPrincipal && (
                  <button
                    className="text-white bg-red-600 hover:bg-red-500 hover:scale-105 active:scale-95 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl flex items-center gap-2 font-bold font-display text-xs sm:text-sm transition-all duration-200 shadow-lg border border-red-500/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      const index = photos.indexOf(selectedImage);
                      if (index !== -1) {
                        setDeleteTarget({ type: 'photo', index });
                        setDeleteConfirmOpen(true);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Photo</span>
                  </button>
                )}
              </div>
              <div className="pointer-events-auto">
                <button 
                  className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors outline-none border border-white/10"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="max-w-4xl max-h-[85vh] overflow-hidden m-auto flex items-center justify-center relative">
              <motion.img
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                src={selectedImage}
                alt="Expanded view"
                className="max-w-full max-h-[80vh] rounded-xl shadow-2xl object-contain border border-white/10"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Lightbox Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedVideo(null)}
          >
            {/* Top Bar Actions */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10 pointer-events-none">
              <h3 className="text-white text-base font-bold font-display pointer-events-auto truncate max-w-[70%]">
                {selectedVideo.title}
              </h3>
              <div className="pointer-events-auto flex items-center gap-4">
                {isAdminOrPrincipal && (
                  <button
                    className="text-white bg-red-600 hover:bg-red-500 hover:scale-105 active:scale-95 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl flex items-center gap-2 font-bold font-display text-xs sm:text-sm transition-all duration-200 shadow-lg border border-red-500/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      const index = videos.indexOf(selectedVideo);
                      if (index !== -1) {
                        setDeleteTarget({ type: 'video', index });
                        setDeleteConfirmOpen(true);
                        setSelectedVideo(null);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Video</span>
                  </button>
                )}
                <button 
                  className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors outline-none border border-white/10"
                  onClick={() => setSelectedVideo(null)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="w-full max-w-4xl aspect-video overflow-hidden rounded-2xl shadow-2xl bg-black border border-white/10 relative" onClick={(e) => e.stopPropagation()}>
              <video
                src={selectedVideo.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-children-in-school-corridor-running-and-playing-40118-large.mp4"}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
                poster={selectedVideo.thumbnail}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={deleteTarget?.type === 'photo' ? "Delete Photo" : "Delete Video"}
        description={
          deleteTarget?.type === 'photo'
            ? "Are you sure you want to delete this photo from the gallery? This action cannot be undone."
            : "Are you sure you want to delete this video from the gallery? This action cannot be undone."
        }
        onConfirm={executeDelete}
      />
    </div>
  );
}
