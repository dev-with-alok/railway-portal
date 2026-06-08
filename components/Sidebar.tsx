"use client";

import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Radio, 
  History, 
  Wrench, 
  Settings, 
  Users, 
  TrainFront,
  Bell,
  X 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { io } from 'socket.io-client';

interface SidebarProps {
  isCollapsed?: boolean;
}

const Sidebar = ({ isCollapsed = false }: SidebarProps) => {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  // 1. Listen for new anomalies via Socket.io
  useEffect(() => {
    const socket = io('http://127.0.0.1:8000');

    socket.on('new_anomaly', () => {
      if (window.location.pathname !== '/maintenance') {
        setUnreadCount(prev => prev + 1);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 2. Reset count when user visits the maintenance page
  useEffect(() => {
    if (pathname === '/maintenance') {
      setUnreadCount(0);
    }
  }, [pathname]);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/' },
    { icon: <Radio size={20} />, label: 'Live View', href: '/live' },
    { icon: <History size={20} />, label: 'History', href: '/history' },
    { icon: <Wrench size={20} />, label: 'Maintenance', href: '/maintenance' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/settings' },
    { icon: <Users size={20} />, label: 'Users', href: '/users' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = '/login';
  };

  return (
    <aside 
      className={`h-full bg-[#040d21] border-r border-slate-900 flex flex-col overflow-hidden w-full transition-all duration-300`}
    >
      {/* Portal Branding Header Section */}
      <div 
        className={`p-4 flex items-center border-b border-slate-950 bg-[#0b1528]/40 h-16 shrink-0 transition-all ${
          isCollapsed ? 'justify-center px-2' : 'justify-between px-5'
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Logo Badge Container */}
          <div className="w-9 h-9 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-cyan-950 shrink-0 border border-cyan-400/20">
            <TrainFront className="text-cyan-100" size={20} />
          </div>
          
          {/* Text Branding Group - Hidden on collapse */}
          {!isCollapsed && (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <h1 className="text-sm font-sans font-normal tracking-[0.08em] text-[#a5f3fc] drop-shadow-[0_0_8px_rgba(6,182,212,0.4)] leading-none">
                AIRIRO
              </h1>
              <span className="text-[7px] font-mono font-bold tracking-widest text-slate-500 uppercase mt-0.5 block">
                Control Node
              </span>
            </div>
          )}
        </div>

        {/* CLICKABLE NOTIFICATION BELL - Hidden on collapse to optimize tiny bar real-estate */}
        {!isCollapsed && (
          <Link 
            href="/maintenance" 
            className="relative group p-1.5 hover:bg-slate-900 rounded-lg border border-transparent hover:border-slate-800 transition-all animate-in fade-in duration-200 shrink-0"
            title={unreadCount > 0 ? `View ${unreadCount} new alerts` : 'No new alerts'}
          >
            <Bell 
              size={16} 
              className={`transition-colors duration-500 ${
                unreadCount > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-500 group-hover:text-cyan-400'
              }`} 
            />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[8px] font-mono font-bold px-1 rounded-full border border-[#040d21]">
                {unreadCount}
              </span>
            )}
          </Link>
        )}
      </div>

      {/* Navigation Links List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={`
                flex items-center rounded-lg transition-all duration-150 group h-11 border
                ${isCollapsed ? 'justify-center p-0' : 'px-4 py-2.5 gap-4'}
                ${isActive 
                  ? 'bg-cyan-950/40 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.06),inset_0_0_8px_rgba(6,182,212,0.05)]' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/60 border-transparent'}
              `}
            >
              {/* Navigation Icon */}
              <span className={`shrink-0 ${isActive ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]' : 'text-slate-500 group-hover:text-cyan-400/80 transition-colors'}`}>
                {item.icon}
              </span>
              
              {/* Navigation Label Text - Blends out cleanly */}
              {!isCollapsed && (
                <span className="text-[11px] font-sans font-semibold uppercase tracking-wider animate-in fade-in slide-in-from-left-2 duration-200 truncate">
                  {item.label}
                </span>
              )}
              
              {/* Active Marker Dot */}
              {isActive && !isCollapsed && (
                <div className="ml-auto w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-in fade-in scale-in duration-200" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Operator Session Section */}
      <div className="p-3 border-t border-slate-950 bg-[#0b1528]/20 shrink-0 min-h-14 flex items-center">
        <div className={`flex items-center w-full ${isCollapsed ? 'justify-center' : 'justify-between px-1'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Operator Thumbnail Circle */}
            <div className="w-7 h-7 rounded-full bg-slate-950 flex items-center justify-center border border-slate-800 shrink-0">
              <Users size={13} className="text-slate-400" />
            </div>
            
            {/* Session Info - Hidden on collapse */}
            {!isCollapsed && (
              <div className="flex flex-col animate-in fade-in duration-200 overflow-hidden">
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wide truncate">Operator 042</span>
                <span className="text-[8px] text-cyan-400 font-mono tracking-tight italic flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                  SYNC_ACTIVE
                </span>
              </div>
            )}
          </div>
          
          {/* Logout Action Trigger Button - Hidden on collapse */}
          {!isCollapsed && (
            <button 
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-400 hover:bg-red-950/20 transition-all p-1.5 rounded-lg border border-transparent hover:border-red-500/10 animate-in fade-in duration-200 shrink-0"
              title="Exit System"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;