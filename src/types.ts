export type PlatformType = 'youtube' | 'instagram' | 'facebook' | 'generic';

export interface VideoFormat {
  quality: string;
  label: string;
  ext: string;
  height: number;
  estSize: string;
  recommended?: boolean;
}

export interface AudioFormat {
  quality: string;
  label: string;
  ext: string;
  estSize: string;
  recommended?: boolean;
}

export interface MediaInfo {
  id: string;
  url: string;
  platform: PlatformType;
  title: string;
  author: string;
  duration: string;
  durationSec: number;
  thumbnail: string;
  views?: string;
  likes?: string;
  description?: string;
  videoFormats: VideoFormat[];
  audioFormats: AudioFormat[];
  directStreamUrl?: string | null;
}

export interface DownloadJobStatus {
  id: string;
  title: string;
  status: 'initializing' | 'downloading' | 'processing' | 'ready' | 'failed';
  percent: number;
  speed: string;
  eta: string;
  fileSize?: string;
  downloadUrl?: string | null;
  error?: string;
}

export interface DownloadHistoryItem {
  id: string;
  title: string;
  thumbnail: string;
  platform: PlatformType;
  formatType: 'video' | 'audio';
  quality: string;
  ext: string;
  date: string;
  fileSize?: string;
  originalUrl: string;
}

export interface PresetSample {
  id: string;
  platform: PlatformType;
  name: string;
  url: string;
  author: string;
  duration: string;
  durationSec: number;
  thumbnail: string;
  views: string;
  badge: string;
}

export interface BatchDownloadItem {
  id: string;
  url: string;
  platform: PlatformType;
  status: 'pending' | 'extracting' | 'ready' | 'downloading' | 'completed' | 'error';
  media?: MediaInfo;
  error?: string;
  selectedFormatType: 'video' | 'audio';
  selectedQuality: string;
  selectedExt: string;
  downloadProgress?: number;
  downloadUrl?: string;
}

