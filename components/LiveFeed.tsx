"use client";

import React, { useState, useEffect } from 'react';
import { Maximize2, Monitor, WifiOff, RefreshCcw, AlertTriangle } from 'lucide-react';

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
  const [retryCount, setRetryCount] = useState(0);

  // Reset error state if the stream source changes
  useEffect(() => {
    setHasError(false);
  }, [streamSource]);

  const handleRetry = () => {
    setHasError(false);
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className="relative h-full w-full bg-black rounded-xl border border-slate-800 overflow-hidden group shadow-2xl">
      
      {/* 1. TOP METADATA BAR */}
      <div className="absolute top-0 w-full p-3 bg-gradient-to-b from-black/90 to-transparent z-30 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-mono font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Monitor size={10} className={hasError ? "text-red-500" : "text-blue-500"} />
            {label}
          </span>
          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-tighter">
            {hasError ? "STREAM_DISCONNECTED" : "System: YOLOv8_Railway // Feed: MJPEG_LIVE"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-mono text-slate-500 italic">{aspectRatio}</span>
          <button className="pointer-events-auto p-1 hover:bg-white/10 rounded transition-colors text-slate-400">
            <Maximize2 size={12} />
          </button>
        </div>
      </div>

      {/* 2. AI OVERLAY LAYER (Hidden on error) */}
      {!hasError && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {detections.map((d) => (
            <div
              key={d.id}
              className={`absolute border-2 transition-all duration-300 ${
                d.status === 'critical' ? 'border-red-500 bg-red-500/10' : 
                d.status === 'warning' ? 'border-amber-500 bg-amber-500/10' : 
                'border-emerald-400 bg-emerald-400/10'
              }`}
              style={{ left: `${d.x}%`, top: `${d.y}%`, width: `${d.width}%`, height: `${d.height}%` }}
            >
              <div className={`absolute -top-5 left-[-2px] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-tighter whitespace-nowrap flex items-center gap-1 ${
                d.status === 'critical' ? 'bg-red-500 text-white' : 
                d.status === 'warning' ? 'bg-amber-500 text-black' : 
                'bg-emerald-400 text-black'
              }`}>
                {d.label}: {Math.round(d.confidence * 100)}%
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. ACTUAL LIVE STREAM FEED / ERROR STATE */}
      <div className="w-full h-full flex items-center justify-center bg-[#050505]">
        {streamSource && !hasError ? (
          <img 
            // Append retryCount to URL to force browser to bypass cache on retry
            src={`${streamSource}${streamSource.includes('?') ? '&' : '?'}retry=${retryCount}`} 
            alt="Live Stream"
            className="w-full h-full object-cover filter contrast-110 brightness-90"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
            {hasError ? (
              <>
                <div className="relative">
                  <WifiOff size={40} className="text-red-500/20" />
                  <AlertTriangle size={16} className="text-red-500 absolute -bottom-1 -right-1" />
                </div>
                <div className="text-center">
                  <p className="text-red-500 font-mono text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    NO_SIGNAL: FEED_LOST
                  </p>
                  <button 
                    onClick={handleRetry}
                    className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-all active:scale-95"
                  >
                    <RefreshCcw size={12} className="text-blue-400" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Reconnect</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <RefreshCcw size={24} className="text-slate-700 animate-spin" />
                <div className="text-slate-600 font-mono text-[9px] uppercase tracking-widest">
                  Initializing Stream...
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. SCANLINE EFFECT */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* 5. BOTTOM STATUS BAR */}
      <div className="absolute bottom-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent z-30 pointer-events-none">
        <div className="flex justify-between items-center text-[8px] font-mono font-bold tracking-widest">
          <span className={hasError ? "text-red-900" : "text-slate-500"}>
            {hasError ? "LATENCY: NULL" : "LATENCY: ~30ms"}
          </span>
          <span className={`flex items-center gap-1 ${hasError ? "text-red-600" : "text-slate-500"}`}>
            <div className={`w-1 h-1 rounded-full ${hasError ? "bg-red-600" : "bg-emerald-500 animate-pulse"}`} />
            {hasError ? "AI_SUSPENDED" : "AI_ACTIVE"}
          </span>
        </div>
      </div>
    </div>
  );
}