import React, { useState } from 'react';
import { Compass, CheckCircle2, ArrowRight, BookOpen, AlertTriangle, Scale, Dumbbell } from 'lucide-react';
import { LESSONS_DATABASE, VOCABULARY_DATABASE, SYNTAX_RULES_DATABASE, FALSE_FRIENDS_DATABASE } from '../data/contrastiveCurriculum';
import { LessonModule } from '../types';

interface LessonRoadmapProps {
  onSelectLessonDrill?: (lesson: LessonModule) => void;
  onOpenSyntax?: () => void;
  onOpenFalseFriends?: () => void;
}

export const LessonRoadmap: React.FC<LessonRoadmapProps> = ({
  onSelectLessonDrill,
  onOpenSyntax,
  onOpenFalseFriends,
}) => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(LESSONS_DATABASE[0].id);
  const activeLesson = LESSONS_DATABASE.find((l) => l.id === selectedLessonId) || LESSONS_DATABASE[0];

  const lessonVocabs = VOCABULARY_DATABASE.filter((v) => activeLesson.vocabIds.includes(v.id));
  const lessonSyntax = SYNTAX_RULES_DATABASE.filter((s) => activeLesson.syntaxRuleIds.includes(s.id));
  const lessonFalseFriends = FALSE_FRIENDS_DATABASE.filter((f) => activeLesson.falseFriendIds.includes(f.id));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
              <Compass className="w-3.5 h-3.5" />
              <span>Dansk B2 → Tysk Læreplan</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Contrastive Learning Roadmap (Modul for Modul)
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              En skræddersyet progression bygget specifikt til en elev, der mestrer dansk på B2-niveau og vil lære tysk uden at gentage unødvendige begynderfejl.
            </p>
          </div>
        </div>
      </div>

      {/* Modules Horizontal / Vertical Stepper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Module List */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block px-1">
            Læringsmoduler:
          </span>
          <div className="space-y-2">
            {LESSONS_DATABASE.map((lesson) => {
              const isSelected = selectedLessonId === lesson.id;
              return (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLessonId(lesson.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-stone-900 border-stone-900 text-white shadow-xs'
                      : 'bg-white border-stone-200 text-stone-800 hover:bg-stone-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.2 rounded-full font-mono font-bold uppercase ${
                        isSelected ? 'bg-amber-400 text-stone-900' : 'bg-stone-100 text-stone-700'
                      }`}>
                        Modul {lesson.number}
                      </span>
                      <span className={`text-[10px] ${isSelected ? 'text-stone-400' : 'text-stone-400'}`}>
                        {lesson.level}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold leading-snug">{lesson.title}</h4>
                    <p className={`text-[11px] ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                      🇩🇰 {lesson.danishTitle}
                    </p>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 mt-1 ${isSelected ? 'text-amber-400' : 'text-stone-300'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Module In-Depth Overview */}
        <div className="lg:col-span-8 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Header of Active Module */}
            <div className="border-b border-stone-100 pb-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  Modul {activeLesson.number}
                </span>
                <span className="text-xs text-stone-500">{activeLesson.level}</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900">{activeLesson.title}</h3>
              <p className="text-xs font-semibold text-stone-500">🇩🇰 {activeLesson.danishTitle}</p>
              <p className="text-xs sm:text-sm text-stone-700 pt-1 leading-relaxed">{activeLesson.description}</p>
            </div>

            {/* Contrastive Focus Pill */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 flex items-start gap-2.5">
              <Compass className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800 block">
                  Kognitivt Fokus:
                </span>
                <p className="mt-0.5">{activeLesson.contrastiveFocus}</p>
              </div>
            </div>

            {/* Syntax Rules in this Lesson */}
            {lessonSyntax.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-stone-400" />
                  <span>Syntaksregler i dette modul:</span>
                </span>
                <div className="space-y-2">
                  {lessonSyntax.map((sr) => (
                    <div key={sr.id} className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1">
                      <div className="font-bold text-stone-900">{sr.titleGerman}</div>
                      <p className="text-stone-600">{sr.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* False Friends to Watch Out For */}
            {lessonFalseFriends.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  <span>Kritiske Falske Venner i dette modul:</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {lessonFalseFriends.map((ff) => (
                    <div key={ff.id} className="bg-red-50/80 p-3 rounded-xl border border-red-200 text-xs space-y-1">
                      <div className="font-mono font-bold text-red-900">🇩🇪 {ff.germanWord} ↔ 🇩🇰 {ff.danishWord}</div>
                      <p className="text-stone-700 text-[11px]">{ff.trapExplanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Core Vocabulary with Danish Cognate Mappings */}
            {lessonVocabs.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                  <span>Kerneordforråd (Tysk ↔ Dansk):</span>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {lessonVocabs.map((v) => (
                    <div key={v.id} className="bg-stone-50 p-2.5 rounded-lg border border-stone-200 text-xs">
                      <div className="font-mono font-bold text-stone-900">
                        {v.germanArticle ? `${v.germanArticle} ` : ''}{v.german}
                      </div>
                      <div className="text-stone-500 text-[11px]">🇩🇰 {v.danish}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
