import React, { useState } from 'react';
import { 
  Layers, 
  Download, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  Trash2, 
  Clipboard, 
  Sparkles, 
  ExternalLink,
  CheckCircle2,
  FileVideo,
  Music,
  ListOrdered,
  Clock,
  ArrowRight,
  HardDrive
} from 'lucide-react';
import { PlatformBadge } from './PlatformBadge';
import { BatchDownloadItem, MediaInfo, PlatformType, DownloadHistoryItem } from '../types';
import { persistDownloadRecord } from '../services/downloadHistoryService';

interface BatchProcessingSectionProps {
  onRecordHistory?: (item: DownloadHistoryItem) => void;
}

const SAMPLE_BATCH_URLS = [
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://www.instagram.com/reel/C38NqDPLj12/',
  'https://www.facebook.com/watch/?v=10156093478988772'
];

export const BatchProcessingSection: React.FC<BatchProcessingSectionProps> = ({ onRecordHistory }) => {
  const [inputText, setInputText] = useState('');
  const [items, setItems] = useState<BatchDownloadItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState<number | null>(null);
  const [globalFormat, setGlobalFormat] = useState<'video' | 'audio'>('video');
  const [globalQuality, setGlobalQuality] = useState('1080p');

  // Detect valid URLs in text
  const detectedUrls = inputText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('http://') || line.startsWith('https://') || line.startsWith('sample-'));

  const handlePasteClipboard = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        setInputText(prev => (prev.trim() ? `${prev.trim()}\n${clipText.trim()}` : clipText.trim()));
      }
    } catch {
      // ignore clipboard error
    }
  };

  const handleLoadSamples = () => {
    setInputText(SAMPLE_BATCH_URLS.join('\n'));
  };

  const detectPlatformFromUrl = (url: string): PlatformType => {
    const lower = url.toLowerCase();
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
    if (lower.includes('instagram.com') || lower.includes('instagr.am')) return 'instagram';
    if (lower.includes('facebook.com') || lower.includes('fb.watch') || lower.includes('fb.gg')) return 'facebook';
    return 'generic';
  };

  // Start batch metadata extraction
  const handleStartExtraction = async () => {
    if (detectedUrls.length === 0) return;

    setIsProcessing(true);

    // Initialize item states
    const initialItems: BatchDownloadItem[] = detectedUrls.map((url, idx) => ({
      id: `batch-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      url,
      platform: detectPlatformFromUrl(url),
      status: 'pending',
      selectedFormatType: globalFormat,
      selectedQuality: globalFormat === 'video' ? globalQuality : '320k',
      selectedExt: globalFormat === 'video' ? 'mp4' : 'mp3',
    }));

    setItems(initialItems);

    // Process sequentially so the user sees live extraction progression
    for (let i = 0; i < initialItems.length; i++) {
      setCurrentProcessingIndex(i);
      
      setItems(prev => prev.map((item, idx) => 
        idx === i ? { ...item, status: 'extracting' } : item
      ));

      const targetUrl = initialItems[i].url;

      try {
        const res = await fetch('/api/info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: targetUrl }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to extract video information');
        }

        const data: MediaInfo = await res.json();

        setItems(prev => prev.map((item, idx) => {
          if (idx !== i) return item;
          return {
            ...item,
            status: 'ready',
            media: data,
            platform: data.platform || item.platform,
            selectedQuality: item.selectedFormatType === 'video'
              ? (data.videoFormats[0]?.quality || '720p')
              : (data.audioFormats[0]?.quality || '320k'),
          };
        }));
      } catch (err: any) {
        setItems(prev => prev.map((item, idx) => {
          if (idx !== i) return item;
          return {
            ...item,
            status: 'error',
            error: err.message || 'Extraction failed',
          };
        }));
      }
    }

    setCurrentProcessingIndex(null);
    setIsProcessing(false);
  };

  // Update item format or quality
  const handleItemFormatChange = (id: string, formatType: 'video' | 'audio', quality: string) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      return {
        ...item,
        selectedFormatType: formatType,
        selectedQuality: quality,
        selectedExt: formatType === 'audio' ? 'mp3' : 'mp4',
      };
    }));
  };

  // Download a single batch item
  const handleDownloadItem = (item: BatchDownloadItem) => {
    const title = item.media?.title || `VibeHub_${item.platform}_${item.id.slice(0, 6)}`;
    const downloadUrl = `/api/download?url=${encodeURIComponent(item.url)}&formatType=${item.selectedFormatType}&quality=${encodeURIComponent(item.selectedQuality)}&ext=${item.selectedExt}&title=${encodeURIComponent(title)}`;

    setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'downloading' } : i));

    // Create trigger link
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${title}.${item.selectedExt}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Save to history & Firestore
    const historyItem: DownloadHistoryItem = {
      id: item.id,
      title,
      thumbnail: item.media?.thumbnail || '',
      platform: item.platform,
      formatType: item.selectedFormatType,
      quality: item.selectedQuality,
      ext: item.selectedExt,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fileSize: item.selectedFormatType === 'video' ? '~24 MB' : '~8.5 MB',
      originalUrl: item.url,
    };

    if (onRecordHistory) {
      onRecordHistory(historyItem);
    }
    persistDownloadRecord(historyItem).catch(() => {});

    setTimeout(() => {
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'completed' } : i));
    }, 1500);
  };

  // Download all ready items
  const handleDownloadAllReady = () => {
    const readyItems = items.filter(i => i.status === 'ready' || i.status === 'completed');
    readyItems.forEach((item, index) => {
      setTimeout(() => {
        handleDownloadItem(item);
      }, index * 800); // Stagger downloads slightly to prevent browser popup block
    });
  };

  // Bulk set all items to video or audio
  const handleApplyGlobalFormat = (formatType: 'video' | 'audio') => {
    setGlobalFormat(formatType);
    setItems(prev => prev.map(item => ({
      ...item,
      selectedFormatType: formatType,
      selectedExt: formatType === 'audio' ? 'mp3' : 'mp4',
      selectedQuality: formatType === 'video' ? '1080p' : '320k',
    })));
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const readyCount = items.filter(i => i.status === 'ready' || i.status === 'completed').length;
  const errorCount = items.filter(i => i.status === 'error').length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Batch Multi-Link Extraction Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Batch URL Metadata Extractor & Downloader
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Paste multiple URLs separated by newlines. The engine iterates through each link to extract thumbnails, titles, durations, and download formats.
        </p>
      </div>

      {/* Input Card */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 space-y-5 border border-cyan-500/30">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-white">URLs List (One URL per line)</span>
            {detectedUrls.length > 0 && (
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                {detectedUrls.length} {detectedUrls.length === 1 ? 'URL' : 'URLs'} detected
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <Clipboard className="w-3.5 h-3.5 text-cyan-400" />
              <span>Paste Clipboard</span>
            </button>
            <button
              type="button"
              onClick={handleLoadSamples}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-purple-300 hover:text-purple-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Load 3 Samples</span>
            </button>
            {inputText.trim() && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 text-xs text-slate-400 hover:text-rose-400 transition-colors"
                title="Clear text"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`https://www.youtube.com/watch?v=dQw4w9WgXcQ\nhttps://www.instagram.com/reel/C38NqDPLj12/\nhttps://www.facebook.com/watch/?v=10156093478988772`}
            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono leading-relaxed"
          />
        </div>

        {/* Global Controls & Action Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">Default Format:</span>
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => handleApplyGlobalFormat('video')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  globalFormat === 'video'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileVideo className="w-3.5 h-3.5" />
                <span>MP4 Video</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyGlobalFormat('audio')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  globalFormat === 'audio'
                    ? 'bg-purple-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>MP3 Audio</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            disabled={isProcessing || detectedUrls.length === 0}
            onClick={handleStartExtraction}
            className="py-3 px-6 rounded-xl font-bold text-sm text-slate-950 neon-button flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Extracting ({currentProcessingIndex !== null ? `${currentProcessingIndex + 1}/${detectedUrls.length}` : '...'})</span>
              </>
            ) : (
              <>
                <Layers className="w-4 h-4" />
                <span>Extract Metadata for {detectedUrls.length || 'All'} Links</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Extracted Batch Items List */}
      {items.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800">
          
          {/* Status summary & Bulk actions bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Extracted Batch Items</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {readyCount}/{items.length} Ready
                </span>
                {errorCount > 0 && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800">
                    {errorCount} Failed
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review extracted metadata, customize resolution or bitrate, and trigger downloads.
              </p>
            </div>

            {readyCount > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadAllReady}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download All Ready ({readyCount})</span>
                </button>
              </div>
            )}
          </div>

          {/* Items list */}
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  item.status === 'extracting'
                    ? 'bg-cyan-950/20 border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : item.status === 'completed'
                    ? 'bg-emerald-950/15 border-emerald-500/30'
                    : item.status === 'error'
                    ? 'bg-rose-950/15 border-rose-500/30'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left: Index, Thumbnail, Metadata */}
                  <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                    <span className="font-mono text-xs text-slate-500 w-5 shrink-0 pt-1 sm:pt-0">
                      #{idx + 1}
                    </span>

                    {/* Thumbnail */}
                    <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0 relative flex items-center justify-center">
                      {item.media?.thumbnail ? (
                        <img
                          src={item.media.thumbnail}
                          alt={item.media.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-slate-600 flex flex-col items-center justify-center">
                          <FileVideo className="w-6 h-6" />
                        </div>
                      )}
                      {item.status === 'extracting' && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                          <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <PlatformBadge platform={item.platform} size="sm" />
                        {item.media?.duration && (
                          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {item.media.duration}
                          </span>
                        )}
                        {item.status === 'ready' && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> Ready
                          </span>
                        )}
                        {item.status === 'completed' && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Downloaded
                          </span>
                        )}
                        {item.status === 'error' && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5" /> Failed
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-lg">
                        {item.media?.title || item.url}
                      </h4>

                      <p className="text-[11px] text-slate-400 font-mono truncate">
                        {item.media?.author ? `${item.media.author} • ` : ''}
                        <span className="text-slate-500">{item.url}</span>
                      </p>

                      {item.error && (
                        <p className="text-[11px] text-rose-400 font-sans">
                          {item.error}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Format Selector & Actions */}
                  <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                    {item.status === 'ready' || item.status === 'completed' ? (
                      <>
                        {/* Format selector */}
                        <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-[11px]">
                          <button
                            type="button"
                            onClick={() => handleItemFormatChange(item.id, 'video', item.media?.videoFormats[0]?.quality || '720p')}
                            className={`px-2 py-1 rounded font-medium transition-all ${
                              item.selectedFormatType === 'video'
                                ? 'bg-cyan-500 text-slate-950 font-bold'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            MP4
                          </button>
                          <button
                            type="button"
                            onClick={() => handleItemFormatChange(item.id, 'audio', item.media?.audioFormats[0]?.quality || '320k')}
                            className={`px-2 py-1 rounded font-medium transition-all ${
                              item.selectedFormatType === 'audio'
                                ? 'bg-purple-500 text-white font-bold'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            MP3
                          </button>
                        </div>

                        {/* Quality dropdown */}
                        <select
                          value={item.selectedQuality}
                          onChange={(e) => handleItemFormatChange(item.id, item.selectedFormatType, e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-none"
                        >
                          {item.selectedFormatType === 'video' ? (
                            item.media?.videoFormats && item.media.videoFormats.length > 0 ? (
                              item.media.videoFormats.map(vf => (
                                <option key={vf.quality} value={vf.quality}>{vf.quality} ({vf.estSize})</option>
                              ))
                            ) : (
                              <>
                                <option value="1080p">1080p FHD</option>
                                <option value="720p">720p HD</option>
                                <option value="480p">480p SD</option>
                              </>
                            )
                          ) : (
                            item.media?.audioFormats && item.media.audioFormats.length > 0 ? (
                              item.media.audioFormats.map(af => (
                                <option key={af.quality} value={af.quality}>{af.quality}</option>
                              ))
                            ) : (
                              <>
                                <option value="320k">320 kbps</option>
                                <option value="192k">192 kbps</option>
                              </>
                            )
                          )}
                        </select>

                        {/* Download button */}
                        <button
                          type="button"
                          onClick={() => handleDownloadItem(item)}
                          className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm shadow-cyan-500/20 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{item.status === 'completed' ? 'Re-Download' : 'Download'}</span>
                        </button>
                      </>
                    ) : item.status === 'extracting' ? (
                      <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 px-3 py-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Extracting metadata...</span>
                      </div>
                    ) : null}

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-colors"
                      title="Remove from batch list"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
