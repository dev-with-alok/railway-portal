"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Activity, ShieldCheck, TrainFront, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Overview() {
  // Track hover state to expand/collapse sidebar area dynamically
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const stats = [
    { label: 'Total Scans', value: '1,284', icon: <TrainFront size={20} className="text-cyan-400" /> },
    { label: 'Safety Index', value: '98.2%', icon: <ShieldCheck size={20} className="text-emerald-400" /> },
    { label: 'Active Alerts', value: '3', icon: <AlertTriangle size={20} className="text-amber-400 animate-pulse" /> },
    { label: 'System Load', value: '24%', icon: <Activity size={20} className="text-cyan-400" /> },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#020813] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. SIDEBAR ANCHOR WRAPPER */}
      <div 
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
        className="h-full z-40 transition-all duration-300 ease-in-out shrink-0"
        style={{ width: sidebarExpanded ? '240px' : '64px' }}
      >
        <Sidebar isCollapsed={!sidebarExpanded} />
      </div>

      {/* 2. CORE WORKSPACE BLOCK (Prevents elements from overflowing) */}
      <main className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden bg-[#020813] bg-[radial-gradient(circle_at_70%_30%,_rgba(6,182,212,0.03),_transparent_60%)] relative">
        
        {/* Background Decorative Matrix Grid */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)', 
            backgroundSize: '40px 40px' 
          }} 
        />

        {/* 3. SCROLLABLE INTERIOR CONTENT WELL */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto min-h-0 space-y-8 relative z-10 max-w-6xl w-full mx-auto">
          
          {/* Header Block */}
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              System Overview
            </h1>
            <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mt-1">
              Railway Infrastructure Health & Monitoring Command
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat) => (
              <div 
                key={stat.label} 
                className="bg-[#0b1528]/40 backdrop-blur-md border border-slate-900/80 p-5 rounded-xl shadow-lg hover:border-cyan-500/20 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-[#040d21] rounded-lg border border-slate-800 shadow-inner">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-black text-white group-hover:text-cyan-300 transition-colors">
                  {stat.value}
                </div>
                <div className="text-[9px] font-mono font-bold uppercase text-slate-500 tracking-widest mt-1.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action Module (Aligned with login page button design) */}
          <div className="bg-gradient-to-r from-[#0c1624] to-[#111e2f] rounded-xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl border border-cyan-500/20 relative overflow-hidden group">
            {/* Subtle glow accent under the action card */}
            <div className="absolute -left-16 -top-16 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-lg font-sans font-bold text-[#a5f3fc] drop-shadow-[0_0_8px_rgba(6,182,212,0.3)] uppercase tracking-wide">
                Ready for live inspection?
              </h2>
              <p className="text-slate-400 text-xs mt-1 max-w-xl">
                Switch to Live View to monitor multi-track camera streams, dynamic bounding boxes, and real-time OCR telemetry.
              </p>
            </div>

            <Link 
              href="/live" 
              className="relative shrink-0 w-full md:w-auto bg-gradient-to-b from-[#1b587a] to-[#12364c] hover:from-[#226c96] hover:to-[#174663] text-[#e0f2fe] font-sans text-xs font-bold uppercase tracking-[0.15em] px-6 py-3.5 rounded-lg shadow-lg border border-cyan-400/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>Initialize Live View</span>
              <ArrowRight size={14} className="text-cyan-300 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          
        </div>
      </main>
    </div>
  );
}