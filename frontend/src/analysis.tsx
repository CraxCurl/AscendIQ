import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getAnalysis, type AnalysisRecord } from './api';
import { useAuth } from './auth';

type AnalysisContextValue = {
  record: AnalysisRecord | null;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  setRecord: (record: AnalysisRecord | null) => void;
};

const AnalysisContext = createContext<AnalysisContextValue | undefined>(undefined);

export const AnalysisProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, isAuthenticated } = useAuth();
  const [record, setRecord] = useState<AnalysisRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = async () => {
    if (!token) {
      setRecord(null);
      return;
    }

    setLoading(true);
    setError('');
    try {
      setRecord(await getAnalysis(token));
    } catch (err) {
      setRecord(null);
      setError(err instanceof Error ? err.message : 'Profile analysis is required.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      void refresh();
    } else {
      setRecord(null);
      setError('');
    }
  }, [isAuthenticated, token]);

  const value = useMemo(
    () => ({ record, loading, error, refresh, setRecord }),
    [record, loading, error]
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
