"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldAlert } from 'lucide-react';
import Image from 'next/image';

// Explicit static module asset import
import loginBgImage from '../../public/ai_riro.jpeg';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'rail2024') {
      document.cookie = "auth=true; path=/; max-age=86400"; // Expires in 24h
      router.push('/');
    } else {
      setError('ACCESS DENIED // INVALID_CREDENTIALS');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020813] flex text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-hidden">
      
      {/* LEFT HALF: IMMERSIVE HERO ARTWORK */}
      <div className="hidden lg:block lg:w-1/2 relative bg-[#01040a] border-r border-slate-900/40">
        <Image 
          src={loginBgImage} 
          alt="AIRIRO Railway Intelligence Core" 
          fill
          priority
          sizes="50vw"
          className="object-cover object-center opacity-85 filter contrast-105 brightness-95"
        />
        {/* Color integration overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#020813]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020813]/40 via-transparent to-transparent" />
        
        {/* Subtle Tech Watermark */}
        <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-1 font-mono pointer-events-none">
          <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-black tracking-[0.25em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            SYSTEM_STATUS: ONLINE
          </div>
          <span className="text-slate-400/60 text-[9px] uppercase tracking-wider">
            YOLOv8 Core Node Architecture Framework
          </span>
        </div>
      </div>

      {/* RIGHT HALF: SECURE INTERACTIVE PORTAL ACCESS */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-10 md:p-12 bg-[#020a17] bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.05)_0%,_transparent_75%)] relative overflow-y-auto">
        
        {/* MATCHED PANEL STRUCTURE FROM THE MOCKUP IMAGE */}
        <div className="w-full max-w-[380px] bg-[#0c1624]/60 backdrop-blur-xl rounded-[24px] border border-cyan-500/30 px-8 py-10 shadow-[0_0_40px_rgba(6,182,212,0.15),inset_0_0_20px_rgba(6,182,212,0.05)] text-center relative z-10">
          
          {/* Logo Brand Title */}
          <h1 className="text-4xl font-sans font-normal tracking-[0.08em] text-[#a5f3fc] drop-shadow-[0_0_12px_rgba(6,182,212,0.6)] mb-0.5">
            AIRIRO
          </h1>
          
          {/* Subtitle Label */}
          <p className="text-slate-400 font-sans text-[11px] tracking-wide mb-8">
            Engineering a Frictionless Future
          </p>
          
          {/* Section Heading Tag */}
          <h2 className="text-sm font-sans font-semibold text-white tracking-[0.18em] uppercase mb-7">
            SECURE PORTAL ACCESS
          </h2>

          {/* Form Processing Shell */}
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            
            {/* Operator Identifier Input Block */}
            <div className="relative">
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#111e2f]/70 border border-cyan-500/40 rounded-xl py-3.5 px-4 text-base text-slate-100 placeholder-slate-500 font-sans focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(6,182,212,0.25)] transition-all"
                placeholder="Username"
                required
              />
            </div>

            {/* Access Token Input Block */}
            <div className="relative">
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111e2f]/50 border border-slate-700 rounded-xl py-3.5 px-4 text-base text-slate-100 placeholder-slate-500 font-sans focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_12px_rgba(6,182,212,0.25)] transition-all"
                placeholder="Password"
                required
              />
            </div>

            {/* Application Error Log Display */}
            {error && (
              <div className="bg-red-950/40 border border-red-500/30 p-2.5 rounded-xl flex items-center gap-2.5 animate-pulse">
                <ShieldAlert className="text-red-400 shrink-0" size={14} />
                <span className="text-[10px] font-mono font-bold text-red-400 tracking-wider uppercase">{error}</span>
              </div>
            )}

            {/* MATCHED GRADIENT BUTTON STRUCTURE WITH BOTTOM CYAN GLOW REVEAL */}
            <div className="pt-2 relative group">
              <button 
                type="submit"
                className="w-full bg-gradient-to-b from-[#1b587a] to-[#12364c] hover:from-[#226c96] hover:to-[#174663] text-[#e0f2fe] font-sans text-base font-semibold py-3 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all flex items-center justify-center gap-2.5 border border-cyan-400/40 active:scale-[0.99]"
              >
                <Lock size={16} className="text-cyan-300 drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]" />
                <span>Sign In</span>
              </button>
              {/* Bottom Edge Specular Intense Glow Line Accent directly underneath the button */}
              <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-cyan-400 opacity-60 blur-[2px] pointer-events-none group-hover:opacity-100 transition-opacity" />
            </div>
          </form>

          {/* Core Menu Option Access Controls */}
          <div className="mt-8 flex flex-col gap-2.5 text-xs font-sans">
            <button type="button" className="text-cyan-400/80 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/30 transition-colors">
              Login with SSO
            </button>
            <button type="button" className="text-cyan-400/80 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/30 transition-colors">
              Contact Administrator
            </button>
          </div>
          
        </div>
        
      </div>
    </div>
  );
}