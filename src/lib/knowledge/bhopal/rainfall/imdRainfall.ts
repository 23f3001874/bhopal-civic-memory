import { EvidenceRecord } from '../types';

/**
 * PRIMARY EXTERNAL EVIDENCE: India Meteorological Department (IMD)
 * Meteorological Centre Bhopal (Station ID: 42667 / BPL Airport & Bairagarh Observatory).
 * 
 * Sources:
 * - IMD Meteorological Centre Bhopal: https://mausam.imd.gov.in/bhopal/
 * - IMD Climate Normals (1981–2010 / 1991–2020) for Bhopal Station
 */
export const IMD_RAINFALL_RECORDS: EvidenceRecord[] = [
  {
    id: 'imd-bpl-normal-climate',
    title: 'IMD Bhopal Climate Normal: Annual & Monsoon Precipitation Profile',
    source_name: 'India Meteorological Department (IMD), Meteorological Centre Bhopal',
    source_type: 'official_monitoring',
    source_url: 'https://mausam.imd.gov.in/bhopal/',
    publication_date: '2023-01-01',
    location: {
      siteName: 'IMD Bhopal Observatory (Station 42667), Bairagarh / Raja Bhoj Airport',
      latitude: 23.2878,
      longitude: 77.3464
    },
    claim: 'Bhopal experiences an average annual rainfall of 1126.7 mm, with ~92% (approx 1030 mm) concentrated in the South-West Monsoon months (June to September).',
    evidence: 'Official IMD climatological normal table shows peak rainfall occurring in July (average ~371.6 mm) and August (average ~368.5 mm). Daily rainfall events exceeding 65 mm/day trigger intense flash runoff surges across urban stormwater drains.',
    evidence_strength: 'conclusive',
    is_primary_source: true,
    is_synthetic: false,
    metadata: {
      station_id: '42667',
      elevation_msl: '523.0 meters',
      mean_annual_rainfall_mm: 1126.7,
      monsoon_concentration_percent: 92.4,
      peak_rainfall_months: ['July', 'August']
    }
  },
  {
    id: 'imd-bpl-urban-runoff-thresholds',
    title: 'IMD Urban Hydrometeorological Thresholds for Bhopal Basin',
    source_name: 'India Meteorological Department / Central Water Commission (CWC)',
    source_type: 'scientific_publication',
    source_url: 'https://mausam.imd.gov.in/bhopal/',
    publication_date: '2022-07-15',
    location: {
      siteName: 'Bhopal Urban Catchments (Patra Nallah, Kaliasot & Halali Basins)'
    },
    claim: 'High-intensity convective cloud bursts (>30mm in 1 hour) exceed the gravitational drainage capacity of central Bhopal stormwater sumps (MP Nagar Zone II, TT Nagar New Market).',
    evidence: 'Hydrological runoff model records indicate that when 24-hour rainfall exceeds 75mm, Upper Lake inflow weirs reach capacity and downstream discharge into Kaliasot spillway requires automated radial gate opening.',
    evidence_strength: 'conclusive',
    is_primary_source: true,
    is_synthetic: false,
    metadata: {
      hydrological_basin: 'Betwa Sub-Basin / Ganga Basin',
      drainage_confluence: ['Patra Nallah', 'Kaliasot River', 'Bhadbhada Spillway']
    }
  }
];
