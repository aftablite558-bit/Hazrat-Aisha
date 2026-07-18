import React from 'react';
import { Menu, Bell, Search, Sun, Moon, Globe, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLocation, Link } from 'react-router';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';
import { cn } from '../../lib/utils';

interface TopbarProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
}

export function Topbar({ onMenuClick, onSearchClick }: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    if (paths.length === 0) return null;
    
    return (
      <nav className="hidden sm:flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-2">
          {paths.map((path, index) => {
            const isLast = index === paths.length - 1;
            const href = `/${paths.slice(0, index + 1).join('/')}`;
            
            return (
              <li key={path}>
                <div className="flex items-center">
                  {index > 0 && <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-600 mr-2" aria-hidden="true" />}
                  <Link
                    to={href}
                    className={cn(
                      "text-sm font-medium transition-colors capitalize",
                      isLast ? "text-gray-900 dark:text-gray-100 cursor-default pointer-events-none" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    )}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {path.replace(/-/g, ' ')}
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    );
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-800 bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 transition-colors">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-200 md:hidden hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator for mobile */}
      <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 md:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
        <div className="flex-1 flex items-center gap-4">
          {generateBreadcrumbs()}
          
          <button 
            onClick={onSearchClick}
            className="flex sm:ml-auto md:w-80 items-center gap-2 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/50 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors border border-transparent dark:border-gray-800 group"
          >
            <Search className="h-4 w-4 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
            <span>Search...</span>
            <kbd className="ml-auto hidden sm:inline-flex items-center gap-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-1.5 font-mono text-[10px] font-medium text-gray-500 dark:text-gray-400">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-x-3 lg:gap-x-5">
          {/* Language Switcher Placeholder */}
          <button
            type="button"
            className="hidden sm:flex relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Language"
          >
            <span className="sr-only">Toggle Language</span>
            <Globe className="h-5 w-5" aria-hidden="true" />
          </button>

          
          
          <button
            type="button"
            className="relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Notifications"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-950 shadow-sm" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-gray-800" aria-hidden="true" />

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center focus:outline-none rounded-full ring-2 ring-transparent hover:ring-primary-500/30 transition-all">
                <span className="sr-only">Open user menu</span>
                <Avatar className="h-8 w-8 shadow-sm">
                  <AvatarFallback className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium">
                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Preferences
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-900/20 dark:text-red-400 dark:focus:text-red-400">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
