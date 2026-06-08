"use client";

import React, { useEffect, useState } from 'react';
import { AlertCircle, WifiOff, RefreshCcw, X } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface AnomalyEvent {
  id: string;
  timestamp: string;
  camera: string;
  type: string;
  confidence: number;
  status: 'open' | 'closed';
  image_url?: string;
  isRead: boolean;
  wagon_id?: string;
}

export default function EventLog() {
  const [events, setEvents] = useState<AnomalyEvent[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // New State for Error Handling
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const fetchInitialLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/anomalies');
      if (!res.ok) throw new Error(`Server Error: ${res.status}`);
      const data = await res.json();
      setEvents(data);
    } catch (err: any) {
      setError(err.message || "Backend unreachable");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialLogs();

    const socket: Socket = io('http://127.0.0.1:8000', {
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('connect_error', () => setIsConnected(false));

    socket.on('new_anomaly', (newAnomaly: AnomalyEvent) => {
      const audio = new Audio('/alert.wav');
      audio.play().catch(() => {});
      setEvents(prev => [newAnomaly, ...prev]);
    });

    return () => { socket.disconnect(); };
  }, []);

  const markAsRead = (id: string) => {
    setEvents(prev => prev.map(ev => 
      ev.id === id ? { ...ev, isRead: true } : ev
    ));
    const targetEvent = events.find(e => e.id === id);
    if(targetEvent?.image_url) setSelectedImage(targetEvent.image_url);
  };

  return (
    <div className="h-full flex flex-col relative bg-[#0a0f1e]/80">
      {/* Dynamic Header */}
      <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">
          System Logs
        </span>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-600'}`} />
          <span className={`text-[9px] font-black uppercase ${isConnected ? 'text-emerald-500' : 'text-red-600'}`}>
            {isConnected ? 'Live Socket' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto font-mono text-[11px] p-2 space-y-1 scrollbar-hide">
        
        {/* CASE 1: Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <RefreshCcw className="animate-spin mb-2" size={18} />
            <span className="text-[9px] uppercase tracking-tighter">Syncing with DB...</span>
          </div>
        )}

        {/* CASE 2: API Error State */}
        {!isLoading && error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center my-4 mx-2">
            <WifiOff className="text-red-500 mx-auto mb-2" size={20} />
            <p className="text-red-400 text-[10px] uppercase font-bold mb-2">API Connection Failed</p>
            <button 
              onClick={fetchInitialLogs}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-3 py-1 rounded text-[9px] font-black uppercase transition-all"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* CASE 3: Empty State (Connected but no data) */}
        {!isLoading && !error && events.length === 0 && (
          <div className="text-center py-12 flex flex-col items-center gap-2">
            <AlertCircle size={24} className="text-slate-800" />
            <span className="text-slate-600 uppercase tracking-widest text-[9px]">
              No active anomalies in stream
            </span>
          </div>
        )}

        {/* CASE 4: Rendering Data */}
        {!isLoading && events.map((event) => (
          <div 
            key={event.id}
            onClick={() => markAsRead(event.id)}
            className={`relative flex items-center gap-3 px-3 py-3 border-l-2 transition-all cursor-pointer
              ${event.isRead 
                ? 'opacity-60 border-l-slate-700 bg-transparent' 
                : 'bg-blue-600/10 border-l-blue-500 border-r border-r-blue-500/10 shadow-lg'           
              } hover:bg-slate-800/40`}
          >
            {!event.isRead && (
              <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500" />
            )}

            <div className="flex-1">
              <div className="flex justify-between items-center mb-0.5">
                <span className={`text-[9px] font-bold ${event.isRead ? 'text-slate-500' : 'text-blue-400'}`}>
                  {event.wagon_id || 'UNKNOWN-ID'}
                </span>
                <span className="opacity-30 text-[8px] uppercase">{event.timestamp}</span>
              </div>
              <span className={`truncate uppercase tracking-tight block ${event.isRead ? 'font-medium text-slate-400' : 'font-bold text-white'}`}>
                {event.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* --- IMAGE MODAL (Kept same) --- */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button className="absolute -top-10 right-0 text-white/50 hover:text-white flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase">Close</span>
              <X size={20} />
            </button>
            <img src={selectedImage} alt="Evidence" className="max-h-[80vh] mx-auto rounded border border-white/10" />
          </div>
        </div>
      )}
    </div>
  );
}