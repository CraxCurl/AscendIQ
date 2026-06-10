import React from 'react';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import AppShell from '../components/AppShell';
import { useAnalysis } from '../analysis';

const Roadmap = () => {
  const { record } = useAnalysis();
  const milestones = record?.analysis?.roadmap ?? [];
  const profile = record!.profile;

  return (
    <AppShell>
      <div className="max-w-4xl animate-fade-in">
        <h1 className="text-4xl font-bold mb-3 tracking-tight glow-text text-white">Your 90-Day Growth Roadmap</h1>
        <p className="text-white/50 mb-10 text-lg">Track the milestones that move {profile.full_name || 'you'} closer to {profile.target_role} readiness.</p>
        <div className="space-y-6">
          {milestones.map((m, i) => (
            <div key={i} className={`flex gap-6 p-6 rounded-2xl border transition-all duration-300 ${m.status === 'current' ? 'border-white/30 bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)]' : 'border-white/10 bg-white/5'}`}>
              <div className="mt-1">
                {m.status === 'completed' ? <CheckCircle2 className="text-white" size={28} /> : <Circle className="text-white/30" size={28} />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className={`text-2xl font-semibold ${m.status === 'current' ? 'text-white' : 'text-white/80'}`}>{m.title || `Milestone ${i + 1}`}</h3>
                  <span className="text-sm font-medium tracking-wider uppercase text-white/40 bg-white/5 px-3 py-1 rounded-full">{m.date || `Phase ${i + 1}`}</span>
                </div>
                <p className="text-white/60 mb-5 leading-relaxed">{m.description || 'Complete this milestone to improve role readiness.'}</p>
                {m.status === 'current' && (
                  <button className="text-white font-medium flex items-center gap-2 hover:gap-3 transition-all bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm">
                    Continue Learning <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {!milestones.length && (
            <div className="glass-panel p-8 text-center text-white/50">
              Run your profile analysis again to generate a 90-day roadmap.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default Roadmap;
