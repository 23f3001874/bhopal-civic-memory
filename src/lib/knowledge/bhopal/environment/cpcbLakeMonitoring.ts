import { EvidenceRecord } from '../types';

/**
 * PRIMARY EXTERNAL EVIDENCE: Central Pollution Control Board (CPCB) &
 * Madhya Pradesh Pollution Control Board (MPPCB) National Water Quality Monitoring Programme (NWMP).
 * 
 * Sources:
 * - CPCB NWMP Database: https://cpcb.nic.in/nwmp-data/
 * - MPPCB Annual Environmental Status Reports: http://www.mppcb.nic.in/
 * - Ramsar Sites Information Service (Bhoj Wetland #1206): https://rsis.ramsar.org/ris/1206
 */
export const CPCB_MPPCB_LAKE_RECORDS: EvidenceRecord[] = [
  {
    id: 'cpcb-nwmp-bpl-01',
    title: 'CPCB NWMP Station #1061: Upper Lake (Bhojtal) at Kamla Park Water Intake',
    source_name: 'Central Pollution Control Board (CPCB) / MPPCB NWMP',
    source_type: 'official_monitoring',
    source_url: 'https://cpcb.nic.in/nwmp-data/',
    publication_date: '2024-12-31',
    location: {
      wardId: 'ward-07',
      wardName: 'Shamla Hills & Lake View',
      siteName: 'Kamla Park Raw Water Pumping Intake, Upper Lake',
      latitude: 23.2435,
      longitude: 77.3912,
      waterBody: 'Bhojtal_Upper_Lake'
    },
    claim: 'Kamla Park intake provides ~40% of municipal raw water supply for Old Bhopal and TT Nagar zones; classified under Designated Best Use Class-B/C.',
    evidence: 'NWMP monitoring reports show average pH 7.6–8.2, Dissolved Oxygen (DO) 6.4–7.8 mg/L, and Biochemical Oxygen Demand (BOD) 2.1–3.8 mg/L. Seasonal post-monsoon algal blooms elevate turbidity.',
    evidence_strength: 'conclusive',
    is_primary_source: true,
    is_synthetic: false,
    metadata: {
      station_code: '1061',
      designated_best_use: 'Class B (Outdoor Bathing) / Class C (Drinking water with conventional treatment)',
      monitoring_frequency: 'Monthly',
      sampling_depth_meters: 1.5
    }
  },
  {
    id: 'cpcb-nwmp-bpl-02',
    title: 'CPCB NWMP Station #1062: Upper Lake (Bhojtal) at Bairagarh Inflow Zone',
    source_name: 'Central Pollution Control Board (CPCB) / MPPCB NWMP',
    source_type: 'official_monitoring',
    source_url: 'https://cpcb.nic.in/nwmp-data/',
    publication_date: '2024-12-31',
    location: {
      wardId: 'ward-33',
      wardName: 'Kolar Road & Bairagarh Basin',
      siteName: 'Bairagarh Western Inflow Apron, Bhojtal',
      latitude: 23.2685,
      longitude: 77.3412,
      waterBody: 'Bhojtal_Upper_Lake'
    },
    claim: 'Western catchment receives seasonal agricultural runoff carrying nitrate and phosphate nutrients from Sehore/Bhopal agrarian fringe.',
    evidence: 'Elevated total coliform (1200–2400 MPN/100ml) and total dissolved solids during first-flush monsoon runoff; triggers localized Eichhornia crassipes (water hyacinth) propagation.',
    evidence_strength: 'conclusive',
    is_primary_source: true,
    is_synthetic: false,
    metadata: {
      station_code: '1062',
      nutrient_enrichment: 'Mesotrophic to Eutrophic in shallow littoral pockets',
      monitoring_agency: 'MPPCB Regional Laboratory, Bhopal'
    }
  },
  {
    id: 'cpcb-nwmp-bpl-03',
    title: 'CPCB NWMP Station #1063: Upper Lake (Bhojtal) at Karbala Outfall & Causeway',
    source_name: 'Central Pollution Control Board (CPCB) / MPPCB NWMP',
    source_type: 'official_monitoring',
    source_url: 'https://cpcb.nic.in/nwmp-data/',
    publication_date: '2024-12-31',
    location: {
      wardId: 'ward-07',
      wardName: 'Shamla Hills & Lake View',
      siteName: 'VIP Road Karbala Embankment',
      latitude: 23.2512,
      longitude: 77.3821,
      waterBody: 'Bhojtal_Upper_Lake'
    },
    claim: 'VIP Road culverts and stormwater drains channel urban runoff across VIP road embankment into Upper Lake.',
    evidence: 'Visual and analytical records indicate periodic solid refuse entrapment at culvert aprons; BOD spikes to 4.2 mg/L near storm discharge weirs after heavy precipitation.',
    evidence_strength: 'conclusive',
    is_primary_source: true,
    is_synthetic: false,
    metadata: {
      station_code: '1063',
      urban_runoff_impact: 'High during monsoon first flush',
      sampling_point: 'Karbala Causeway'
    }
  },
  {
    id: 'cpcb-nwmp-bpl-04',
    title: 'CPCB NWMP Station #1064: Upper Lake at Yacht Club / Boat Club Promenade',
    source_name: 'Central Pollution Control Board (CPCB) / MPPCB NWMP',
    source_type: 'official_monitoring',
    source_url: 'https://cpcb.nic.in/nwmp-data/',
    publication_date: '2024-12-31',
    location: {
      wardId: 'ward-07',
      wardName: 'Shamla Hills & Lake View',
      siteName: 'Boat Club Promenade, Shamla Hills',
      latitude: 23.2415,
      longitude: 77.3862,
      waterBody: 'Bhojtal_Upper_Lake'
    },
    claim: 'Recreational tourism zone requires zero motorboat fuel leakage and strict acoustic/environmental buffer compliance.',
    evidence: 'Dissolved oxygen sustained at 7.0–8.1 mg/L in central open water basin; water clarity 1.1–1.8m Secchi disk depth.',
    evidence_strength: 'conclusive',
    is_primary_source: true,
    is_synthetic: false,
    metadata: {
      station_code: '1064',
      recreational_zone: 'Designated Eco-Tourism Buffer',
      motorized_vessel_restriction: 'Electric / Solar boats prioritized'
    }
  },
  {
    id: 'cpcb-nwmp-bpl-05',
    title: 'CPCB NWMP Station #1065: Shahpura Lake Central & Outlet Basin',
    source_name: 'Central Pollution Control Board (CPCB) / MPPCB NWMP',
    source_type: 'official_monitoring',
    source_url: 'https://cpcb.nic.in/nwmp-data/',
    publication_date: '2024-12-31',
    location: {
      wardId: 'ward-52',
      wardName: 'Arera Colony & 10 No. Market',
      siteName: 'Shahpura Lake Main Inflow Channel, E-7 / Sector C',
      latitude: 23.2012,
      longitude: 77.4295,
      waterBody: 'Shahpura_Lake'
    },
    claim: 'Shahpura Lake receives urban stormwater runoff from Chunabhatti and Arera Colony E-sectors, exhibiting recurring eutrophication.',
    evidence: 'Mean BOD 6.5–12.0 mg/L, Dissolved Oxygen drops below 4.0 mg/L in bottom sediment layers during summer pre-monsoon; requires continuous mechanical aeration.',
    evidence_strength: 'conclusive',
    is_primary_source: true,
    is_synthetic: false,
    metadata: {
      station_code: '1065',
      trophic_status: 'Hyper-eutrophic',
      aerator_installations: '4 floating fountains / surface aerators operated by BMC'
    }
  },
  {
    id: 'ramsar-1206-bpl',
    title: 'Ramsar Convention Designation: Bhoj Wetland (Site #1206)',
    source_name: 'Ramsar Convention on Wetlands of International Importance',
    source_type: 'government_gazette',
    source_url: 'https://rsis.ramsar.org/ris/1206',
    publication_date: '2002-08-19',
    location: {
      wardId: 'ward-07',
      wardName: 'Shamla Hills & Lake View',
      siteName: 'Bhoj Wetland (Upper & Lower Lakes)',
      latitude: 23.2500,
      longitude: 77.3333,
      waterBody: 'Bhojtal_Upper_Lake'
    },
    claim: 'Bhoj Wetland consists of two contiguous human-made reservoirs (Upper Lake / Bhojtal created by Raja Bhoj in the 11th century, and Lower Lake / Chhota Talab created in 1794).',
    evidence: 'Designated as Ramsar Site #1206 spanning 3,201 hectares. Catchment area covers 361 sq km across Bhopal and Sehore districts. Supports >20,000 wintering migratory waterfowl and Sarus Crane (Grus antigone).',
    evidence_strength: 'conclusive',
    is_primary_source: true,
    is_synthetic: false,
    metadata: {
      ramsar_site_number: 1206,
      total_area_hectares: 3201,
      catchment_sq_km: 361,
      endangered_species_supported: ['Grus antigone', 'Aythya ferina']
    }
  }
];
