// components/StatsPanel.tsx
"use client";

import React from 'react';
import { Gauge, Train } from 'lucide-react';

interface StatsProps {
  id: string;
  speed: number;
}

export default function StatsPanel({ id, speed }: StatsProps) {
  // Calculate percentage for the speed bar (assuming 100km/h max)
  const speedPercentage = Math.min((speed / 100) * 100, 100);

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Train size={16} className="text-slate-500" />
          <h3 className="text-[10px] uppercase text-slate-500 tracking-[0.2em] font-bold">
            Current Train
          </h3>
        </div>
        
        <div className="space-y-1">
          <p className="text-2xl font-mono font-black text-white tracking-tighter">
            {id}
          </p>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-[9px] font-bold text-blue-400 uppercase">
              Freight Class A
            </span>
            <span className="text-[10px] text-slate-500 font-mono italic">
              Axles: 48
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2 text-slate-400">
            <Gauge size={14} />
            <span className="text-[10px] uppercase font-bold tracking-widest">Velocity</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-mono font-bold text-emerald-400 leading-none">
              {speed}
            </span>
            <span className="text-[10px] font-bold text-slate-600 uppercase font-mono">km/h</span>
          </div>
        </div>

        {/* Speed Gauge Bar */}
        <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-emerald-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(52,211,153,0.3)]"
            style={{ width: `${speedPercentage}%` }}
          />
        </div>
        
        <div className="flex justify-between text-[9px] font-mono text-slate-600 font-bold uppercase">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}