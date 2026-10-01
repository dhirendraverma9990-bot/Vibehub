import React, { useState } from 'react';
import { 
  Server, 
  Download, 
  Zap, 
  Layers, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  Video, 
  Music, 
  Play, 
  Sparkles,
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { PlatformBadge } from './PlatformBadge';
import { PlatformType } from '../types';

interface BatchJob {
  jobId: string;
  url: string;
  title: string;
  platform: PlatformType;
  formatType: 'video' | 'audio';
  quality: string;
  ext: string;
  directDownloadUrl: string;
}

export const DownloadingServiceSection: React.FC = () => {
  const [directUrl, setDirectUrl] = useState('');
  const [formatType, setFormatType] = useState<'video' | 'audio'>('video');
  const [quality, setQuality] = useState('1080p');
  
  // Batch service state
  const [batchText, setBatchText] = useState('');
  const [batchFormatType, setBatchFormatType] = useState<'video' | 'audio'>('video');
  const [batchQuality, setBatchQuality] = useState('720p');
  const [batchJobs, setBatchJobs] = useState<BatchJob[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);

  // Curl snippet copy state
  const [copiedCurl, setCopiedCurl] = useState(false);

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://vibehub.app';

  const handleStartDirectDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directUrl.trim()) return;

    const ext = formatType === 'video' ? 'mp4' : 'mp3';
    const downloadLink = `${originUrl}/api/download/direct?url=${encodeURIComponent(directUrl.trim())}&formatType=${formatType}&quality=${quality}&ext=${ext}`;
    
    // Trigger download in browser
    window.location.href = downloadLink;
  };

  const handleQueueBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const lines = batchText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.startsWith('http://') || l.startsWith('https://'));

    if (lines.length === 0) return;

    setBatchLoading(true);
    try {
      const res = await fetch('/api/info/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: lines }),
      });

      const data = await res.json();
      if (data.items) {
        const jobs: BatchJob[] = data.items.map((item: any, idx: number) => {
          const media = item.media;
          const title = media?.title || `Media_${idx + 1}`;
          const ext = batchFormatType === 'audio' ? 'mp3' : 'mp4';
          return {
            jobId: media?.id || `job-${idx}`,
            url: item.url,
            title,
            platform: media?.platform || 'generic',
            formatType: batchFormatType,
            quality: batchQuality,
            ext,
            directDownloadUrl: `/api/download?url=${encodeURIComponent(item.url)}&formatType=${batchFormatType}&quality=${batchQuality}&ext=${ext}&title=${encodeURIComponent(title)}`,
          };
        });
        setBatchJobs(jobs);
      }
    } catch (err) {
      console.error('Batch queuing error:', err);
    } finally {
      setBatchLoading(false);
    }
  };

  const curlExample = `curl -OJ "${originUrl}/api/download/direct?url=${encodeURIComponent(directUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')}&formatType=${formatType}&quality=${quality}"`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlExample);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-in fade-in duration-300">
      
      {/* Service Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-mono">
          <Server className="w-3.5 h-3.5 text-cyan-400" />
          <span>High-Throughput Media Downloading Service</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          VibeHub Downloading Service
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Direct stream extraction, background multiplexing clusters, batch queue processing, and programmatic API endpoints for seamless media grabbing.
        </p>
      </div>

      {/* Cluster Health & Engine Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Stream Gateway</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              ACTIVE
            </span>
          </div>
          <h4 className="text-sm font-bold text-white font-mono">yt-dlp v2026.08</h4>
          <p className="text-[11px] text-slate-500 font-mono">
            Multi-threaded chunked socket reader with Android/Web player client rotation.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Transcode Engine</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              4K READY
            </span>
          </div>
          <h4 className="text-sm font-bold text-white font-mono">FFmpeg 4K Cluster</h4>
          <p className="text-[11px] text-slate-500 font-mono">
            Direct MP4 H.264 video/AAC audio track multiplexing with zero loss.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Audio Pipeline</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-400 border border-purple-800">
              320 KBPS
            </span>
          </div>
          <h4 className="text-sm font-bold text-white font-mono">MP3 LAME Studio</h4>
          <p className="text-[11px] text-slate-500 font-mono">
            High-fidelity constant/variable bitrate audio extractor with ID3 tagging.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Failover Relay</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              STANDBY
            </span>
          </div>
          <h4 className="text-sm font-bold text-white font-mono">oEmbed Gateway</h4>
          <p className="text-[11px] text-slate-500 font-mono">
            Automated anti-bot failover for cloud environments and datacenter IPs.
          </p>
        </div>

      </div>

      {/* SERVICE FEATURE 1: Instant Direct Stream Downloader */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 space-y-6 border border-cyan-500/30">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Instant 1-Click Direct Downloader Service
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Bypass multi-step previews. Stream directly to your device with browser save headers.
          </p>
        </div>

        <form onSubmit={handleStartDirectDownload} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              value={directUrl}
              onChange={(e) => setDirectUrl(e.target.value)}
              placeholder="Paste YouTube, Instagram Reel, or Facebook link..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
              required
            />

            {/* Format toggle */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setFormatType('video');
                  setQuality('1080p');
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  formatType === 'video'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                MP4 Video
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormatType('audio');
                  setQuality('320k');
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  formatType === 'audio'
                    ? 'bg-purple-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                MP3 Audio
              </button>
            </div>

            {/* Quality selector */}
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="px-3 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 shrink-0"
            >
              {formatType === 'video' ? (
                <>
                  <option value="2160p">4K (2160p)</option>
                  <option value="1080p">1080p Full HD</option>
                  <option value="720p">720p HD</option>
                  <option value="480p">480p SD</option>
                  <option value="360p">360p Data Saver</option>
                </>
              ) : (
                <>
                  <option value="320k">320 kbps (Studio)</option>
                  <option value="192k">192 kbps (High)</option>
                  <option value="128k">128 kbps (Standard)</option>
                </>
              )}
            </select>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl font-bold text-sm text-slate-950 neon-button shrink-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Start Direct Download</span>
            </button>
          </div>
        </form>
      </div>

      {/* SERVICE FEATURE 2: Batch Multi-Link Downloading Service */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Batch & Multi-Link Queue Service
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Paste multiple video links (one URL per line) to process multiple downloads concurrently.
          </p>
        </div>

        <form onSubmit={handleQueueBatch} className="space-y-4">
          <textarea
            rows={4}
            value={batchText}
            onChange={(e) => setBatchText(e.target.value)}
            placeholder={`https://www.youtube.com/watch?v=dQw4w9WgXcQ\nhttps://www.instagram.com/reel/C38NqDPLj12/\nhttps://www.facebook.com/watch/?v=10156093478988772`}
            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-400 font-mono leading-relaxed"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Target Format:</span>
              <button
                type="button"
                onClick={() => setBatchFormatType('video')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  batchFormatType === 'video'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                MP4 Video
              </button>
              <button
                type="button"
                onClick={() => setBatchFormatType('audio')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  batchFormatType === 'audio'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                MP3 Audio
              </button>
            </div>

            <button
              type="submit"
              disabled={batchLoading || !batchText.trim()}
              className="w-full sm:w-auto py-2.5 px-6 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {batchLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Layers className="w-4 h-4" />
              )}
              <span>Initialize Batch Queue</span>
            </button>
          </div>
        </form>

        {/* Queued Batch Items List */}
        {batchJobs.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
              <span>Batch Queue ({batchJobs.length} Items Ready):</span>
              <button
                onClick={() => {
                  // Trigger all downloads
                  batchJobs.forEach(j => {
                    const a = document.createElement('a');
                    a.href = j.directDownloadUrl;
                    a.download = j.title;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  });
                }}
                className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download All Concurrently</span>
              </button>
            </div>

            <div className="space-y-2">
              {batchJobs.map((job, idx) => (
                <div
                  key={job.jobId}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate max-w-[70%]">
                    <span className="font-mono text-slate-500">#{idx + 1}</span>
                    <PlatformBadge platform={job.platform} size="sm" />
                    <span className="font-mono text-slate-300 truncate">{job.url}</span>
                  </div>

                  <a
                    href={job.directDownloadUrl}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {job.ext.toUpperCase()}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SERVICE FEATURE 3: Developer cURL & API Integration */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Developer CLI & Programmatic Service Endpoint
            </h3>
          </div>
          <button
            onClick={handleCopyCurl}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
          >
            {copiedCurl ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy cURL Command</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-black border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
          <code>{curlExample}</code>
        </div>
        <p className="text-[11px] text-slate-500 font-mono">
          Endpoint: <span className="text-slate-400">GET /api/download/direct?url=[URL]&formatType=[video|audio]&quality=[1080p|320k]</span>
        </p>
      </div>

    </div>
  );
};
