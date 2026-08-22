import { supabase, isSupabaseConfigured } from './client';
import {
  CitizenReportInput,
  CivicIncident,
  CivicTriage,
  DuplicateReasoningResult,
  IncidentTimelineEvent,
  RelatedCitizenReport
} from '@/types/incident';
import { INITIAL_INCIDENTS } from '@/lib/data/mockIncidents';
import { computeSemanticSimilarity } from '@/lib/ai/embeddings';

// In-memory / browser fallback store for persistence across page transitions
const memoryStore = new Map<string, CivicIncident>();

// Initialize memory store with initial dataset
INITIAL_INCIDENTS.forEach((inc) => {
  memoryStore.set(inc.id, inc);
  memoryStore.set(inc.trackingToken, inc);
});

/**
 * Retrieves candidate incidents using deterministic filters + semantic ranking.
 * Filters by:
 * 1. Geographic proximity (same ward or within ~2.5km distance)
 * 2. Compatible civic domain/category
 * 3. Recent/Active time window (last 90 days)
 * Caps candidate set to top 3 to 5 incidents.
 */
export async function findCandidateIncidents(
  report: CitizenReportInput
): Promise<CivicIncident[]> {
  const allIncidents = await getAllIncidents();

  // Compatible category pairings for Bhopal municipal issues
  const compatibleCategories: Record<string, string[]> = {
    lake_ecology: ['lake_ecology', 'sanitation_waste', 'environmental', 'drainage_flood'],
    heritage_infrastructure: ['heritage_infrastructure', 'road_hazard', 'public_lighting'],
    road_hazard: ['road_hazard', 'drainage_flood', 'heritage_infrastructure'],
    drainage_flood: ['drainage_flood', 'road_hazard', 'lake_ecology', 'water_supply'],
    water_supply: ['water_supply', 'drainage_flood'],
    sanitation_waste: ['sanitation_waste', 'lake_ecology', 'environmental'],
    public_lighting: ['public_lighting', 'road_hazard'],
    environmental: ['environmental', 'lake_ecology', 'sanitation_waste']
  };

  const allowedCategories = new Set(
    compatibleCategories[report.category] || [report.category]
  );

  // Filter deterministically
  const filtered = allIncidents.filter((inc) => {
    // 1. Category check
    const isCategoryCompatible = allowedCategories.has(inc.category);

    // 2. Geographic check: Same ward or close coordinates
    const isSameWard = inc.wardId === report.wardId;
    const latDiff = Math.abs(inc.latitude - (report.latitude || inc.latitude));
    const lngDiff = Math.abs(inc.longitude - (report.longitude || inc.longitude));
    const isGeoClose = isSameWard || (latDiff < 0.025 && lngDiff < 0.025); // ~2.5km

    // 3. Time window check (past 90 days or active)
    const incidentAgeDays =
      (Date.now() - new Date(inc.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    const isRecent = incidentAgeDays <= 90 || inc.status !== 'resolved';

    return isCategoryCompatible && isGeoClose && isRecent;
  });

  // Rank candidate set using semantic & lexical similarity
  const scored = filtered.map((candidate) => {
    const similarity = computeSemanticSimilarity(
      `${report.title} ${report.description}`,
      `${candidate.title} ${candidate.description}`,
      report.landmark,
      candidate.landmark
    );
    return { candidate, score: similarity };
  });

  scored.sort((a, b) => b.score - a.score);

  // Return top 4 candidates max
  return scored.slice(0, 4).map((s) => s.candidate);
}

/**
 * Attaches a corroborating report to an existing incident record, updating recurrence metrics.
 */
export async function attachReportToExistingIncident(
  existingId: string,
  report: CitizenReportInput,
  duplicateResult: DuplicateReasoningResult
): Promise<CivicIncident> {
  const existing = await getIncidentFromDatabase(existingId);
  if (!existing) {
    throw new Error(`Cannot attach report to non-existent incident: ${existingId}`);
  }

  const now = new Date().toISOString();
  const newRelatedReport: RelatedCitizenReport = {
    id: `rep-${Date.now().toString().slice(-6)}`,
    submittedAt: now,
    reporterName: report.isAnonymous ? 'Anonymous Citizen' : report.reporterName || 'Citizen Contributor',
    isAnonymous: report.isAnonymous,
    locationNote: `${report.locationName}${report.landmark ? ` (${report.landmark})` : ''}`,
    description: report.description,
    newInsights: duplicateResult.new_information_contributed
  };

  const existingRelated = existing.relatedReports || [];
  const updatedRelated = [newRelatedReport, ...existingRelated];
  const newReportCount = (existing.relatedReportsCount || 1) + 1;

  // Determine recurrence classification
  let updatedRecurrence = existing.recurrenceStatus || 'isolated';
  if (newReportCount >= 4 || duplicateResult.recurrence_strengthened) {
    updatedRecurrence = newReportCount >= 4 ? 'chronic_failure' : 'emerging_recurrent';
  }

  // Update severity if escalation justified
  let updatedSeverity = existing.severity;
  if (duplicateResult.severity_escalation_justified && duplicateResult.recommended_updated_severity) {
    updatedSeverity = duplicateResult.recommended_updated_severity;
  }

  // Append new timeline corroboration event
  const corroborationTimelineEvent: IncidentTimelineEvent = {
    id: `tl-${Date.now()}-merge`,
    timestamp: now,
    status: existing.status,
    author: report.isAnonymous ? 'Citizen Contributor' : report.reporterName || 'Citizen Contributor',
    role: 'citizen',
    note: `Corroborating citizen report merged by Claude AI Recurrence Engine (Confidence: ${Math.round(duplicateResult.confidence_score * 100)}%). New insight: ${duplicateResult.new_information_contributed.join('; ')}`,
    actionType: 'duplicate_merged'
  };

  const updatedIncident: CivicIncident = {
    ...existing,
    corroborationCount: (existing.corroborationCount || 1) + 1,
    relatedReportsCount: newReportCount,
    relatedReports: updatedRelated,
    recurrenceStatus: updatedRecurrence,
    severity: updatedSeverity,
    lastDuplicateReasoning: duplicateResult,
    timeline: [...existing.timeline, corroborationTimelineEvent],
    updatedAt: now
  };

  await saveIncidentToDatabase(updatedIncident);
  return updatedIncident;
}

/**
 * Returns all incidents across mock store and database.
 */
export async function getAllIncidents(): Promise<CivicIncident[]> {
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          trackingToken: d.tracking_token,
          title: d.title,
          description: d.description,
          category: d.category,
          severity: d.severity,
          status: d.status,
          wardId: d.ward_id,
          wardName: d.ward_name,
          zoneNumber: d.zone_number,
          locationName: d.location_name,
          landmark: d.landmark,
          latitude: d.latitude,
          longitude: d.longitude,
          departmentAssigned: d.department_assigned,
          reporterName: d.reporter_name,
          reporterPhoneMasked: d.reporter_phone_masked,
          isAnonymous: d.is_anonymous,
          evidenceUrls: d.evidence_urls || [],
          imageBase64: d.image_base64,
          imageMimeType: d.image_mime_type,
          imageFileName: d.image_file_name,
          upvotes: d.upvotes,
          corroborationCount: d.corroboration_count,
          tags: d.tags || [],
          recurrenceStatus: d.recurrence_status,
          relatedReportsCount: d.related_reports_count,
          relatedReports: d.related_reports || [],
          geographicSpan: d.geographic_span,
          previousInterventions: d.previous_interventions || [],
          fieldInvestigationPlan: d.field_investigation_plan || undefined,
          resolutionVerification: d.resolution_verification || undefined,
          timeline: [],
          createdAt: d.created_at,
          updatedAt: d.updated_at,
          resolvedAt: d.resolved_at
        }));
      }
    } catch (err) {
      console.warn('[Supabase] Falling back to memory store:', err);
    }
  }

  // Fallback to in-memory store
  return Array.from(new Set(Array.from(memoryStore.values())));
}

/**
 * Persists an incident to the memory store, localStorage (if client), and Supabase (if configured).
 */
export async function saveIncidentToDatabase(incident: CivicIncident): Promise<CivicIncident> {
  memoryStore.set(incident.id, incident);
  memoryStore.set(incident.trackingToken, incident);

  if (typeof window !== 'undefined') {
    try {
      const storedList: CivicIncident[] = JSON.parse(
        localStorage.getItem('bhopal_civic_incidents') || '[]'
      );
      const updatedList = [incident, ...storedList.filter((i) => i.id !== incident.id)];
      localStorage.setItem('bhopal_civic_incidents', JSON.stringify(updatedList));
    } catch {
      // ignore
    }
  }

  if (supabase && isSupabaseConfigured) {
    try {
      const { error: incError } = await supabase.from('incidents').upsert({
        id: incident.id,
        tracking_token: incident.trackingToken,
        title: incident.title,
        description: incident.description,
        category: incident.category,
        severity: incident.severity,
        status: incident.status,
        ward_id: incident.wardId,
        ward_name: incident.wardName,
        zone_number: incident.zoneNumber,
        location_name: incident.locationName,
        landmark: incident.landmark || null,
        latitude: incident.latitude,
        longitude: incident.longitude,
        department_assigned: incident.departmentAssigned,
        reporter_name: incident.reporterName || null,
        reporter_phone_masked: incident.reporterPhoneMasked || null,
        is_anonymous: incident.isAnonymous,
        evidence_urls: incident.evidenceUrls,
        image_base64: incident.imageBase64 || null,
        image_mime_type: incident.imageMimeType || null,
        image_file_name: incident.imageFileName || null,
        upvotes: incident.upvotes,
        corroboration_count: incident.corroborationCount,
        tags: incident.tags,
        recurrence_status: incident.recurrenceStatus || 'isolated',
        related_reports_count: incident.relatedReportsCount || 1,
        related_reports: incident.relatedReports || [],
        geographic_span: incident.geographicSpan || null,
        previous_interventions: incident.previousInterventions || [],
        field_investigation_plan: incident.fieldInvestigationPlan || null,
        resolution_verification: incident.resolutionVerification || null,
        created_at: incident.createdAt,
        updated_at: incident.updatedAt,
        resolved_at: incident.resolvedAt || null
      });

      if (incError) {
        console.warn('[Supabase] Incident upsert error:', incError.message);
      }

      if (incident.triageResult) {
        const { error: aiError } = await supabase.from('ai_analyses').upsert({
          incident_id: incident.id,
          urgency_score: incident.triageResult.urgency_score,
          confidence_score: incident.triageResult.confidence_score,
          suggested_department: incident.triageResult.suggested_department,
          duplicate_risk_level: incident.triageResult.duplicate_risk_level,
          ecological_impact_assessment: incident.triageResult.ecological_impact_assessment || null,
          observations: incident.triageResult.observations,
          citizen_claims: incident.triageResult.citizen_claims,
          evidence: incident.triageResult.evidence,
          external_evidence: incident.triageResult.external_evidence || [],
          inferences: incident.triageResult.inferences,
          root_cause_hypotheses: incident.triageResult.root_cause_hypotheses,
          recommendations: incident.triageResult.recommendations,
          uncertainty: incident.triageResult.uncertainty,
          evidence_coverage_percent: incident.triageResult.evidence_coverage_percent || 85,
          is_simulated: incident.triageResult.is_simulated,
          simulation_note: incident.triageResult.simulation_note || null,
          model_used: incident.triageResult.model_used || null,
          evidence_ids_used: incident.triageResult.evidence_ids_used || [],
          ai_unavailable: incident.triageResult.ai_unavailable || false,
          error_message: incident.triageResult.error_message || null,
          created_at: incident.createdAt
        });

        if (aiError) {
          console.warn('[Supabase] AI analysis upsert error:', aiError.message);
        }
      }
    } catch (err) {
      console.error('[Supabase] Exception during database persistence:', err);
    }
  }

  return incident;
}

/**
 * Retrieves an incident by ID or Civic Memory Tracking Token.
 */
export async function getIncidentFromDatabase(
  idOrToken: string
): Promise<CivicIncident | null> {
  if (memoryStore.has(idOrToken)) {
    return memoryStore.get(idOrToken) || null;
  }

  if (typeof window !== 'undefined') {
    try {
      const storedList: CivicIncident[] = JSON.parse(
        localStorage.getItem('bhopal_civic_incidents') || '[]'
      );
      const found = storedList.find(
        (i) => i.id === idOrToken || i.trackingToken === idOrToken
      );
      if (found) {
        memoryStore.set(found.id, found);
        memoryStore.set(found.trackingToken, found);
        return found;
      }
    } catch {
      // ignore
    }
  }

  if (supabase && isSupabaseConfigured) {
    try {
      const { data: incData, error: incError } = await supabase
        .from('incidents')
        .select('*')
        .or(`id.eq.${idOrToken},tracking_token.eq.${idOrToken}`)
        .single();

      if (incError || !incData) {
        return null;
      }

      const { data: aiData } = await supabase
        .from('ai_analyses')
        .select('*')
        .eq('incident_id', incData.id)
        .maybeSingle();

      const { data: tlData } = await supabase
        .from('incident_timeline_events')
        .select('*')
        .eq('incident_id', incData.id)
        .order('created_at', { ascending: true });

      const triageResult: CivicTriage | undefined = aiData
        ? {
            observations: Array.isArray(aiData.observations) ? aiData.observations : [],
            citizen_claims: Array.isArray(aiData.citizen_claims) ? aiData.citizen_claims : [],
            evidence: Array.isArray(aiData.evidence) ? aiData.evidence : [],
            external_evidence: Array.isArray(aiData.external_evidence) ? aiData.external_evidence : [],
            inferences: Array.isArray(aiData.inferences) ? aiData.inferences : [],
            root_cause_hypotheses: Array.isArray(aiData.root_cause_hypotheses) ? aiData.root_cause_hypotheses : [],
            recommendations: Array.isArray(aiData.recommendations) ? aiData.recommendations : [],
            uncertainty: Array.isArray(aiData.uncertainty) ? aiData.uncertainty : [],
            evidence_coverage_percent: aiData.evidence_coverage_percent || 85,
            urgency_score: aiData.urgency_score,
            confidence_score: aiData.confidence_score,
            suggested_department: aiData.suggested_department,
            duplicate_risk_level: aiData.duplicate_risk_level,
            ecological_impact_assessment: aiData.ecological_impact_assessment,
            is_simulated: aiData.is_simulated,
            simulation_note: aiData.simulation_note,
            model_used: aiData.model_used,
            evidence_ids_used: aiData.evidence_ids_used || [],
            ai_unavailable: aiData.ai_unavailable,
            error_message: aiData.error_message
          }
        : undefined;

      const timeline: IncidentTimelineEvent[] = (tlData || []).map((tl: any) => ({
        id: tl.id,
        timestamp: tl.created_at,
        status: tl.status,
        author: tl.author,
        role: tl.role,
        note: tl.note,
        actionType: tl.action_type
      }));

      const constructed: CivicIncident = {
        id: incData.id,
        trackingToken: incData.tracking_token,
        title: incData.title,
        description: incData.description,
        category: incData.category,
        severity: incData.severity,
        status: incData.status,
        wardId: incData.ward_id,
        wardName: incData.ward_name,
        zoneNumber: incData.zone_number,
        locationName: incData.location_name,
        landmark: incData.landmark,
        latitude: incData.latitude,
        longitude: incData.longitude,
        departmentAssigned: incData.department_assigned,
        reporterName: incData.reporter_name,
        reporterPhoneMasked: incData.reporter_phone_masked,
        isAnonymous: incData.is_anonymous,
        evidenceUrls: incData.evidence_urls || [],
        imageBase64: incData.image_base64,
        imageMimeType: incData.image_mime_type,
        imageFileName: incData.image_file_name,
        recurrenceStatus: incData.recurrence_status,
        relatedReportsCount: incData.related_reports_count,
        relatedReports: incData.related_reports || [],
        geographicSpan: incData.geographic_span,
        previousInterventions: incData.previous_interventions || [],
        fieldInvestigationPlan: incData.field_investigation_plan || undefined,
        resolutionVerification: incData.resolution_verification || undefined,
        triageResult,
        timeline,
        upvotes: incData.upvotes,
        corroborationCount: incData.corroboration_count,
        tags: incData.tags || [],
        createdAt: incData.created_at,
        updatedAt: incData.updated_at,
        resolvedAt: incData.resolved_at
      };

      memoryStore.set(constructed.id, constructed);
      memoryStore.set(constructed.trackingToken, constructed);
      return constructed;
    } catch (err) {
      console.error('[Supabase] Error fetching incident:', err);
    }
  }

  return null;
}
