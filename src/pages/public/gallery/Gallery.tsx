import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Image as ImageIcon } from 'lucide-react';
import { SEO } from '../../../components/seo/SEO';

export function Gallery() {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const photos = [
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?fm=webp&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1577896851231-70ef18881754?fm=webp&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?fm=webp&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?fm=webp&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?fm=webp&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1546410531-bea422915462?fm=webp&fit=crop&w=800&q=80",
  ];

  const videos = [
    { title: "Annual Day 2025", thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?fm=webp&fit=crop&w=800&q=80" },
    { title: "Science Exhibition", thumbnail: "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?fm=webp&fit=crop&w=800&q=80" },
  ];

  return (
    <div className="bg-[var(--bg-surface-raised)] min-h-screen pb-24 font-body">
      <SEO title="Gallery" description="View photos and videos of events and facilities at Hazrat Aisha Academy." />
      
      {/* Header */}
      <header className="bg-primary py-20 text-center px-4 relative overflow-hidden border-b border-line shadow-sm">
        <h1 className="text-4xl sm:text-5xl font-black text-content-inverse mb-4 font-display uppercase tracking-tight">Gallery</h1>
        <p className="text-content-inverse/80 font-semibold max-w-7xl mx-auto text-sm sm:text-base">Glimpses of life, learning,<br /> and celebrations at Hazrat Aisha Academy.</p>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12" aria-label="Media Gallery">
        {/* Tabs */}
        <nav className="flex justify-center mb-12" aria-label="Gallery Navigation">
          <div className="inline-flex bg-surface-overlay border border-line rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('photos')}
              aria-pressed={activeTab === 'photos'}
              className={`flex items-center px-6 py-2.5 rounded-md text-sm font-bold transition-all font-display ${activeTab === 'photos' ? 'bg-primary text-white shadow-sm' : 'text-content-secondary hover:text-content hover:bg-surface-overlay'}`}
            >
              <ImageIcon className="w-4 h-4 mr-2" aria-hidden="true" /> Photos
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              aria-pressed={activeTab === 'videos'}
              className={`flex items-center px-6 py-2.5 rounded-md text-sm font-bold transition-all font-display ${activeTab === 'videos' ? 'bg-primary text-white shadow-sm' : 'text-content-secondary hover:text-content hover:bg-surface-overlay'}`}
            >
              <Play className="w-4 h-4 mr-2" aria-hidden="true" /> Videos
            </button>
          </div>
        </nav>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'photos' ? (
            <motion.div
              key="photos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              role="region"
              aria-label="Photos"
            >
              {photos.map((photo, index) => (
                <figure 
                  key={index} 
                  className="relative group rounded-2xl overflow-hidden cursor-pointer aspect-video bg-surface border border-line shadow-e1 hover:shadow-e2 transition-all duration-fast m-0"
                  onClick={() => setSelectedImage(photo)}
                >
                  <img src={photo} alt={`Gallery Image ${index + 1}`} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" aria-hidden="true" />
                </figure>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-8"
              role="region"
              aria-label="Videos"
            >
              {videos.map((video, index) => (
                <article key={index} className="group cursor-pointer bg-surface border border-line rounded-2xl overflow-hidden shadow-e1 hover:shadow-e2 transition-all duration-fast p-3">
                  <figure className="relative rounded-xl overflow-hidden aspect-video bg-surface-raised mb-3 m-0">
                    <img src={video.thumbnail} alt={`Thumbnail for ${video.title}`} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center" aria-hidden="true">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/35 rounded-full flex items-center justify-center text-white group-hover:bg-white/35 group-hover:scale-105 transition-all duration-medium">
                        <Play className="w-8 h-8 ml-1" />
                      </div>
                    </div>
                  </figure>
                  <h3 className="text-lg font-black text-content font-display px-1">{video.title}</h3>
                </article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.dialog
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 m-0 max-w-none w-full h-full border-none"
            onClick={() => setSelectedImage(null)}
            open
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors focus:ring-2 focus:ring-white outline-none z-10"
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
            <figure className="max-w-full max-h-full m-0 flex items-center justify-center">
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                src={selectedImage}
                alt="Expanded view"
                className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </figure>
          </motion.dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
