import { VocabularyEntry, FalseFriendEntry, SyntaxRule, LessonModule } from '../types';

export const VOCABULARY_DATABASE: VocabularyEntry[] = [
  // Core verbs
  {
    id: 'v1',
    german: 'versuchen',
    danish: 'forsøge',
    partOfSpeech: 'verb',
    english: 'to try / attempt',
    cognateType: 'close',
    soundShiftRule: 'German ver- prefix corresponds to Danish for- prefix; -suchen corresponds to -søge (ch -> g/k)',
    exampleGerman: 'Ich versuche, jeden Tag Deutsch zu sprechen.',
    exampleDanish: 'Jeg forsøger at tale tysk hver dag.',
    notes: 'Notice prefix mapping: ver- ↔ for-, suchen ↔ søge.'
  },
  {
    id: 'v2',
    german: 'bleiben',
    danish: 'forblive / blive (kun som at forblive)',
    partOfSpeech: 'verb',
    english: 'to stay / remain',
    cognateType: 'false_friend',
    falseFriendWarning: 'CRITICAL: In German, "bleiben" ONLY means "to stay/remain". To say "to become" (Danish: "blive"), you MUST use "werden"!',
    exampleGerman: 'Ich bleibe heute zu Hause. (Ich werde Arzt.)',
    exampleDanish: 'Jeg bliver (forbliver) hjemme i dag. (Jeg bliver læge.)',
    notes: 'Do not say "Ich bleibe müde" if you mean you are getting tired. Use "Ich werde müde".'
  },
  {
    id: 'v3',
    german: 'werden',
    danish: 'blive (i betydningen overgang/at blive til)',
    partOfSpeech: 'verb',
    english: 'to become / will (future auxiliary)',
    cognateType: 'sound_shift',
    soundShiftRule: 'German werden ↔ Danish vorde (gammeldansk/bibelsk), men oversættes til moderne dansk "blive".',
    exampleGerman: 'Morgen wird das Wetter schön.',
    exampleDanish: 'I morgen bliver vejret godt.',
    notes: 'Crucial bridge: Danish "bliver" (state change) = German "wird".'
  },
  {
    id: 'v4',
    german: 'gehören',
    danish: 'tilhøre / høre til',
    partOfSpeech: 'verb',
    english: 'to belong to',
    cognateType: 'close',
    exampleGerman: 'Das Buch gehört mir. (Dativ!)',
    exampleDanish: 'Bogen tilhører mig.',
    notes: 'German "gehören" takes a Dative object: "gehört mir" (not "zu mir").'
  },
  {
    id: 'v5',
    german: 'anfangen',
    danish: 'begynde / anfange (gammeldags)',
    partOfSpeech: 'verb',
    english: 'to start / begin',
    cognateType: 'close',
    exampleGerman: 'Der Kurs fängt um acht Uhr an.',
    exampleDanish: 'Kurset begynder klokken otte.',
    notes: 'Trennbare verben (separable verb): prefix "an-" goes to the end in main clauses.'
  },
  {
    id: 'v6',
    german: 'aufstehen',
    danish: 'stå op',
    partOfSpeech: 'verb',
    english: 'to get up',
    cognateType: 'close',
    soundShiftRule: 'German auf- corresponds to Danish op; stehen corresponds to stå.',
    exampleGerman: 'Ich stehe jeden Morgen früh auf.',
    exampleDanish: 'Jeg står tidligt op hver morgen.',
    notes: 'Notice identical word order: Verb (stehe/står) + adverb + particle at the end (auf/op).'
  },
  {
    id: 'v7',
    german: 'müssen',
    danish: 'skulle / være nødt til / må (nødvendighed)',
    partOfSpeech: 'verb',
    english: 'must / have to',
    cognateType: 'false_friend',
    falseFriendWarning: 'Danish "må" can mean both "must" and "may". In German: "müssen" = must (obligation), "dürfen" = allowed to (permission)!',
    exampleGerman: 'Ich muss heute viel arbeiten.',
    exampleDanish: 'Jeg må / skal arbejde meget i dag.',
    notes: 'Never confuse with "dürfen".'
  },
  {
    id: 'v8',
    german: 'dürfen',
    danish: 'må gerne / have lov til',
    partOfSpeech: 'verb',
    english: 'may / to be allowed to',
    cognateType: 'false_friend',
    falseFriendWarning: 'Danish "må gerne" = German "darf". Danish "må ikke" = German "darf nicht" (forbidden) vs "braucht nicht" (need not).',
    exampleGerman: 'Darf ich hier parken?',
    exampleDanish: 'Må jeg parkere her?',
    notes: 'Danish "må" (permission) = German "darf".'
  },
  {
    id: 'v9',
    german: 'arbeiten',
    danish: 'arbejde',
    partOfSpeech: 'verb',
    english: 'to work',
    cognateType: 'identical',
    exampleGerman: 'Ich arbeite bei einer dänischen Firma.',
    exampleDanish: 'Jeg arbejder i et dansk firma.',
    notes: 'Direct cognate from Middle Low German into Danish.'
  },
  {
    id: 'v10',
    german: 'sprechen',
    danish: 'tale / snakke / sprække (etymologisk)',
    partOfSpeech: 'verb',
    english: 'to speak',
    cognateType: 'sound_shift',
    soundShiftRule: 'German sp- ↔ Danish sp-; -ch- ↔ Danish -k- (sprechen ↔ sprogligt beslægtet med sprog/speech).',
    exampleGerman: 'Sprichst du Dänisch oder Deutsch?',
    exampleDanish: 'Taler du dansk eller tysk?',
    notes: 'Irregular verb: du sprichst, er spricht.'
  },

  // High Frequency Nouns & Sound Shifts
  {
    id: 'n1',
    german: 'Zeit',
    germanArticle: 'die',
    danish: 'tid',
    danishArticle: 'en',
    partOfSpeech: 'noun',
    english: 'time',
    cognateType: 'sound_shift',
    soundShiftRule: 'German initial "Z-" consistently corresponds to Danish "T-" (Zeit -> tid, Zunge -> tunge, Zaun -> hegn/tjun).',
    exampleGerman: 'Ich habe heute leider keine Zeit.',
    exampleDanish: 'Jeg har desværre ikke tid i dag.',
    notes: 'All German nouns are capitalized! "die Zeit" (feminin).'
  },
  {
    id: 'n2',
    german: 'Wasser',
    germanArticle: 'das',
    danish: 'vand',
    danishArticle: 'et',
    partOfSpeech: 'noun',
    english: 'water',
    cognateType: 'sound_shift',
    soundShiftRule: 'German medial/final "-ss-" corresponds to Danish "-d/t-" (Wasser -> vand, besser -> bedre, essen -> æde/spise).',
    exampleGerman: 'Ein Glas kaltes Wasser, bitte.',
    exampleDanish: 'Et glas koldt vand, tak.',
    notes: 'Neutral in both languages: das Wasser ↔ et vand.'
  },
  {
    id: 'n3',
    german: 'Katze',
    germanArticle: 'die',
    danish: 'kat',
    danishArticle: 'en',
    partOfSpeech: 'noun',
    english: 'cat',
    cognateType: 'sound_shift',
    soundShiftRule: 'German "-tz-" corresponds to Danish "-t-" (Katze -> kat, sitzen -> sidde).',
    exampleGerman: 'Die Katze schläft auf dem Sofa.',
    exampleDanish: 'Katten sover på sofaen.',
    notes: 'German "die Katze" is feminine; Danish "en kat" is fælleskøn.'
  },
  {
    id: 'n4',
    german: 'Frühstück',
    germanArticle: 'das',
    danish: 'morgenmad (IKKE frokost!)',
    danishArticle: 'en',
    partOfSpeech: 'noun',
    english: 'breakfast',
    cognateType: 'false_friend',
    falseFriendWarning: 'MAJOR FALSE FRIEND: German "Frühstück" literally means "early piece" = breakfast! Danish "frokost" corresponds to German "Mittagessen"!',
    exampleGerman: 'Was isst du zum Frühstück?',
    exampleDanish: 'Hvad spiser du til morgenmad?',
    notes: 'Remember: Frühstück = morgenmad, Mittagessen = frokost.'
  },
  {
    id: 'n5',
    german: 'Mittagessen',
    germanArticle: 'das',
    danish: 'frokost / middagsmad',
    danishArticle: 'en',
    partOfSpeech: 'noun',
    english: 'lunch',
    cognateType: 'close',
    exampleGerman: 'Wir gehen um zwölf Uhr zum Mittagessen.',
    exampleDanish: 'Vi går til frokost klokken tolv.',
    notes: 'Compound noun: Mittag (middag) + Essen (mad).'
  },
  {
    id: 'n6',
    german: 'Tag',
    germanArticle: 'der',
    danish: 'dag',
    danishArticle: 'en',
    partOfSpeech: 'noun',
    english: 'day',
    cognateType: 'sound_shift',
    soundShiftRule: 'German "T-" corresponds to Danish "D-" (Tag -> dag, Traum -> drøm, Tochter -> datter).',
    exampleGerman: 'Guten Tag! Schönen Tag noch.',
    exampleDanish: 'Goddag! Hav en god dag.',
    notes: 'German "der Tag" (maskulinum).'
  },
  {
    id: 'n7',
    german: 'Zimmer',
    germanArticle: 'das',
    danish: 'værelse / kammer (tømmer)',
    danishArticle: 'et',
    partOfSpeech: 'noun',
    english: 'room',
    cognateType: 'sound_shift',
    soundShiftRule: 'German "Z-" ↔ Danish "T-" (Zimmer ↔ tømmer/kammer).',
    exampleGerman: 'Das Hotelzimmer ist sehr sauber.',
    exampleDanish: 'Hotelværelset er meget rent.',
    notes: 'Cognate with Danish "tømmer" (timber/room building material).'
  },
  {
    id: 'n8',
    german: 'Buch',
    germanArticle: 'das',
    danish: 'bog',
    danishArticle: 'en',
    partOfSpeech: 'noun',
    english: 'book',
    cognateType: 'sound_shift',
    soundShiftRule: 'German "-ch" corresponds to Danish "-g" (Buch -> bog, Sprache -> sprog, Dach -> tag).',
    exampleGerman: 'Ich lese ein spannendes Buch.',
    exampleDanish: 'Jeg læser en spændende bog.',
    notes: 'Plural: Bücher (bøger).'
  },
  {
    id: 'n9',
    german: 'Zug',
    germanArticle: 'der',
    danish: 'tog',
    danishArticle: 'et',
    partOfSpeech: 'noun',
    english: 'train',
    cognateType: 'sound_shift',
    soundShiftRule: 'German "Z-" ↔ Danish "T-" (Zug ↔ tog, derived from ziehen/trække).',
    exampleGerman: 'Der Zug nach Hamburg kommt pünktlich an.',
    exampleDanish: 'Toget til Hamborg ankommer til tiden.',
    notes: 'Notice gender: der Zug (DE maskulinum) vs et tog (DK intetkøn).'
  },
  {
    id: 'n10',
    german: 'Stadt',
    germanArticle: 'die',
    danish: 'by / stad',
    danishArticle: 'en',
    partOfSpeech: 'noun',
    english: 'city / town',
    cognateType: 'close',
    exampleGerman: 'Kopenhagen ist eine wunderschöne Stadt.',
    exampleDanish: 'København er en vidunderlig by (stad).',
    notes: 'Cognate with Danish "stad" (som i storstad).'
  },

  // Adjectives & False Friends
  {
    id: 'a1',
    german: 'rar',
    danish: 'sjælden (IKKE rar/venlig!)',
    partOfSpeech: 'adjective',
    english: 'rare / scarce',
    cognateType: 'false_friend',
    falseFriendWarning: 'FALSE FRIEND ALERT: German "rar" means "rare" or "scarce". Danish "rar" (pleasant, nice) is in German "nett", "angenehm" or "lieb"!',
    exampleGerman: 'Gute Freunde sind rar. Er ist ein sehr netter Mann.',
    exampleDanish: 'Gode venner er sjældne. Han er en meget rar mand.',
    notes: 'If you want to say "He is a nice person", say "Er ist nett" (NOT "Er ist rar").'
  },
  {
    id: 'a2',
    german: 'flink',
    danish: 'hurtig / adræt (IKKE venlig/flink!)',
    partOfSpeech: 'adjective',
    english: 'quick / nimble / agile',
    cognateType: 'false_friend',
    falseFriendWarning: 'FALSE FRIEND ALERT: German "flink" means "swift, nimble, quick". Danish "flink" (kind, nice) is German "freundlich" or "nett"!',
    exampleGerman: 'Das Wiesel ist sehr flink. Meine Nachbarn sind sehr freundlich.',
    exampleDanish: 'Bruden er meget hurtig/adræt. Mine naboer er meget flinke.',
    notes: 'German "flink wie ein Wiesel" = hurtig som et væsel.'
  },
  {
    id: 'a3',
    german: 'schwer',
    danish: 'tung / svær (vanskelig)',
    partOfSpeech: 'adjective',
    english: 'heavy / difficult',
    cognateType: 'sound_shift',
    soundShiftRule: 'German "sch-" corresponds to Danish "s-" (schwer -> svær, schwimmen -> svømme).',
    exampleGerman: 'Die deutsche Grammatik ist nicht so schwer.',
    exampleDanish: 'Den tyske grammatik er ikke så svær.',
    notes: 'Means both physical heavy and mentally difficult, just like Danish svær!'
  },
  {
    id: 'a4',
    german: 'ruhig',
    danish: 'rolig',
    partOfSpeech: 'adjective',
    english: 'quiet / calm',
    cognateType: 'close',
    exampleGerman: 'Bleib bitte ganz ruhig!',
    exampleDanish: 'Bliv venligst helt rolig!',
    notes: 'Direct cognate with subtle sound change (ruhig ↔ rolig).'
  },
  {
    id: 'a5',
    german: 'artig',
    danish: 'velopdragen / artig (men også "ejendommelig" i kompositioner)',
    partOfSpeech: 'adjective',
    english: 'well-behaved / polite / mannerly',
    cognateType: 'close',
    exampleGerman: 'Die Kinder waren heute sehr artig.',
    exampleDanish: 'Børnene var meget artige i dag.',
    notes: 'Watch out for "eigenartig" = peculiar/strange (underlig).'
  },
  {
    id: 'a6',
    german: 'klug',
    danish: 'klog',
    partOfSpeech: 'adjective',
    english: 'smart / clever',
    cognateType: 'close',
    exampleGerman: 'Das war eine sehr kluge Entscheidung.',
    exampleDanish: 'Det var en meget klog beslutning.',
    notes: 'Cognate with vowel change: u ↔ o.'
  }
];

export const FALSE_FRIENDS_DATABASE: FalseFriendEntry[] = [
  {
    id: 'ff1',
    germanWord: 'bleiben',
    germanMeaning: 'to stay / to remain (forblive)',
    germanExample: 'Ich bleibe heute zu Hause.',
    danishWord: 'blive',
    danishMeaning: 'to become (overgang) ELLER to remain',
    danishExample: 'Jeg bliver læge (DE: Ich werde Arzt) / Jeg bliver hjemme (DE: Ich bleibe).',
    trapExplanation: 'Danish speakers constantly say "Ich bleibe müde" or "Er bleibt alt" meaning "I get tired" / "He gets old". In German, "bleiben" ONLY means "stay/remain". For state changes, you MUST use "werden".',
    mnemonic: '🇩🇰 Blive (forandre sig) = 🇩🇪 Werden! Kun 🇩🇰 Forblive = 🇩🇪 Bleiben.',
    severity: 'critical'
  },
  {
    id: 'ff2',
    germanWord: 'Frühstück',
    germanMeaning: 'breakfast (morgenmad)',
    germanExample: 'Zum Frühstück esse ich Müsli und Brot.',
    danishWord: 'frokost',
    danishMeaning: 'lunch (middagsmad)',
    danishExample: 'Jeg spiser frokost kl. 12:00 (DE: Mittagessen).',
    trapExplanation: 'Danish "frokost" sounds directly related to "Frühstück", but German "Frühstück" is purely the morning meal. German for lunch is "Mittagessen".',
    mnemonic: '🇩🇪 Früh = tidlig morgen! Derfor er Frühstück = MORGENMAD. Frokost = Mittagessen.',
    severity: 'critical'
  },
  {
    id: 'ff3',
    germanWord: 'müssen vs dürfen',
    germanMeaning: 'müssen = must (nødvendighed); dürfen = may (have lov til)',
    germanExample: 'Du musst lernen (du skal). Du darfst spielen (du må gerne).',
    danishWord: 'må',
    danishMeaning: 'kan betyde både "skal/bør" og "har lov til"',
    danishExample: 'Du må ikke ryge her (DE: Du darfst nicht). Du må hjælpe mig (DE: Du musst).',
    trapExplanation: 'In Danish, "må" carries both necessity and permission. In German, they are strictly separated into two distinct modal verbs: "müssen" (must) and "dürfen" (allowed to).',
    mnemonic: '🇩🇰 "Må gerne" = 🇩🇪 Dürfen! 🇩🇰 "Er nødt til" = 🇩🇪 Müssen!',
    severity: 'critical'
  },
  {
    id: 'ff4',
    germanWord: 'rar',
    germanMeaning: 'rare / scarce / scarce commodity (sjælden)',
    germanExample: 'Gute Parkplätze sind in Berlin rar.',
    danishWord: 'rar',
    danishMeaning: 'kind / pleasant / sweet (venlig / behagelig)',
    danishExample: 'Min bedstemor er meget rar (DE: Meine Oma ist sehr nett / lieb).',
    trapExplanation: 'If you say "Mein Lehrer ist sehr rar" in German, you are saying your teacher is scarce/rarely seen, not that he is a pleasant person!',
    mnemonic: '🇩🇰 Rar (sød/venlig) = 🇩🇪 Nett / Freundlich! 🇩🇪 Rar = Sjælden.',
    severity: 'high'
  },
  {
    id: 'ff5',
    germanWord: 'flink',
    germanMeaning: 'quick / nimble / agile (hurtig, adræt)',
    germanExample: 'Das Eichhörnchen ist sehr flink.',
    danishWord: 'flink',
    danishMeaning: 'kind / friendly / polite (venlig, imødekommende)',
    danishExample: 'Tjeneren var meget flink (DE: Der Kellner war sehr freundlich/nett).',
    trapExplanation: 'In Danish, "en flink mand" is a friendly man. In German, "ein flinker Mann" is a speedy, agile man who moves fast!',
    mnemonic: '🇩🇪 Flink = Flot og Hurtig som en gazelle! 🇩🇰 Flink = 🇩🇪 Nett / Hilfsbereit.',
    severity: 'high'
  },
  {
    id: 'ff6',
    germanWord: 'Gift',
    germanMeaning: 'poison / toxin (giftstof)',
    germanExample: 'Vorsicht, diese Pflanze enthält tödliches Gift!',
    danishWord: 'gift',
    danishMeaning: 'poison ELLER married (gift med nogen)',
    danishExample: 'De er gift (DE: Sie sind verheiratet). Rottesæd er gift (DE: Rattengift).',
    trapExplanation: 'German "Gift" only means poison. "Married" in German is "verheiratet" (from heiraten).',
    mnemonic: '🇩🇰 Gift (ægteskab) = 🇩🇪 Verheiratet! 🇩🇪 Das Gift = Kun det giftige stof.',
    severity: 'high'
  },
  {
    id: 'ff7',
    germanWord: 'meinen',
    germanMeaning: 'to think / to opine / to refer to (mene / synes)',
    germanExample: 'Was meinst du dazu? (Hvad mener/synes du om det?)',
    danishWord: 'betyde',
    danishMeaning: 'at have en definition (DE: bedeuten)',
    danishExample: 'Hvad betyder ordet? (DE: Was bedeutet das Wort? NOT: Was meint das Wort?).',
    trapExplanation: 'People can "meinen" (have an opinion), but words, signs, and symbols "bedeuten" (have a meaning). Don\'t say "Was meint dieses Schild?".',
    mnemonic: 'Mennesker "meinen" (mener) — ord og ting "bedeuten" (betyder)!',
    severity: 'medium'
  },
  {
    id: 'ff8',
    germanWord: 'ondt (DK) vs schlecht / weh (DE)',
    germanMeaning: 'schlecht = bad; wehtun = to hurt; böse = evil',
    germanExample: 'Mein Kopf tut weh. (Jeg har ondt i hovedet).',
    danishWord: 'ondt',
    danishMeaning: 'pain (ondt i maven) eller evil (det onde)',
    danishExample: 'Det gør ondt (DE: Es tut weh).',
    trapExplanation: 'Danish speakers often try to translate "gøre ondt" literally. In German, you say "Es tut weh" or "Ich habe Schmerzen".',
    mnemonic: '🇩🇰 Gør ondt = 🇩🇪 Tut weh! 🇩🇰 Ond (ondskabsfuld) = 🇩🇪 Böse.',
    severity: 'medium'
  }
];

export const SYNTAX_RULES_DATABASE: SyntaxRule[] = [
  {
    id: 'sr1',
    category: 'word_order',
    titleGerman: 'Das V2-Prinzip im Hauptsatz',
    titleDanish: 'V2-reglen i hovedsætninger (Ens på tysk og dansk!)',
    summary: 'Both German and Danish are strict V2 (Verb-Second) languages in main clauses. The finite verb MUST always be the 2nd structural constituent.',
    similarityNote: 'This is the biggest superpower for Danish speakers. When you start with an adverb or time expression, Danish and German invert subject and verb in EXACTLY the same way!',
    differenceNote: 'Unlike English ("Today I learn"), both German and Danish require "Today learn I".',
    germanExample: 'Heute lerne ich Deutsch in Berlin.',
    danishExample: 'I dag lærer jeg tysk i Berlin.',
    germanBreakdown: [
      { token: 'Heute', role: 'Time adverbial (Position 1)' },
      { token: 'lerne', role: 'Finite Verb (Position 2)', highlight: true },
      { token: 'ich', role: 'Subject (Position 3)' },
      { token: 'Deutsch in Berlin.', role: 'Object & Place' }
    ],
    danishBreakdown: [
      { token: 'I dag', role: 'Tidsadverbium (Position 1)' },
      { token: 'lærer', role: 'Finit verbum (Position 2)', highlight: true },
      { token: 'jeg', role: 'Subjekt (Position 3)' },
      { token: 'tysk i Berlin.', role: 'Objekt & Sted' }
    ],
    rulesOfThumb: [
      'Position 1 can be ANY single constituent (e.g. "Gestern", "In Dänemark", "Dieses Buch").',
      'Position 2 is ALWAYS the conjugated verb.',
      'If you start with something other than the subject, the subject moves right behind the verb.'
    ]
  },
  {
    id: 'sr2',
    category: 'subordinate_clauses',
    titleGerman: 'Verben am Ende im Nebensatz (Kicking the Verb)',
    titleDanish: 'Ledsætninger (Nebensätze): Verbet sparkes HELT om bagest!',
    summary: 'The #1 error for Danish speakers! In Danish subordinate clauses with "fordi/at/når", the verb stays in the middle (SVO). In German, subjunctions like "weil, dass, wenn, obwohl, da" KICK the conjugated verb to the very end.',
    similarityNote: 'Both languages use similar subjunctions: weil (fordi), dass (at), wenn (hvis/når), obwohl (selvom).',
    differenceNote: 'Danish keeps SVO: "... fordi jeg ER syg". German forces SOV: "... weil ich krank BIN"!',
    germanExample: 'Ich bleibe zu Hause, weil ich krank bin.',
    danishExample: 'Jeg bliver hjemme, fordi jeg er syg.',
    germanBreakdown: [
      { token: '..., weil', role: 'Subjunction' },
      { token: 'ich', role: 'Subject' },
      { token: 'krank', role: 'Predicate' },
      { token: 'bin.', role: 'Conjugated verb at the VERY END', highlight: true }
    ],
    danishBreakdown: [
      { token: '..., fordi', role: 'Konjunktion' },
      { token: 'jeg', role: 'Subjekt' },
      { token: 'er', role: 'Verbum i midten (SVO)', highlight: true },
      { token: 'syg.', role: 'Adjektiv' }
    ],
    rulesOfThumb: [
      'Subjunction triggers: weil, dass, wenn, als, obwohl, damit, während, da, ob.',
      'Rule: "Subjunction + Subject + ... + VERB AT THE END".',
      'Never put the verb directly after the subjunction in German!'
    ]
  },
  {
    id: 'sr3',
    category: 'cases',
    titleGerman: 'Die 4 Fälle (Kasus): Nominativ, Akkusativ, Dativ, Genitiv',
    titleDanish: 'De 4 Kasus: Hvor tysk kræver bøjninger, som dansk har tabt',
    summary: 'Modern Danish has lost noun cases except in personal pronouns (jeg/mig, han/ham). German marks grammatical roles directly on articles and adjective endings across 4 cases.',
    similarityNote: 'Think of Danish pronouns: "Jeg (Nom) giver ham (Dat) den (Akk)". German applies this logic to EVERY noun!',
    differenceNote: 'German articles change: der/die/das (Nom) -> den/die/das (Akk) -> dem/der/dem (Dat) -> des/der/des (Gen).',
    germanExample: 'Der Mann gibt der Frau den Apfel des Nachbarn.',
    danishExample: 'Manden giver kvinden naboens æble.',
    germanBreakdown: [
      { token: 'Der Mann', role: 'Nominativ (Subject / Grundled)' },
      { token: 'gibt', role: 'Verb' },
      { token: 'der Frau', role: 'Dativ (Indirect object / Hensynsled)', highlight: true },
      { token: 'den Apfel', role: 'Akkusativ (Direct object / Genstandsled)', highlight: true },
      { token: 'des Nachbarn.', role: 'Genitiv (Possessive / Ejeform)', highlight: true }
    ],
    danishBreakdown: [
      { token: 'Manden', role: 'Subjekt (Nominativ)' },
      { token: 'giver', role: 'Verbum' },
      { token: 'kvinden', role: 'Hensynsled (Ingen kasusmarkør)' },
      { token: 'æblet', role: 'Genstandsled (Ingen kasusmarkør)' },
      { token: 'naboens.', role: 'Genitiv (-s endelse)' }
    ],
    rulesOfThumb: [
      'Nominativ: Who is doing the action? (Subject)',
      'Akkusativ: What is directly affected? (Direct object)',
      'Dativ: Who receives the benefit? (Indirect object / to whom)',
      'Genitiv: Whose is it? (Possession)'
    ]
  },
  {
    id: 'sr4',
    category: 'modals',
    titleGerman: 'Die Satzklammer (Satzrahmen) mit Modalverben & Perfekt',
    titleDanish: 'Sætningsrammen (Satzklammer): Infinitiv og kort tillægsform til sidst',
    summary: 'When German uses helper verbs (kann, muss, will) or perfect tense (hat, ist), the main action verb in the infinitive or Partizip II forms a "bracket" and sits at the very end of the clause.',
    similarityNote: 'Danish can sometimes put particles at the end, but German systematically places the entire second verb at the end.',
    differenceNote: 'Danish: "Jeg må arbejde i dag". German: "Ich muss heute arbeiten" (muss [bracket open] heute [bracket closed] arbeiten).',
    germanExample: 'Ich habe gestern ein interessantes Buch gelesen.',
    danishExample: 'Jeg har læst en interessant bog i går.',
    germanBreakdown: [
      { token: 'Ich habe', role: 'Auxiliary verb (Bracket start)' },
      { token: 'gestern ein interessantes Buch', role: 'Middle field (Mittelfeld)' },
      { token: 'gelesen.', role: 'Partizip II (Bracket end)', highlight: true }
    ],
    danishBreakdown: [
      { token: 'Jeg har læst', role: 'Verber samlet i starten', highlight: true },
      { token: 'en interessant bog i går.', role: 'Objekt og tid' }
    ],
    rulesOfThumb: [
      'Modal + Infinitive: "Ich will heute einen Kaffee trinken."',
      'Perfekt: "Ich habe gestern meine Freunde getroffen."',
      'Never put the two verbs together in the middle like in English or Danish!'
    ]
  },
  {
    id: 'sr5',
    category: 'prepositions',
    titleGerman: 'Wechselpräpositionen (Akkusativ bei Bewegung, Dativ bei Ruhe)',
    titleDanish: 'To-vejs præpositioner: Bevægelse mod et mål (Akk) vs Placering (Dat)',
    summary: 'Nine German prepositions (an, auf, hinter, in, neben, über, unter, vor, zwischen) take Akkusativ when there is movement toward a new location (Wohin? - Hvorhen?), and Dativ when indicating stationary location (Wo? - Hvor?).',
    similarityNote: 'Danish expresses this with word pairs like "ind i" (bevægelse) vs "inde i" (ro), or "op på" vs "oppe på".',
    differenceNote: 'German shifts the article: "in den Park" (Akk - moving into) vs "in dem (im) Park" (Dat - being in the park).',
    germanExample: 'Ich lege das Buch auf den Tisch (Akk). Das Buch liegt auf dem Tisch (Dat).',
    danishExample: 'Jeg lægger bogen på bordet. Bogen ligger på bordet.',
    germanBreakdown: [
      { token: 'auf den Tisch', role: 'Akkusativ (Wohin? / Retning)', highlight: true },
      { token: 'auf dem Tisch', role: 'Dativ (Wo? / Placering)', highlight: true }
    ],
    danishBreakdown: [
      { token: 'på bordet (lægger)', role: 'Handling / Bevægelse' },
      { token: 'på bordet (ligger)', role: 'Stilstand / Placering' }
    ],
    rulesOfThumb: [
      'Wohin? (Movement / Destination) -> AKKUSATIV (den / das / die / die)',
      'Wo? (Location / Position) -> DATIV (dem / dem / der / den + n)',
      'Verbs paired: legen (put flat) -> Akk, liegen (lie) -> Dat; stellen (put upright) -> Akk, stehen (stand) -> Dat.'
    ]
  }
];

export const LESSONS_DATABASE: LessonModule[] = [
  {
    id: 'l1',
    number: 1,
    title: 'The German-Danish V2 Superpower & Pronunciation Bridge',
    danishTitle: 'V2-superkraften og lydskiftet fra dansk til tysk',
    level: 'A1-Bridge',
    description: 'Discover how 70% of German main clauses share identical word order with Danish, and unlock the High German consonant shift (Lautverschiebung) to decode German words instantly.',
    contrastiveFocus: 'V2 word order in main clauses; sound shift rules: German Z/TZ = Danish T (Zeit/tid, Katze/kat).',
    syntaxRuleIds: ['sr1'],
    vocabIds: ['v1', 'v9', 'n1', 'n2', 'n3', 'n6'],
    falseFriendIds: ['ff4', 'ff5'],
    drills: [
      {
        id: 'd1_1',
        type: 'sentence_builder',
        title: 'Order the German Sentence (V2 Inversion)',
        danishPrompt: 'I dag arbejder jeg i Berlin.',
        targetGerman: 'Heute arbeite ich in Berlin.',
        jumbledTokens: ['in Berlin.', 'ich', 'Heute', 'arbeite'],
        contrastiveBridge: 'Just like Danish ("I dag arbejder jeg"), starting with "Heute" forces the verb "arbeite" into position 2 before the subject "ich".',
        grammarTip: 'V2 rule: Never say "Heute ich arbeite"!'
      },
      {
        id: 'd1_2',
        type: 'case_detective',
        title: 'Sound Shift Decoder',
        danishPrompt: 'Hvad svarer det tyske ord "die Zunge" til på dansk via lydreglen Z -> T?',
        targetGerman: 'tungen',
        options: ['tungen', 'sangen', 'tanden', 'tungen (tunge)'],
        correctOption: 'tungen (tunge)',
        contrastiveBridge: 'German initial "Z-" consistently turns into Danish "T-" (Zunge -> tunge, Zeit -> tid, Zahn -> tand).',
        grammarTip: 'Whenever you see a Z in German, test if replacing it with T reveals a familiar Danish word!'
      }
    ]
  },
  {
    id: 'l2',
    number: 2,
    title: 'The Verb-Kicking Nebensatz Trap (weil, dass, wenn)',
    danishTitle: 'Ledsætningsfælden: Verbet sparkes til sidst!',
    level: 'A1-Bridge',
    description: 'Master the biggest grammatical divergence between German and Danish: subordinate clauses kicking the conjugated verb to the end.',
    contrastiveFocus: 'Subordinate clauses with weil/dass/wenn vs fordi/at/hvis.',
    syntaxRuleIds: ['sr2'],
    vocabIds: ['v2', 'v3', 'n4', 'n5'],
    falseFriendIds: ['ff1', 'ff2'],
    drills: [
      {
        id: 'd2_1',
        type: 'sentence_builder',
        title: 'Build the Nebensatz (Verb at the End)',
        danishPrompt: 'Jeg bliver hjemme, fordi jeg er træt.',
        targetGerman: 'Ich bleibe zu Hause, weil ich müde bin.',
        jumbledTokens: ['weil', 'Ich bleibe', 'zu Hause,', 'bin.', 'ich', 'müde'],
        contrastiveBridge: 'Danish says "... fordi jeg ER træt" (SVO), but German requires "... weil ich müde BIN" (Verb final)!',
        falseFriendWarning: 'Notice "Ich bleibe" means "I remain/stay", which works here, but for "I get tired" you would say "Ich werde müde".',
        grammarTip: 'Subjunction + Subject + ... + CONJUGATED VERB.'
      },
      {
        id: 'd2_2',
        type: 'false_friend_buster',
        title: 'False Friend Buster: frokost vs Frühstück',
        danishPrompt: 'Hvordan siger man på tysk: "Jeg spiser frokost klokken tolv"?',
        targetGerman: 'Ich esse um zwölf Uhr zu Mittag (Mittagessen).',
        options: [
          'Ich esse um zwölf Uhr Frühstück.',
          'Ich esse um zwölf Uhr zu Mittag.',
          'Ich habe um zwölf Uhr Frokost.'
        ],
        correctOption: 'Ich esse um zwölf Uhr zu Mittag.',
        contrastiveBridge: 'German "Frühstück" is BREAKFAST. For Danish "frokost", you must say "Mittagessen" / "zu Mittag essen".',
        falseFriendWarning: 'Frühstück = Morgenmad!',
        grammarTip: 'Mittagessen = frokost (lunch).'
      }
    ]
  },
  {
    id: 'l3',
    number: 3,
    title: 'The 4 Cases (Kasus) & Bridging the Missing Danish System',
    danishTitle: 'De 4 Kasus: Fra danske pronominer til tyske artikler',
    level: 'A2-Bridge',
    description: 'Learn how to identify Nominativ (Subject), Akkusativ (Direct Object), Dativ (Indirect Object), and Genitiv using Danish pronoun intuitions.',
    contrastiveFocus: 'der/die/das changes across cases (der -> den -> dem -> des).',
    syntaxRuleIds: ['sr3'],
    vocabIds: ['v4', 'n8', 'n9', 'n10'],
    falseFriendIds: ['ff6', 'ff7'],
    drills: [
      {
        id: 'd3_1',
        type: 'case_detective',
        title: 'Choose the Correct Case for the Direct Object (Akkusativ)',
        danishPrompt: 'Manden køber bogen og æblet. (Manden køber [der Apfel]).',
        targetGerman: 'Der Mann kauft den Apfel.',
        options: ['der Apfel', 'den Apfel', 'dem Apfel', 'des Apfels'],
        correctOption: 'den Apfel',
        contrastiveBridge: 'In Danish, "æblet" does not change form. In German, masculine nouns in Akkusativ change from "der" to "den" (like "han" -> "ham").',
        grammarTip: 'Masculine Akkusativ is the only one with the distinct "-en" ending (den, einen, meinen).'
      },
      {
        id: 'd3_2',
        type: 'case_detective',
        title: 'Dative Case with "gehören"',
        danishPrompt: 'Bogen tilhører manden. (Das Buch gehört [der Mann]).',
        targetGerman: 'Das Buch gehört dem Mann.',
        options: ['den Mann', 'der Mann', 'dem Mann', 'des Manns'],
        correctOption: 'dem Mann',
        contrastiveBridge: 'The verb "gehören" requires a Dative object: "dem Mann" (corresponds to Danish hensynsled / til manden).',
        grammarTip: 'Dative masculine/neutral article is always "dem".'
      }
    ]
  },
  {
    id: 'l4',
    number: 4,
    title: 'Modal Verbs: The "Må / Müssen / Dürfen" Trap & Satzklammer',
    danishTitle: 'Modalverber og den store "Må"-fælde',
    level: 'A2-Bridge',
    description: 'Unpack the biggest confusion in Danish-German bilingualism: Danish "må" split into "müssen" (obligation) vs "dürfen" (permission), and placing the infinitive at the end of the sentence.',
    contrastiveFocus: 'Müssen vs dürfen; modal verb sentence bracket (Satzklammer).',
    syntaxRuleIds: ['sr4'],
    vocabIds: ['v7', 'v8', 'v5', 'v6'],
    falseFriendIds: ['ff3'],
    drills: [
      {
        id: 'd4_1',
        type: 'sentence_builder',
        title: 'Build the Sentence with Modal Verb (Infinitive Bracket)',
        danishPrompt: 'Jeg må (har lov til at) parkere her i dag.',
        targetGerman: 'Ich darf heute hier parken.',
        jumbledTokens: ['parken.', 'Ich darf', 'hier', 'heute'],
        contrastiveBridge: 'Danish "må gerne / have lov til" = German "darf". The infinitive "parken" goes to the very end!',
        falseFriendWarning: 'Do NOT use "Ich muss" here, as "muss" means "I am forced to/must".',
        grammarTip: 'Modal in position 2, infinitive at the end of the clause.'
      }
    ]
  },
  {
    id: 'l5',
    number: 5,
    title: 'Wechselpräpositionen: Movement (Akk) vs Static Location (Dat)',
    danishTitle: 'To-vejs præpositioner: Ind på (Akk) vs Inde på (Dat)',
    level: 'A2-Bridge',
    description: 'Master the 9 two-way prepositions by comparing them to Danish distinctions between movement and resting states.',
    contrastiveFocus: 'an, auf, hinter, in, neben, über, unter, vor, zwischen + Akk/Dat.',
    syntaxRuleIds: ['sr5'],
    vocabIds: ['n7', 'a3', 'a4'],
    falseFriendIds: ['ff8'],
    drills: [
      {
        id: 'd5_1',
        type: 'case_detective',
        title: 'Wohin vs Wo: Choose the Right Article',
        danishPrompt: 'Jeg stiller koppen på bordet. (Ich stelle die Tasse auf [der Tisch]).',
        targetGerman: 'auf den Tisch',
        options: ['auf den Tisch', 'auf dem Tisch', 'auf der Tisch', 'auf des Tisches'],
        correctOption: 'auf den Tisch',
        contrastiveBridge: 'Stellen is an action with movement/destination (Wohin?), requiring Akkusativ ("den Tisch"). Compare with Danish "Jeg stiller koppen op på bordet".',
        grammarTip: 'Movement to destination = Akkusativ (den Tisch). Static resting = Dativ (auf dem Tisch).'
      }
    ]
  }
];
