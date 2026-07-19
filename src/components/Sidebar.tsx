import { Home, BarChart2, PieChart, Users, Settings, LogOut, Hexagon } from 'lucide-react';
import { cn } from '../utils/cn';

const navItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'analytics', icon: BarChart2, label: 'Analytics' },
  { id: 'reports', icon: PieChart, label: 'Reports' },
  { id: 'audience', icon: Users, label: 'Audience' },
];

interface SidebarProps {
  className?: string;
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export function Sidebar({ className, activeView, onNavigate, onOpenSettings, onLogout }: SidebarProps) {
  return (
    <aside className={cn("glass-panel flex flex-col justify-between py-8 px-6", className)}>
      <div>
        <div className="flex items-center gap-3 px-2 mb-12">
          <div className="bg-gradient-to-tr from-cyan-400 to-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
            <Hexagon size={24} className="animate-[spin_10s_linear_infinite]" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-200 to-blue-200">
            LiquidUI
          </span>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden text-left",
                  active
                    ? "text-white bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-50 pointer-events-none" />
                )}
                <item.icon size={20} className={cn("transition-transform group-hover:scale-110", active ? "text-cyan-400" : "")} />
                <span className="font-medium relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-2 border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={onOpenSettings}
          className={cn(
            "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group text-left",
            activeView === 'settings' ? "text-white bg-white/10" : "text-slate-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Settings size={20} className="transition-transform group-hover:rotate-90" />
          <span className="font-medium">Settings</span>
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 group text-left"
        >
          <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
