import { EvidenceRecord } from '../types';

/**
 * SYNTHETIC DEMO EVIDENCE RECORDS.
 * 
 * DISCLAIMER: These records are simulated evaluation and demo data created for
 * testing the Bhopal Civic Memory reasoning engine. They are explicitly marked
 * with is_synthetic = true and source_type = 'synthetic_demo'.
 * They DO NOT represent real official citizen complaints or live BMC telemetry.
 */
export const SYNTHETIC_DEMO_RECORDS: EvidenceRecord[] = [
  {
    id: 'syn-demo-vip-road-01',
    title: 'Synthetic Citizen Report: VIP Road Khanoo Gaon Inflow Weed Choke',
    source_name: 'Bhopal Civic Memory Simulated Citizen Portal',
    source_type: 'synthetic_demo',
    publication_date: '2026-08-21',
    location: {
      wardId: 'ward-07',
      wardName: 'Shamla Hills & Lake View',
      siteName: 'VIP Road Khanoo Gaon Inflow',
      waterBody: 'Bhojtal_Upper_Lake'
    },
    claim: 'Citizen report asserting dense water hyacinth accumulation at culvert apron opposite Raja Bhoj statue.',
    evidence: 'Simulated textual description and sample photo payload used for evaluating duplicate detection algorithms.',
    evidence_strength: 'corroborative',
    is_primary_source: false,
    is_synthetic: true,
    metadata: {
      benchmark_tag: 'eval-merge-01',
      simulation_purpose: 'Duplicate & Recurrence Engine Evaluation'
    }
  },
  {
    id: 'syn-demo-taj-masjid-02',
    title: 'Synthetic Citizen Report: Taj-ul-Masajid North Gate Mortar Crumbling',
    source_name: 'Bhopal Civic Memory Simulated Citizen Portal',
    source_type: 'synthetic_demo',
    publication_date: '2026-08-21',
    location: {
      wardId: 'ward-12',
      wardName: 'Old City & Bada Bagh Corridor',
      siteName: 'Taj-ul-Masajid North Gate'
    },
    claim: 'Citizen report asserting red sandstone cornice displacement after heavy rain.',
    evidence: 'Simulated benchmark entry used for testing heritage infrastructure incident dispatch routing.',
    evidence_strength: 'corroborative',
    is_primary_source: false,
    is_synthetic: true,
    metadata: {
      benchmark_tag: 'eval-merge-02',
      simulation_purpose: 'Heritage Conservation Triage Testing'
    }
  },
  {
    id: 'syn-demo-mpnagar-sump-03',
    title: 'Synthetic Sensor Telemetry: MP Nagar Zone II Transducer #MPN-08',
    source_name: 'Simulated Municipal IoT Transducer Relay',
    source_type: 'synthetic_demo',
    publication_date: '2026-08-20',
    location: {
      wardId: 'ward-45',
      wardName: 'MP Nagar Commercial District (Zone I & II)',
      siteName: 'Sargam Cinema Road Sump'
    },
    claim: 'Simulated transducer alert indicating waterlogging depth > 35cm in commercial carriageway.',
    evidence: 'Synthetic telemetry payload for testing automated sensor threshold escalation.',
    evidence_strength: 'corroborative',
    is_primary_source: false,
    is_synthetic: true,
    metadata: {
      sensor_model: 'Simulated HydroTransducer v2',
      simulation_purpose: 'Sensor Ingestion Pipeline Testing'
    }
  }
];
