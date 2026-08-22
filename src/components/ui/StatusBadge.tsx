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
  const config: Record<IncidentStatus, { label: string; bg: string; text: string; dot: string }> = {
    reported: {
      label: 'Reported',
      bg: 'bg-amber-500/10 border-amber-500/20',
      text: 'text-amber-300',
      dot: 'bg-amber-400'
    },
    triaged: {
      label: 'AI Triaged',
      bg: 'bg-purple-500/10 border-purple-500/20',
      text: 'text-purple-300',
      dot: 'bg-purple-400'
    },
    in_progress: {
      label: 'In Progress',
      bg: 'bg-sky-500/10 border-sky-500/20',
      text: 'text-sky-300',
      dot: 'bg-sky-400'
    },
    verified: {
      label: 'Verified',
      bg: 'bg-blue-500/10 border-blue-500/20',
      text: 'text-blue-300',
      dot: 'bg-blue-400'
    },
    resolved: {
      label: 'Resolved',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      text: 'text-emerald-300',
      dot: 'bg-emerald-400'
    },
    archived: {
      label: 'Archived',
      bg: 'bg-slate-800 border-slate-700',
      text: 'text-slate-400',
      dot: 'bg-slate-500'
    }
  };

  const item = config[status] || config.reported;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${item.bg} ${item.text} ${padding}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
      {item.label}
    </span>
  );
}

export function SeverityBadge({ severity, size = 'sm' }: SeverityBadgeProps) {
  const config: Record<IncidentSeverity, { label: string; bg: string; text: string }> = {
    critical: {
      label: 'Critical',
      bg: 'bg-rose-500/10 border-rose-500/20',
      text: 'text-rose-300'
    },
    high: {
      label: 'High',
      bg: 'bg-orange-500/10 border-orange-500/20',
      text: 'text-orange-300'
    },
    medium: {
      label: 'Medium',
      bg: 'bg-amber-500/10 border-amber-500/20',
      text: 'text-amber-300'
    },
    low: {
      label: 'Low',
      bg: 'bg-slate-800/80 border-slate-700/60',
      text: 'text-slate-300'
    }
  };

  const item = config[severity] || config.medium;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center rounded-md font-medium border ${item.bg} ${item.text} ${padding}`}
    >
      {item.label}
    </span>
  );
}

export function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const labels: Record<IncidentCategory, { label: string }> = {
    lake_ecology: { label: 'Lake Ecology' },
    heritage_infrastructure: { label: 'Heritage Infrastructure' },
    sanitation_waste: { label: 'Sanitation & Waste' },
    water_supply: { label: 'Water Supply' },
    road_hazard: { label: 'Road & Bridge' },
    drainage_flood: { label: 'Drainage & Sump' },
    public_lighting: { label: 'Public Lighting' },
    environmental: { label: 'Environmental' }
  };

  const item = labels[category] || { label: category };
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-md border border-slate-700/60 bg-slate-800/60 font-medium text-slate-300 ${padding}`}>
      {item.label}
    </span>
  );
}
