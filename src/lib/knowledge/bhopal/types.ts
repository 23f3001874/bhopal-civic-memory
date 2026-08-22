/**
 * Bhopal Reality & Evidence Registry Type Definitions.
 * 
 * Explicitly distinguishes:
 * 1. PRIMARY EXTERNAL EVIDENCE (Verified official records e.g. CPCB NWMP, NGT Central Zone, Ramsar Secretariat)
 * 2. CITIZEN-REPORTED EVIDENCE (Direct citizen submissions and field observations)
 * 3. SYNTHETIC DEMO DATA (Development and testing records clearly labeled as synthetic)
 */

export type EvidenceSourceType =
  | 'official_monitoring'
  | 'judicial_order'
  | 'government_gazette'
  | 'scientific_publication'
  | 'citizen_report'
  | 'synthetic_demo';

export type EvidenceStrength = 'conclusive' | 'corroborative' | 'circumstantial' | 'weak';

export interface EvidenceLocation {
  wardId?: string;
  wardName?: string;
  zoneNumber?: number;
  siteName?: string;
  latitude?: number;
  longitude?: number;
  waterBody?: 'Bhojtal_Upper_Lake' | 'Chhota_Talab_Lower_Lake' | 'Shahpura_Lake' | 'Kaliasot_Reservoir' | 'Patra_Nallah' | 'Other';
}

export interface EvidenceRecord {
  id: string;
  title: string;
  source_name: string;
  source_type: EvidenceSourceType;
  source_url?: string;
  publication_date?: string;
  location: EvidenceLocation;
  claim: string;
  evidence: string;
  evidence_strength: EvidenceStrength;
  is_primary_source: boolean;
  is_synthetic: boolean;
  metadata: Record<string, unknown>;
}

export interface EvidenceRetrievalQuery {
  category?: string;
  wardId?: string;
  wardName?: string;
  locationText?: string;
  keywords?: string[];
  waterBody?: string;
  limit?: number;
}
