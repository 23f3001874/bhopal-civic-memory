import { NextRequest, NextResponse } from 'next/server';
import { getIncidentFromDatabase, saveIncidentToDatabase } from '@/lib/supabase/service';
import { verifyResolutionWithClaudeVision } from '@/lib/ai/claude';
import { validateResolutionEvidence } from '@/lib/ai/safetyGate';
import { IncidentTimelineEvent, ResolutionVerificationResult } from '@/types/incident';

const MAX_IMAGE_BASE64_LENGTH = 8 * 1024 * 1024; // ~6MB payload limit
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid incident ID parameter' }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const incident = await getIncidentFromDatabase(id);

    if (!incident) {
      return NextResponse.json({ error: 'Incident record not found in Civic Memory' }, { status: 404 });
    }

    const afterImage = body.afterImage || null;
    const notes = body.notes || 'Field intervention completed by response crew.';

    // Validate after image payload limits & MIME types
    if (afterImage) {
      if (afterImage.length > MAX_IMAGE_BASE64_LENGTH) {
        return NextResponse.json(
          { error: 'After-photo exceeds maximum allowed payload size (5MB).' },
          { status: 413 }
        );
      }

      if (body.afterImageMimeType && !ALLOWED_MIME_TYPES.includes(body.afterImageMimeType)) {
        return NextResponse.json(
          { error: 'Invalid image format. Allowed formats: JPEG, PNG, WebP, GIF, SVG.' },
          { status: 400 }
        );
      }
    }

    // Safety Gate: If no after-photo is provided, reject verification immediately without calling Claude Vision
    if (!afterImage) {
      const unverifiedResult: ResolutionVerificationResult = {
        incidentId: incident.id,
        status: 'insufficient_evidence',
        confidence_score: 0.35,
        before_image_url: incident.imageBase64,
        after_image_url: undefined,
        visual_evidence: ['No post-intervention photographic evidence provided for optical comparison.'],
        remaining_uncertainty: ['Resolution cannot be confirmed without verifiable after-photo evidence.'],
        recommended_next_action: 'Require field supervisor to upload geo-tagged post-intervention photograph.',
        is_simulated: true,
        generated_at: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        verification: unverifiedResult
      });
    }

    // Call live Claude Vision (or fallback)
    const verification = await verifyResolutionWithClaudeVision({
      incident,
      afterImageBase64: afterImage,
      afterImageMimeType: body.afterImageMimeType || 'image/jpeg'
    });

    // Run deterministic safety validation gate
    const validatedVerification = validateResolutionEvidence(verification, Boolean(afterImage));

    if (validatedVerification.status === 'likely_resolved') {
      incident.status = 'resolved';
      incident.resolvedAt = new Date().toISOString();
    }

    incident.resolutionVerification = validatedVerification;

    const resolveTimelineEvent: IncidentTimelineEvent = {
      id: `tl-${Date.now()}-resolved`,
      timestamp: new Date().toISOString(),
      status: incident.status,
      author: validatedVerification.is_simulated
        ? 'Resolution Verification Engine (Simulated)'
        : 'Claude 3.5 Sonnet Vision Audit',
      role: 'claude_ai',
      note: `Resolution Audit (${validatedVerification.status.replace('_', ' ').toUpperCase()}). Model Score: ${validatedVerification.confidence_score.toFixed(2)}. ${validatedVerification.visual_evidence[0] || ''} ${notes}`,
      actionType: 'verified_resolved'
    };

    incident.timeline.push(resolveTimelineEvent);
    await saveIncidentToDatabase(incident);

    return NextResponse.json({
      success: true,
      verification: validatedVerification,
      incident
    });
  } catch (error) {
    console.error('Resolution verification error:', error);
    return NextResponse.json(
      { error: 'An error occurred during resolution verification audit.' },
      { status: 500 }
    );
  }
}
