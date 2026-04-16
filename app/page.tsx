"use client";

import Sidebar from '@/components/Sidebar';
import { Activity, ShieldCheck, TrainFront, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function Overview() {
  const stats = [
    { label: 'Total Scans', value: '1,284', icon: <TrainFront size={20} className="text-blue-400" /> },
    { label: 'Safety Index', value: '98.2%', icon: <ShieldCheck size={20} className="text-emerald-500" /> },
    { label: 'Active Alerts', value: '3', icon: <AlertTriangle size={20} className="text-amber-500" /> },
    { label: 'System Load', value: '24%', icon: <Activity size={20} className="text-blue-400" /> },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">System Overview</h1>
            <p className="text-slate-500 text-sm font-mono mt-1">Railway Infrastructure Health & Monitoring Command</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">{stat.icon}</div>
                </div>
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="bg-blue-600 rounded-2xl p-8 flex justify-between items-center shadow-2xl shadow-blue-900/20 border border-blue-400/20">
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Ready for live inspection?</h2>
              <p className="text-blue-100/70 text-sm mt-1">Switch to Live View to monitor camera streams and OCR detections.</p>
            </div>
            <Link 
              href="/live" 
              className="px-6 py-3 bg-white text-blue-600 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-blue-50 transition-all shadow-xl"
            >
              Initialize Live View
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}