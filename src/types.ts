export type CognateType = 'identical' | 'close' | 'sound_shift' | 'false_friend' | 'distinct';

export interface VocabularyEntry {
  id: string;
  german: string;
  germanArticle?: 'der' | 'die' | 'das';
  danish: string;
  danishArticle?: 'en' | 'et';
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'phrase';
  english: string;
  cognateType: CognateType;
  soundShiftRule?: string; // e.g. "German 'z/tz' corresponds to Danish 't' (Zeit -> tid)"
  exampleGerman: string;
  exampleDanish: string;
  falseFriendWarning?: string;
  notes?: string;
}

export interface FalseFriendEntry {
  id: string;
  germanWord: string;
  germanMeaning: string;
  germanExample: string;
  danishWord: string;
  danishMeaning: string;
  danishExample: string;
  trapExplanation: string;
  mnemonic: string;
  severity: 'high' | 'medium' | 'critical';
}

export interface SyntaxRule {
  id: string;
  category: 'word_order' | 'cases' | 'subordinate_clauses' | 'modals' | 'verbs_tenses' | 'prepositions';
  titleGerman: string;
  titleDanish: string;
  summary: string;
  similarityNote: string; // How it's like Danish
  differenceNote: string; // How it breaks away from Danish
  germanExample: string;
  danishExample: string;
  germanBreakdown: { token: string; role: string; highlight?: boolean }[];
  danishBreakdown: { token: string; role: string; highlight?: boolean }[];
  rulesOfThumb: string[];
}

export interface IdentifiedError {
  error: string;
  type: 'word_order' | 'case_inflection' | 'false_friend' | 'gender' | 'preposition' | 'verb_conjugation' | 'other';
  explanation: string;
}

export interface DanishTransferDiagnosis {
  isDanishInterference: boolean;
  patternDescription: string;
  danishEquivalent: string;
}

export interface SentenceAnalysisResult {
  isCorrect: boolean;
  confidenceScore: number;
  identifiedErrors: IdentifiedError[];
  danishTransferDiagnosis: DanishTransferDiagnosis;
  correction: {
    correctGerman: string;
    danishComparison: string;
    keyTakeaway: string;
  };
  contrastiveNotes: {
    german: string;
    danish: string;
    ruleOrTip: string;
  }[];
  falseFriendAlert: string | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  analysis?: SentenceAnalysisResult;
  suggestedGerman?: string;
  contrastivePairs?: { german: string; danish: string }[];
}

export interface DrillItem {
  id: string;
  type: 'sentence_builder' | 'case_detective' | 'false_friend_buster' | 'translation_bridge';
  title: string;
  danishPrompt: string;
  targetGerman: string;
  jumbledTokens?: string[];
  options?: string[];
  correctOption?: string;
  contrastiveBridge: string;
  falseFriendWarning?: string | null;
  grammarTip: string;
}

export interface LessonModule {
  id: string;
  number: number;
  title: string;
  danishTitle: string;
  level: 'A1-Bridge' | 'A2-Bridge' | 'B1-Bridge';
  description: string;
  contrastiveFocus: string;
  syntaxRuleIds: string[];
  vocabIds: string[];
  falseFriendIds: string[];
  drills: DrillItem[];
}
