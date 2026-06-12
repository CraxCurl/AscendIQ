import React, { useState, useRef, useEffect } from 'react';
import { Brain, Code2, MessageCircleQuestion, Send, Bot, User, Loader2 } from 'lucide-react';
import AppShell from '../components/AppShell';
import { useAnalysis } from '../analysis';
import { useAuth } from '../auth';
import { interviewChat } from '../api';

import { CanvasRevealEffect } from '../components/ui/sign-in-flow-1';

const InterviewPrep = () => {
  const { record } = useAnalysis();
  const { token } = useAuth();
  const prep = record!.analysis.interview_prep;

  const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading || !token) return;

    const newMessages = [...messages, { role: 'user' as const, content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await interviewChat(token, newMessages);
      setMessages([...newMessages, { role: 'bot', content: response.reply }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'bot', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  const startInterview = async () => {
    if (loading || !token) return;
    setLoading(true);
    try {
      const response = await interviewChat(token, []);
      setMessages([{ role: 'bot', content: response.reply }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-black"
            colors={[[248, 159, 27], [255, 255, 255]]}
            dotSize={4}
            reverse={false}
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.8)_0%,_rgba(0,0,0,1)_100%)]" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col">
        <header className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold mb-3 tracking-tight glow-text text-white">Interview Prep</h1>
          <p className="text-white/50 text-lg">Focused practice plan for {record!.profile.target_role} technical, coding, and behavioral interviews.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <PrepCard icon={<Brain size={24} />} label="Role Fundamentals" value={`${prep.ml_fundamentals}%`} detail="Core concepts to explain clearly" />
          <PrepCard icon={<Code2 size={24} />} label="Coding Readiness" value={`${prep.coding_readiness}%`} detail="Problem-solving consistency signal" />
          <PrepCard icon={<MessageCircleQuestion size={24} />} label="Story Bank" value={`${prep.story_bank}%`} detail="Behavioral examples from your profile" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <section className="glass-panel p-6 h-[600px] flex flex-col">
            <h2 className="text-xl font-semibold mb-6 text-white">Next Practice Questions</h2>
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {prep.questions.map((question) => (
                <div key={question.prompt} className="glass-panel glass-panel-hover p-5 border-white/5">
                  <p className="text-xs uppercase font-bold text-white/40 mb-3 tracking-wider">{question.type}</p>
                  <p className="text-white/80 leading-relaxed text-lg">{question.prompt}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel p-6 h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h2 className="text-xl font-semibold text-white">AI Interview Coach</h2>
              {messages.length === 0 && (
                <button 
                  onClick={startInterview}
                  className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full transition-colors"
                >
                  Start Mock Interview
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-white/40">
                  <Bot size={48} className="mb-4 opacity-50" />
                  <p>Click "Start Mock Interview" or say hi to begin practicing.</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-white/10' : 'bg-white/5 border border-white/10'}`}>
                      {msg.role === 'user' ? <User size={16} className="text-white/70" /> : <Bot size={16} className="text-white/70" />}
                    </div>
                    <div className={`p-3 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-[#1a1a1a] border border-white/5 text-white/80'}`}>
                      <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Bot size={16} className="text-white/70" />
                  </div>
                  <div className="p-4 rounded-2xl bg-[#1a1a1a] border border-white/5">
                    <Loader2 size={16} className="animate-spin text-white/40" />
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSend} className="relative mt-auto shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your response..."
                className="w-full bg-[#111] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </form>
          </section>
        </div>
      </div>
    </AppShell>
  );
};

const PrepCard = ({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) => (
  <div className="glass-panel p-6 group">
    <div className="text-white/40 mb-4 group-hover:text-white/70 transition-colors">{icon}</div>
    <p className="text-sm font-medium uppercase tracking-wide text-white/40">{label}</p>
    <p className="text-4xl font-bold mt-2 text-white glow-text">{value}</p>
    <p className="text-sm text-white/50 mt-3">{detail}</p>
  </div>
);

export default InterviewPrep;
