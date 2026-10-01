import React from 'react';
import { Youtube, Instagram, Facebook, Globe, Sparkles } from 'lucide-react';
import { PlatformType } from '../types';

interface PlatformBadgeProps {
  platform: PlatformType;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PlatformBadge: React.FC<PlatformBadgeProps> = ({ platform, className = '', size = 'md' }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  switch (platform) {
    case 'youtube':
      return (
        <div
          className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-all ${
            isSm
              ? 'px-2.5 py-0.5 text-xs'
              : isLg
              ? 'px-4 py-1.5 text-sm'
              : 'px-3 py-1 text-xs'
          } bg-red-950/80 text-red-300 border border-red-500/40 shadow-sm shadow-red-500/20 ${className}`}
        >
          <Youtube className={isSm ? 'w-3 h-3 text-red-400' : 'w-4 h-4 text-red-400'} />
          <span>YouTube 4K</span>
        </div>
      );

    case 'instagram':
      return (
        <div
          className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-all ${
            isSm
              ? 'px-2.5 py-0.5 text-xs'
              : isLg
              ? 'px-4 py-1.5 text-sm'
              : 'px-3 py-1 text-xs'
          } bg-gradient-to-r from-pink-950/90 via-purple-950/90 to-amber-950/90 text-pink-300 border border-pink-500/40 shadow-sm shadow-pink-500/20 ${className}`}
        >
          <Instagram className={isSm ? 'w-3 h-3 text-pink-400' : 'w-4 h-4 text-pink-400'} />
          <span>Instagram Reels</span>
        </div>
      );

    case 'facebook':
      return (
        <div
          className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-all ${
            isSm
              ? 'px-2.5 py-0.5 text-xs'
              : isLg
              ? 'px-4 py-1.5 text-sm'
              : 'px-3 py-1 text-xs'
          } bg-blue-950/80 text-blue-300 border border-blue-500/40 shadow-sm shadow-blue-500/20 ${className}`}
        >
          <Facebook className={isSm ? 'w-3 h-3 text-blue-400' : 'w-4 h-4 text-blue-400'} />
          <span>Facebook Watch</span>
        </div>
      );

    default:
      return (
        <div
          className={`inline-flex items-center gap-1.5 rounded-full font-medium text-slate-400 bg-slate-900/90 border border-slate-700/60 ${
            isSm
              ? 'px-2.5 py-0.5 text-xs'
              : isLg
              ? 'px-4 py-1.5 text-sm'
              : 'px-3 py-1 text-xs'
          } ${className}`}
        >
          <Globe className={isSm ? 'w-3 h-3 text-slate-400' : 'w-4 h-4 text-slate-400'} />
          <span>Auto-Detection Ready</span>
        </div>
      );
  }
};
