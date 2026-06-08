"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { History, ShieldCheck, Database, RefreshCcw } from 'lucide-react';

// Unified interface matching your Maintenance page and Backend payload structures
interface AnomalyEvent {
  id: string;
  timestamp: string;
  camera: string;
  component: string; // Synced with backend key structure
  confidence: number;
  status: 'open' | 'closed';
  image_url?: string;
  wagon: string | number; // Synced with backend model key structure
  comment?: string;      
  resolved_at?: string;  
}

export default function HistoryPage() {
  // Animated Sidebar Configuration State Flags
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  
  // Data and Operations Pipeline States
  const [closedEvents, setClosedEvents] = useState<AnomalyEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchHistoryData = () => {
    setIsLoading(true);
    setFetchError(null);
    
    fetch('http://127.0.0.1:8000/api/anomalies')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP Error status: ${res.status}`);
        return res.json();
      })
      .then((data: AnomalyEvent[]) => {
        // Filter for archived entries and sort with newest entries at top
        const archivedLogs = data
          .filter(e => e.status === 'closed')
          .sort((a, b) => {
            const timeA = a.resolved_at ? new Date(a.resolved_at).getTime() : 0;
            const timeB = b.resolved_at ? new Date(b.resolved_at).getTime() : 0;
            return timeB - timeA;
          });
        setClosedEvents(archivedLogs);
      })
      .catch(err => {
        console.error("History fetch error:", err);
        setFetchError("Unable to extract transaction history matrices from the vision server.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchHistoryData();
  }, []);

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

      {/* 2. CORE WORKSPACE BLOCK (Prevents layout row expansion distortion) */}
      <main className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden bg-[#020813] bg-[radial-gradient(circle_at_70%_30%,_rgba(6,182,212,0.03),_transparent_60%)] relative">
        
        {/* Background Network Matrix Accent Grid */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)', 
            backgroundSize: '40px 40px' 
          }} 
        />

        {/* Static Header Panel Container */}
        <header className="h-20 border-b border-slate-900/60 flex items-center justify-between px-6 sm:px-8 bg-[#040d21]/60 backdrop-blur-md shrink-0 relative z-10">
          <div>
            <h1 className="text-xl font-black uppercase text-white tracking-tight flex items-center gap-2.5 drop-shadow-[0_0_10px_rgba(6,182,212,0.15)]">
              <History className="text-cyan-400" size={20} /> Operational History
            </h1>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">
              Verified and archived hardware system maintenance logs
            </p>
          </div>
          {!isLoading && !fetchError && (
            <span className="text-slate-500 font-mono text-[9px] uppercase border border-slate-900 bg-[#040d21] px-2.5 py-1 rounded-md">
              Total Records: {closedEvents.length}
            </span>
          )}
        </header>

        {/* 3. SCROLLABLE INTERIOR CONTENT WELL */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto min-h-0 relative z-10 max-w-5xl w-full mx-auto">
          
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center border border-slate-900 rounded-xl bg-[#0b1528]/20 backdrop-blur-sm shadow-xl">
              <RefreshCcw className="text-cyan-400 animate-spin mb-4" size={28} />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest italic">Syncing Ledger History...</span>
            </div>
          ) : fetchError ? (
            <div className="h-64 flex flex-col items-center justify-center border border-red-950/40 rounded-xl bg-red-950/10 backdrop-blur-sm shadow-xl">
              <Database className="text-red-400 mb-3" size={32} />
              <h2 className="text-white font-sans text-sm font-bold uppercase tracking-wider">Database Extraction Failed</h2>
              <p className="text-slate-500 text-[10px] mb-5 font-mono px-12 text-center max-w-md">{fetchError}</p>
              <button 
                onClick={fetchHistoryData}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-800 text-[10px] font-mono font-bold uppercase tracking-wider transition-all active:scale-95"
              >
                <RefreshCcw size={12} className="text-cyan-400" /> Refresh Channel
              </button>
            </div>
          ) : (
            /* Glassmorphic Data Table Wrapper Container Frame */
            <div className="bg-[#0b1528]/40 backdrop-blur-md border border-slate-900/80 rounded-xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#040d21]/80 border-b border-slate-900/60 font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    <tr>
                      <th className="py-4 px-5">Unit ID</th>
                      <th className="py-4 px-5">Component Type</th>
                      <th className="py-4 px-5">Resolution Notes</th>
                      <th className="py-4 px-5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/40 text-sm">
                    {closedEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-[#0c1624]/40 transition-colors group">
                        
                        {/* Wagon Identifier Module */}
                        <td className="py-4 px-5 font-mono text-xs font-bold text-cyan-400">
                          #{event.wagon}
                        </td>
                        
                        {/* Classification Target Identification */}
                        <td className="py-4 px-5 font-sans font-bold text-slate-200 uppercase text-xs tracking-wide">
                          {event.component || 'UNKNOWN_VALVE'}
                        </td>
                        
                        {/* Mitigation Tracking Comments */}
                        <td className="py-4 px-5 max-w-xs md:max-w-sm">
                          <p className="text-xs text-slate-400 line-clamp-1 italic">
                            {event.comment || "Archived without administrative remarks"}
                          </p>
                          <span className="text-[9px] text-slate-600 font-mono block mt-0.5 uppercase tracking-tighter">
                            Closed: {event.resolved_at || event.timestamp}
                          </span>
                        </td>
                        
                        {/* Status Integrity Verification Badges */}
                        <td className="py-4 px-5 text-right">
                          <div className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md drop-shadow-[0_0_6px_rgba(16,185,129,0.1)]">
                            <ShieldCheck size={12} />
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider">Archived</span>
                          </div>
                        </td>
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {closedEvents.length === 0 && (
                <div className="py-20 text-center text-slate-600 font-mono text-xs uppercase tracking-[0.25em]">
                  No archived database records located
                </div>
              )}
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}