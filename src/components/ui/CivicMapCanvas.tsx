'use client';

import React, { useState } from 'react';
import { CivicIncident, BhopalWard } from '@/types/incident';
import { StatusBadge, SeverityBadge, CategoryBadge } from '@/components/ui/StatusBadge';
import { MapPin, Navigation, Layers, ShieldAlert, Sparkles, X, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface CivicMapCanvasProps {
  incidents: CivicIncident[];
  wards: BhopalWard[];
  selectedIncidentId?: string | null;
  onSelectIncident?: (incident: CivicIncident | null) => void;
  className?: string;
}

export function CivicMapCanvas({
  incidents,
  wards,
  selectedIncidentId,
  onSelectIncident,
  className = ''
}: CivicMapCanvasProps) {
  const [activeLayer, setActiveLayer] = useState<'all' | 'lake_ecology' | 'heritage_infrastructure' | 'critical'>('all');
  const [hoveredIncident, setHoveredIncident] = useState<CivicIncident | null>(null);
  const [selectedIncidentInternal, setSelectedIncidentInternal] = useState<CivicIncident | null>(null);

  // Focus incident
  const activeSelected = selectedIncidentId
    ? incidents.find((i) => i.id === selectedIncidentId) || null
    : selectedIncidentInternal;

  // Filtered incidents
  const visibleIncidents = incidents.filter((inc) => {
    if (activeLayer === 'all') return true;
    if (activeLayer === 'critical') return inc.severity === 'critical';
    return inc.category === activeLayer;
  });

  // Bhopal Geo-projection helper:
  // Lat: ~23.16 to 23.28 (12km span)
  // Lng: ~77.35 to 77.49 (14km span)
  const getCoordinatesPct = (lat: number, lng: number) => {
    const minLat = 23.16;
    const maxLat = 23.28;
    const minLng = 77.35;
    const maxLng = 77.49;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100; // Invert for SVG coordinates

    return {
      x: Math.min(Math.max(x, 5), 95),
      y: Math.min(Math.max(y, 5), 95)
    };
  };

  const handleMarkerClick = (incident: CivicIncident) => {
    setSelectedIncidentInternal(incident);
    if (onSelectIncident) {
      onSelectIncident(incident);
    }
  };

  return (
    <div
      className={`relative w-full h-[620px] rounded-2xl border border-slate-800 bg-[#080C14] overflow-hidden select-none shadow-2xl ${className}`}
    >
      {/* Background Grid & Radar Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-cyan-950/10 via-transparent to-slate-950 pointer-events-none" />

      {/* Top Map Tactical Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-2 rounded-xl border border-slate-800/90 bg-slate-900/90 px-3.5 py-2 backdrop-blur-md shadow-lg">
          <Navigation className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span className="font-mono text-xs font-semibold text-slate-200">
            BHOPAL CIVIC SPATIAL GRID
          </span>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-[11px] text-slate-400">
            23.2599° N, 77.4126° E • RAMSAR SITE #1206
          </span>
        </div>

        {/* Tactical Layer Filter */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-800/90 bg-slate-900/90 p-1 backdrop-blur-md shadow-lg">
          <button
            onClick={() => setActiveLayer('all')}
            className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-all ${
              activeLayer === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Incidents ({incidents.length})
          </button>
          <button
            onClick={() => setActiveLayer('critical')}
            className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-all ${
              activeLayer === 'critical'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Critical Alert ({incidents.filter((i) => i.severity === 'critical').length})
          </button>
          <button
            onClick={() => setActiveLayer('lake_ecology')}
            className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-all ${
              activeLayer === 'lake_ecology'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bhojtal Ecology
          </button>
        </div>
      </div>

      {/* Map SVG Layer */}
      <svg className="w-full h-full" viewBox="0 0 1000 620" preserveAspectRatio="none">
        {/* Defs for gradients & glows */}
        <defs>
          <linearGradient id="lakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d9488" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0891b2" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="lowerLakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="shahpuraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0f766e" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Upper Lake (Bhojtal) Vector Polygon */}
        <path
          d="M 120 280 Q 180 200 320 240 T 460 300 Q 420 370 330 380 T 160 340 Z"
          fill="url(#lakeGrad)"
          stroke="#14b8a6"
          strokeWidth="1.5"
          strokeDasharray="4 2"
          className="transition-all duration-300"
        />
        <text
          x="260"
          y="300"
          fill="#5eead4"
          fontSize="13"
          fontFamily="monospace"
          fontWeight="bold"
          letterSpacing="2"
          opacity="0.8"
        >
          BHOJTAL / UPPER LAKE
        </text>
        <text
          x="260"
          y="318"
          fill="#2dd4bf"
          fontSize="10"
          fontFamily="monospace"
          opacity="0.6"
        >
          RAMSAR WETLAND CATCHMENT (31 km²)
        </text>

        {/* VIP Road Causeway Line */}
        <path
          d="M 280 230 Q 360 250 440 270"
          stroke="#f59e0b"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="6 3"
        />
        <text x="360" y="240" fill="#fcd34d" fontSize="9" fontFamily="monospace">
          VIP Road Corridor
        </text>

        {/* 2. Lower Lake (Chhota Talab) */}
        <path
          d="M 440 320 Q 490 310 520 345 T 480 375 Q 435 360 440 320 Z"
          fill="url(#lowerLakeGrad)"
          stroke="#06b6d4"
          strokeWidth="1.2"
        />
        <text x="455" y="348" fill="#67e8f9" fontSize="10" fontFamily="monospace" opacity="0.8">
          LOWER LAKE
        </text>

        {/* 3. Shahpura Lake */}
        <path
          d="M 520 440 Q 560 430 580 460 T 540 485 Q 510 470 520 440 Z"
          fill="url(#shahpuraGrad)"
          stroke="#2dd4bf"
          strokeWidth="1"
        />
        <text x="525" y="465" fill="#a7f3d0" fontSize="9" fontFamily="monospace" opacity="0.7">
          Shahpura Lake
        </text>

        {/* Ward Boundaries & Sectors */}
        <rect
          x="420"
          y="110"
          width="190"
          height="140"
          rx="12"
          fill="#1e1b4b"
          fillOpacity="0.18"
          stroke="#6366f1"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text x="435" y="135" fill="#a5b4fc" fontSize="11" fontFamily="monospace" fontWeight="600">
          W-12 • OLD BHOPAL / CHOWK
        </text>

        <rect
          x="380"
          y="370"
          width="170"
          height="120"
          rx="12"
          fill="#0c4a6e"
          fillOpacity="0.18"
          stroke="#0284c7"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text x="395" y="395" fill="#7dd3fc" fontSize="11" fontFamily="monospace" fontWeight="600">
          W-24 • TT NAGAR
        </text>

        <rect
          x="600"
          y="280"
          width="200"
          height="140"
          rx="12"
          fill="#701a75"
          fillOpacity="0.18"
          stroke="#c026d3"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text x="615" y="305" fill="#f0abfc" fontSize="11" fontFamily="monospace" fontWeight="600">
          W-45 • MP NAGAR COMMERCIAL
        </text>

        <rect
          x="580"
          y="435"
          width="190"
          height="120"
          rx="12"
          fill="#064e3b"
          fillOpacity="0.18"
          stroke="#059669"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text x="595" y="460" fill="#6ee7b7" fontSize="11" fontFamily="monospace" fontWeight="600">
          W-52 • ARERA COLONY
        </text>

        <rect
          x="440"
          y="500"
          width="170"
          height="100"
          rx="12"
          fill="#7c2d12"
          fillOpacity="0.18"
          stroke="#ea580c"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text x="455" y="525" fill="#fdba74" fontSize="11" fontFamily="monospace" fontWeight="600">
          W-33 • KOLAR ROAD
        </text>

        <rect
          x="780"
          y="150"
          width="180"
          height="140"
          rx="12"
          fill="#1e293b"
          fillOpacity="0.4"
          stroke="#475569"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text x="795" y="175" fill="#cbd5e1" fontSize="11" fontFamily="monospace" fontWeight="600">
          W-68 • BHEL TOWNSHIP
        </text>
      </svg>

      {/* Interactive Incident Markers Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {visibleIncidents.map((incident) => {
          const { x, y } = getCoordinatesPct(incident.latitude, incident.longitude);
          const isSelected = activeSelected?.id === incident.id;
          const isCritical = incident.severity === 'critical';

          const markerColor =
            incident.category === 'lake_ecology'
              ? 'bg-teal-500 text-teal-950 border-teal-200'
              : incident.category === 'heritage_infrastructure'
              ? 'bg-amber-500 text-amber-950 border-amber-200'
              : isCritical
              ? 'bg-rose-500 text-rose-950 border-rose-200'
              : 'bg-cyan-500 text-cyan-950 border-cyan-200';

          return (
            <div
              key={incident.id}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
              onClick={() => handleMarkerClick(incident)}
              onMouseEnter={() => setHoveredIncident(incident)}
              onMouseLeave={() => setHoveredIncident(null)}
            >
              {isCritical && (
                <span className="absolute -inset-2 rounded-full bg-rose-500/40 animate-ping" />
              )}

              <div
                className={`relative flex items-center justify-center h-8 w-8 rounded-full border-2 font-mono text-xs font-bold shadow-xl transition-transform duration-200 hover:scale-125 ${markerColor} ${
                  isSelected ? 'ring-4 ring-cyan-400 scale-125 z-30' : 'z-10'
                }`}
              >
                {incident.severity === 'critical' ? (
                  <ShieldAlert className="h-4 w-4" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
              </div>

              <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-40 pointer-events-none">
                <div className="rounded-lg border border-slate-700 bg-slate-900/95 px-2.5 py-1.5 shadow-2xl backdrop-blur-md whitespace-nowrap text-center">
                  <p className="font-mono text-[11px] font-semibold text-slate-200">
                    {incident.trackingToken}
                  </p>
                  <p className="text-xs text-cyan-300 font-sans max-w-[200px] truncate">
                    {incident.title}
                  </p>
                </div>
                <div className="w-2 h-2 bg-slate-900 border-r border-b border-slate-700 rotate-45 -mt-1" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Left Legend */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-3 rounded-xl border border-slate-800/90 bg-slate-900/90 px-3.5 py-2 backdrop-blur-md text-xs font-mono text-slate-400 shadow-lg pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-teal-400" />
          <span>Bhojtal Wetland</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span>Heritage Corridor</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400 animate-pulse" />
          <span>Critical Ops</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
          <span>Civic Infrastructure</span>
        </div>
      </div>

      {/* Selected Incident Drawer / Popover */}
      {activeSelected && (
        <div className="absolute bottom-4 right-4 z-30 w-96 rounded-2xl border border-slate-700 bg-slate-900/95 p-5 shadow-2xl backdrop-blur-xl pointer-events-auto animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-400">
                  {activeSelected.trackingToken}
                </span>
                <CategoryBadge category={activeSelected.category} />
              </div>
              <h4 className="mt-1 text-sm font-semibold text-slate-100 line-clamp-1">
                {activeSelected.title}
              </h4>
            </div>
            <button
              onClick={() => {
                setSelectedIncidentInternal(null);
                if (onSelectIncident) onSelectIncident(null);
              }}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Ward & Zone:</span>
              <span className="font-medium text-slate-200">{activeSelected.wardName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Location:</span>
              <span className="font-medium text-slate-200">{activeSelected.locationName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Assigned Unit:</span>
              <span className="font-mono text-cyan-400">{activeSelected.departmentAssigned}</span>
            </div>
          </div>

          {activeSelected.triageResult && !activeSelected.triageResult.ai_unavailable && (
            <div className="mt-3 rounded-lg border border-purple-900/50 bg-purple-950/30 p-2.5 text-xs text-purple-200">
              <div className="flex items-center justify-between font-mono text-[11px] text-purple-300">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  <span>Claude Urgency: {activeSelected.triageResult.urgency_score}/100</span>
                </div>
                {activeSelected.triageResult.is_simulated && (
                  <span className="text-[9px] text-amber-300 bg-amber-950 px-1 py-0.2 rounded border border-amber-800">
                    Simulated
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-slate-300 line-clamp-2">
                {activeSelected.triageResult.observations[0] ||
                  activeSelected.triageResult.citizen_claims[0] ||
                  'Triage complete.'}
              </p>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            <StatusBadge status={activeSelected.status} />
            <Link
              href={`/incidents/${activeSelected.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-700 bg-cyan-950/60 px-3 py-1.5 font-mono text-xs font-semibold text-cyan-300 hover:bg-cyan-900 transition-colors"
            >
              Open Incident File
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
