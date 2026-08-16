import { initializeApp, getApps } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  type Auth,
} from 'firebase/auth';

export interface RuntimeConfig {
  firebase: {
    apiKey: string;
    appId: string;
    authDomain: string;
    projectId: string;
  };
  allowedEmail: string;
}

let runtimeConfigPromise: Promise<RuntimeConfig> | null = null;
let authPromise: Promise<Auth> | null = null;

export function getRuntimeConfig(): Promise<RuntimeConfig> {
  if (!runtimeConfigPromise) {
    runtimeConfigPromise = fetch('/api/config', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('The application configuration could not be loaded.');
        const config = await response.json() as RuntimeConfig;
        localStorage.setItem('oys-runtime-config', JSON.stringify(config));
        return config;
      })
      .catch((cause: unknown) => {
        const cached = localStorage.getItem('oys-runtime-config');
        if (cached) return JSON.parse(cached) as RuntimeConfig;
        throw cause;
      });
  }
  return runtimeConfigPromise;
}

export function getFirebaseAuth(): Promise<Auth> {
  if (!authPromise) {
    authPromise = getRuntimeConfig().then(async ({ firebase }) => {
      const app = getApps()[0] ?? initializeApp(firebase);
      const auth = getAuth(app);
      await setPersistence(auth, browserLocalPersistence);
      auth.useDeviceLanguage();
      return auth;
    });
  }
  return authPromise;
}

export async function authorizedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const auth = await getFirebaseAuth();
  const token = await auth.currentUser?.getIdToken();
  if (!token) {
    throw new Error('Authentication is required.');
  }

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);

  return fetch(input, { ...init, headers });
}
