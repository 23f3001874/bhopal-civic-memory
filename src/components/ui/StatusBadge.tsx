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
      bg: 'bg-white/[0.04] border-white/[0.08]',
      text: 'text-[#A7AFBD]',
      dot: 'bg-amber-400'
    },
    triaged: {
      label: 'Triaged',
      bg: 'bg-[#007CF0]/10 border-[#007CF0]/25',
      text: 'text-[#00DFD8]',
      dot: 'bg-[#00DFD8]'
    },
    in_progress: {
      label: 'In Progress',
      bg: 'bg-cyan-500/10 border-cyan-500/25',
      text: 'text-cyan-300',
      dot: 'bg-cyan-400'
    },
    verified: {
      label: 'Verified',
      bg: 'bg-[#7928CA]/15 border-[#7928CA]/30',
      text: 'text-purple-300',
      dot: 'bg-purple-400'
    },
    resolved: {
      label: 'Resolved',
      bg: 'bg-emerald-500/10 border-emerald-500/25',
      text: 'text-emerald-400',
      dot: 'bg-emerald-400'
    },
    archived: {
      label: 'Archived',
      bg: 'bg-white/[0.02] border-white/[0.06]',
      text: 'text-[#687386]',
      dot: 'bg-[#687386]'
    }
  };

  const item = config[status] || config.reported;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-mono border ${item.bg} ${item.text} ${padding}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
      {item.label}
    </span>
  );
}

export function SeverityBadge({ severity, size = 'sm' }: SeverityBadgeProps) {
  const config: Record<IncidentSeverity, { label: string; bg: string; text: string; dot: string }> = {
    critical: {
      label: 'Critical',
      bg: 'bg-rose-500/10 border-rose-500/25',
      text: 'text-rose-400',
      dot: 'bg-rose-500'
    },
    high: {
      label: 'High',
      bg: 'bg-amber-500/10 border-amber-500/25',
      text: 'text-amber-400',
      dot: 'bg-amber-400'
    },
    medium: {
      label: 'Medium',
      bg: 'bg-blue-500/10 border-blue-500/20',
      text: 'text-sky-300',
      dot: 'bg-sky-400'
    },
    low: {
      label: 'Low',
      bg: 'bg-white/[0.03] border-white/[0.08]',
      text: 'text-[#A7AFBD]',
      dot: 'bg-[#A7AFBD]'
    }
  };

  const item = config[severity] || config.medium;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-mono uppercase tracking-wider border ${item.bg} ${item.text} ${padding}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
      {item.label}
    </span>
  );
}

export function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const labels: Record<IncidentCategory, string> = {
    lake_ecology: 'Lake Ecology',
    heritage_infrastructure: 'Heritage',
    sanitation_waste: 'Sanitation',
    water_supply: 'Water Supply',
    road_hazard: 'Roads & Transit',
    drainage_flood: 'Drainage & Sump',
    public_lighting: 'Public Lighting',
    environmental: 'Environmental'
  };

  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center rounded-md border border-white/[0.08] bg-white/[0.03] font-mono text-[#A7AFBD] ${padding}`}
    >
      {labels[category] || category}
    </span>
  );
}
