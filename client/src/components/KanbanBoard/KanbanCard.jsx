import { Link } from 'react-router-dom';
import { Building2, MapPin, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const scoreColor = (score) => {
  if (!score) return 'text-slate-500';
  if (score >= 75) return 'text-emerald-400';
  if (score >= 50) return 'text-amber-400';
  return 'text-red-400';
};

export default function KanbanCard({ application, onDragStart }) {
  const score = application.aiAnalysis?.matchScore;

  return (
    <div
      draggable
      onDragStart={() => onDragStart(application)}
      className="cursor-grab rounded-lg border border-white/5 bg-slate-800/60 p-3 transition-all hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/5 active:cursor-grabbing"
    >
      <Link to={`/app/applications/${application._id}`} className="block" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{application.role}</p>
            <p className="flex items-center gap-1 truncate text-xs text-slate-400 mt-0.5">
              <Building2 size={11} /> {application.company}
            </p>
          </div>
          {score != null && (
            <div className={clsx('flex items-center gap-0.5 text-xs font-bold shrink-0', scoreColor(score))}>
              <Sparkles size={10} /> {score}%
            </div>
          )}
        </div>
        {application.location && (
          <p className="flex items-center gap-1 mt-2 text-xs text-slate-500">
            <MapPin size={10} /> {application.location}
          </p>
        )}
      </Link>
    </div>
  );
}
