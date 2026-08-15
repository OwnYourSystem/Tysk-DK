import React, { useState } from 'react';
import { Search, Volume2, Sparkles, AlertTriangle, ArrowRight, BookOpen, Filter } from 'lucide-react';
import { VOCABULARY_DATABASE } from '../data/contrastiveCurriculum';
import { VocabularyEntry } from '../types';
import { playGermanAudio, speakText } from '../utils/audio';

export const ContrastiveDictionary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'sound_shift' | 'false_friend' | 'verbs' | 'nouns'>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const filteredVocab = VOCABULARY_DATABASE.filter((entry) => {
    const matchesSearch =
      entry.german.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.danish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.soundShiftRule && entry.soundShiftRule.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedFilter === 'sound_shift') return !!entry.soundShiftRule;
    if (selectedFilter === 'false_friend') return entry.cognateType === 'false_friend';
    if (selectedFilter === 'verbs') return entry.partOfSpeech === 'verb';
    if (selectedFilter === 'nouns') return entry.partOfSpeech === 'noun';

    return true;
  });

  const handlePlay = async (entry: VocabularyEntry) => {
    setPlayingId(entry.id);
    try {
      const textToSpeak = entry.germanArticle ? `${entry.germanArticle} ${entry.german}` : entry.german;
      await playGermanAudio(textToSpeak);
    } finally {
      setPlayingId(null);
    }
  };

  const handlePlayDanish = (text: string) => {
    speakText(text, 'da');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Kontrastivt Leksikon (Dansk ↔ Tysk)</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              German-Danish Cognate & Sound Shift Dictionary
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              Byg tysk ordforråd systematisk ved at forbinde ord med deres danske etymologiske søskende og lær reglerne for lydskiftet (Lautverschiebung).
            </p>
          </div>

          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs">
            <div className="text-center">
              <span className="block text-stone-400 text-[10px] uppercase font-bold">Lydregel Z → T</span>
              <span className="font-mono font-bold text-stone-900">Zeit ↔ tid</span>
            </div>
            <div className="w-px h-8 bg-stone-200"></div>
            <div className="text-center">
              <span className="block text-stone-400 text-[10px] uppercase font-bold">Lydregel CH → K/G</span>
              <span className="font-mono font-bold text-stone-900">Buch ↔ bog</span>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Søg på tysk, dansk eller lydregel (f.eks. versuchen, tid, morgenmad)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'Alle ord' },
              { id: 'sound_shift', label: '⚡ Lydskifte (Lydregler)' },
              { id: 'false_friend', label: '⚠️ Falske venner' },
              { id: 'verbs', label: 'Verber' },
              { id: 'nouns', label: 'Substantiver' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id as any)}
                className={`text-xs px-3 py-2 rounded-xl font-medium transition-all ${
                  selectedFilter === f.id
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVocab.map((entry) => {
          const isFalseFriend = entry.cognateType === 'false_friend';
          return (
            <div
              key={entry.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all hover:shadow-sm space-y-3 flex flex-col justify-between ${
                isFalseFriend ? 'border-red-200 bg-red-50/20' : 'border-stone-200'
              }`}
            >
              <div className="space-y-3">
                {/* Top bar with tags */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider bg-stone-100 text-stone-600 border border-stone-200">
                      {entry.partOfSpeech}
                    </span>
                    {isFalseFriend && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Falsk Ven
                      </span>
                    )}
                    {entry.soundShiftRule && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                        Lydskifte
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-stone-400 italic">{entry.english}</span>
                </div>

                {/* Main German ↔ Danish Comparison Row */}
                <div className="grid grid-cols-2 gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                  {/* German side */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">🇩🇪 Tysk</span>
                      <button
                        onClick={() => handlePlay(entry)}
                        disabled={playingId === entry.id}
                        className="p-1 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors"
                        title="Hør tysk udtale"
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${playingId === entry.id ? 'text-amber-600 animate-pulse' : ''}`} />
                      </button>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      {entry.germanArticle && (
                        <span className="text-xs font-mono font-bold text-amber-700">{entry.germanArticle}</span>
                      )}
                      <span className="text-base font-bold text-stone-900 font-mono">{entry.german}</span>
                    </div>
                  </div>

                  {/* Danish side */}
                  <div className="space-y-1 border-l border-stone-200 pl-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">🇩🇰 Dansk</span>
                      <button
                        onClick={() => handlePlayDanish(entry.danish)}
                        className="p-1 rounded-md text-stone-400 hover:text-stone-800 transition-colors"
                        title="Hør dansk udtale"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      {entry.danishArticle && (
                        <span className="text-xs font-mono font-medium text-stone-500">{entry.danishArticle}</span>
                      )}
                      <span className="text-base font-bold text-stone-800">{entry.danish}</span>
                    </div>
                  </div>
                </div>

                {/* Sound Shift Rule Explanation */}
                {entry.soundShiftRule && (
                  <div className="bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{entry.soundShiftRule}</span>
                  </div>
                )}

                {/* False Friend Warning */}
                {entry.falseFriendWarning && (
                  <div className="bg-red-50 p-2.5 rounded-lg border border-red-200 text-xs text-red-900 flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{entry.falseFriendWarning}</span>
                  </div>
                )}

                {/* Example Sentences */}
                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-stone-500 shrink-0 font-mono">🇩🇪</span>
                    <span className="text-stone-800 font-medium">{entry.exampleGerman}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-stone-400 shrink-0 font-mono">🇩🇰</span>
                    <span className="text-stone-600">{entry.exampleDanish}</span>
                  </div>
                </div>
              </div>

              {entry.notes && (
                <div className="pt-2 mt-2 border-t border-stone-100 text-[11px] text-stone-500">
                  <span className="font-semibold text-stone-700">Tip: </span>
                  {entry.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredVocab.length === 0 && (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-500 space-y-2">
          <p className="font-semibold text-base text-stone-800">Ingen ord matcher din søgning</p>
          <p className="text-xs">Prøv at søge på et tysk ord, dansk ord eller en anden kategori.</p>
        </div>
      )}
    </div>
  );
};
