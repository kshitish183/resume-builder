import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Briefcase, Send, MessageSquare, Trophy, Sparkles, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchApplications, fetchStats } from '../store/applicationsSlice';
import KanbanBoard from '../components/KanbanBoard/KanbanBoard';
import Button from '../components/ui/Button';

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    brand: 'bg-brand-500/20 text-brand-400',
    blue: 'bg-blue-500/20 text-blue-400',
    violet: 'bg-violet-500/20 text-violet-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
  };
  return (
    <div className="glass rounded-xl p-5">
      <div className={`inline-flex rounded-lg p-2.5 ${colors[color]}`}><Icon size={20} /></div>
      <p className="mt-4 text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items, stats, loading } = useSelector((s) => s.applications);
  const { user } = useAuth();

  useEffect(() => {
    dispatch(fetchApplications());
    dispatch(fetchStats());
  }, [dispatch]);

  if (loading && !items.length) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome, {user?.name?.split(' ')[0]}</h1>
          <p className="mt-1 text-slate-400">Track applications and optimize your resume with AI</p>
        </div>
        <Link to="/app/new">
          <Button><Plus size={16} /> New Application</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        <StatCard icon={Briefcase} label="Total Applications" value={stats?.total ?? 0} color="brand" />
        <StatCard icon={Send} label="Applied" value={stats?.applied ?? 0} color="blue" />
        <StatCard icon={MessageSquare} label="Interviews" value={stats?.interviews ?? 0} color="violet" />
        <StatCard icon={Trophy} label="Offers" value={stats?.offers ?? 0} color="emerald" />
        <StatCard icon={Sparkles} label="Avg Match Score" value={stats?.avgMatchScore ? `${stats.avgMatchScore}%` : '—'} color="brand" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Application Pipeline</h2>
        {items.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <p className="text-slate-300">No applications yet</p>
            <p className="mt-2 text-sm text-slate-500">Paste a job description and let AI score your match</p>
            <Link to="/app/new" className="mt-6 inline-block">
              <Button><Plus size={16} /> Add First Application</Button>
            </Link>
          </div>
        ) : (
          <KanbanBoard applications={items} />
        )}
      </div>
    </div>
  );
}
