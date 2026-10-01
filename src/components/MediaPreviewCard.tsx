import React, { useState } from 'react';
import { 
  Play, 
  Download, 
  Music, 
  Video, 
  Sparkles, 
  Clock, 
  User, 
  Eye, 
  ExternalLink, 
  QrCode, 
  Check, 
  Copy, 
  Sliders,
  Volume2
} from 'lucide-react';
import { MediaInfo, VideoFormat, AudioFormat } from '../types';
import { PlatformBadge } from './PlatformBadge';

interface MediaPreviewCardProps {
  media: MediaInfo;
  onStartDownload: (formatType: 'video' | 'audio', quality: string, ext: string) => void;
  onOpenPlayer: () => void;
  onOpenAiAnalysis: () => void;
  onOpenQr: () => void;
}

export const MediaPreviewCard: React.FC<MediaPreviewCardProps> = ({
  media,
  onStartDownload,
  onOpenPlayer,
  onOpenAiAnalysis,
  onOpenQr,
}) => {
  const [formatType, setFormatType] = useState<'video' | 'audio'>('video');
  const [selectedQuality, setSelectedQuality] = useState<string>(
    media.videoFormats.find(f => f.recommended)?.quality || media.videoFormats[0]?.quality || '1080p'
  );
  const [copiedTitle, setCopiedTitle] = useState(false);

  const currentVideoFormat = media.videoFormats.find(f => f.quality === selectedQuality) || media.videoFormats[0];
  const currentAudioFormat = media.audioFormats.find(f => f.quality === selectedQuality) || media.audioFormats[0];

  const handleFormatTypeChange = (type: 'video' | 'audio') => {
    setFormatType(type);
    if (type === 'video') {
      const rec = media.videoFormats.find(f => f.recommended) || media.videoFormats[0];
      setSelectedQuality(rec?.quality || '1080p');
    } else {
      const rec = media.audioFormats.find(f => f.recommended) || media.audioFormats[0];
      setSelectedQuality(rec?.quality || '320k');
    }
  };

  const handleCopyTitle = () => {
    navigator.clipboard.writeText(media.title);
    setCopiedTitle(true);
    setTimeout(() => setCopiedTitle(false), 2000);
  };

  const handleTriggerDownload = () => {
    const ext = formatType === 'video' ? 'mp4' : 'mp3';
    onStartDownload(formatType, selectedQuality, ext);
  };

  const currentEstSize = formatType === 'video' 
    ? (currentVideoFormat?.estSize || '~25 MB') 
    : (currentAudioFormat?.estSize || '~8 MB');

  return (
    <div className="w-full glass-panel-glow rounded-3xl p-5 sm:p-7 transition-all duration-300 relative overflow-hidden">
      
      {/* Ambient background glow behind card */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        
        {/* Left Column: Thumbnail with Player Overlay */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="relative group rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl aspect-video flex items-center justify-center">
            {media.thumbnail ? (
              <img
                src={media.thumbnail}
                alt={media.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  // Fallback thumbnail if broken
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500">
                <Video className="w-12 h-12 mb-2" />
                <span className="text-xs">No Thumbnail Preview</span>
              </div>
            )}

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

            {/* Play Button Overlay */}
            <button
              onClick={onOpenPlayer}
              className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/50 hover:scale-110 active:scale-95 transition-all duration-200 group-hover:opacity-100 opacity-90"
              title="Preview media playback"
            >
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </button>

            {/* Duration Badge */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-md text-[11px] font-mono font-medium text-slate-200 border border-white/10">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>{media.duration}</span>
            </div>

            {/* Top Platform Badge */}
            <div className="absolute top-3 left-3">
              <PlatformBadge platform={media.platform} size="sm" />
            </div>
          </div>

          {/* Quick Media Meta tags */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
            <div className="flex items-center gap-1.5 truncate">
              <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate text-slate-300 font-sans">{media.author}</span>
            </div>
            {media.views && (
              <div className="flex items-center gap-1 shrink-0">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>{media.views} views</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Title, Format Switches, and Controls */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-5">
          
          {/* Header Title with Copy */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug line-clamp-2">
                {media.title}
              </h2>
              <button
                onClick={handleCopyTitle}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors shrink-0"
                title="Copy Title"
              >
                {copiedTitle ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {media.description && (
              <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {media.description}
              </p>
            )}
          </div>

          {/* Format Type Selector (MP4 Video vs MP3 Audio) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                Select Output Format:
              </span>
              <span className="text-xs text-cyan-400/90 font-mono font-medium">
                Est. Size: {currentEstSize}
              </span>
            </div>

            {/* Primary Format Toggle Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950/90 border border-slate-800">
              <button
                onClick={() => handleFormatTypeChange('video')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                  formatType === 'video'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>MP4 Video (HD/4K)</span>
              </button>

              <button
                onClick={() => handleFormatTypeChange('audio')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                  formatType === 'audio'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md shadow-purple-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <Music className="w-4 h-4" />
                <span>MP3 Audio (HQ)</span>
              </button>
            </div>

            {/* Quality Resolution Pills Grid */}
            <div className="pt-1">
              {formatType === 'video' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {media.videoFormats.map((fmt) => {
                    const isSelected = selectedQuality === fmt.quality;
                    return (
                      <button
                        key={fmt.quality}
                        onClick={() => setSelectedQuality(fmt.quality)}
                        className={`relative flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-sm shadow-cyan-500/20'
                            : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-sm font-mono tracking-tight text-cyan-300">
                            {fmt.quality}
                          </span>
                          {fmt.recommended && (
                            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                              Best
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 truncate mt-0.5">
                          {fmt.label}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono mt-1">
                          ~{fmt.estSize}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {media.audioFormats.map((fmt) => {
                    const isSelected = selectedQuality === fmt.quality;
                    return (
                      <button
                        key={fmt.quality}
                        onClick={() => setSelectedQuality(fmt.quality)}
                        className={`relative flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-purple-950/40 border-purple-400 text-white shadow-sm shadow-purple-500/20'
                            : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-sm font-mono tracking-tight text-purple-300">
                            {fmt.quality}
                          </span>
                          {fmt.recommended && (
                            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                              HQ
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 truncate mt-0.5">
                          {fmt.label.split('(')[0]}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono mt-1">
                          ~{fmt.estSize}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            
            {/* Main Download Button */}
            <button
              onClick={handleTriggerDownload}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-xl font-bold text-sm text-slate-950 neon-button flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
              <span>
                Download {formatType.toUpperCase()} ({selectedQuality})
              </span>
            </button>

            {/* Secondary Action: AI Deep Thinking Intelligence */}
            <button
              onClick={onOpenAiAnalysis}
              className="w-full sm:w-auto py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-purple-950/70 hover:bg-purple-900/80 text-purple-200 border border-purple-500/40 shadow-sm shadow-purple-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
              title="Deep Thinking Video Intelligence"
            >
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>AI Deep Think</span>
            </button>

            {/* Mobile QR Transfer Button */}
            <button
              onClick={onOpenQr}
              className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors"
              title="Download on Mobile via QR"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* Open Original Link */}
            <a
              href={media.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors"
              title="Open Source Video"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
