"use client";

import React, { useState } from 'react';
import { Users, Shield, ShieldCheck, UserPlus, Trash2, Mail } from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'Administrator' | 'Operator' | 'Maintenance';
  email: string;
  lastActive: string;
  status: 'Online' | 'Offline';
}

const UsersPage = () => {
  const [users] = useState<User[]>([
    { id: '1', name: 'Operator 042', role: 'Operator', email: 'op042@rail.sys', lastActive: 'Now', status: 'Online' },
    { id: '2', name: 'Admin Alpha', role: 'Administrator', email: 'admin@rail.sys', lastActive: '2h ago', status: 'Offline' },
    { id: '3', name: 'Tech Support', role: 'Maintenance', email: 'maint@rail.sys', lastActive: '5m ago', status: 'Online' },
  ]);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white">Personnel Management</h1>
          <p className="text-slate-500 text-xs font-mono">Terminal Access Control & Permission Levels</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20">
          <UserPlus size={16} />
          Register New User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
          <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Total Personnel</span>
          <div className="text-2xl font-black text-white">{users.length}</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
          <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Active Now</span>
          <div className="text-2xl font-black text-emerald-500">2</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
          <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Admin Access</span>
          <div className="text-2xl font-black text-blue-400">1</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 border-b border-slate-700">
              <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Identity</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Security Level</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-400 font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{user.name}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Mail size={10} /> {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {user.role === 'Administrator' ? (
                      <ShieldCheck size={14} className="text-blue-400" />
                    ) : (
                      <Shield size={14} className="text-slate-500" />
                    )}
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${user.role === 'Administrator' ? 'text-blue-400' : 'text-slate-400'}`}>
                      {user.role}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                    <span className={`text-[10px] font-mono ${user.status === 'Online' ? 'text-emerald-500' : 'text-slate-500'}`}>
                      {user.status === 'Online' ? 'CONNECTED' : `LAST ACTIVE: ${user.lastActive}`}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-500 hover:text-red-400 transition-colors p-2">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="flex items-center gap-2 text-slate-600">
        <ShieldCheck size={14} />
        <span className="text-[9px] font-bold uppercase tracking-[0.2em]">End-to-End Encryption Enabled for All User Logs</span>
      </div>
    </div>
  );
};

export default UsersPage;