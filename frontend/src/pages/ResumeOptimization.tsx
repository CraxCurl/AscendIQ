import React from 'react';
import { CheckCircle2, FileText, Search } from 'lucide-react';
import AppShell from '../components/AppShell';
import { useAnalysis } from '../analysis';

const ResumeOptimization = () => {
  const { record } = useAnalysis();
  const feedback = record!.analysis.resume_feedback;

  return (
    <AppShell>
      <header className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-bold mb-3 tracking-tight glow-text text-white">Resume Optimization</h1>
        <p className="text-white/50 text-lg">ATS readiness, missing keywords, and rewrite priorities for {record!.profile.target_role} applications.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <ScoreCard label="ATS Score" value={`${feedback.ats_score}`} detail="AI-estimated resume readiness" />
        <ScoreCard label="Keyword Coverage" value={`${feedback.keyword_coverage}%`} detail={`${feedback.missing_keywords.length} high-value terms to review`} />
        <ScoreCard label="Project Proof" value={`${feedback.project_proof}%`} detail="Strength of measurable outcomes and project evidence" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <section className="glass-panel p-6">
          <h2 className="text-xl font-semibold mb-6 text-white">Missing Keywords</h2>
          <div className="flex flex-wrap gap-3">
            {feedback.missing_keywords.map((keyword) => (
              <span key={keyword} className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/5">
                {keyword}
              </span>
            ))}
          </div>
        </section>

        <section className="glass-panel p-6">
          <h2 className="text-xl font-semibold mb-6 text-white">Rewrite Priorities</h2>
          <div className="space-y-4">
            {feedback.suggestions.map((suggestion) => (
              <div key={suggestion} className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                <CheckCircle2 className="mt-0.5 text-white/50 shrink-0" size={18} />
                <p className="text-sm text-white/70 leading-relaxed">{suggestion}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
};

const ScoreCard = ({ label, value, detail }: { label: string; value: string; detail: string }) => (
  <div className="glass-panel p-6 group">
    <div className="flex items-center gap-2 text-white/40 mb-3 uppercase tracking-wide">
      {label === 'ATS Score' ? <FileText size={18} /> : <Search size={18} />}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <p className="text-4xl font-bold text-white glow-text">{value}</p>
    <p className="text-sm text-white/50 mt-3">{detail}</p>
  </div>
);

export default ResumeOptimization;
