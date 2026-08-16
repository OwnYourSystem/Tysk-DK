import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AppTab } from '../components/Header';
import { authorizedFetch } from '../auth/firebase';

export interface LearningProgress {
  activeTab: AppTab;
  drillAttempts: number;
  correctAnswers: number;
  completedLessonIds: string[];
  updatedAt?: string;
}

const DEFAULT_PROGRESS: LearningProgress = {
  activeTab: 'chat',
  drillAttempts: 0,
  correctAnswers: 0,
  completedLessonIds: [],
};
const LOCAL_PROGRESS_KEY = 'oys-language-progress';

interface ProgressContextValue {
  progress: LearningProgress;
  loading: boolean;
  syncState: 'idle' | 'saving' | 'saved' | 'error';
  setActiveTab: (tab: AppTab) => void;
  recordDrillAttempt: (correct: boolean) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error('useProgress must be used inside ProgressProvider.');
  return value;
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [loading, setLoading] = useState(true);
  const [syncState, setSyncState] = useState<ProgressContextValue['syncState']>('idle');

  useEffect(() => {
    const cached = localStorage.getItem(LOCAL_PROGRESS_KEY);
    if (cached) {
      try { setProgress({ ...DEFAULT_PROGRESS, ...JSON.parse(cached) }); } catch { /* Ignore damaged local state. */ }
    }
    authorizedFetch('/api/progress')
      .then(async (response) => {
        if (!response.ok) throw new Error('Progress could not be loaded.');
        const cloudProgress = { ...DEFAULT_PROGRESS, ...(await response.json()) };
        setProgress(cloudProgress);
        localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(cloudProgress));
      })
      .catch(() => setSyncState('error'))
      .finally(() => setLoading(false));
  }, []);

  const save = useCallback(async (patch: Partial<LearningProgress>) => {
    setSyncState('saving');
    try {
      const response = await authorizedFetch('/api/progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!response.ok) throw new Error('Progress could not be saved.');
      setSyncState('saved');
    } catch {
      setSyncState('error');
    }
  }, []);

  const setActiveTab = useCallback((activeTab: AppTab) => {
    setProgress((current) => {
      const next = { ...current, activeTab };
      localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(next));
      return next;
    });
    void save({ activeTab });
  }, [save]);

  const recordDrillAttempt = useCallback((correct: boolean) => {
    setProgress((current) => {
      const next = {
        ...current,
        drillAttempts: current.drillAttempts + 1,
        correctAnswers: current.correctAnswers + (correct ? 1 : 0),
      };
      localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(next));
      void save({ drillAttempts: next.drillAttempts, correctAnswers: next.correctAnswers });
      return next;
    });
  }, [save]);

  const value = useMemo(() => ({ progress, loading, syncState, setActiveTab, recordDrillAttempt }), [progress, loading, syncState, setActiveTab, recordDrillAttempt]);
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
