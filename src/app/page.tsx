'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCivic } from '@/lib/context/CivicContext';
import { MetricCard } from '@/components/ui/MetricCard';
import { IncidentCard } from '@/components/ui/IncidentCard';
import { CivicMapCanvas } from '@/components/ui/CivicMapCanvas';
import {
  AlertTriangle,
  Waves,
  CheckCircle2,
  Clock,
  Shield,
  Search,
  SlidersHorizontal,
  MapPin,
  TrendingUp,
  Brain,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { IncidentCategory } from '@/types/incident';

export default function DashboardPage() {
  const {
    incidents,
    wards,
    metrics,
    selectedWardId,
    setSelectedWardId,
    selectedCategory,
    setSelectedCategory
  } = useCivic();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string | 'all'>('all');

  const categories: { label: string; value: IncidentCategory | 'all' }[] = [
    { label: 'All Categories', value: 'all' },
    { label: 'Bhojtal Ecology', value: 'lake_ecology' },
    { label: 'Heritage Corridor', value: 'heritage_infrastructure' },
    { label: 'Sanitation & Waste', value: 'sanitation_waste' },
    { label: 'Water Supply (PHE)', value: 'water_supply' },
    { label: 'Road Hazards', value: 'road_hazard' },
    { label: 'Drainage & Sump', value: 'drainage_flood' },
    { label: 'Smart Lighting', value: 'public_lighting' }
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Hero Welcome & Emergency Marquee */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 rounded-2xl border border-slate-800/80 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/80 p-6 backdrop-blur-xl shadow-2xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
            <Shield className="h-4 w-4" />
            Bhopal Municipal Command & Control Grid
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            City Intelligence & Civic Pulse
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Real-time urban telemetry, Ramsar wetland ecological oversight, heritage infrastructure stability, and citizen-reported municipal incidents.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/map"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 font-mono text-xs font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-700 transition-all"
          >
            Tactical Map View
            <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
          </Link>
          <Link
            href="/report"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/80 bg-cyan-500 px-4 py-2.5 font-mono text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-950/50"
          >
            + File Citizen Report
          </Link>
        </div>
      </div>

      {/* Top Tactical Pulse Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Civic Incidents"
          value={metrics.totalActiveIncidents}
          subtitle="Across 85 Municipal Wards"
          trend={{ value: '+4 logged today', isPositive: false }}
          icon={AlertTriangle}
          accentColor="cyan"
          statusDot
        />
        <MetricCard
          title="Critical Alerts"
          value={metrics.criticalAlerts}
          subtitle="Immediate dispatch protocol"
          trend={{ value: '1 under active remediation', isPositive: true }}
          icon={Shield}
          accentColor="rose"
          statusDot
        />
        <MetricCard
          title="Bhojtal Wetland Health"
          value={`${metrics.bhojtalLakeQualityIndex}/100`}
          subtitle="Ramsar Site 1206 Water Index"
          trend={{ value: 'Normal catchment aerated', isPositive: true }}
          icon={Waves}
          accentColor="emerald"
        />
        <MetricCard
          title="Avg Resolution SLA"
          value={`${metrics.avgResolutionTimeHours}h`}
          subtitle="142 resolved last 7 days"
          trend={{ value: '-2.1h faster vs last week', isPositive: true }}
          icon={Clock}
          accentColor="amber"
        />
      </div>

      {/* Main Grid: Left is Feed & Filters, Right is Spatial Overview & Ward Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Incident Feed & Search / Filter Controls */}
        <div className="lg:col-span-8 space-y-6">
          {/* Filter Bar */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by token, keyword, landmark (e.g. VIP Road, MP Nagar, Taj-ul-Masajid)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-700/80 bg-slate-950/80 pl-10 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Ward Filter */}
              <div className="w-full sm:w-56">
                <select
                  value={selectedWardId}
                  onChange={(e) => setSelectedWardId(e.target.value)}
                  className="w-full rounded-lg border border-slate-700/80 bg-slate-950/80 px-3 py-2 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="all">All Bhopal Wards</option>
                  {wards.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.code} - {w.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Severity Filter */}
              <div className="w-full sm:w-40">
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="w-full rounded-lg border border-slate-700/80 bg-slate-950/80 px-3 py-2 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`rounded-lg px-3 py-1 whitespace-nowrap transition-all ${
                    selectedCategory === cat.value
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'border border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Incidents Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-200">
                  Live Operations Feed
                </h3>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 font-mono text-xs text-cyan-400">
                  {filteredIncidents.length} Records
                </span>
              </div>
              <span className="font-mono text-[11px] text-slate-500">
                Auto-updating via telemetry
              </span>
            </div>

            {filteredIncidents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
                <SlidersHorizontal className="mx-auto h-8 w-8 text-slate-600 mb-3" />
                <h4 className="text-base font-semibold text-slate-300">
                  No incidents matching your filter criteria
                </h4>
                <p className="mt-1 text-xs text-slate-500 font-mono">
                  Try adjusting the ward, category, or search query.
                </p>
              </div>
            ) : (
              filteredIncidents.map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))
            )}
          </div>
        </div>

        {/* Right 4 Cols: Spatial Preview, Ward Matrix, AI Intelligence Digest */}
        <div className="lg:col-span-4 space-y-6">
          {/* Spatial Preview Widget */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-400" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                  Spatial Incident Radar
                </h3>
              </div>
              <Link
                href="/map"
                className="font-mono text-xs text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
              >
                Expand <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            <CivicMapCanvas
              incidents={incidents}
              wards={wards}
              className="h-[320px] rounded-xl border border-slate-800/80"
            />
          </div>

          {/* Claude AI Civic Intelligence Insights */}
          <div className="rounded-2xl border border-purple-900/40 bg-gradient-to-b from-purple-950/20 to-slate-900/60 p-5 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-300">
                <Brain className="h-4 w-4 text-purple-400" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider">
                  Claude AI Triaging Digest
                </h3>
              </div>
              <span className="font-mono text-[10px] text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/50">
                Automated
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="rounded-lg border border-purple-900/30 bg-purple-950/30 p-3">
                <div className="font-mono text-[11px] text-purple-300 font-semibold mb-1">
                  BHOJTAL RUNOFF CORRIDOR (WARD 07)
                </div>
                <p className="text-slate-300 leading-relaxed">
                  High siltation risk detected at Khanoo Gaon culvert. Immediate weed harvester barrier dispatched to safeguard Ramsar wetland aeration.
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                <div className="font-mono text-[11px] text-cyan-400 font-semibold mb-1">
                  OLD BHOPAL HERITAGE STABILITY (WARD 12)
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Taj-ul-Masajid north gate arcade flagged for mortar consolidation. Scaffolding perimeter deployed to prevent pedestrian hazard.
                </p>
              </div>
            </div>
          </div>

          {/* Ward Health Index Matrix */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                Ward Health Matrix
              </h3>
              <span className="font-mono text-[11px] text-slate-400">Score / 100</span>
            </div>

            <div className="space-y-3">
              {wards.map((ward) => (
                <div
                  key={ward.id}
                  onClick={() => setSelectedWardId(ward.id)}
                  className="cursor-pointer group rounded-lg p-2.5 border border-slate-800/60 bg-slate-950/40 hover:border-cyan-800/60 hover:bg-slate-900 transition-all"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-mono font-medium text-slate-300 group-hover:text-cyan-300">
                      {ward.code} • {ward.name.split('&')[0]}
                    </div>
                    <span
                      className={`font-mono font-bold ${
                        ward.healthIndexScore >= 90
                          ? 'text-emerald-400'
                          : ward.healthIndexScore >= 80
                          ? 'text-cyan-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {ward.healthIndexScore}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        ward.healthIndexScore >= 90
                          ? 'bg-emerald-400'
                          : ward.healthIndexScore >= 80
                          ? 'bg-cyan-400'
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${ward.healthIndexScore}%` }}
                    />
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>Active: {ward.activeIncidents}</span>
                    <span>Resolved: {ward.resolvedThisMonth}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
