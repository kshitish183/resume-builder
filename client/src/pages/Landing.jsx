import { Link } from 'react-router-dom';
import { Sparkles, Target, Kanban, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';

const features = [
  { icon: Target, title: 'AI Match Scoring', desc: 'Paste a JD and resume — get an instant compatibility score with strengths and gaps.' },
  { icon: FileText, title: 'Resume Rewriting', desc: 'AI rewrites your bullet points to align with each job description.' },
  { icon: Kanban, title: 'Application Pipeline', desc: 'Track every application from Saved → Applied → Interview → Offer.' },
  { icon: Sparkles, title: 'Full History', desc: 'Every status change and AI analysis stored in MongoDB with timestamps.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 z-40 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">ApplyAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link to="/register"><Button size="sm">Get Started <ArrowRight size={14} /></Button></Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden px-6 pb-20 pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/40 via-slate-950 to-slate-950" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-brand-300">
            <Sparkles size={14} /> AI-Powered Job Application Tracker
          </div>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Land your dream job with{' '}
            <span className="gradient-text">AI on your side</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Paste any job description and your resume. ApplyAI scores the match, rewrites your bullets,
            and tracks every application through a Kanban pipeline — all stored with full history.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link to="/register"><Button size="lg">Start Free <ArrowRight size={18} /></Button></Link>
            <Link to="/login"><Button variant="secondary" size="lg">View Demo</Button></Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">Demo: demo@applyai.io / demo123</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-white">How it works</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass rounded-xl p-6 transition-transform hover:scale-[1.02]">
              <div className="mb-4 inline-flex rounded-lg bg-brand-500/20 p-3 text-brand-400"><Icon size={22} /></div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 bg-white/[0.02] px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-white">Tech Stack</h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {['React 19', 'Redux Toolkit', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'OpenAI', 'JWT'].map((t) => (
              <span key={t} className="rounded-full glass px-4 py-2 text-sm text-slate-300">{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-3xl rounded-2xl glass p-12 text-center">
          <h2 className="text-3xl font-bold text-white">Stop guessing. Start applying smarter.</h2>
          <p className="mt-3 text-slate-400">Built as a portfolio SaaS showcasing full-stack + AI integration skills.</p>
          <Link to="/register" className="mt-8 inline-block">
            <Button size="lg">Create Free Account <ArrowRight size={18} /></Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 px-6 py-8 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} ApplyAI. Portfolio SaaS project.
      </footer>
    </div>
  );
}
