import React, { useState } from 'react';
import { Microscope, Sparkles, Volume2, ArrowRight, AlertOctagon, CheckCircle2, BookOpen, Lightbulb, RefreshCw } from 'lucide-react';
import { SentenceAnalysisResult } from '../types';
import { playGermanAudio, speakText } from '../utils/audio';
import { authorizedFetch } from '../auth/firebase';

const PRESET_TRAPS = [
  {
    label: 'Trap 1: Subordinate Verb Order',
    german: 'Ich bleibe heute zu Hause, weil ich bin krank.',
    danish: 'Jeg bliver hjemme i dag, fordi jeg er syg.',
    trapName: 'SVO in Nebensatz (Danish syntax transfer)',
  },
  {
    label: 'Trap 2: "Blive" vs "Bleiben" (State Change)',
    german: 'Nach der langen Reise bleibe ich sehr müde.',
    danish: 'Efter den lange rejse bliver jeg meget træt.',
    trapName: 'Blive = Werden, not Bleiben!',
  },
  {
    label: 'Trap 3: "Må" vs "Müssen / Dürfen"',
    german: 'Ich darf jetzt schnell gehen, weil ich einen Termin habe.',
    danish: 'Jeg må (er nødt til at) gå hurtigt nu, fordi jeg har en aftale.',
    trapName: 'Dürfen (permission) vs Müssen (necessity)',
  },
  {
    label: 'Trap 4: Missing Akkusativ Case',
    german: 'Der Mann kauft der rote Apfel und das Buch.',
    danish: 'Manden køber det røde æble og bogen.',
    trapName: 'Danish lacks noun case inflection',
  },
  {
    label: 'Trap 5: False Friend "Frokost"',
    german: 'Wir treffen uns um 12 Uhr zum Frühstück.',
    danish: 'Vi mødes kl. 12 til frokost.',
    trapName: 'Frühstück = breakfast, Mittagessen = frokost',
  },
];

export const CorrectionLab: React.FC = () => {
  const [germanInput, setGermanInput] = useState('');
  const [danishInput, setDanishInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SentenceAnalysisResult | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const handleAnalyze = async (germanText?: string, danishText?: string) => {
    const textToAnalyze = germanText || germanInput;
    if (!textToAnalyze.trim()) return;

    setLoading(true);
    setAnalysis(null);

    try {
      const res = await authorizedFetch('/api/tutor/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          germanSentence: textToAnalyze,
          intendedMeaningDanish: danishText || danishInput,
        }),
      });

      if (!res.ok) throw new Error('Analysis failed');
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error('Error analyzing sentence:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (preset: (typeof PRESET_TRAPS)[0]) => {
    setGermanInput(preset.german);
    setDanishInput(preset.danish);
    handleAnalyze(preset.german, preset.danish);
  };

  const handlePlayAudio = async (text: string) => {
    setAudioPlaying(true);
    try {
      await playGermanAudio(text);
    } finally {
      setAudioPlaying(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Microscope className="w-3.5 h-3.5" />
              <span>The 3-Part Contrastive Correction Engine</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">Dänisch-Deutsch Interference Diagnostic</h2>
            <p className="text-sm text-stone-300 max-w-2xl">
              Write any German phrase or sentence you want to test. Our tutor decomposes your sentence through a 3-part lens to identify grammar mistakes, detect Danish linguistic transfer, and provide the native German construction.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Traps Explorer */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
          Test Classic Danish-German Traps:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_TRAPS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(preset)}
              className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors text-left flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center justify-between">
              <span>🇩🇪 Your German Sentence (Attempt)</span>
              <span className="text-stone-400 font-normal">What you want to say in German</span>
            </label>
            <textarea
              id="german-sentence-input"
              rows={3}
              value={germanInput}
              onChange={(e) => setGermanInput(e.target.value)}
              placeholder="e.g., Ich bleibe zu Hause weil ich bin müde."
              className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center justify-between">
              <span>🇩🇰 Intended Meaning in Danish (Optional)</span>
              <span className="text-stone-400 font-normal">Hvad du tænker på dansk</span>
            </label>
            <textarea
              id="danish-sentence-input"
              rows={3}
              value={danishInput}
              onChange={(e) => setDanishInput(e.target.value)}
              placeholder="e.g., Jeg bliver hjemme fordi jeg er træt."
              className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              setGermanInput('');
              setDanishInput('');
              setAnalysis(null);
            }}
            className="text-xs text-stone-500 hover:text-stone-800 transition-colors"
          >
            Clear inputs
          </button>

          <button
            id="btn-analyze-sentence"
            disabled={!germanInput.trim() || loading}
            onClick={() => handleAnalyze()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-sm font-semibold shadow-sm transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                <span>Analyzing via 3-Part Lens...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Analyze through Danish Lens</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Output Section */}
      {analysis && (
        <div className="space-y-4">
          {/* Status Header */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              analysis.isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-3">
              {analysis.isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              ) : (
                <AlertOctagon className="w-6 h-6 text-amber-600 shrink-0" />
              )}
              <div>
                <h3 className="text-sm font-bold">
                  {analysis.isCorrect ? 'Natürliches & Korrektes Deutsch!' : 'Syntaktische eller leksikalske rettelser nødvendige'}
                </h3>
                <p className="text-xs opacity-90">
                  {analysis.isCorrect
                    ? 'Your sentence aligns with standard German syntax and vocabulary!'
                    : `Discovered ${analysis.identifiedErrors.length} point(s) of divergence from standard German.`}
                </p>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="text-stone-500 font-medium">Confidence Score:</span>
              <div className="font-bold text-sm">{analysis.confidenceScore}%</div>
            </div>
          </div>

          {/* False Friend Alert if present */}
          {analysis.falseFriendAlert && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl text-red-900">
              <div className="flex items-start gap-2">
                <AlertOctagon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-700">Falsk Ven (False Friend) Registreret!</h4>
                  <p className="text-sm font-medium mt-0.5">{analysis.falseFriendAlert}</p>
                </div>
              </div>
            </div>
          )}

          {/* The 3-Part Lens Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* PART 1: IDENTIFIED ERRORS */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Part 1</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-100 text-red-800">
                    Identified Errors
                  </span>
                </div>

                {analysis.identifiedErrors.length === 0 ? (
                  <p className="text-xs text-stone-500 italic">No grammatical or lexical errors found.</p>
                ) : (
                  <div className="space-y-2.5">
                    {analysis.identifiedErrors.map((err, i) => (
                      <div key={i} className="bg-stone-50 p-2.5 rounded-lg border border-stone-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-red-600 line-through">{err.error}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-200 text-stone-700 uppercase font-semibold">
                            {err.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-stone-600 leading-relaxed">{err.explanation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-400">
                Grammar & case verification
              </div>
            </div>

            {/* PART 2: DANISH TRANSFER DIAGNOSIS */}
            <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Part 2</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                    Danish Transfer Diagnosis
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-stone-700 font-medium">
                    <span>🇩🇰 Danish Interference:</span>
                    <span className={`font-bold ${analysis.danishTransferDiagnosis.isDanishInterference ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {analysis.danishTransferDiagnosis.isDanishInterference ? 'Detected (Dansk overførsel)' : 'None detected'}
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed bg-amber-50/70 p-3 rounded-lg border border-amber-200/60">
                    {analysis.danishTransferDiagnosis.patternDescription}
                  </p>

                  {analysis.danishTransferDiagnosis.danishEquivalent && (
                    <div className="text-xs text-stone-500 pt-1">
                      <span className="font-semibold text-stone-700">Danish anchor: </span>
                      <span className="italic">"{analysis.danishTransferDiagnosis.danishEquivalent}"</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-400">
                Contrastive syntactic mapping
              </div>
            </div>

            {/* PART 3: CORRECT GERMAN & BRIDGE */}
            <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Part 3</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                    Correct German & Bridge
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider block">
                          Native German Form:
                        </span>
                        <p className="text-sm font-bold text-stone-900 mt-0.5 font-mono">
                          {analysis.correction.correctGerman}
                        </p>
                      </div>
                      <button
                        onClick={() => handlePlayAudio(analysis.correction.correctGerman)}
                        disabled={audioPlaying}
                        className="p-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 transition-colors shrink-0 shadow-xs"
                        title="Udtale på tysk"
                      >
                        <Volume2 className={`w-4 h-4 ${audioPlaying ? 'animate-pulse text-amber-600' : ''}`} />
                      </button>
                    </div>

                    <div className="mt-2 pt-2 border-t border-emerald-200/60 text-xs text-stone-600">
                      <span className="font-semibold text-emerald-900">🇩🇰 Dansk modstykke: </span>
                      {analysis.correction.danishComparison}
                    </div>
                  </div>

                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200 text-xs">
                    <div className="flex items-center gap-1 text-stone-800 font-semibold mb-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>Huskeregel:</span>
                    </div>
                    <p className="text-stone-600">{analysis.correction.keyTakeaway}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-400">
                Native German phrasing
              </div>
            </div>
          </div>

          {/* Contrastive Notes Breakdown */}
          {analysis.contrastiveNotes && analysis.contrastiveNotes.length > 0 && (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-stone-500" />
                <span>Side-by-Side Lexical & Syntactic Bridges:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {analysis.contrastiveNotes.map((note, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-stone-200 text-xs shadow-2xs">
                    <div className="flex items-center justify-between font-mono font-bold mb-1">
                      <span className="text-emerald-700">🇩🇪 {note.german}</span>
                      <span className="text-stone-400 text-[10px]">↔</span>
                      <span className="text-red-700">🇩🇰 {note.danish}</span>
                    </div>
                    <p className="text-stone-600 mt-1">{note.ruleOrTip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
