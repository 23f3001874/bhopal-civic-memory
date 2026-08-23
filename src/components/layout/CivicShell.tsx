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
  FileText
} from 'lucide-react';

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
          minute: '2-digit'
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const navItems = [
    { label: 'Map', href: '/map' },
    { label: 'Intelligence Feed', href: '/#intelligence-feed' },
    { label: 'Report Issue', href: '/report' },
    { label: 'About', href: '/#about' },
    { label: 'How It Works', href: '/#how-it-works' }
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-white">
      {/* Refined Dark Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#070B14]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          {/* Logo & Brand matching design */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700/80 bg-slate-900 text-sky-400 group-hover:border-sky-500/50 transition-colors shadow-sm">
              {/* Taj-ul-Masajid / Bhopal Arch Landmark Emblem SVG */}
              <svg className="h-5 w-5 text-slate-200 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 21h18M4 21V10l8-6 8 6v11M9 21v-6a3 3 0 0 1 6 0v6" />
                <path d="M12 4v2M7 13v3M17 13v3" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold tracking-tight text-white group-hover:text-sky-300 transition-colors">
                  Bhopal Civic Memory
                </span>
              </div>
              <p className="text-[11px] text-amber-300/80 font-medium tracking-wide">
                Yaad rakhein. Behtar banaayein.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`transition-colors text-xs tracking-wide ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Header: Language Switcher & Report CTA */}
          <div className="flex items-center gap-3">
            {/* Language Switch Pill */}
            <button
              onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
              className="rounded-full border border-slate-700/80 bg-slate-900/90 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-500 hover:text-white transition-colors"
              title="Toggle Hindi / English localization"
            >
              {language === 'en' ? 'हिंदी / English' : 'English / हिंदी'}
            </button>

            <Link
              href="/report"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors shadow-sm"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Report</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center justify-around border-t border-slate-800/80 bg-slate-950/90 px-2 py-2 text-xs">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="p-1.5 text-slate-300 hover:text-white text-[11px]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-16">{children}</main>

      {/* Clean Minimalist Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070A11] py-6 text-xs text-slate-500">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
            <span>Bhopal Civic Memory Protocol • Municipal Operations</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <span>Bhoj Wetland Ramsar Site #1206</span>
            <span>•</span>
            <span>Bhopal Municipal Corporation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
