import React from 'react';
import { Outlet } from 'react-router';
import { GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router';

export function AuthLayout() {
  const location = useLocation();

  return (
    <main className="min-h-screen w-full bg-transparent relative overflow-y-auto overflow-x-hidden transition-colors duration-300 flex flex-col justify-center p-4">
      {/* Background decoration - absolute positioned, isolated from the flex layouts to avoid browser layout engine bugs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px] pointer-events-none z-0" />

      {/* Centering and sizing container - explicitly set to 100% width, max-w-7xl, and forced min-width to prevent squashing */}
      <div className="w-full max-w-7xl mx-auto relative z-10 space-y-6">
        
        {/* Branding section at the top */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full flex flex-col items-center justify-center text-center font-display"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-[2rem] bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/30 text-[#04120D] dark:text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] mb-4 shrink-0 self-center relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/20 opacity-80" />
            <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-white/30 to-transparent dark:from-white/10 opacity-80" />
            <GraduationCap className="h-7 w-7 text-primary relative z-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-content px-2 ">
            Hazrat Aisha Academy
          </h2>
          <p className="text-sm font-body text-content-secondary mt-2 font-medium tracking-wide px-2 ">
            Premium Islamic School Platform
          </p>
        </motion.div>
        
        {/* Form container */}
        <div className="w-full rounded-[2rem] bg-white/10 dark:bg-black/20 backdrop-blur-3xl border border-white/30 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] overflow-hidden relative">
          {/* Glossy top edge highlight for glass thickness */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/20 opacity-80" />
          <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-white/30 to-transparent dark:from-white/10 opacity-80" />
          
          {/* Subtle organic inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/5 opacity-50 pointer-events-none" />

          <div className="p-6 sm:p-8 w-full relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </main>
  );
}
