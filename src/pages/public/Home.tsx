import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { SEO } from '../../components/seo/SEO';
import { IslamicLogo } from '../../components/ui/IslamicLogo';
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

const PARTICLES = [
  { top: "12%", left: "15%", size: 4, delay: 0.2, duration: 6 },
  { top: "25%", left: "82%", size: 3, delay: 1.8, duration: 8 },
  { top: "48%", left: "10%", size: 5, delay: 0.5, duration: 7 },
  { top: "65%", left: "75%", size: 3, delay: 3.1, duration: 9 },
  { top: "80%", left: "28%", size: 4, delay: 2.2, duration: 8 },
  { top: "15%", left: "60%", size: 3, delay: 4.0, duration: 10 },
  { top: "72%", left: "18%", size: 5, delay: 1.2, duration: 7 },
  { top: "85%", left: "88%", size: 4, delay: 2.7, duration: 9 },
  { top: "35%", left: "50%", size: 3, delay: 3.6, duration: 8 },
  { top: "55%", left: "92%", size: 4, delay: 0.9, duration: 7 }
];

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
    <div className="bg-transparent min-h-[calc(100vh-80px)] font-body flex justify-center relative overflow-hidden">
      <SEO title="Home" description="Hazrat Aisha Academy Dashboard" />
      
      {/* Live Animated Background with Floating Glow Blobs and Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Soft Animated Glowing Blobs - Optimized to use smooth opacity breathe transitions which are extremely lightweight */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ willChange: "opacity" }}
          className="absolute top-[10%] left-[15%] w-72 h-72 md:w-96 md:h-96 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-[80px] md:blur-[120px]"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ willChange: "opacity" }}
          className="absolute bottom-[20%] right-[10%] w-80 h-80 md:w-[450px] md:h-[450px] rounded-full bg-amber-500/10 dark:bg-amber-500/5 blur-[90px] md:blur-[140px]"
        />
        <motion.div
          animate={{
            opacity: [0.25, 0.55, 0.25],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ willChange: "opacity" }}
          className="absolute top-[40%] right-[30%] w-64 h-64 md:w-80 md:h-80 rounded-full bg-sky-500/10 dark:bg-sky-500/5 blur-[70px] md:blur-[100px]"
        />

        {/* Gentle Twinkling & Floating Tiny Stars/Particles - Static rendering to avoid layout thrashing and Math.random() recalculations */}
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/20 dark:bg-primary/40"
            style={{
              width: p.size,
              height: p.size,
              top: p.top,
              left: p.left,
              willChange: "opacity",
            }}
            animate={{
              opacity: [0.15, 0.7, 0.15],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center lg:items-start z-10 relative">
        
        {/* Left Side: Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center lg:items-center text-center w-full lg:w-1/2 shrink-0"
        >
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border border-white/40 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex items-center justify-center mb-8 hover:scale-105 transition-transform duration-500">
            <IslamicLogo size="custom" className="w-20 h-20 md:w-24 md:h-24" />
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
              className="relative bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl border border-white/40 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-950/60 text-content font-bold py-4 px-8 rounded-2xl transition-all shadow-[0_8px_32px_rgba(0,0,0,0.04)] tracking-wide font-display text-sm md:text-base"
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
                  bg-white/40 dark:bg-black/20 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-[2rem] flex flex-col items-center justify-center p-6 md:p-8 cursor-pointer shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] hover:shadow-[0_16px_48px_0_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:border-white/60 hover:bg-white/60 dark:hover:border-white/20 dark:hover:bg-white/5 transition-all duration-500 group relative overflow-hidden
                `}
              >
                {/* Glossy top edge highlight for glass thickness */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/20 opacity-80" />
                <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-white/30 to-transparent dark:from-white/10 opacity-80" />
                
                {/* Subtle organic inner glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative z-10 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 dark:bg-white/5 border border-white/30 flex items-center justify-center mb-4 md:mb-5 group-hover:scale-110 transition-transform duration-500">
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
