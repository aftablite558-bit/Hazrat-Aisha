import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { 
  Home, Users, BookOpen, Calendar, MessageSquare, Settings, X,
  GraduationCap, CreditCard, FileCheck, Image, Download, LogOut, ChevronDown, ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

type NavGroup = {
  name: string;
  items: NavItem[];
};

const navigationGroups: NavGroup[] = [
  {
    name: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
    ]
  },
  {
    name: 'Administration',
    items: [
      { name: 'Admissions', href: '/dashboard/admissions', icon: GraduationCap },
      { name: 'Students', href: '/dashboard/students', icon: Users },
      { name: 'Teachers', href: '/dashboard/staff', icon: Users },
      { name: 'Attendance', href: '/dashboard/attendance', icon: Calendar },
      { name: 'Fees', href: '/dashboard/fees', icon: CreditCard },
    ]
  },
  {
    name: 'Academics',
    items: [
      { name: 'Examinations', href: '/dashboard/exams', icon: FileCheck },
      { name: 'Results', href: '/dashboard/exams', icon: BookOpen },
    ]
  },
  {
    name: 'Communication',
    items: [
      { name: 'Notices', href: '/dashboard/notices', icon: MessageSquare },
      { name: 'Gallery', href: '/dashboard/gallery', icon: Image },
      { name: 'Downloads', href: '/dashboard/downloads', icon: Download },
    ]
  }
];

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const role = user?.role?.toLowerCase();
  const filteredGroups = navigationGroups.map(group => {
    if (role === 'teacher') {
      const filteredItems = group.items.filter(item => {
        if (group.name === 'Overview') return true;
        if (group.name === 'Administration') {
          return item.name === 'Attendance';
        }
        if (group.name === 'Academics') {
          return item.name === 'Examinations' || item.name === 'Results';
        }
        if (group.name === 'Communication') {
          return true;
        }
        return false;
      });
      return { ...group, items: filteredItems };
    } else if (role === 'student') {
      const filteredItems = group.items.filter(item => {
        if (group.name === 'Overview') return true;
        if (group.name === 'Communication') {
          return true;
        }
        return false;
      });
      return { ...group, items: filteredItems };
    }
    return group;
  }).filter(group => group.items.length > 0);

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-gray-900/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar component */}
      <motion.aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white/40 dark:bg-zinc-950/40 backdrop-blur-2xl border-r border-white/40 dark:border-white/10 transition-transform duration-300 md:static md:translate-x-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-white/20 bg-white/10 dark:bg-black/10 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-md shadow-primary-500/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Hazrat Aisha</span>
          </div>
          <button
            type="button"
            className="md:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6 scrollbar-none">
          <nav className="flex-1 space-y-6">
            {filteredGroups.map((group) => {
              const isCollapsed = collapsedGroups[group.name];
              return (
                <div key={group.name} className="space-y-1">
                  <button
                    onClick={() => toggleGroup(group.name)}
                    className="flex w-full items-center justify-between px-3 py-1.5 text-xs font-bold text-emerald-800/60 dark:text-sky-200/40 uppercase tracking-[0.12em] hover:text-emerald-900 dark:hover:text-sky-100 transition-colors"
                  >
                    <span>{group.name}</span>
                    {isCollapsed ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-1 overflow-hidden"
                      >
                        {group.items.map((item) => {
                          const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
                          return (
                            <NavLink
                              key={item.name}
                              to={item.href}
                              id={`sidebar-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                              onClick={() => setIsOpen(false)}
                              className="relative group flex items-center rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-300 border border-transparent hover:border-emerald-500/10 dark:hover:border-sky-500/10"
                            >
                              {isActive && (
                                <motion.div
                                  layoutId="active-sidebar-item"
                                  className="absolute inset-0 rounded-xl bg-emerald-500/10 dark:bg-sky-500/15 border border-emerald-500/20 dark:border-sky-500/25 shadow-sm shadow-emerald-500/5 dark:shadow-sky-500/5"
                                  initial={false}
                                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                              )}
                              <item.icon
                                className={cn(
                                  "relative z-10 mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200",
                                  isActive ? 'text-emerald-600 dark:text-sky-400' : 'text-emerald-800/40 dark:text-sky-200/30 group-hover:text-emerald-700 dark:group-hover:text-sky-200'
                                )}
                                aria-hidden="true"
                              />
                              <span className={cn(
                                "relative z-10",
                                isActive ? "text-emerald-800 dark:text-sky-200 font-bold" : "text-emerald-950/70 dark:text-sky-200/70 group-hover:text-emerald-950 dark:group-hover:text-white"
                              )}>
                                {item.name}
                              </span>
                            </NavLink>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
        </div>
        
        {/* User profile / Bottom Actions */}
        <div className="border-t border-white/20 p-4 space-y-1 bg-white/10 dark:bg-black/10 backdrop-blur-md relative z-10">
          {(user?.role === 'admin' || user?.role === 'principal') && (() => {
            const isSettingsActive = location.pathname === '/dashboard/settings' || location.pathname.startsWith('/dashboard/settings/');
            return (
              <NavLink
                to="/dashboard/settings"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "group flex items-center rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-300 border border-transparent hover:border-emerald-500/10 dark:hover:border-sky-500/10 relative",
                  isSettingsActive ? "text-emerald-800 dark:text-sky-200 font-bold" : "text-emerald-950/70 dark:text-sky-200/70 hover:text-emerald-950 dark:hover:text-white"
                )}
              >
                {isSettingsActive && (
                  <motion.div
                    layoutId="active-sidebar-item"
                    className="absolute inset-0 rounded-xl bg-emerald-500/10 dark:bg-sky-500/15 border border-emerald-500/20 dark:border-sky-500/25 shadow-sm shadow-emerald-500/5 dark:shadow-sky-500/5"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Settings className={cn(
                  "relative z-10 mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200",
                  isSettingsActive ? 'text-emerald-600 dark:text-sky-400' : 'text-emerald-800/40 dark:text-sky-200/30 group-hover:text-emerald-700 dark:group-hover:text-sky-200'
                )} />
                <span className="relative z-10">Settings</span>
              </NavLink>
            );
          })()}
          <button
            onClick={handleLogout}
            className="w-full group flex items-center rounded-xl px-3.5 py-2.5 text-sm font-semibold text-emerald-950/70 dark:text-sky-200/70 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/5 dark:hover:bg-red-900/10 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-emerald-800/40 dark:text-sky-200/30 group-hover:text-red-600 dark:hover:text-red-400" />
            <span>Logout</span>
          </button>

          <div className="mt-4 flex items-center gap-3 rounded-2xl p-3 bg-white/40 dark:bg-zinc-950/40 border border-white/40 dark:border-white/10 backdrop-blur-md shadow-sm">
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 dark:bg-sky-500/10 text-emerald-700 dark:text-sky-300 border border-emerald-500/20 dark:border-sky-500/20 flex items-center justify-center font-bold shadow-sm">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col flex-1 truncate">
              <span className="text-sm font-bold text-emerald-950 dark:text-white truncate">
                {user?.displayName || 'User'}
              </span>
              <span className="text-xs text-emerald-800/60 dark:text-sky-200/40 capitalize font-medium">
                {user?.role || 'Guest'}
              </span>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
