import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem('install-prompt-dismissed') === 'true');

  useEffect(() => {
    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  if (!installEvent || dismissed || window.matchMedia('(display-mode: standalone)').matches) return null;

  const install = async () => {
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') setInstallEvent(null);
  };

  const dismiss = () => {
    sessionStorage.setItem('install-prompt-dismissed', 'true');
    setDismissed(true);
  };

  return (
    <aside className="max-w-7xl mx-auto w-full px-3 sm:px-6 pt-3" aria-label="Install application">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center gap-3 shadow-xs">
        <img src="/icons/icon-192.png" alt="" className="w-11 h-11 rounded-xl" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-stone-900">Install on this phone</p>
          <p className="text-xs text-stone-600">Open OYS Language Pal from your home screen.</p>
        </div>
        <button type="button" onClick={() => void install()} className="min-h-11 px-3 rounded-xl bg-stone-900 text-white text-xs font-semibold flex items-center gap-1.5">
          <Download className="w-4 h-4" /> Install
        </button>
        <button type="button" onClick={dismiss} className="min-w-11 min-h-11 rounded-xl grid place-items-center text-stone-500" aria-label="Dismiss install suggestion">
          <X className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
