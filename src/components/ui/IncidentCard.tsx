import React from 'react';
import Link from 'next/link';
import { CivicIncident } from '@/types/incident';
import { StatusBadge, SeverityBadge, CategoryBadge } from '@/components/ui/StatusBadge';
import { ThumbsUp, MapPin, Clock, ArrowUpRight, Sparkles } from 'lucide-react';
import { useCivic } from '@/lib/context/CivicContext';

interface IncidentCardProps {
  incident: CivicIncident;
}

export function IncidentCard({ incident }: IncidentCardProps) {
  const { upvoteIncident } = useCivic();

  const timeAgo = (dateStr: string) => {
    const diffHours = Math.floor(
      (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60)
    );
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const triage = incident.triageResult;

  return (
    <div className="group rounded-xl border border-slate-800/90 bg-slate-900/40 p-5 transition-all hover:border-slate-700 hover:bg-slate-900/70 shadow-sm">
      {/* Top Header info */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-slate-400">
            {incident.trackingToken}
          </span>
          <span className="text-slate-700">•</span>
          <CategoryBadge category={incident.category} />
        </div>
        <div className="flex items-center gap-2">
          <SeverityBadge severity={incident.severity} />
          <StatusBadge status={incident.status} />
        </div>
      </div>

      {/* Title and Description */}
      <div className="mt-3.5 space-y-1.5">
        <Link
          href={`/incidents/${incident.id}`}
          className="text-base font-semibold text-slate-100 group-hover:text-white transition-colors inline-flex items-center gap-1.5"
        >
          {incident.title}
          <ArrowUpRight className="h-4 w-4 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-sky-400" />
        </Link>
        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
          {incident.description}
        </p>
      </div>

      {/* Triage insight snippet */}
      {triage && !triage.ai_unavailable && (
        <div className="mt-3.5 rounded-lg border border-slate-800 bg-slate-950/40 px-3.5 py-2.5 text-xs text-slate-300 space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-2 text-slate-400">
            <span className="font-medium text-slate-200 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-sky-400" />
              {triage.suggested_department}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Urgency: {triage.urgency_score}/100
            </span>
          </div>
          <p className="text-slate-400 text-xs line-clamp-1">
            {triage.observations[0] || triage.citizen_claims[0] || 'Epistemic triage complete.'}
          </p>
        </div>
      )}

      {/* Footer location, time & actions */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-slate-300">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span>{incident.wardName}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-slate-400 font-mono text-[11px]">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {timeAgo(incident.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => upvoteIncident(incident.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-800/40 px-2.5 py-1 text-xs text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
            title="Corroborate this incident"
          >
            <ThumbsUp className="h-3.5 w-3.5 text-slate-400" />
            <span>{incident.corroborationCount}</span>
          </button>

          <Link
            href={`/incidents/${incident.id}`}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
          >
            View File
          </Link>
        </div>
      </div>
    </div>
  );
}
