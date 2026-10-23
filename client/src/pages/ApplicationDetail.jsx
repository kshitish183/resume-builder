import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Building2, MapPin, ExternalLink, Clock, Sparkles } from 'lucide-react';
import { fetchApplication } from '../store/applicationsSlice';
import { useAIAnalysis } from '../hooks/useAIAnalysis';
import MatchScorePanel from '../components/MatchScore/MatchScorePanel';
import BulletSuggestion from '../components/ResumeEditor/BulletSuggestion';
import Button from '../components/ui/Button';

const STATUS_COLORS = {
  saved: 'bg-slate-500/20 text-slate-300',
  applied: 'bg-blue-500/20 text-blue-300',
  interview: 'bg-violet-500/20 text-violet-300',
  offer: 'bg-emerald-500/20 text-emerald-300',
  rejected: 'bg-red-500/20 text-red-300',
  withdrawn: 'bg-slate-500/20 text-slate-400',
};

export default function ApplicationDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: app, loading } = useSelector((s) => s.applications);
  const { analysis, loading: aiLoading, analyze, setAnalysis } = useAIAnalysis();

  useEffect(() => {
    dispatch(fetchApplication(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (app?.aiAnalysis) setAnalysis(app.aiAnalysis);
  }, [app, setAnalysis]);

  const handleReanalyze = () => {
    analyze({
      jobDescription: app.jobDescription,
      resumeText: app.resumeSnapshot,
      applicationId: app._id,
    });
  };

  if (loading || !app) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
      </div>
    );
  }

  const displayAnalysis = analysis || app.aiAnalysis;

  return (
    <div className="p-8 max-w-5xl">
      <Link to="/app" className="mb-6 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{app.role}</h1>
          <p className="mt-1 flex items-center gap-2 text-slate-400">
            <Building2 size={14} /> {app.company}
            {app.location && <><MapPin size={14} /> {app.location}</>}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${STATUS_COLORS[app.status]}`}>
          {app.status}
        </span>
      </div>

      {app.url && (
        <a href={app.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300">
          <ExternalLink size={14} /> View Job Posting
        </a>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="glass rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Job Description</h3>
            <p className="text-sm text-slate-400 whitespace-pre-wrap leading-relaxed">{app.jobDescription}</p>
          </div>

          {app.notes && (
            <div className="glass rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Notes</h3>
              <p className="text-sm text-slate-400">{app.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles size={18} className="text-brand-400" /> AI Analysis
            </h3>
            <Button variant="secondary" size="sm" onClick={handleReanalyze} loading={aiLoading}>
              Re-analyze
            </Button>
          </div>
          <MatchScorePanel analysis={displayAnalysis} loading={aiLoading} mock={displayAnalysis?.mock} />

          {displayAnalysis?.suggestedBullets?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-300">Suggested Rewrites</h4>
              {displayAnalysis.suggestedBullets.map((s, i) => (
                <BulletSuggestion key={i} suggestion={s} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* History */}
      {app.history?.length > 0 && (
        <div className="mt-8 glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <Clock size={14} /> Application History
          </h3>
          <div className="space-y-3">
            {[...app.history].reverse().map((h, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                <div>
                  <p className="text-slate-300">{h.note || h.action}</p>
                  <p className="text-xs text-slate-500">{new Date(h.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
