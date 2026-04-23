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
  // Data State
  const [allOpenEvents, setAllOpenEvents] = useState<AnomalyEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AnomalyEvent | null>(null);
  
  // Status State
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  // Input State
  const [comment, setComment] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // --- FIXED FETCH LOGIC WITH ERROR HANDLING ---
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/anomalies');
      
      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }

      const data: AnomalyEvent[] = await res.json();
      
      // Filter and Sort: Newest to Oldest
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

  // Pagination Calculation
  const totalPages = Math.ceil(allOpenEvents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allOpenEvents.slice(indexOfFirstItem, indexOfLastItem);

  const handleResolve = async () => {
    if (!selectedEvent || isSubmitting) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("comment", comment);
    if (file) formData.append("file", file);

    try {
      const res = await fetch(`http://127.0.0.1:8000/anomalies/${selectedEvent.id}/resolve`, {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) throw new Error("Resolution submission failed");
      
      window.location.reload();
    } catch (err) {
      console.error("Resolution failed:", err);
      alert("Failed to submit resolution. Check your network connection.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto flex flex-col">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black uppercase text-white flex items-center gap-3">
              <Wrench className="text-blue-500" /> Pending Repairs
            </h1>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-1">
                {isLoading ? "Syncing with API..." : `Showing ${allOpenEvents.length > 0 ? indexOfFirstItem + 1 : 0} - ${Math.min(indexOfLastItem, allOpenEvents.length)} of ${allOpenEvents.length} records`}
            </p>
          </div>

          {/* Page Size Selector - Only show if not loading/error */}
          {!isLoading && !fetchError && (
            <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 p-1 rounded-lg">
              <span className="text-[10px] font-black text-slate-500 uppercase px-2 flex items-center gap-1">
                <ListFilter size={12} /> View:
              </span>
              {[5, 10, 20].map((num) => (
                <button
                  key={num}
                  onClick={() => { setItemsPerPage(num); setCurrentPage(1); }}
                  className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                    itemsPerPage === num ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* --- DYNAMIC CONTENT AREA --- */}
        <div className="flex-1">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center border border-slate-800 rounded-2xl bg-slate-900/20">
              <RefreshCcw className="text-blue-500 animate-spin mb-4" size={32} />
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest italic">Fetching Telemetry...</span>
            </div>
          ) : fetchError ? (
            <div className="h-64 flex flex-col items-center justify-center border border-red-900/30 rounded-2xl bg-red-500/5">
              <AlertCircle className="text-red-500 mb-4" size={40} />
              <h2 className="text-white font-bold uppercase mb-1">API Link Failed</h2>
              <p className="text-slate-500 text-[10px] mb-6 font-mono px-12 text-center">{fetchError}</p>
              <button 
                onClick={fetchData}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border 
                          border-slate-700 font-bold text-[10px] uppercase tracking-widest transition-all"
              >
                <Database size={14} /> Retry Connection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 content-start">
              {currentItems.map(event => (
                <div key={event.id} className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex items-center justify-between 
                      border-l-4 border-l-amber-600 hover:bg-slate-900/60 transition-colors group">
                  <div className="flex items-center gap-6">
                    <img 
                      src={event.image_url} 
                      className="w-24 h-24 object-cover rounded border border-slate-700 shadow-xl" 
                      alt="anomaly"
                      onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image")}
                    />
                    <div>
                      <span className="text-amber-500 font-black text-[10px] uppercase tracking-widest">Action Required</span>
                      <h3 className="text-lg font-bold text-white uppercase tracking-tight">{event.type}</h3>
                      <p className="text-xs text-slate-500 font-mono">
                        Wagon: <span className="text-blue-400 font-bold">{event.wagon_id}</span> | Detected: {event.timestamp}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedEvent(event)}
                    className="bg-slate-800 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-xs font-black uppercase tracking-widest 
                            transition-all border border-slate-700 hover:border-blue-400 shadow-lg"
                  >
                    Review & Resolve
                  </button>
                </div>
              ))}

              {allOpenEvents.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-2xl">
                  <p className="text-slate-600 font-mono text-xs uppercase tracking-[0.3em]">No pending anomalies detected</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!isLoading && !fetchError && allOpenEvents.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-4 border-t border-slate-800 pt-6">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-20 disabled:cursor-not-allowed 
                    hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex gap-2 font-mono">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                    currentPage === i + 1 
                      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                      : 'bg-slate-900 border border-slate-800 text-slate-500 hover:text-white hover:border-slate-600'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </button>
              ))}
            </div>

            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-20 disabled:cursor-not-allowed 
                    hover:bg-slate-800 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </main>

      {/* Resolve Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
              <h2 className="font-black uppercase tracking-tight flex items-center gap-2">
                <span className="text-blue-500">Report:</span> {selectedEvent.wagon_id}
              </h2>
              <button 
                onClick={() => setSelectedEvent(null)} 
                className="text-slate-500 hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>
            <div className="p-8 grid grid-cols-2 gap-8">
              <div>
                <span className="text-[10px] font-black text-slate-500 uppercase block mb-2 tracking-widest">Original Evidence</span>
                <img src={selectedEvent.image_url} className="rounded-lg border border-slate-800 w-full shadow-2xl" alt="original" />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-2 tracking-widest">Maintenance Notes</label>
                  <textarea 
                    className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm focus:border-blue-500 outline-none 
                            transition-colors text-white"
                    placeholder="Provide details on the repair action..."
                    onChange={(e) => setComment(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-2 tracking-widest">Resolution Media</label>
                  <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)} 
                    disabled={isSubmitting}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] 
                          file:font-black file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 cursor-pointer" 
                  />
                </div>
                <button 
                  onClick={handleResolve}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-black uppercase tracking-widest 
                        rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCcw className="animate-spin" size={18} /> Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} /> Archive to History
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}