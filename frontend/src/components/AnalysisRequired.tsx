import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAnalysis } from '../analysis';

const AnalysisRequired = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { record, loading, checked } = useAnalysis();

  if (loading || !checked) {
    return (
      <div className="min-h-screen bg-black px-6 py-12 text-white relative selection:bg-white/30 selection:text-white">
        <div className="absolute top-0 left-1/4 w-1/2 h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-5 text-white backdrop-blur-md animate-fade-in">
          <Loader2 className="animate-spin text-white" size={20} />
          <span className="font-medium">Loading your latest AscendIQ analysis...</span>
        </div>
      </div>
    );
  }

  if (!record) {
    return <Navigate to="/upload" replace state={{ from: location, banner: 'Complete your profile to unlock analytics.' }} />;
  }

  return <>{children}</>;
};

export default AnalysisRequired;
