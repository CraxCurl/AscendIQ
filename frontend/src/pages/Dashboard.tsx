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
import { useAnalysis } from '../analysis';

const Dashboard = () => {
  const { record } = useAnalysis();

if (!record || !record.analysis || !record.profile) {
  return (
    <AppShell>
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-red-400">
          No analysis data available
        </h2>
        <p className="text-slate-400 mt-2">
          Please upload your profile and run analysis again.
        </p>
      </div>
    </AppShell>
  );
}

const analysis = record.analysis;
const profile = record.profile;

const radarData = (analysis.radar || []).map((point: any) => ({
  ...point,
  A: point.score,
  fullMark: 100,
}));

const updatedAt = record.updated_at
  ? new Date(record.updated_at).toLocaleDateString()
  : "Unknown";

  return (
    <AppShell>
      <header className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start mb-8">
        <div>
          <p className="text-sm text-indigo-300 font-medium mb-2">Career command center</p>
          <h1 className="text-3xl font-bold">Hello, {profile.full_name || 'there'}</h1>
          <p className="text-slate-400">Targeting: {profile.target_role} | Last analysis: {updatedAt}</p>
          <p className="mt-3 max-w-3xl text-sm text-slate-300">{analysis.user_summary}</p>
        </div>
        <a href="/upload" className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 w-fit">
          <Zap size={18} /> Update Analysis
        </a>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard title="Career Health Score" value={`${analysis.stats?.career_health_score ?? 0}`} trend="AI scored" detail="Overall readiness from your resume and self-description" />
        <StatCard title="Roadmap Progress" value={`${analysis.stats?.roadmap_progress ?? 0}%`} trend="Active" detail="Estimated progress across your current growth plan" />
        <StatCard title="ATS Score" value={`${analysis.stats?.ats_score ?? 0}`} trend="Resume" detail="Keyword and proof strength for your target role" />
        <StatCard title="Interview Readiness" value={`${analysis.stats?.interview_readiness ?? 0}`} trend="Practice" detail="Current interview preparation signal" />
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

        <Panel title={`Skill Gap Against ${profile.target_role} Roles`} className="xl:col-span-2">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.skill_gaps || []} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
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
            {(analysis.strategic_plan || []).map((item) => (
              <ActionItem key={item.title} title={item.title} desc={item.description} impact={item.impact} />
            ))}
          </div>
        </Panel>

        <Panel title="This Week's Priority Queue">
          <div className="space-y-3">
            {(analysis.priorities || []).map((priority, index) => (
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
          <Signal icon={<Briefcase size={18} />} label="Best opportunity match" value={analysis.signals?.best_opportunity_match|| "N/A"} />
          <Signal icon={<FileText size={18} />} label="Resume blocker" value={analysis.signals?.resume_blocker || "N/A"} />
          <Signal icon={<MessageSquare size={18} />} label="Interview focus" value={analysis.signals?.interview_focus || "N/A"} />
          <Signal icon={<CalendarCheck size={18} />} label="Next milestone" value={analysis.signals?.next_milestone || "N/A"} />
          <Signal icon={<AlertCircle size={18} />} label="Risk" value={analysis.signals?.risk || "N/A"} />
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
