import React from 'react';
import { Brain, Code2, MessageCircleQuestion } from 'lucide-react';
import AppShell from '../components/AppShell';
import { useAnalysis } from '../analysis';

const InterviewPrep = () => {
  const { record } = useAnalysis();
  const prep = record!.analysis.interview_prep;

  return (
    <AppShell>
      <header className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-bold mb-3 tracking-tight glow-text text-white">Interview Prep</h1>
        <p className="text-white/50 text-lg">Focused practice plan for {record!.profile.target_role} technical, coding, and behavioral interviews.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <PrepCard icon={<Brain size={24} />} label="Role Fundamentals" value={`${prep.ml_fundamentals}%`} detail="Core concepts to explain clearly" />
        <PrepCard icon={<Code2 size={24} />} label="Coding Readiness" value={`${prep.coding_readiness}%`} detail="Problem-solving consistency signal" />
        <PrepCard icon={<MessageCircleQuestion size={24} />} label="Story Bank" value={`${prep.story_bank}%`} detail="Behavioral examples from your profile" />
      </div>

      <section className="glass-panel p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-xl font-semibold mb-6 text-white">Next Practice Questions</h2>
        <div className="space-y-4">
          {prep.questions.map((question) => (
            <div key={question.prompt} className="glass-panel glass-panel-hover p-5 border-white/5">
              <p className="text-xs uppercase font-bold text-white/40 mb-3 tracking-wider">{question.type}</p>
              <p className="text-white/80 leading-relaxed text-lg">{question.prompt}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
};

const PrepCard = ({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) => (
  <div className="glass-panel p-6 group">
    <div className="text-white/40 mb-4 group-hover:text-white/70 transition-colors">{icon}</div>
    <p className="text-sm font-medium uppercase tracking-wide text-white/40">{label}</p>
    <p className="text-4xl font-bold mt-2 text-white glow-text">{value}</p>
    <p className="text-sm text-white/50 mt-3">{detail}</p>
  </div>
);

export default InterviewPrep;
