import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { ToastContainer } from '../ui/toast-container';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from './CommandPalette';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-surface-page text-content font-sans antialiased transition-colors duration-300">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-primary)] focus:text-[var(--bg-page)] focus:font-bold focus:rounded-[var(--radius-md)] focus:shadow-e3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all"
      >
        Skip to main content
      </a>

      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex w-0 flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} onSearchClick={() => setCommandPaletteOpen(true)} />
        
        <main id="main-content" tabIndex={-1} className="relative flex-1 overflow-y-auto focus:outline-none scrollbar-none">
          <div className="container mx-auto p-4 md:p-8 max-w-7xl h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      
      <ToastContainer />
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
    </div>
  );
}
