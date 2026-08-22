'use client';

import React, { useState } from 'react';
import { useCivic } from '@/lib/context/CivicContext';
import { CivicMapCanvas } from '@/components/ui/CivicMapCanvas';
import { StatusBadge, SeverityBadge, CategoryBadge } from '@/components/ui/StatusBadge';
import {
  MapPin,
  Layers,
  Filter,
  Shield,
  Search,
  ArrowUpRight,
  Sparkles,
  Waves,
  SlidersHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { CivicIncident } from '@/types/incident';

export default function MapPage() {
  const { incidents, wards } = useCivic();
  const [selectedIncident, setSelectedIncident] = useState<CivicIncident | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredIncidents = incidents.filter((inc) => {
    const matchesCat = categoryFilter === 'all' || inc.category === categoryFilter;
    const matchesSev = severityFilter === 'all' || inc.severity === severityFilter;
    const matchesSearch =
      searchQuery === '' ||
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.wardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.trackingToken.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSev && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
            <Layers className="h-4 w-4" />
            Tactical Civic Spatial Intelligence
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Bhopal Municipal Ward & Catchment Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Interactive multi-layered spatial visualization of Bhoj Wetland (Ramsar Site #1206), heritage corridors, municipal wards, and active civic dispatches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/report"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-500 bg-cyan-500 px-4 py-2 font-mono text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-lg"
          >
            + File Report at Location
          </Link>
        </div>
      </div>

      {/* Main Map Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Incidents Sidebar & Tactical Filters (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur-md space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search pins or wards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-700/80 bg-slate-950/80 pl-9 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Quick Filters */}
            <div className="grid grid-cols-2 gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-lg border border-slate-700/80 bg-slate-950/80 px-2.5 py-1.5 text-[11px] font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="all">All Domains</option>
                <option value="lake_ecology">Bhojtal Ecology</option>
                <option value="heritage_infrastructure">Heritage Corridor</option>
                <option value="road_hazard">Road & Transit</option>
                <option value="drainage_flood">Drainage & Sump</option>
              </select>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="rounded-lg border border-slate-700/80 bg-slate-950/80 px-2.5 py-1.5 text-[11px] font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
              </select>
            </div>
          </div>

          {/* Incident Pins List */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                Spatial Incidents ({filteredIncidents.length})
              </h3>
              <span className="font-mono text-[10px] text-slate-400">Click to locate</span>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredIncidents.map((incident) => {
                const isSelected = selectedIncident?.id === incident.id;
                return (
                  <div
                    key={incident.id}
                    onClick={() => setSelectedIncident(incident)}
                    className={`cursor-pointer rounded-xl border p-3 transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/40 ring-1 ring-cyan-500'
                        : 'border-slate-800/80 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-cyan-400">
                        {incident.trackingToken}
                      </span>
                      <SeverityBadge severity={incident.severity} size="sm" />
                    </div>

                    <h4 className="mt-1 text-xs font-semibold text-slate-200 line-clamp-1">
                      {incident.title}
                    </h4>

                    <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span className="truncate max-w-[160px]">{incident.wardName}</span>
                      <StatusBadge status={incident.status} size="sm" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: High-Resolution Spatial Canvas (8 Cols) */}
        <div className="lg:col-span-8">
          <CivicMapCanvas
            incidents={filteredIncidents}
            wards={wards}
            selectedIncidentId={selectedIncident?.id}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            className="h-[680px]"
          />
        </div>
      </div>
    </div>
  );
}
