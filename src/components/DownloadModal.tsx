import React, { useEffect, useState } from 'react';
import { 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Loader2, 
  Zap, 
  Clock, 
  HardDrive,
  Copy,
  Check
} from 'lucide-react';
import { DownloadJobStatus } from '../types';
import { ETAPredictor } from './ETAPredictor';

interface DownloadModalProps {
  job: DownloadJobStatus | null;
  onClose: () => void;
  onRetry: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ job, onClose, onRetry }) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!job) return null;

  const isReady = job.status === 'ready';
  const isFailed = job.status === 'failed';
  const isDownloading = job.status === 'downloading' || job.status === 'processing' || job.status === 'initializing';

  const handleCopyDirectLink = () => {
    if (job.downloadUrl) {
      const fullUrl = `${window.location.origin}${job.downloadUrl}`;
      navigator.clipboard.writeText(fullUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleTriggerBrowserSave = () => {
    if (job.downloadUrl) {
      const a = document.createElement('a');
      a.href = job.downloadUrl;
      a.download = job.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Automatically trigger browser file download when download completes
  useEffect(() => {
    if (isReady && job.downloadUrl) {
      handleTriggerBrowserSave();
    }
  }, [isReady, job.downloadUrl]);

  // Determine active step
  const getActiveStep = () => {
    if (isReady) return 4;
    if (job.status === 'processing') return 3;
    if (job.percent > 30) return 2;
    return 1;
  };

  const activeStep = getActiveStep();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg glass-panel-glow rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-cyan-500/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient spots */}
        <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-cyan-500/15 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full bg-purple-500/15 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 mb-3 shadow-lg shadow-cyan-500/20">
            {isReady ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-400 animate-in zoom-in-75 duration-300" />
            ) : isFailed ? (
              <AlertCircle className="w-7 h-7 text-rose-400" />
            ) : (
              <Loader2 className="w-7 h-7 animate-spin text-cyan-400" />
            )}
          </div>
          
          <h3 className="text-lg font-bold text-white tracking-tight">
            {isReady
              ? 'Download Ready!'
              : isFailed
              ? 'Download Failed'
              : 'Processing Media Stream...'}
          </h3>
          
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto truncate font-mono">
            {job.title}
          </p>
        </div>

        {/* Progress Bar & Indicators */}
        {!isFailed && (
          <div className="space-y-4 my-6">
            
            {/* Percentage & Speed Row */}
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-cyan-400 text-sm">
                {Math.round(job.percent)}%
              </span>
              <div className="flex items-center gap-3 text-slate-400">
                {job.speed && (
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    {job.speed}
                  </span>
                )}
                {job.eta && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-purple-400" />
                    ETA: {job.eta}
                  </span>
                )}
                {job.fileSize && (
                  <span className="flex items-center gap-1 text-slate-300">
                    <HardDrive className="w-3 h-3 text-slate-400" />
                    {job.fileSize}
                  </span>
                )}
              </div>
            </div>

            {/* Glowing Custom Progress Bar */}
            <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-[1px]">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-300 relative shadow-[0_0_12px_rgba(0,240,255,0.5)]"
                style={{ width: `${Math.max(4, Math.min(100, job.percent))}%` }}
              >
                {/* Leading animated white glow line */}
                <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/70 rounded-full blur-[1px]" />
              </div>
            </div>

            {/* 4-Step Visual Tracker */}
            <div className="grid grid-cols-4 gap-1 pt-2 text-[10px] font-mono text-center">
              <div className={`p-1.5 rounded-lg border transition-all ${
                activeStep >= 1 
                  ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300' 
                  : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}>
                1. Stream Init
              </div>
              <div className={`p-1.5 rounded-lg border transition-all ${
                activeStep >= 2 
                  ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300' 
                  : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}>
                2. Extract Data
              </div>
              <div className={`p-1.5 rounded-lg border transition-all ${
                activeStep >= 3 
                  ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300' 
                  : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}>
                3. FFmpeg Mux
              </div>
              <div className={`p-1.5 rounded-lg border transition-all ${
                activeStep >= 4 
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-bold' 
                  : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}>
                4. Completed
              </div>
            </div>

            {/* Dynamic Latency-Adjusted ETA Predictor */}
            <ETAPredictor
              percent={job.percent}
              speedStr={job.speed}
              serverEta={job.eta}
              fileSizeStr={job.fileSize}
              status={job.status}
            />

          </div>
        )}

        {/* Error state */}
        {isFailed && (
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs my-4 space-y-2">
            <p className="font-semibold">{job.error || 'Media download could not be completed.'}</p>
            <p className="text-[11px] text-rose-400/80">
              The target platform may be restricting bot downloads on this video. Try testing our public samples or another video link.
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-2 flex flex-col gap-2.5">
          {isReady ? (
            <>
              <button
                onClick={handleTriggerBrowserSave}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-slate-950 neon-button flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/30"
              >
                <Download className="w-5 h-5" />
                <span>Save File to Device</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyDirectLink}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-800 flex items-center justify-center gap-2 transition-colors"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-400" />
                      <span>Copy Direct File Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onClose}
                  className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
                >
                  Done
                </button>
              </div>
            </>
          ) : isFailed ? (
            <div className="flex gap-2">
              <button
                onClick={onRetry}
                className="flex-1 py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="text-center text-xs text-slate-500 font-mono py-1">
              Please keep this tab open while extraction finishes...
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
