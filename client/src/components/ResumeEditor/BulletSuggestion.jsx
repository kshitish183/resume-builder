import { ArrowRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function BulletSuggestion({ suggestion, onAccept }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion.rewritten);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-white/5 bg-slate-800/40 p-4 space-y-3">
      {suggestion.original && (
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1">Original</p>
          <p className="text-sm text-slate-400 line-through decoration-slate-600">{suggestion.original}</p>
        </div>
      )}
      <div className="flex items-start gap-2">
        <ArrowRight size={14} className="mt-1 shrink-0 text-brand-400" />
        <div className="flex-1">
          <p className="text-xs font-medium text-brand-400 mb-1">AI Suggestion</p>
          <p className="text-sm text-slate-200">{suggestion.rewritten}</p>
          {suggestion.reason && (
            <p className="mt-2 text-xs text-slate-500 italic">{suggestion.reason}</p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-md bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        {onAccept && (
          <button
            onClick={() => onAccept(suggestion.rewritten)}
            className="rounded-md bg-brand-600/20 px-3 py-1.5 text-xs text-brand-300 hover:bg-brand-600/30"
          >
            Use This
          </button>
        )}
      </div>
    </div>
  );
}
