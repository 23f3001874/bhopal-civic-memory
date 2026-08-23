'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCivic } from '@/lib/context/CivicContext';
import { IncidentCard } from '@/components/ui/IncidentCard';
import { CivicMapCanvas } from '@/components/ui/CivicMapCanvas';
import {
  Send,
  ArrowRight,
  Layers,
  Search,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  MapPin,
  GitMerge,
  Eye,
  CheckCircle2,
  FileCheck2,
  Database
} from 'lucide-react';
import { IncidentCategory } from '@/types/incident';

export default function LandingPage() {
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
    <div className="flex flex-col min-h-screen bg-[#05070B] text-[#F5F7FA] selection:bg-[#EFCFC1] selection:text-[#171717]">
      
      {/* =========================================================================
          SECTION 1: CINEMATIC WARM EDITORIAL HERO (BHOJTAL SUNSET AT GOLDEN HOUR)
          ========================================================================= */}
      <section className="relative min-h-[92vh] lg:min-h-screen w-full overflow-hidden flex flex-col justify-between bg-[#F8F3EC] text-[#171717]">
        
        {/* Photographic Background Layer with Subtle Cinematic Ambient Scale */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="relative w-full h-full animate-ambient-zoom">
            <Image
              src="/bhojtal-landscape.png"
              alt="Bhojtal Upper Lake at golden hour — Bhopal"
              fill
              priority
              className="object-cover object-center lg:object-[center_35%] opacity-90 brightness-[1.02] contrast-[1.05] saturate-[1.08]"
            />
          </div>

          {/* Warm Atmospheric Gradient Overlay matching Bhojtal Golden Hour */}
          <div className="absolute inset-0 bg-warm-hero-atmosphere" />
          
          {/* Subtle Side Vignette for Text Legibility */}
          <div className="absolute inset-y-0 left-0 w-full sm:w-2/3 bg-gradient-to-r from-[#F8F3EC]/80 via-[#F8F3EC]/40 to-transparent" />
        </div>

        {/* Oversized Translucent Editorial Wordmark Across the Sky */}
        <div className="absolute top-12 sm:top-16 inset-x-0 flex justify-center pointer-events-none z-10 select-none overflow-hidden">
          <span className="font-editorial text-[90px] sm:text-[180px] lg:text-[240px] font-bold tracking-[-0.07em] text-[#171717]/[0.07] uppercase whitespace-nowrap">
            BHOPAL
          </span>
        </div>

        {/* Top Minimal Navigation Bar */}
        <div className="relative z-20 mx-auto max-w-7xl w-full px-4 sm:px-6 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.25em] font-semibold text-[#171717]/80">
              BHOPAL CIVIC MEMORY
            </span>
            <span className="text-[#171717]/30 hidden sm:inline">•</span>
            <span className="font-mono text-[10px] text-[#171717]/60 hidden sm:inline uppercase">
              Ramsar Site #1206
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium text-[#171717]/80">
            <a href="#the-problem" className="hover:text-[#171717] transition-colors hidden sm:inline">Memory</a>
            <Link href="/map" className="hover:text-[#171717] transition-colors hidden sm:inline">Map</Link>
            <Link href="/report" className="hover:text-[#171717] transition-colors hidden sm:inline">Report</Link>
            <Link
              href="/report"
              className="rounded-full bg-[#171717] px-4 py-1.5 text-xs font-medium text-[#F8F3EC] hover:bg-[#333333] transition-all shadow-sm"
            >
              REPORT AN ISSUE
            </Link>
          </div>
        </div>

        {/* Hero Main Content */}
        <div className="relative z-20 mx-auto max-w-7xl w-full px-4 sm:px-6 py-16 sm:py-24 flex-1 flex flex-col justify-center">
          <div className="max-w-2xl space-y-6">
            
            {/* Minimal Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#171717]/15 bg-white/40 px-3.5 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-[#171717]/80 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#527F7B]" />
              <span>INSTITUTIONAL CIVIC INTELLIGENCE</span>
            </div>

            {/* Large Editorial Headline */}
            <div className="space-y-1">
              <h1 className="font-editorial text-5xl sm:text-7xl lg:text-[84px] font-normal tracking-[-0.04em] text-[#171717] leading-[0.96]">
                A city that remembers.
              </h1>
            </div>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-[#171717]/80 leading-relaxed font-normal max-w-xl">
              Citizen reports become civic memory — connecting recurring failures, verified evidence, and what happened after the intervention.
            </p>

            {/* Minimal Clean Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/report"
                className="inline-flex items-center gap-2 rounded-full bg-[#171717] px-6 py-3 text-xs font-medium text-[#F8F3EC] hover:bg-[#333333] transition-all shadow-md"
              >
                <span>REPORT A CIVIC ISSUE</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <a
                href="#the-problem"
                className="inline-flex items-center gap-2 rounded-full border border-[#171717]/20 bg-white/30 backdrop-blur-md px-6 py-3 text-xs font-medium text-[#171717] hover:bg-white/60 transition-all"
              >
                <span>EXPLORE CIVIC MEMORY</span>
              </a>
            </div>
          </div>
        </div>

        {/* Hero Bottom Bar: Scroll Indicator */}
        <div className="relative z-20 mx-auto max-w-7xl w-full px-4 sm:px-6 pb-6 flex items-center justify-between text-xs text-[#171717]/60 font-mono">
          <div className="flex items-center gap-2.5">
            <div className="h-4 w-[1.5px] bg-[#171717]/40 animate-pulse" />
            <span className="text-[10px] tracking-[0.2em] uppercase">SCROLL TO EXPLORE</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px]">
            <span>23.2599° N, 77.4126° E</span>
            <span>•</span>
            <span>BHOJTAL CATCHMENT</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: THE PROBLEM (THE CONCEPTUAL HEART OF CIVIC MEMORY)
          ========================================================================= */}
      <section id="the-problem" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-14 bg-[#05070B] border-t border-white/[0.08]">
        <div className="max-w-3xl space-y-4">
          <span className="font-mono text-[11px] text-[#EFCFC1] uppercase tracking-[0.2em]">
            THE CIVIC INSIGHT
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-[#F5F7FA] tracking-[-0.03em] leading-tight">
            Bhopal doesn't have a complaint problem.<br />
            <span className="text-gradient-accent font-sans font-semibold text-2xl sm:text-4xl">
              It has a memory problem.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#A7AFBD] leading-relaxed">
            Conventional grievance systems treat every report as an isolated ticket — dispatch, close, and forget. When the same culvert floods six times across three monsoons, the city pays for six temporary fixes. Civic Memory clusters recurring reports into persistent institutional files.
          </p>
        </div>

        {/* Minimal Converging Reports Diagram */}
        <div className="card-surface p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A7AFBD]">
              <GitMerge className="h-4 w-4 text-[#00DFD8]" />
              <span>RECURRENCE CONVERGENCE PIPELINE</span>
            </div>
            <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
              7 REPORTS $\rightarrow$ 1 PERSISTENT DOSSIER
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Stage 1: Fragmented Complaints */}
            <div className="space-y-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 text-xs">
              <div className="font-mono text-[10px] text-[#687386] uppercase">STAGE 01 • INTAKE</div>
              <div className="font-semibold text-[#F5F7FA]">Citizen Complaints</div>
              <ul className="space-y-1 text-[11px] text-[#A7AFBD] pt-1">
                <li>• Jul 2025: Sump overflow (MP Nagar)</li>
                <li>• Oct 2025: Standing water 40cm</li>
                <li>• Feb 2026: Plastic choke in culvert</li>
                <li>• Jun 2026: Carriageway flooded</li>
              </ul>
            </div>

            {/* Stage 2: Temporal Clustering */}
            <div className="space-y-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 text-xs">
              <div className="font-mono text-[10px] text-[#00DFD8] uppercase">STAGE 02 • CLUSTER</div>
              <div className="font-semibold text-[#F5F7FA]">Spatial-Temporal Match</div>
              <p className="text-[11px] text-[#A7AFBD] leading-relaxed">
                Claude identifies coordinate match within 45m and cross-references historical municipal work orders.
              </p>
            </div>

            {/* Stage 3: Root Cause Diagnosis */}
            <div className="space-y-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 text-xs">
              <div className="font-mono text-[10px] text-purple-400 uppercase">STAGE 03 • DIAGNOSTIC</div>
              <div className="font-semibold text-[#F5F7FA]">Epistemic Root Cause</div>
              <p className="text-[11px] text-[#A7AFBD] leading-relaxed">
                Isolates that culvert invert gradient is 12% below hydraulic spec, causing structural backwater choke.
              </p>
            </div>

            {/* Stage 4: One Civic Memory */}
            <div className="space-y-2 rounded-lg border border-[#00DFD8]/40 bg-[#00DFD8]/[0.05] p-4 text-xs">
              <div className="font-mono text-[10px] text-[#00DFD8] uppercase font-semibold">OUTPUT • MEMORY</div>
              <div className="font-semibold text-[#F5F7FA]">One Permanent Dossier</div>
              <p className="text-[11px] text-[#A7AFBD] leading-relaxed">
                Single actionable engineering packet dispatched to Ward 45 officers with physical inspection steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: THE CIVIC MEMORY WORKFLOW (HORIZONTAL PIPELINE)
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-10 bg-[#05070B] border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="font-mono text-[11px] text-[#A7AFBD] uppercase tracking-[0.2em]">
            SYSTEM PIPELINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F5F7FA]">
            How Civic Memory Works
          </h2>
          <p className="text-xs sm:text-sm text-[#A7AFBD] leading-relaxed">
            From raw citizen observation to permanent physical verification.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {/* Step 1 */}
          <div className="card-surface p-4 space-y-2 text-xs">
            <div className="font-mono text-[10px] text-[#EFCFC1] uppercase font-medium">01 REPORT</div>
            <h3 className="font-semibold text-[#F5F7FA]">Citizen Intake</h3>
            <p className="text-[11px] text-[#A7AFBD] leading-relaxed">
              Multimodal text, photos, and precise ward coordinates in Hindi or English.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card-surface p-4 space-y-2 text-xs">
            <div className="font-mono text-[10px] text-[#00DFD8] uppercase font-medium">02 REMEMBER</div>
            <h3 className="font-semibold text-[#F5F7FA]">Recurrence Match</h3>
            <p className="text-[11px] text-[#A7AFBD] leading-relaxed">
              Vector lookups correlate past failures across multi-year monsoon cycles.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card-surface p-4 space-y-2 text-xs">
            <div className="font-mono text-[10px] text-[#007CF0] uppercase font-medium">03 UNDERSTAND</div>
            <h3 className="font-semibold text-[#F5F7FA]">Epistemic Triage</h3>
            <p className="text-[11px] text-[#A7AFBD] leading-relaxed">
              Claude separates observations from claims and bounds them to CPCB/IMD data.
            </p>
          </div>

          {/* Step 4 */}
          <div className="card-surface p-4 space-y-2 text-xs">
            <div className="font-mono text-[10px] text-purple-400 uppercase font-medium">04 ACT</div>
            <h3 className="font-semibold text-[#F5F7FA]">Investigation Plan</h3>
            <p className="text-[11px] text-[#A7AFBD] leading-relaxed">
              Generates targeted physical inspection packets for ward engineers.
            </p>
          </div>

          {/* Step 5 */}
          <div className="card-surface p-4 space-y-2 text-xs">
            <div className="font-mono text-[10px] text-emerald-400 uppercase font-medium">05 VERIFY</div>
            <h3 className="font-semibold text-[#F5F7FA]">Vision Verification</h3>
            <p className="text-[11px] text-[#A7AFBD] leading-relaxed">
              Before/after photographic audit with explicit epistemic uncertainty flags.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: BHOJTAL SPATIAL IDENTITY & TACTICAL MAP CONSOLE
          ========================================================================= */}
      <section id="tactical-map" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-8 bg-[#05070B] border-t border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-[#00DFD8] text-[11px] font-mono font-medium uppercase tracking-wider">
              <Layers className="h-3.5 w-3.5" />
              <span>BHOPAL • 23.2599° N, 77.4126° E</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F5F7FA]">
              City Memory, Grounded in Place
            </h2>
            <p className="text-xs sm:text-sm text-[#A7AFBD] leading-relaxed">
              Multi-layered spatial intelligence mapping Bhoj Wetland (Ramsar Site #1206), heritage corridors, and municipal dispatches across 85 administrative zones.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/map"
              className="inline-flex items-center gap-1.5 btn-secondary px-3.5 py-2 text-xs font-medium text-[#F5F7FA]"
            >
              <span>Full Screen Map</span>
              <ExternalLink className="h-3.5 w-3.5 text-[#687386]" />
            </Link>
            <Link
              href="/report"
              className="inline-flex items-center gap-1.5 btn-primary px-3.5 py-2 text-xs font-medium text-white shadow-sm"
            >
              <span>Report at Location</span>
            </Link>
          </div>
        </div>

        {/* Embedded Interactive Civic Map Canvas */}
        <div className="card-surface p-2 sm:p-3 shadow-2xl">
          <div className="h-[520px] w-full rounded-lg overflow-hidden relative border border-white/[0.06]">
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
          SECTION 5: LIVE INCIDENT INTELLIGENCE FEED
          ========================================================================= */}
      <section id="intelligence-feed" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-8 border-t border-white/[0.08] bg-[#05070B]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-[#007CF0] text-[11px] font-mono font-medium uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Real-Time Incident Records</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F5F7FA]">
              Bhopal Municipal Incident Feed
            </h2>
            <p className="text-xs sm:text-sm text-[#A7AFBD] leading-relaxed">
              Every card below represents an epistemically audited incident backed by multi-year recurrence history, CPCB/IMD baselines, and Claude reasoning.
            </p>
          </div>

          <div className="text-xs text-[#687386] font-mono">
            Showing {filteredIncidents.length} of {incidents.length} verified records
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between card-surface p-3 shadow-lg">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#687386]" />
            <input
              type="text"
              placeholder="Search keyword, ID, or ward..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-white/[0.08] bg-[#05070B] pl-9 pr-3 py-1.5 text-xs text-[#F5F7FA] placeholder-[#687386] focus:border-[#007CF0]/50 focus:outline-none"
            />
          </div>

          {/* Category Badges Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-white/[0.08] border border-white/[0.16] text-white font-medium shadow-sm'
                      : 'border border-transparent text-[#A7AFBD] hover:text-white hover:bg-white/[0.03]'
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
              className="w-full md:w-auto rounded-lg border border-white/[0.08] bg-[#05070B] px-3 py-1.5 text-xs text-[#A7AFBD] focus:border-[#007CF0]/50 focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
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
          <div className="card-surface p-12 text-center space-y-3">
            <AlertTriangle className="h-7 w-7 text-amber-400 mx-auto opacity-75" />
            <h3 className="text-sm font-medium text-[#F5F7FA]">No incidents match your filter criteria</h3>
            <p className="text-xs text-[#A7AFBD] max-w-sm mx-auto">
              Try adjusting your search terms or clearing the selected category and ward filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedSeverity('all');
                setSelectedWardId('all');
              }}
              className="mt-2 text-xs font-mono text-[#00DFD8] hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 6: PHOTOGRAPHIC FOOTER BOOKEND (BHOJTAL SUNSET RECURRENCE)
          ========================================================================= */}
      <footer className="relative min-h-[50vh] w-full overflow-hidden flex flex-col justify-between border-t border-white/[0.08] bg-[#05070B] text-[#F8F3EC]">
        
        {/* Same Reference Photograph for Visual Continuity */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src="/bhojtal-landscape.png"
              alt="Bhojtal sunset — Bhopal Civic Memory"
              fill
              className="object-cover object-bottom opacity-40 brightness-[0.9] contrast-[1.1] saturate-[1.15]"
            />
          </div>
          {/* Subtle Warm Overlay */}
          <div className="absolute inset-0 bg-warm-footer-atmosphere" />
        </div>

        {/* Footer Editorial Statement */}
        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 pt-16 pb-8 flex-1 flex flex-col justify-center text-center space-y-4">
          <span className="font-mono text-[11px] text-[#EFCFC1] uppercase tracking-[0.3em]">
            BHOPAL CIVIC MEMORY
          </span>
          <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal text-[#171717] tracking-[-0.04em]">
            A city that remembers.
          </h2>
          <p className="text-xs sm:text-sm text-[#171717]/80 max-w-md mx-auto font-normal">
            Institutional intelligence, Ramsar wetland protection, and root-cause civic governance.
          </p>
        </div>

        {/* Minimal Footer Navigation & Telemetry */}
        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 border-t border-[#171717]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#171717]/70">
          <div className="flex items-center gap-3">
            <span>BHOPAL MUNICIPAL CORPORATION</span>
            <span>•</span>
            <span className="text-[#527F7B] font-semibold">RAMSAR WETLAND #1206</span>
          </div>

          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-[#171717] transition-colors">Home</Link>
            <Link href="/map" className="hover:text-[#171717] transition-colors">Map</Link>
            <Link href="/report" className="hover:text-[#171717] transition-colors">Report Issue</Link>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
            <span className="text-[11px] text-[#171717]">SYSTEM ONLINE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
