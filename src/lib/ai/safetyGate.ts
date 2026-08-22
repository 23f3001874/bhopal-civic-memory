import {
  CivicTriage,
  DuplicateReasoningResult,
  EvidenceItem,
  ExternalEvidenceItem,
  ResolutionVerificationResult
} from '@/types/incident';
import { EvidenceRecord } from '@/lib/knowledge/bhopal/types';

export type SafetyGateStatus =
  | 'PASSED'
  | 'FIELD_VERIFICATION_REQUIRED'
  | 'EVIDENCE_CONFLICT'
  | 'UNSUPPORTED_LEGAL_CLAIM'
  | 'INSUFFICIENT_VISUAL_EVIDENCE';

export interface SafetyGateAudit {
  status: SafetyGateStatus;
  isPassed: boolean;
  warnings: string[];
  downgradesApplied: string[];
  calibratedConfidenceLabel: string;
  rawConfidenceScore: number;
}

/**
 * Format confidence score into calibrated qualitative language.
 * Never presents raw model floats as calibrated statistical probabilities.
 */
export function formatCalibratedConfidence(score: number): string {
  const clamped = Math.max(0, Math.min(1, score));
  if (clamped >= 0.85) {
    return `High AI Assessment Confidence (Model score: ${clamped.toFixed(2)})`;
  }
  if (clamped >= 0.70) {
    return `Moderate AI Assessment Confidence (Model score: ${clamped.toFixed(2)})`;
  }
  return `Low AI Assessment Confidence (Model score: ${clamped.toFixed(2)})`;
}

/**
 * Deterministic Post-Claude Uncertainty & Safety Gate.
 * 
 * Inspects AI outputs, evidence records, and citizen claims before allowing strong conclusions:
 * 1. Checks for unsupported catastrophic/toxic claims.
 * 2. Checks for ungrounded legal/NGT assertions.
 * 3. Detects conflicts between citizen claims and verified monitoring telemetry.
 * 4. Verifies resolution image sufficiency.
 * 5. Downgrades status to "FIELD_VERIFICATION_REQUIRED" or "EVIDENCE_CONFLICT".
 */
export function runUncertaintySafetyGate(params: {
  triage: CivicTriage;
  reportText: string;
  retrievedEvidence: EvidenceRecord[];
  hasImage?: boolean;
  wardId?: string;
}): SafetyGateAudit {
  const { triage, reportText, retrievedEvidence, hasImage, wardId } = params;
  const warnings: string[] = [];
  const downgradesApplied: string[] = [];
  let gateStatus: SafetyGateStatus = 'PASSED';

  const textLower = reportText.toLowerCase();

  // 1. Check for Unsupported Catastrophic / Toxic Chemical Claims
  const isToxicClaim =
    textLower.includes('toxic') ||
    textLower.includes('poison') ||
    textLower.includes('cyanide') ||
    textLower.includes('chemical hazard') ||
    textLower.includes('chemical poison') ||
    textLower.includes('radioactive');

  if (isToxicClaim) {
    // Requires certified chemical hazardous assay, not standard general BOD
    const hasSpecificHazardLabRecord = retrievedEvidence.some(
      (r) => r.source_type === 'official_monitoring' && (r.claim.toLowerCase().includes('toxic') || r.claim.toLowerCase().includes('chemical hazard'))
    );

    if (!hasSpecificHazardLabRecord) {
      gateStatus = 'FIELD_VERIFICATION_REQUIRED';
      warnings.push('Citizen report asserts toxic/chemical hazard without verified chemical laboratory assay.');
      downgradesApplied.push('Conclusion downgraded to "FIELD VERIFICATION REQUIRED" — specialized chemical sampling team dispatched.');
      triage.uncertainty.push('Toxic/chemical assertions are unverified citizen claims and require certified chemical laboratory assay.');
    }
  }

  // 2. Check for Unsupported Legal / Statutory Claims
  const isLegalClaim =
    textLower.includes('illegal') ||
    textLower.includes('demolition order') ||
    textLower.includes('court order') ||
    textLower.includes('ngt violation') ||
    textLower.includes('ngt demolition');

  if (isLegalClaim && gateStatus === 'PASSED') {
    // Check if the verified legal order applies to the specific ward/zone
    const hasApplicableLegalRecord = retrievedEvidence.some((r) => {
      if (r.source_type !== 'judicial_order' && r.source_type !== 'government_gazette') {
        return false;
      }
      if (wardId && r.location.wardId && r.location.wardId !== wardId) {
        return false;
      }
      return true;
    });

    if (!hasApplicableLegalRecord) {
      gateStatus = 'UNSUPPORTED_LEGAL_CLAIM';
      warnings.push('Report asserts statutory/court order violation without verified NGT or Gazette citation for this administrative zone.');
      downgradesApplied.push('Legal claim flagged as "UNSUPPORTED LEGAL ASSERTION" — requires municipal law officer audit.');
      triage.uncertainty.push('Alleged statutory violation is not supported by indexed judicial records for this zone.');
    }
  }

  // 3. Detect Evidence Conflicts (e.g. claims vs telemetry)
  const isLakeOverflowClaim = textLower.includes('overflowing') && textLower.includes('lake');
  if (isLakeOverflowClaim && gateStatus === 'PASSED') {
    const lakeRecord = retrievedEvidence.find((r) => r.id === 'cpcb-nwmp-bpl-01');
    if (lakeRecord) {
      gateStatus = 'EVIDENCE_CONFLICT';
      warnings.push('Conflict detected: Citizen asserts Upper Lake overflow while official monitoring shows normal seasonal pool level.');
      downgradesApplied.push('Flagged as "EVIDENCE CONFLICT" — on-site water level transducer inspection required.');
    }
  }

  // 4. Check for Minimal Evidence Sufficiency (Very short vague report without photo)
  const wordCount = reportText.trim().split(/\s+/).length;
  if (wordCount < 8 && !hasImage && gateStatus === 'PASSED') {
    gateStatus = 'FIELD_VERIFICATION_REQUIRED';
    warnings.push('Report contains fewer than 8 descriptive words and lacks photographic evidence.');
    downgradesApplied.push('Status downgraded to "FIELD VERIFICATION REQUIRED".');
    triage.uncertainty.push('Initial submission lacks precise physical descriptors; requires physical inspector verification.');
  }

  const rawScore = typeof triage.confidence_score === 'number' ? triage.confidence_score : 0.8;
  const calibratedConfidenceLabel = formatCalibratedConfidence(rawScore);

  return {
    status: gateStatus,
    isPassed: gateStatus === 'PASSED',
    warnings,
    downgradesApplied,
    calibratedConfidenceLabel,
    rawConfidenceScore: rawScore
  };
}

/**
 * Validates Resolution Verification Evidence.
 */
export function validateResolutionEvidence(
  verification: ResolutionVerificationResult,
  hasAfterImage: boolean
): ResolutionVerificationResult {
  if (!hasAfterImage) {
    return {
      ...verification,
      status: 'insufficient_evidence',
      confidence_score: 0.35,
      visual_evidence: ['No post-intervention photographic evidence provided for optical comparison.'],
      remaining_uncertainty: ['Resolution cannot be confirmed without verifiable after-photo evidence.'],
      recommended_next_action: 'Require field supervisor to upload geo-tagged post-intervention photograph.'
    };
  }

  return verification;
}
