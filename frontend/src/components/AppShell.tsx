import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, FileText, LayoutDashboard, LogOut, MessageSquare, Target } from 'lucide-react';
import { useAuth } from '../auth';
import { ExpandableTabs } from './ui/expandable-tabs';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/roadmap', label: 'Roadmap', icon: Target },
  { to: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { to: '/resume', label: 'Resume Opt', icon: FileText },
  { to: '/interview', label: 'Interview Prep', icon: MessageSquare },
];

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-white/30 selection:text-white">
      <aside className="w-64 shrink-0 border-r border-white/10 p-6 flex flex-col gap-6 bg-black">
        <NavLink
          to="/"
          className="text-2xl font-bold tracking-tight text-white glow-text"
        >
          AscendIQ
        </NavLink>
        <nav className="flex flex-col gap-2">
          <ExpandableTabs 
            tabs={navItems.map(item => ({ title: item.label, icon: item.icon, to: item.to })) as any} 
            className="flex-col items-start w-full border-0 bg-transparent p-0 gap-2 shadow-none"
            defaultSelected={navItems.findIndex(item => location.pathname.startsWith(item.to))}
            onChange={(index) => {
              if (index !== null) {
                navigate(navItems[index].to);
              }
            }}
          />
        </nav>

        <div className="mt-auto border-t border-white/10 pt-5">
          <p className="mb-3 truncate text-xs text-white/40">{user?.email}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-white/60 transition-all hover:bg-white/5 hover:text-white"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/4 w-1/2 h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        {children}
      </main>
    </div>
  );
};

export default AppShell;
