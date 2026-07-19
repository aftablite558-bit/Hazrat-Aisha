import { MoreHorizontal } from 'lucide-react';
import { cn } from '../utils/cn';

const transactions = [
  {
    id: 1,
    name: 'Spotify Premium',
    date: 'Today, 2:45 PM',
    amount: '-$12.99',
    type: 'outcome',
    logo: 'https://cdn-icons-png.flaticon.com/512/725/725281.png',
    status: 'Completed'
  },
  {
    id: 2,
    name: 'Upwork Escrow',
    date: 'Yesterday, 10:20 AM',
    amount: '+$850.00',
    type: 'income',
    logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968746.png',
    status: 'Completed'
  },
  {
    id: 3,
    name: 'AWS Web Services',
    date: 'Oct 24, 4:00 PM',
    amount: '-$64.50',
    type: 'outcome',
    logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968509.png',
    status: 'Pending'
  },
  {
    id: 4,
    name: 'Figma Subscription',
    date: 'Oct 22, 1:15 PM',
    amount: '-$15.00',
    type: 'outcome',
    logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968705.png',
    status: 'Completed'
  },
  {
    id: 5,
    name: 'Client Payment',
    date: 'Oct 20, 9:00 AM',
    amount: '+$2,400.00',
    type: 'income',
    logo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    status: 'Completed'
  }
];

export function RecentTransactions() {
  return (
    <div className="glass-panel p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
        <button
          onClick={() => window.alert('Showing all transactions (hook this up to your transactions page).')}
          className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
        >
          View All
        </button>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 p-2.5 flex items-center justify-center backdrop-blur-md border border-white/5 group-hover:border-white/20 transition-colors">
                <img src={tx.logo} alt={tx.name} className="w-full h-full object-contain filter drop-shadow-md" />
              </div>
              <div>
                <h4 className="text-white font-medium mb-0.5">{tx.name}</h4>
                <p className="text-xs text-slate-400">{tx.date}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className={cn(
                  "font-bold",
                  tx.type === 'income' ? "text-emerald-400" : "text-white"
                )}>
                  {tx.amount}
                </p>
                <p className={cn(
                  "text-xs font-medium",
                  tx.status === 'Completed' ? "text-emerald-500/70" : "text-amber-500/70"
                )}>
                  {tx.status}
                </p>
              </div>
              <button
                onClick={() => window.alert(`Options for "${tx.name}" (hook this up to a real menu).`)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
