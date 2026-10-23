import { Sparkles, TrendingUp, AlertCircle, Tag } from 'lucide-react';
import clsx from 'clsx';

function ScoreRing({ score }) {
  const color = score >= 75 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-red-400';
  const bg = score >= 75 ? 'stroke-emerald-400' : score >= 50 ? 'stroke-amber-400' : 'stroke-red-400';
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="120" height="120" className="-rotate-90">
        <circle cx="60" cy="60" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/10" />
        <circle
          cx="60" cy="60" r="45" fill="none" strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" className={bg} style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute text-center">
        <span className={clsx('text-3xl font-bold', color)}>{score}</span>
        <span className="block text-xs text-slate-500">match</span>
      </div>
    </div>
  );
}

export default function MatchScorePanel({ analysis, loading, mock }) {
  if (loading) {
    return (
      <div className="glass rounded-xl p-8 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="mx-auto h-8 w-8 animate-pulse text-brand-400" />
          <p className="mt-3 text-sm text-slate-400">Analyzing match with AI...</p>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="glass rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Sparkles size={18} className="text-brand-400" /> AI Match Analysis
        </h3>
        {mock && (
          <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs text-amber-300">Mock Mode</span>
        )}
      </div>

      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
        <ScoreRing score={analysis.matchScore} />
        <p className="flex-1 text-sm text-slate-300 leading-relaxed">{analysis.summary}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="flex items-center gap-1.5 text-sm font-medium text-emerald-400 mb-2">
            <TrendingUp size={14} /> Strengths
          </h4>
          <ul className="space-y-1.5">
            {analysis.strengths?.map((s, i) => (
              <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="flex items-center gap-1.5 text-sm font-medium text-amber-400 mb-2">
            <AlertCircle size={14} /> Gaps
          </h4>
          <ul className="space-y-1.5">
            {analysis.gaps?.map((g, i) => (
              <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {analysis.keywords?.length > 0 && (
        <div>
          <h4 className="flex items-center gap-1.5 text-sm font-medium text-slate-300 mb-2">
            <Tag size={14} /> Key Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.keywords.map((k) => (
              <span key={k} className="rounded-full bg-brand-500/15 px-3 py-1 text-xs text-brand-300">{k}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
