// components/Timeline.tsx
"use client";

import React from 'react';
import { MousePointer2 } from 'lucide-react';

interface TimelineProps {
  totalCars: number;
  currentProgress: number; // The car currently passing the camera
}

export default function Timeline({ totalCars, currentProgress }: TimelineProps) {
  // Mocking status for each car: 0: pending, 1: pass, 2: warning, 3: fault
  const carStatuses = Array.from({ length: totalCars }, (_, i) => {
    if (i === 18) return 3; // Fault at car 18
    if (i === 5 || i === 12) return 2; // Warnings
    if (i < currentProgress) return 1; // Already passed
    return 0; // Yet to come
  });

  const getStatusColor = (status: number, isCurrent: boolean) => {
    if (isCurrent) return 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] border-white animate-pulse';
    switch (status) {
      case 1: return 'bg-blue-500/60 border-blue-400/50';
      case 2: return 'bg-amber-500 border-amber-400 animate-pulse';
      case 3: return 'bg-red-600 border-red-500 shadow-[0_0_8px_rgba(220,38,38,0.5)]';
      default: return 'bg-slate-800 border-slate-700 opacity-40';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[10px] uppercase text-slate-500 tracking-[0.2em] font-bold">
          Roll-In Timeline
        </h3>
        <div className="flex gap-4 font-mono text-[9px] font-bold uppercase tracking-tighter">
          <span className="text-blue-400">Processed: {currentProgress}</span>
          <span className="text-red-500 underline underline-offset-4 decoration-red-500/50">Faults: 1</span>
        </div>
      </div>

      {/* The Track/Car Visualization */}
      <div className="flex-1 flex flex-wrap gap-1 content-start overflow-y-auto pr-2 scrollbar-hide">
        {carStatuses.map((status, index) => {
          const isCurrent = index === currentProgress;
          return (
            <div
              key={index}
              className={`
                relative h-7 w-3.5 rounded-sm border transition-all duration-500 cursor-pointer
                hover:scale-110 hover:z-10 group
                ${getStatusColor(status, isCurrent)}
              `}
            >
              {/* Tooltip on Hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                <div className="bg-slate-900 border border-slate-700 text-[8px] text-white px-2 py-1 rounded shadow-xl whitespace-nowrap">
                  Car ID: #{index + 1}
                  {status === 3 && <span className="block text-red-400 font-bold italic">Major Fault</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2 text-[9px] text-slate-500 font-bold uppercase tracking-widest">
          <MousePointer2 size={10} />
          <span>Click car for details</span>
        </div>
        <div className="text-[10px] font-mono text-blue-400">
          Axle Count: {currentProgress * 4} / {totalCars * 4}
        </div>
      </div>
    </div>
  );
}