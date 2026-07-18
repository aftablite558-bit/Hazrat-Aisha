const fs = require('fs');

const publicLayoutContent = `import React, { useState, useEffect } from 'react';
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
                    className={\`py-4 px-2 text-center rounded-xl border border-line/50 font-display text-[11px] md:text-[13px] font-bold tracking-[0.15em] uppercase transition-all
                      \${location.pathname === link.path || (link.name === 'CAREERS') ? 'bg-primary/10 text-primary border-primary/30' : 'bg-[var(--bg-surface)] text-content-secondary hover:text-primary hover:border-primary/30'}\`}
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
                <button className="px-5 md:px-8 py-3 bg-primary text-[var(--bg-page)] font-bold text-xs md:text-sm tracking-wider">English</button>
                <button className="px-5 md:px-8 py-3 text-content-secondary hover:text-primary font-bold text-xs md:text-sm tracking-wider border-l border-line">हिन्दी</button>
                <button className="px-5 md:px-8 py-3 text-content-secondary hover:text-primary font-bold text-xs md:text-sm tracking-wider border-l border-line" dir="rtl">اردو</button>
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
`;
fs.writeFileSync('src/pages/public/PublicLayout.tsx', publicLayoutContent);

const homeContent = `import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { SEO } from '../../components/seo/SEO';
import { 
  UserPlus, 
  Bell, 
  Image as ImageIcon, 
  Calendar, 
  Award, 
  BookOpen, 
  Phone 
} from 'lucide-react';

const RubElHizb = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" transform="rotate(45 12 12)" />
    <rect x="4" y="4" width="16" height="16" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

export function Home() {
  const navigate = useNavigate();

  const menuItems = [
    { title: 'ADMISSIONS', icon: UserPlus, path: '/admissions-info' },
    { title: 'NOTICE BOARD', icon: Bell, path: '/notices' },
    { title: 'GALLERY', icon: ImageIcon, path: '/gallery' },
    { title: 'CALENDAR', icon: Calendar, path: '/academics' },
    { title: 'RESULTS', icon: Award, path: '/results' },
    { title: 'HOMEWORK', icon: BookOpen, path: '/portal' },
    { title: 'CONTACT', icon: Phone, path: '/contact' },
  ];

  return (
    <div className="bg-[var(--bg-page)] min-h-[calc(100vh-80px)] font-body flex justify-center relative overflow-hidden">
      <SEO title="Home" description="Hazrat Aisha Academy Dashboard" />
      
      {/* Decorative Background Geometry */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-30%] left-[-20%] w-[140%] md:w-[80%] h-[140%] md:h-[120%] border border-line/40 rounded-[100%] opacity-50" />
         <div className="absolute top-[10%] left-[10%] w-[80%] md:w-[60%] h-[80%] md:h-[100%] border border-line/30 rounded-[100%] opacity-30" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center lg:items-start z-10 relative">
        
        {/* Left Side: Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center lg:items-center text-center w-full lg:w-1/2 shrink-0 lg:sticky lg:top-24"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-primary/30 bg-[var(--bg-surface)] shadow-sm flex items-center justify-center mb-8 text-primary">
            <RubElHizb className="w-10 h-10 md:w-12 md:h-12" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-content tracking-tight leading-[1.1] mb-6">
            Hazrat Aisha<br/>Academy
          </h1>

          <p className="text-content-secondary text-[11px] md:text-[13px] tracking-[0.2em] uppercase mb-10 max-w-sm md:max-w-md font-medium leading-relaxed">
            Cultivating Character, Knowledge, and Faith
          </p>

          <div className="mb-12">
            <p className="text-2xl md:text-3xl lg:text-4xl text-content font-display mb-4" dir="rtl">رَبِّ زِدْنِي عِلْمًا</p>
            <p className="text-[9px] md:text-[11px] text-content-secondary tracking-[0.2em] uppercase">"O my Lord, increase me in knowledge"</p>
          </div>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 justify-center">
            <button 
              onClick={() => navigate('/admissions-info')} 
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--bg-page)] font-bold py-4 px-8 rounded-2xl transition-colors flex items-center justify-center gap-2 tracking-wide font-display text-sm md:text-base"
            >
              Apply for Admission <span className="text-xl leading-none">→</span>
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="border border-line hover:border-primary text-content bg-[var(--bg-surface)] font-bold py-4 px-8 rounded-2xl transition-colors tracking-wide font-display text-sm md:text-base"
            >
              Our Philosophy
            </button>
          </div>
        </motion.div>

        {/* Right Side: Navigation Grid */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="grid grid-cols-2 gap-4 md:gap-5 w-full max-w-lg lg:max-w-xl">
            {menuItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 + 0.3, duration: 0.4 }}
                onClick={() => navigate(item.path)}
                className={\`
                  \${index === menuItems.length - 1 && menuItems.length % 2 !== 0 ? 'col-span-2' : 'col-span-1'}
                  bg-[var(--bg-surface)] border border-line rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center justify-center p-6 md:p-8 cursor-pointer shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 group
                \`}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 md:mb-5 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-5 h-5 md:w-7 md:h-7 text-primary" strokeWidth={2} />
                </div>
                <h3 className="font-display font-bold text-content text-[10px] md:text-[12px] tracking-[0.15em] uppercase text-center">
                  {item.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/pages/public/Home.tsx', homeContent);

console.log("Applied responsive optimizations to Home and PublicLayout");
