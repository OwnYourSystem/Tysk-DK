import express from "express";
import path from "path";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "32kb" }));

const ALLOWED_USER_EMAIL = (process.env.ALLOWED_USER_EMAIL || "").trim().toLowerCase();
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || "";

if (process.env.NODE_ENV === "production" && !ALLOWED_USER_EMAIL) {
  throw new Error("ALLOWED_USER_EMAIL must be configured in production.");
}

const firebaseAdminApp = getApps()[0] ?? initializeApp({ projectId: FIREBASE_PROJECT_ID });
const firebaseAuth = getAuth(firebaseAdminApp);
const firestore = getFirestore(firebaseAdminApp);
const FIREBASE_HOSTING_AUTH_DOMAIN = `${FIREBASE_PROJECT_ID}.firebaseapp.com`;

async function requireApprovedUser(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authorization = req.header("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Authentication required" });

  try {
    const decoded = await firebaseAuth.verifyIdToken(token, true);
    const email = decoded.email?.toLowerCase();
    if (!decoded.email_verified || email !== ALLOWED_USER_EMAIL) {
      return res.status(403).json({ error: "This account is not approved for the private alpha" });
    }
    (req as express.Request & { authUser?: { uid: string; email: string } }).authUser = {
      uid: decoded.uid,
      email,
    };
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired authentication" });
  }
}

const privateApiLimiter = rateLimit({
  windowMs: 60_000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) => (req as express.Request & { authUser?: { uid: string } }).authUser?.uid || "anonymous",
  message: { error: "Please wait a moment before making more requests" },
});

// Keep Firebase's OAuth helper on the same origin as the PWA. This avoids
// popup/redirect failures in browsers that isolate cross-origin opener state.
app.get(/^\/__\/auth\//, async (req, res) => {
  try {
    const upstream = await fetch(`https://${FIREBASE_HOSTING_AUTH_DOMAIN}${req.originalUrl}`, {
      headers: {
        accept: req.header("accept") || "*/*",
        "accept-language": req.header("accept-language") || "en",
        "user-agent": req.header("user-agent") || "OYS Language Pal",
      },
    });
    const contentType = upstream.headers.get("content-type");
    const cacheControl = upstream.headers.get("cache-control");
    if (contentType) res.set("Content-Type", contentType);
    if (cacheControl) res.set("Cache-Control", cacheControl);
    return res.status(upstream.status).send(Buffer.from(await upstream.arrayBuffer()));
  } catch {
    return res.status(502).send("Authentication helper unavailable");
  }
});

app.get("/api/config", (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({
    allowedEmail: ALLOWED_USER_EMAIL,
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY || "",
      appId: process.env.FIREBASE_APP_ID || "",
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
      projectId: FIREBASE_PROJECT_ID,
    },
  });
});

app.get("/api/reset", (_req, res) => {
  res.set("Clear-Site-Data", '"cache", "cookies", "storage"');
  res.set("Cache-Control", "no-store");
  res.type("html").send(`<!doctype html>
    <html lang="en">
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Resetting OYS Language Pal</title></head>
      <body style="font-family:system-ui;background:#1c1917;color:white;display:grid;place-items:center;min-height:100vh;margin:0;text-align:center">
        <main><h1>Application reset</h1><p>The old offline cache and sign-in session were cleared.</p><a href="/" style="color:#fbbf24">Return to OYS Language Pal</a></main>
        <script>setTimeout(() => location.replace('/?reset=complete'), 800);</script>
      </body>
    </html>`);
});

app.use("/api/tutor", requireApprovedUser, privateApiLimiter);
app.use("/api/progress", requireApprovedUser, privateApiLimiter);

const DEFAULT_PROGRESS = {
  activeTab: "chat",
  drillAttempts: 0,
  correctAnswers: 0,
  completedLessonIds: [] as string[],
};

app.get("/api/progress", async (req, res) => {
  const user = (req as express.Request & { authUser: { uid: string; email: string } }).authUser;
  const snapshot = await firestore.collection("users").doc(user.uid).get();
  res.set("Cache-Control", "no-store");
  return res.json(snapshot.exists ? { ...DEFAULT_PROGRESS, ...snapshot.data() } : DEFAULT_PROGRESS);
});

app.patch("/api/progress", async (req, res) => {
  const user = (req as express.Request & { authUser: { uid: string; email: string } }).authUser;
  const patch: Record<string, unknown> = {};
  const allowedTabs = new Set(["chat", "lab", "dictionary", "syntax", "false_friends", "drills", "lessons"]);

  if (typeof req.body.activeTab === "string" && allowedTabs.has(req.body.activeTab)) patch.activeTab = req.body.activeTab;
  if (Number.isInteger(req.body.drillAttempts) && req.body.drillAttempts >= 0) patch.drillAttempts = Math.min(req.body.drillAttempts, 1_000_000);
  if (Number.isInteger(req.body.correctAnswers) && req.body.correctAnswers >= 0) patch.correctAnswers = Math.min(req.body.correctAnswers, 1_000_000);
  if (Array.isArray(req.body.completedLessonIds)) {
    patch.completedLessonIds = req.body.completedLessonIds.filter((value: unknown): value is string => typeof value === "string").slice(0, 500);
  }

  patch.email = user.email;
  patch.updatedAt = new Date().toISOString();
  await firestore.collection("users").doc(user.uid).set(patch, { merge: true });
  return res.json({ ok: true, updatedAt: patch.updatedAt });
});

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
