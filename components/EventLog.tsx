// components/EventLog.tsx
"use client";

import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

type EventType = 'error' | 'warning' | 'success' | 'info';

interface Event {
  id: number;
  time: string;
  message: string;
  type: EventType;
}

const mockEvents: Event[] = [
  { id: 1, time: "15:05:32", message: "Left Axle 5: Wear Threshold Exceeded", type: "error" },
  { id: 2, time: "15:04:10", message: "Train ID Confirmed: TRN-2024-X123", type: "success" },
  { id: 3, time: "15:03:55", message: "Optical Sensor: Focus Locked", type: "info" },
  { id: 4, time: "15:03:12", message: "Brake Pad 6: Maintenance Required", type: "warning" },
  { id: 5, time: "15:02:45", message: "RFID Tag Scanned: Zone 4", type: "success" },
];

export default function EventLog() {
  const getStyles = (type: EventType) => {
    switch (type) {
      case 'error': return 'text-red-400 border-l-red-500 bg-red-500/5';
      case 'warning': return 'text-amber-400 border-l-amber-500 bg-amber-500/5';
      case 'success': return 'text-emerald-400 border-l-emerald-500 bg-emerald-400/5';
      default: return 'text-blue-400 border-l-blue-500 bg-blue-500/5';
    }
  };

  const getIcon = (type: EventType) => {
    switch (type) {
      case 'error': return <AlertCircle size={12} />;
      case 'warning': return <AlertTriangle size={12} />;
      case 'success': return <CheckCircle2 size={12} />;
      default: return <Info size={12} />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Alerts & Events
        </span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[9px] text-red-500 font-black uppercase">Live</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto font-mono text-[11px] p-2 space-y-1 scrollbar-hide">
        {mockEvents.map((event) => (
          <div 
            key={event.id}
            className={`flex items-center gap-3 px-3 py-2 border-l-2 rounded-r transition-all hover:bg-white/5 cursor-default ${getStyles(event.type)}`}
          >
            <span className="opacity-40 text-[10px] shrink-0 font-bold">{event.time}</span>
            <span className="shrink-0">{getIcon(event.type)}</span>
            <span className="font-medium truncate uppercase tracking-tight">{event.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}