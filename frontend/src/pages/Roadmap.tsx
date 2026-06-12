import React, { useState } from 'react';
import { CheckCircle2, Circle, ArrowRight, PlayCircle, Code2, ChevronDown, X, ExternalLink, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AppShell from '../components/AppShell';
import { useAnalysis } from '../analysis';
import { useAuth } from '../auth';
import { exploreMilestone, updateRoadmap } from '../api';
import { CanvasRevealEffect } from '../components/ui/sign-in-flow-1';
import { GlowButton } from '../components/ui/glow-button';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Roadmap() {
  const { record, setRecord } = useAnalysis();
  const { token } = useAuth();
  const milestones = record?.analysis?.roadmap ?? [];
  const profile = record!.profile;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  // Modal State
  const [activeMilestone, setActiveMilestone] = useState<any | null>(null);
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState<number | null>(null);
  const [isExploring, setIsExploring] = useState(false);
  const [explorationData, setExplorationData] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStartLearning = async (m: any, index: number) => {
    setActiveMilestone(m);
    setActiveMilestoneIndex(index);
    setExplorationData(null);
    setIsExploring(true);

    try {
      if (!token) return;
      const data = await exploreMilestone(token, m.title, m.description);
      setExplorationData(data);
    } catch (err) {
      console.error(err);
      setExplorationData({
        overview: "Failed to generate learning path. You can still mark this as completed.",
        action_steps: ["Focus on " + m.title],
        resources: []
      });
    } finally {
      setIsExploring(false);
    }
  };

  const handleComplete = async () => {
    if (activeMilestoneIndex === null || !token) return;
    setIsUpdating(true);

    try {
      const updatedRoadmap = [...milestones];
      updatedRoadmap[activeMilestoneIndex].status = 'completed';
      
      // Find next incomplete milestone and mark it current
      for (let i = activeMilestoneIndex + 1; i < updatedRoadmap.length; i++) {
        if (updatedRoadmap[i].status !== 'completed') {
          updatedRoadmap[i].status = 'current';
          break;
        }
      }

      await updateRoadmap(token, updatedRoadmap);
      
      // Update local state
      if (record) {
        setRecord({
          ...record,
          analysis: { ...record.analysis, roadmap: updatedRoadmap }
        });
      }
      setActiveMilestone(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save progress.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle2 className="text-[#f89f1b] fill-[#f89f1b]/20" size={28} />;
    if (status === 'current') return <PlayCircle className="text-[#f89f1b] animate-pulse" size={28} />;
    return <Circle className="text-white/30" size={28} />;
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

      <div className="relative z-10 max-w-4xl mx-auto py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight glow-text text-white">Your 90-Day Growth Roadmap</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">Track the milestones that move <span className="text-white font-medium">{profile.full_name || 'you'}</span> closer to {profile.target_role} readiness.</p>
        </motion.div>

        {!milestones.length ? (
          <div className="glass-panel p-12 text-center text-white/50 border border-white/10 rounded-3xl">
            <Code2 size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">Run your profile analysis again to generate a 90-day roadmap.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="relative space-y-6 before:absolute before:inset-0 before:ml-10 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent"
          >
            {milestones.map((m: any, i: number) => {
              const isExpanded = expandedIndex === i;
              const isCurrent = m.status === 'current';
              const isCompleted = m.status === 'completed';
              
              return (
                <motion.div key={i} variants={itemVariants} className="relative flex items-start md:justify-center">
                  
                  {/* Timeline Node */}
                  <div className={`absolute left-10 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-black border-4 ${isCurrent ? 'border-[#f89f1b]/30 shadow-[0_0_20px_rgba(248,159,27,0.4)]' : 'border-[#111]'} z-10`}>
                    {getIcon(m.status)}
                  </div>

                  {/* Card Container */}
                  <div className={`w-full md:w-5/12 ml-20 md:ml-0 ${i % 2 === 0 ? 'md:pr-12 md:mr-auto' : 'md:pl-12 md:ml-auto'}`}>
                    <div 
                      onClick={() => setExpandedIndex(isExpanded ? null : i)}
                      className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 border backdrop-blur-xl ${isCurrent ? 'bg-white/10 border-[#f89f1b]/50 shadow-[0_0_30px_rgba(248,159,27,0.15)] hover:border-[#f89f1b]' : 'bg-black/40 border-white/10 hover:bg-white/5 hover:border-white/20'}`}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3 gap-4">
                          <h3 className={`text-xl font-bold leading-tight ${isCurrent ? 'text-white' : (isCompleted ? 'text-[#f89f1b]' : 'text-white/80 group-hover:text-white transition-colors')}`}>
                            {m.title || `Milestone ${i + 1}`}
                          </h3>
                          <span className={`text-xs font-bold tracking-wider uppercase whitespace-nowrap px-3 py-1 rounded-full ${isCurrent ? 'bg-[#f89f1b]/20 text-[#f89f1b]' : 'bg-white/5 text-white/50'}`}>
                            {m.date || `Phase ${i + 1}`}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-white/40 text-sm font-medium mt-4 group-hover:text-white/60 transition-colors">
                          <span>{isExpanded ? 'Hide details' : 'View details'}</span>
                          <ChevronDown size={16} className={`ml-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden bg-black/20"
                          >
                            <div className="p-6 pt-0 border-t border-white/5 mt-2">
                              <p className="text-white/70 leading-relaxed pt-4 mb-6">
                                {m.description || 'Complete this milestone to improve role readiness.'}
                              </p>
                              
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartLearning(m, i);
                                }}
                                disabled={isCompleted}
                                className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-300 ${isCompleted ? 'bg-white/5 text-white/30 cursor-not-allowed' : (isCurrent ? 'bg-gradient-to-r from-[#f89f1b] to-[#fbc16b] text-black hover:shadow-[0_0_20px_rgba(248,159,27,0.4)]' : 'bg-white/10 text-white hover:bg-white/20')}`}
                              >
                                {isCompleted ? 'Completed' : (isCurrent ? 'Start Learning' : 'Explore Concept')} 
                                {!isCompleted && <ArrowRight size={18} />}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Learning Modal */}
        <AnimatePresence>
          {activeMilestone && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl border-white/20"
              >
                <div className="p-6 border-b border-white/10 flex justify-between items-start sticky top-0 bg-black/80 backdrop-blur-xl z-10">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{activeMilestone.title}</h2>
                    <p className="text-[#f89f1b] text-sm font-medium uppercase tracking-wider">{activeMilestone.date}</p>
                  </div>
                  <button 
                    onClick={() => !isUpdating && setActiveMilestone(null)}
                    className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6 flex-1">
                  {isExploring ? (
                    <div className="flex flex-col items-center justify-center py-12 text-white/50">
                      <Loader2 size={40} className="animate-spin mb-4 text-[#f89f1b]" />
                      <p>Generating personalized learning plan...</p>
                    </div>
                  ) : explorationData ? (
                    <div className="space-y-8 animate-fade-in">
                      <div className="bg-[#f89f1b]/10 border border-[#f89f1b]/20 p-4 rounded-xl">
                        <p className="text-white/90 leading-relaxed">{explorationData.overview}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Action Plan</h3>
                        <ul className="space-y-3">
                          {explorationData.action_steps?.map((step: string, idx: number) => (
                            <li key={idx} className="flex gap-3 text-white/70">
                              <span className="text-[#f89f1b] font-bold mt-0.5">{idx + 1}.</span>
                              <span className="leading-relaxed">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {explorationData.resources && explorationData.resources.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4">Recommended Resources</h3>
                          <div className="space-y-2">
                            {explorationData.resources?.map((res: any, idx: number) => (
                              <a 
                                key={idx}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#f89f1b]/50 transition-all group"
                              >
                                <span className="text-white/80 group-hover:text-white font-medium">{res.title}</span>
                                <ExternalLink size={16} className="text-white/40 group-hover:text-[#f89f1b]" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>

                <div className="p-6 border-t border-white/10 bg-black/40 sticky bottom-0 z-10 flex justify-end gap-4">
                  <button 
                    onClick={() => setActiveMilestone(null)}
                    disabled={isUpdating}
                    className="px-6 py-2.5 rounded-xl font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Close
                  </button>
                  <GlowButton 
                    onClick={handleComplete}
                    isLoading={isUpdating}
                    disabled={isExploring || isUpdating}
                  >
                    <CheckCircle2 size={18} className="mr-2" />
                    Mark as Completed
                  </GlowButton>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AppShell>
  );
}
