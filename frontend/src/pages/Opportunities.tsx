import React from 'react';
import { ExternalLink, Star } from 'lucide-react';
import AppShell from '../components/AppShell';

const opportunities = [
  { title: 'AI Research Intern', type: 'Internship', provider: 'Nexus Labs', match: 91, focus: 'PyTorch, evaluation, experimentation' },
  { title: 'Open Source ML Sprint', type: 'OS Program', provider: 'ModelHub', match: 86, focus: 'Documentation, issue triage, model cards' },
  { title: 'Generative AI Hackathon', type: 'Hackathon', provider: 'DevArena', match: 82, focus: 'LLM apps, retrieval, deployment' },
  { title: 'Data Science Fellowship', type: 'Fellowship', provider: 'InsightWorks', match: 78, focus: 'Analytics, storytelling, notebooks' },
];

const Opportunities = () => (
  <AppShell>
    <header className="mb-8">
      <h1 className="text-3xl font-bold mb-2">Opportunity Matches</h1>
      <p className="text-slate-400">Prioritized openings based on Alex's target role, skills, and readiness gaps.</p>
    </header>

    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
      <Metric label="Best Match" value="91%" />
      <Metric label="Ready To Apply" value="2" />
      <Metric label="Needs Resume Tuning" value="3" />
      <Metric label="Suggested This Week" value="4" />
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {opportunities.map((item) => (
        <article key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-sm text-indigo-300 font-medium">{item.type}</p>
              <h2 className="text-xl font-semibold mt-1">{item.title}</h2>
              <p className="text-slate-400 text-sm mt-1">{item.provider}</p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-300">
              {item.match}% match
            </span>
          </div>
          <p className="text-sm text-slate-300 mb-5">Focus areas: {item.focus}</p>
          <button className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-100 hover:bg-slate-700">
            View Details <ExternalLink size={16} />
          </button>
        </article>
      ))}
    </div>
  </AppShell>
);

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
    <Star className="text-indigo-300 mb-3" size={20} />
    <p className="text-sm text-slate-400">{label}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

export default Opportunities;
