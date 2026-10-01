import React from 'react';
import { WifiOff, AlertTriangle } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto z-50 p-3 rounded-2xl bg-amber-950/95 border border-amber-500/50 text-amber-200 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in duration-200">
      <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
        <WifiOff className="w-4 h-4 text-amber-400" />
      </div>
      <div>
        <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
          <span>Offline Mode Active</span>
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        </h5>
        <p className="text-[11px] text-amber-300">
          Downloader UI and cached history are available offline.
        </p>
      </div>
    </div>
  );
};
