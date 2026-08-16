import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { LogIn, ShieldCheck } from 'lucide-react';
import { getFirebaseAuth, getRuntimeConfig } from './firebase';

interface AuthContextValue {
  user: User;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider.');
  return value;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [allowedEmail, setAllowedEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let unsubscribe = () => undefined;

    Promise.all([getFirebaseAuth(), getRuntimeConfig()])
      .then(async ([auth, config]) => {
        setAllowedEmail(config.allowedEmail);
        await getRedirectResult(auth);
        unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
          const email = nextUser?.email?.toLowerCase();
          if (nextUser && email !== config.allowedEmail.toLowerCase()) {
            await signOut(auth);
            setUser(null);
            setError(`This private alpha is restricted to ${config.allowedEmail}.`);
          } else {
            setUser(nextUser);
            setError('');
          }
          setLoading(false);
        });
      })
      .catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : 'Authentication could not be initialized.');
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    setError('');
    const auth = await getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ login_hint: allowedEmail });
    await signInWithPopup(auth, provider);
  };

  const value = useMemo<AuthContextValue | null>(
    () => user ? { user, signOutUser: async () => signOut(await getFirebaseAuth()) } : null,
    [user],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 text-white grid place-items-center p-6">
        <div className="text-center space-y-3" role="status" aria-live="polite">
          <div className="w-12 h-12 rounded-2xl border-2 border-amber-400 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-stone-300">Securing OYS Language Pal…</p>
        </div>
      </div>
    );
  }

  if (!user || !value) {
    return (
      <main className="min-h-screen bg-stone-950 text-white grid place-items-center p-5">
        <section className="w-full max-w-sm bg-stone-900 border border-stone-700 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
            <img src="/icons/icon-192.png" alt="" className="w-full h-full" />
          </div>
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
              <ShieldCheck className="w-4 h-4" /> Private mobile alpha
            </span>
            <h1 className="text-3xl font-bold tracking-tight">OYS Language Pal</h1>
            <p className="text-sm leading-relaxed text-stone-300">
              Your private German-through-Danish learning companion. Sign in with the approved Google account to continue.
            </p>
          </div>
          {error && <p className="text-sm text-red-200 bg-red-950/60 border border-red-800 rounded-xl p-3" role="alert">{error}</p>}
          <button
            type="button"
            onClick={signIn}
            className="min-h-12 w-full rounded-xl bg-white text-stone-950 font-semibold flex items-center justify-center gap-2 hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            <LogIn className="w-5 h-5" /> Continue with Google
          </button>
          <p className="text-xs text-stone-500 text-center">Authorized account: {allowedEmail}</p>
        </section>
      </main>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
