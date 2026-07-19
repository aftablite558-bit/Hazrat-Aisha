import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Menu, X, Sun, Moon, MessageCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { IslamicLogo } from '../../components/ui/IslamicLogo';

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
  const navigate = useNavigate();
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
    <div className="min-h-screen w-full flex flex-col font-body bg-transparent text-content selection:bg-primary/25 selection:text-primary relative overflow-x-hidden">
      
      <header className="relative z-40 bg-white/40 dark:bg-[var(--bg-surface)]/40 backdrop-blur-2xl border-b border-white/40 dark:border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            <div className="flex items-center gap-4">
              {location.pathname !== '/' && (
                <button
                  onClick={() => navigate(-1)}
                  className="relative overflow-hidden w-11 h-11 rounded-[1.25rem] border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-3xl flex items-center justify-center text-primary hover:bg-white/60 dark:hover:bg-white/15 hover:border-white/50 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] hover:-translate-y-0.5 group shrink-0"
                  title="Go Back"
                >
                  <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/20 opacity-80" />
                  <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-white/30 to-transparent dark:from-white/10 opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
                </button>
              )}
              <Link to="/" className="flex items-center gap-3 md:gap-4 group">
                <div className="relative overflow-hidden w-12 h-12 md:w-14 md:h-14 rounded-[2rem] border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-3xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]">
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/20 opacity-80" />
                  <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-white/30 to-transparent dark:from-white/10 opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/5 opacity-50 pointer-events-none" />
                  <IslamicLogo size="custom" className="w-10 h-10 md:w-12 md:h-12 relative z-10" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="font-display font-bold text-content text-[15px] md:text-[20px] tracking-widest leading-tight uppercase">Hazrat Aisha</span>
                  <span className="font-display font-bold text-content text-[15px] md:text-[20px] tracking-widest leading-tight uppercase">Academy</span>
                  <span className="text-[8px] md:text-[10px] text-content-secondary tracking-[0.2em] uppercase mt-0.5">Chak Rajopatti • Sitamarhi</span>
                </div>
              </Link>
            </div>

            <div className="flex items-center">
              {/* Layout placeholder spacer to balance the flex container on load */}
              <div className="w-12 h-12 md:w-14 md:h-14 opacity-0 pointer-events-none" />
              <button 
                className="fixed top-4 right-4 sm:top-4 sm:right-6 md:top-5 md:right-8 lg:right-12 z-50 overflow-hidden w-12 h-12 md:w-14 md:h-14 rounded-[2rem] border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-3xl flex items-center justify-center text-primary hover:bg-white/20 dark:hover:bg-white/5 hover:border-white/50 transition-all duration-500 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] hover:shadow-[0_16px_48px_0_rgba(0,0,0,0.2)] hover:-translate-y-1 group"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/20 opacity-80" />
                <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-white/30 to-transparent dark:from-white/10 opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="relative z-10">
                  <Menu className="w-6 h-6 md:w-7 md:h-7" />
                </div>
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
            className="fixed inset-0 z-50 bg-white/95 dark:bg-[var(--bg-page)]/95 backdrop-blur-3xl flex flex-col"
          >
            <div className="flex justify-end p-6 md:px-8 lg:px-12">
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative overflow-hidden w-14 h-14 rounded-[2rem] border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-3xl flex items-center justify-center text-content hover:bg-white/60 dark:hover:bg-white/5 hover:border-white/50 transition-all duration-500 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] hover:shadow-[0_16px_48px_0_rgba(0,0,0,0.2)] hover:-translate-y-1 group"
              >
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/20 opacity-80" />
                <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-white/30 to-transparent dark:from-white/10 opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="relative z-10 group-hover:text-primary transition-colors">
                  <X className="w-6 h-6" />
                </div>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-32 w-full max-w-7xl mx-auto flex flex-col justify-center items-center">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 w-full">
                {fullNavLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    className={`relative overflow-hidden py-4 px-2 text-center rounded-[2rem] border font-display text-[11px] md:text-[13px] font-bold tracking-[0.15em] uppercase transition-all duration-500 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] hover:shadow-[0_16px_48px_0_rgba(0,0,0,0.2)] hover:-translate-y-1 group
                      ${isLinkActive(link.path, link.name) 
                        ? 'bg-primary/10 dark:bg-primary/20 backdrop-blur-3xl border-white/50 dark:border-white/20 text-primary' 
                        : 'bg-white/40 dark:bg-white/5 backdrop-blur-3xl border-white/40 dark:border-white/10 text-content hover:bg-white/60 dark:hover:bg-white/5 hover:border-white/50'}`}
                  >
                    {/* Glossy top edge highlight */}
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/20 opacity-80" />
                    <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-white/30 to-transparent dark:from-white/10 opacity-80" />
                    
                    {/* Subtle organic inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <span className="relative z-10">{link.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/95 via-white/40 to-transparent dark:from-[var(--bg-page)]/95 dark:via-[var(--bg-page)]/40 p-6 flex justify-center items-center gap-4">
              <button
                onClick={() => setTheme(theme === 'daylight' ? 'obsidian' : 'daylight')}
                className="relative overflow-hidden w-14 h-14 shrink-0 rounded-[2rem] border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-3xl flex items-center justify-center text-content hover:bg-white/60 dark:hover:bg-white/5 hover:border-white/50 transition-all duration-500 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] hover:shadow-[0_16px_48px_0_rgba(0,0,0,0.2)] hover:-translate-y-1 group"
              >
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/20 opacity-80" />
                <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-white/30 to-transparent dark:from-white/10 opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="relative z-10 text-content group-hover:text-primary transition-colors">
                  {theme === 'daylight' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                </div>
              </button>
              
              <div className="relative overflow-hidden flex rounded-[2rem] border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] group">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/20 opacity-80" />
                <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-white/30 to-transparent dark:from-white/10 opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/5 opacity-50 pointer-events-none" />
                
                <button 
                  onClick={() => setActiveLang('en')}
                  className={`relative z-10 px-5 md:px-8 py-4 font-bold text-xs md:text-sm tracking-wider transition-colors ${activeLang === 'en' ? 'bg-primary/20 text-primary' : 'text-content hover:bg-white/10 dark:hover:bg-white/5 hover:text-primary'}`}
                >
                  English
                </button>
                <div className="relative z-10 w-px bg-white/20 dark:bg-white/10" />
                <button 
                  onClick={() => setActiveLang('hi')}
                  className={`relative z-10 px-5 md:px-8 py-4 font-bold text-xs md:text-sm tracking-wider transition-colors ${activeLang === 'hi' ? 'bg-primary/20 text-primary' : 'text-content hover:bg-white/10 dark:hover:bg-white/5 hover:text-primary'}`}
                >
                  हिन्दी
                </button>
                <div className="relative z-10 w-px bg-white/20 dark:bg-white/10" />
                <button 
                  onClick={() => setActiveLang('ur')}
                  className={`relative z-10 px-5 md:px-8 py-4 font-bold text-xs md:text-sm tracking-wider transition-colors ${activeLang === 'ur' ? 'bg-primary/20 text-primary' : 'text-content hover:bg-white/10 dark:hover:bg-white/5 hover:text-primary'}`}
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
        className="fixed bottom-6 right-6 z-30 overflow-hidden w-14 h-14 rounded-[2rem] border border-[#25D366]/50 bg-[#25D366]/90 backdrop-blur-3xl flex items-center justify-center text-white hover:bg-[#25D366] hover:border-[#25D366]/80 transition-all duration-500 shadow-[0_8px_32px_0_rgba(37,211,102,0.25)] hover:shadow-[0_16px_48px_0_rgba(37,211,102,0.45)] hover:-translate-y-1 group"
        aria-label="Chat on WhatsApp"
      >
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-80" />
        <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-white/40 to-transparent opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        <div className="relative z-10 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </div>
      </a>
    </div>
  );
}
