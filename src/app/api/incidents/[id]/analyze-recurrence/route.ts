import { NextRequest, NextResponse } from 'next/server';
import { getIncidentFromDatabase, saveIncidentToDatabase } from '@/lib/supabase/service';
import { analyzeRecurrenceWithClaude } from '@/lib/ai/claude';
import { retrieveRelevantEvidence } from '@/lib/knowledge/bhopal/registry';

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

    // Bounded external evidence retrieval
    const retrievedEvidence = await retrieveRelevantEvidence({
      category: incident.category,
      wardName: incident.wardName,
      locationText: `${incident.title} ${incident.description} ${incident.locationName}`,
      limit: 3
    });

    // Call live Claude Recurrence Reasoning (or graceful fallback)
    const analysis = await analyzeRecurrenceWithClaude({
      incident,
      retrievedEvidence
    });

    return NextResponse.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Recurrence analysis error:', error);
    return NextResponse.json(
      { error: 'An error occurred during recurrence diagnostic analysis.' },
      { status: 500 }
    );
  }
}
