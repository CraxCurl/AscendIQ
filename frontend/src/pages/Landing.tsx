import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Target, Zap } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen text-center">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <section className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-indigo-400 mb-8 animate-fade-in">
          <Sparkles size={16} />
          <span>Your AI-Powered Career Operating System</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-extrabold mb-6 tracking-tight">
          Forge Your <br />
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Future Career
          </span>
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mb-12">
          SkillForge uses multi-agent AI to analyze your profile, generate personalized roadmaps,
          match you with opportunities, and mentor you toward professional excellence.
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => navigate('/upload')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all transform hover:scale-105 flex items-center gap-2"
          >
            Get Started <ArrowRight size={20} />
          </button>
          <button
            onClick={scrollToHowItWorks}
            className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all"
          >
            How it Works
          </button>
        </div>
      </section>

      <section id="how-it-works" className="px-6 pb-20 scroll-mt-8">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-3">How SkillForge Works</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Upload your profile once, then let the mentor agents turn it into an actionable career plan.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard
            icon={<Zap className="text-yellow-400" />}
            title="AI Skill Assessment"
            desc="Get a quantified Career Health Score based on your real-world experience."
          />
          <FeatureCard
            icon={<Target className="text-emerald-400" />}
            title="Personalized Roadmaps"
            desc="Step-by-step growth plans tailored to your specific career goals."
          />
          <FeatureCard
            icon={<Sparkles className="text-purple-400" />}
            title="Mentor Guidance"
            desc="An intelligent agent that synthesizes all insights into strategic actions."
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl text-left hover:border-slate-700 transition-colors">
    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

export default Landing;
