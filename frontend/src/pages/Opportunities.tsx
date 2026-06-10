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
      <header className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-bold mb-3 tracking-tight glow-text text-white">Opportunity Matches</h1>
        <p className="text-white/50 text-lg">Prioritized openings based on {record!.profile.target_role}, skills, and readiness gaps.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <Metric label="Best Match" value={`${bestMatch}%`} />
        <Metric label="Ready To Apply" value={`${ready}`} />
        <Metric label="Needs Resume Tuning" value={`${Math.max(opportunities.length - ready, 0)}`} />
        <Metric label="Suggested This Week" value={`${opportunities.length}`} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {opportunities.map((item) => (
          <article key={item.title} className="glass-panel glass-panel-hover p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-white/40">{item.type}</p>
                <h2 className="text-2xl font-semibold mt-1 text-white">{item.title}</h2>
                <p className="text-white/50 text-sm mt-1">{item.provider}</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                {item.match}% match
              </span>
            </div>
            <p className="text-sm text-white/60 mb-6 leading-relaxed">Focus areas: {item.focus}</p>
            <a
              href={item.link || '#'}
              className="flex w-fit items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition-colors"
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
  <div className="glass-panel p-6 group">
    <Star className="text-white/20 group-hover:text-white/50 transition-colors mb-3" size={24} />
    <p className="text-sm font-medium uppercase tracking-wide text-white/40">{label}</p>
    <p className="text-4xl font-bold mt-2 text-white glow-text">{value}</p>
  </div>
);

export default Opportunities;
