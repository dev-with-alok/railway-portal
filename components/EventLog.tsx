"use client";

import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { io } from 'socket.io-client';

interface AnomalyEvent {
  id: string;
  timestamp: string;
  camera: string;
  type: string;
  confidence: number;
  status: 'open' | 'closed';
  image_url?: string; // Added to support images from backend
  isRead: boolean; // To track if the event has been viewed in the UI
  wagon_id?: string; // for wagon id
}

export default function EventLog() {
  const [events, setEvents] = useState<AnomalyEvent[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const closeModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(null);
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/anomalies')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error("Could not fetch initial logs:", err));

    const socket = io('http://127.0.0.1:8000');

    socket.on('new_anomaly', (newAnomaly: AnomalyEvent) => {
      const audio = new Audio('/alert.wav');
      audio.play().catch(() => console.log("Audio requires user interaction first"));
      setEvents(prev => [newAnomaly, ...prev]);
    });

    return () => { socket.disconnect(); };
  }, []);

  const handleResolve = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent opening the image when clicking the close button
    setEvents(prev => prev.map(ev => 
      ev.id === id ? { ...ev, status: 'closed' as const } : ev
    ));
  };

  const getStyles = (type: string, status: string) => {
    if (status === 'closed') return 'text-slate-500 border-l-slate-700 bg-slate-800/20 opacity-60';
    if (type.toLowerCase().includes('hazard') || type.toLowerCase().includes('plate')) 
      return 'text-red-400 border-l-red-500 bg-red-500/5 hover:bg-red-500/10';
    return 'text-blue-400 border-l-blue-500 bg-blue-500/5 hover:bg-blue-500/10';
  };

  const markAsRead = (id: string) => {
  setEvents(prev => prev.map(ev => 
    ev.id === id ? { ...ev, isRead: true } : ev
  ));
  // If you opened the image modal, call this inside that click handler
  const targetEvent = events.find(e => e.id === id);
  if(targetEvent?.image_url) setSelectedImage(targetEvent.image_url);
};

  return (
    <div className="h-full flex flex-col relative">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Alerts & Events
        </span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[9px] text-red-500 font-black uppercase">Live Connection</span>
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto font-mono text-[11px] p-2 space-y-1 scrollbar-hide">
        {events.length === 0 && (
          <div className="text-center py-8 text-slate-600 uppercase tracking-widest">
            Waiting for detection...
          </div>
        )}
        {events.map((event) => (
          <div 
            key={event.id}
            onClick={() => markAsRead(event.id)} // Mark as read when clicked
            className={`relative flex items-center gap-3 px-3 py-3 border-l-2 transition-all cursor-pointer
              ${event.isRead 
                ? 'opacity-60 border-l-slate-700 bg-transparent' // READ STYLE
                : 'bg-blue-600/10 border-l-blue-500'           // UNREAD STYLE
              }`}
          >
            {/* Unread Indicator Dot */}
            {!event.isRead && (
              <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            )}

            <span className={`opacity-40 text-[10px] font-bold ${!event.isRead && 'opacity-100 text-blue-400'}`}>
              {event.wagon_id} -- {event.timestamp}
            </span>

            <div className="flex-1">
              <span className={`truncate uppercase tracking-tight block ${event.isRead ? 'font-medium text-slate-400' : 'font-bold text-white'}`}>
                {event.type}
              </span>
              <span className="text-[9px] opacity-50 block">Cam: {event.camera}</span>
            </div>
          </div>
        ))}
      </div>

      {/* --- IMAGE MODAL OVERLAY --- */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl w-full flex flex-col items-center">
            <button 
              onClick={closeModal}
              className="absolute -top-10 right-0 text-white/70 hover:text-white flex items-center gap-2 transition-colors"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest">Close Preview</span>
              <X size={20} />
            </button>
            
            <div className="bg-slate-900 p-1 rounded-lg border border-white/10 shadow-2xl overflow-hidden">
                <img 
                  src={selectedImage} 
                  alt="Anomaly Evidence" 
                  className="max-h-[80vh] w-auto rounded object-contain"
                />
            </div>
            
            <div className="mt-4 text-center">
                <p className="text-white font-mono text-[10px] uppercase tracking-[0.2em] opacity-50">
                    High Resolution Evidence Capture - AI Verified
                </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}