import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAnalysis } from '../analysis';

const AnalysisRequired = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { record, loading, checked } = useAnalysis();

  if (loading || !checked) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5 text-indigo-100">
          <Loader2 className="animate-spin" size={20} />
          <span>Loading your latest AscendIQ analysis...</span>
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
