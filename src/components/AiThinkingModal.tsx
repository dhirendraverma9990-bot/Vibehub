import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Brain, 
  X, 
  Loader2, 
  Copy, 
  Check, 
  Send, 
  ListOrdered, 
  Quote, 
  FileText, 
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';
import { MediaInfo } from '../types';

interface AiThinkingModalProps {
  media: MediaInfo | null;
  onClose: () => void;
}

export const AiThinkingModal: React.FC<AiThinkingModalProps> = ({ media, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [analysisText, setAnalysisText] = useState<string>('');
  const [modelUsed, setModelUsed] = useState<string>('gemini-3.1-pro-preview');
  const [thinkingLevel, setThinkingLevel] = useState<string>('HIGH');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async (userQuery: string = '') => {
    if (!media) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/deep-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: media.title,
          channel: media.author,
          duration: media.duration,
          platform: media.platform,
          description: media.description,
          customPrompt: userQuery,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch AI analysis');
      }

      setAnalysisText(data.analysis || 'No analysis available.');
      if (data.modelUsed) setModelUsed(data.modelUsed);
      if (data.thinkingLevel) setThinkingLevel(data.thinkingLevel);
    } catch (err: any) {
      console.error('AI Analysis request failed:', err);
      setError(err.message || 'Error executing AI Deep Thinking analysis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (media && !analysisText) {
      fetchAnalysis();
    }
  }, [media]);

  if (!media) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(analysisText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim() || loading) return;
    fetchAnalysis(customPrompt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl max-h-[90vh] glass-panel-glow rounded-3xl flex flex-col relative overflow-hidden shadow-2xl border border-purple-500/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" />
        <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Brain className="w-5 h-5 text-purple-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  AI Deep Thinking Intelligence
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40 font-semibold">
                  ThinkingLevel.{thinkingLevel}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                <span>Model: {modelUsed}</span>
                <span>•</span>
                <span className="text-cyan-400">Context: {media.platform}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {analysisText && !loading && (
              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                title="Copy Full Analysis"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Media Mini Summary Bar */}
        <div className="px-6 py-2.5 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between text-xs text-slate-300 font-mono shrink-0">
          <span className="truncate max-w-[70%] text-slate-200">
            {media.title}
          </span>
          <span className="text-slate-400 shrink-0">
            Duration: {media.duration}
          </span>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-purple-500/20 border-t-purple-400 animate-spin" />
                <Brain className="w-7 h-7 text-purple-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Executing Deep Reasoning Analysis...
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm font-mono">
                  Synthesizing chapters, extracting memorable soundbites, and analyzing audio/video themes with high thinking level.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs space-y-2">
              <p className="font-semibold">{error}</p>
              <button
                onClick={() => fetchAnalysis(customPrompt)}
                className="px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-900 text-rose-200 font-mono transition-colors"
              >
                Retry Analysis
              </button>
            </div>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none space-y-4 text-slate-200 leading-relaxed font-sans">
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 shadow-inner whitespace-pre-line text-xs sm:text-sm">
                {analysisText}
              </div>
            </div>
          )}

          {/* Quick preset analysis buttons */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-mono text-slate-400 font-medium">
              Quick Deep Inquiries:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => fetchAnalysis('Give me exact chapter timestamps with clear topic names')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-500/40 text-xs text-slate-300 hover:text-purple-300 transition-colors flex items-center gap-1.5 font-mono"
              >
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>Chapter Timestamps</span>
              </button>

              <button
                onClick={() => fetchAnalysis('Extract the 3 most impactful quotes and soundbites suitable for reels/shorts')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-500/40 text-xs text-slate-300 hover:text-purple-300 transition-colors flex items-center gap-1.5 font-mono"
              >
                <Quote className="w-3.5 h-3.5 text-cyan-400" />
                <span>Extract Soundbites</span>
              </button>

              <button
                onClick={() => fetchAnalysis('Write an engaging social media post and video description with hashtags for this content')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-500/40 text-xs text-slate-300 hover:text-purple-300 transition-colors flex items-center gap-1.5 font-mono"
              >
                <Layers className="w-3.5 h-3.5 text-pink-400" />
                <span>Viral Reel Caption</span>
              </button>
            </div>
          </div>

        </div>

        {/* Custom Question Prompt Input Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/90 shrink-0">
          <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Ask anything about this video (e.g. summarize key arguments, transcribe audio ideas)..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
            <button
              type="submit"
              disabled={loading || !customPrompt.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-md shadow-purple-500/20"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Ask AI</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
