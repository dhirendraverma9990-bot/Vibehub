import React from 'react';
import { History, Trash2, Download, ExternalLink, Video, Music, Calendar } from 'lucide-react';
import { DownloadHistoryItem } from '../types';
import { PlatformBadge } from './PlatformBadge';

interface HistoryDrawerProps {
  history: DownloadHistoryItem[];
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
  onSelectUrl: (url: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  history,
  onClearHistory,
  onRemoveItem,
  onSelectUrl,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Download History & Queue
            </h2>
            <p className="text-xs text-slate-400">
              Locally stored downloads across your sessions.
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-16 text-center glass-panel rounded-3xl border border-slate-800/80 p-8 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-900/90 text-slate-500 flex items-center justify-center mx-auto">
            <History className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-slate-300">No downloads recorded yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you extract and download videos or MP3 audio from YouTube, Instagram, or Facebook, your session items will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="glass-panel hover:glass-panel-glow rounded-2xl p-4 flex gap-3.5 items-center justify-between border border-slate-800 transition-all group"
            >
              {/* Thumbnail */}
              <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    {item.formatType === 'video' ? <Video className="w-6 h-6" /> : <Music className="w-6 h-6" />}
                  </div>
                )}
                <div className="absolute top-1 left-1">
                  <PlatformBadge platform={item.platform} size="sm" />
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-bold uppercase">
                    {item.ext} • {item.quality}
                  </span>
                  {item.fileSize && <span>{item.fileSize}</span>}
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-1 font-mono">
                  <Calendar className="w-3 h-3" />
                  <span>{item.date}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onSelectUrl(item.originalUrl)}
                  className="p-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-400 border border-cyan-500/30 transition-colors"
                  title="Re-fetch media"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-rose-400 border border-slate-800 transition-colors"
                  title="Remove from history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
