import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Briefcase, FileText, LayoutDashboard, LogOut, MessageSquare, Target } from 'lucide-react';
import { useAuth } from '../auth';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/roadmap', label: 'Roadmap', icon: Target },
  { to: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { to: '/resume', label: 'Resume Opt', icon: FileText },
  { to: '/interview', label: 'Interview Prep', icon: MessageSquare },
];

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-white/30 selection:text-white">
      <aside className="w-64 shrink-0 border-r border-white/10 p-6 flex flex-col gap-8 bg-black">
        <NavLink
          to="/"
          className="text-2xl font-bold tracking-tight text-white glow-text"
        >
          AscendIQ
        </NavLink>
        <nav className="flex flex-col gap-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-white/10 text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
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
