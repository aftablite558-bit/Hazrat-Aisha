import React from 'react';
import { Outlet } from 'react-router';
import { GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router';

export function AuthLayout() {
  const location = useLocation();

  return (
    <main className="min-h-screen w-full bg-surface-page relative overflow-y-auto overflow-x-hidden transition-colors duration-300 flex flex-col justify-center p-4">
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
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-[#04120D] shadow-glow mb-4 shrink-0 self-center">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-content px-2 ">
            Hazrat Aisha Academy
          </h2>
          <p className="text-sm font-body text-content-secondary mt-2 font-medium tracking-wide px-2 ">
            Premium Islamic School Platform
          </p>
        </motion.div>
        
        {/* Form container */}
        <div className="w-full glass-panel rounded-2xl shadow-e3 overflow-hidden border border-line bg-surface/40">
          <div className="p-6 sm:p-8 w-full">
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
