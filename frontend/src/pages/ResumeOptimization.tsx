import React, { useState } from 'react';
import { CheckCircle2, FileText, Search, Send, Download, Loader2, MessageSquare } from 'lucide-react';
import AppShell from '../components/AppShell';
import { useAnalysis } from '../analysis';
import { chatResumeBuilder, generateDocx } from '../api';
import { useAuth } from '../auth';

const ResumeOptimization = () => {
  const { record } = useAnalysis();
  const { token } = useAuth();
  const feedback = record!.analysis.resume_feedback;

  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: "Hi! I'm your AI Resume Builder. Tell me what you'd like to update on your resume, or ask me to add one of your missing keywords." }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isDocxLoading, setIsDocxLoading] = useState(false);
  const [currentResumeText, setCurrentResumeText] = useState(record?.profile?.resume_text || '');

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !token) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsChatLoading(true);

    try {
      const response = await chatResumeBuilder(
        token,
        userMessage,
        currentResumeText,
        record?.profile?.target_role,
        feedback?.missing_keywords
      );

      setCurrentResumeText(response.updated_resume_text);
      setChatHistory(prev => [...prev, { role: 'ai', content: response.response_message }]);
    } catch (error) {
      console.error('Failed to chat:', error);
      setChatHistory(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleDownloadDocx = async () => {
    if (!token || !currentResumeText) return;
    setIsDocxLoading(true);
    try {
      const blob = await generateDocx(token, currentResumeText);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Optimized_Resume.docx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download DOCX:', error);
    } finally {
      setIsDocxLoading(false);
    }
  };

  return (
    <AppShell>
      <header className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-bold mb-3 tracking-tight glow-text text-white">Resume Optimization</h1>
        <p className="text-white/50 text-lg">ATS readiness, missing keywords, and rewrite priorities for {record!.profile.target_role} applications.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <ScoreCard label="ATS Score" value={`${feedback.ats_score}`} detail="AI-estimated resume readiness" />
        <ScoreCard label="Keyword Coverage" value={`${feedback.keyword_coverage}%`} detail={`${feedback.missing_keywords.length} high-value terms to review`} />
        <ScoreCard label="Project Proof" value={`${feedback.project_proof}%`} detail="Strength of measurable outcomes and project evidence" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <section className="glass-panel p-6">
          <h2 className="text-xl font-semibold mb-6 text-white">Missing Keywords</h2>
          <div className="flex flex-wrap gap-3">
            {feedback.missing_keywords.map((keyword) => (
              <span key={keyword} className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/5">
                {keyword}
              </span>
            ))}
          </div>
        </section>

        <section className="glass-panel p-6">
          <h2 className="text-xl font-semibold mb-6 text-white">Rewrite Priorities</h2>
          <div className="space-y-4">
            {feedback.suggestions.map((suggestion) => (
              <div key={suggestion} className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                <CheckCircle2 className="mt-0.5 text-white/50 shrink-0" size={18} />
                <p className="text-sm text-white/70 leading-relaxed">{suggestion}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="glass-panel p-6 animate-slide-up flex flex-col md:flex-row gap-8" style={{ animationDelay: '0.3s' }}>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30 text-accent">
                <MessageSquare size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Resume Builder AI</h2>
                <p className="text-sm text-white/50">Chat to refine your resume automatically</p>
              </div>
            </div>
            <button
              onClick={handleDownloadDocx}
              disabled={isDocxLoading || !currentResumeText}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDocxLoading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
              Export DOCX
            </button>
          </div>

          <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col mb-4 min-h-[300px] max-h-[400px] overflow-y-auto space-y-4">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-accent/20 text-accent border border-accent/20 rounded-tr-sm' 
                    : 'bg-white/10 text-white/90 border border-white/10 rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-white/10 text-white/90 border border-white/10 rounded-tl-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-white/50" />
                  <span className="text-sm text-white/50">Updating resume...</span>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="e.g., 'Add a bullet about my Python API project...'"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder-white/30 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
              disabled={isChatLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!chatInput.trim() || isChatLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white disabled:opacity-50 disabled:hover:text-white/50 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </section>
    </AppShell>
  );
};

const ScoreCard = ({ label, value, detail }: { label: string; value: string; detail: string }) => (
  <div className="glass-panel p-6 group">
    <div className="flex items-center gap-2 text-white/40 mb-3 uppercase tracking-wide">
      {label === 'ATS Score' ? <FileText size={18} /> : <Search size={18} />}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <p className="text-4xl font-bold text-white glow-text">{value}</p>
    <p className="text-sm text-white/50 mt-3">{detail}</p>
  </div>
);

export default ResumeOptimization;
