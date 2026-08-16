import React from 'react';
import { AlertTriangle, BookOpen, Cloud, CloudOff, Compass, Dumbbell, LogOut, MessageSquare, Microscope, Scale } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useProgress } from '../progress/ProgressProvider';

export type AppTab = 'chat' | 'lab' | 'dictionary' | 'syntax' | 'false_friends' | 'drills' | 'lessons';

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const { user, signOutUser } = useAuth();
  const { progress, syncState } = useProgress();
  const tabs = [
    { id: 'chat' as AppTab, label: 'Tutor Chat', mobileLabel: 'Tutor', icon: MessageSquare, badge: 'AI Live' },
    { id: 'lab' as AppTab, label: '3-Part Correction Lab', mobileLabel: 'Correct', icon: Microscope, badge: 'Lens' },
    { id: 'syntax' as AppTab, label: 'Syntax Arena', mobileLabel: 'Syntax', icon: Scale },
    { id: 'false_friends' as AppTab, label: 'Falske Venner', mobileLabel: 'Friends', icon: AlertTriangle, badge: 'Radar' },
    { id: 'dictionary' as AppTab, label: 'Contrastive Lexicon', mobileLabel: 'Lexicon', icon: BookOpen },
    { id: 'drills' as AppTab, label: 'Bridge Drills', mobileLabel: 'Drills', icon: Dumbbell },
    { id: 'lessons' as AppTab, label: 'Roadmap', mobileLabel: 'Roadmap', icon: Compass },
  ];
  const mobileTabs = tabs.filter((tab) => ['chat', 'lab', 'drills', 'lessons', 'dictionary'].includes(tab.id));

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 min-w-0">
            <img src="/icons/icon-192.png" alt="" className="w-10 h-10 rounded-xl shadow-sm shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-semibold text-stone-900 tracking-tight truncate">OYS Language Pal</h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                  Dansk B2 → Tysk A1-B1
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">Lær tysk via dine eksisterende danskkundskaber</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className={`hidden sm:flex items-center gap-1 text-xs ${syncState === 'error' ? 'text-red-700' : 'text-stone-500'}`}>
              {syncState === 'error' ? <CloudOff className="w-4 h-4" /> : <Cloud className="w-4 h-4" />}
              {syncState === 'saving' ? 'Syncing…' : `${progress.correctAnswers}/${progress.drillAttempts} correct`}
            </span>
            <button type="button" onClick={() => void signOutUser()} className="min-w-11 min-h-11 rounded-xl text-stone-500 hover:bg-stone-100 grid place-items-center" title={`Sign out ${user.email ?? ''}`} aria-label="Sign out">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="hidden md:flex space-x-1 overflow-x-auto scrollbar-none py-1 border-t border-stone-100" aria-label="Main navigation">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} id={`tab-${tab.id}`} onClick={() => onTabChange(tab.id)} className={`min-h-11 flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${isActive ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'}`} aria-current={isActive ? 'page' : undefined}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold ${isActive ? 'bg-stone-800 text-amber-300 border border-stone-700' : 'bg-stone-200 text-stone-700'}`}>{tab.badge}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <nav className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-white/95 backdrop-blur border-t border-stone-200 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 grid grid-cols-5 shadow-[0_-8px_24px_rgba(28,25,23,0.08)]" aria-label="Mobile navigation">
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} type="button" onClick={() => onTabChange(tab.id)} className={`min-h-14 rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] font-semibold ${isActive ? 'bg-stone-900 text-white' : 'text-stone-600'}`} aria-current={isActive ? 'page' : undefined}>
              <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-stone-500'}`} />
              <span>{tab.mobileLabel}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
