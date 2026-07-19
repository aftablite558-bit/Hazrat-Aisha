import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Search, FileText, Download, Calendar, Pin } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { SEO } from '../../../components/seo/SEO';
import { EmptyState } from '../../../components/ui/empty-state';
import { Card } from '../../../components/ui/card';

export function Notices() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Academic', 'Events', 'Admissions', 'General'];

  const notices = [
    {
      id: 1,
      title: 'Summer Vacation Circular 2026',
      date: 'July 10, 2026',
      category: 'Academic',
      pinned: true,
      desc: 'Important guidelines and dates regarding the upcoming summer vacation and holiday homework.',
      fileSize: '1.2 MB'
    },
    {
      id: 2,
      title: 'Admissions Open for 2026-27',
      date: 'July 05, 2026',
      category: 'Admissions',
      pinned: true,
      desc: 'Application forms are now available online. Last date for submission is August 15, 2026.',
      fileSize: '850 KB'
    },
    {
      id: 3,
      title: 'Annual Sports Meet Schedule',
      date: 'June 28, 2026',
      category: 'Events',
      pinned: false,
      desc: 'Detailed schedule for the upcoming inter-house sports competitions.',
      fileSize: '2.4 MB'
    },
    {
      id: 4,
      title: 'Revised Fee Structure Notification',
      date: 'June 15, 2026',
      category: 'General',
      pinned: false,
      desc: 'Notice regarding the minor revisions in the transport fee structure for the new session.',
      fileSize: '500 KB'
    }
  ];

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || notice.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || notice.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full bg-transparent min-h-screen pb-24 font-body">
      <SEO title="Notices & Events" description="Stay updated with the latest announcements, circulars, and events from Hazrat Aisha Academy." />
      
      {/* Header */}
      <header className="public-page-header">
        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 font-display tracking-tight">Notice Board</h1>
        <p className="text-white/80 font-semibold max-w-2xl mx-auto text-xs sm:text-base mb-6">Stay updated with the latest announcements, circulars, and events.</p>

        {/* Page Heading Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md">
            <span>← Back to Home</span>
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:-translate-y-0.5">
            <span>Contact Office</span>
          </Link>
        </div>
      </header>

      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12" aria-label="Notices and Announcements">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-10">
          <Card className="flex flex-wrap gap-1 p-1 w-full md:w-auto rounded-[2rem] bg-white/10" aria-label="Category Filter">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={`px-6 py-2.5 rounded-[1.75rem] text-sm font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat 
                  ? 'bg-primary text-white shadow-md font-display' 
                  : 'text-content hover:text-primary hover:bg-white/10 dark:hover:bg-white/5 font-display'
                }`}
              >
                {cat}
              </button>
            ))}
          </Card>

          <div className="relative w-full md:w-72 shrink-0">
            <label htmlFor="searchNotices" className="sr-only">Search notices</label>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-content-tertiary" aria-hidden="true" />
            <input
              id="searchNotices"
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-white/20 rounded-[2rem] bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-white/40 focus:bg-black/40 placeholder:text-content-tertiary/50"
            />
          </div>
        </div>

        {/* List */}
        <div className="w-full flex flex-col gap-4">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice, index) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="w-full block"
              >
                <Card
                  className={`w-full p-5 md:p-6 m-0 flex flex-col md:flex-row gap-4 md:gap-6 justify-between items-stretch md:items-center transition-transform hover:-translate-y-1
                    ${notice.pinned ? 'border-l-4 border-l-primary/60 bg-white/20 dark:bg-white/10' : ''}`}
                >
                  <div className="w-full md:flex-1 space-y-2 sm:space-y-3 relative z-10">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      {notice.pinned && (
                        <span className="flex items-center text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md uppercase tracking-wider" title="Pinned Notice">
                          <Pin className="w-3.5 h-3.5 mr-1" aria-hidden="true" /> Pinned
                        </span>
                      )}
                      <span className="text-xs font-semibold text-content-tertiary flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" /> <time>{notice.date}</time>
                      </span>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {notice.category}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-content font-display tracking-tight">{notice.title}</h2>
                    <p className="text-sm text-content-secondary font-medium leading-relaxed mt-1 sm:mt-2">{notice.desc}</p>
                  </div>
                  <div className="shrink-0 pt-2 md:pt-0 w-full md:w-auto relative z-10">
                    <Button variant="secondary" className="w-full md:w-auto flex items-center justify-center gap-2 border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-content font-bold font-display" aria-label={`Download PDF for ${notice.title}`}>
                      <Download className="w-4 h-4" aria-hidden="true" />
                      <span>Download PDF</span>
                      <span className="text-xs text-content-secondary font-bold ml-1">({notice.fileSize})</span>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <EmptyState 
              icon={FileText} 
              title="No notices found" 
              description="Try adjusting your search or filter criteria." 
              className="py-20"
            />
          )}
        </div>
      </section>
    </div>
  );
}
