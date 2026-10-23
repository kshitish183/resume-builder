import clsx from 'clsx';

const colors = {
  todo: 'bg-slate-500/20 text-slate-300',
  in_progress: 'bg-blue-500/20 text-blue-300',
  review: 'bg-amber-500/20 text-amber-300',
  done: 'bg-emerald-500/20 text-emerald-300',
  low: 'bg-slate-500/20 text-slate-400',
  medium: 'bg-blue-500/20 text-blue-300',
  high: 'bg-orange-500/20 text-orange-300',
  urgent: 'bg-red-500/20 text-red-300',
  critical: 'bg-red-500/20 text-red-300',
  active: 'bg-emerald-500/20 text-emerald-300',
  on_hold: 'bg-amber-500/20 text-amber-300',
  completed: 'bg-brand-500/20 text-brand-300',
  archived: 'bg-slate-500/20 text-slate-400',
};

export default function Badge({ children, variant = 'todo', className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        colors[variant] || colors.todo,
        className
      )}
    >
      {children?.replace?.('_', ' ') || children}
    </span>
  );
}
