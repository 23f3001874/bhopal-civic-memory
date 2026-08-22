import { EvidenceRecord } from '@/lib/knowledge/bhopal/types';

export type IncidentCategory =
  | 'lake_ecology'
  | 'heritage_infrastructure'
  | 'sanitation_waste'
  | 'water_supply'
  | 'road_hazard'
  | 'drainage_flood'
  | 'public_lighting'
  | 'environmental';

export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';

export type IncidentStatus =
  | 'reported'
  | 'triaged'
  | 'in_progress'
  | 'verified'
  | 'resolved'
  | 'archived';

export type RecurrenceStatus =
  | 'isolated'
  | 'emerging_recurrent'
  | 'chronic_failure';

export interface IncidentTimelineEvent {
  id: string;
  timestamp: string;
  status: IncidentStatus;
  author: string;
  role: 'citizen' | 'claude_ai' | 'ward_officer' | 'municipal_admin' | 'field_crew';
  note: string;
  actionType:
    | 'created'
    | 'ai_triaged'
    | 'duplicate_merged'
    | 'assigned'
    | 'inspected'
    | 'remediated'
    | 'verified_resolved';
}

/**
 * Structured Evidence Item model.
 * Traces AI conclusions back to verifiable physical, visual, sensor, or citizen sources.
 */
export interface EvidenceItem {
  id: string;
  source_type:
    | 'official_monitoring'
    | 'judicial_order'
    | 'government_gazette'
    | 'scientific_publication'
    | 'citizen_report'
    | 'photograph'
    | 'sensor_telemetry'
    | 'ward_historical_record'
    | 'system_spatial_binding'
    | 'synthetic_demo';
  source_name?: string;
  source_url?: string;
  source_description: string;
  source_timestamp?: string;
  geographic_relevance: string;
  evidence_strength: 'conclusive' | 'corroborative' | 'circumstantial' | 'weak';
  evidence_origin: 'citizen_reported' | 'system_derived' | 'externally_sourced';
  is_primary_source: boolean;
  is_synthetic: boolean;
  supported_conclusion?: string;
  reasoning_chain?: string[];
}

export interface ExternalEvidenceItem {
  claim: string;
  source_name: string;
  source_url?: string;
  publication_date?: string;
  evidence_strength: 'conclusive' | 'corroborative' | 'circumstantial' | 'weak';
  is_primary_source: boolean;
  is_synthetic: boolean;
  evidence_id?: string;
}

/**
 * Structured Epistemic Triage Output from Claude AI.
 */
export interface CivicTriage {
  observations: string[];
  citizen_claims: string[];
  evidence: string[];
  external_evidence?: ExternalEvidenceItem[];
  structured_evidence?: EvidenceItem[];
  retrieved_evidence_records?: EvidenceRecord[];
  evidence_coverage_percent?: number; // % of inferences/hypotheses supported by at least 1 evidence record
  inferences: string[];
  root_cause_hypotheses: string[];
  recommendations: string[];
  uncertainty: string[];
  urgency_score: number; // 0 - 100
  confidence_score: number; // 0.0 - 1.0
  suggested_department: string;
  duplicate_risk_level: 'none' | 'low' | 'moderate' | 'high';
  ecological_impact_assessment?: string;
  is_simulated: boolean;
  simulation_note?: string;
  model_used?: string;
  evidence_ids_used?: string[];
  generated_at?: string;
  ai_unavailable?: boolean;
  error_message?: string;
}

/**
 * Claude AI Duplicate & Recurrence Reasoning Result.
 */
export interface DuplicateReasoningResult {
  is_duplicate: boolean;
  matched_incident_id?: string;
  matched_incident_token?: string;
  confidence_score: number; // 0.0 - 1.0
  match_type: 'exact_duplicate' | 'recurrent_manifestation' | 'distinct_incident';
  reasoning: string;
  geographic_proximity_note: string;
  evidence_overlap_note: string;
  supporting_evidence?: EvidenceItem[];
  new_information_contributed: string[];
  recurrence_strengthened: boolean;
  severity_escalation_justified: boolean;
  recommended_updated_severity?: IncidentSeverity;
  is_simulated: boolean;
  model_used?: string;
  generated_at?: string;
  ai_unavailable?: boolean;
}

export interface RelatedCitizenReport {
  id: string;
  submittedAt: string;
  reporterName?: string;
  isAnonymous: boolean;
  locationNote: string;
  description: string;
  newInsights: string[];
}

export interface PreviousIntervention {
  id: string;
  date: string;
  department: string;
  actionTaken: string;
  result: string;
}

export interface RecurrenceHypothesis {
  hypothesis: string;
  confidence: number; // 0.0 - 1.0
  underlying_mechanism: string;
  supporting_evidence_ids?: string[];
  uncertainty?: string;
}

export interface RecurrenceAnalysisResult {
  incidentId: string;
  recurrence_pattern: string;
  recurrenceClassification: RecurrenceStatus;
  totalHistoricalEpisodes: number;
  underlyingSystemicCause: string;
  catchmentOrInfrastructureRisk: string;
  previous_interventions: PreviousIntervention[];
  observed_outcomes: string[];
  current_hypotheses: RecurrenceHypothesis[];
  confidence: number;
  alternative_hypotheses: Array<string | RecurrenceHypothesis>;
  evidence_to_reduce_uncertainty: string[];
  recommended_next_field_investigation: string[];
  policyOrPreventiveActionRequired: string[];
  isSimulated: boolean;
  model_used?: string;
  evidence_ids_used?: string[];
  generated_at?: string;
}

export interface FieldInvestigationPlan {
  id: string;
  incidentId: string;
  title: string;
  priority: 'immediate' | 'high' | 'routine';
  investigation_objective?: string;
  location: string;
  landmark?: string;
  inspection_steps: string[];
  evidence_to_collect: string[];
  measurements_and_observations_needed: string[];
  hypotheses_being_tested?: string[];
  success_criteria: string[];
  uncertainty_reduction_goal: string;
  recommended_next_action?: string;
  disclaimer: string;
  is_simulated: boolean;
  model_used?: string;
  evidence_ids_used?: string[];
  generated_at?: string;
}

export interface ResolutionVerificationResult {
  incidentId: string;
  status: 'likely_resolved' | 'likely_unresolved' | 'insufficient_evidence';
  confidence_score: number; // 0.0 - 1.0
  before_image_url?: string;
  after_image_url?: string;
  visual_changes?: string[];
  supporting_observations?: string[];
  visual_evidence: string[];
  remaining_uncertainty: string[];
  recommended_next_action: string;
  is_simulated: boolean;
  model_used?: string;
  generated_at?: string;
}

export interface CivicIncident {
  id: string;
  trackingToken: string; // Civic Memory Incident ID e.g. CM-BPL-2026-0841
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  wardId: string;
  wardName: string;
  zoneNumber: number;
  locationName: string;
  landmark?: string;
  latitude: number;
  longitude: number;
  departmentAssigned: string;
  reporterName?: string;
  reporterPhoneMasked?: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  estimatedResolutionHours?: number;
  evidenceUrls: string[];
  imageBase64?: string;
  imageMimeType?: string;
  imageFileName?: string;
  triageResult?: CivicTriage;
  timeline: IncidentTimelineEvent[];
  upvotes: number;
  corroborationCount: number;
  tags: string[];

  // Civic Memory & Recurrence Tracking
  recurrenceStatus?: RecurrenceStatus;
  relatedReportsCount?: number;
  relatedReports?: RelatedCitizenReport[];
  geographicSpan?: string;
  previousInterventions?: PreviousIntervention[];
  lastDuplicateReasoning?: DuplicateReasoningResult;

  // Reality & Evidence Registry
  evidenceRecords?: EvidenceRecord[];
  evidenceCoveragePercent?: number;

  // Field Plan & Verification
  fieldInvestigationPlan?: FieldInvestigationPlan;
  resolutionVerification?: ResolutionVerificationResult;
}

export interface BhopalWard {
  id: string;
  code: string; // e.g. W-24
  name: string;
  zone: number;
  counselorName: string;
  activeIncidents: number;
  criticalIncidents: number;
  resolvedThisMonth: number;
  healthIndexScore: number; // 0 - 100
  keyLandmarks: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface CivicPulseMetrics {
  totalActiveIncidents: number;
  criticalAlerts: number;
  resolvedLast7Days: number;
  avgResolutionTimeHours: number;
  bhojtalLakeQualityIndex: number; // e.g. 78/100
  overallCityHealthIndex: number;
  activeWardsMonitored: number;
  sensorAlertsToday: number;
}

export interface CitizenReportInput {
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  wardId: string;
  locationName: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  reporterName?: string;
  reporterPhone?: string;
  isAnonymous: boolean;
  evidenceUrls: string[];
  imageBase64?: string;
  imageMimeType?: string;
  imageFileName?: string;
}
