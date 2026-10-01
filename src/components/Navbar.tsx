import React from 'react';
import { Download, Sparkles, History, Zap, Shield, Play, Server, Layers } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  activeTab: 'downloader' | 'batch' | 'service' | 'history' | 'ai-insights';
  setActiveTab: (tab: 'downloader' | 'batch' | 'service' | 'history' | 'ai-insights') => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, historyCount }) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('downloader')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[2px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Download className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white font-mono flex items-center">
                Vibe<span className="bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(236,72,153,0.4)]">Hub</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                PRO 4K
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              YouTube • Instagram Reels • Facebook Watch
            </p>
          </div>
        </div>

        {/* Live Engine Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-slate-400">Engine:</span>
          <span className="font-medium text-emerald-400">yt-dlp v2026</span>
          <span className="text-slate-600">•</span>
          <span className="font-mono text-cyan-400">FFmpeg 4K</span>
          <span className="text-slate-600">•</span>
          <span className="font-mono text-purple-400">Gemini 3.1 Thinking</span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('downloader')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'downloader'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Downloader</span>
          </button>

          <button
            onClick={() => setActiveTab('batch')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'batch'
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Batch URLs</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
              MULTI
            </span>
          </button>

          <button
            onClick={() => setActiveTab('service')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'service'
                ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Server className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">Download Service</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              LIVE
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ai-insights')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'ai-insights'
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">AI Intelligence</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
              HIGH
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-cyan-500 text-slate-950 leading-none">
                {historyCount}
              </span>
            )}
          </button>

          <div className="hidden sm:block h-5 w-[1px] bg-slate-800 mx-0.5" />
          <PWAInstallButton />
        </nav>
      </div>
    </header>
  );
};
