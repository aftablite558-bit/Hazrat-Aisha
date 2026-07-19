export function Stats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="glass-panel p-6">
        <h3 className="text-slate-400 text-sm">Total Revenue</h3>
        <p className="text-3xl font-bold text-white mt-1">$45,231.89</p>
      </div>
      <div className="glass-panel p-6">
        <h3 className="text-slate-400 text-sm">Subscriptions</h3>
        <p className="text-3xl font-bold text-white mt-1">+2350</p>
      </div>
      <div className="glass-panel p-6">
        <h3 className="text-slate-400 text-sm">Sales</h3>
        <p className="text-3xl font-bold text-white mt-1">+12,234</p>
      </div>
    </div>
  );
}
