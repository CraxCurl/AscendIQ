import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Trophy, Users, X } from 'lucide-react';

const teamMembers = [
  'Krishan Yadav',
  'Dhruv Upadhyaya',
  'Sarthak Agrawal',
  'Om Awasthi',
  'Vinayak Tripathi',
];

const AboutMetric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-white/10 bg-black/30 p-3 sm:p-4">
    <p className="text-[10px] sm:text-xs uppercase tracking-widest text-white/35">{label}</p>
    <p className="mt-1 sm:mt-2 text-lg sm:text-xl font-bold text-white">{value}</p>
  </div>
);

export const AboutModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // Set z-index lower than MiniNavbar (z-20) so the navbar stays clickable
          className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pt-24"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            // Made it a bit smaller (max-w-3xl instead of 4xl, max-h-[80vh] instead of 90vh)
            className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0f0f0f] p-6 sm:p-8 shadow-2xl text-left"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 sm:right-6 sm:top-6 rounded-full bg-white/5 p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="mx-auto max-w-3xl">
              <div className="mb-8 text-center mt-2">
                <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 backdrop-blur-md">
                  <Trophy size={14} />
                  <span>Built for Hackathon FarAway</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white glow-text">
                  Developed by Team DigiX
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/55">
                  A focused team building AscendIQ as a career intelligence platform that turns student profiles into actionable growth.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_1.2fr]">
                <div className="glass-panel p-6 text-left">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                    <Code2 className="text-white" size={24} />
                  </div>
                  <p className="text-xs uppercase tracking-[0.32em] text-white/35">Mission</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">Make career prep feel personal.</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">
                    Team DigiX designed AscendIQ to combine resume intelligence, roadmap planning, opportunity matching, and interview prep into one calm, useful workspace.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <AboutMetric label="Team" value="DigiX" />
                    <AboutMetric label="Event" value="FarAway" />
                  </div>
                </div>

                <div className="glass-panel p-6">
                  <div className="mb-5 flex items-center justify-between gap-4 text-left">
                    <div>
                      <p className="text-xs uppercase tracking-[0.32em] text-white/35">Teammates</p>
                      <h3 className="mt-1 text-xl font-bold text-white">The builders</h3>
                    </div>
                    <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 sm:flex">
                      <Users size={18} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                    {teamMembers.map((member, index) => (
                      <div key={member} className="group rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition-all duration-300 hover:border-white/20 hover:bg-white/10">
                        <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
                          {index + 1}
                        </div>
                        <p className="text-base font-semibold text-white">{member}</p>
                        <p className="mt-0.5 text-xs text-white/40">Team DigiX</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
