import React from 'react';
import { ExternalLink, Star } from 'lucide-react';
import AppShell from '../components/AppShell';
import { useAnalysis } from '../analysis';

const Opportunities = () => {
  const { record } = useAnalysis();
  const opportunities = record!.analysis.opportunities;
  const bestMatch = Math.max(...opportunities.map((item) => item.match), 0);
  const ready = opportunities.filter((item) => item.match >= 80).length;

  return (
    <AppShell>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Opportunity Matches</h1>
        <p className="text-slate-400">Prioritized openings based on {record!.profile.target_role}, skills, and readiness gaps.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
        <Metric label="Best Match" value={`${bestMatch}%`} />
        <Metric label="Ready To Apply" value={`${ready}`} />
        <Metric label="Needs Resume Tuning" value={`${Math.max(opportunities.length - ready, 0)}`} />
        <Metric label="Suggested This Week" value={`${opportunities.length}`} />
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
            <a
              href={item.link || '#'}
              className="flex w-fit items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-100 hover:bg-slate-700"
            >
              View Details <ExternalLink size={16} />
            </a>
          </article>
        ))}
      </div>
    </AppShell>
  );
};

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
    <Star className="text-indigo-300 mb-3" size={20} />
    <p className="text-sm text-slate-400">{label}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

export default Opportunities;
