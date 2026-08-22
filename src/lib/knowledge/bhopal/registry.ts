import { EvidenceRecord, EvidenceRetrievalQuery } from './types';
import { CPCB_MPPCB_LAKE_RECORDS } from './environment/cpcbLakeMonitoring';
import { NGT_LEGAL_RECORDS } from './legal/ngtOrders';
import { IMD_RAINFALL_RECORDS } from './rainfall/imdRainfall';
import { BMC_WARD_GEOGRAPHY_RECORDS } from './geography/wardBoundaries';
import { SYNTHETIC_DEMO_RECORDS } from './civic/syntheticDemoRecords';

/**
 * MASTER BHOPAL EVIDENCE REGISTRY.
 * Aggregates all primary external evidence (CPCB, NGT, IMD, BMC Gazette)
 * alongside labeled synthetic demo records.
 */
export const BHOPAL_EVIDENCE_REGISTRY: EvidenceRecord[] = [
  ...CPCB_MPPCB_LAKE_RECORDS,
  ...NGT_LEGAL_RECORDS,
  ...IMD_RAINFALL_RECORDS,
  ...BMC_WARD_GEOGRAPHY_RECORDS,
  ...SYNTHETIC_DEMO_RECORDS
];

/**
 * Registry Statistics for Auditing and Epistemic Integrity.
 */
export function getEvidenceRegistryStats() {
  const total = BHOPAL_EVIDENCE_REGISTRY.length;
  const primaryCount = BHOPAL_EVIDENCE_REGISTRY.filter((r) => r.is_primary_source && !r.is_synthetic).length;
  const syntheticCount = BHOPAL_EVIDENCE_REGISTRY.filter((r) => r.is_synthetic).length;

  return {
    totalRecords: total,
    primaryExternalCount: primaryCount,
    syntheticDemoCount: syntheticCount,
    breakdownBySourceType: {
      official_monitoring: BHOPAL_EVIDENCE_REGISTRY.filter((r) => r.source_type === 'official_monitoring').length,
      judicial_order: BHOPAL_EVIDENCE_REGISTRY.filter((r) => r.source_type === 'judicial_order').length,
      government_gazette: BHOPAL_EVIDENCE_REGISTRY.filter((r) => r.source_type === 'government_gazette').length,
      scientific_publication: BHOPAL_EVIDENCE_REGISTRY.filter((r) => r.source_type === 'scientific_publication').length,
      synthetic_demo: BHOPAL_EVIDENCE_REGISTRY.filter((r) => r.source_type === 'synthetic_demo').length
    }
  };
}

/**
 * Retrieves a small, targeted packet of relevant evidence records (3–5 max).
 * Does NOT dump the entire database into prompts.
 */
export async function retrieveRelevantEvidence(
  query: EvidenceRetrievalQuery
): Promise<EvidenceRecord[]> {
  const limit = query.limit || 4;

  const queryText = [
    query.category || '',
    query.wardName || '',
    query.locationText || '',
    ...(query.keywords || [])
  ]
    .join(' ')
    .toLowerCase();

  const queryTokens = queryText
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);

  const scored = BHOPAL_EVIDENCE_REGISTRY.map((record) => {
    let score = 0;

    const recordText = [
      record.title,
      record.claim,
      record.evidence,
      record.location.wardName || '',
      record.location.siteName || '',
      record.location.waterBody || ''
    ]
      .join(' ')
      .toLowerCase();

    // Priority boost for primary external sources
    if (record.is_primary_source) {
      score += 0.5;
    }

    // Ward match
    if (query.wardId && record.location.wardId === query.wardId) {
      score += 3.0;
    }

    // Water body match
    if (
      (queryText.includes('lake') || queryText.includes('bhojtal') || query.category === 'lake_ecology') &&
      record.location.waterBody === 'Bhojtal_Upper_Lake'
    ) {
      score += 3.0;
    }

    if (queryText.includes('shahpura') && record.location.waterBody === 'Shahpura_Lake') {
      score += 3.0;
    }

    // Legal / NGT match
    if (
      (queryText.includes('buffer') || queryText.includes('encroachment') || queryText.includes('construction') || queryText.includes('sewage')) &&
      record.source_type === 'judicial_order'
    ) {
      score += 2.5;
    }

    // Rainfall / Monsoon match
    if (
      (queryText.includes('rain') || queryText.includes('monsoon') || queryText.includes('flood') || queryText.includes('waterlogging') || query.category === 'drainage_flood') &&
      record.id.startsWith('imd-')
    ) {
      score += 2.0;
    }

    // Token frequency overlap
    for (const token of queryTokens) {
      if (recordText.includes(token)) {
        score += 1.0;
      }
    }

    return { record, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Return top candidates with a score threshold
  const topRecords = scored
    .filter((s) => s.score > 0.5)
    .slice(0, limit)
    .map((s) => s.record);

  // If no specific match, return foundational CPCB + NGT records
  if (topRecords.length === 0) {
    return [CPCB_MPPCB_LAKE_RECORDS[0], NGT_LEGAL_RECORDS[0]];
  }

  return topRecords;
}
