'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCivic } from '@/lib/context/CivicContext';
import { IncidentCard } from '@/components/ui/IncidentCard';
import { CivicMapCanvas } from '@/components/ui/CivicMapCanvas';
import {
  Send,
  BarChart3,
  Droplets,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Layers,
  Search,
  SlidersHorizontal,
  Compass,
  Cpu,
  Eye,
  FileCheck2,
  MapPin,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { IncidentCategory } from '@/types/incident';

// Precisely verified Bhopal landmark coordinates on satellite map canvas
const MAP_HOTSPOTS = [
  {
    id: 'bhojtal',
    label: 'Bhojtal',
    subtext: 'Ramsar Wetland Site #1206 • Upper Lake Catchment',
    telemetry: 'Water Quality Class B • DO: 6.4 mg/L',
    status: 'monitored',
    color: 'emerald',
    top: '46%',
    left: '58%'
  },
  {
    id: 'kolar',
    label: 'KOLAR',
    subtext: 'Ward 80-84 • Kolar Road Corridor',
    telemetry: '2 Active Incidents • Runoff Silt Moderate',
    status: 'active',
    color: 'blue',
    top: '18%',
    left: '46%'
  },
  {
    id: 'habibganj',
    label: 'HABIBGANJ',
    subtext: 'Zone 10 • Transit & Sump Hub',
    telemetry: 'All 3 Sump Stations Operational',
    status: 'monitored',
    color: 'blue',
    top: '20%',
    left: '76%'
  },
  {
    id: 'ttnagar',
    label: 'TT NAGAR',
    subtext: 'Zone 8 • Commercial Arterial',
    telemetry: 'Recurrence Risk Flagged • Sargam Cinema',
    status: 'warning',
    color: 'emerald',
    top: '32%',
    left: '50%'
  },
  {
    id: 'lalghati',
    label: 'LALGHATI',
    subtext: 'VIP Road Catchment • Ward 08',
    telemetry: '1 Pavement Fissure Case Logged',
    status: 'critical',
    color: 'red',
    top: '38%',
    left: '42%'
  },
  {
    id: 'govindpura',
    label: 'GOVINDPURA',
    subtext: 'Industrial Zone • Patra Nallah Outfall',
    telemetry: 'Trash Interceptor Inspection Due',
    status: 'warning',
    color: 'blue',
    top: '67%',
    left: '52%'
  },
  {
    id: 'kasturba',
    label: 'KASTURBA NAGAR',
    subtext: 'Zone 9 • Underpass Sump Hub',
    telemetry: 'Pre-Monsoon Suction Jetting Logged',
    status: 'monitored',
    color: 'blue',
    top: '36%',
    left: '84%'
  },
  {
    id: 'bhel',
    label: 'BHEL',
    subtext: 'Eastern Industrial Township',
    telemetry: 'Stormwater Inlets Clear • 0 Overflows',
    status: 'monitored',
    color: 'blue',
    top: '52%',
    left: '92%'
  },
  {
    id: 'govinrod',
    label: 'GOVINROD',
    subtext: 'South-Eastern Canal Network',
    telemetry: 'Feeder Canal Water Level Normal',
    status: 'monitored',
    color: 'emerald',
    top: '67%',
    left: '74%'
  }
];

export default function DashboardPage() {
  const {
    incidents,
    wards,
    metrics,
    selectedWardId,
    setSelectedWardId,
    selectedCategory,
    setSelectedCategory,
    language,
    t
  } = useCivic();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string | 'all'>('all');
  const [activeHotspot, setActiveHotspot] = useState<typeof MAP_HOTSPOTS[0] | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const categories: { label: string; value: IncidentCategory | 'all' }[] = [
    { label: language === 'hi' ? 'सभी क्षेत्र' : 'All Domains', value: 'all' },
    { label: language === 'hi' ? 'झील पारिस्थितिकी' : 'Lake Ecology', value: 'lake_ecology' },
    { label: language === 'hi' ? 'धरोहर' : 'Heritage', value: 'heritage_infrastructure' },
    { label: language === 'hi' ? 'स्वच्छता एवं कचरा' : 'Sanitation', value: 'sanitation_waste' },
    { label: language === 'hi' ? 'जल आपूर्ति' : 'Water Supply', value: 'water_supply' },
    { label: language === 'hi' ? 'सड़क एवं परिवहन' : 'Roads & Transit', value: 'road_hazard' },
    { label: language === 'hi' ? 'ड्रेनेज एवं नाले' : 'Drainage & Sump', value: 'drainage_flood' },
    { label: language === 'hi' ? 'स्ट्रीट लाइट' : 'Public Lighting', value: 'public_lighting' }
  ];

  // Filtered incidents
  const filteredIncidents = incidents.filter((inc) => {
    const matchesWard = selectedWardId === 'all' || inc.wardId === selectedWardId;
    const matchesCategory = selectedCategory === 'all' || inc.category === selectedCategory;
    const matchesSeverity = selectedSeverity === 'all' || inc.severity === selectedSeverity;
    const matchesSearch =
      searchQuery === '' ||
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.trackingToken.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.locationName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesWard && matchesCategory && matchesSeverity && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#070B14] text-slate-100 selection:bg-blue-500/30 font-bitmap">
      
      {/* =========================================================================
          HERO SECTION (VIVID SATELLITE MAP + BITMAP COMMAND CENTER)
          ========================================================================= */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-[92vh] w-full overflow-hidden flex flex-col justify-between border-b border-slate-800/80 bg-[#070B14]"
      >
        {/* Bright, Vivid High-Contrast Satellite Map Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/bhopal-map-hero.jpg"
              alt="Bhopal Civic Memory Spatial Radar"
              fill
              priority
              className="object-cover object-center lg:object-right opacity-95 brightness-110 contrast-125 saturate-125"
            />
          </div>

          {/* Clean Left Shadow for High-Contrast Text Readability without fainting the map */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070B14] from-25% via-[#070B14]/85 via-50% to-transparent/10" />
          
          {/* Subtle Top & Bottom Vignette */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#070B14] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#070B14] via-[#070B14]/90 to-transparent" />

          {/* Interactive Mouse Hover Spotlight Glow */}
          <div
            className="pointer-events-none absolute -inset-px opacity-40 transition-opacity duration-300 hidden lg:block"
            style={{
              background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.2), transparent 80%)`
            }}
          />
        </div>

        {/* Interactive Tactical Radar Hotspots with Bitmap Badges */}
        <div className="absolute inset-0 pointer-events-auto z-10 hidden md:block">
          {MAP_HOTSPOTS.map((spot) => (
            <div
              key={spot.id}
              style={{ top: spot.top, left: spot.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              onMouseEnter={() => setActiveHotspot(spot)}
              onMouseLeave={() => setActiveHotspot(null)}
            >
              {/* Radar Pulsing Rings & Beacon */}
              <div className="relative flex items-center justify-center">
                <span
                  className={`absolute h-8 w-8 animate-ping rounded-full opacity-60 ${
                    spot.color === 'red'
                      ? 'bg-rose-500'
                      : spot.color === 'emerald'
                      ? 'bg-emerald-400'
                      : 'bg-blue-400'
                  }`}
                />
                <span
                  className={`relative flex h-4 w-4 rounded-full border-2 border-slate-950 shadow-2xl transition-transform group-hover:scale-125 ${
                    spot.color === 'red'
                      ? 'bg-rose-500'
                      : spot.color === 'emerald'
                      ? 'bg-emerald-400'
                      : 'bg-blue-400'
                  }`}
                />

                {/* Tactical Bitmap Landmark Label */}
                <span className="ml-2 rounded border border-slate-700/80 bg-slate-950/80 px-1.5 py-0.5 text-[9px] font-mono tracking-widest text-slate-200 group-hover:text-white group-hover:border-sky-500 uppercase backdrop-blur-sm shadow-md transition-colors">
                  {spot.label}
                </span>
              </div>

              {/* Hover Popover Tooltip */}
              {activeHotspot?.id === spot.id && (
                <div className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 w-64 rounded-xl border border-slate-700 bg-slate-950/95 p-3.5 shadow-2xl backdrop-blur-md z-50 text-left pointer-events-none animate-in fade-in zoom-in-95 duration-150 font-bitmap">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                    <span className="text-xs font-bold text-white tracking-wide">{spot.label}</span>
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                      spot.color === 'red' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {spot.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">{spot.subtext}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-sky-400 font-mono">
                    <Sparkles className="h-3 w-3 shrink-0" />
                    <span>{spot.telemetry}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Hero Main Content */}
        <div className="relative z-20 mx-auto max-w-7xl w-full px-4 sm:px-6 pt-16 sm:pt-24 pb-12 flex-1 flex flex-col justify-center">
          <div className="max-w-2xl space-y-8">
            
            {/* Context Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-3.5 py-1 text-xs font-medium text-sky-400 backdrop-blur-sm shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>Bhopal Municipal Corporation • Civic Intelligence</span>
            </div>

            {/* Impact Headline with Spacious Leading */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-white leading-[1.12]">
                {t('hero_title_1', 'Bhopal doesn’t have')}<br />
                {t('hero_title_2', 'a complaint problem.')}<br />
                <span className="text-blue-500">{t('hero_title_highlight', 'It has a memory problem.')}</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed font-normal max-w-xl">
              {t(
                'hero_subtitle',
                'Civic Memory connects citizen reports, historical interventions, and external evidence to uncover recurring failures and drive lasting resolution.'
              )}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                href="/report"
                className="inline-flex items-center gap-2.5 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5"
              >
                <Send className="h-4 w-4" />
                <span>{t('hero_btn_report', 'Report an Issue')}</span>
              </Link>

              <a
                href="#intelligence-feed"
                className="inline-flex items-center gap-2.5 rounded-xl border border-slate-700/80 bg-slate-900/80 px-6 py-3.5 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-all shadow-sm backdrop-blur-sm hover:-translate-y-0.5"
              >
                <BarChart3 className="h-4 w-4 text-slate-400" />
                <span>{t('hero_btn_feed', 'View Intelligence Feed')}</span>
              </a>
            </div>

            {/* Clean Telemetry Card Strip */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 sm:p-5 backdrop-blur-md shadow-xl max-w-xl">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                    <Droplets className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">85</div>
                    <div className="text-[11px] text-slate-400">{t('metric_rain', 'Rain Sensors')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">24/7</div>
                    <div className="text-[11px] text-slate-400">{t('metric_monitoring', 'Monitoring')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{metrics.totalActiveIncidents || 142}</div>
                    <div className="text-[11px] text-slate-400">{t('metric_active', 'Active Incidents')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">92%</div>
                    <div className="text-[11px] text-slate-400">{t('metric_sla', 'SLA Compliance')}</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 4 Feature Value Proposition Cards (Bottom of Hero with clean spacing) */}
        <div className="relative z-20 mx-auto max-w-7xl w-full px-4 sm:px-6 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            
            {/* Card 1: Evidence First */}
            <div className="group rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md hover:border-blue-500/50 hover:bg-slate-900/90 transition-all shadow-lg flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Droplets className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-white tracking-tight">{t('card1_title', 'Evidence First')}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t('card1_desc', 'Every incident is grounded in photos, sensor data, and external records.')}
                </p>
              </div>
              <div className="pt-4 flex items-center text-xs font-medium text-slate-500 group-hover:text-blue-400 transition-colors">
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Recurrence Intelligence */}
            <div className="group rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all shadow-lg flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-white tracking-tight">{t('card2_title', 'Recurrence Intelligence')}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t('card2_desc', 'We don’t treat reports in isolation. We detect patterns, not just problems.')}
                </p>
              </div>
              <div className="pt-4 flex items-center text-xs font-medium text-slate-500 group-hover:text-emerald-400 transition-colors">
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Root Cause Focused */}
            <div className="group rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md hover:border-amber-500/50 hover:bg-slate-900/90 transition-all shadow-lg flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Compass className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-white tracking-tight">{t('card3_title', 'Root Cause Focused')}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t('card3_desc', 'From surface issues to underlying causes — with hypotheses, not assumptions.')}
                </p>
              </div>
              <div className="pt-4 flex items-center text-xs font-medium text-slate-500 group-hover:text-amber-400 transition-colors">
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 4: Verification Driven */}
            <div className="group rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md hover:border-rose-500/50 hover:bg-slate-900/90 transition-all shadow-lg flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <Shield className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-white tracking-tight">{t('card4_title', 'Verification Driven')}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t('card4_desc', 'Resolution isn’t claimed. It’s visually verified and epistemically audited.')}
                </p>
              </div>
              <div className="pt-4 flex items-center text-xs font-medium text-slate-500 group-hover:text-rose-400 transition-colors">
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

          {/* Scroll to explore pill */}
          <div className="pt-6 flex justify-center">
            <a
              href="#tactical-map"
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <div className="h-5 w-3 rounded-full border border-slate-600 flex items-start justify-center p-0.5">
                <div className="h-1.5 w-1 rounded-full bg-slate-400 animate-bounce" />
              </div>
              <span className="tracking-wide">{t('scroll_explore', 'Scroll to explore')}</span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: TACTICAL WARD & CATCHMENT MAP (EMBEDDED FROM /map)
          ========================================================================= */}
      <section id="tactical-map" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider">
              <Layers className="h-4 w-4" />
              <span>{t('map_badge', 'Spatial Intelligence & Ward Reconnaissance')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {t('map_title', 'Interactive Bhopal Civic Map')}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t(
                'map_desc',
                'Explore real-time spatial incidents, Ramsar wetland catchment buffers, and municipal ward infrastructure across 85 administrative zones.'
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/map"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <span>{t('map_btn_fullscreen', 'Full Screen Map')}</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </Link>
            <Link
              href="/report"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors shadow-sm"
            >
              <span>{t('map_btn_pin', 'Pin New Incident')}</span>
            </Link>
          </div>
        </div>

        {/* Embedded Interactive Civic Map Canvas */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-2 sm:p-4 shadow-2xl backdrop-blur-sm">
          <div className="h-[560px] w-full rounded-xl overflow-hidden relative">
            <CivicMapCanvas
              incidents={incidents}
              wards={wards}
              className="h-full w-full"
              onSelectIncident={(inc) => {
                if (inc?.id) {
                  window.location.href = `/incidents/${inc.id}`;
                }
              }}
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: LIVE INTELLIGENCE FEED
          ========================================================================= */}
      <section id="intelligence-feed" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-8 border-t border-slate-800/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>{t('feed_badge', 'Real-Time Incident Records')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {t('feed_title', 'Bhopal Municipal Incident Feed')}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t(
                'feed_desc',
                'Every card below represents an epistemically audited incident backed by multi-year recurrence history, CPCB/IMD telemetry, and Claude reasoning.'
              )}
            </p>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {language === 'hi'
              ? `कुल ${incidents.length} में से ${filteredIncidents.length} प्रमाणित रिकॉर्ड`
              : `Showing ${filteredIncidents.length} of ${incidents.length} verified records`}
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder={t('feed_search_placeholder', 'Search by keyword, token, or ward...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950 pl-10 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Category Badges Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Severity Select */}
          <div className="w-full md:w-auto shrink-0">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full md:w-auto rounded-lg border border-slate-700/80 bg-slate-950 px-3 py-2 text-xs text-slate-300 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">{language === 'hi' ? 'सभी गंभीरता स्तर' : 'All Severities'}</option>
              <option value="critical">{language === 'hi' ? 'अति गंभीर (Critical)' : 'Critical'}</option>
              <option value="high">{language === 'hi' ? 'उच्च (High)' : 'High'}</option>
              <option value="medium">{language === 'hi' ? 'मध्यम (Medium)' : 'Medium'}</option>
              <option value="low">{language === 'hi' ? 'सामान्य (Low)' : 'Low'}</option>
            </select>
          </div>
        </div>

        {/* Incidents Grid */}
        {filteredIncidents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredIncidents.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-12 text-center space-y-3">
            <AlertTriangle className="h-8 w-8 text-amber-400 mx-auto" />
            <h3 className="text-base font-medium text-white">{t('feed_no_results_title', 'No incidents match your filter criteria')}</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {t('feed_no_results_desc', 'Try adjusting your search terms or clearing the selected category and ward filters.')}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedSeverity('all');
                setSelectedWardId('all');
              }}
              className="mt-2 text-xs font-semibold text-blue-400 hover:underline"
            >
              {t('feed_reset', 'Reset all filters')}
            </button>
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 4: HOW CIVIC MEMORY WORKS
          ========================================================================= */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-12 border-t border-slate-800/60">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
            <span>{t('how_badge', 'Epistemic Architecture')}</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {t('how_title', 'Beyond Complaint Management')}
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            {t(
              'how_desc',
              'Conventional grievance portals reset after every dispatch. Bhopal Civic Memory accumulates long-term systemic intelligence.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4 relative">
            <div className="text-xs font-mono text-blue-400 font-bold">{t('how_step1_label', '01 / INTAKE')}</div>
            <h3 className="text-base font-bold text-white">{t('how_step1_title', 'Multimodal Reporting')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t(
                'how_step1_desc',
                'Citizens submit Hindi/English text, photos, and precise ward coordinates. No rigid municipal taxonomy required.'
              )}
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4 relative">
            <div className="text-xs font-mono text-emerald-400 font-bold">{t('how_step2_label', '02 / TRIAGE')}</div>
            <h3 className="text-base font-bold text-white">{t('how_step2_title', 'Claude Epistemic Audit')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t(
                'how_step2_desc',
                'Claude decomposes claims into 7 epistemic dimensions and bounds reasoning against CPCB, IMD, and NGT baseline registries.'
              )}
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4 relative">
            <div className="text-xs font-mono text-amber-400 font-bold">{t('how_step3_label', '03 / RECURRENCE')}</div>
            <h3 className="text-base font-bold text-white">{t('how_step3_title', 'Root-Cause Memory')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t(
                'how_step3_desc',
                'Semantic matching clusters related reports across monsoon cycles, diagnosing chronic structural bottlenecks over temporary patching.'
              )}
            </p>
          </div>

          {/* Step 4 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4 relative">
            <div className="text-xs font-mono text-rose-400 font-bold">{t('how_step4_label', '04 / VERIFICATION')}</div>
            <h3 className="text-base font-bold text-white">{t('how_step4_title', 'Vision-Audited Resolution')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t(
                'how_step4_desc',
                'Resolutions require photographic before/after audits evaluated by Claude Vision to ensure permanent physical restoration.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: ABOUT & EVIDENCE REGISTRY GROUNDING
          ========================================================================= */}
      <section id="about" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full border-t border-slate-800/60">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-slate-950 p-8 sm:p-12 space-y-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">
              {t('about_badge', 'Bhopal Municipal Corporation & Ramsar Site #1206')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {t('about_title', 'Grounded in Verified Environmental & Civic Baselines')}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t(
                'about_desc',
                'Bhopal Civic Memory integrates data from the Central Pollution Control Board (CPCB), India Meteorological Department (IMD), National Green Tribunal (NGT Central Zone), and BMC 85-Ward delimitation records to prevent AI hallucinations and enforce deterministic safety gates.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
              <div className="text-xs text-slate-400 font-mono">{t('about_stat1_label', 'Registry Records')}</div>
              <div className="text-lg font-bold text-white mt-1">{t('about_stat1_val', '15 Verified Baselines')}</div>
              <div className="text-[11px] text-emerald-400 mt-0.5">{t('about_stat1_sub', '100% Primary Source Grounding')}</div>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
              <div className="text-xs text-slate-400 font-mono">{t('about_stat2_label', 'Protected Wet Zone')}</div>
              <div className="text-lg font-bold text-white mt-1">{t('about_stat2_val', 'Bhoj Wetland #1206')}</div>
              <div className="text-[11px] text-sky-400 mt-0.5">{t('about_stat2_sub', 'Ramsar Catchment Buffer Oversight')}</div>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
              <div className="text-xs text-slate-400 font-mono">{t('about_stat3_label', 'AI Reasoning Engine')}</div>
              <div className="text-lg font-bold text-white mt-1">{t('about_stat3_val', 'Claude Sonnet 4.5')}</div>
              <div className="text-[11px] text-blue-400 mt-0.5">{t('about_stat3_sub', 'Live Epistemic Safety Gates')}</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
