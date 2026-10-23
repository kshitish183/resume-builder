import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, FileText, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const nav = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/app/new', icon: PlusCircle, label: 'New Application' },
  { to: '/app/resume', icon: FileText, label: 'My Resume' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-white/10 bg-slate-900/50">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">ApplyAI</h1>
          <p className="text-xs text-slate-500">Job Application Tracker</p>
        </div>
      </div>

      <nav className="mt-6 flex-1 space-y-1 px-3">
        {nav.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-600/20 text-brand-300' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`
            }
          >
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-600 text-xs font-semibold text-white">
            {initials}
          </div>
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium text-slate-200">{user?.name}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
          <button onClick={logout} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-red-400" title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
