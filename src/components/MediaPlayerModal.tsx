import React from 'react';
import { X, Play, Video, ExternalLink } from 'lucide-react';
import { MediaInfo } from '../types';

interface MediaPlayerModalProps {
  media: MediaInfo | null;
  onClose: () => void;
}

export const MediaPlayerModal: React.FC<MediaPlayerModalProps> = ({ media, onClose }) => {
  if (!media) return null;

  // Check if it's YouTube for iframe embed
  const isYouTube = media.platform === 'youtube';
  const youtubeVideoId = media.id && media.id.length === 11 ? media.id : (
    media.url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/)?.[1]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl glass-panel-glow rounded-3xl p-5 sm:p-7 relative overflow-hidden shadow-2xl border border-cyan-500/30 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 max-w-[80%]">
            <div className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
              <Video className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h3 className="text-base font-bold text-white truncate">
                {media.title}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {media.author} • {media.duration}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Display */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl flex items-center justify-center">
          {isYouTube && youtubeVideoId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&rel=0`}
              title={media.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : media.directStreamUrl ? (
            <video
              src={media.directStreamUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
              <img
                src={media.thumbnail}
                alt={media.title}
                className="max-h-60 rounded-xl object-cover mb-2 border border-slate-800 shadow-lg"
              />
              <p className="text-xs text-slate-400 max-w-md">
                Direct embedded stream preview is restricted by {media.platform}. You can preview directly on source or proceed with high-speed download.
              </p>
              <a
                href={media.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors"
              >
                <span>Open on {media.platform}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-1">
          <span>In-App High Fidelity Preview</span>
          <span>Ready for MP4/MP3 Extraction</span>
        </div>
      </div>
    </div>
  );
};
