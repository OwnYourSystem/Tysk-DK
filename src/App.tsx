import React, { useState } from 'react';
import { Header, AppTab } from './components/Header';
import { TutorChat } from './components/TutorChat';
import { CorrectionLab } from './components/CorrectionLab';
import { ContrastiveDictionary } from './components/ContrastiveDictionary';
import { SyntaxArena } from './components/SyntaxArena';
import { FalseFriendsRadar } from './components/FalseFriendsRadar';
import { InteractiveDrills } from './components/InteractiveDrills';
import { LessonRoadmap } from './components/LessonRoadmap';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('chat');

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-stone-900">
      {/* Top Navigation Header */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'chat' && <TutorChat />}
        {activeTab === 'lab' && <CorrectionLab />}
        {activeTab === 'syntax' && <SyntaxArena />}
        {activeTab === 'false_friends' && <FalseFriendsRadar />}
        {activeTab === 'dictionary' && <ContrastiveDictionary />}
        {activeTab === 'drills' && <InteractiveDrills />}
        {activeTab === 'lessons' && (
          <LessonRoadmap
            onOpenSyntax={() => setActiveTab('syntax')}
            onOpenFalseFriends={() => setActiveTab('false_friends')}
          />
        )}
      </main>

      {/* Footer / Cognitive Bridge Reference Bar */}
      <footer className="bg-white border-t border-stone-200 py-4 px-6 text-xs text-stone-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">Tysk via Dansk</span>
            <span>•</span>
            <span>Pedagogical Cognitive Bridge for Danish B2 Speakers</span>
          </div>
          <div className="flex items-center gap-3 text-stone-400">
            <span>🇩🇰 B2 → 🇩🇪 A1-B1</span>
            <span>•</span>
            <span>V2-Syntax & 3-Part Lens Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
