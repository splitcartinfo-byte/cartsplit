import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-16 md:bottom-6 right-4 z-40 bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl shadow-2xl max-w-xs space-y-2 animate-slide-up">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-amber-400">Install PWA App</span>
        <button onClick={() => setIsVisible(false)} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs text-slate-300">Add Fashion Groups to your home screen for instant local offer discovery!</p>
      <button
        onClick={handleInstall}
        className="w-full py-2 bg-blue-600 hover:bg-blue-500 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install Web App</span>
      </button>
    </div>
  );
};
