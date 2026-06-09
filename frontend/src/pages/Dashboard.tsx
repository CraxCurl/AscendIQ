import React from 'react';
import {
  Bar,
  BarChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { AlertCircle, Briefcase, CalendarCheck, FileText, MessageSquare, Sparkles, Zap } from 'lucide-react';
import AppShell from '../components/AppShell';

const radarData = [
  { subject: 'Technical Skills', A: 85, fullMark: 100 },
  { subject: 'Projects', A: 70, fullMark: 100 },
  { subject: 'Resume', A: 82, fullMark: 100 },
  { subject: 'Interview', A: 65, fullMark: 100 },
  { subject: 'Exposure', A: 58, fullMark: 100 },
  { subject: 'Consistency', A: 74, fullMark: 100 },
];

const skillGapData = [
  { skill: 'ML', current: 78, target: 90 },
  { skill: 'PyTorch', current: 62, target: 85 },
  { skill: 'System Design', current: 45, target: 75 },
  { skill: 'MLOps', current: 38, target: 70 },
  { skill: 'DSA', current: 68, target: 80 },
];

const priorities = [
  'Ship one PyTorch mini-project with a clean README',
  'Add transformer and model deployment keywords to resume',
  'Practice 6 medium DSA problems focused on arrays and graphs',
  'Apply to 3 AI internships with 80%+ role match',
];

const Dashboard = () => {
  return (
    <AppShell>
      <header className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start mb-8">
        <div>
          <p className="text-sm text-indigo-300 font-medium mb-2">Career command center</p>
          <h1 className="text-3xl font-bold">Hello, Alex</h1>
          <p className="text-slate-400">Targeting: AI Engineer | Student/Entry Level | Last analysis: Today</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 w-fit">
          <Zap size={18} /> Update Analysis
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard title="Career Health Score" value="78" trend="+5%" detail="Strong resume, improving technical depth" />
        <StatCard title="Roadmap Progress" value="42%" trend="On Track" detail="2 of 5 current milestones complete" />
        <StatCard title="ATS Score" value="82" trend="Good" detail="Missing 6 high-value keywords" />
        <StatCard title="Interview Readiness" value="65" trend="+12%" detail="Coding practice needs consistency" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        <Panel title="Competency Radar" className="xl:col-span-1">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="78%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Skills" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Skill Gap Against AI Engineer Roles" className="xl:col-span-2">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillGapData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <XAxis dataKey="skill" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} domain={[0, 100]} />
                <Bar dataKey="target" fill="#334155" radius={[6, 6, 0, 0]} />
                <Bar dataKey="current" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Panel title="Mentor's Strategic Action Plan">
          <div className="space-y-4">
            <ActionItem title="Master Supervised Learning" desc="Complete 3 modules and publish notes with examples." impact="High" />
            <ActionItem title="Enhance Resume Keywords" desc="Add PyTorch, model evaluation, and deployment proof points." impact="Medium" />
            <ActionItem title="Build Hiring Signal" desc="Maintain a visible GitHub streak and pin your best AI project." impact="High" />
          </div>
        </Panel>

        <Panel title="This Week's Priority Queue">
          <div className="space-y-3">
            {priorities.map((priority, index) => (
              <div key={priority} className="flex gap-3 rounded-xl border border-slate-800 bg-slate-800/25 p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-sm text-indigo-300">
                  {index + 1}
                </span>
                <p className="text-sm text-slate-300">{priority}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Live Career Signals">
          <Signal icon={<Briefcase size={18} />} label="Best opportunity match" value="AI Research Intern - 91%" />
          <Signal icon={<FileText size={18} />} label="Resume blocker" value="Missing deployment metrics" />
          <Signal icon={<MessageSquare size={18} />} label="Interview focus" value="Graphs, model tradeoffs, ML basics" />
          <Signal icon={<CalendarCheck size={18} />} label="Next milestone" value="PyTorch portfolio project in 9 days" />
          <Signal icon={<AlertCircle size={18} />} label="Risk" value="Industry exposure is below target" />
        </Panel>
      </div>
    </AppShell>
  );
};

const Panel = ({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={`bg-slate-900/50 border border-slate-800 p-6 rounded-2xl ${className}`}>
    <h2 className="text-xl font-semibold mb-5">{title}</h2>
    {children}
  </section>
);

const StatCard = ({
  title,
  value,
  trend,
  detail,
}: {
  title: string;
  value: string;
  trend: string;
  detail: string;
}) => (
  <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
    <Sparkles className="absolute right-5 top-5 text-indigo-500/20" size={36} />
    <h3 className="text-slate-400 text-sm font-medium mb-2">{title}</h3>
    <div className="flex items-baseline gap-2 mb-3">
      <span className="text-4xl font-bold">{value}</span>
      <span className="text-emerald-400 text-sm">{trend}</span>
    </div>
    <p className="text-sm text-slate-500">{detail}</p>
  </div>
);

const ActionItem = ({ title, desc, impact }: { title: string; desc: string; impact: string }) => (
  <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
    <div className="flex justify-between items-start gap-3 mb-1">
      <h4 className="font-semibold text-slate-200">{title}</h4>
      <span
        className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold whitespace-nowrap ${
          impact === 'High' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
        }`}
      >
        {impact} Impact
      </span>
    </div>
    <p className="text-sm text-slate-400">{desc}</p>
  </div>
);

const Signal = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex gap-3 py-3 border-b border-slate-800 last:border-b-0">
    <div className="mt-1 text-indigo-300">{icon}</div>
    <div>
      <p className="text-xs uppercase text-slate-500 font-semibold">{label}</p>
      <p className="text-sm text-slate-200 mt-1">{value}</p>
    </div>
  </div>
);

export default Dashboard;
