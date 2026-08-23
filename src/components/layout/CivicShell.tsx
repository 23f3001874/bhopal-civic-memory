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

import { useCivic } from '@/lib/context/CivicContext';

export function CivicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { language, setLanguage, t } = useCivic();
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

  const navItems = [
    { label: t('nav_map', 'Map'), href: '/map' },
    { label: t('nav_feed', 'Intelligence Feed'), href: '/#intelligence-feed' },
    { label: t('nav_report', 'Report Issue'), href: '/report' },
    { label: t('nav_about', 'About'), href: '/#about' },
    { label: t('nav_how', 'How It Works'), href: '/#how-it-works' }
  ];

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-white">
      {/* Refined Dark Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-zinc-850 bg-black/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          {/* Logo & Brand matching design */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-orange-500 group-hover:border-orange-500/50 transition-colors shadow-sm">
              {/* Taj-ul-Masajid / Bhopal Arch Landmark Emblem SVG */}
              <svg className="h-5 w-5 text-orange-400 group-hover:text-orange-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 21h18M4 21V10l8-6 8 6v11M9 21v-6a3 3 0 0 1 6 0v6" />
                <path d="M12 4v2M7 13v3M17 13v3" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white group-hover:text-orange-400 transition-colors">
                  Bhopal Civic Memory
                </span>
              </div>
              <p className="text-[11px] text-orange-400/90 font-medium tracking-wide">
                {t('nav_tagline', 'Yaad rakhein. Behtar banaayein.')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors text-xs tracking-wide ${
                    isActive
                      ? 'text-orange-400 font-semibold'
                      : 'text-zinc-300 hover:text-white'
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
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="rounded-full border border-zinc-800 bg-zinc-950 px-3.5 py-1.5 text-xs font-medium text-zinc-200 hover:border-orange-500/50 hover:text-white transition-colors flex items-center gap-1.5 shadow-sm"
              title="Toggle Hindi / English localization"
            >
              <span className={language === 'hi' ? 'font-bold text-orange-400' : 'text-zinc-400'}>हिंदी</span>
              <span className="text-zinc-700">/</span>
              <span className={language === 'en' ? 'font-bold text-orange-400' : 'text-zinc-400'}>English</span>
            </button>

            <Link
              href="/report"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600 transition-all shadow-md shadow-orange-500/20 hover:shadow-orange-500/35"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>{t('nav_report_btn', 'Report')}</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center justify-around border-t border-zinc-850 bg-black/95 px-2 py-2 text-xs">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="p-1.5 text-zinc-300 hover:text-orange-400 text-[11px]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-16">{children}</main>

      {/* Clean Minimalist Footer */}
      <footer className="border-t border-zinc-850 bg-black py-6 text-xs text-zinc-500">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-orange-500 inline-block" />
            <span>Bhopal Civic Memory Protocol • Municipal Operations</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400 text-xs">
            <span>Bhoj Wetland Ramsar Site #1206</span>
            <span>•</span>
            <span>Bhopal Municipal Corporation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
