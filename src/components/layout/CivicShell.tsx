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
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] flex flex-col font-sans selection:bg-[#007CF0]/25 selection:text-white">
      {/* Minimal Floating Modern Navigation Bar */}
      {/* Modern Navigation Bar with dynamic style matching page context */}
      <header
        className={`sticky top-0 z-50 h-16 border-b transition-all ${
          pathname === '/'
            ? 'border-[#171717]/10 bg-[#F8F3EC]/85 backdrop-blur-xl text-[#171717]'
            : 'border-white/[0.08] bg-[#05070B]/80 backdrop-blur-xl text-[#F5F7FA]'
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${
                pathname === '/'
                  ? 'border-[#171717]/15 bg-white/60 text-[#171717] group-hover:border-[#171717]/40'
                  : 'border-white/[0.08] bg-white/[0.03] text-[#F5F7FA] group-hover:border-[#007CF0]/50 group-hover:bg-[#007CF0]/10'
              }`}
            >
              {/* Bhopal Arch Landmark Emblem SVG */}
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M3 21h18M4 21V10l8-6 8 6v11M9 21v-6a3 3 0 0 1 6 0v6" />
                <path d="M12 4v2M7 13v3M17 13v3" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-semibold tracking-tight transition-colors ${
                    pathname === '/' ? 'text-[#171717]' : 'text-[#F5F7FA] group-hover:text-white'
                  }`}
                >
                  Bhopal Civic Memory
                </span>
                <span
                  className={`hidden sm:inline-block font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                    pathname === '/'
                      ? 'bg-[#171717]/5 border-[#171717]/15 text-[#171717]/70'
                      : 'bg-white/[0.04] border-white/[0.08] text-[#A7AFBD]'
                  }`}
                >
                  v2.0
                </span>
              </div>
              <p
                className={`text-[10px] font-normal tracking-normal hidden sm:block ${
                  pathname === '/' ? 'text-[#171717]/60' : 'text-[#687386]'
                }`}
              >
                {t('nav_tagline', 'Yaad rakhein. Behtar banaayein.')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-1 text-xs tracking-normal transition-colors ${
                    pathname === '/'
                      ? isActive
                        ? 'text-[#171717] font-semibold'
                        : 'text-[#171717]/70 hover:text-[#171717]'
                      : isActive
                      ? 'text-[#F5F7FA] font-medium'
                      : 'text-[#A7AFBD] hover:text-[#F5F7FA]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#171717] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Header: Language Switcher & Report CTA */}
          <div className="flex items-center gap-3">
            {/* Language Switch Pill */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all flex items-center gap-1.5 ${
                pathname === '/'
                  ? 'border-[#171717]/15 bg-white/50 text-[#171717]/80 hover:bg-white/80'
                  : 'border-white/[0.08] bg-white/[0.03] text-[#A7AFBD] hover:border-white/[0.15] hover:text-[#F5F7FA]'
              }`}
              title="Toggle Hindi / English localization"
            >
              <span className={language === 'hi' ? 'font-semibold text-[#527F7B]' : 'opacity-50'}>हिंदी</span>
              <span className="opacity-30">/</span>
              <span className={language === 'en' ? 'font-semibold text-[#527F7B]' : 'opacity-50'}>EN</span>
            </button>

            <Link
              href="/report"
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium shadow-sm transition-all ${
                pathname === '/'
                  ? 'bg-[#171717] text-[#F8F3EC] hover:bg-[#333333]'
                  : 'btn-primary text-white'
              }`}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>{t('nav_report_btn', 'Report Issue')}</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`flex md:hidden items-center justify-around border-t px-2 py-2 text-xs ${
            pathname === '/'
              ? 'border-[#171717]/10 bg-[#F8F3EC]/95 text-[#171717]'
              : 'border-white/[0.06] bg-[#05070B]/95 text-[#A7AFBD]'
          }`}
        >
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`p-1.5 text-[11px] ${
                pathname === '/' ? 'text-[#171717]/80 hover:text-[#171717]' : 'text-[#A7AFBD] hover:text-[#F5F7FA]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Clean Minimalist Subpage Footer (only on non-landing pages) */}
      {pathname !== '/' && (
        <footer className="border-t border-white/[0.06] bg-[#05070B] py-8 text-xs text-[#687386]">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
            <div className="flex items-center gap-2.5 text-[#A7AFBD]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00DFD8] inline-block shadow-[0_0_6px_#00DFD8]" />
              <span className="text-xs">Bhopal Civic Memory • Epistemic City Intelligence</span>
            </div>
            <div className="flex items-center gap-4 text-[#687386] font-mono text-[11px]">
              <span>Ramsar Site #1206</span>
              <span>•</span>
              <span>CPCB Baseline 2026</span>
              <span>•</span>
              <span>85 BMC Zones</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
