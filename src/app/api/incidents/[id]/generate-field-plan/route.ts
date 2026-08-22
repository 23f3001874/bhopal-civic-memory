import { NextRequest, NextResponse } from 'next/server';
import { getIncidentFromDatabase, saveIncidentToDatabase } from '@/lib/supabase/service';
import { generateFieldPlanWithClaude } from '@/lib/ai/claude';
import { retrieveRelevantEvidence } from '@/lib/knowledge/bhopal/registry';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid incident ID parameter' }, { status: 400 });
    }

    const incident = await getIncidentFromDatabase(id);

    if (!incident) {
      return NextResponse.json({ error: 'Incident record not found in Civic Memory' }, { status: 404 });
    }

    // Retrieve bounded evidence packet
    const retrievedEvidence = await retrieveRelevantEvidence({
      category: incident.category,
      wardName: incident.wardName,
      locationText: `${incident.title} ${incident.description} ${incident.locationName}`,
      limit: 3
    });

    // Call live Claude Field Plan Generator (or graceful fallback)
    const plan = await generateFieldPlanWithClaude({
      incident,
      retrievedEvidence
    });

    // Ensure explicit non-authoritative disclaimer is maintained
    plan.disclaimer =
      'Civic Memory Field Investigation Plan (Not an official BMC work order. Prepared for operational audit and field crew guidance).';

    incident.fieldInvestigationPlan = plan;
    await saveIncidentToDatabase(incident);

    return NextResponse.json({
      success: true,
      plan
    });
  } catch (error) {
    console.error('Field plan generation error:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating the field investigation plan.' },
      { status: 500 }
    );
  }
}
