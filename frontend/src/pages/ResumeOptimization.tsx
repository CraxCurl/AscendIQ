import React from 'react';
import { CheckCircle2, FileText, Search } from 'lucide-react';
import AppShell from '../components/AppShell';

const keywords = ['PyTorch', 'Transformer Architecture', 'Model Deployment', 'Feature Engineering', 'A/B Evaluation', 'MLOps'];

const suggestions = [
  'Add metrics to each project bullet, especially accuracy, latency, or user impact.',
  'Move the strongest AI project above coursework and older certifications.',
  'Mention deployment tools such as Docker, FastAPI, or cloud hosting where applicable.',
  'Replace broad phrases like "worked on ML" with specific models, datasets, and outcomes.',
];

const ResumeOptimization = () => (
  <AppShell>
    <header className="mb-8">
      <h1 className="text-3xl font-bold mb-2">Resume Optimization</h1>
      <p className="text-slate-400">ATS readiness, missing keywords, and rewrite priorities for AI Engineer applications.</p>
    </header>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <ScoreCard label="ATS Score" value="82" detail="Good, but not yet top-tier" />
      <ScoreCard label="Keyword Coverage" value="68%" detail="6 high-value terms missing" />
      <ScoreCard label="Project Proof" value="74%" detail="Needs stronger impact metrics" />
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="text-xl font-semibold mb-5">Missing Keywords</h2>
        <div className="flex flex-wrap gap-3">
          {keywords.map((keyword) => (
            <span key={keyword} className="rounded-full bg-indigo-500/10 px-3 py-2 text-sm text-indigo-200">
              {keyword}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="text-xl font-semibold mb-5">Rewrite Priorities</h2>
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div key={suggestion} className="flex gap-3">
              <CheckCircle2 className="mt-0.5 text-emerald-400" size={18} />
              <p className="text-sm text-slate-300">{suggestion}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  </AppShell>
);

const ScoreCard = ({ label, value, detail }: { label: string; value: string; detail: string }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
    <div className="flex items-center gap-2 text-indigo-300 mb-3">
      {label === 'ATS Score' ? <FileText size={18} /> : <Search size={18} />}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <p className="text-4xl font-bold">{value}</p>
    <p className="text-sm text-slate-400 mt-2">{detail}</p>
  </div>
);

export default ResumeOptimization;
