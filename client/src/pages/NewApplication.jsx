import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Sparkles, Save } from 'lucide-react';
import { createApplication } from '../store/applicationsSlice';
import { fetchResume } from '../store/resumeSlice';
import { useAIAnalysis } from '../hooks/useAIAnalysis';
import ResumeEditor from '../components/ResumeEditor/ResumeEditor';
import MatchScorePanel from '../components/MatchScore/MatchScorePanel';
import BulletSuggestion from '../components/ResumeEditor/BulletSuggestion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function NewApplication() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: resume } = useSelector((s) => s.resume);
  const { analysis, loading: aiLoading, analyze, reset } = useAIAnalysis();

  const [form, setForm] = useState({
    company: '', role: '', jobDescription: '', location: '', salary: '', url: '', notes: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchResume());
  }, [dispatch]);

  const handleAnalyze = async () => {
    if (!form.jobDescription.trim()) return alert('Paste a job description first');
    await analyze({
      jobDescription: form.jobDescription,
      resumeText: resume?.rawText,
    });
  };

  const handleSave = async () => {
    if (!form.company || !form.role || !form.jobDescription) {
      return alert('Company, role, and job description are required');
    }
    setSaving(true);
    try {
      const result = await dispatch(createApplication({
        ...form,
        resumeSnapshot: resume?.rawText || '',
        aiAnalysis: analysis || undefined,
      })).unwrap();
      navigate(`/app/applications/${result._id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-white">New Application</h1>
      <p className="mt-1 text-slate-400">Paste a job description, analyze your match, and save to your pipeline</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Stripe" required />
          <Input label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Frontend Engineer" required />
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Remote" />
          <Input label="Job URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Job Description *</label>
            <textarea
              value={form.jobDescription}
              onChange={(e) => { setForm({ ...form, jobDescription: e.target.value }); reset(); }}
              rows={10}
              placeholder="Paste the full job description here..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <Button onClick={handleAnalyze} loading={aiLoading} className="w-full">
            <Sparkles size={16} /> Analyze Match with AI
          </Button>
        </div>

        <div className="space-y-6">
          <MatchScorePanel analysis={analysis} loading={aiLoading} mock={analysis?.mock} />

          {analysis?.suggestedBullets?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-300">Resume Bullet Suggestions</h3>
              {analysis.suggestedBullets.map((s, i) => (
                <BulletSuggestion key={i} suggestion={s} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 glass rounded-xl p-6">
        <ResumeEditor />
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} loading={saving} size="lg">
          <Save size={16} /> Save Application
        </Button>
      </div>
    </div>
  );
}
