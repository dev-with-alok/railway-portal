// app/maintenance/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Wrench, CheckCircle } from 'lucide-react';

// 1. Define the Interface
interface AnomalyEvent {
  id: string;
  timestamp: string;
  camera: string;
  type: string;
  confidence: number;
  status: 'open' | 'closed';
  image_url: string;
  wagon_id: string;
  comment?: string;
}

export default function MaintenancePage() {
  // 2. Add types to your State
  const [openEvents, setOpenEvents] = useState<AnomalyEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AnomalyEvent | null>(null);
  const [comment, setComment] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/anomalies')
      .then(res => res.json())
      .then((data: AnomalyEvent[]) => {
        setOpenEvents(data.filter(e => e.status === 'open'));
      });
  }, []);

  const handleResolve = async () => {
    // 3. Add a guard check to satisfy "possibly null" error
    if (!selectedEvent) return;

    const formData = new FormData();
    formData.append("comment", comment);
    if (file) formData.append("file", file);

    try {
      await fetch(`http://127.0.0.1:8000/anomalies/${selectedEvent.id}/resolve`, {
        method: 'POST',
        body: formData
      });
      window.location.reload();
    } catch (err) {
      console.error("Resolution failed:", err);
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-black uppercase text-white flex items-center gap-3">
            <Wrench className="text-blue-500" /> Pending Repairs
          </h1>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Awaiting verification and resolution</p>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {openEvents.map(event => (
            <div key={event.id} className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex items-center justify-between border-l-4 border-l-amber-600">
               <div className="flex items-center gap-6">
                 <img src={event.image_url} className="w-24 h-24 object-cover rounded border border-slate-700" />
                 <div>
                   <span className="text-amber-500 font-black text-[10px] uppercase tracking-widest">Action Required</span>
                   <h3 className="text-lg font-bold text-white uppercase">{event.type}</h3>
                   <p className="text-xs text-slate-500 font-mono">Wagon: {event.wagon_id} | Detected: {event.timestamp}</p>
                 </div>
               </div>
               <button 
                 onClick={() => setSelectedEvent(event)}
                 className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
               >
                 Resolve Issue
               </button>
            </div>
          ))}
        </div>
      </main>

      {/* Resolve Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
              <h2 className="font-black uppercase tracking-tight">Resolution Report: {selectedEvent.wagon_id}</h2>
              <button onClick={() => setSelectedEvent(null)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            <div className="p-8 grid grid-cols-2 gap-8">
              <div>
                <span className="text-[10px] font-black text-slate-500 uppercase block mb-2">Original Evidence</span>
                <img src={selectedEvent.image_url} className="rounded-lg border border-slate-800 w-full" />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-2">Maintenance Notes</label>
                  <textarea 
                    className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-blue-500 outline-none"
                    placeholder="Describe the fix..."
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-2">Repair Photo (After Fix)</label>
                  <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer" />
                </div>
                <button 
                  onClick={handleResolve}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} /> Submit to History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}