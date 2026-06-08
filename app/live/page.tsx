"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import LiveFeed from '@/components/LiveFeed';
import StatsPanel from '@/components/StatsPanel';
import EventLog from '@/components/EventLog';
import Timeline from '@/components/Timeline';

export default function LiveView() {
  // Track hover state to expand/collapse sidebar area dynamically
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    /* Changed background to #1a1a1a to exactly match your successful test file layout */
    <div className="flex h-screen w-screen bg-[#1a1a1a] text-slate-200 overflow-hidden font-sans shadow-none drop-shadow-none">
      
      {/* SIDEBAR WRAPPER CONTAINER: Controls hover detection state */}
      <div 
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
        className="h-full z-40 transition-all duration-300 ease-in-out shrink-0"
        style={{ width: sidebarExpanded ? '240px' : '64px' }} // Tweak width metrics to match your exact Sidebar design
      >
        {/* Pass the expanded flag down if your Sidebar component handles internal layout tuning */}
        <Sidebar isCollapsed={!sidebarExpanded} />
      </div>
      
      {/* MAIN TRACKING SCREEN AREA (Removed the glowing radial-gradient and updated background) */}
      <main className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden bg-[#1a1a1a] shadow-none drop-shadow-none">
        
        <header className="h-14 border-b border-neutral-800 flex items-center justify-between px-6 bg-neutral-900/60 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Active Operations:</span>
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
              Live Feed Active // MAXIMIZED_VIEW
            </span>
          </div>
          <div className="text-[9px] font-mono text-slate-500 tracking-wider uppercase bg-neutral-950/40 px-2 py-0.5 border border-neutral-800 rounded">
            Hover left edge to view navigation menu
          </div>
        </header>

        {/* Dashboard Grid Workspace - Automatically stretches when sidebar changes size */}
        <div className="p-4 grid grid-cols-12 gap-4 flex-1 overflow-y-auto min-h-0 content-start transition-all duration-300 shadow-none drop-shadow-none">
          
          {/* Main Feed Module Block */}
          <div className="col-span-12 lg:col-span-8 flex flex-col justify-start shadow-none drop-shadow-none" style={{ boxShadow: 'none', filter: 'none' }}>
            <LiveFeed 
              label="Main Portal / OCR" 
              streamSource="http://localhost:8000/video_feed/cam2" 
              aspectRatio="16:9"
            />
          </div>

          {/* Secondary Side Feeds Block */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 shadow-none drop-shadow-none">
             <LiveFeed label="Track2" streamSource="http://localhost:8000/video_feed/cam1" aspectRatio="16:9" />
             <LiveFeed label="Track1" streamSource="http://localhost:8000/video_feed/cam3" aspectRatio="16:9" />
          </div>

          {/* Bottom Telemetry Display Panel Rows */}
          <div className="col-span-12 md:col-span-3 bg-neutral-900/40 backdrop-blur-md rounded-xl border border-neutral-800 p-4 shadow-none">
            <StatsPanel id="TRN-2024-X123" speed={24} />
          </div>

          <div className="col-span-12 md:col-span-5 bg-neutral-900/40 backdrop-blur-md rounded-xl border border-neutral-800 flex flex-col overflow-hidden shadow-none">
            <EventLog />
          </div>

          <div className="col-span-12 md:col-span-4 bg-neutral-900/40 backdrop-blur-md rounded-xl border border-neutral-800 p-4 shadow-none">
            <Timeline totalCars={48} currentProgress={18} />
          </div>
          
        </div>
      </main>
    </div>
  );
}