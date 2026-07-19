import { TrendingUp, TrendingDown, DollarSign, Users, Activity, CreditCard } from 'lucide-react';
import { cn } from '../utils/cn';

const stats = [
  {
    label: 'Total Revenue',
    value: '$48,294',
    change: '+12.5%',
    positive: true,
    icon: DollarSign,
    color: 'from-cyan-400 to-blue-500',
    shadow: 'shadow-blue-500/20'
  },
  {
    label: 'Active Users',
    value: '12,492',
    change: '+5.2%',
    positive: true,
    icon: Users,
    color: 'from-fuchsia-400 to-purple-600',
    shadow: 'shadow-purple-500/20'
  },
  {
    label: 'Engagement Rate',
    value: '42.8%',
    change: '-2.1%',
    positive: false,
    icon: Activity,
    color: 'from-amber-400 to-orange-500',
    shadow: 'shadow-orange-500/20'
  },
  {
    label: 'Total Spends',
    value: '$14,230',
    change: '+8.4%',
    positive: true,
    icon: CreditCard,
    color: 'from-emerald-400 to-teal-500',
    shadow: 'shadow-teal-500/20'
  }
];

export function Stats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="glass-panel p-6 group">
          <div className="flex justify-between items-start mb-4">
            <div className={cn("p-3 rounded-2xl bg-gradient-to-br text-white shadow-lg", stat.color, stat.shadow)}>
              <stat.icon size={22} className="group-hover:scale-110 transition-transform" />
            </div>
            <div className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md",
              stat.positive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            )}>
              {stat.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {stat.change}
            </div>
          </div>
          
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
