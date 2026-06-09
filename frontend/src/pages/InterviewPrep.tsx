import React from 'react';
import { Brain, Code2, MessageCircleQuestion } from 'lucide-react';
import AppShell from '../components/AppShell';

const questions = [
  { type: 'Technical', prompt: 'Explain bias-variance tradeoff with an example from a model you built.' },
  { type: 'Technical', prompt: 'How would you evaluate an LLM-powered resume analyzer?' },
  { type: 'Coding', prompt: 'Solve longest consecutive sequence and discuss time complexity.' },
  { type: 'Behavioral', prompt: 'Tell me about a project where you improved after feedback.' },
];

const InterviewPrep = () => (
  <AppShell>
    <header className="mb-8">
      <h1 className="text-3xl font-bold mb-2">Interview Prep</h1>
      <p className="text-slate-400">Focused practice plan for technical, coding, and behavioral interviews.</p>
    </header>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <PrepCard icon={<Brain size={22} />} label="ML Fundamentals" value="72%" detail="Review model evaluation and tradeoffs" />
      <PrepCard icon={<Code2 size={22} />} label="Coding Readiness" value="61%" detail="Graphs and arrays need more reps" />
      <PrepCard icon={<MessageCircleQuestion size={22} />} label="Story Bank" value="80%" detail="Add one failure and recovery story" />
    </div>

    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
      <h2 className="text-xl font-semibold mb-5">Next Practice Questions</h2>
      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.prompt} className="rounded-xl border border-slate-800 bg-slate-800/25 p-4">
            <p className="text-xs uppercase font-bold text-indigo-300 mb-2">{question.type}</p>
            <p className="text-slate-200">{question.prompt}</p>
          </div>
        ))}
      </div>
    </section>
  </AppShell>
);

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
  <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
    <div className="text-indigo-300 mb-4">{icon}</div>
    <p className="text-sm text-slate-400">{label}</p>
    <p className="text-4xl font-bold mt-1">{value}</p>
    <p className="text-sm text-slate-500 mt-2">{detail}</p>
  </div>
);

export default InterviewPrep;
