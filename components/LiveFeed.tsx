"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, Monitor, WifiOff, RefreshCcw, AlertTriangle, Loader2 } from 'lucide-react';

interface Detection {
  id: string;
  label: string;
  x: number; 
  y: number; 
  width: number; 
  height: number; 
  confidence: number;
  status: 'nominal' | 'warning' | 'critical';
}

interface LiveFeedProps {
  label: string;
  streamSource?: string; 
  detections?: Detection[];
  aspectRatio?: '16:9' | '4:3';
}

export default function LiveFeed({ label, streamSource, detections = [], aspectRatio = '16:9' }: LiveFeedProps) {
  const [hasError, setHasError] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setHasError(false);
    setIsConnecting(false);
    setRetryCount(0);
  }, [streamSource]);

  useEffect(() => {
    if (!streamSource || hasError || isConnecting) {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      return;
    }

    heartbeatRef.current = setInterval(async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        await fetch(streamSource, { method: 'HEAD', signal: controller.signal, mode: 'no-cors' });
        clearTimeout(timeoutId);
      } catch (err) {
        setHasError(true);
      }
    }, 3000);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [streamSource, hasError, isConnecting]);

  useEffect(() => {
    if (!hasError) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    const delay = Math.min(1000 * Math.pow(1.5, retryCount), 10000);
    timerRef.current = setTimeout(() => {
      setIsConnecting(true);
      setRetryCount(prev => prev + 1);
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [hasError, retryCount]);

  const handleManualRetry = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsConnecting(true);
    setRetryCount(prev => prev + 1);
  };

  const showLoadingUI = hasError || isConnecting;

  return (
    /* Explicitly added shadow-none and drop-shadow-none to kill all box-shadows */
    <div className={`relative w-full h-full bg-[#1a1a1a] rounded-lg border border-[#444] overflow-hidden group flex flex-col shadow-none drop-shadow-none ${
      aspectRatio === '4:3' ? 'aspect-[4/3]' : 'aspect-[16/9]'
    }`}>
      
      {/* 1. TOP METADATA BAR */}
      <div className="absolute top-0 w-full p-3 bg-transparent z-30 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-mono font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Monitor size={10} />
            {label}
          </span>
          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-tighter">
            {showLoadingUI ? `STREAM_LOST // RECONNECTING` : "System: Railway Detector // Feed: MJPEG"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-mono text-slate-500 italic">{aspectRatio}</span>
          <button className="pointer-events-auto p-1 hover:bg-white/10 rounded transition-colors text-slate-400">
            <Maximize2 size={12} />
          </button>
        </div>
      </div>

      {/* 2. AI OVERLAY LAYER */}
      {!showLoadingUI && (
        <div className="absolute inset-0 z-20 pointer-events-none shadow-none drop-shadow-none">
          {detections.map((d) => (
            <div
              key={d.id}
              className={`absolute border transition-all duration-300 shadow-none drop-shadow-none ${
                d.status === 'critical' ? 'border-red-500 bg-red-500/10' : 
                d.status === 'warning' ? 'border-amber-500 bg-amber-500/10' : 
                'border-cyan-400 bg-cyan-400/10'
              }`}
              style={{ left: `${d.x}%`, top: `${d.y}%`, width: `${d.width}%`, height: `${d.height}%` }}
            >
              <div className={`absolute -top-5 left-0 px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider ${
                d.status === 'critical' ? 'text-red-400' : 
                d.status === 'warning' ? 'text-amber-400' : 
                'text-cyan-400'
              }`}>
                [{d.label}: {Math.round(d.confidence * 100)}%]
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. ACTUAL LIVE STREAM FEED */}
      <div className="w-full h-full flex-1 bg-black relative flex items-center justify-center overflow-hidden shadow-none drop-shadow-none">
        {streamSource && (
          <img 
            src={`${streamSource}${streamSource.includes('?') ? '&' : '?'}retry=${retryCount}`} 
            alt="Live Stream"
            style={{ 
              imageRendering: 'pixelated',
              WebkitImageRendering: 'optimize-contrast'
            } as React.CSSProperties}
            className={`absolute inset-0 w-full h-full object-cover select-none shadow-none drop-shadow-none ${showLoadingUI ? 'hidden' : 'block'}`}
            onLoad={() => {
              setHasError(false);
              setIsConnecting(false);
            }}
            onError={() => {
              setHasError(true);
              setIsConnecting(false);
            }}
          />
        )}

        {showLoadingUI && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[#1a1a1a] z-30 shadow-none drop-shadow-none">
            <div className="relative flex items-center justify-center">
              <Loader2 size={48} className="text-slate-400 animate-spin absolute" style={{ animationDuration: '1.5s' }} />
              <WifiOff size={20} className="text-slate-600" />
              <AlertTriangle size={12} className="text-amber-500 absolute bottom-[-4px] right-[-4px]" />
            </div>

            <div className="text-center">
              <p className="text-slate-300 font-mono text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                {isConnecting ? "LINK_NEGOTIATION // SYNCING" : "NO_SIGNAL: FEED_LOST"}
              </p>
              <p className="text-slate-500 font-mono text-[8px] uppercase tracking-widest mb-3">
                Sequence Sync #{retryCount}
              </p>
              <button 
                onClick={handleManualRetry}
                disabled={isConnecting}
                className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 bg-neutral-800 disabled:opacity-40 hover:bg-neutral-700 text-white rounded border border-neutral-700 transition-all active:scale-95 mx-auto text-[8px] font-mono tracking-widest uppercase"
              >
                <RefreshCcw size={10} className={`text-slate-400 ${isConnecting ? 'animate-spin' : ''}`} />
                {isConnecting ? 'Syncing...' : 'Force Sync'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. BOTTOM STATUS BAR */}
      <div className="absolute bottom-0 w-full p-2 bg-transparent z-30 pointer-events-none">
        <div className="flex justify-between items-center text-[8px] font-mono font-bold tracking-widest">
          <span className="text-slate-500">
            {showLoadingUI ? "LATENCY: TIMEOUT" : "LATENCY: ~12ms"}
          </span>
          <span className={`flex items-center gap-1 ${showLoadingUI ? "text-amber-500" : "text-slate-400"}`}>
            <div className={`w-1 h-1 rounded-full ${showLoadingUI ? "bg-amber-500 animate-ping" : "bg-slate-400 animate-pulse"}`} />
            {showLoadingUI ? "LINK_LOST" : "AI_ACTIVE"}
          </span>
        </div>
      </div>
    </div>
  );
}