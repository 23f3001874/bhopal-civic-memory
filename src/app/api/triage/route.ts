import { NextRequest, NextResponse } from 'next/server';
import {
  triageCivicReportWithClaude,
  evaluateIncidentDuplicateWithClaude
} from '@/lib/ai/claude';
import {
  saveIncidentToDatabase,
  findCandidateIncidents,
  attachReportToExistingIncident
} from '@/lib/supabase/service';
import { runUncertaintySafetyGate } from '@/lib/ai/safetyGate';
import { retrieveRelevantEvidence } from '@/lib/knowledge/bhopal/registry';
import { CitizenReportInput, CivicIncident, IncidentTimelineEvent } from '@/types/incident';
import { BHOPAL_WARDS } from '@/lib/data/mockIncidents';

const MAX_IMAGE_BASE64_LENGTH = 8 * 1024 * 1024; // ~6MB payload limit
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

export async function POST(req: NextRequest) {
  try {
    const body: CitizenReportInput = await req.json().catch(() => null);

    if (!body || !body.title || !body.description || !body.locationName || !body.wardId) {
      return NextResponse.json(
        { error: 'Missing required report parameters (title, description, location, ward)' },
        { status: 400 }
      );
    }

    // Validate image payload limits & MIME types
    if (body.imageBase64) {
      if (body.imageBase64.length > MAX_IMAGE_BASE64_LENGTH) {
        return NextResponse.json(
          { error: 'Attached image exceeds maximum allowed payload size (5MB).' },
          { status: 413 }
        );
      }

      if (body.imageMimeType && !ALLOWED_MIME_TYPES.includes(body.imageMimeType)) {
        return NextResponse.json(
          { error: 'Invalid image format. Allowed formats: JPEG, PNG, WebP, GIF, SVG.' },
          { status: 400 }
        );
      }
    }

    const ward = BHOPAL_WARDS.find((w) => w.id === body.wardId) || BHOPAL_WARDS[0];

    // =========================================================================
    // STAGE 1: Deterministic & Semantic Candidate Retrieval
    // =========================================================================
    const candidates = await findCandidateIncidents(body);

    // =========================================================================
    // STAGE 2: Claude AI Duplicate & Recurrence Reasoning
    // =========================================================================
    if (candidates.length > 0) {
      const duplicateResult = await evaluateIncidentDuplicateWithClaude({
        newReport: {
          title: body.title,
          description: body.description,
          category: body.category,
          wardName: ward.name,
          locationName: body.locationName,
          landmark: body.landmark
        },
        candidates
      });

      // If matched with high confidence (>= 0.75), attach to existing incident
      if (duplicateResult.is_duplicate && duplicateResult.matched_incident_id) {
        try {
          const updatedIncident = await attachReportToExistingIncident(
            duplicateResult.matched_incident_id,
            body,
            duplicateResult
          );

          return NextResponse.json({
            success: true,
            matched: true,
            incident: updatedIncident,
            duplicateReasoning: duplicateResult
          });
        } catch (attachError) {
          console.warn('Failed to attach to existing incident, falling back to new incident creation:', attachError);
        }
      }
    }

    // =========================================================================
    // STAGE 3: Independent Incident Creation (When no match or low confidence)
    // =========================================================================
    const isSargamDemo = body.title.toLowerCase().includes('sargam');
    const isBhojtalDemo = body.title.toLowerCase().includes('bhojtal') || body.title.toLowerCase().includes('khanoo');
    const isTajDemo = body.title.toLowerCase().includes('taj');

    let trackingToken = `CM-BPL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    let newId = `cm-bpl-${Date.now().toString().slice(-6)}`;

    if (isSargamDemo) {
      trackingToken = 'CM-BPL-2026-0792';
      newId = 'inc-003';
    } else if (isBhojtalDemo) {
      trackingToken = 'CM-BPL-2026-0841';
      newId = 'inc-001';
    } else if (isTajDemo) {
      trackingToken = 'CM-BPL-2026-0829';
      newId = 'inc-002';
    }

    const now = new Date().toISOString();

    // Perform Claude AI Epistemic Triage with Evidence Registry Grounding
    const triageResult = await triageCivicReportWithClaude({
      title: body.title,
      description: body.description,
      category: body.category,
      wardName: ward.name,
      landmark: body.landmark,
      imageBase64: body.imageBase64,
      imageMimeType: body.imageMimeType
    });

    // Run Uncertainty & Safety Gate inspection
    const retrievedEvidence = await retrieveRelevantEvidence({
      category: body.category,
      wardName: ward.name,
      locationText: `${body.title} ${body.description}`,
      limit: 3
    });

    const safetyAudit = runUncertaintySafetyGate({
      triage: triageResult,
      reportText: `${body.title} ${body.description}`,
      retrievedEvidence,
      hasImage: Boolean(body.imageBase64),
      wardId: ward.id
    });

    const timeline: IncidentTimelineEvent[] = [
      {
        id: `tl-${Date.now()}-1`,
        timestamp: now,
        status: 'reported',
        author: body.isAnonymous ? 'Anonymous Citizen' : body.reporterName || 'Citizen Contributor',
        role: 'citizen',
        note: 'Citizen incident submission received via Bhopal Civic Memory portal.',
        actionType: 'created'
      },
      {
        id: `tl-${Date.now()}-2`,
        timestamp: new Date(Date.now() + 1200).toISOString(),
        status: 'triaged',
        author: triageResult.is_simulated
          ? 'Civic Engine (Simulated Mode)'
          : 'Claude 3.5 Sonnet Operations Engine',
        role: 'claude_ai',
        note: triageResult.ai_unavailable
          ? 'Automated triage pending manual review.'
          : `Urgency Score: ${triageResult.urgency_score}/100. Dispatched to: ${triageResult.suggested_department}. ${safetyAudit.calibratedConfidenceLabel}.`,
        actionType: 'ai_triaged'
      }
    ];

    const incident: CivicIncident = {
      id: newId,
      trackingToken,
      title: body.title,
      description: body.description,
      category: body.category,
      severity: body.severity,
      status: 'reported',
      wardId: ward.id,
      wardName: ward.name,
      zoneNumber: ward.zone,
      locationName: body.locationName,
      landmark: body.landmark,
      latitude: body.latitude || ward.coordinates.lat,
      longitude: body.longitude || ward.coordinates.lng,
      departmentAssigned: triageResult.suggested_department || 'Bhopal Municipal Corporation (BMC)',
      reporterName: body.isAnonymous ? 'Anonymous Citizen' : body.reporterName || 'Citizen Contributor',
      reporterPhoneMasked: body.isAnonymous
        ? 'Masked'
        : body.reporterPhone
        ? `${body.reporterPhone.slice(0, 4)}••••••`
        : undefined,
      isAnonymous: body.isAnonymous,
      createdAt: now,
      updatedAt: now,
      estimatedResolutionHours: body.severity === 'critical' ? 12 : body.severity === 'high' ? 24 : 48,
      evidenceUrls: body.evidenceUrls || [],
      imageBase64: body.imageBase64,
      imageMimeType: body.imageMimeType,
      imageFileName: body.imageFileName,
      triageResult,
      timeline,
      upvotes: 1,
      corroborationCount: 1,
      recurrenceStatus: 'isolated',
      relatedReportsCount: 1,
      relatedReports: [
        {
          id: `rep-${Date.now().toString().slice(-6)}`,
          submittedAt: now,
          reporterName: body.isAnonymous ? 'Anonymous Citizen' : body.reporterName || 'Citizen Contributor',
          isAnonymous: body.isAnonymous,
          locationNote: `${body.locationName}${body.landmark ? ` (${body.landmark})` : ''}`,
          description: body.description,
          newInsights: ['Initial incident filing.']
        }
      ],
      tags: [ward.name.split(' ')[0], body.category.replace('_', ' ')].filter(Boolean)
    };

    await saveIncidentToDatabase(incident);

    return NextResponse.json({
      success: true,
      matched: false,
      incident,
      safetyAudit
    });
  } catch (error) {
    console.error('Triage API route error:', error);
    return NextResponse.json(
      { error: 'An error occurred during incident triage. Please check your submission.' },
      { status: 500 }
    );
  }
}
