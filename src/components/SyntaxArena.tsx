import React, { useState } from 'react';
import { Scale, Check, AlertCircle, ArrowRight, Lightbulb, SplitSquareVertical, Sparkles } from 'lucide-react';
import { SYNTAX_RULES_DATABASE } from '../data/contrastiveCurriculum';
import { SyntaxRule } from '../types';

export const SyntaxArena: React.FC = () => {
  const [selectedRuleId, setSelectedRuleId] = useState<string>('sr1');
  const activeRule = SYNTAX_RULES_DATABASE.find((r) => r.id === selectedRuleId) || SYNTAX_RULES_DATABASE[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Overview Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
              <Scale className="w-3.5 h-3.5" />
              <span>Syntaktisk Komparativ Arena</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              German vs. Danish Syntax Architecture
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              Udforsk de strukturelle ligheder (som den fælles V2-regel) og de fundamentale forskelle (som ledsætningsverbet og de 4 kasus).
            </p>
          </div>
        </div>

        {/* Rule Selector Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {SYNTAX_RULES_DATABASE.map((rule) => (
            <button
              key={rule.id}
              onClick={() => setSelectedRuleId(rule.id)}
              className={`text-xs px-3.5 py-2.5 rounded-xl font-medium transition-all text-left flex items-center gap-2 ${
                selectedRuleId === rule.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <span>{rule.titleGerman.split('(')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Rule In-Depth Explorer */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Title & Summary */}
        <div className="border-b border-stone-100 pb-4 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
              {activeRule.category.toUpperCase()}
            </span>
            <h3 className="text-lg font-bold text-stone-900">{activeRule.titleGerman}</h3>
          </div>
          <p className="text-xs font-semibold text-stone-500">{activeRule.titleDanish}</p>
          <p className="text-sm text-stone-700 mt-2">{activeRule.summary}</p>
        </div>

        {/* Contrastive Side-by-Side: Similarity vs Difference */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Hvor tysk ligner dansk (Din superkraft)</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">{activeRule.similarityNote}</p>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Hvor tysk adskiller sig (Farezonen)</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">{activeRule.differenceNote}</p>
          </div>
        </div>

        {/* Interactive Sentence Token Breakdown */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
            <SplitSquareVertical className="w-4 h-4 text-stone-400" />
            <span>Sætningsopbygning Token for Token:</span>
          </h4>

          {/* German Tokens */}
          <div className="bg-stone-900 text-white rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-stone-400 font-bold uppercase tracking-wider">
              <span>🇩🇪 Tysk Struktur (Satzgliedstellung)</span>
              <span className="font-mono text-amber-400 text-xs">"{activeRule.germanExample}"</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {activeRule.germanBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border flex flex-col justify-between ${
                    item.highlight
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                      : 'bg-stone-800 border-stone-700 text-stone-200'
                  }`}
                >
                  <span className="font-mono text-sm">{item.token}</span>
                  <span className="text-[10px] text-stone-400 mt-1 uppercase tracking-wider font-sans">
                    {item.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Danish Tokens */}
          <div className="bg-stone-100 rounded-xl p-4 space-y-2 border border-stone-200">
            <div className="flex items-center justify-between text-[11px] text-stone-500 font-bold uppercase tracking-wider">
              <span>🇩🇰 Dansk Struktur (Til sammenligning)</span>
              <span className="font-mono text-stone-800 text-xs">"{activeRule.danishExample}"</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {activeRule.danishBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border flex flex-col justify-between ${
                    item.highlight
                      ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                      : 'bg-white border-stone-200 text-stone-800'
                  }`}
                >
                  <span className="text-sm font-semibold">{item.token}</span>
                  <span className="text-[10px] text-stone-500 mt-1 uppercase tracking-wider">
                    {item.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rules of Thumb */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Kerne Huskeregler (Rules of Thumb):</span>
          </div>
          <ul className="space-y-1.5 text-xs text-stone-700">
            {activeRule.rulesOfThumb.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
