import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, Sparkles, AlertTriangle, ArrowRight, RefreshCw, MessageSquare, Info } from 'lucide-react';
import { ChatMessage, SentenceAnalysisResult } from '../types';
import { playGermanAudio, speakText } from '../utils/audio';
import { authorizedFetch } from '../auth/firebase';

const STARTER_PROMPTS = [
  {
    topic: 'Nebensatz & Weil',
    prompt: 'Kan du forklare mig reglen for ledsætninger med "weil" og "dass" sammenlignet med dansk "fordi" og "at"?',
  },
  {
    topic: 'Blive vs Bleiben',
    prompt: 'Hvorfor må jeg ikke sige "Ich bleibe Arzt" på tysk, når jeg på dansk siger "Jeg bliver læge"?',
  },
  {
    topic: 'Må vs Müssen/Dürfen',
    prompt: 'Hvordan kender jeg forskel på "dürfen" og "müssen", når dansk bruger ordet "må" om begge dele?',
  },
  {
    topic: 'Kasus (Nominativ/Akkusativ/Dativ)',
    prompt: 'Hvordan kan jeg bruge mine danske pronominer (jeg/mig, han/ham) til at forstå de 4 tyske kasus?',
  },
  {
    topic: 'Falske Venner',
    prompt: 'Hvilke 5 mest almindelige falske venner falder danskere typisk i, når de lærer tysk?',
  },
];

export const TutorChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-welcome',
      role: 'assistant',
      content: `**Herzlich willkommen!** 👋 Jeg er din personlige tysklærer designet specifikt til dig, der allerede har et stærkt dansk B2-niveau.

Vi bruger dine eksisterende danskkundskaber som en **kognitiv bro**:
- 🇩🇪 **Kontrastiv ordbog**: Nye tyske ord introduceres altid side om side med det danske modstykke.
- ⚖️ **Syntaks-sammenligning**: Vi udnytter den fælles V2-regel og lærer ledsætningsreglen (hvor verbet sparkes bagest).
- ⚠️ **Falske venner radar**: Vi undgår klassiske fælder som *blive/bleiben*, *frokost/Frühstück* og *må/müssen/dürfen*.
- 🔍 **3-dels rettelsesmodel**: Hver gang du skriver en tysk sætning, analyserer jeg den for fejl, dansk interferens og giver den korrekte tyske form.

Prøv at skrive eller sige en sætning på tysk, eller vælg et emne herunder!`,
      timestamp: Date.now(),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('General German via Danish');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Setup Web Speech Recognition for German
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tale-til-tekst er ikke understøttet i denne browser.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'de-DE'; // German speech recognition
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsRecording(false);
      };
      recognition.onend = () => setIsRecording(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await authorizedFetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          topic: selectedTopic,
        }),
      });

      if (!res.ok) throw new Error('Chat failed');
      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply || 'Es tut mir leid, ich konnte keine Antwort verarbeiten.',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error in chat:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: 'Beklager, der opstod en fejl under kommunikation med tutoren. Prøv venligst igen.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = (text: string) => {
    // Extract first German sentence or snippet
    const cleanText = text.replace(/[*_#`]/g, '').slice(0, 200);
    playGermanAudio(cleanText);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-[550px] bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Chat Sub-Header */}
      <div className="px-5 py-3 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
            Tutor Session: {selectedTopic}
          </span>
        </div>
        <div className="text-xs text-stone-500 hidden sm:flex items-center gap-2">
          <span>Tysk-Dansk Kontrastiv Pædagogik</span>
        </div>
      </div>

      {/* Starter Topics Carousel */}
      <div className="px-4 py-2.5 bg-stone-100/70 border-b border-stone-200 overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-[11px] font-semibold text-stone-500 whitespace-nowrap uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Foreslåede emner:
        </span>
        {STARTER_PROMPTS.map((starter, i) => (
          <button
            key={i}
            onClick={() => {
              setSelectedTopic(starter.topic);
              handleSend(starter.prompt);
            }}
            className="text-xs px-2.5 py-1 rounded-full bg-white hover:bg-stone-200 text-stone-700 font-medium border border-stone-200 whitespace-nowrap transition-colors shadow-2xs"
          >
            {starter.topic}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-stone-50/40">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                  isUser
                    ? 'bg-stone-900 text-white'
                    : 'bg-gradient-to-br from-red-600 to-amber-600 text-white'
                }`}
              >
                {isUser ? '🇩🇰' : '🇩🇪'}
              </div>

              {/* Bubble Content */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-xs text-sm leading-relaxed ${
                  isUser
                    ? 'bg-stone-900 text-white rounded-tr-xs'
                    : 'bg-white border border-stone-200 text-stone-800 rounded-tl-xs space-y-2'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>

                {!isUser && (
                  <div className="pt-2 mt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                    <span className="text-[11px] font-medium text-stone-500">Tysk Tutor med dansk bro</span>
                    <button
                      onClick={() => handlePlayAudio(msg.content)}
                      className="p-1 rounded-md hover:bg-stone-100 text-stone-600 flex items-center gap-1 transition-colors"
                      title="Læs tysk højt"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-stone-600" />
                      <span className="text-[10px]">Udtale</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              🇩🇪
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex items-center gap-2 text-xs text-stone-500">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
              <span>Tutoren analyserer sætningen gennem den dansk-tyske 3-dels linse...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-white border-t border-stone-200">
        <div className="flex items-center gap-2">
          {/* Speech-to-Text Button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`p-2.5 rounded-xl border transition-all ${
              isRecording
                ? 'bg-red-500 border-red-600 text-white animate-pulse'
                : 'bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200'
            }`}
            title={isRecording ? 'Stopper optagelse...' : 'Tal tysk (tale-til-tekst)'}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            id="tutor-chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Skriv på tysk eller spørg om tysk grammatik for danskere..."
            className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all"
          />

          {/* Send Button */}
          <button
            id="btn-send-message"
            disabled={!input.trim() || loading}
            onClick={() => handleSend()}
            className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white transition-all shadow-xs"
            title="Send besked"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2 px-1">
          <span>Tip: Skriv gerne dine forsøg på tysk – tutoren retter automatisk via 3-dels modellen.</span>
          <span>🇩🇪 de-DE stemmegenkendelse</span>
        </div>
      </div>
    </div>
  );
};
