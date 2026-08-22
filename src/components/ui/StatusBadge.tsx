import React from 'react';
import { IncidentCategory, IncidentSeverity, IncidentStatus } from '@/types/incident';

interface StatusBadgeProps {
  status: IncidentStatus;
  size?: 'sm' | 'md';
}

interface SeverityBadgeProps {
  severity: IncidentSeverity;
  size?: 'sm' | 'md';
}

interface CategoryBadgeProps {
  category: IncidentCategory;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config: Record<IncidentStatus, { label: string; bg: string; text: string; border: string; dot: string }> = {
    reported: {
      label: 'Reported',
      bg: 'bg-amber-950/40',
      text: 'text-amber-300',
      border: 'border-amber-700/50',
      dot: 'bg-amber-400'
    },
    triaged: {
      label: 'AI Triaged',
      bg: 'bg-purple-950/40',
      text: 'text-purple-300',
      border: 'border-purple-700/50',
      dot: 'bg-purple-400 animate-pulse'
    },
    in_progress: {
      label: 'Field Ops Active',
      bg: 'bg-cyan-950/40',
      text: 'text-cyan-300',
      border: 'border-cyan-700/50',
      dot: 'bg-cyan-400 animate-pulse'
    },
    verified: {
      label: 'Verified',
      bg: 'bg-blue-950/40',
      text: 'text-blue-300',
      border: 'border-blue-700/50',
      dot: 'bg-blue-400'
    },
    resolved: {
      label: 'Resolved',
      bg: 'bg-emerald-950/40',
      text: 'text-emerald-300',
      border: 'border-emerald-700/50',
      dot: 'bg-emerald-400'
    },
    archived: {
      label: 'Archived',
      bg: 'bg-slate-900/60',
      text: 'text-slate-400',
      border: 'border-slate-800',
      dot: 'bg-slate-500'
    }
  };

  const item = config[status] || config.reported;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-medium border ${item.bg} ${item.text} ${item.border} ${padding}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
      {item.label}
    </span>
  );
}

export function SeverityBadge({ severity, size = 'sm' }: SeverityBadgeProps) {
  const config: Record<IncidentSeverity, { label: string; bg: string; text: string; border: string }> = {
    critical: {
      label: 'CRITICAL',
      bg: 'bg-red-950/50',
      text: 'text-red-300',
      border: 'border-red-600/60'
    },
    high: {
      label: 'HIGH',
      bg: 'bg-orange-950/50',
      text: 'text-orange-300',
      border: 'border-orange-600/50'
    },
    medium: {
      label: 'MEDIUM',
      bg: 'bg-yellow-950/40',
      text: 'text-yellow-300',
      border: 'border-yellow-600/40'
    },
    low: {
      label: 'LOW',
      bg: 'bg-slate-900/60',
      text: 'text-slate-300',
      border: 'border-slate-700'
    }
  };

  const item = config[severity] || config.medium;
  const padding = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center rounded font-mono font-semibold tracking-wider border uppercase ${item.bg} ${item.text} ${item.border} ${padding}`}
    >
      {item.label}
    </span>
  );
}

export function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const labels: Record<IncidentCategory, { label: string; color: string }> = {
    lake_ecology: { label: 'Bhojtal Ecology', color: 'text-teal-300 border-teal-800/60 bg-teal-950/40' },
    heritage_infrastructure: { label: 'Heritage Corridor', color: 'text-amber-300 border-amber-800/60 bg-amber-950/40' },
    sanitation_waste: { label: 'Sanitation & SWM', color: 'text-lime-300 border-lime-800/60 bg-lime-950/40' },
    water_supply: { label: 'Water Supply (PHE)', color: 'text-sky-300 border-sky-800/60 bg-sky-950/40' },
    road_hazard: { label: 'Road & Transit', color: 'text-rose-300 border-rose-800/60 bg-rose-950/40' },
    drainage_flood: { label: 'Drainage / Sump', color: 'text-blue-300 border-blue-800/60 bg-blue-950/40' },
    public_lighting: { label: 'Smart Lighting', color: 'text-yellow-300 border-yellow-800/60 bg-yellow-950/40' },
    environmental: { label: 'Air & Flora', color: 'text-emerald-300 border-emerald-800/60 bg-emerald-950/40' }
  };

  const item = labels[category] || { label: category, color: 'text-slate-300 border-slate-700 bg-slate-900' };
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-md border font-sans font-medium ${item.color} ${padding}`}>
      {item.label}
    </span>
  );
}
