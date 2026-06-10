import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Target, Zap } from 'lucide-react';
import { CanvasRevealEffect, MiniNavbar } from '../components/ui/sign-in-flow-1';

const Landing = () => {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen text-center bg-black relative flex flex-col selection:bg-white/30 selection:text-white">
      <MiniNavbar />
      
      <div className="absolute inset-0 z-0">
        <CanvasRevealEffect
          animationSpeed={3}
          containerClassName="bg-black"
          colors={[[255, 255, 255], [255, 255, 255]]}
          dotSize={6}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.8)_0%,_transparent_100%)]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <section className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/80 mb-8 animate-fade-in backdrop-blur-md">
            <Sparkles size={16} />
            <span>Your AI-Powered Career Operating System</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 tracking-tight text-white glow-text animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Forge Your <br />
            <span className="text-white">Future Career</span>
          </h1>

          <p className="text-xl text-white/60 max-w-2xl mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            AscendIQ uses multi-agent AI to analyze your profile, generate personalized roadmaps,
            match you with opportunities, and mentor you toward professional excellence.
          </p>

          <div className="flex flex-col md:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => navigate('/login')}
              className="relative group w-full sm:w-auto"
            >
              <div className="absolute inset-0 -m-1 rounded-full hidden sm:block bg-gray-100 opacity-20 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-40 group-hover:blur-xl group-hover:-m-2"></div>
              <div className="relative z-10 bg-white text-black px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                Get Started <ArrowRight size={20} />
              </div>
            </button>
            <button
              onClick={scrollToHowItWorks}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-full text-lg font-bold transition-all backdrop-blur-sm"
            >
              How it Works
            </button>
          </div>
        </section>

        <section id="how-it-works" className="px-6 pb-20 scroll-mt-24 pt-24 bg-gradient-to-b from-transparent to-black">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white glow-text">How AscendIQ Works</h2>
            <p className="text-white/50 max-w-2xl mx-auto text-lg">
              Upload your profile once, then let the mentor agents turn it into an actionable career plan.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={<Zap className="text-white" />}
              title="AI Skill Assessment"
              desc="Get a quantified Career Health Score based on your real-world experience."
            />
            <FeatureCard
              icon={<Target className="text-white" />}
              title="Personalized Roadmaps"
              desc="Step-by-step growth plans tailored to your specific career goals."
            />
            <FeatureCard
              icon={<Sparkles className="text-white" />}
              title="Mentor Guidance"
              desc="An intelligent agent that synthesizes all insights into strategic actions."
            />
          </div>
        </section>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="glass-panel glass-panel-hover p-8 text-left group">
    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-white/50 leading-relaxed">{desc}</p>
  </div>
);

export default Landing;
