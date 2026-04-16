"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { MessageSquare, Upload, ExternalLink, CheckCircle } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetch('http://127.0.0.1:8000/anomalies').then(res => res.json()).then(setHistory);
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("comment", comment);
    // Add logic here to append a file if selected
    
    await fetch(`http://127.0.0.1:8000/anomalies/${selectedEvent.id}/update`, {
      method: 'POST',
      body: formData
    });
    // Refresh list
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-6">Anomaly Archive</h1>
        
        <div className="space-y-4">
          {history.map(event => (
            <div key={event.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-6">
                <img src={event.image_url} className="w-20 h-20 object-cover rounded-lg border border-slate-700" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white uppercase">{event.type}</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Wagon: {event.wagon_id}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{event.timestamp} | Cam: {event.camera}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedEvent(event)}
                  className="px-4 py-2 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-bold uppercase hover:bg-blue-600/20"
                >
                  Review / Action
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Action Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-4">Post-Inspection Report: {selectedEvent.wagon_id}</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <img src={selectedEvent.image_url} className="rounded-lg border border-slate-700" />
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col items-center justify-center border-dashed">
                <Upload className="text-slate-600 mb-2" />
                <span className="text-[10px] text-slate-500 uppercase">Upload Corrected Part Photo</span>
              </div>
            </div>

            <textarea 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white mb-4 h-32"
              placeholder="Add maintenance notes or verification details..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="flex gap-3 justify-end">
              <button onClick={() => setSelectedEvent(null)} className="px-6 py-2 text-slate-400 uppercase text-xs font-bold">Cancel</button>
              <button onClick={handleUpdate} className="px-6 py-2 bg-emerald-600 text-white rounded-lg uppercase text-xs font-bold flex items-center gap-2">
                <CheckCircle size={16} /> Save & Resolve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}