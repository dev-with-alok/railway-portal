"use client";

import Sidebar from '@/components/Sidebar';
import LiveFeed from '@/components/LiveFeed';
import StatsPanel from '@/components/StatsPanel';
import EventLog from '@/components/EventLog';
import Timeline from '@/components/Timeline';

export default function LiveView() {
  return (
    <div className="flex h-screen w-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 h-full">
        <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-[#020617] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Active Operations:</span>
            <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-widest">Live Feed Active</span>
          </div>
        </header>

        <div className="p-4 grid grid-cols-12 grid-rows-6 gap-4 flex-1 min-h-0">
          {/* Main Feed */}
          <div className="col-span-8 row-span-4 min-h-0">
            <LiveFeed 
              label="Main Portal / OCR" 
              streamSource="http://localhost:8000/video_feed/cam2" />
          </div>

          {/* Side Feeds */}
          <div className="col-span-4 row-span-4 grid grid-rows-2 gap-4 min-h-0">
             <LiveFeed label="Left Bogie" streamSource="http://localhost:8000/video_feed/cam1" />
             <LiveFeed label="Right Bogie" streamSource="http://localhost:8000/video_feed/cam3" />
          </div>

          {/* Bottom Analytics Row */}
          <div className="col-span-3 row-span-2 bg-[#0a0f1e]/50 rounded-xl border border-slate-800 p-4 min-h-0">
            <StatsPanel id="TRN-2024-X123" speed={24} />
          </div>

          <div className="col-span-5 row-span-2 bg-[#0a0f1e]/50 rounded-xl border border-slate-800 min-h-0 flex flex-col overflow-hidden">
            <EventLog />
          </div>

          <div className="col-span-4 row-span-2 bg-[#0a0f1e]/50 rounded-xl border border-slate-800 p-4 min-h-0">
            <Timeline totalCars={48} currentProgress={18} />
          </div>
        </div>
      </main>
    </div>
  );
}