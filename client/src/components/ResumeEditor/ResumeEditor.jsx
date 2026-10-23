import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FileText, Wand2, Save } from 'lucide-react';
import { updateResume, parseResume, setRawText } from '../../store/resumeSlice';
import Button from '../ui/Button';
import BulletSuggestion from './BulletSuggestion';

export default function ResumeEditor({ suggestions = [], showSuggestions = false }) {
  const dispatch = useDispatch();
  const { data: resume, parsing } = useSelector((s) => s.resume);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (resume?.rawText) setText(resume.rawText);
  }, [resume?.rawText]);

  const handleParse = () => {
    if (!text.trim()) return;
    dispatch(parseResume(text));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await dispatch(updateResume({ rawText: text })).unwrap();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
          <FileText size={18} className="text-brand-400" /> Your Resume
        </h3>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleParse} loading={parsing}>
            <Wand2 size={14} /> Parse with AI
          </Button>
          <Button size="sm" onClick={handleSave} loading={saving}>
            <Save size={14} /> Save
          </Button>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          dispatch(setRawText(e.target.value));
        }}
        rows={12}
        placeholder="Paste your full resume here — experience, skills, education..."
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-mono leading-relaxed"
      />

      {resume?.skills?.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-500 mb-2">Parsed Skills</p>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((s) => (
              <span key={s} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">{s}</span>
            ))}
          </div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-300">Suggested Bullet Rewrites</h4>
          {suggestions.map((s, i) => (
            <BulletSuggestion key={i} suggestion={s} />
          ))}
        </div>
      )}
    </div>
  );
}
