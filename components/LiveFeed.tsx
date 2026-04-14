// components/LiveFeed.tsx
"use client";

import React from 'react';
import { Maximize2, Monitor } from 'lucide-react';

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
  streamSource?: string; // This will be "http://localhost:8000/video_feed"
  detections?: Detection[];
  aspectRatio?: '16:9' | '4:3';
}

export default function LiveFeed({ label, streamSource, detections = [], aspectRatio = '16:9' }: LiveFeedProps) {
  return (
    <div className="relative h-full w-full bg-black rounded-xl border border-slate-800 overflow-hidden group shadow-2xl">
      
      {/* 1. TOP METADATA BAR */}
      <div className="absolute top-0 w-full p-3 bg-gradient-to-b from-black/90 to-transparent z-30 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-mono font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Monitor size={10} className="text-blue-500" />
            {label}
          </span>
          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-tighter">
            System: YOLOv8_Railway // Feed: MJPEG_LIVE
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
      {/* Note: This layer sits on top of the video feed */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {detections.map((d) => (
          <div
            key={d.id}
            className={`absolute border-2 transition-all duration-300 ${
              d.status === 'critical' ? 'border-red-500 bg-red-500/10' : 
              d.status === 'warning' ? 'border-amber-500 bg-amber-500/10' : 
              'border-emerald-400 bg-emerald-400/10'
            }`}
            style={{ 
              left: `${d.x}%`, 
              top: `${d.y}%`, 
              width: `${d.width}%`, 
              height: `${d.height}%` 
            }}
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

      {/* 3. ACTUAL LIVE STREAM FEED */}
      <div className="w-full h-full flex items-center justify-center bg-slate-900">
        {streamSource ? (
          <img 
            src={streamSource} 
            alt="Live Stream"
            className="w-full h-full object-cover filter contrast-110 brightness-90"
            // Important: This key trick forces a refresh if the source changes
            key={streamSource}
          />
        ) : (
          <div className="text-slate-600 font-mono text-[10px] animate-pulse">
            WAITING FOR STREAM...
          </div>
        )}
      </div>

      {/* 4. SCANLINE EFFECT (Visual Polish) */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* 5. BOTTOM STATUS BAR */}
      <div className="absolute bottom-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent z-30 pointer-events-none">
        <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 font-bold tracking-widest">
          <span>LATENCY: ~30ms</span>
          <span className="flex items-center gap-1">
            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
            AI_ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
}