import { authorizedFetch } from '../auth/firebase';

// Web Audio and Speech synthesis utility for German and Danish audio pronunciation

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass({ sampleRate: 24000 });
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Convert Base64 PCM 16-bit to AudioBuffer
export function playPCMBase64(base64Data: string, sampleRate = 24000): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const ctx = getAudioContext();
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const int16Array = new Int16Array(bytes.buffer);
      const float32Array = new Float32Array(int16Array.length);

      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      const audioBuffer = ctx.createBuffer(1, float32Array.length, sampleRate);
      audioBuffer.getChannelData(0).set(float32Array);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => resolve();
      source.start(0);
    } catch (err) {
      console.error('Failed to play PCM base64 audio:', err);
      reject(err);
    }
  });
}

// Speak using client SpeechSynthesis (German or Danish)
export function speakText(text: string, lang: 'de' | 'da' = 'de'): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      resolve();
      return;
    }

    window.speechSynthesis.cancel(); // Stop ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'de' ? 'de-DE' : 'da-DK';
    utterance.rate = 0.92; // Slightly slowed down for clear pedagogy
    utterance.pitch = 1.0;

    // Pick suitable voice if available
    const voices = window.speechSynthesis.getVoices();
    const targetLangCode = lang === 'de' ? 'de' : 'da';
    const voice = voices.find((v) => v.lang.toLowerCase().startsWith(targetLangCode));
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

// Speak with Gemini TTS on the backend, falling back to browser speech synthesis
export async function playGermanAudio(text: string): Promise<void> {
  try {
    const res = await authorizedFetch('/api/tutor/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice: 'Kore' }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.audio) {
        await playPCMBase64(data.audio);
        return;
      }
    }
  } catch (e) {
    console.warn('Backend TTS failed, using Web Speech API fallback:', e);
  }

  // Fallback to local SpeechSynthesis
  await speakText(text, 'de');
}
