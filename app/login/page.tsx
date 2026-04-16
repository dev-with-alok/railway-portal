"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Terminal, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'rail2024') {
      // Set a cookie so the middleware can see it
      document.cookie = "auth=true; path=/; max-age=86400"; // Expires in 24h
      router.push('/');
    } else {
      setError('ACCESS DENIED');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent">
      {/* Visual background grid */}
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Decorative elements */}
        <div className="absolute -top-12 -left-4 flex items-center gap-2 text-blue-500/50">
          <Terminal size={16} />
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase">Secure Terminal v4.1</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-8">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 mx-auto mb-4 border border-blue-400/20">
              <Lock className="text-white" size={32} />
            </div>
            <h1 className="text-xl font-black text-white uppercase tracking-tighter">Railway Monitoring</h1>
            <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mt-1">Authorized Personnel Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operator ID</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
                  placeholder="USERNAME"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-3 animate-shake">
                <ShieldAlert className="text-red-500 shrink-0" size={16} />
                <span className="text-[10px] font-bold text-red-500 tracking-wider">{error}</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest py-4 rounded-lg shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group"
            >
              Initialize Session
              <div className="w-1.5 h-1.5 rounded-full bg-white group-hover:animate-ping" />
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center mt-6 text-slate-600 text-[9px] uppercase tracking-widest font-mono">
          © 2026 Railway Infrastructure Security Command
        </p>
      </div>
    </div>
  );
}