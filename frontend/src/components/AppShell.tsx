import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, FileText, LayoutDashboard, LogOut, MessageSquare, Target, Map } from 'lucide-react';
import { useAuth } from '../auth';
import { ExpandableTabs } from './ui/expandable-tabs';
import { CanvasRevealEffect } from './ui/sign-in-flow-1';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/roadmap', label: 'Roadmap', icon: Target },
  { to: '/career-path', label: 'Mentor Path', icon: Map },
  { to: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { to: '/resume', label: 'Resume Opt', icon: FileText },
  { to: '/interview', label: 'Interview Prep', icon: MessageSquare },
];

const AppShell = ({
  children,
  dimBackground = false,
}: {
  children: React.ReactNode;
  dimBackground?: boolean;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white selection:bg-white/30 selection:text-white relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CanvasRevealEffect
          animationSpeed={3}
          containerClassName="bg-black"
          colors={[[255, 255, 255], [255, 255, 255]]}
          dotSize={6}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.8)_0%,_transparent_100%)]" />
        {dimBackground && <div className="absolute inset-0 bg-black/60" />}
      </div>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between border-b border-white/10 p-4 bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <NavLink to="/" className="text-xl font-bold tracking-tight text-white glow-text">AscendIQ</NavLink>
        <button onClick={handleLogout} className="text-white/60 hover:text-white flex items-center gap-2 text-sm">
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-white/10 p-6 md:flex flex-col gap-6 bg-black/40 backdrop-blur-md sticky top-0 h-screen z-10">
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

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto relative pb-24 md:pb-8 z-10">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-white/10 bg-black/90 backdrop-blur-md z-50 p-2 pb-safe">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                className={`flex flex-col items-center gap-1 p-2 transition-colors ${
                  isActive ? 'text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >
                <Icon size={20} className={isActive ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AppShell;
