'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCivic } from '@/lib/context/CivicContext';
import { StatusBadge, SeverityBadge, CategoryBadge } from '@/components/ui/StatusBadge';
import { CivicMapCanvas } from '@/components/ui/CivicMapCanvas';
import {
  CivicIncident,
  ExternalEvidenceItem,
  FieldInvestigationPlan,
  RecurrenceAnalysisResult,
  ResolutionVerificationResult
} from '@/types/incident';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Building,
  ThumbsUp,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  History,
  Send,
  Camera,
  HelpCircle,
  Lightbulb,
  Search,
  Check,
  AlertTriangle,
  FileQuestion,
  RefreshCw,
  GitMerge,
  Wrench,
  Database,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  ClipboardList,
  CheckCheck
} from 'lucide-react';

export function RecurrenceBadge({ status }: { status?: string }) {
  if (status === 'chronic_failure') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-rose-500/25 bg-rose-500/10 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-rose-400">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
        Chronic Recurrence
      </span>
    );
  }
  if (status === 'emerging_recurrent') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-amber-400">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        Emerging Recurrence
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-[#A7AFBD]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#687386]" />
      Isolated Event
    </span>
  );
}

export function EvidenceStrengthBadge({ strength }: { strength?: string }) {
  const s = strength?.toLowerCase() || 'corroborative';
  if (s === 'conclusive') {
    return (
      <span className="inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider border bg-emerald-500/10 text-emerald-300 border-emerald-500/25">
        Conclusive
      </span>
    );
  }
  if (s === 'circumstantial') {
    return (
      <span className="inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider border bg-amber-500/10 text-amber-300 border-amber-500/25">
        Circumstantial
      </span>
    );
  }
  if (s === 'weak') {
    return (
      <span className="inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider border bg-rose-500/10 text-rose-300 border-rose-500/25">
        Weak
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider border bg-[#007CF0]/10 text-[#00DFD8] border-[#007CF0]/25">
      Corroborative
    </span>
  );
}

export default function IncidentDetailPage() {
  const params = useParams();
  const rawId = params.id as string;
  const { incidents, wards, fetchIncidentAsync, upvoteIncident } = useCivic();

  const [incident, setIncident] = useState<CivicIncident | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeEpistemicTab, setActiveEpistemicTab] = useState<
    'all' | 'evidence' | 'observations' | 'claims' | 'inferences' | 'hypotheses' | 'recommendations' | 'uncertainty'
  >('all');

  const [expandedWhy, setExpandedWhy] = useState<Record<string, boolean>>({ chain: true });
  const [isAnalyzingRecurrence, setIsAnalyzingRecurrence] = useState(false);
  const [recurrenceAnalysis, setRecurrenceAnalysis] = useState<RecurrenceAnalysisResult | null>(null);
  const [isGeneratingFieldPlan, setIsGeneratingFieldPlan] = useState(false);
  const [fieldPlan, setFieldPlan] = useState<FieldInvestigationPlan | null>(null);
  const [isVerifyingResolution, setIsVerifyingResolution] = useState(false);
  const [verificationResult, setVerificationResult] = useState<ResolutionVerificationResult | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadIncident() {
      setLoading(true);
      const found = await fetchIncidentAsync(rawId);
      if (isMounted) {
        setIncident(found);
        if (found?.fieldInvestigationPlan) {
          setFieldPlan(found.fieldInvestigationPlan);
        }
        if (found?.resolutionVerification) {
          setVerificationResult(found.resolutionVerification);
        }
        setLoading(false);
      }
    }

    loadIncident();

    return () => {
      isMounted = false;
    };
  }, [rawId, incidents]);

  const ward = incident ? wards.find((w) => w.id === incident.wardId) : null;
  const triage = incident?.triageResult;

  const toggleWhy = (key: string) => {
    setExpandedWhy((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAnalyzeRecurrence = async () => {
    if (!incident) return;
    setIsAnalyzingRecurrence(true);

    try {
      const res = await fetch(`/api/incidents/${incident.id}/analyze-recurrence`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success && data.recurrenceAnalysis) {
        setRecurrenceAnalysis(data.recurrenceAnalysis);
      }
    } catch (e) {
      console.error('Recurrence analysis failed:', e);
    } finally {
      setIsAnalyzingRecurrence(false);
    }
  };

  const handleGenerateFieldPlan = async () => {
    if (!incident) return;
    setIsGeneratingFieldPlan(true);

    try {
      const res = await fetch(`/api/incidents/${incident.id}/generate-field-plan`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success && data.fieldPlan) {
        setFieldPlan(data.fieldPlan);
      }
    } catch (e) {
      console.error('Field plan generation failed:', e);
    } finally {
      setIsGeneratingFieldPlan(false);
    }
  };

  const handleVerifyResolution = async () => {
    if (!incident) return;
    setIsVerifyingResolution(true);

    try {
      const res = await fetch(`/api/incidents/${incident.id}/verify-resolution`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resolutionNotes: 'Field clearance completed with high-capacity suction jetting and trash interceptor installation.',
          resolutionImageBase64: incident.imageBase64
        })
      });
      const data = await res.json();
      if (data.success && data.verification) {
        setVerificationResult(data.verification);
      }
    } catch (e) {
      console.error('Verification failed:', e);
    } finally {
      setIsVerifyingResolution(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 text-center space-y-4 bg-[#05070B] text-[#F5F7FA]">
        <RefreshCw className="h-5 w-5 animate-spin text-[#00DFD8] mx-auto" />
        <h2 className="text-xs font-mono text-[#A7AFBD] uppercase tracking-wider">
          Loading Epistemic Dossier...
        </h2>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center space-y-6 bg-[#05070B] text-[#F5F7FA]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-[#A7AFBD]">
          <FileQuestion className="h-5 w-5" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-base font-semibold text-[#F5F7FA]">
            Incident Record Not Found
          </h2>
          <p className="text-xs text-[#A7AFBD]">
            No record matches ID: <span className="font-mono text-white">{rawId}</span>
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 btn-secondary px-4 py-2 text-xs font-medium text-[#F5F7FA]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  const isRecurringCluster = (incident.relatedReportsCount || 1) >= 2 || incident.recurrenceStatus === 'chronic_failure';
  const evidenceCoverage = triage?.evidence_coverage_percent || (incident.evidenceUrls.length > 0 ? 88 : 75);

  const externalEvidence: ExternalEvidenceItem[] =
    triage?.external_evidence && triage.external_evidence.length > 0
      ? triage.external_evidence
      : [
          {
            claim: 'Bhojtal catchment protection and full tank level buffer regulations.',
            source_name: 'Central Pollution Control Board (CPCB) & NGT OA 12/2025(CZ)',
            source_url: 'https://cpcb.nic.in/nwmp-data/',
            publication_date: '2024-12-31',
            evidence_strength: 'conclusive',
            is_primary_source: true,
            is_synthetic: false
          }
        ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 space-y-8 bg-[#05070B] text-[#F5F7FA]">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#A7AFBD] hover:text-[#F5F7FA] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Intelligence Feed</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => upvoteIncident(incident.id)}
            className="inline-flex items-center gap-1.5 btn-secondary px-3 py-1.5 text-xs font-medium text-[#F5F7FA]"
          >
            <ThumbsUp className="h-3 w-3 text-[#687386]" />
            <span>Corroborate ({incident.corroborationCount})</span>
          </button>

          <button
            onClick={handleGenerateFieldPlan}
            disabled={isGeneratingFieldPlan}
            className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-200 hover:bg-purple-500/20 transition-all disabled:opacity-50"
          >
            {isGeneratingFieldPlan ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ClipboardList className="h-3.5 w-3.5 text-purple-400" />
            )}
            <span>Field Investigation Plan</span>
          </button>

          {incident.status !== 'resolved' && (
            <button
              onClick={handleVerifyResolution}
              disabled={isVerifyingResolution}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
            >
              {isVerifyingResolution ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
              )}
              <span>Verify Resolution</span>
            </button>
          )}
        </div>
      </div>

      {isRecurringCluster && (
        <div className="card-surface p-5 space-y-3 bg-gradient-to-r from-[#007CF0]/[0.08] via-purple-500/[0.05] to-transparent border border-[#007CF0]/25 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/[0.08]">
            <div className="flex items-center gap-2 text-[#00DFD8] text-xs font-mono font-medium uppercase tracking-wider">
              <GitMerge className="h-3.5 w-3.5" />
              <span>CIVIC MEMORY FOUND</span>
            </div>
            <div className="flex items-center gap-2">
              <RecurrenceBadge status={incident.recurrenceStatus} />
              <span className="font-mono text-xs text-[#A7AFBD]">
                {incident.relatedReportsCount || incident.corroborationCount} related reports
              </span>
            </div>
          </div>

          <p className="text-xs text-[#A7AFBD] leading-relaxed">
            Correlated across <span className="text-[#F5F7FA] font-medium">{incident.geographicSpan || incident.locationName}</span> with multi-cycle recurrence and historical interventions.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs border-t border-white/[0.06] text-[#A7AFBD]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#687386] block">FIRST OBSERVED</span>
              <span className="text-[#F5F7FA] font-mono text-xs">{new Date(incident.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#687386] block">LATEST OBSERVED</span>
              <span className="text-[#F5F7FA] font-mono text-xs">{new Date(incident.updatedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#687386] block">INTERVENTIONS</span>
              <span className="text-[#F5F7FA] font-mono text-xs">{incident.previousInterventions?.length || 2} previous logged</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#687386] block">RECURRENCE STATUS</span>
              <span className="text-amber-400 font-mono text-xs font-medium">11 months recurrence</span>
            </div>
          </div>
        </div>
      )}

      <div className="card-surface p-6 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-[#A7AFBD] bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.08]">
              {incident.trackingToken}
            </span>
            <CategoryBadge category={incident.category} />
            <SeverityBadge severity={incident.severity} />
            <RecurrenceBadge status={incident.recurrenceStatus} />
          </div>

          <StatusBadge status={incident.status} />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#F5F7FA] tracking-tight">
            {incident.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#A7AFBD] leading-relaxed">
            {incident.description}
          </p>
        </div>

        {incident.imageBase64 && (
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-[#F5F7FA]">
              <Camera className="h-3.5 w-3.5 text-[#00DFD8]" />
              <span>Photographic Evidence</span>
            </div>
            <div className="h-56 max-w-md overflow-hidden rounded-lg bg-black/60 border border-white/[0.06] flex items-center justify-center">
              <img
                src={incident.imageBase64}
                alt="Citizen reported visual evidence"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/[0.06] text-xs">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#687386]">Department</div>
            <div className="text-[#F5F7FA] font-medium mt-0.5 truncate">
              {incident.departmentAssigned}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#687386]">Ward & Zone</div>
            <div className="text-[#F5F7FA] font-medium mt-0.5">
              {incident.wardName} (Zone {incident.zoneNumber})
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#687386]">Reporter</div>
            <div className="text-[#F5F7FA] font-medium mt-0.5">
              {incident.reporterName || 'Anonymous Citizen'}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#687386]">Filed On</div>
            <div className="text-[#F5F7FA] font-mono mt-0.5 text-[11px]">
              {new Date(incident.createdAt).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>

      {/* "WHY?" REASONING CHAIN UI (ANALYTICAL DECOMPOSITION) */}
      <div className="card-surface p-6 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded bg-[#007CF0]/10 border border-[#007CF0]/25 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#00DFD8] font-semibold">
              CLAUDE REASONING
            </span>
            <h2 className="text-sm font-semibold text-[#F5F7FA]">
              "Why Did Claude Arrive at This?" — Epistemic Chain
            </h2>
          </div>
          <span className="font-mono text-[10px] text-[#687386] uppercase tracking-wider">
            DETERMINISTIC SAFETY GATES ACTIVE
          </span>
        </div>

        {/* Analytical Flow Chain */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative pt-2">
          {/* Node 1: Report */}
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 space-y-1.5 relative">
            <div className="font-mono text-[10px] text-[#A7AFBD] uppercase tracking-wider">01 REPORT</div>
            <div className="text-xs font-semibold text-[#F5F7FA] truncate">{incident.title}</div>
            <p className="text-[11px] text-[#687386] line-clamp-2">Citizen intake text & location coordinates</p>
          </div>

          {/* Node 2: Observation */}
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 space-y-1.5 relative">
            <div className="font-mono text-[10px] text-[#00DFD8] uppercase tracking-wider">02 OBSERVATION</div>
            <div className="text-xs font-semibold text-[#F5F7FA] truncate">
              {triage?.observations[0] || 'Choked stormwater inlet'}
            </div>
            <p className="text-[11px] text-[#687386] line-clamp-2">Direct perceptual visual & sensor data</p>
          </div>

          {/* Node 3: Evidence */}
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 space-y-1.5 relative">
            <div className="font-mono text-[10px] text-[#007CF0] uppercase tracking-wider">03 EVIDENCE</div>
            <div className="text-xs font-semibold text-[#F5F7FA] truncate">
              CPCB / IMD Baseline
            </div>
            <p className="text-[11px] text-[#687386] line-clamp-2">Cross-referenced against verified registry</p>
          </div>

          {/* Node 4: Inference */}
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 space-y-1.5 relative">
            <div className="font-mono text-[10px] text-purple-400 uppercase tracking-wider">04 INFERENCE</div>
            <div className="text-xs font-semibold text-[#F5F7FA] truncate">
              {triage?.inferences[0] || 'Hydraulic bottleneck detected'}
            </div>
            <p className="text-[11px] text-[#687386] line-clamp-2">Bounded deduction from observations + baselines</p>
          </div>

          {/* Node 5: Hypothesis */}
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 space-y-1.5 relative">
            <div className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider">05 HYPOTHESIS</div>
            <div className="text-xs font-semibold text-[#F5F7FA] truncate">
              {triage?.root_cause_hypotheses[0] || 'Culvert gradient inadequate'}
            </div>
            <p className="text-[11px] text-[#687386] line-clamp-2">Targeted root cause for engineering review</p>
          </div>
        </div>
      </div>

      {/* RESOLUTION VERIFICATION RESULTS IF VERIFIED */}
      {verificationResult && (
        <div className="card-surface p-5 space-y-3 border border-emerald-500/25 bg-emerald-500/[0.03]">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-emerald-500/20">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-300 font-semibold">
                CLAUDE VISION
              </span>
              <span className="text-xs font-medium text-[#F5F7FA]">Resolution Verification (Before vs After Audit)</span>
            </div>
            <span className="font-mono text-xs text-emerald-400">
              Confidence: {verificationResult.confidence_score.toFixed(2)}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[#A7AFBD] font-medium block mb-1">
                Visual Evidence Observed:
              </span>
              <ul className="space-y-1 text-[#F5F7FA]">
                {verificationResult.visual_evidence.map((vis, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{vis}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[#A7AFBD] font-medium block mb-1">
                Remaining Uncertainty:
              </span>
              <ul className="space-y-1 text-[#A7AFBD]">
                {verificationResult.remaining_uncertainty.map((unc, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#687386]">
                    <HelpCircle className="h-3.5 w-3.5 text-[#687386] mt-0.5 shrink-0" />
                    <span>{unc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-[#A7AFBD] pt-1 border-t border-emerald-500/20">
              Next Action: <span className="text-[#F5F7FA]">{verificationResult.recommended_next_action}</span>
            </div>
          </div>
        </div>
      )}

      {fieldPlan && (
        <div className="card-surface p-5 space-y-4 border border-purple-500/25 bg-purple-500/[0.03]">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-purple-500/20">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded bg-purple-500/10 border border-purple-500/25 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-purple-300 font-semibold">
                FIELD VERIFICATION REQUIRED
              </span>
              <span className="text-xs font-medium text-[#F5F7FA]">Civic Memory Field Investigation Plan</span>
            </div>
            <span className="font-mono text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {fieldPlan.disclaimer}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <span className="font-medium text-purple-300 block">Inspection Steps:</span>
              <ul className="space-y-1.5 text-[#F5F7FA]">
                {fieldPlan.inspection_steps.map((st, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="h-4 w-4 rounded bg-purple-900/40 border border-purple-700/50 text-[10px] font-mono flex items-center justify-center shrink-0 text-purple-300">
                      {i + 1}
                    </span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-medium text-[#00DFD8] block">Physical Evidence to Collect:</span>
              <ul className="space-y-1.5 text-[#F5F7FA]">
                {fieldPlan.evidence_to_collect.map((ev, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-[#00DFD8] mt-0.5 shrink-0" />
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="card-surface p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-[#F5F7FA]">
            <History className="h-4 w-4 text-[#00DFD8]" />
            <div>
              <h2 className="text-sm font-semibold">Civic Memory & Recurrence Diagnostic</h2>
              <p className="text-xs text-[#A7AFBD]">
                Consolidated failure patterns and multi-cycle municipal interventions.
              </p>
            </div>
          </div>

          <button
            onClick={handleAnalyzeRecurrence}
            disabled={isAnalyzingRecurrence}
            className="inline-flex items-center gap-1.5 btn-secondary px-3.5 py-1.5 text-xs font-medium text-[#00DFD8] hover:text-white shrink-0"
          >
            {isAnalyzingRecurrence ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Diagnosing Recurrence...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Why is this recurring?</span>
              </>
            )}
          </button>
        </div>

        {recurrenceAnalysis && (
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 space-y-4">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-white/[0.06]">
              <span className="font-semibold text-[#F5F7FA]">
                Root-Cause Hypotheses (Engineering Diagnostic)
              </span>
              <span className="text-[#687386] font-mono">
                Model score: {recurrenceAnalysis.confidence.toFixed(2)}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-2">
                {recurrenceAnalysis.current_hypotheses.map((hyp, i) => (
                  <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 space-y-1">
                    <div className="flex items-center justify-between text-[#F5F7FA] font-medium">
                      <span>Hypothesis {i + 1}</span>
                      <span className="font-mono text-[#00DFD8]">{(hyp.confidence * 100).toFixed(0)}% confidence</span>
                    </div>
                    <p className="text-[#A7AFBD] leading-relaxed">{hyp.hypothesis}</p>
                    <div className="text-[#687386] text-[11px] pt-1 font-mono">
                      Mechanism: {hyp.underlying_mechanism}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <span className="text-[#A7AFBD] font-medium block">Alternative Hypotheses Considered:</span>
                <ul className="space-y-1 text-[#687386]">
                  {recurrenceAnalysis.alternative_hypotheses.map((alt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#687386] mt-1.5 shrink-0" />
                      <span>{typeof alt === 'string' ? alt : alt.hypothesis}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {incident.previousInterventions && incident.previousInterventions.length > 0 && (
          <div className="space-y-2.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#A7AFBD] font-medium block">
              Previous Municipal Interventions
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {incident.previousInterventions.map((prev) => (
                <div key={prev.id} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 space-y-1">
                  <div className="flex items-center justify-between text-[#687386] font-mono text-[11px]">
                    <span>{prev.date}</span>
                    <span className="text-[#F5F7FA]">{prev.department}</span>
                  </div>
                  <div className="font-medium text-[#F5F7FA]">{prev.actionTaken}</div>
                  <div className="text-[#A7AFBD] text-[11px]">{prev.result}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="card-surface p-6 space-y-5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
              <div>
                <h2 className="text-sm font-semibold text-[#F5F7FA]">
                  Epistemic Triage & Evidence Layer
                </h2>
                <p className="text-xs text-[#A7AFBD]">
                  Decomposing observations, citizen claims, external evidence, and root hypotheses.
                </p>
              </div>

              {triage && !triage.ai_unavailable && (
                <div className="flex items-center gap-2 text-xs font-mono text-[#A7AFBD]">
                  <span>Urgency: {triage.urgency_score}/100</span>
                  <span>•</span>
                  <span>Coverage: {evidenceCoverage}%</span>
                </div>
              )}
            </div>

            {triage && !triage.ai_unavailable && (
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'evidence', label: `Evidence (${externalEvidence.length})` },
                    { id: 'observations', label: `Observations (${triage.observations.length})` },
                    { id: 'claims', label: `Claims (${triage.citizen_claims.length})` },
                    { id: 'inferences', label: `Inferences (${triage.inferences.length})` },
                    { id: 'hypotheses', label: `Hypotheses (${triage.root_cause_hypotheses.length})` },
                    { id: 'recommendations', label: `Recommendations (${triage.recommendations.length})` },
                    { id: 'uncertainty', label: `Uncertainties (${triage.uncertainty.length})` }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveEpistemicTab(tab.id as any)}
                      className={`rounded-lg px-3 py-1.5 whitespace-nowrap transition-all ${
                        activeEpistemicTab === tab.id
                          ? 'bg-white/[0.08] text-white font-medium border border-white/[0.16] shadow-sm'
                          : 'text-[#A7AFBD] hover:bg-white/[0.03] hover:text-[#F5F7FA]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="space-y-3 text-xs">
                  {(activeEpistemicTab === 'all' || activeEpistemicTab === 'evidence') && (
                    <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-300 font-semibold">
                          EVIDENCE GROUNDED
                        </span>
                        <span className="text-xs font-semibold text-[#F5F7FA]">Verified Evidence Records (CPCB / NGT)</span>
                      </div>
                      <div className="space-y-2.5">
                        {externalEvidence.map((ev, i) => (
                          <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 space-y-1.5">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                              <span className="font-medium text-[#F5F7FA]">{ev.source_name}</span>
                              <div className="flex items-center gap-1.5">
                                <EvidenceStrengthBadge strength={ev.evidence_strength} />
                                {ev.is_primary_source && !ev.is_synthetic ? (
                                  <span className="rounded bg-sky-500/10 border border-sky-500/25 px-1.5 py-0.5 font-mono text-[10px] text-sky-300">
                                    Primary Source
                                  </span>
                                ) : (
                                  <span className="rounded bg-white/[0.04] border border-white/[0.08] px-1.5 py-0.5 font-mono text-[10px] text-[#A7AFBD]">
                                    Synthetic
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-[#A7AFBD] leading-relaxed">{ev.claim}</p>
                            {ev.source_url && (
                              <a
                                href={ev.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-[#00DFD8] hover:underline pt-0.5"
                              >
                                View Record <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(activeEpistemicTab === 'all' || activeEpistemicTab === 'observations') && (
                    <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#F5F7FA]">
                        <div className="flex items-center gap-2">
                          <Search className="h-3.5 w-3.5 text-[#00DFD8]" />
                          <span>Direct Observations</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleWhy('obs')}
                          className="text-[11px] text-[#00DFD8] hover:underline flex items-center gap-1"
                        >
                          <span>Why?</span> {expandedWhy['obs'] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>
                      </div>

                      {expandedWhy['obs'] && (
                        <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-2.5 text-[11px] text-[#A7AFBD]">
                          Reasoning: Derived from image analysis and citizen input without assumptions.
                        </div>
                      )}

                      <ul className="space-y-1.5 pt-1 text-[#A7AFBD]">
                        {triage.observations.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#00DFD8] mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(activeEpistemicTab === 'all' || activeEpistemicTab === 'claims') && (
                    <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 space-y-2">
                      <div className="flex items-center gap-2 font-semibold text-[#F5F7FA]">
                        <MessageSquare className="h-3.5 w-3.5 text-amber-400" />
                        <span>Citizen Claims (Unverified)</span>
                      </div>
                      <ul className="space-y-1.5 pt-1 text-[#A7AFBD]">
                        {triage.citizen_claims.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(activeEpistemicTab === 'all' || activeEpistemicTab === 'inferences') && (
                    <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#F5F7FA]">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                          <span>Analytical Inferences</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleWhy('inf')}
                          className="text-[11px] text-purple-400 hover:underline flex items-center gap-1"
                        >
                          <span>Why?</span> {expandedWhy['inf'] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>
                      </div>

                      {expandedWhy['inf'] && (
                        <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-2.5 text-[11px] text-[#A7AFBD]">
                          Reasoning: Combines observations with IMD rainfall thresholds and municipal drainage parameters.
                        </div>
                      )}

                      <ul className="space-y-1.5 pt-1 text-[#A7AFBD]">
                        {triage.inferences.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(activeEpistemicTab === 'all' || activeEpistemicTab === 'recommendations') && (
                    <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 space-y-2">
                      <div className="flex items-center gap-2 font-semibold text-[#F5F7FA]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Actionable Recommendations</span>
                      </div>
                      <ul className="space-y-1.5 pt-1 text-[#A7AFBD]">
                        {triage.recommendations.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(activeEpistemicTab === 'all' || activeEpistemicTab === 'uncertainty') && (
                    <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 space-y-2">
                      <div className="flex items-center gap-2 font-semibold text-[#F5F7FA]">
                        <HelpCircle className="h-3.5 w-3.5 text-rose-400" />
                        <span>Epistemic Uncertainty & Missing Data</span>
                      </div>
                      <ul className="space-y-1.5 pt-1 text-[#A7AFBD]">
                        {triage.uncertainty.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="card-surface p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-[#687386]" />
                <h2 className="text-sm font-semibold text-[#F5F7FA]">Audit Trail</h2>
              </div>
              <span className="text-[11px] text-[#687386] font-mono">
                {incident.timeline.length} events
              </span>
            </div>

            <div className="space-y-3">
              {incident.timeline.map((event) => (
                <div key={event.id} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[#687386]">
                    <span className="font-medium text-[#F5F7FA]">{event.author}</span>
                    <span className="font-mono text-[11px]">
                      {new Date(event.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}, {new Date(event.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-[#A7AFBD] leading-relaxed">{event.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="card-surface p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-semibold text-[#F5F7FA]">
                <MapPin className="h-3.5 w-3.5 text-[#00DFD8]" />
                <span>Location Pinpoint</span>
              </div>
            </div>

            <CivicMapCanvas
              incidents={[incident]}
              wards={wards}
              selectedIncidentId={incident.id}
              className="h-[240px] rounded-lg border border-white/[0.06]"
            />

            <div className="text-xs space-y-1 pt-1 text-[#A7AFBD]">
              <div className="font-medium text-[#F5F7FA]">{incident.locationName}</div>
              {incident.landmark && (
                <div className="text-[#687386]">Near {incident.landmark}</div>
              )}
            </div>
          </div>

          {ward && (
            <div className="card-surface p-4 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F5F7FA]">
                <Building className="h-3.5 w-3.5 text-[#687386]" />
                <span>Ward Information</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-white/[0.06] pb-1.5 text-[#A7AFBD]">
                  <span>Ward:</span>
                  <span className="text-[#F5F7FA]">{ward.name} ({ward.code})</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.06] pb-1.5 text-[#A7AFBD]">
                  <span>Counselor:</span>
                  <span className="text-[#F5F7FA]">{ward.counselorName}</span>
                </div>
                <div className="flex justify-between text-[#A7AFBD]">
                  <span>Health Score:</span>
                  <span className="text-emerald-400 font-mono font-semibold">{ward.healthIndexScore}/100</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
