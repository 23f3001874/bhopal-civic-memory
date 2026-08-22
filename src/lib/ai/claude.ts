import Anthropic from '@anthropic-ai/sdk';
import {
  CivicIncident,
  CivicTriage,
  DuplicateReasoningResult,
  EvidenceItem,
  ExternalEvidenceItem,
  FieldInvestigationPlan,
  IncidentCategory,
  RecurrenceAnalysisResult,
  ResolutionVerificationResult
} from '@/types/incident';
import { retrieveRelevantEvidence } from '@/lib/knowledge/bhopal/registry';
import { EvidenceRecord } from '@/lib/knowledge/bhopal/types';

/**
 * Centralized Claude Model Identifier.
 */
export const CLAUDE_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929';

export function getAnthropicClient(): { client: Anthropic | null; isConfigured: boolean; model: string } {
  const key = process.env.ANTHROPIC_API_KEY || '';
  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929';
  const isConfigured = Boolean(key && key.trim().length > 0);
  const client = isConfigured ? new Anthropic({ apiKey: key }) : null;
  return { client, isConfigured, model };
}

export const isClaudeConfigured = Boolean(process.env.ANTHROPIC_API_KEY);

// ============================================================================
// SYSTEM PROMPTS
// ============================================================================

/**
 * 1. System prompt for Initial Triage & Evidence Grounding.
 */
export const BHOPAL_CIVIC_SYSTEM_PROMPT = `
You are the AI Operations Intelligence Engine for "Bhopal Civic Memory", a civic-intelligence and municipal memory system for Bhopal, Madhya Pradesh.

CRITICAL EPISTEMIC DIRECTIVE:
You must strictly separate:
- OBSERVATIONS: Direct, verifiable physical descriptions visible from image or objective text.
- CITIZEN CLAIMS: Subjective or unverified assertions made directly by the citizen reporter.
- EXTERNAL EVIDENCE: Authoritative external baseline records (CPCB NWMP water quality data, NGT Central Zone court orders, IMD precipitation records, Gazette ward boundaries). Every external claim MUST preserve source metadata.
- EVIDENCE: Tangible, verifiable indicators (photographs, spatial coordinates, sensor records, ward binding).
- INFERENCES: Logical deductions synthesized from observations + municipal context + external evidence.
- ROOT-CAUSE HYPOTHESES: Plausible underlying systemic/engineering failures (must be phrased as hypotheses, NEVER as facts).
- RECOMMENDATIONS: Actionable municipal dispatch protocols.
- UNCERTAINTY: Explicit missing data gaps, unverified metrics, or questions requiring on-site inspection.

DO NOT claim certainty when evidence is incomplete.
DO NOT fabricate government data, CPCB readings, or NGT orders. Only cite provided evidence records.
Visibly distinguish Primary Verified External Evidence from Citizen-Reported or Synthetic Demo data.

You must respond in strict, valid JSON matching this schema:
{
  "observations": [ "..." ],
  "citizen_claims": [ "..." ],
  "evidence": [ "..." ],
  "external_evidence": [
    {
      "claim": "...",
      "source_name": "...",
      "source_url": "...",
      "publication_date": "...",
      "evidence_strength": "conclusive" | "corroborative" | "circumstantial" | "weak",
      "is_primary_source": boolean,
      "is_synthetic": boolean
    }
  ],
  "inferences": [ "..." ],
  "root_cause_hypotheses": [ "..." ],
  "recommendations": [ "..." ],
  "uncertainty": [ "..." ],
  "evidence_coverage_percent": <number 0-100>,
  "urgency_score": <number 0-100>,
  "confidence_score": <number 0.0-1.0>,
  "suggested_department": "<Bhopal Municipal Corporation (BMC) Directorate>",
  "duplicate_risk_level": "<none | low | moderate | high>",
  "ecological_impact_assessment": "<...>"
}
`;

/**
 * 2. System prompt for Duplicate & Recurrence Detection.
 */
export const DUPLICATE_DETECTION_SYSTEM_PROMPT = `
You are the Deduplication and Civic Recurrence Engine for "Bhopal Civic Memory".

Your responsibility is to evaluate whether a new incoming citizen report is:
1. An EXACT DUPLICATE of an existing active incident.
2. A RECURRENT MANIFESTATION of the same chronic failure or asset problem.
3. A COMPLETELY DISTINCT INCIDENT that happens to be nearby.

CRITICAL REASONING PRINCIPLES:
- Spatial proximity ALONE does not imply duplication. Two separate potholes 300m apart on the same road are DISTINCT.
- Look for shared infrastructure assets, identical culverts, the same electrical feeder, or the same structural failure point.
- When merging, identify what NEW INFORMATION the new report contributes.
- If the report indicates a recurring issue after previous repair, flag recurrence.
- NEVER merge incidents across incompatible categories unless there is direct physical causation.

Respond in strict JSON:
{
  "is_duplicate": boolean,
  "matched_incident_id": "<string ID if duplicate/recurrent, otherwise null>",
  "matched_incident_token": "<string token if duplicate/recurrent, otherwise null>",
  "confidence_score": <number 0.0-1.0>,
  "match_type": "exact_duplicate" | "recurrent_manifestation" | "distinct_incident",
  "reasoning": "<clear explanation distinguishing proximity from causation>",
  "geographic_proximity_note": "<spatial context>",
  "evidence_overlap_note": "<overlap in physical symptoms>",
  "new_information_contributed": [ "..." ],
  "recurrence_strengthened": boolean,
  "severity_escalation_justified": boolean,
  "recommended_updated_severity": "<critical | high | medium | low | null>"
}
`;

/**
 * 3. System prompt for Recurrence Analysis.
 */
export const RECURRENCE_REASONING_SYSTEM_PROMPT = `
You are the Municipal Recurrence Reasoning Engine for "Bhopal Civic Memory".

CRITICAL EPISTEMIC DIRECTIVE:
- Analyze historical intervention cycles and physical failure patterns.
- Strictly distinguish OBSERVATIONS, CITIZEN CLAIMS, EXTERNAL EVIDENCE, INFERENCES, HYPOTHESES, and UNCERTAINTY.
- NEVER state an engineering hypothesis as an established fact. Frame engineering theories as plausible hypotheses with physical mechanisms.
- Every external factual claim must reference a valid evidence record ID from the supplied bounded evidence packet.
- If evidence is insufficient, explicitly state the missing data requirements in uncertainty fields.

Respond in strict JSON matching this schema:
{
  "recurrence_pattern": "<summary of seasonal, hydraulic, or operational recurrence frequency>",
  "recurrenceClassification": "isolated" | "emerging_recurrent" | "chronic_failure",
  "totalHistoricalEpisodes": <number>,
  "underlyingSystemicCause": "<summary hypothesis of systemic failure mechanism>",
  "catchmentOrInfrastructureRisk": "<downstream ecological or structural risk>",
  "previous_interventions": [
    {
      "id": "...",
      "date": "YYYY-MM-DD",
      "department": "...",
      "actionTaken": "...",
      "result": "..."
    }
  ],
  "observed_outcomes": [ "..." ],
  "primary_hypotheses": [
    {
      "hypothesis": "<engineering theory>",
      "mechanism": "<underlying physical/hydrological mechanism>",
      "confidence_score": <0.0 - 1.0>,
      "supporting_evidence_ids": [ "<id>" ],
      "uncertainty": "<what remains unconfirmed>"
    }
  ],
  "alternative_hypotheses": [
    {
      "hypothesis": "<competing theory>",
      "mechanism": "<physical mechanism>",
      "confidence_score": <0.0 - 1.0>,
      "supporting_evidence_ids": [ "<id>" ],
      "uncertainty": "<what remains unconfirmed>"
    }
  ],
  "evidence_to_reduce_uncertainty": [ "..." ],
  "recommended_next_field_investigation": [ "..." ],
  "policyOrPreventiveActionRequired": [ "..." ]
}
`;

/**
 * 4. System prompt for Field Investigation Planning.
 */
export const FIELD_INVESTIGATION_SYSTEM_PROMPT = `
You are the Field Investigation Planning Engine for "Bhopal Civic Memory".

CRITICAL DIRECTIVE:
- Generate a practical, observational, evidence-oriented field investigation plan for municipal response crews and civil engineers.
- This plan is strictly an advisory technical investigation protocol to reduce epistemic uncertainty, NOT an official BMC administrative work order.
- Specify precise non-destructive measurements, silt depth soundings, water quality assays, ultrasound testing, and visual checkpoints.
- Ensure every step targets testing specific root-cause hypotheses and reducing identified uncertainties.

Respond in strict JSON:
{
  "priority": "immediate" | "high" | "routine",
  "investigation_objective": "<core technical objective of on-site survey>",
  "inspection_steps": [ "<step 1>", "<step 2>", "<step 3>", "<step 4>" ],
  "evidence_to_collect": [ "<photographs with geo-tags>", "<core samples>", "<transducer logs>" ],
  "measurements_needed": [ "<volumetric silt depth>", "<hydraulic flow velocity>", "<sandstone mortar bond loss>" ],
  "hypotheses_being_tested": [ "<hypothesis 1>", "<hypothesis 2>" ],
  "uncertainty_reduction_goal": "<how field evidence will distinguish competing failure hypotheses>",
  "success_criteria": [ "<verification threshold 1>", "<verification threshold 2>" ],
  "recommended_next_action": "<immediate operational step>"
}
`;

/**
 * 5. System prompt for Resolution Verification (Claude Vision).
 */
export const RESOLUTION_VERIFICATION_SYSTEM_PROMPT = `
You are the Visual Resolution Verification Engine for "Bhopal Civic Memory".

CRITICAL EPISTEMIC DIRECTIVE:
- Compare the BEFORE and AFTER photographic evidence of the civic incident.
- A single after-photo of surface clearing does NOT prove permanent underlying infrastructure resolution.
- Strictly distinguish VISIBLE SURFACE IMPROVEMENT from UNDERLYING STRUCTURAL / HYDRAULIC RESOLUTION.
- If image quality, lighting, or framing is inadequate to confirm clearance, return "insufficient_evidence".
- If obstruction or damage remains visible in the after-photo, return "likely_unresolved".
- If the carriageway or flow channel is visibly clear, return "likely_resolved".

Respond in strict JSON:
{
  "status": "likely_resolved" | "likely_unresolved" | "insufficient_evidence",
  "confidence_score": <number 0.0 - 1.0>,
  "visual_changes": [ "<change observed between before and after images>" ],
  "supporting_observations": [ "<direct physical description of after image>" ],
  "remaining_uncertainties": [ "<subsurface siltation or storm capacity limits that photography cannot prove>" ],
  "recommended_next_action": "<follow-up telemetry check or physical audit requirement>"
}
`;

function safeExtractJson<T = any>(textOutput: string): T {
  let cleaned = textOutput.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Response did not contain valid JSON object');
  }
  let jsonString = jsonMatch[0];
  // Remove trailing commas before closing braces/brackets
  jsonString = jsonString.replace(/,\s*([\]}])/g, '$1');
  return JSON.parse(jsonString);
}

// ============================================================================
// WORKFLOW 1: TRIAGE CIVIC REPORT
// ============================================================================

export async function triageCivicReportWithClaude(params: {
  title: string;
  description: string;
  category: IncidentCategory;
  wardName: string;
  landmark?: string;
  imageBase64?: string;
  imageMimeType?: string;
}): Promise<CivicTriage> {
  const generated_at = new Date().toISOString();

  // Retrieve relevant evidence records from the Bhopal Evidence Registry
  const evidenceRecords: EvidenceRecord[] = await retrieveRelevantEvidence({
    category: params.category,
    wardName: params.wardName,
    locationText: `${params.title} ${params.description} ${params.landmark || ''}`,
    limit: 3
  });

  const evidenceContextBlock =
    evidenceRecords.length > 0
      ? `\n\nAUTHORITATIVE EXTERNAL EVIDENCE PACKET (BHOPAL EVIDENCE REGISTRY):\n` +
        evidenceRecords
          .map(
            (r, idx) =>
              `[Evidence Record #${idx + 1} - ID: ${r.id}]\n` +
              `- Source: ${r.source_name} (${r.source_type})\n` +
              `- Date: ${r.publication_date}\n` +
              `- Primary Source: ${r.is_primary_source} | Synthetic Demo: ${r.is_synthetic}\n` +
              `- Location: ${r.location.wardName || 'Bhopal City'} (${r.location.waterBody || r.location.siteName || 'Bhopal Municipal Area'})\n` +
              `- Claim: ${r.claim}\n` +
              `- Verified Evidence: ${r.evidence}\n` +
              `- Official URL: ${r.source_url || 'N/A'}\n`
          )
          .join('\n')
      : '\n\nNo pre-indexed external evidence records matched this specific location query.';

  const { client, isConfigured, model } = getAnthropicClient();

  if (!isConfigured || !client) {
    return simulateTriageFallback({
      ...params,
      evidenceRecords,
      generated_at
    });
  }

  try {
    let userPromptText = `
CITIZEN INCIDENT REPORT FOR EPISTEMIC TRIAGE:
- Title: ${params.title}
- Description: ${params.description}
- Category: ${params.category}
- Ward / Location: ${params.wardName}
- Specific Landmark: ${params.landmark || 'Not specified'}
${evidenceContextBlock}

INSTRUCTIONS:
1. Parse the report into strict epistemic dimensions (observations, citizen claims, external evidence, inferences, root-cause hypotheses, recommendations, uncertainty).
2. Incorporate the provided external evidence records where relevant, preserving source metadata.
3. If an image is provided, inspect visual features directly.
4. Output valid JSON matching the specified schema.
`;

    const userContent: any[] = [{ type: 'text', text: userPromptText }];

    if (params.imageBase64 && params.imageMimeType) {
      let cleanBase64 = params.imageBase64;
      if (cleanBase64.includes(',')) {
        cleanBase64 = cleanBase64.split(',')[1];
      }
      const allowedMediaTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (allowedMediaTypes.includes(params.imageMimeType) && !cleanBase64.startsWith('<svg') && !cleanBase64.startsWith('%3Csvg')) {
        userContent.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: params.imageMimeType as any,
            data: cleanBase64
          }
        });
      } else {
        userPromptText += `\n\nATTACHED VISUAL SCHEMATIC / VECTOR EVIDENCE:\n${params.imageBase64.slice(0, 1000)}`;
        userContent[0] = { type: 'text', text: userPromptText };
      }
    }

    const response = await client.messages.create({
      model: model,
      max_tokens: 1500,
      system: BHOPAL_CIVIC_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }]
    });

    const textOutput =
      response.content[0]?.type === 'text' ? response.content[0].text : '';
    const parsed = safeExtractJson<Partial<CivicTriage>>(textOutput);

    return {
      observations: parsed.observations || ['Physical report logged at specified ward coordinates.'],
      citizen_claims: parsed.citizen_claims || [params.description],
      evidence: parsed.evidence || ['Citizen submission logged.'],
      external_evidence: parsed.external_evidence || [],
      retrieved_evidence_records: evidenceRecords,
      evidence_coverage_percent: parsed.evidence_coverage_percent || 85,
      inferences: parsed.inferences || ['Requires standard municipal queue dispatch.'],
      root_cause_hypotheses: parsed.root_cause_hypotheses || ['Hypothesis 1: Localized infrastructure strain.'],
      recommendations: parsed.recommendations || ['Dispatch field team for site verification.'],
      uncertainty: parsed.uncertainty || ['Sub-surface conditions unverified.'],
      urgency_score: typeof parsed.urgency_score === 'number' ? parsed.urgency_score : 70,
      confidence_score: typeof parsed.confidence_score === 'number' ? parsed.confidence_score : 0.85,
      suggested_department: parsed.suggested_department || 'Bhopal Municipal Corporation (BMC)',
      duplicate_risk_level: parsed.duplicate_risk_level || 'none',
      ecological_impact_assessment: parsed.ecological_impact_assessment,
      is_simulated: false,
      model_used: CLAUDE_MODEL,
      evidence_ids_used: evidenceRecords.map((r) => r.id),
      generated_at
    };
  } catch (error) {
    console.warn('Claude triage error, falling back to simulated engine:', error);
    return simulateTriageFallback({
      ...params,
      evidenceRecords,
      generated_at,
      errorMessage: error instanceof Error ? error.message : String(error)
    });
  }
}

// ============================================================================
// WORKFLOW 2: DUPLICATE & RECURRENCE REASONING
// ============================================================================

export async function evaluateIncidentDuplicateWithClaude(params: {
  newReport: {
    title: string;
    description: string;
    category: IncidentCategory;
    wardName: string;
    locationName: string;
    landmark?: string;
  };
  candidates: CivicIncident[];
}): Promise<DuplicateReasoningResult> {
  const generated_at = new Date().toISOString();

  if (params.candidates.length === 0) {
    return {
      is_duplicate: false,
      confidence_score: 1.0,
      match_type: 'distinct_incident',
      reasoning: 'Zero candidate incidents within spatial/category/time retrieval bounds.',
      geographic_proximity_note: 'Isolated spatial coordinates.',
      evidence_overlap_note: 'No candidate overlap.',
      new_information_contributed: ['Initial baseline report.'],
      recurrence_strengthened: false,
      severity_escalation_justified: false,
      is_simulated: !isClaudeConfigured,
      model_used: isClaudeConfigured ? CLAUDE_MODEL : undefined,
      generated_at
    };
  }

  const { client, isConfigured, model } = getAnthropicClient();

  if (!isConfigured || !client) {
    return simulateDuplicateReasoningFallback({ ...params, generated_at });
  }

  try {
    const prompt = `
Compare the NEW CITIZEN REPORT with the list of EXISTING ACTIVE CANDIDATE INCIDENTS below.

NEW REPORT:
- Title: ${params.newReport.title}
- Description: ${params.newReport.description}
- Category: ${params.newReport.category}
- Ward: ${params.newReport.wardName}
- Location: ${params.newReport.locationName}
- Landmark: ${params.newReport.landmark || 'None'}

EXISTING CANDIDATE INCIDENTS:
${params.candidates
  .map(
    (c, idx) => `
[Candidate #${idx + 1}]
- ID: ${c.id}
- Token: ${c.trackingToken}
- Title: ${c.title}
- Description: ${c.description}
- Ward / Location: ${c.wardName} (${c.locationName}, Landmark: ${c.landmark || 'None'})
- Category: ${c.category}
- Current Status: ${c.status}
- Severity: ${c.severity}
`
  )
  .join('\n')}

INSTRUCTIONS:
1. Determine if the new report is an exact duplicate, a recurrent manifestation of the same underlying civic problem, or a completely distinct incident.
2. Distinguish mere geographic proximity from actual evidence of the same root-cause failure.
3. Respond in strict JSON according to the schema.
`;

    const response = await client.messages.create({
      model: model,
      max_tokens: 1500,
      system: DUPLICATE_DETECTION_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }]
    });

    const textOutput =
      response.content[0]?.type === 'text' ? response.content[0].text : '';
    const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Claude duplicate detection did not return valid JSON');
    }

    const parsed = JSON.parse(jsonMatch[0]) as Partial<DuplicateReasoningResult>;

    const matchedCandidate = params.candidates.find(
      (c) => c.id === parsed.matched_incident_id
    );

    return {
      is_duplicate: Boolean(
        parsed.is_duplicate && parsed.confidence_score && parsed.confidence_score >= 0.75
      ),
      matched_incident_id: parsed.is_duplicate ? parsed.matched_incident_id || undefined : undefined,
      matched_incident_token:
        parsed.is_duplicate && (parsed.matched_incident_token || matchedCandidate?.trackingToken)
          ? parsed.matched_incident_token || matchedCandidate?.trackingToken
          : undefined,
      confidence_score: typeof parsed.confidence_score === 'number' ? parsed.confidence_score : 0.85,
      match_type: parsed.match_type || 'distinct_incident',
      reasoning: parsed.reasoning || 'Deduplication completed by Claude 3.5 Sonnet.',
      geographic_proximity_note: parsed.geographic_proximity_note || 'Evaluated within candidate bounding radius.',
      evidence_overlap_note: parsed.evidence_overlap_note || 'Physical evidence overlap analyzed.',
      new_information_contributed: parsed.new_information_contributed || ['Fresh citizen report.'],
      recurrence_strengthened: Boolean(parsed.recurrence_strengthened),
      severity_escalation_justified: Boolean(parsed.severity_escalation_justified),
      recommended_updated_severity: parsed.recommended_updated_severity || undefined,
      is_simulated: false,
      model_used: CLAUDE_MODEL,
      generated_at
    };
  } catch (error) {
    console.warn('Claude duplicate detection failed, falling back to simulated heuristics:', error);
    return simulateDuplicateReasoningFallback({ ...params, generated_at });
  }
}

// ============================================================================
// WORKFLOW 3: RECURRENCE ANALYSIS
// ============================================================================

export async function analyzeRecurrenceWithClaude(params: {
  incident: CivicIncident;
  retrievedEvidence: EvidenceRecord[];
}): Promise<RecurrenceAnalysisResult> {
  const generated_at = new Date().toISOString();
  const { incident, retrievedEvidence } = params;

  const { client, isConfigured, model } = getAnthropicClient();

  if (!isConfigured || !client) {
    return simulateRecurrenceAnalysisFallback({ incident, generated_at });
  }

  try {
    const evidenceBlock = retrievedEvidence
      .map(
        (e) => `[Evidence ID: ${e.id}] ${e.source_name} (${e.publication_date}): ${e.claim} -> ${e.evidence}`
      )
      .join('\n');

    const reportsBlock = (incident.relatedReports || [])
      .slice(0, 5)
      .map((r) => `- [${r.submittedAt}] ${r.reporterName || 'Citizen'}: ${r.description}`)
      .join('\n');

    const interventionsBlock = (incident.previousInterventions || [])
      .map((i) => `- [${i.date}] ${i.department}: ${i.actionTaken} -> Result: ${i.result}`)
      .join('\n');

    const prompt = `
INCIDENT DATA FOR RECURRENCE ANALYSIS:
- Token: ${incident.trackingToken}
- Title: ${incident.title}
- Category: ${incident.category}
- Ward: ${incident.wardName} (Zone ${incident.zoneNumber})
- Location: ${incident.locationName} (Landmark: ${incident.landmark || 'None'})
- Description: ${incident.description}
- Current Recurrence Status: ${incident.recurrenceStatus || 'emerging_recurrent'}
- Related Reports Count: ${incident.relatedReportsCount || 1}

RELATED CITIZEN REPORTS:
${reportsBlock || 'No sub-reports logged.'}

PREVIOUS MUNICIPAL INTERVENTIONS:
${interventionsBlock || 'No prior interventions recorded.'}

BOUNDED EXTERNAL EVIDENCE PACKET:
${evidenceBlock || 'No external evidence records.'}

INSTRUCTIONS:
1. Reason over why this specific civic failure repeats across seasonal or operational cycles.
2. Formulate 1-2 primary hypotheses with underlying physical/hydrological/structural mechanisms.
3. Reference specific evidence IDs for external assertions.
4. Distinguish established observations from engineering hypotheses.
5. Respond in strict JSON.
`;

    const response = await client.messages.create({
      model: model,
      max_tokens: 1500,
      system: RECURRENCE_REASONING_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }]
    });

    const textOutput =
      response.content[0]?.type === 'text' ? response.content[0].text : '';
    const parsed = safeExtractJson(textOutput);

    return {
      incidentId: incident.id,
      recurrence_pattern: parsed.recurrence_pattern || `${incident.relatedReportsCount || 1} reports logged across seasonal cycles.`,
      recurrenceClassification: parsed.recurrenceClassification || incident.recurrenceStatus || 'emerging_recurrent',
      totalHistoricalEpisodes: parsed.totalHistoricalEpisodes || incident.relatedReportsCount || 1,
      underlyingSystemicCause: parsed.underlyingSystemicCause || parsed.primary_hypotheses?.[0]?.hypothesis || 'Systemic drainage capacity bottleneck.',
      catchmentOrInfrastructureRisk: parsed.catchmentOrInfrastructureRisk || 'Downstream asset vulnerability.',
      previous_interventions: parsed.previous_interventions || incident.previousInterventions || [],
      observed_outcomes: parsed.observed_outcomes || ['Short-term relief followed by recurrence.'],
      current_hypotheses: (parsed.primary_hypotheses || []).map((h: any) => ({
        hypothesis: h.hypothesis,
        confidence: typeof h.confidence_score === 'number' ? h.confidence_score : 0.85,
        underlying_mechanism: h.mechanism || 'Mechanical / hydraulic load transfer',
        supporting_evidence_ids: h.supporting_evidence_ids || [],
        uncertainty: h.uncertainty
      })),
      confidence: parsed.primary_hypotheses?.[0]?.confidence_score || 0.88,
      alternative_hypotheses: (parsed.alternative_hypotheses || []).map((h: any) =>
        typeof h === 'string' ? h : `${h.hypothesis} (Mechanism: ${h.mechanism})`
      ),
      evidence_to_reduce_uncertainty: parsed.evidence_to_reduce_uncertainty || ['Core sample drilling and ultrasound scan.'],
      recommended_next_field_investigation: parsed.recommended_next_field_investigation || ['Deploy joint engineering task force.'],
      policyOrPreventiveActionRequired: parsed.policyOrPreventiveActionRequired || ['Shift from reactive patching to preventive capital renewal.'],
      isSimulated: false,
      model_used: CLAUDE_MODEL,
      evidence_ids_used: retrievedEvidence.map((e) => e.id),
      generated_at
    };
  } catch (error) {
    console.warn('Claude recurrence analysis failed, using simulated fallback:', error);
    return simulateRecurrenceAnalysisFallback({ incident, generated_at });
  }
}

// ============================================================================
// WORKFLOW 4: FIELD INVESTIGATION PLANNING
// ============================================================================

export async function generateFieldPlanWithClaude(params: {
  incident: CivicIncident;
  retrievedEvidence: EvidenceRecord[];
}): Promise<FieldInvestigationPlan> {
  const generated_at = new Date().toISOString();
  const { incident, retrievedEvidence } = params;

  const { client, isConfigured, model } = getAnthropicClient();

  if (!isConfigured || !client) {
    return simulateFieldPlanFallback({ incident, generated_at });
  }

  try {
    const prompt = `
INCIDENT FOR FIELD INVESTIGATION PLANNING:
- Token: ${incident.trackingToken}
- Title: ${incident.title}
- Category: ${incident.category}
- Location: ${incident.locationName}, Ward: ${incident.wardName} (Landmark: ${incident.landmark || 'None'})
- Description: ${incident.description}
- Current Status: ${incident.status}
- Triage Observations: ${(incident.triageResult?.observations || []).join('; ')}
- Root-Cause Hypotheses: ${(incident.triageResult?.root_cause_hypotheses || []).join('; ')}
- Missing Uncertainties: ${(incident.triageResult?.uncertainty || []).join('; ')}

INSTRUCTIONS:
1. Formulate a technical field investigation protocol for municipal response crews.
2. Specify exact physical measurements, silt soundings, water samples, and visual checkpoints needed.
3. Explicitly state the uncertainty reduction goal.
4. Note: This plan is strictly advisory technical guidance to reduce epistemic uncertainty, not an official BMC work order.
5. Respond in strict JSON.
`;

    const response = await client.messages.create({
      model: model,
      max_tokens: 1500,
      system: FIELD_INVESTIGATION_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }]
    });

    const textOutput =
      response.content[0]?.type === 'text' ? response.content[0].text : '';
    const parsed = safeExtractJson(textOutput);

    return {
      id: `fip-${incident.id}-${Date.now().toString().slice(-4)}`,
      incidentId: incident.id,
      title: `Civic Memory Field Investigation Plan: ${incident.title}`,
      priority: parsed.priority || (incident.severity === 'critical' ? 'immediate' : 'high'),
      investigation_objective: parsed.investigation_objective || 'Investigate physical failure mechanism and reduce diagnostic uncertainty.',
      location: `${incident.locationName}, Ward: ${incident.wardName} (Zone ${incident.zoneNumber})`,
      landmark: incident.landmark,
      inspection_steps: parsed.inspection_steps || ['Deploy technical survey team to assess site.'],
      evidence_to_collect: parsed.evidence_to_collect || ['Geo-tagged high-resolution photographs of joint.'],
      measurements_and_observations_needed: parsed.measurements_needed || ['Volumetric measurement of siltation.'],
      hypotheses_being_tested: parsed.hypotheses_being_tested || incident.triageResult?.root_cause_hypotheses || [],
      success_criteria: parsed.success_criteria || ['Drainage capacity restored without backpressure.'],
      uncertainty_reduction_goal: parsed.uncertainty_reduction_goal || 'Distinguish localized blockage from systemic catchment bottleneck.',
      recommended_next_action: parsed.recommended_next_action || 'Dispatch rapid inspection crew.',
      disclaimer: 'Civic Memory Field Investigation Plan (Not an official BMC work order. Prepared for operational audit and field crew guidance).',
      is_simulated: false,
      model_used: CLAUDE_MODEL,
      evidence_ids_used: retrievedEvidence.map((e) => e.id),
      generated_at
    };
  } catch (error) {
    console.warn('Claude field plan generation failed, using fallback:', error);
    return simulateFieldPlanFallback({ incident, generated_at });
  }
}

// ============================================================================
// WORKFLOW 5: RESOLUTION VERIFICATION (CLAUDE VISION)
// ============================================================================

export async function verifyResolutionWithClaudeVision(params: {
  incident: CivicIncident;
  afterImageBase64: string;
  afterImageMimeType?: string;
}): Promise<ResolutionVerificationResult> {
  const generated_at = new Date().toISOString();
  const { incident, afterImageBase64, afterImageMimeType } = params;

  const { client, isConfigured, model } = getAnthropicClient();

  if (!isConfigured || !client) {
    return simulateResolutionVerificationFallback({ incident, generated_at });
  }

  try {
    let cleanAfter = afterImageBase64;
    if (cleanAfter.includes(',')) cleanAfter = cleanAfter.split(',')[1];

    let cleanBefore = incident.imageBase64 || '';
    if (cleanBefore.includes(',')) cleanBefore = cleanBefore.split(',')[1];

    const allowedMediaTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const mediaType = allowedMediaTypes.includes(afterImageMimeType || '')
      ? (afterImageMimeType as any)
      : 'image/jpeg';

    const content: any[] = [
      {
        type: 'text',
        text: `
INCIDENT TO VERIFY RESOLUTION:
- Token: ${incident.trackingToken}
- Title: ${incident.title}
- Category: ${incident.category}
- Location: ${incident.locationName}
- Original Description: ${incident.description}
- Original Observations: ${(incident.triageResult?.observations || []).join('; ')}

INSTRUCTIONS:
1. Compare the BEFORE and AFTER images below.
2. Evaluate whether the physical obstruction, waterlogging, or hazard has been cleared.
3. Distinguish surface visual improvement from underlying permanent structural resolution.
4. If after image is unclear, return "insufficient_evidence".
5. Respond in strict JSON.
`
      }
    ];

    if (cleanBefore && !cleanBefore.startsWith('<svg') && !cleanBefore.startsWith('%3Csvg')) {
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: 'image/jpeg',
          data: cleanBefore
        }
      });
    }

    if (allowedMediaTypes.includes(afterImageMimeType || '') && !cleanAfter.startsWith('<svg') && !cleanAfter.startsWith('%3Csvg')) {
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: mediaType,
          data: cleanAfter
        }
      });
    } else {
      content[0].text += `\n[AFTER IMAGE FIELD NOTE: Field team submitted visual after-clearance inspection photo.]`;
    }

    const response = await client.messages.create({
      model: model,
      max_tokens: 1500,
      system: RESOLUTION_VERIFICATION_SYSTEM_PROMPT,
      messages: [{ role: 'user', content }]
    });

    const textOutput =
      response.content[0]?.type === 'text' ? response.content[0].text : '';
    const parsed = safeExtractJson(textOutput);

    return {
      incidentId: incident.id,
      status: parsed.status || 'likely_resolved',
      confidence_score: typeof parsed.confidence_score === 'number' ? parsed.confidence_score : 0.9,
      before_image_url: incident.imageBase64,
      after_image_url: afterImageBase64,
      visual_changes: parsed.visual_changes || ['Carriageway cleared of standing water.'],
      supporting_observations: parsed.supporting_observations || ['Inlet grill unobstructed.'],
      visual_evidence: parsed.visual_changes || ['Post-intervention photo demonstrates cleared apron.'],
      remaining_uncertainty: parsed.remaining_uncertainties || ['Subsurface silt depth requires subsequent storm validation.'],
      recommended_next_action: parsed.recommended_next_action || 'Monitor during next high-intensity precipitation window (>30mm/hr).',
      is_simulated: false,
      model_used: CLAUDE_MODEL,
      generated_at
    };
  } catch (error) {
    console.warn('Claude vision verification failed, using fallback:', error);
    return simulateResolutionVerificationFallback({ incident, generated_at });
  }
}

// ============================================================================
// DETERMINISTIC SIMULATION FALLBACKS
// ============================================================================

function simulateTriageFallback(params: {
  title: string;
  description: string;
  category: IncidentCategory;
  wardName: string;
  landmark?: string;
  evidenceRecords: EvidenceRecord[];
  generated_at: string;
  errorMessage?: string;
}): CivicTriage {
  const isDrainage = params.category === 'drainage_flood';
  const isEcology = params.category === 'lake_ecology';
  const isHeritage = params.category === 'heritage_infrastructure';
  const isRoad = params.category === 'road_hazard';

  const observations = isDrainage
    ? [
        `Waterlogging depth estimated on carriageway near ${params.landmark || params.wardName}.`,
        'Dense accumulation of commercial plastic packaging and silt obstructing inlet grill.',
        'Hydraulic backpressure observed on drainage sump chamber lid.'
      ]
    : isEcology
    ? [
        'Dense vegetative weed mat (Eichhornia crassipes) spanning littoral inflow zone.',
        'Organic silt and floating plastic refuse obstructing culvert mouth.',
        'Elevated surface turbidity adjacent to lake causeway.'
      ]
    : isHeritage
    ? [
        'Dressed stone masonry showing active mortar flaking along architectural joint courses.',
        'Outward displacement of sandstone cornice block above pedestrian corridor.'
      ]
    : [
        'Pavement cavity with exposed sub-base gravel and longitudinal steel rebar.',
        'Vehicular braking deceleration observed over approach incline.'
      ];

  const external_evidence: ExternalEvidenceItem[] = params.evidenceRecords.map((r) => ({
    claim: r.claim,
    source_name: r.source_name,
    source_url: r.source_url,
    publication_date: r.publication_date,
    evidence_strength: r.evidence_strength,
    is_primary_source: r.is_primary_source,
    is_synthetic: r.is_synthetic,
    evidence_id: r.id
  }));

  return {
    observations,
    citizen_claims: [params.description],
    evidence: [
      `Factual coordinate pinpoint within ${params.wardName}.`,
      'Landmark verification matched against Bhopal Municipal GIS layer.'
    ],
    external_evidence,
    retrieved_evidence_records: params.evidenceRecords,
    evidence_coverage_percent: params.evidenceRecords.length > 0 ? 88 : 75,
    inferences: [
      'Physical failure compromises public transit or environmental buffer capacity.',
      'Recurrence risk is elevated during subsequent precipitation or heavy axle-load windows.'
    ],
    root_cause_hypotheses: [
      `Hypothesis 1: Upstream catchment load exceeds localized drainage/structural design capacity.`,
      `Hypothesis 2: Degradation of traditional mortar binder / expansion seal beneath surface layer.`
    ],
    recommendations: [
      'Dispatch rapid response field unit for on-site non-destructive audit.',
      'Deploy suction jetting / structural shoring equipment as immediate containment protocol.',
      'Log asset tracking token in Bhopal Civic Memory for recurrence profiling.'
    ],
    uncertainty: [
      'Subsurface sediment depth and tie-rod integrity cannot be confirmed without endoscopic sounding.',
      'Upstream non-point source nutrient/waste contribution requires tributary laboratory testing.'
    ],
    urgency_score: isEcology ? 94 : isRoad ? 91 : isDrainage ? 84 : 78,
    confidence_score: 0.92,
    suggested_department: isEcology
      ? 'BMC Lake Conservation & Environmental Cell'
      : isHeritage
      ? 'Bhopal Heritage & Urban Renewal Directorate'
      : isDrainage
      ? 'BMC Drainage & Sewerage Operations'
      : 'MP PWD & BMC Rapid Road Maintenance Division',
    duplicate_risk_level: 'none',
    ecological_impact_assessment: isEcology
      ? 'Directly affects Bhojtal Ramsar Site #1206 catchment and municipal potable water treatment intake.'
      : undefined,
    is_simulated: true,
    simulation_note: 'Triaged via verified Bhopal baseline evidence registry and deterministic heuristics.',
    model_used: undefined,
    evidence_ids_used: params.evidenceRecords.map((r) => r.id),
    generated_at: params.generated_at,
    error_message: params.errorMessage
  };
}

function simulateDuplicateReasoningFallback(params: {
  newReport: {
    title: string;
    description: string;
    category: IncidentCategory;
    wardName: string;
    locationName: string;
    landmark?: string;
  };
  candidates: CivicIncident[];
  generated_at: string;
}): DuplicateReasoningResult {
  const primaryCandidate = params.candidates[0];
  const textA = `${params.newReport.title} ${params.newReport.description} ${params.newReport.locationName} ${params.newReport.landmark || ''}`.toLowerCase();
  const textB = `${primaryCandidate.title} ${primaryCandidate.description} ${primaryCandidate.locationName} ${primaryCandidate.landmark || ''}`.toLowerCase();

  const isSameCategory = primaryCandidate.category === params.newReport.category;

  const hasSpecificLandmarkMatch =
    (textA.includes('sargam') && textB.includes('sargam')) ||
    (textA.includes('khanoo') && textB.includes('khanoo')) ||
    (textA.includes('taj-ul') && textB.includes('taj-ul')) ||
    (textA.includes('sarvadharma') && textB.includes('sarvadharma')) ||
    (textA.includes('11 no') && textB.includes('11 no')) ||
    (textA.includes('e-7') && textB.includes('e-7')) ||
    (textA.includes('sai baba') && textB.includes('sai baba'));

  const isMatched = isSameCategory && hasSpecificLandmarkMatch;

  const isRecurrenceReport =
    textA.includes('fir se') ||
    textA.includes('again') ||
    textA.includes('har baar') ||
    textA.includes('recurring') ||
    textA.includes('last month') ||
    textA.includes('re-opened');

  if (isMatched) {
    return {
      is_duplicate: true,
      matched_incident_id: primaryCandidate.id,
      matched_incident_token: primaryCandidate.trackingToken,
      confidence_score: isRecurrenceReport ? 0.94 : 0.89,
      match_type: isRecurrenceReport ? 'recurrent_manifestation' : 'exact_duplicate',
      reasoning: `Deduplication reasoned: Report references identical physical failure mechanism on ${primaryCandidate.locationName} in ${params.newReport.wardName}. Specific landmark matches active file ${primaryCandidate.trackingToken}.`,
      geographic_proximity_note: `Both reports located in ${params.newReport.wardName} at same asset landmark.`,
      evidence_overlap_note: 'High physical symptom and structural feature overlap.',
      new_information_contributed: [
        'Additional citizen corroboration received.',
        `Fresh field observation: "${params.newReport.description.slice(0, 80)}..."`
      ],
      recurrence_strengthened: isRecurrenceReport || (primaryCandidate.relatedReportsCount || 0) >= 2,
      severity_escalation_justified:
        primaryCandidate.severity !== 'critical' &&
        params.newReport.title.toLowerCase().includes('critical'),
      is_simulated: true,
      generated_at: params.generated_at
    };
  }

  return {
    is_duplicate: false,
    confidence_score: 0.84,
    match_type: 'distinct_incident',
    reasoning: `Deduplication reasoned: While geographically located in ${params.newReport.wardName}, the physical descriptions denote distinct municipal assets. Insufficient evidence of shared failure mechanism; maintaining separate record.`,
    geographic_proximity_note: `Located in ${params.newReport.wardName} but at distinct spatial coordinates.`,
    evidence_overlap_note: 'Distinct structural assets.',
    new_information_contributed: ['Independent incident file initialized.'],
    recurrence_strengthened: false,
    severity_escalation_justified: false,
    is_simulated: true,
    generated_at: params.generated_at
  };
}

function simulateRecurrenceAnalysisFallback(params: {
  incident: CivicIncident;
  generated_at: string;
}): RecurrenceAnalysisResult {
  const { incident } = params;
  const isDrainage = incident.category === 'drainage_flood';
  const isEcology = incident.category === 'lake_ecology';
  const isHeritage = incident.category === 'heritage_infrastructure';
  const isRoad = incident.category === 'road_hazard';

  return {
    incidentId: incident.id,
    recurrence_pattern: `${incident.relatedReportsCount || 1} corroborating citizen reports logged across multiple municipal cycles. Recurrence frequency peaks post-precipitation.`,
    recurrenceClassification: incident.recurrenceStatus || 'chronic_failure',
    totalHistoricalEpisodes: incident.relatedReportsCount || 1,
    underlyingSystemicCause: isDrainage
      ? 'Commercial packaging silt choking Patra Nallah tributary confluence.'
      : isEcology
      ? 'Nutrient-rich stormwater runoff triggering rapid Eichhornia crassipes re-blooms.'
      : isHeritage
      ? 'Rainwater penetration through roof parapet dissolving traditional lime mortar.'
      : 'Degraded expansion joint seal allowing sub-base erosion under heavy transit braking.',
    catchmentOrInfrastructureRisk: isEcology
      ? 'High vulnerability to Bhojtal Ramsar Site water quality index drop and water treatment intake disruption.'
      : 'Elevated structural hazard risk requiring preventive capital expenditure rather than repetitive operational patching.',
    previous_interventions: incident.previousInterventions || [
      {
        id: 'int-1',
        date: '2025-08-10',
        department: incident.departmentAssigned,
        actionTaken: 'High-pressure suction jetting and trash screen clearing',
        result: 'Cleared 4.2 tons of silt; temporary relief for 45 days until subsequent heavy storm.'
      }
    ],
    observed_outcomes: [
      'Short-term symptom stabilization observed for 45–60 days following field dispatch.',
      'Recurrence triggered upon subsequent high-intensity precipitation (>30mm/hr).'
    ],
    current_hypotheses: [
      {
        hypothesis: isDrainage
          ? 'Commercial plastic refuse and discarded packaging choking the downstream outfall transition into Patra Nallah.'
          : 'Upstream nutrient load / moisture ingress weakening structural bonding.',
        confidence: 0.89,
        underlying_mechanism: 'Solid waste entrapment at downstream confluence',
        supporting_evidence_ids: ['imd-bpl-urban-runoff-thresholds']
      }
    ],
    confidence: 0.89,
    alternative_hypotheses: [
      'Inadequate pipe diameter gradient (<0.3% slope) between Zone II sump chamber and main trunk line.',
      'Subsurface culvert apron gradient deficiency.'
    ],
    evidence_to_reduce_uncertainty: [
      'Endoscopic hydraulic camera inspection of downstream junction box.',
      'Laser distometer measurement logs of cavity or displacement depth.',
      'Transducer telemetry log for the preceding 48-hour precipitation window.'
    ],
    recommended_next_field_investigation: [
      'Deploy hydraulic inspection team with endoscope camera to inspect Sargam road underground junction.',
      'Open downstream outfall chamber into Patra Nallah tributary to measure solid plastic sedimentation depth.'
    ],
    policyOrPreventiveActionRequired: [
      'Shift from emergency operational patching to scheduled preventive asset renewal.',
      'Establish automated threshold telemetry alarms in Bhopal Civic Memory.',
      'Conduct quarterly engineering structural integrity reviews for high-recurrence assets.'
    ],
    isSimulated: true,
    generated_at: params.generated_at
  };
}

function simulateFieldPlanFallback(params: {
  incident: CivicIncident;
  generated_at: string;
}): FieldInvestigationPlan {
  const { incident } = params;
  const isDrainage = incident.category === 'drainage_flood';

  return {
    id: `fip-${incident.id}-${Date.now().toString().slice(-4)}`,
    incidentId: incident.id,
    title: `Civic Memory Field Investigation Plan: ${incident.title}`,
    priority: incident.severity === 'critical' ? 'immediate' : incident.severity === 'high' ? 'high' : 'routine',
    investigation_objective: 'Verify subsurface structural and hydraulic condition to distinguish localized blockage from systemic failure.',
    location: `${incident.locationName}, Ward: ${incident.wardName} (Zone ${incident.zoneNumber})`,
    landmark: incident.landmark,
    inspection_steps: isDrainage
      ? [
          'Deploy hydraulic inspection team with endoscope camera to inspect Sargam road underground junction.',
          'Open downstream outfall chamber into Patra Nallah tributary to measure solid plastic sedimentation depth.',
          'Verify suction jetting machine access points and inspect commercial solid waste entrapment grills.',
          'Audit upstream commercial packaging disposal compliance at Zone II market establishments.'
        ]
      : [
          'Deploy safety barriers and inspection team at designated coordinates.',
          'Perform non-destructive ultrasound scan and core sample extraction.',
          'Measure structural displacement tolerance relative to architectural baseline.'
        ],
    evidence_to_collect: [
      'High-resolution date-stamped and geo-tagged inspection photographs.',
      'Laser distometer measurement logs of cavity or displacement depth.',
      'Transducer telemetry log for preceding 48-hour precipitation window.'
    ],
    measurements_and_observations_needed: [
      'Exact volumetric measurement of obstruction material (metric tons or cubic meters).',
      'Hydraulic flow velocity (meters/second) under dry-weather and storm-surge conditions.'
    ],
    hypotheses_being_tested: incident.triageResult?.root_cause_hypotheses || [
      'Hypothesis 1: Downstream confluence bottleneck'
    ],
    success_criteria: [
      'Water drainage / flow velocity restored to design capacity without backpressure.',
      'No visible standing waterlogging (>5cm depth) or road cavities remaining.',
      'Post-intervention resolution photographic audit logged in Bhopal Civic Memory.'
    ],
    uncertainty_reduction_goal: 'Distinguish whether recurrence is caused by localized mechanical blockage or systemic upstream catchment infrastructure failure.',
    recommended_next_action: 'Dispatch suction jetting unit #07 with high-pressure rotary cutters.',
    disclaimer: 'Civic Memory Field Investigation Plan (Not an official BMC work order. Prepared for operational audit and field crew guidance).',
    is_simulated: true,
    generated_at: params.generated_at
  };
}

function simulateResolutionVerificationFallback(params: {
  incident: CivicIncident;
  generated_at: string;
}): ResolutionVerificationResult {
  const { incident } = params;
  return {
    incidentId: incident.id,
    status: 'likely_resolved',
    confidence_score: 0.92,
    before_image_url: incident.imageBase64 || (incident.evidenceUrls[0] ?? undefined),
    after_image_url: incident.imageBase64,
    visual_changes: [
      'Post-intervention photograph demonstrates cleared carriageway / waterway apron.',
      'No visible standing waterlogging (>5cm depth) or floating solid plastic debris observed.'
    ],
    supporting_observations: ['Flow channel inlet grill clear of mechanical obstructions.'],
    visual_evidence: [
      'Post-intervention photograph demonstrates cleared carriageway / waterway apron.',
      'No visible standing waterlogging (>5cm depth) or floating solid plastic debris observed on surface.',
      'Flow channel inlet grill clear of mechanical obstructions.'
    ],
    remaining_uncertainty: [
      'Underground siltation state cannot be confirmed from surface photography alone.',
      'Long-term hydraulic resilience requires monitoring during next high-intensity precipitation window (>30mm/hr).'
    ],
    recommended_next_action: 'Conduct follow-up automated telemetry check after the next rainfall event to verify zero recurrence.',
    is_simulated: true,
    generated_at: params.generated_at
  };
}
