"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { History, ShieldCheck } from 'lucide-react';

// 1. Define the Interface (Make sure this matches your Maintenance page)
interface AnomalyEvent {
  id: string;
  timestamp: string;
  camera: string;
  type: string;
  confidence: number;
  status: 'open' | 'closed';
  image_url: string;
  wagon_id: string;
  comment?: string;      // Optional because only resolved items have them
  resolved_at?: string;  // Optional for the same reason
}

export default function HistoryPage() {
  // 2. Explicitly type the state as an array of AnomalyEvent
  const [closedEvents, setClosedEvents] = useState<AnomalyEvent[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/anomalies')
      .then(res => res.json())
      .then((data: AnomalyEvent[]) => {
        // Filter for closed (archived) events
        setClosedEvents(data.filter(e => e.status === 'closed'));
      })
      .catch(err => console.error("History fetch error:", err));
  }, []);

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-black uppercase text-white flex items-center gap-3">
            <History className="text-emerald-500" /> Operational History
          </h1>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Verified and archived maintenance logs</p>
        </header>

        <div className="bg-slate-900/20 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="p-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Unit ID</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Type</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Resolution</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {closedEvents.map((event) => (
                <tr key={event.id} className="hover:bg-slate-800/20 transition-colors">
                  {/* Now 'wagon_id', 'type', 'comment', etc. are recognized! */}
                  <td className="p-4 font-mono text-xs font-bold text-blue-400">{event.wagon_id}</td>
                  <td className="p-4 font-bold text-white uppercase text-xs">{event.type}</td>
                  <td className="p-4">
                    <p className="text-xs text-slate-400 line-clamp-1 italic">
                      {event.comment || "No notes provided"}
                    </p>
                    <span className="text-[9px] text-slate-500 uppercase">
                      {event.resolved_at || "N/A"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-emerald-500">
                      <ShieldCheck size={14} />
                      <span className="text-[10px] font-black uppercase">Archived</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {closedEvents.length === 0 && (
            <div className="p-12 text-center text-slate-600 font-mono text-xs uppercase tracking-[0.3em]">
              No archived records found
            </div>
          )}
        </div>
      </main>
    </div>
  );
}