import { useState } from 'react';
import { Search, Bell, Menu, X } from 'lucide-react';
import { cn } from '../utils/cn';

const notifications = [
  { id: 1, text: 'Your weekly report is ready to view.', time: '5m ago' },
  { id: 2, text: 'New user signed up: Priya Sharma.', time: '1h ago' },
  { id: 3, text: 'Server backup completed successfully.', time: '3h ago' },
];

interface HeaderProps {
  className?: string;
  onMenuClick?: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function Header({ className, onMenuClick, searchQuery, onSearchChange }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className={cn("glass-panel flex items-center justify-between px-6 py-4 relative", className)}>
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="relative group hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search anything..."
            className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-9 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all w-64 group-focus-within:w-80 group-focus-within:bg-white/10"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative">
          <button
            onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
            className="relative p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 glass-panel !rounded-2xl p-3 z-50 border border-white/10">
              <p className="text-sm font-semibold text-white px-2 pb-2">Notifications</p>
              <div className="flex flex-col gap-1">
                {notifications.map((n) => (
                  <div key={n.id} className="px-2 py-2 rounded-xl hover:bg-white/5 transition-colors">
                    <p className="text-sm text-slate-200">{n.text}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium text-white">Alex Morgan</span>
            <span className="text-xs text-slate-400">Pro Plan</span>
          </div>
          <button
            onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
            className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 to-fuchsia-500 cursor-pointer hover:scale-105 transition-transform"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
              alt="Profile"
              className="w-full h-full rounded-full border-2 border-[#0f172a] object-cover"
            />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 glass-panel !rounded-2xl p-2 z-50 border border-white/10">
              <button className="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-200 hover:bg-white/10 transition-colors">
                My Profile
              </button>
              <button className="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-200 hover:bg-white/10 transition-colors">
                Account Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
