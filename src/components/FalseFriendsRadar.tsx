import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Sparkles, CheckCircle2, XCircle, ArrowRight, Lightbulb, Volume2, HelpCircle } from 'lucide-react';
import { FALSE_FRIENDS_DATABASE } from '../data/contrastiveCurriculum';
import { FalseFriendEntry } from '../types';
import { playGermanAudio, speakText } from '../utils/audio';

const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    promptDanish: 'Hvordan oversætter du til tysk: "Jeg bliver træt efter arbejdet"?',
    options: [
      { text: 'Ich bleibe müde nach der Arbeit.', isCorrect: false, explanation: 'Falsk ven! "Bleiben" betyder kun "forblive/blive på et sted". At overgå til en ny tilstand (blive træt) hedder "werden"!' },
      { text: 'Ich werde müde nach der Arbeit.', isCorrect: true, explanation: 'Korrekt! Dansk "bliver" (tilstandsændring) = tysk "werden" (Ich werde müde).' },
      { text: 'Ich bin müde nach der Arbeit geblieben.', isCorrect: false, explanation: 'Forkert – her bruges bleiben igen, som betyder forblevet.' }
    ]
  },
  {
    id: 'q2',
    promptDanish: 'Hvad betyder den tyske sætning: "Das Frühstück ist um 8 Uhr fertig"?',
    options: [
      { text: 'Frokosten er færdig klokken 8.', isCorrect: false, explanation: 'Falsk ven! Frühstück er morgenmad (fra früh = tidlig). Frokost er Mittagessen.' },
      { text: 'Morgenmaden er færdig klokken 8.', isCorrect: true, explanation: 'Korrekt! Frühstück = morgenmad.' },
      { text: 'Kaffen og kagen er klar klokken 8.', isCorrect: false, explanation: 'Forkert.' }
    ]
  },
  {
    id: 'q3',
    promptDanish: 'Tjeneren i Berlin er meget venlig og hjælpsom. Hvad siger du på tysk?',
    options: [
      { text: 'Der Kellner ist sehr flink.', isCorrect: false, explanation: 'Falsk ven! Tysk "flink" betyder hurtig/adræt (som en gazelle). Venlig/flink hedder "freundlich" eller "nett"!' },
      { text: 'Der Kellner ist sehr freundlich und nett.', isCorrect: true, explanation: 'Korrekt! Dansk flink = tysk nett / freundlich.' },
      { text: 'Der Kellner ist sehr rar.', isCorrect: false, explanation: 'Falsk ven! Tysk "rar" betyder sjælden, ikke rar.' }
    ]
  },
  {
    id: 'q4',
    promptDanish: 'Du spørger om lov til at åbne vinduet ("Må jeg åbne vinduet?"):',
    options: [
      { text: 'Muss ich das Fenster öffnen?', isCorrect: false, explanation: 'Forkert! "Muss" betyder "skal/er nødt til". At have lov til (må) hedder "darf"!' },
      { text: 'Darf ich das Fenster öffnen?', isCorrect: true, explanation: 'Korrekt! Dansk "må gerne / have lov til" = tysk "dürfen" (Darf ich...).' },
      { text: 'Will ich das Fenster öffnen?', isCorrect: false, explanation: 'Forkert! Will betyder "vil jeg".' }
    ]
  }
];

export const FalseFriendsRadar: React.FC = () => {
  const [selectedFriend, setSelectedFriend] = useState<FalseFriendEntry>(FALSE_FRIENDS_DATABASE[0]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuiz = QUIZ_QUESTIONS[quizIndex];

  const handleOptionClick = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (currentQuiz.options[idx].isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setQuizIndex((prev) => (prev + 1) % QUIZ_QUESTIONS.length);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-red-950 text-white rounded-2xl p-6 shadow-xs border border-red-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-800/80 text-red-200 border border-red-700">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Falske Venner Radar (Falsche Freunde)</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Undgå de klassiske dansk-tyske interferensfælder
            </h2>
            <p className="text-xs sm:text-sm text-red-200/90 max-w-2xl">
              Ord der lyder eller staves næsten ens på dansk og tysk, men som bærer helt forskellige betydninger og fører til misforståelser.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Radar List + Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: False Friends List */}
        <div className="lg:col-span-5 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block px-1">
            Top Dansk-Tyske Fælder:
          </span>
          <div className="space-y-2">
            {FALSE_FRIENDS_DATABASE.map((ff) => {
              const isSelected = selectedFriend.id === ff.id;
              return (
                <button
                  key={ff.id}
                  onClick={() => setSelectedFriend(ff)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-stone-900 border-stone-900 text-white shadow-xs'
                      : 'bg-white border-stone-200 text-stone-800 hover:bg-stone-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm">{ff.germanWord}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        isSelected ? 'bg-amber-400 text-stone-900' : 'bg-red-100 text-red-800'
                      }`}>
                        {ff.severity}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                      🇩🇰 "{ff.danishWord}" fælden
                    </p>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-stone-300'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Breakdown Card */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header of selected false friend */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 block">
                  Kritisk Falsk Ven
                </span>
                <h3 className="text-xl font-mono font-bold text-stone-900">{selectedFriend.germanWord}</h3>
              </div>
              <button
                onClick={() => playGermanAudio(selectedFriend.germanExample)}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              >
                <Volume2 className="w-4 h-4" />
                <span>Hør eksempel</span>
              </button>
            </div>

            {/* Split Comparison Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-red-50/70 border border-red-200 rounded-xl p-3.5 space-y-1.5">
                <span className="text-[11px] font-bold uppercase text-red-800 tracking-wider block">
                  🇩🇪 Hvad det BETYDER på tysk:
                </span>
                <p className="text-xs font-bold text-stone-900">{selectedFriend.germanMeaning}</p>
                <p className="text-xs text-stone-600 font-mono italic">"{selectedFriend.germanExample}"</p>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1.5">
                <span className="text-[11px] font-bold uppercase text-amber-900 tracking-wider block">
                  🇩🇰 Hvad du tror på dansk:
                </span>
                <p className="text-xs font-bold text-stone-900">{selectedFriend.danishMeaning}</p>
                <p className="text-xs text-stone-600 italic">"{selectedFriend.danishExample}"</p>
              </div>
            </div>

            {/* Trap Explanation */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Hvorfor danskere fejler her:</span>
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed">{selectedFriend.trapExplanation}</p>
            </div>

            {/* Mnemonic Memory Trick */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                  Huskeregel (Mnemonic Anchor):
                </span>
                <p className="text-xs text-stone-800 font-semibold mt-1">{selectedFriend.mnemonic}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick False Friend Quiz Arena */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Test dine instinkter: Falske Venner Quiz
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
            Spørgsmål {quizIndex + 1} af {QUIZ_QUESTIONS.length}
          </span>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-stone-800">{currentQuiz.promptDanish}</p>

          <div className="grid grid-cols-1 gap-2.5">
            {currentQuiz.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              let btnStyle = 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-800';

              if (showExplanation) {
                if (option.isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-red-50 border-red-400 text-red-900 font-medium';
                } else {
                  btnStyle = 'bg-stone-50 border-stone-200 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={showExplanation}
                  onClick={() => handleOptionClick(idx)}
                  className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start justify-between gap-3 ${btnStyle}`}
                >
                  <span>{option.text}</span>
                  {showExplanation && (
                    <span className="shrink-0">
                      {option.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isSelected ? (
                        <XCircle className="w-4 h-4 text-red-600" />
                      ) : null}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="bg-stone-100 p-3.5 rounded-xl text-xs text-stone-700 space-y-2">
              <p>{currentQuiz.options[selectedOption!].explanation}</p>
              <div className="text-right">
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-1.5 rounded-lg bg-stone-900 text-white font-semibold hover:bg-stone-800 text-xs transition-colors"
                >
                  Næste spørgsmål →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
