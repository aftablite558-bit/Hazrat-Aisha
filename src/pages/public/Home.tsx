import React from 'react';
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
                className={`
                  ${index === menuItems.length - 1 && menuItems.length % 2 !== 0 ? 'col-span-2' : 'col-span-1'}
                  bg-[var(--bg-surface)] border border-line rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center justify-center p-6 md:p-8 cursor-pointer shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 group
                `}
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
