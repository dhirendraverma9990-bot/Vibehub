import React, { useState } from 'react';
import { X, QrCode, Smartphone, Copy, Check, ExternalLink } from 'lucide-react';
import { MediaInfo } from '../types';

interface QrCodeModalProps {
  media: MediaInfo | null;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ media, onClose }) => {
  const [copied, setCopied] = useState(false);
  if (!media) return null;

  // Generate target URL for QR code
  const currentAppUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const mobileDownloadUrl = `${currentAppUrl}/?url=${encodeURIComponent(media.url)}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(mobileDownloadUrl)}&bgcolor=07090e&color=00f0ff&margin=10`;

  const handleCopy = () => {
    navigator.clipboard.writeText(mobileDownloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm glass-panel-glow rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-2xl border border-cyan-500/30 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-cyan-500/20">
          <Smartphone className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-white tracking-tight">
          Scan to Download on Phone
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-5">
          Scan with iPhone Camera or Android QR Reader to download directly to your mobile gallery.
        </p>

        {/* QR Code Container */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 inline-block shadow-inner mb-4">
          <img
            src={qrImageUrl}
            alt="Mobile Download QR Code"
            className="w-48 h-48 rounded-xl object-contain mx-auto"
          />
        </div>

        <div className="space-y-2">
          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-800 flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Mobile Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy Mobile Link</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
