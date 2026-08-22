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
  Clock,
  Shield,
  Search,
  SlidersHorizontal,
  MapPin,
  Sparkles,
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
    { label: 'All', value: 'all' },
    { label: 'Lake Ecology', value: 'lake_ecology' },
    { label: 'Heritage', value: 'heritage_infrastructure' },
    { label: 'Sanitation', value: 'sanitation_waste' },
    { label: 'Water Supply', value: 'water_supply' },
    { label: 'Roads & Transit', value: 'road_hazard' },
    { label: 'Drainage & Sump', value: 'drainage_flood' },
    { label: 'Public Lighting', value: 'public_lighting' }
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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 space-y-10">
      {/* Clean, Spacious Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <span>Bhopal Municipal Corporation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            City Intelligence & Incident Memory
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Real-time urban telemetry, Ramsar wetland oversight, and historical recurrence analysis across 85 municipal wards.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/map"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors shadow-sm"
          >
            <span>View Tactical Map</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>
          <Link
            href="/report"
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition-colors shadow-sm"
          >
            <span>Report Incident</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Summary Cards with generous whitespace */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Civic Incidents"
          value={metrics.totalActiveIncidents}
          subtitle="Across 85 Municipal Wards"
          trend={{ value: '+4 today', isPositive: false }}
          icon={AlertTriangle}
          statusDot
        />
        <MetricCard
          title="Critical Alerts"
          value={metrics.criticalAlerts}
          subtitle="Immediate dispatch priority"
          trend={{ value: '1 in progress', isPositive: true }}
          icon={Shield}
          statusDot
        />
        <MetricCard
          title="Bhojtal Wetland Health"
          value={`${metrics.bhojtalLakeQualityIndex}/100`}
          subtitle="Ramsar Site #1206 index"
          trend={{ value: 'Normal catchment aerated', isPositive: true }}
          icon={Waves}
        />
        <MetricCard
          title="Avg SLA Resolution"
          value={`${metrics.avgResolutionTimeHours}h`}
          subtitle="142 resolved last 7 days"
          trend={{ value: '-2.1h vs last week', isPositive: true }}
          icon={Clock}
        />
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Incidents Feed & Search */}
        <div className="lg:col-span-8 space-y-6">
          {/* Refined Search & Filter Controls */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search incidents, tokens, or locations (e.g. MP Nagar, Sargam, Bhojtal)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-9 pr-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-sky-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Ward Select */}
              <div className="w-full sm:w-48">
                <select
                  value={selectedWardId}
                  onChange={(e) => setSelectedWardId(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-sky-500 focus:outline-none transition-colors"
                >
                  <option value="all">All Wards</option>
                  {wards.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.code} - {w.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Severity Select */}
              <div className="w-full sm:w-36">
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-sky-500 focus:outline-none transition-colors"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.value
                      ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                      : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Incidents Stream */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-slate-200">
                  Incident Feed
                </h2>
                <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-400 font-mono">
                  {filteredIncidents.length}
                </span>
              </div>
              <span className="text-xs text-slate-500">
                Sorted by latest activity
              </span>
            </div>

            {filteredIncidents.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/20 p-12 text-center">
                <SlidersHorizontal className="mx-auto h-7 w-7 text-slate-600 mb-2.5" />
                <h3 className="text-sm font-medium text-slate-300">
                  No incidents matching your filter criteria
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Try adjusting the ward, category, or search query.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredIncidents.map((incident) => (
                  <IncidentCard key={incident.id} incident={incident} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Spatial Preview & Status */}
        <div className="lg:col-span-4 space-y-6">
          {/* Spatial Preview Widget */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-sky-400" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Spatial Radar
                </h2>
              </div>
              <Link
                href="/map"
                className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
              >
                Expand <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            <CivicMapCanvas
              incidents={incidents}
              wards={wards}
              className="h-[280px] rounded-lg border border-slate-800"
            />
          </div>

          {/* AI Intelligence Digest */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
            <div className="flex items-center gap-2 text-slate-200">
              <Sparkles className="h-4 w-4 text-sky-400" />
              <h2 className="text-xs font-semibold uppercase tracking-wider">
                Claude AI Operations Digest
              </h2>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 space-y-1">
                <div className="text-xs font-medium text-slate-200">
                  Bhojtal Runoff Catchment (Ward 07)
                </div>
                <p className="text-slate-400 leading-relaxed">
                  High siltation detected near Khanoo Gaon culvert. Silt trap maintenance recommended before monsoon crest.
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 space-y-1">
                <div className="text-xs font-medium text-slate-200">
                  Old Bhopal Heritage Arcade (Ward 12)
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Taj-ul-Masajid north gate arcade flagged for mortar consolidation. Safety perimeter deployed.
                </p>
              </div>
            </div>
          </div>

          {/* Ward Health Summary */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Ward Health Index
              </h2>
              <span className="text-xs text-slate-500 font-mono">Score / 100</span>
            </div>

            <div className="space-y-2.5">
              {wards.map((ward) => (
                <div
                  key={ward.id}
                  onClick={() => setSelectedWardId(ward.id)}
                  className="cursor-pointer rounded-lg p-2.5 border border-slate-800/60 bg-slate-950/30 hover:border-slate-700 hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-medium text-slate-300">
                      {ward.code} • {ward.name.split('&')[0]}
                    </div>
                    <span className="font-mono font-semibold text-slate-200">
                      {ward.healthIndexScore}%
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        ward.healthIndexScore >= 90
                          ? 'bg-emerald-400'
                          : ward.healthIndexScore >= 80
                          ? 'bg-sky-400'
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${ward.healthIndexScore}%` }}
                    />
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
