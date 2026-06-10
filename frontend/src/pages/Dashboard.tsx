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
      <div className="text-center py-10 glass-panel mt-10">
        <h2 className="text-2xl font-bold text-white/80">
          No analysis data available
        </h2>
        <p className="text-white/50 mt-2">
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
      <header className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start mb-8 animate-slide-up">
        <div>
          <p className="text-sm text-white/60 font-medium mb-2 tracking-widest uppercase">Career command center</p>
          <h1 className="text-4xl font-bold tracking-tight glow-text">Hello, {profile.full_name || 'there'}</h1>
          <p className="text-white/50 mt-1">Targeting: {profile.target_role} | Last analysis: {updatedAt}</p>
          <p className="mt-4 max-w-3xl text-sm text-white/70 leading-relaxed">{analysis.user_summary}</p>
        </div>
        <a href="/upload" className="glass-panel glass-panel-hover px-5 py-3 rounded-full transition-colors flex items-center gap-2 w-fit font-medium text-sm">
          <Zap size={16} /> Update Analysis
        </a>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <StatCard title="Career Health Score" value={`${analysis.stats?.career_health_score ?? 0}`} trend="AI scored" detail="Overall readiness from your resume and self-description" />
        <StatCard title="Roadmap Progress" value={`${analysis.stats?.roadmap_progress ?? 0}%`} trend="Active" detail="Estimated progress across your current growth plan" />
        <StatCard title="ATS Score" value={`${analysis.stats?.ats_score ?? 0}`} trend="Resume" detail="Keyword and proof strength for your target role" />
        <StatCard title="Interview Readiness" value={`${analysis.stats?.interview_readiness ?? 0}`} trend="Practice" detail="Current interview preparation signal" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <Panel title="Competency Radar" className="xl:col-span-1">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="78%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Skills" dataKey="A" stroke="#fff" fill="#fff" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title={`Skill Gap Against ${profile.target_role} Roles`} className="xl:col-span-2">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.skill_gaps || []} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <XAxis dataKey="skill" stroke="rgba(255,255,255,0.4)" tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" tickLine={false} axisLine={false} domain={[0, 100]} />
                <Bar dataKey="target" fill="rgba(255,255,255,0.1)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="current" fill="rgba(255,255,255,0.8)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
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
              <div key={priority} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm text-white font-medium">
                  {index + 1}
                </span>
                <p className="text-sm text-white/70 leading-relaxed">{priority}</p>
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
  <section className={`glass-panel p-6 ${className}`}>
    <h2 className="text-xl font-semibold mb-6 text-white">{title}</h2>
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
  <div className="glass-panel glass-panel-hover p-6 relative overflow-hidden group">
    <Sparkles className="absolute right-5 top-5 text-white/10 group-hover:text-white/30 transition-colors" size={36} />
    <h3 className="text-white/50 text-sm font-medium mb-2 uppercase tracking-wide">{title}</h3>
    <div className="flex items-baseline gap-2 mb-3">
      <span className="text-4xl font-bold text-white glow-text">{value}</span>
      <span className="text-white/60 text-sm">{trend}</span>
    </div>
    <p className="text-sm text-white/40">{detail}</p>
  </div>
);

const ActionItem = ({ title, desc, impact }: { title: string; desc: string; impact: string }) => (
  <div className="bg-black/40 p-5 rounded-xl border border-white/5">
    <div className="flex justify-between items-start gap-3 mb-2">
      <h4 className="font-semibold text-white">{title}</h4>
      <span
        className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold whitespace-nowrap ${
          impact === 'High' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
        }`}
      >
        {impact} Impact
      </span>
    </div>
    <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
  </div>
);

const Signal = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex gap-4 py-4 border-b border-white/5 last:border-b-0">
    <div className="mt-0.5 text-white/50">{icon}</div>
    <div>
      <p className="text-xs uppercase tracking-wider text-white/40 font-semibold">{label}</p>
      <p className="text-sm text-white mt-1.5 leading-snug">{value}</p>
    </div>
  </div>
);

export default Dashboard;
