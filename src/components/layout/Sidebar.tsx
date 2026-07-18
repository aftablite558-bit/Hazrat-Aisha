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
      { name: 'Notices', href: '#', icon: MessageSquare }, // Admin page not yet implemented
      { name: 'Gallery', href: '#', icon: Image }, // Admin page not yet implemented
      { name: 'Downloads', href: '#', icon: Download }, // Admin page not yet implemented
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
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-surface dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 md:static md:translate-x-0 shadow-premium",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark relative z-10">
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
            {navigationGroups.map((group) => {
              const isCollapsed = collapsedGroups[group.name];
              return (
                <div key={group.name} className="space-y-1">
                  <button
                    onClick={() => toggleGroup(group.name)}
                    className="flex w-full items-center justify-between px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
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
                          console.log("Sidebar NavLink:", item.name, item.href);
                          const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
                          return (
                            <NavLink
                              key={item.name}
                              to={item.href}
                              onClick={() => setIsOpen(false)}
                              className="relative group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                            >
                              {isActive && (
                                <motion.div
                                  layoutId="active-sidebar-item"
                                  className="absolute inset-0 rounded-lg bg-primary-50 dark:bg-primary-900/20"
                                  initial={false}
                                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                              )}
                              <item.icon
                                className={cn(
                                  "relative z-10 mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200",
                                  isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'
                                )}
                                aria-hidden="true"
                              />
                              <span className={cn(
                                "relative z-10",
                                isActive ? "text-primary-700 dark:text-primary-300" : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
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
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-1 bg-surface dark:bg-surface-dark relative z-10">
          {(() => {
            const isSettingsActive = location.pathname === '/dashboard/settings' || location.pathname.startsWith('/dashboard/settings/');
            return (
              <NavLink
                to="/dashboard/settings"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative",
                  isSettingsActive ? "text-primary-700 dark:text-primary-300 font-bold" : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                {isSettingsActive && (
                  <motion.div
                    layoutId="active-sidebar-item"
                    className="absolute inset-0 rounded-lg bg-primary-50 dark:bg-primary-900/20"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Settings className={cn(
                  "relative z-10 mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200",
                  isSettingsActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'
                )} />
                <span className="relative z-10">Settings</span>
              </NavLink>
            );
          })()}
          <button
            onClick={handleLogout}
            className="w-full group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
            <span>Logout</span>
          </button>

          <div className="mt-4 flex items-center gap-3 rounded-xl p-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold shadow-sm">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col flex-1 truncate">
              <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
                {user?.displayName || 'User'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize font-medium">
                {user?.role || 'Guest'}
              </span>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
