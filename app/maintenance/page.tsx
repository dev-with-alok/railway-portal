"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Wrench, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  ListFilter, 
  AlertCircle, 
  RefreshCcw, 
  Database 
} from 'lucide-react';

// Define the Interface matching backend payloads
interface AnomalyEvent {
  id: string;
  timestamp: string;
  camera: string;
  component: string; // Synced with backend dictionary object
  confidence: number;
  status: 'open' | 'closed';
  image_url?: string;
  wagon: string | number; // Synced with backend structural model
  comment?: string;
}

export default function MaintenancePage() {
  // Animated Sidebar Core Tracking Flags
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Data State
  const [allOpenEvents, setAllOpenEvents] = useState<AnomalyEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AnomalyEvent | null>(null);
  
  // Status State
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  // Input State
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch Logic with Fallback Variable Syncing
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/anomalies');
      
      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }

      const data: AnomalyEvent[] = await res.json();
      
      // Filter out unresolved issues and sort chronologically
      const filteredSorted = data
        .filter(e => e.status === 'open')
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setAllOpenEvents(filteredSorted);
    } catch (err) {
      console.error("Fetch error:", err);
      setFetchError("Unable to connect to the Monitoring API. Please ensure the backend server is running.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Pagination Matrix Processing Calculations
  const totalPages = Math.ceil(allOpenEvents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allOpenEvents.slice(indexOfFirstItem, indexOfLastItem);

  const handleResolve = async () => {
    if (!selectedEvent || isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Setup payload matching the application/x-www-form-urlencoded specification
      const urlEncodedData = new URLSearchParams();
      urlEncodedData.append("comment", comment);

      const res = await fetch(`http://127.0.0.1:8000/api/anomalies/${selectedEvent.id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedData.toString()
      });
      
      if (!res.ok) throw new Error("Resolution submission failed");
      
      setSelectedEvent(null);
      setComment("");
      fetchData(); // Hot reload the telemetry feed list dynamically without complete screen flashing
    } catch (err) {
      console.error("Resolution failed:", err);
      alert("Failed to submit resolution. Check your network connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* 2. CORE WORKSPACE BLOCK (Structural containment fix) */}
      <main className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden bg-[#020813] bg-[radial-gradient(circle_at_70%_30%,_rgba(6,182,212,0.03),_transparent_60%)] relative">
        
        {/* Background Grid Accent Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)', 
            backgroundSize: '40px 40px' 
          }} 
        />

        {/* Header Ribbon Layout */}
        <header className="h-20 border-b border-slate-900/60 flex items-center justify-between px-6 sm:px-8 bg-[#040d21]/60 backdrop-blur-md shrink-0 relative z-10">
          <div>
            <h1 className="text-xl font-black uppercase text-white tracking-tight flex items-center gap-2.5 drop-shadow-[0_0_10px_rgba(6,182,212,0.15)]">
              <Wrench className="text-cyan-400" size={20} /> Pending Repairs
            </h1>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">
              {isLoading ? "Syncing with API..." : `Showing ${allOpenEvents.length > 0 ? indexOfFirstItem + 1 : 0} - ${Math.min(indexOfLastItem, allOpenEvents.length)} of ${allOpenEvents.length} records`}
            </p>
          </div>

          {/* Page Size Selector */}
          {!isLoading && !fetchError && (
            <div className="flex items-center gap-1.5 bg-[#040d21] border border-slate-900 p-1 rounded-lg">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase px-2 flex items-center gap-1">
                <ListFilter size={11} /> View:
              </span>
              {[5, 10, 20].map((num) => (
                <button
                  key={num}
                  onClick={() => { setItemsPerPage(num); setCurrentPage(1); }}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                    itemsPerPage === num 
                      ? 'bg-gradient-to-b from-cyan-600 to-blue-600 text-white shadow-md' 
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  {String(num).padStart(2, '0')}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* 3. SCROLLABLE INTERIOR CONTENT WELL */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto min-h-0 relative z-10 max-w-5xl w-full mx-auto space-y-4">
          
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center border border-slate-900 rounded-xl bg-[#0b1528]/20 backdrop-blur-sm shadow-xl">
              <RefreshCcw className="text-cyan-400 animate-spin mb-4" size={28} />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest italic">Fetching Telemetry Matrix...</span>
            </div>
          ) : fetchError ? (
            <div className="h-64 flex flex-col items-center justify-center border border-red-950/40 rounded-xl bg-red-950/10 backdrop-blur-sm shadow-xl">
              <AlertCircle className="text-red-400 mb-3" size={36} />
              <h2 className="text-white font-sans text-sm font-bold uppercase tracking-wider">API Link Error</h2>
              <p className="text-slate-500 text-[10px] mb-5 font-mono px-12 text-center max-w-md">{fetchError}</p>
              <button 
                onClick={fetchData}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-800 text-[10px] font-mono font-bold uppercase tracking-wider transition-all active:scale-95"
              >
                <Database size={12} className="text-cyan-400" /> Retry Connection
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {currentItems.map(event => (
                <div 
                  key={event.id} 
                  className="bg-[#0b1528]/40 backdrop-blur-md border border-slate-900/80 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-2 border-l-amber-500 shadow-lg hover:border-cyan-500/20 transition-all group"
                >
                  <div className="flex items-center gap-5">
                    {/* Fallback layout box renders a clean technical missing node symbol if snapshot isn't available */}
                    <div className="w-16 h-16 bg-[#040d21] border border-slate-800 rounded-lg overflow-hidden shrink-0 shadow-inner flex items-center justify-center relative">
                      <span className="text-[8px] font-mono font-bold text-slate-600 uppercase tracking-tighter">CAM_SNAP</span>
                    </div>
                    
                    <div>
                      <span className="text-amber-400 font-mono text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                        Action Required
                      </span>
                      <h3 className="text-base font-bold text-slate-200 uppercase tracking-tight mt-1.5">
                        {event.component || 'UNKNOWN_FAULT'}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Wagon: <span className="text-cyan-400 font-bold">#{event.wagon}</span> <span className="text-slate-800 mx-1">|</span> {event.timestamp} <span className="text-slate-800 mx-1">|</span> Conf: {Math.round(event.confidence * 100)}%
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedEvent(event)}
                    className="bg-slate-900 hover:bg-gradient-to-b hover:from-cyan-600 hover:to-blue-600 text-slate-300 hover:text-white px-5 py-2.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all border border-slate-800 hover:border-cyan-400/30 shadow-md whitespace-nowrap"
                  >
                    Review & Resolve
                  </button>
                </div>
              ))}

              {allOpenEvents.length === 0 && (
                <div className="py-20 text-center border border-dashed border-slate-900 rounded-xl bg-[#0b1528]/10">
                  <p className="text-slate-600 font-mono text-xs uppercase tracking-[0.25em]">No pending anomalies detected</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination Ribbon */}
          {!isLoading && !fetchError && allOpenEvents.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-4 border-t border-slate-900/60 pt-6">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 rounded-lg bg-[#040d21] border border-slate-900 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-900 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex gap-1.5 font-mono">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      currentPage === i + 1 
                        ? 'bg-gradient-to-b from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-950/50 border border-cyan-400/20' 
                        : 'bg-[#040d21] border border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </button>
                ))}
              </div>

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 rounded-lg bg-[#040d21] border border-slate-900 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-900 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Review & Resolution Dialogue Modal Window */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-[#0b1528] border border-cyan-500/20 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-900 bg-[#040d21]/60 flex justify-between items-center">
              <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <span className="text-cyan-400">Review Matrix:</span> Wagon #{selectedEvent.wagon}
              </h2>
              <button 
                onClick={() => setSelectedEvent(null)} 
                className="text-slate-500 hover:text-white transition-colors text-xs font-mono"
                disabled={isSubmitting}
              >
                ✕ CLOSE
              </button>
            </div>
            
            {/* Modal Body Container */}
            <div className="p-6 space-y-5">
              <div className="bg-[#040d21] border border-slate-900 p-3.5 rounded-xl text-xs font-mono space-y-1 text-slate-400">
                <p><span className="text-slate-600">PROFILE_ID :</span> {selectedEvent.id}</p>
                <p><span className="text-slate-600">COMPONENT  :</span> <span className="text-slate-200 uppercase font-bold">{selectedEvent.component}</span></p>
                <p><span className="text-slate-600">TIMESTAMP  :</span> {selectedEvent.timestamp}</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block ml-0.5">
                  Action Remediation Comment
                </label>
                <textarea 
                  className="w-full h-28 bg-[#040d21] border border-slate-900 rounded-lg p-4 text-sm focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_12px_rgba(6,182,212,0.1)] transition-all text-white placeholder:text-slate-700"
                  placeholder="Provide processing comments or repair specifications documentation details..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Execution Form Controls */}
              <button 
                onClick={handleResolve}
                disabled={isSubmitting || !comment.trim()}
                className="w-full py-3.5 bg-gradient-to-b from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-900 disabled:to-slate-900 text-white font-mono text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 border border-cyan-400/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCcw className="animate-spin" size={14} /> Saving Log...
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} /> Commit Changes to Archive
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}