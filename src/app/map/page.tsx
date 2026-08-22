'use client';

import React, { useState } from 'react';
import { useCivic } from '@/lib/context/CivicContext';
import { CivicMapCanvas } from '@/components/ui/CivicMapCanvas';
import { StatusBadge, SeverityBadge, CategoryBadge } from '@/components/ui/StatusBadge';
import {
  MapPin,
  Layers,
  Search,
  ArrowUpRight,
  Sparkles,
  ArrowLeft
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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <Layers className="h-4 w-4" />
            <span>Spatial Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Municipal Ward & Catchment Map
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Multi-layered spatial visualization of Bhoj Wetland (Ramsar Site #1206), heritage corridors, and municipal dispatches.
          </p>
        </div>

        <Link
          href="/report"
          className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition-colors shadow-sm shrink-0"
        >
          <span>Report at Location</span>
        </Link>
      </div>

      {/* Main Map Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Incidents Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search pins or wards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>

            {/* Quick Filters */}
            <div className="grid grid-cols-2 gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
              >
                <option value="all">All Domains</option>
                <option value="lake_ecology">Lake Ecology</option>
                <option value="heritage_infrastructure">Heritage</option>
                <option value="road_hazard">Road & Transit</option>
                <option value="drainage_flood">Drainage & Sump</option>
              </select>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Incident Pins List */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800 text-slate-400">
              <span className="font-semibold text-slate-200">Incident Locations</span>
              <span className="font-mono">{filteredIncidents.length} pins</span>
            </div>

            <div className="max-h-[440px] space-y-2 overflow-y-auto pr-1">
              {filteredIncidents.map((inc) => {
                const isSelected = selectedIncident?.id === inc.id;
                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    className={`cursor-pointer rounded-lg p-3 border transition-colors space-y-1.5 text-xs ${
                      isSelected
                        ? 'border-sky-500/50 bg-sky-500/10'
                        : 'border-slate-800/80 bg-slate-950/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-slate-400">{inc.trackingToken}</span>
                      <SeverityBadge severity={inc.severity} />
                    </div>
                    <div className="font-medium text-slate-200 line-clamp-1">{inc.title}</div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <MapPin className="h-3 w-3 text-slate-500" />
                      <span>{inc.wardName}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Map Canvas & Selected Pin Detail (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 space-y-3">
            <CivicMapCanvas
              incidents={filteredIncidents}
              wards={wards}
              selectedIncidentId={selectedIncident?.id}
              className="h-[460px] rounded-lg border border-slate-800"
            />
          </div>

          {/* Selected Incident Drawer */}
          {selectedIncident && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {selectedIncident.trackingToken}
                  </span>
                  <CategoryBadge category={selectedIncident.category} />
                  <SeverityBadge severity={selectedIncident.severity} />
                </div>

                <Link
                  href={`/incidents/${selectedIncident.id}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-300"
                >
                  View Full File <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">{selectedIncident.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedIncident.description}</p>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  {selectedIncident.wardName}
                </span>
                <span>•</span>
                <span>{selectedIncident.departmentAssigned}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
