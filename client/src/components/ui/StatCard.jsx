import clsx from 'clsx';

export default function StatCard({ icon: Icon, label, value, trend, color = 'brand' }) {
  const iconColors = {
    brand: 'bg-brand-500/20 text-brand-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/20 text-amber-400',
    red: 'bg-red-500/20 text-red-400',
    blue: 'bg-blue-500/20 text-blue-400',
  };

  return (
    <div className="glass rounded-xl p-5 transition-transform hover:scale-[1.02]">
      <div className="flex items-start justify-between">
        <div className={clsx('rounded-lg p-2.5', iconColors[color])}>
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <span className={clsx('text-xs font-medium', trend >= 0 ? 'text-emerald-400' : 'text-red-400')}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </div>
  );
}
