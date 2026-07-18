import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Menu, X, Sun, Moon, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';

const RubElHizb = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" transform="rotate(45 12 12)" />
    <rect x="4" y="4" width="16" height="16" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

const fullNavLinks = [
  { name: 'HOME', path: '/' },
  { name: 'ABOUT', path: '/about' },
  { name: 'ADMISSIONS', path: '/admissions-info' },
  { name: 'ACADEMICS', path: '/academics' },
  { name: 'FACILITIES', path: '/' },
  { name: 'GALLERY', path: '/gallery' },
  { name: 'NOTICE BOARD', path: '/notices' },
  { name: 'ACADEMIC CALENDAR', path: '/academics' },
  { name: 'ACHIEVEMENTS', path: '/' },
  { name: 'FEEDBACK', path: '/' },
  { name: 'RESULTS', path: '/results' },
  { name: 'ATTENDANCE', path: '/portal' },
  { name: 'HOMEWORK', path: '/portal' },
  { name: 'ALUMNI', path: '/' },
  { name: 'CAREERS', path: '/' },
  { name: 'DASHBOARD', path: '/dashboard' },
  { name: 'FAQ', path: '/' },
  { name: 'CONTACT', path: '/contact' }
];

export function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLang, setActiveLang] = useState('en');
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const isLinkActive = (path: string, name: string) => {
    if (path === '/') {
      return location.pathname === '/' && name === 'HOME';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen w-full flex flex-col font-body bg-[var(--bg-page)] text-content selection:bg-primary/25 selection:text-primary relative">
      
      <header className="sticky top-0 z-40 bg-[var(--bg-page)]/95 backdrop-blur-md border-b border-line/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            <Link to="/" className="flex items-center gap-3 md:gap-4 group">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-primary/30 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform bg-[var(--bg-surface)]">
                <RubElHizb className="w-7 h-7 md:w-8 md:h-8 text-primary" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-display font-bold text-content text-[15px] md:text-[20px] tracking-widest leading-tight uppercase">Hazrat Aisha</span>
                <span className="font-display font-bold text-content text-[15px] md:text-[20px] tracking-widest leading-tight uppercase">Academy</span>
                <span className="text-[8px] md:text-[10px] text-content-secondary tracking-[0.2em] uppercase mt-0.5">Chak Rajopatti • Sitamarhi</span>
              </div>
            </Link>

            <div className="flex items-center">
              <button 
                className="p-2 md:p-3 -mr-2 rounded-full hover:bg-[var(--bg-surface-raised)] text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-7 h-7 md:w-8 md:h-8" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[var(--bg-page)] flex flex-col"
          >
            <div className="flex justify-end p-6 md:px-8 lg:px-12">
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-12 h-12 rounded-full border border-line flex items-center justify-center text-content hover:bg-[var(--bg-surface-raised)] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-32 w-full max-w-7xl mx-auto flex flex-col justify-center items-center">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 w-full">
                {fullNavLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    className={`py-4 px-2 text-center rounded-xl border border-line/50 font-display text-[11px] md:text-[13px] font-bold tracking-[0.15em] uppercase transition-all
                      ${isLinkActive(link.path, link.name) ? 'bg-primary/10 text-primary border-primary/30' : 'bg-[var(--bg-surface)] text-content-secondary hover:text-primary hover:border-primary/30'}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--bg-page)] via-[var(--bg-page)] to-transparent p-6 flex justify-center items-center gap-4">
              <button
                onClick={() => setTheme(theme === 'daylight' ? 'obsidian' : 'daylight')}
                className="w-12 h-12 shrink-0 rounded-2xl border border-line bg-[var(--bg-surface)] flex items-center justify-center text-content-secondary hover:text-primary transition-colors shadow-sm"
              >
                {theme === 'daylight' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <div className="flex bg-[var(--bg-surface)] border border-line rounded-2xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setActiveLang('en')}
                  className={`px-5 md:px-8 py-3 font-bold text-xs md:text-sm tracking-wider transition-colors ${activeLang === 'en' ? 'bg-primary text-[var(--bg-page)]' : 'text-content-secondary hover:text-primary'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => setActiveLang('hi')}
                  className={`px-5 md:px-8 py-3 font-bold text-xs md:text-sm tracking-wider border-l border-line transition-colors ${activeLang === 'hi' ? 'bg-primary text-[var(--bg-page)] border-l-primary' : 'text-content-secondary hover:text-primary'}`}
                >
                  हिन्दी
                </button>
                <button 
                  onClick={() => setActiveLang('ur')}
                  className={`px-5 md:px-8 py-3 font-bold text-xs md:text-sm tracking-wider border-l border-line transition-colors ${activeLang === 'ur' ? 'bg-primary text-[var(--bg-page)] border-l-primary' : 'text-content-secondary hover:text-primary'}`}
                  dir="rtl"
                >
                  اردو
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full flex-1 min-w-0">
        <Outlet />
      </main>

      <a 
        href="https://wa.me/919470818538" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 right-6 z-30 w-14 h-14 bg-gradient-to-tr from-[#B8912F] to-[#D4AF37] rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
}
