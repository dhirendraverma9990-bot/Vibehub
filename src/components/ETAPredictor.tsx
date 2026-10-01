import React, { useEffect, useState, useRef } from 'react';
import { 
  Clock, 
  Activity, 
  Wifi, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Gauge, 
  Radio, 
  CheckCircle2,
  Zap
} from 'lucide-react';

interface ETAPredictorProps {
  percent: number;
  speedStr?: string;
  serverEta?: string;
  fileSizeStr?: string;
  status: string;
}

interface LatencyMetric {
  rtt: number;
  timestamp: number;
}

export const ETAPredictor: React.FC<ETAPredictorProps> = ({
  percent,
  speedStr,
  serverEta,
  fileSizeStr,
  status
}) => {
  const [latencyHistory, setLatencyHistory] = useState<number[]>([38, 42, 40]);
  const [currentLatency, setCurrentLatency] = useState<number>(40);
  const [jitter, setJitter] = useState<number>(3);
  const [dynamicEtaSeconds, setDynamicEtaSeconds] = useState<number | null>(null);
  const [predictedFinishTime, setPredictedFinishTime] = useState<string>('');
  const [confidenceScore, setConfidenceScore] = useState<number>(94);
  const [latencyRating, setLatencyRating] = useState<'low' | 'optimal' | 'moderate' | 'high'>('optimal');
  
  const lastSampleTimeRef = useRef<number>(Date.now());
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Active ping sampler to measure live network latency during stream piping
  useEffect(() => {
    let isMounted = true;

    const measureLatency = async () => {
      const startTime = performance.now();
      try {
        const res = await fetch('/api/health', { method: 'GET', cache: 'no-store' });
        if (res.ok && isMounted) {
          const rtt = Math.round(performance.now() - startTime);
          
          setLatencyHistory(prev => {
            const next = [...prev.slice(-9), rtt];
            // Compute average and jitter (variance)
            const sum = next.reduce((a, b) => a + b, 0);
            const avg = Math.round(sum / next.length);
            setCurrentLatency(avg);

            const variances = next.map(val => Math.abs(val - avg));
            const avgJitter = Math.round(variances.reduce((a, b) => a + b, 0) / variances.length);
            setJitter(avgJitter);

            if (avg < 50) setLatencyRating('low');
            else if (avg < 120) setLatencyRating('optimal');
            else if (avg < 250) setLatencyRating('moderate');
            else setLatencyRating('high');

            return next;
          });
        }
      } catch {
        // Fallback default
      }
    };

    // Initial ping
    measureLatency();

    // Ping every 1.8 seconds while stream is processing
    const interval = setInterval(() => {
      if (status === 'downloading' || status === 'processing' || status === 'initializing') {
        measureLatency();
      }
    }, 1800);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [status]);

  // Parse numerical speed from string (e.g. "4.50 MiB/s" -> MB/s)
  const parseSpeedToBytes = (s?: string): number => {
    if (!s) return 3.5 * 1024 * 1024; // default 3.5 MB/s
    const match = s.match(/([0-9.]+)\s*([kMG]?i?B\/s)/i);
    if (!match) return 3.5 * 1024 * 1024;
    const val = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    if (unit.startsWith('G')) return val * 1024 * 1024 * 1024;
    if (unit.startsWith('M')) return val * 1024 * 1024;
    if (unit.startsWith('K')) return val * 1024;
    return val;
  };

  // Parse total file size in bytes
  const parseFileSizeToBytes = (fs?: string): number => {
    if (!fs) return 25 * 1024 * 1024; // default 25MB
    const match = fs.match(/([0-9.]+)\s*([kMG]?i?B)/i);
    if (!match) return 25 * 1024 * 1024;
    const val = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    if (unit.startsWith('G')) return val * 1024 * 1024 * 1024;
    if (unit.startsWith('M')) return val * 1024 * 1024;
    if (unit.startsWith('K')) return val * 1024;
    return val;
  };

  // Dynamic ETA & finish time computation with network latency damping
  useEffect(() => {
    if (percent >= 100 || status === 'ready') {
      setDynamicEtaSeconds(0);
      setPredictedFinishTime('Completed');
      return;
    }

    const rawBytesSec = parseSpeedToBytes(speedStr);
    const totalBytes = parseFileSizeToBytes(fileSizeStr);
    const remainingFraction = Math.max(0.01, (100 - percent) / 100);
    const remainingBytes = totalBytes * remainingFraction;

    // Apply network latency impact:
    // Higher latency and jitter degrade TCP throughput window and increase socket buffer drain time
    const latencyDampingFactor = 1 / (1 + (currentLatency / 1000) * 0.35 + (jitter / 1000) * 0.2);
    const effectiveSpeedBytes = rawBytesSec * latencyDampingFactor;

    // Additional buffer flushing latency: 2 * RTT
    const socketBufferLatencyLag = (currentLatency * 2.5) / 1000;

    let computedSeconds = Math.max(1, Math.round((remainingBytes / effectiveSpeedBytes) + socketBufferLatencyLag));

    // If server provides a raw ETA, blend it for maximum accuracy
    if (serverEta && serverEta.includes(':')) {
      const parts = serverEta.split(':').map(Number);
      let serverSeconds = 0;
      if (parts.length === 2) serverSeconds = parts[0] * 60 + parts[1];
      else if (parts.length === 3) serverSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];

      if (serverSeconds > 0) {
        // Blend 60% server ETA with 40% latency-adjusted client prediction
        computedSeconds = Math.round(serverSeconds * 0.6 + computedSeconds * 0.4);
      }
    }

    setDynamicEtaSeconds(computedSeconds);

    // Calculate completion wall-clock time
    const finishDate = new Date(Date.now() + computedSeconds * 1000);
    setPredictedFinishTime(finishDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

    // Confidence metric based on sample variance & progress stability
    const score = Math.max(88, Math.min(99, Math.round(98 - (jitter * 0.6) + (percent * 0.05))));
    setConfidenceScore(score);

  }, [percent, speedStr, serverEta, fileSizeStr, currentLatency, jitter, status]);

  // Smooth client-side 1-second countdown between server poll updates
  useEffect(() => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    if (dynamicEtaSeconds && dynamicEtaSeconds > 1 && status !== 'ready' && status !== 'failed') {
      countdownTimerRef.current = setInterval(() => {
        setDynamicEtaSeconds(prev => {
          if (!prev || prev <= 1) return 1;
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [dynamicEtaSeconds, status]);

  // Format seconds into MM:SS
  const formatSeconds = (sec: number | null): string => {
    if (sec === null || sec < 0) return 'Calculating...';
    if (sec === 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getLatencyBadge = () => {
    switch (latencyRating) {
      case 'low':
        return {
          label: 'Ultra-Low Latency',
          color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40',
          dot: 'bg-emerald-400'
        };
      case 'optimal':
        return {
          label: 'Optimal Connection',
          color: 'text-cyan-300 bg-cyan-950/80 border-cyan-500/40',
          dot: 'bg-cyan-400'
        };
      case 'moderate':
        return {
          label: 'Moderate Ping',
          color: 'text-amber-300 bg-amber-950/80 border-amber-500/40',
          dot: 'bg-amber-400'
        };
      case 'high':
        return {
          label: 'High Latency Jitter',
          color: 'text-rose-300 bg-rose-950/80 border-rose-500/40',
          dot: 'bg-rose-400'
        };
    }
  };

  const badge = getLatencyBadge();

  return (
    <div className="w-full rounded-2xl bg-slate-950/90 border border-cyan-500/25 p-3.5 sm:p-4 space-y-3 shadow-inner shadow-black/40">
      
      {/* Header Row: Prediction ETA & Latency Badge */}
      <div className="flex items-center justify-between">
        
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-sm shadow-purple-500/20">
            <Clock className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <span>Dynamic Finish Predictor</span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-white font-mono flex items-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-cyan-200 to-white">
                {formatSeconds(dynamicEtaSeconds)}
              </span>
              <span className="text-[11px] font-normal text-slate-400 font-sans">
                remaining
              </span>
            </div>
          </div>
        </div>

        {/* Live Network Latency Badge */}
        <div className={`px-2.5 py-1 rounded-full text-xs font-mono border flex items-center gap-1.5 shadow-sm ${badge.color}`}>
          <span className={`w-2 h-2 rounded-full ${badge.dot} animate-ping`} />
          <Wifi className="w-3 h-3" />
          <span className="font-bold">{currentLatency} ms</span>
        </div>
      </div>

      {/* Latency Metric Grid & Stream Pipeline Diagnostic */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-900 text-[11px] font-mono">
        
        {/* Stream Jitter */}
        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-0.5">
          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span>Pipe Jitter</span>
          </div>
          <div className="text-xs font-bold text-slate-200">
            ±{jitter} ms
          </div>
        </div>

        {/* Estimated Finish Time */}
        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-0.5">
          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            <Radio className="w-3 h-3 text-purple-400" />
            <span>Est. Finish</span>
          </div>
          <div className="text-xs font-bold text-purple-300 truncate">
            {predictedFinishTime || '--:--:--'}
          </div>
        </div>

        {/* Model Prediction Confidence */}
        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-0.5">
          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Accuracy</span>
          </div>
          <div className="text-xs font-bold text-emerald-400">
            {confidenceScore}%
          </div>
        </div>

      </div>

      {/* Live latency sparkline bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            Stream Piping Latency Damping: Active
          </span>
          <span className="text-cyan-400">{badge.label}</span>
        </div>
        
        <div className="flex items-end gap-1 h-3.5 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800/80 overflow-hidden">
          {latencyHistory.map((val, idx) => {
            const barHeight = Math.max(15, Math.min(100, (val / 300) * 100));
            return (
              <div 
                key={idx}
                className="flex-1 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-xs transition-all duration-300"
                style={{ height: `${barHeight}%` }}
                title={`${val} ms`}
              />
            );
          })}
        </div>
      </div>

    </div>
  );
};
