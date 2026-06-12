import React, { useState } from 'react';
import AppShell from '../components/AppShell';
import { Briefcase, ArrowRight, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { generateCareerPath } from '../api';
import { useAuth } from '../auth';

import { GlowButton } from '../components/ui/glow-button';

export default function CareerPath() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const { token } = useAuth();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) return;
    
    setLoading(true);
    setError('');
    
    try {
      if (!token) return;
      const data = await generateCareerPath(token, resumeFile);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      // Ensure error is a string
      const errMsg = typeof err.message === 'string' ? err.message : 
                     (Array.isArray(err.message) ? JSON.stringify(err.message) : 'Failed to map career path.');
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <header className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-bold tracking-tight glow-text mb-2">Mentor Path Analyzer</h1>
        <p className="text-white/60">Upload the resume (PDF/DOCX) of a senior professional you admire, and our AI will map out the steps to reach their level.</p>
      </header>

      <div className="glass-panel p-8 mb-8 max-w-3xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-white/70 mb-2">Mentor's Resume</label>
            <input 
              type="file" 
              accept=".pdf,.docx"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#f89f1b]/50 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f89f1b]/10 file:text-[#f89f1b] hover:file:bg-[#f89f1b]/20"
              required
            />
          </div>
          <GlowButton 
            type="submit" 
            disabled={!resumeFile}
            isLoading={loading}
            className="w-full sm:w-auto"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Analyze
          </GlowButton>
        </form>
        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}
      </div>

      {result && result.timeline && (
        <div className="max-w-4xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Briefcase className="text-[#f89f1b]" />
            Path to {result.mentor_headline}
          </h2>
          
          <div className="relative pl-8 border-l-2 border-white/10 space-y-8 pb-10">
            {result.timeline.map((step: any, idx: number) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-black border-4 border-[#f89f1b]" />
                
                <div className="glass-panel p-6 hover:border-[#f89f1b]/30 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <h3 className="text-xl font-bold text-white">{step.role_title}</h3>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-white/70">
                      {step.duration}
                    </span>
                  </div>
                  
                  <p className="text-white/80 leading-relaxed mb-6">
                    {step.description}
                  </p>
                  
                  {step.key_skills_to_acquire && step.key_skills_to_acquire.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Key Skills to Master</h4>
                      <div className="flex flex-wrap gap-2">
                        {step.key_skills_to_acquire.map((skill: string, sIdx: number) => (
                          <span key={sIdx} className="px-3 py-1 bg-[#f89f1b]/10 text-[#f89f1b] border border-[#f89f1b]/20 rounded-lg text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
