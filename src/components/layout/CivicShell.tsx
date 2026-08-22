'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Map as MapIcon,
  PlusCircle,
  Shield,
  Clock,
  Radio,
  FileText,
  Sparkles,
  Database,
  Cpu
} from 'lucide-react';
import { isClaudeConfigured } from '@/lib/ai/claude';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export function CivicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'Intelligence Dashboard', href: '/', icon: Activity },
    { label: 'Citizen Report', href: '/report', icon: PlusCircle },
    { label: 'Tactical Map', href: '/map', icon: MapIcon },
    { label: 'Active Incident File', href: '/incidents/inc-001', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Topmost Telemetry & System Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0A0E18]/90 backdrop-blur-xl">
        {/* System Bar */}
        <div className="border-b border-slate-800/40 bg-slate-950/60 px-4 py-1.5 text-[11px] font-mono text-slate-400">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold tracking-wider">MUNICIPAL GRID: ACTIVE</span>
              </div>
              <span className="text-slate-700">|</span>
              <span className="text-slate-400 hidden sm:inline">
                BHOPAL MUNICIPAL CORPORATION • ZONE 01–14
              </span>
              <span className="text-slate-700 hidden sm:inline">|</span>
              <span className="text-teal-400 hidden md:inline">
                BHOJTAL WETLAND SENSORS: 85 NODES SYNCED
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Claude & Supabase readiness chips */}
              <div className="hidden lg:flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded bg-purple-950/50 border border-purple-800/40 px-2 py-0.5 text-[10px] text-purple-300">
                  <Cpu className="h-3 w-3" />
                  Claude 3.5 Sonnet: {isClaudeConfigured ? 'Ready' : 'Local Ops'}
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 text-[10px] text-emerald-300">
                  <Database className="h-3 w-3" />
                  Supabase: {isSupabaseConfigured ? 'Connected' : 'Local Storage'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                <span>{timeString || 'LIVE'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Navbar */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950 to-slate-900 shadow-lg shadow-cyan-950/50 group-hover:border-cyan-400 transition-colors">
              <Shield className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold tracking-tight text-slate-100 group-hover:text-cyan-300 transition-colors">
                  BHOPAL CIVIC MEMORY
                </span>
                <span className="rounded bg-cyan-950 border border-cyan-800/60 px-1.5 py-0.2 text-[10px] font-mono font-bold text-cyan-400">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Civic Intelligence & Urban Incident Repository
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-mono font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800/90 text-cyan-300 border border-cyan-500/30 shadow-inner'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/report"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/60 bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2 text-xs font-mono font-bold text-black shadow-lg shadow-cyan-950/60 hover:from-cyan-400 hover:to-teal-400 transition-all hover:scale-105"
            >
              <PlusCircle className="h-4 w-4" />
              File Citizen Report
            </Link>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around border-t border-slate-800/60 bg-slate-950/90 px-2 py-2 text-xs font-mono">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 p-1.5 ${
                  isActive ? 'text-cyan-400 font-bold' : 'text-slate-400'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-[10px]">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 pb-16">{children}</main>

      {/* Civic Command Footer */}
      <footer className="border-t border-slate-800/80 bg-[#06080F] py-8 text-xs font-mono text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 text-slate-400">
            <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span>Bhopal Civic Memory Protocol • Municipal Ward Operations</span>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <span>Bhoj Wetland Ramsar Site #1206</span>
            <span>•</span>
            <span>Bhopal Smart City Development (BSCDCL)</span>
            <span>•</span>
            <span className="text-cyan-400">Claude AI & Supabase Enabled</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
