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

const Sidebar = () => {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  // 1. Listen for new anomalies via Socket.io
  useEffect(() => {
    const socket = io('http://127.0.0.1:8000');

    socket.on('new_anomaly', () => {
      // Only increment if we aren't currently looking at the maintenance page
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
    <aside className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col shrink-0 z-50">
      {/* Portal Branding & Alert Bell */}
      <div className="p-6 flex items-center justify-between border-b border-slate-800/50 bg-[#1e293b]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <TrainFront className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-[10px] font-black uppercase tracking-[0.15em] leading-tight text-white">
              Railway <br />
              <span className="text-blue-400">Monitoring</span>
            </h1>
          </div>
        </div>

        {/* CLICKABLE NOTIFICATION BELL */}
        <Link 
          href="/maintenance" 
          className="relative group p-2 hover:bg-slate-800/50 rounded-full transition-all"
          title={unreadCount > 0 ? `View ${unreadCount} new alerts` : 'No new alerts'}
        >
          <Bell 
            size={18} 
            className={`transition-colors duration-500 ${unreadCount > 0 ? 'text-amber-500 animate-bounce' : 'text-slate-600 group-hover:text-slate-400'}`} 
          />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#0f172a] animate-pulse">
              {unreadCount}
            </span>
          )}
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`
                flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group
                ${isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent'}
              `}
            >
              <span className={`${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
                {item.icon}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">
                {item.label}
              </span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Session Section */}
      <div className="p-4 border-t border-slate-800 bg-[#1e293b]/10">
        <div className="flex items-center justify-between px-2 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
              <Users size={16} className="text-slate-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-300 uppercase">Operator 042</span>
              <span className="text-[9px] text-emerald-500 font-mono italic">Session Active</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded-md hover:bg-red-500/10"
            title="Exit System"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;