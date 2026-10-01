import React, { useState } from 'react';
import { 
  Youtube, 
  Instagram, 
  Facebook, 
  Music, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Smartphone, 
  ChevronDown, 
  ChevronUp,
  Cpu,
  Layers,
  CheckCircle2
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Which platforms are supported by OmniStream?',
      a: 'OmniStream natively parses and extracts video and audio streams from YouTube (Videos, Shorts), Instagram (Reels, Posts, IGTV), and Facebook (Watch, Reels, Public videos). It also supports TikTok and generic video links via our yt-dlp backend engine.',
    },
    {
      q: 'How does the MP3 Audio extraction work?',
      a: 'When you choose MP3, our server strips the video stream and converts the master audio track into a pristine MP3 file using FFmpeg with variable/constant bitrates up to 320 kbps (Studio Master Quality).',
    },
    {
      q: 'Is there any watermark or file size limit?',
      a: 'No watermarks are ever added to your downloads! Videos and audio retain the original source quality up to 4K Ultra HD 60fps.',
    },
    {
      q: 'What is the AI Deep Thinking feature?',
      a: 'Powered by Google Gemini 3.1 Pro Preview with high reasoning thinking mode (ThinkingLevel.HIGH), our AI analyzes the video content, generates timestamped chapter markers, extracts memorable quotes, and lets you ask questions directly about any video.',
    },
    {
      q: 'Can I download videos onto my mobile phone?',
      a: 'Yes! OmniStream is fully responsive for iPhone, iPad, and Android browsers. You can also click the QR Code button on desktop to scan and immediately open the download on your mobile device.',
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto space-y-16 pt-12">
      
      {/* 3 Main Platform Cards */}
      <div>
        <div className="text-center mb-8">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30">
            Multi-Platform Integration
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-3">
            Engineered for the Modern Web
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Direct high-speed stream parsers built on yt-dlp and FFmpeg for pristine quality without compression loss.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* YouTube Card */}
          <div className="glass-panel hover:glass-panel-glow rounded-3xl p-6 border border-slate-800 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-500/30 text-red-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Youtube className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                YouTube 4K & Shorts
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Download YouTube videos up to 2160p (4K UHD) at 60fps, including YouTube Shorts, podcasts, and playlists with audio track multiplexing.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Resolutions:</span>
              <span className="text-red-400 font-bold">4K • 1080p • 720p</span>
            </div>
          </div>

          {/* Instagram Card */}
          <div className="glass-panel hover:glass-panel-glow rounded-3xl p-6 border border-slate-800 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-950/60 border border-pink-500/30 text-pink-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Instagram className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Instagram Reels & Audio
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Save viral Instagram Reels, video posts, and extract trending background music tracks directly into crystal-clear MP3 format.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Format:</span>
              <span className="text-pink-400 font-bold">MP4 Reel • MP3 Audio</span>
            </div>
          </div>

          {/* Facebook Card */}
          <div className="glass-panel hover:glass-panel-glow rounded-3xl p-6 border border-slate-800 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-950/60 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Facebook className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Facebook Watch & Reels
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Download Facebook Watch videos, public stream recordings, and Facebook Reels in native HD 1080p with no third-party branding.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Quality:</span>
              <span className="text-blue-400 font-bold">HD 1080p • 720p</span>
            </div>
          </div>

        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Ultra-Fast Processing</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-threaded stream extraction delivers immediate downloads with live progress indicators.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-3">
              <Music className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Studio 320kbps MP3</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lossless audio conversion with ID3 tags and high bitrates for music lovers and podcast listeners.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-pink-950/80 border border-pink-500/30 text-pink-400 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">AI Deep Thinking</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gemini 3.1 Pro Preview with HIGH reasoning summarizes, indexes chapters, and analyzes any media.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Zero Watermarks</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clean files with no superimposed logos, no user registration, and complete privacy.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div>
        <div className="text-center mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Everything you need to know about formats, resolutions, and media downloading.
          </p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-cyan-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0 ml-2" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
