import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../auth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/upload';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        setNotice('Login successful. Opening your workspace...');
        navigate(from, { replace: true });
      } else {
        const message = await signup(email, password);
        setNotice(message);
        setMode('login');
        setPassword('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_0.95fr] bg-slate-950">
      <section className="relative min-h-[42vh] lg:min-h-screen overflow-hidden px-6 py-10 flex flex-col justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.28),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(244,63,94,0.18),transparent_28%)]" />
        <div className="absolute inset-0 bg-slate-950/45" />
        <div className="relative z-10">
          <button
            onClick={() => navigate('/')}
            className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent"
          >
            AscendIQ
          </button>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-indigo-100 mb-6">
            <ShieldCheck size={16} />
            JWT-secured career workspace
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5">
            Sign in to shape your next career move.
          </h1>
          <p className="text-lg text-slate-300 max-w-xl">
            Keep your profile, roadmap, opportunities, and interview prep protected behind your AscendIQ account.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-sm font-medium text-indigo-300 mb-2">Welcome</p>
            <h2 className="text-3xl font-bold">{mode === 'login' ? 'Log in' : 'Create account'}</h2>
            <p className="mt-2 text-slate-400">
              {mode === 'login'
                ? 'Use your email and password to continue.'
                : 'Start with an email and a secure password.'}
            </p>
          </div>

          <div className="grid grid-cols-2 rounded-xl bg-slate-900 p-1 mb-6 border border-slate-800">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                mode === 'login' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                mode === 'signup' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-2">
                <Mail size={16} /> Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-2">
                <LockKeyhole size={16} /> Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40"
                placeholder="At least 8 characters"
              />
            </label>

            {notice && (
              <div className="flex gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                <CheckCircle2 className="mt-0.5 shrink-0" size={16} />
                <p>{notice}</p>
              </div>
            )}
            {error && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;
