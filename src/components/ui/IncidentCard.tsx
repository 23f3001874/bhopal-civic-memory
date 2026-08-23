import React from 'react';
import Link from 'next/link';
import { CivicIncident } from '@/types/incident';
import { StatusBadge, SeverityBadge, CategoryBadge } from '@/components/ui/StatusBadge';
import { ThumbsUp, MapPin, Clock, ArrowUpRight, Sparkles, ShieldCheck, Repeat } from 'lucide-react';
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
    <div className="group card-surface p-5 flex flex-col justify-between hover:border-white/[0.14] transition-all">
      <div>
        {/* Top Header info */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#A7AFBD] font-medium tracking-wide">
              {incident.trackingToken}
            </span>
            <span className="text-white/20">•</span>
            <CategoryBadge category={incident.category} />
          </div>
          <div className="flex items-center gap-1.5">
            <SeverityBadge severity={incident.severity} />
            <StatusBadge status={incident.status} />
          </div>
        </div>

        {/* Title and Description */}
        <div className="mt-3.5 space-y-1.5">
          <Link
            href={`/incidents/${incident.id}`}
            className="text-base font-semibold text-[#F5F7FA] group-hover:text-white transition-colors inline-flex items-center gap-1.5 leading-snug"
          >
            {incident.title}
            <ArrowUpRight className="h-4 w-4 text-[#687386] opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-[#00DFD8]" />
          </Link>
          <p className="text-xs text-[#A7AFBD] line-clamp-2 leading-relaxed">
            {incident.description}
          </p>
        </div>

        {/* Triage insight snippet */}
        {triage && !triage.ai_unavailable && (
          <div className="mt-3.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-xs text-[#A7AFBD] space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium text-[#F5F7FA] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#00DFD8]" />
                {triage.suggested_department}
              </span>
              <span className="font-mono text-[11px] text-[#687386]">
                Urgency: {triage.urgency_score}/100
              </span>
            </div>
            <p className="text-[#A7AFBD] text-[11px] line-clamp-1">
              {triage.observations[0] || triage.citizen_claims[0] || 'Epistemic triage complete.'}
            </p>
          </div>
        )}
      </div>

      {/* Footer location, telemetry metadata & actions */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 text-[#A7AFBD]">
          <span className="inline-flex items-center gap-1 text-[11px] text-[#A7AFBD]">
            <MapPin className="h-3.5 w-3.5 text-[#687386]" />
            <span>{incident.wardName}</span>
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#687386]">
            <Clock className="h-3.5 w-3.5 text-[#687386]" />
            {timeAgo(incident.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => upvoteIncident(incident.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-xs text-[#A7AFBD] hover:border-white/[0.15] hover:text-[#F5F7FA] transition-all"
            title="Corroborate this incident"
          >
            <ThumbsUp className="h-3 w-3 text-[#687386]" />
            <span className="font-mono text-[11px]">{incident.corroborationCount}</span>
          </button>

          <Link
            href={`/incidents/${incident.id}`}
            className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs font-medium text-[#F5F7FA] hover:bg-white/[0.08] hover:border-white/[0.16] transition-all"
          >
            View File
          </Link>
        </div>
      </div>
    </div>
  );
}
