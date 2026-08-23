'use client';

import React, { useState } from 'react';
import { CivicIncident, BhopalWard } from '@/types/incident';
import { StatusBadge, SeverityBadge, CategoryBadge } from '@/components/ui/StatusBadge';
import { MapPin, Navigation, ShieldAlert, Sparkles, X, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface CivicMapCanvasProps {
  incidents: CivicIncident[];
  wards: BhopalWard[];
  selectedIncidentId?: string | null;
  onSelectIncident?: (incident: CivicIncident | null) => void;
  className?: string;
  showControls?: boolean;
}

export function CivicMapCanvas({
  incidents,
  wards,
  selectedIncidentId,
  onSelectIncident,
  className = '',
  showControls = true
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

  // Bhopal Geo-projection helper
  const getCoordinatesPct = (lat: number, lng: number) => {
    const minLat = 23.16;
    const maxLat = 23.28;
    const minLng = 77.35;
    const maxLng = 77.49;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;

    return {
      x: Math.min(Math.max(x, 8), 92),
      y: Math.min(Math.max(y, 8), 92)
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
      className={`relative w-full h-[580px] rounded-xl border border-white/[0.08] bg-[#05070B] overflow-hidden select-none shadow-sm ${className}`}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      {/* Top Map Tactical Bar */}
      {showControls && (
        <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#05070B]/90 px-3 py-1.5 backdrop-blur-xl">
            <Navigation className="h-3 w-3 text-[#00DFD8]" />
            <span className="text-xs font-semibold text-[#F5F7FA]">
              Bhopal Spatial Grid
            </span>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span className="text-[10px] text-[#A7AFBD] font-mono hidden sm:inline">
              Ramsar Site #1206
            </span>
          </div>

          {/* Layer Filters */}
          <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-[#05070B]/90 p-1 backdrop-blur-xl text-xs">
            <button
              onClick={() => setActiveLayer('all')}
              className={`rounded px-2.5 py-1 text-xs transition-colors ${
                activeLayer === 'all'
                  ? 'bg-white/[0.08] text-white font-medium shadow-sm'
                  : 'text-[#A7AFBD] hover:text-[#F5F7FA]'
              }`}
            >
              All ({incidents.length})
            </button>
            <button
              onClick={() => setActiveLayer('critical')}
              className={`rounded px-2.5 py-1 text-xs transition-colors ${
                activeLayer === 'critical'
                  ? 'bg-rose-500/20 text-rose-300 font-medium'
                  : 'text-[#A7AFBD] hover:text-[#F5F7FA]'
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setActiveLayer('lake_ecology')}
              className={`rounded px-2.5 py-1 text-xs transition-colors ${
                activeLayer === 'lake_ecology'
                  ? 'bg-[#00DFD8]/20 text-[#00DFD8] font-medium'
                  : 'text-[#A7AFBD] hover:text-[#F5F7FA]'
              }`}
            >
              Lake Ecology
            </button>
          </div>
        </div>
      )}

      {/* Map SVG Layer */}
      <svg className="w-full h-full" viewBox="0 0 1000 620" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#007CF0" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#00DFD8" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="lowerLakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#007CF0" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#7928CA" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        {/* 1. Upper Lake (Bhojtal) Vector Polygon */}
        <path
          d="M 120 280 Q 180 200 320 240 T 460 300 Q 420 370 330 380 T 160 340 Z"
          fill="url(#lakeGrad)"
          stroke="#007CF0"
          strokeWidth="1.2"
          strokeDasharray="4 2"
        />
        <text
          x="260"
          y="300"
          fill="#00DFD8"
          fontSize="11"
          fontWeight="600"
          letterSpacing="1.5"
          opacity="0.85"
        >
          BHOJTAL / UPPER LAKE
        </text>

        {/* VIP Road Causeway Line */}
        <path
          d="M 280 230 Q 360 250 440 270"
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="4 3"
        />
        <text x="360" y="240" fill="#fbbf24" fontSize="9" opacity="0.8">
          VIP Road
        </text>

        {/* 2. Lower Lake (Chhota Talab) */}
        <path
          d="M 440 320 Q 490 310 520 345 T 480 375 Q 435 360 440 320 Z"
          fill="url(#lowerLakeGrad)"
          stroke="#007CF0"
          strokeWidth="1"
        />
        <text x="455" y="348" fill="#00DFD8" fontSize="9" opacity="0.75">
          LOWER LAKE
        </text>

        {/* Ward Boundaries & Sectors */}
        <rect
          x="420"
          y="110"
          width="190"
          height="140"
          rx="8"
          fill="rgba(255,255,255,0.02)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text x="435" y="135" fill="#A7AFBD" fontSize="10" fontWeight="500">
          W-12 • Old City / Chowk
        </text>

        <rect
          x="380"
          y="370"
          width="170"
          height="120"
          rx="8"
          fill="rgba(255,255,255,0.02)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text x="395" y="395" fill="#A7AFBD" fontSize="10" fontWeight="500">
          W-24 • TT Nagar
        </text>

        <rect
          x="600"
          y="280"
          width="200"
          height="140"
          rx="8"
          fill="rgba(255,255,255,0.02)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text x="615" y="305" fill="#A7AFBD" fontSize="10" fontWeight="500">
          W-45 • MP Nagar
        </text>

        <rect
          x="580"
          y="435"
          width="190"
          height="120"
          rx="8"
          fill="rgba(255,255,255,0.02)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text x="595" y="460" fill="#A7AFBD" fontSize="10" fontWeight="500">
          W-52 • Arera Colony
        </text>

        <rect
          x="440"
          y="500"
          width="170"
          height="100"
          rx="8"
          fill="rgba(255,255,255,0.02)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text x="455" y="525" fill="#A7AFBD" fontSize="10" fontWeight="500">
          W-33 • Kolar Road
        </text>

        <rect
          x="780"
          y="150"
          width="180"
          height="140"
          rx="8"
          fill="rgba(255,255,255,0.02)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text x="795" y="175" fill="#A7AFBD" fontSize="10" fontWeight="500">
          W-68 • BHEL Township
        </text>
      </svg>

      {/* Interactive Incident Markers Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {visibleIncidents.map((incident) => {
          const { x, y } = getCoordinatesPct(incident.latitude, incident.longitude);
          const isSelected = activeSelected?.id === incident.id;
          const isCritical = incident.severity === 'critical';

          const markerColor =
            incident.status === 'resolved'
              ? 'bg-emerald-500 text-black border-emerald-300'
              : isCritical
              ? 'bg-rose-500 text-white border-rose-300'
              : incident.severity === 'high'
              ? 'bg-amber-500 text-black border-amber-300'
              : incident.category === 'lake_ecology'
              ? 'bg-[#00DFD8] text-black border-cyan-200'
              : 'bg-[#007CF0] text-white border-blue-200';

          return (
            <div
              key={incident.id}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
              onClick={() => handleMarkerClick(incident)}
              onMouseEnter={() => setHoveredIncident(incident)}
              onMouseLeave={() => setHoveredIncident(null)}
            >
              <div
                className={`relative flex items-center justify-center h-6 w-6 rounded-full border text-xs shadow-md transition-all hover:scale-125 ${markerColor} ${
                  isSelected ? 'ring-2 ring-white scale-125 z-30' : 'z-10'
                }`}
              >
                {incident.severity === 'critical' ? (
                  <ShieldAlert className="h-3 w-3" />
                ) : (
                  <MapPin className="h-3 w-3" />
                )}
              </div>

              <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col items-center z-40 pointer-events-none">
                <div className="card-surface px-2.5 py-1 shadow-xl text-center whitespace-nowrap">
                  <p className="text-[11px] font-medium text-[#F5F7FA]">
                    {incident.title}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Incident Drawer / Popover */}
      {activeSelected && (
        <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-80 max-h-[calc(100%-1.5rem)] overflow-y-auto z-30 card-surface p-4 shadow-2xl backdrop-blur-xl pointer-events-auto space-y-3">
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/[0.08]">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono text-[11px] text-[#A7AFBD] bg-white/[0.04] border border-white/[0.08] px-1.5 py-0.5 rounded">
                  {activeSelected.trackingToken}
                </span>
                <CategoryBadge category={activeSelected.category} />
              </div>
              <h4 className="text-xs font-semibold text-[#F5F7FA] truncate">
                {activeSelected.title}
              </h4>
            </div>
            <button
              onClick={() => {
                setSelectedIncidentInternal(null);
                if (onSelectIncident) onSelectIncident(null);
              }}
              className="rounded p-1 text-[#687386] hover:bg-white/[0.06] hover:text-[#F5F7FA] transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 text-xs text-[#A7AFBD]">
            <div className="flex justify-between">
              <span className="text-[#687386]">Location:</span>
              <span className="text-[#F5F7FA] font-medium truncate max-w-[180px]">
                {activeSelected.locationName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#687386]">Department:</span>
              <span className="text-[#A7AFBD] truncate max-w-[180px]">
                {activeSelected.departmentAssigned}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/[0.08] text-xs">
            <StatusBadge status={activeSelected.status} />
            <Link
              href={`/incidents/${activeSelected.id}`}
              className="inline-flex items-center gap-1 btn-primary px-2.5 py-1 text-xs font-medium text-white shadow-sm"
            >
              <span>Open File</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
