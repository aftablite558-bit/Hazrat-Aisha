import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Search, Home, Users, GraduationCap, Calendar, CreditCard, FileCheck, BookOpen, MessageSquare, Settings, Image, Download, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const commands = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, category: 'Pages' },
  { name: 'Admissions', href: '/dashboard/admissions', icon: GraduationCap, category: 'Pages' },
  { name: 'Students', href: '/dashboard/students', icon: Users, category: 'Pages' },
  { name: 'Teachers', href: '/dashboard/staff', icon: Users, category: 'Pages' },
  { name: 'Attendance', href: '/dashboard/attendance', icon: Calendar, category: 'Pages' },
  { name: 'Fees', href: '/dashboard/fees', icon: CreditCard, category: 'Pages' },
  { name: 'Examinations', href: '/dashboard/exams', icon: FileCheck, category: 'Pages' },
  { name: 'Results', href: '/dashboard/exams', icon: BookOpen, category: 'Pages' },
  { name: 'Gallery', href: '#', icon: Image, category: 'Pages' },
  { name: 'Notices', href: '#', icon: MessageSquare, category: 'Pages' },
  { name: 'Downloads', href: '#', icon: Download, category: 'Pages' },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, category: 'Pages' },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [onOpenChange]);

  const filteredCommands = query === ''
    ? commands
    : commands.filter((command) =>
        command.name.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (href: string) => {
    navigate(href);
    onOpenChange(false);
    setQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-premium">
        <div className="flex items-center border-b border-gray-200 dark:border-gray-800 px-3">
          <Search className="mr-2 h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" />
          <input
            className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900 dark:text-gray-100"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <p className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              No results found.
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {filteredCommands.map((command) => (
                <button
                  key={command.name}
                  onClick={() => handleSelect(command.href)}
                  className={cn(
                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-3 text-sm outline-none w-full text-left",
                    "text-gray-700 dark:text-gray-300",
                    "hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors"
                  )}
                >
                  <command.icon className="mr-2 h-4 w-4" />
                  <span>{command.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
