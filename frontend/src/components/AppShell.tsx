import React from 'react';
import { NavLink } from 'react-router-dom';
import { Briefcase, FileText, LayoutDashboard, MessageSquare, Target } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/roadmap', label: 'Roadmap', icon: Target },
  { to: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { to: '/resume', label: 'Resume Opt', icon: FileText },
  { to: '/interview', label: 'Interview Prep', icon: MessageSquare },
];

const AppShell = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen bg-slate-950">
    <aside className="w-64 shrink-0 border-r border-slate-800 p-6 flex flex-col gap-8">
      <NavLink
        to="/"
        className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent"
      >
        SkillForge
      </NavLink>
      <nav className="flex flex-col gap-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`
            }
          >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>

    <main className="flex-1 p-8 overflow-auto">{children}</main>
  </div>
);

export default AppShell;
