import { EvidenceRecord } from '../types';

/**
 * PRIMARY EXTERNAL EVIDENCE: National Green Tribunal (NGT) Principal Bench & Central Zone Bench (Bhopal).
 * 
 * Case Citations:
 * - OA No. 12/2025(CZ), Rashid Noor Khan Vs Collector, Bhopal & Ors.
 *   Court: National Green Tribunal, Central Zone Bench, Bhopal
 *   Subject: Conservation of Bhoj Wetland (Ramsar Site #1206), prevention of sewage discharge,
 *   removal of encroachments, and enforcement of Full Tank Level (FTL) buffer zones.
 *   Source: https://greentribunal.gov.in/
 */
export const NGT_LEGAL_RECORDS: EvidenceRecord[] = [
  {
    id: 'ngt-cz-oa-12-2025',
    title: 'NGT Central Zone Bench: OA 12/2025(CZ) Rashid Noor Khan Vs Collector, Bhopal & Ors.',
    source_name: 'National Green Tribunal (Central Zone Bench, Bhopal)',
    source_type: 'judicial_order',
    source_url: 'https://greentribunal.gov.in/',
    publication_date: '2025-01-28',
    location: {
      wardId: 'ward-07',
      wardName: 'Shamla Hills & Lake View',
      siteName: 'Bhoj Wetland Catchment & Full Tank Level (FTL) Buffer Line (508.65m RL)',
      waterBody: 'Bhojtal_Upper_Lake'
    },
    claim: 'Enforcement of statutory protection around Full Tank Level (FTL 508.65m RL / 1668.5 ft) of Bhoj Wetland; prohibition of un-treated sewage inflows, mechanized commercial encroachments, and unauthorized permanent construction within 50m green buffer.',
    evidence: 'Judicial directive issued to Bhopal Municipal Corporation, Collector Bhopal, and MPPCB mandating immediate ground-truthing of sewage interception at VIP road / Khanugaon drains, removal of debris dumps, and installation of functioning sewage treatment plants before storm outfalls reach the lake basin.',
    evidence_strength: 'conclusive',
    is_primary_source: true,
    is_synthetic: false,
    metadata: {
      case_number: 'Original Application No. 12/2025(CZ)',
      petitioner: 'Rashid Noor Khan',
      respondents: ['Collector, Bhopal', 'Bhopal Municipal Corporation (BMC)', 'Madhya Pradesh Pollution Control Board (MPPCB)', 'State of Madhya Pradesh'],
      ftl_datum: '508.65 meters above Mean Sea Level (MSL)',
      buffer_zone_statutory_distance: '50 meters from defined FTL contour'
    }
  },
  {
    id: 'ngt-cz-wetland-buffer-rules',
    title: 'Madhya Pradesh Wetland Conservation Notification (Rule 4, Wetlands Rules 2017)',
    source_name: 'Government of Madhya Pradesh / State Wetland Authority (EPCO)',
    source_type: 'government_gazette',
    source_url: 'http://epco.in/wetlands.html',
    publication_date: '2020-03-12',
    location: {
      siteName: 'Bhoj Wetland Protected Zone',
      waterBody: 'Bhojtal_Upper_Lake'
    },
    claim: 'Prohibition of solid waste dumping, reclamation, setting up of new industries, or expansion of existing industries within notified wetland boundary and catchment influence zones.',
    evidence: 'State Environment Department statutory gazette implementing Wetlands (Conservation and Management) Rules, 2017. Establishes dedicated Lake Conservation and Management Cell within BMC.',
    evidence_strength: 'conclusive',
    is_primary_source: true,
    is_synthetic: false,
    metadata: {
      statutory_framework: 'Wetlands (Conservation and Management) Rules, 2017',
      executing_body: 'Environmental Planning & Coordination Organisation (EPCO) & BMC'
    }
  }
];
