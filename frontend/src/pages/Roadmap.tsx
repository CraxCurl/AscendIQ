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
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Your 90-Day Growth Roadmap</h1>
        <p className="text-slate-400 mb-8">Track the milestones that move {profile.full_name || 'you'} closer to {profile.target_role} readiness.</p>
        <div className="space-y-6">
          {milestones.map((m, i) => (
            <div key={i} className={`flex gap-6 p-6 rounded-2xl border ${m.status === 'current' ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800 bg-slate-900/50'}`}>
              <div className="mt-1">
                {m.status === 'completed' ? <CheckCircle2 className="text-emerald-500" /> : <Circle className="text-slate-600" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold">{m.title || `Milestone ${i + 1}`}</h3>
                  <span className="text-sm text-slate-500">{m.date || `Phase ${i + 1}`}</span>
                </div>
                <p className="text-slate-400 mb-4">{m.description || 'Complete this milestone to improve role readiness.'}</p>
                {m.status === 'current' && (
                  <button className="text-indigo-400 font-medium flex items-center gap-2 hover:gap-3 transition-all">
                    Continue Learning <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {!milestones.length && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-slate-400">
              Run your profile analysis again to generate a 90-day roadmap.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default Roadmap;
