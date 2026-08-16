import express from "express";
import path from "path";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Lazy-initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const project = process.env.GOOGLE_CLOUD_PROJECT;
    const location = process.env.GOOGLE_CLOUD_LOCATION || "global";
    const apiKey = process.env.GEMINI_API_KEY;
    if (project) {
      aiClient = new GoogleGenAI({
        vertexai: true,
        project,
        location,
        httpOptions: {
          headers: {
            "User-Agent": "tysk-dk",
          },
        },
      });
    } else {
      if (!apiKey) {
        console.warn("Neither GOOGLE_CLOUD_PROJECT nor GEMINI_API_KEY is configured.");
      }
      aiClient = new GoogleGenAI({
        apiKey: apiKey || "",
        httpOptions: {
          headers: {
            "User-Agent": "tysk-dk",
          },
        },
      });
    }
  }
  return aiClient;
}

// System prompt embodying the specialized German tutor for Danish B2 learners
const SYSTEM_PROMPT = `
You are an expert German language tutor specialized exclusively for learners who already speak Danish at an upper-intermediate (B2) level.
Your pedagogy is built on German-Danish contrastive linguistics:

CORE PEDAGOGICAL DIRECTIVES:
1. CONTRASTIVE DICTIONARY: Always introduce new German vocabulary side-by-side with its Danish equivalent (e.g., German: "versuchen" → Danish: "forsøge", German: "gehören" → Danish: "tilhøre").
2. SYNTAX COMPARISONS: Highlight structural similarities (e.g., shared V2 word order in main clauses: "Heute lerne ich" ↔ "I dag lærer jeg") and explicitly teach major differences (e.g., German subordinate clauses kicking the conjugated verb to the end: "weil ich krank BIN" vs Da: "fordi jeg ER syg", and German's 4 noun cases vs Danish's lack of case inflections).
3. FALSE FRIEND WARNINGS: Actively warn the student when a German word looks like a Danish word but has a different meaning (e.g., "bleiben" = remain vs Da "blive" = become/remain; "Frühstück" = breakfast vs Da "frokost" = lunch; "dürfen" = may/allowed vs Da "må"; "Gift" = poison vs Da "gift").
4. 3-PART CORRECTION LOOP: Whenever the student attempts a German phrase or sentence, you MUST analyze it through this exact 3-part lens:
   - Part 1: [Identified Errors] (Grammar, case, verb position, gender, or false cognate)
   - Part 2: [Danish Transfer Diagnosis] (Did the student transfer a Danish pattern directly to German? E.g., SVO in subordinate clause, wrong modal verb 'må' -> 'muss' instead of 'darf', omitting Dative/Accusative case, using 'bleiben' for 'blive/become' etc.)
   - Part 3: [Correct German & Bridge Explanation] (The correct native German sentence with Danish cognitive bridge and memorable rule).

LANGUAGE USE:
Use clear English or Danish for meta-explanations of complex grammatical mechanics, but keep all exercises, vocabulary pairings, and sentences focused on the German-Danish bridge. Be encouraging, precise, and pedagogically sharp.
`;

// 1. Chat with Tutor
app.post("/api/tutor/chat", async (req, res) => {
  try {
    const { messages, topic } = req.body;
    const ai = getAI();

    const prompt = `
System Context: ${SYSTEM_PROMPT}

Current topic: ${topic || "General German Practice with Danish B2 Bridge"}

Conversation History:
${messages
  .map((m: { role: string; content: string }) => `${m.role === "user" ? "Student" : "Tutor"}: ${m.content}`)
  .join("\n")}

Respond as the specialized German Tutor. If the student made any German attempt in their latest message, incorporate the 3-part correction loop (Identified Errors, Danish Transfer Diagnosis, Correct German & Bridge). Always provide Danish translations alongside German terms.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
    });

    res.json({ reply: response.text || "Es tut mir leid, ich konnte keine Antwort generieren." });
  } catch (error: any) {
    console.error("Error in /api/tutor/chat:", error);
    res.status(500).json({ error: error.message || "Failed to generate chat response" });
  }
});

// 2. Dedicated 3-Part Sentence Analyzer
app.post("/api/tutor/analyze", async (req, res) => {
  try {
    const { germanSentence, intendedMeaningDanish } = req.body;
    const ai = getAI();

    const prompt = `
Analyze the following German sentence written by a Danish B2 speaker learning German:
Student German: "${germanSentence}"
Intended Danish meaning / Context: "${intendedMeaningDanish || "Not provided"}"

Provide a structured JSON response evaluating the sentence through the 3-part German-Danish contrastive lens.
Respond strictly in valid JSON matching this schema:
{
  "isCorrect": boolean,
  "confidenceScore": number (0 to 100),
  "identifiedErrors": [
    {
      "error": string,
      "type": "word_order" | "case_inflection" | "false_friend" | "gender" | "preposition" | "verb_conjugation" | "other",
      "explanation": string
    }
  ],
  "danishTransferDiagnosis": {
    "isDanishInterference": boolean,
    "patternDescription": string,
    "danishEquivalent": string
  },
  "correction": {
    "correctGerman": string,
    "danishComparison": string,
    "keyTakeaway": string
  },
  "contrastiveNotes": [
    {
      "german": string,
      "danish": string,
      "ruleOrTip": string
    }
  ],
  "falseFriendAlert": string | null
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/tutor/analyze:", error);
    res.status(500).json({ error: error.message || "Failed to analyze sentence" });
  }
});

// 3. Dynamic Exercise Generator
app.post("/api/tutor/generate-exercise", async (req, res) => {
  try {
    const { topic, difficulty = "beginner", type = "sentence_builder" } = req.body;
    const ai = getAI();

    const prompt = `
Generate 3 German learning exercises specifically tailored for a Danish speaker (B2 in Danish) learning German.
Topic: ${topic}
Type: ${type} (Options: sentence_builder, case_detective, false_friend_buster, translation_bridge)

Output strictly valid JSON with this format:
{
  "exercises": [
    {
      "id": string,
      "type": "${type}",
      "title": string,
      "danishPrompt": string,
      "targetGerman": string,
      "jumbledTokens": string[] (if sentence_builder),
      "options": string[] (if multiple choice),
      "correctOption": string (if multiple choice),
      "contrastiveBridge": string,
      "falseFriendWarning": string | null,
      "grammarTip": string
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/tutor/generate-exercise:", error);
    res.status(500).json({ error: error.message || "Failed to generate exercises" });
  }
});

// 4. Gemini Text-To-Speech (German voice)
app.post("/api/tutor/tts", async (req, res) => {
  try {
    const { text, voice = "Kore" } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Speak clearly in standard high German with natural cadence: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice as any },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({ audio: base64Audio, mimeType: "audio/pcm;rate=24000" });
    } else {
      res.status(500).json({ error: "No audio generated" });
    }
  } catch (error: any) {
    console.warn("Gemini TTS endpoint encountered an error, client will use Web Speech API fallback:", error.message);
    res.status(500).json({ error: error.message || "TTS error", fallback: true });
  }
});

// 5. Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", tutor: "Tysk via Dansk (German for Danish B2 learners)" });
});

// Vite middleware & Static serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`German-Danish Tutor Server listening on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
