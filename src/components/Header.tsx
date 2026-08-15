import React from 'react';
import { MessageSquare, Microscope, BookOpen, Scale, AlertTriangle, Dumbbell, Compass, Volume2 } from 'lucide-react';

export type AppTab = 'chat' | 'lab' | 'dictionary' | 'syntax' | 'false_friends' | 'drills' | 'lessons';

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'chat' as AppTab, label: 'Tutor Chat', icon: MessageSquare, badge: 'AI Live' },
    { id: 'lab' as AppTab, label: '3-Part Correction Lab', icon: Microscope, badge: 'Lens' },
    { id: 'syntax' as AppTab, label: 'Syntax Arena', icon: Scale },
    { id: 'false_friends' as AppTab, label: 'Falske Venner', icon: AlertTriangle, badge: 'Radar' },
    { id: 'dictionary' as AppTab, label: 'Contrastive Lexicon', icon: BookOpen },
    { id: 'drills' as AppTab, label: 'Bridge Drills', icon: Dumbbell },
    { id: 'lessons' as AppTab, label: 'Roadmap', icon: Compass },
  ];

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Cognitive Bridge Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-amber-500 to-stone-900 flex items-center justify-center text-white font-bold shadow-sm">
              <span className="text-xs tracking-wider">DE|DA</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-stone-900 tracking-tight">Tysk via Dansk</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                  Dansk B2 → Tysk A1-B1
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                Cognitive bridge pedagogy: Lær tysk via dine eksisterende danskkundskaber
              </p>
            </div>
          </div>

          {/* Quick Bridge Status Indicator */}
          <div className="hidden lg:flex items-center gap-3 text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-stone-600">
            <span className="flex items-center gap-1 font-medium text-stone-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              3-Part Correction Lens Active
            </span>
            <span className="text-stone-300">|</span>
            <span>V2 & False Friend Radar</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto scrollbar-none py-1 border-t border-stone-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full uppercase tracking-wider font-semibold ${
                      isActive
                        ? 'bg-stone-800 text-amber-300 border border-stone-700'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
