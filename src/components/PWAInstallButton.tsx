import React, { useState } from 'react';
import { Download, Smartphone, Share2, PlusSquare, X, Check, Laptop } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running inside standalone PWA mode, suppress button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // General instructions modal for desktop Chrome / Edge / Firefox
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold shadow-sm shadow-cyan-500/10 transition-all cursor-pointer group"
        title="Install as native Progressive Web App for offline access"
      >
        <Smartphone className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">Install PWA</span>
        <span className="sm:hidden">Install</span>
        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
          OFFLINE
        </span>
      </button>

      {/* Success Notification */}
      {installSuccess && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-950 border border-emerald-500/50 text-emerald-200 shadow-2xl flex items-center gap-3 animate-in fade-in duration-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white">App Installed Successfully</h5>
            <p className="text-[11px] text-emerald-300">OmniStream is now available on your home screen & offline.</p>
          </div>
        </div>
      )}

      {/* iOS & Desktop Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-cyan-500/40 p-6 shadow-2xl space-y-5">
            
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2 pt-2">
              <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400 shadow-lg shadow-cyan-500/20">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Install OmniStream PWA
              </h3>
              <p className="text-xs text-slate-400">
                Install to your home screen or desktop for full offline interface access and ultra-fast media conversions.
              </p>
            </div>

            {isIOS ? (
              <div className="space-y-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 font-mono flex items-center justify-center shrink-0 text-[11px] font-bold">1</span>
                  <p>Tap the <span className="font-semibold text-white inline-flex items-center gap-1 mx-1"><Share2 className="w-3.5 h-3.5 text-cyan-400" /> Share</span> icon in the Safari bottom toolbar.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 font-mono flex items-center justify-center shrink-0 text-[11px] font-bold">2</span>
                  <p>Scroll down and tap <span className="font-semibold text-white inline-flex items-center gap-1 mx-1"><PlusSquare className="w-3.5 h-3.5 text-cyan-400" /> Add to Home Screen</span>.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 font-mono flex items-center justify-center shrink-0 text-[11px] font-bold">3</span>
                  <p>Tap <strong className="text-white">Add</strong> in the top right. Launch from your home screen anytime!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 font-mono flex items-center justify-center shrink-0 text-[11px] font-bold">1</span>
                  <p>In Chrome or Edge, look for the <strong className="text-white">Install</strong> icon in the address bar (or browser menu).</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 font-mono flex items-center justify-center shrink-0 text-[11px] font-bold">2</span>
                  <p>Click <strong className="text-white">Install OmniStream</strong> to launch as a standalone desktop app.</p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Got it
            </button>

          </div>
        </div>
      )}
    </>
  );
};
