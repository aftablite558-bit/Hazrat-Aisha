import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Stats } from './components/Stats';
import { ActivityChart } from './components/ActivityChart';
import { RecentTransactions } from './components/RecentTransactions';
import { cn } from './utils/cn';

const viewTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: "Here's what's happening with your projects today." },
  analytics: { title: 'Analytics', subtitle: 'Deep dive into your performance metrics.' },
  reports: { title: 'Reports', subtitle: 'Download and review generated reports.' },
  audience: { title: 'Audience', subtitle: 'Understand who is using your product.' },
  settings: { title: 'Settings', subtitle: 'Manage your account and preferences.' },
};

function PlaceholderPage({ view }: { view: string }) {
  const info = viewTitles[view];
  return (
    <div className="glass-panel p-10 flex flex-col items-center justify-center text-center gap-2 min-h-[300px]">
      <h2 className="text-2xl font-bold text-white">{info.title}</h2>
      <p className="text-slate-400 max-w-md">{info.subtitle}</p>
      <p className="text-slate-500 text-sm mt-2">This section is under construction — hook it up to real data whenever you're ready.</p>
    </div>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const info = viewTitles[activeView];

  const handleNavigate = (view: string) => {
    setActiveView(view);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    // Hook this up to your real auth/logout logic.
    window.alert('Logged out.');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden relative flex">
      {/* Liquid Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] bg-gradient-to-br from-purple-600/30 to-fuchsia-600/30 blur-[120px] rounded-full animate-liquid mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[35%] h-[45%] bg-gradient-to-bl from-cyan-400/30 to-blue-600/30 blur-[100px] rounded-full animate-liquid [animation-delay:2s] mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[60%] bg-gradient-to-tr from-emerald-400/20 to-teal-600/20 blur-[130px] rounded-full animate-liquid [animation-delay:4s] mix-blend-screen" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0 p-4 pl-4 lg:pl-6 py-6",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar
          className="h-full"
          activeView={activeView}
          onNavigate={handleNavigate}
          onOpenSettings={() => handleNavigate('settings')}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 z-10 h-screen overflow-hidden p-4 lg:p-6 lg:pl-2">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          className="mb-6 flex-shrink-0"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="flex-1 overflow-y-auto custom-scrollbar pb-6 pr-2">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="glass-panel p-8 bg-gradient-to-br from-white/10 to-white/5 relative overflow-hidden group">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/20 blur-3xl rounded-full group-hover:bg-cyan-400/30 transition-colors duration-700" />
              <div className="relative z-10 max-w-2xl">
                <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
                  {activeView === 'dashboard' ? (
                    <>Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Alex</span></>
                  ) : (
                    info.title
                  )}
                </h1>
                <p className="text-slate-300 text-lg">{info.subtitle}</p>
              </div>
            </div>

            {activeView === 'dashboard' ? (
              <>
                <Stats />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
                  <div className="lg:col-span-2 h-full">
                    <ActivityChart />
                  </div>
                  <div className="h-full">
                    <RecentTransactions />
                  </div>
                </div>
              </>
            ) : (
              <PlaceholderPage view={activeView} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
