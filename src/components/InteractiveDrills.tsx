import React, { useState } from 'react';
import { Dumbbell, CheckCircle2, XCircle, RefreshCw, Sparkles, HelpCircle, ArrowRight, Lightbulb, Volume2 } from 'lucide-react';
import { DrillItem } from '../types';
import { LESSONS_DATABASE } from '../data/contrastiveCurriculum';
import { playGermanAudio } from '../utils/audio';
import { authorizedFetch } from '../auth/firebase';
import { useProgress } from '../progress/ProgressProvider';

const ALL_CURRICULUM_DRILLS = LESSONS_DATABASE.flatMap((l) => l.drills);

export const InteractiveDrills: React.FC = () => {
  const { recordDrillAttempt } = useProgress();
  const [drills, setDrills] = useState<DrillItem[]>(ALL_CURRICULUM_DRILLS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [tokenArrangement, setTokenArrangement] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [score, setScore] = useState(0);

  const activeDrill = drills[currentIdx] || drills[0];

  const handleTokenClick = (token: string) => {
    if (submitted) return;
    if (tokenArrangement.includes(token)) {
      setTokenArrangement(tokenArrangement.filter((t) => t !== token));
    } else {
      setTokenArrangement([...tokenArrangement, token]);
    }
  };

  const handleResetCurrent = () => {
    setSelectedOption(null);
    setTokenArrangement([]);
    setSubmitted(false);
  };

  const handleCheckSentence = () => {
    setSubmitted(true);
    const constructed = tokenArrangement.join(' ').trim();
    const correct = constructed === activeDrill.targetGerman.trim();
    recordDrillAttempt(correct);
    if (correct) {
      setScore((s) => s + 1);
    }
  };

  const handleSelectOption = (opt: string) => {
    if (submitted) return;
    setSelectedOption(opt);
    setSubmitted(true);
    const correct = opt === activeDrill.correctOption;
    recordDrillAttempt(correct);
    if (correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    handleResetCurrent();
    setCurrentIdx((prev) => (prev + 1) % drills.length);
  };

  const handleGenerateAIDrills = async (topic: string) => {
    setIsGenerating(true);
    try {
      const res = await authorizedFetch('/api/tutor/generate-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, type: 'sentence_builder' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.exercises && data.exercises.length > 0) {
          setDrills(data.exercises);
          setCurrentIdx(0);
          handleResetCurrent();
        }
      }
    } catch (e) {
      console.error('Failed to generate dynamic drills:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const isSentenceBuilder = activeDrill.type === 'sentence_builder' && activeDrill.jumbledTokens;
  const isMultipleChoice = !!activeDrill.options;

  const isCorrect = isSentenceBuilder
    ? tokenArrangement.join(' ').trim() === activeDrill.targetGerman.trim()
    : selectedOption === activeDrill.correctOption;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Interaktive Kontrastiv-Træning</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">Danish-German Muscle Memory Drills</h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Træn V2-ordstilling, ledsætninger og kasus i interaktive øvelser med øjeblikkelig kontrastiv feedback.
          </p>
        </div>

        {/* AI Generator CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleGenerateAIDrills('Subordinate clauses with weil/dass and Modal verbs')}
            disabled={isGenerating}
            className="px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 disabled:opacity-50 flex items-center gap-1.5 shadow-xs transition-all whitespace-nowrap"
          >
            {isGenerating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>Generér Nye AI-Øvelser</span>
          </button>
        </div>
      </div>

      {/* Main Drill Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Progress & Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
              {activeDrill.type.replace('_', ' ')}
            </span>
            <h3 className="text-base font-bold text-stone-900">{activeDrill.title}</h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
            Øvelse {currentIdx + 1} af {drills.length}
          </span>
        </div>

        {/* Prompt in Danish */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
            🇩🇰 Dansk udgangspunkt (Hvad du vil sige):
          </span>
          <p className="text-base font-bold text-stone-900">{activeDrill.danishPrompt}</p>
        </div>

        {/* Sentence Builder Interactive Interface */}
        {isSentenceBuilder && (
          <div className="space-y-4">
            <span className="text-xs font-semibold text-stone-700 block">
              Klik på brikkerne for at samle den korrekte tyske sætningsstruktur:
            </span>

            {/* Answer Construction Area */}
            <div className="min-h-[56px] p-3 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50/50 flex flex-wrap gap-2 items-center">
              {tokenArrangement.length === 0 && (
                <span className="text-xs text-stone-400 italic">Klik på ordene herunder for at placere dem...</span>
              )}
              {tokenArrangement.map((token, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTokenClick(token)}
                  className="px-3 py-1.5 rounded-lg bg-stone-900 text-white font-mono text-sm font-semibold shadow-xs hover:bg-red-700 transition-colors"
                  title="Klik for at fjerne"
                >
                  {token}
                </button>
              ))}
            </div>

            {/* Available Tokens */}
            <div className="flex flex-wrap gap-2 pt-1">
              {activeDrill.jumbledTokens?.map((token, idx) => {
                const isUsed = tokenArrangement.includes(token);
                return (
                  <button
                    key={idx}
                    disabled={isUsed || submitted}
                    onClick={() => handleTokenClick(token)}
                    className={`px-3 py-2 rounded-lg font-mono text-sm font-semibold border transition-all ${
                      isUsed
                        ? 'opacity-30 bg-stone-100 border-stone-200 text-stone-400'
                        : 'bg-white border-stone-300 text-stone-800 hover:border-stone-900 hover:shadow-2xs'
                    }`}
                  >
                    {token}
                  </button>
                );
              })}
            </div>

            {!submitted && (
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={handleResetCurrent}
                  className="px-3 py-2 rounded-xl text-xs text-stone-600 hover:text-stone-900"
                >
                  Nulstil
                </button>
                <button
                  disabled={tokenArrangement.length === 0}
                  onClick={handleCheckSentence}
                  className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 disabled:opacity-50 shadow-xs"
                >
                  Tjek Sætning
                </button>
              </div>
            )}
          </div>
        )}

        {/* Multiple Choice Interactive Interface */}
        {isMultipleChoice && (
          <div className="space-y-3">
            <span className="text-xs font-semibold text-stone-700 block">Vælg det korrekte svar:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeDrill.options?.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                let btnStyle = 'bg-white border-stone-200 hover:border-stone-400 text-stone-800';

                if (submitted) {
                  if (opt === activeDrill.correctOption) {
                    btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-red-50 border-red-400 text-red-900';
                  } else {
                    btnStyle = 'opacity-50 border-stone-200';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={submitted}
                    onClick={() => handleSelectOption(opt)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-mono font-medium transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {submitted && opt === activeDrill.correctOption && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Submission Feedback & Contrastive Bridge Explanation */}
        {submitted && (
          <div className="space-y-4 pt-2">
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              <div className="flex items-center gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 shrink-0" />
                )}
                <div>
                  <h4 className="text-sm font-bold">{isCorrect ? 'Fremragende! Rigtigt svar.' : 'Ikke helt – her er forklaringen:'}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono font-bold">🇩🇪 {activeDrill.targetGerman}</span>
                    <button
                      onClick={() => playGermanAudio(activeDrill.targetGerman)}
                      className="p-1 rounded text-stone-600 hover:text-stone-900"
                      title="Udtale"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Cognitive Bridge Explainer */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Den Kontrastive Bro (Tysk vs Dansk):</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">{activeDrill.contrastiveBridge}</p>

              {activeDrill.falseFriendWarning && (
                <div className="text-xs text-red-700 font-medium pt-1">
                  ⚠️ {activeDrill.falseFriendWarning}
                </div>
              )}
            </div>

            <div className="text-right">
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 shadow-xs transition-all"
              >
                Næste Øvelse →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
