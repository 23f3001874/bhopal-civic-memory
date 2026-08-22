import React from 'react';
import Link from 'next/link';
import { CivicIncident } from '@/types/incident';
import { StatusBadge, SeverityBadge, CategoryBadge } from '@/components/ui/StatusBadge';
import { ThumbsUp, MapPin, Clock, Brain, ArrowUpRight, AlertTriangle } from 'lucide-react';
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
    <div className="group relative rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/90 shadow-lg shadow-black/30">
      {/* Top Header info */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-slate-400">
            {incident.trackingToken}
          </span>
          <span className="text-slate-600">•</span>
          <CategoryBadge category={incident.category} />
        </div>
        <div className="flex items-center gap-2">
          <SeverityBadge severity={incident.severity} />
          <StatusBadge status={incident.status} />
        </div>
      </div>

      {/* Title and Description */}
      <div className="mt-3">
        <Link
          href={`/incidents/${incident.id}`}
          className="group-hover:text-cyan-400 text-base font-semibold text-slate-100 transition-colors inline-flex items-center gap-1.5"
        >
          {incident.title}
          <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 text-cyan-400" />
        </Link>
        <p className="mt-2 text-sm text-slate-300 line-clamp-2 leading-relaxed font-sans">
          {incident.description}
        </p>
      </div>

      {/* Epistemic AI Triage insight pill */}
      {triage && !triage.ai_unavailable && (
        <div className="mt-3.5 flex items-start gap-2.5 rounded-lg border border-purple-900/40 bg-purple-950/20 px-3 py-2 text-xs text-purple-200">
          <Brain className="h-4 w-4 shrink-0 text-purple-400 mt-0.5" />
          <div className="space-y-0.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-purple-300">
              <span className="font-bold">Urgency Score: {triage.urgency_score}/100</span>
              <span>•</span>
              <span className="truncate max-w-[200px] text-slate-300">
                {triage.suggested_department}
              </span>
              {triage.is_simulated && (
                <span className="rounded bg-amber-950/80 border border-amber-800/60 px-1.5 py-0.2 text-[9px] text-amber-300">
                  Simulated
                </span>
              )}
            </div>
            <p className="text-slate-300 line-clamp-1 font-sans">
              {triage.observations[0] || triage.citizen_claims[0] || 'Epistemic triage complete.'}
            </p>
          </div>
        </div>
      )}

      {/* Footer location, time & actions */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/40 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-slate-300">
            <MapPin className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-medium">{incident.wardName}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-slate-400 font-mono text-[11px]">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            {timeAgo(incident.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => upvoteIncident(incident.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-800/50 px-2.5 py-1 text-xs font-mono text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-700/50 hover:text-white"
            title="Corroborate / Upvote this incident"
          >
            <ThumbsUp className="h-3.5 w-3.5 text-cyan-400" />
            <span>{incident.corroborationCount}</span>
          </button>

          <Link
            href={`/incidents/${incident.id}`}
            className="inline-flex items-center gap-1 rounded-lg border border-cyan-900/60 bg-cyan-950/40 px-3 py-1 font-mono text-xs font-medium text-cyan-300 transition-all hover:border-cyan-600 hover:bg-cyan-900/50"
          >
            View Record
          </Link>
        </div>
      </div>
    </div>
  );
}
