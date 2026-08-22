import { CitizenReportInput, IncidentCategory } from '@/types/incident';

export interface EvaluationCase {
  id: string;
  name: string;
  category: IncidentCategory;
  report: CitizenReportInput;
  expected_outcome: 'merge' | 'separate' | 'ambiguous_separate' | 'recurrence_merge';
  expected_target_incident_id?: string;
  rationale: string;
  is_synthetic: true;
}

/**
 * Synthetic Evaluation Dataset for Bhopal Civic Memory Deduplication & Recurrence.
 * Contains 30 structured, labeled benchmark cases.
 * 
 * Distribution:
 * - 10 cases that should correctly merge into existing incidents ('merge')
 * - 10 cases geographically close but physically distinct ('separate')
 * - 5 ambiguous cases where evidence is insufficient and should remain separate ('ambiguous_separate')
 * - 5 cases representing chronic recurrence after a prior intervention ('recurrence_merge')
 * 
 * DISCLAIMER: This is synthetic benchmark evaluation data designed for algorithm testing.
 * It does not contain real personal data or official BMC grievance records.
 */
export const SYNTHETIC_EVALUATION_DATASET: EvaluationCase[] = [
  // =========================================================================
  // GROUP 1: 10 CASES THAT SHOULD CORRECTLY MERGE INTO EXISTING INCIDENTS
  // =========================================================================
  {
    id: 'eval-merge-01',
    name: 'Bhojtal VIP Road Culvert Weed Bloom Corroboration',
    category: 'lake_ecology',
    expected_outcome: 'merge',
    expected_target_incident_id: 'inc-001',
    rationale: 'Describes the exact same water hyacinth accumulation at Khanoo Gaon culvert inlet on VIP Road.',
    is_synthetic: true,
    report: {
      title: 'Water hyacinth choking Raja Bhoj causeway culvert again',
      description: 'The green weed barrier at Khanoo Gaon is completely clogged with plastic bottles and hyacinth weeds, blocking water inflow into the lake.',
      category: 'lake_ecology',
      severity: 'critical',
      wardId: 'ward-07',
      locationName: 'VIP Road Khanoo Gaon inlet, Bhojtal',
      landmark: 'Near Raja Bhoj statue culvert',
      isAnonymous: false,
      reporterName: 'Sunil Verma',
      evidenceUrls: []
    }
  },
  {
    id: 'eval-merge-02',
    name: 'Taj-ul-Masajid North Gate Cornice Debris Alert',
    category: 'heritage_infrastructure',
    expected_outcome: 'merge',
    expected_target_incident_id: 'inc-002',
    rationale: 'Describes identical red sandstone mortar displacement at the north gate arcade of Taj-ul-Masajid.',
    is_synthetic: true,
    report: {
      title: 'Mortar chunks falling from Taj-ul-Masajid north gate archway',
      description: 'Red sandstone block on the northern entrance arch is loose and mortar fell near visitors this afternoon.',
      category: 'heritage_infrastructure',
      severity: 'high',
      wardId: 'ward-12',
      locationName: 'Taj-ul-Masajid North Gate Arcade',
      landmark: 'Motia Talab side gate',
      isAnonymous: false,
      reporterName: 'Mohd. Iqbal',
      evidenceUrls: []
    }
  },
  {
    id: 'eval-merge-03',
    name: 'MP Nagar Zone II Sump Backflow Waterlogging',
    category: 'drainage_flood',
    expected_outcome: 'merge',
    expected_target_incident_id: 'inc-003',
    rationale: 'Refers to the same drainage sump backflow near Sargam Cinema / Bank of Baroda in MP Nagar Zone II.',
    is_synthetic: true,
    report: {
      title: 'Severe waterlogging at Sargam cinema crossroad MP Nagar',
      description: 'Stormwater drain is overflowing with sewage and plastic waste. Water level is over 1 foot near Bank of Baroda junction.',
      category: 'drainage_flood',
      severity: 'high',
      wardId: 'ward-45',
      locationName: 'Zone II Junction near Sargam Cinema Road',
      landmark: 'Behind Bank of Baroda',
      isAnonymous: true,
      evidenceUrls: []
    }
  },
  {
    id: 'eval-merge-04',
    name: 'Kolar Road Sarvadharma Bridge Exposed Rebar Pothole',
    category: 'road_hazard',
    expected_outcome: 'merge',
    expected_target_incident_id: 'inc-005',
    rationale: 'Matches identical exposed steel rebar and cavity on the northern approach slab of Sarvadharma Bridge.',
    is_synthetic: true,
    report: {
      title: 'Iron rods exposed in big pothole on Sarvadharma bridge ramp',
      description: 'Dangerous pothole on the incline of Sarvadharma bridge where rusted iron reinforcement is sticking out, punctured my scooter tire.',
      category: 'road_hazard',
      severity: 'critical',
      wardId: 'ward-33',
      locationName: 'Sarvadharma Bridge Northern Incline',
      landmark: 'Near D-Mart turn',
      isAnonymous: false,
      reporterName: 'Vikram Joshi',
      evidenceUrls: []
    }
  },
  {
    id: 'eval-merge-05',
    name: 'Arera Colony E-7 Streetlight Circuit Blackout',
    category: 'public_lighting',
    expected_outcome: 'merge',
    expected_target_incident_id: 'inc-004',
    rationale: 'Reports identical 12-pole streetlight feeder failure along E-7 boulevard towards Shahpura link.',
    is_synthetic: true,
    report: {
      title: 'Darkness on E-7 main road between 11 No. stop and lake link',
      description: 'All smart streetlights on the green belt side are non-functional for the past 2 nights.',
      category: 'public_lighting',
      severity: 'medium',
      wardId: 'ward-52',
      locationName: 'E-7 Arera Colony Boulevard',
      landmark: 'Near Sai Baba Mandir',
      isAnonymous: false,
      reporterName: 'Pooja Saxena',
      evidenceUrls: []
    }
  },
  {
    id: 'eval-merge-06',
    name: 'VIP Road Causeway Plastic Waste Mat in Inflow',
    category: 'lake_ecology',
    expected_outcome: 'merge',
    expected_target_incident_id: 'inc-001',
    rationale: 'Direct corroboration of floating waste mat obstructing Khanoo Gaon culvert.',
    is_synthetic: true,
    report: {
      title: 'Massive plastic accumulation in Upper Lake VIP road culvert',
      description: 'Plastic bags and debris choked inside the intake grill opposite Raja Bhoj statue overlook.',
      category: 'lake_ecology',
      severity: 'critical',
      wardId: 'ward-07',
      locationName: 'VIP Road Khanoo Gaon culvert',
      landmark: 'Raja Bhoj Statue causeway',
      isAnonymous: false,
      reporterName: 'Dr. Reena Sen',
      evidenceUrls: []
    }
  },
  {
    id: 'eval-merge-07',
    name: 'Taj-ul-Masajid Sandstone Crack Progression',
    category: 'heritage_infrastructure',
    expected_outcome: 'merge',
    expected_target_incident_id: 'inc-002',
    rationale: 'Describes the progressing masonry displacement on the northern arcade of Taj-ul-Masajid.',
    is_synthetic: true,
    report: {
      title: 'Stone displacement widening at Taj-ul-Masajid north gate',
      description: 'The cracked sandstone block on the northern gate archway has moved further outward after yesterday evening rains.',
      category: 'heritage_infrastructure',
      severity: 'high',
      wardId: 'ward-12',
      locationName: 'Taj-ul-Masajid North Gate Corridor',
      landmark: 'Motia Talab access walkway',
      isAnonymous: true,
      evidenceUrls: []
    }
  },
  {
    id: 'eval-merge-08',
    name: 'Sargam Cinema Junction Manhole Overflow MP Nagar',
    category: 'drainage_flood',
    expected_outcome: 'merge',
    expected_target_incident_id: 'inc-003',
    rationale: 'Reports same stormwater sump backflow at Sargam cinema intersection in MP Nagar Zone II.',
    is_synthetic: true,
    report: {
      title: 'Sump chamber overflowing at Sargam Cinema crossing',
      description: 'Commercial silt coming out of stormwater sump, roadway submerged in dirty runoff.',
      category: 'drainage_flood',
      severity: 'high',
      wardId: 'ward-45',
      locationName: 'MP Nagar Zone II Sargam Road',
      landmark: 'Bank of Baroda crossing',
      isAnonymous: false,
      reporterName: 'Deepak Chhabra',
      evidenceUrls: []
    }
  },
  {
    id: 'eval-merge-09',
    name: 'Sarvadharma Bridge Slab Cavity Rebar Alert',
    category: 'road_hazard',
    expected_outcome: 'merge',
    expected_target_incident_id: 'inc-005',
    rationale: 'Second corroborating report on the Sarvadharma bridge approach slab subsidence and rebar exposure.',
    is_synthetic: true,
    report: {
      title: 'Bridge approach cavity with exposed reinforcement steel',
      description: 'Deep road depression with rusted steel rebar protruding right in the vehicle wheel path on Sarvadharma bridge.',
      category: 'road_hazard',
      severity: 'critical',
      wardId: 'ward-33',
      locationName: 'Sarvadharma Bridge Ramp',
      landmark: '100m before D-Mart',
      isAnonymous: false,
      reporterName: 'Sanjay Malviya',
      evidenceUrls: []
    }
  },
  {
    id: 'eval-merge-10',
    name: 'Arera Colony E-7 Boulevard Feeder Trip',
    category: 'public_lighting',
    expected_outcome: 'merge',
    expected_target_incident_id: 'inc-004',
    rationale: 'Same 12-pole street lighting failure on E-7 avenue in Arera Colony.',
    is_synthetic: true,
    report: {
      title: 'Streetlights out along 11 No. stop towards Shahpura road',
      description: 'All 12 poles along the green belt remain dark since the weekend storm.',
      category: 'public_lighting',
      severity: 'medium',
      wardId: 'ward-52',
      locationName: 'E-7 Boulevard Arera Colony',
      landmark: 'Near Sai Baba Mandir',
      isAnonymous: true,
      evidenceUrls: []
    }
  },

  // =========================================================================
  // GROUP 2: 10 CASES GEOGRAPHICALLY CLOSE BUT PHYSICALLY SEPARATE
  // =========================================================================
  {
    id: 'eval-sep-01',
    name: 'Shamla Hills Sair Sapata Broken Railing (Near Lake, but distinct asset)',
    category: 'lake_ecology',
    expected_outcome: 'separate',
    rationale: 'Located in Ward 07 near Upper Lake, but is a pedestrian safety railing issue at Sair Sapata, NOT the VIP Road culvert weed choke.',
    is_synthetic: true,
    report: {
      title: 'Broken pedestrian railing at Sair Sapata bridge promenade',
      description: 'The iron safety railing along the lakeside walkway is broken and hanging loose. Safety hazard for children.',
      category: 'lake_ecology',
      severity: 'medium',
      wardId: 'ward-07',
      locationName: 'Sair Sapata Promenade, Shamla Hills',
      landmark: 'Near suspension bridge entry',
      isAnonymous: false,
      reporterName: 'Meenakshi Roy',
      evidenceUrls: []
    }
  },
  {
    id: 'eval-sep-02',
    name: 'Chowk Bazaar Moti Masjid Water Pipe Rupture (Same Ward 12, different issue)',
    category: 'water_supply',
    expected_outcome: 'separate',
    rationale: 'Located in Ward 12 (Old Bhopal), but is a municipal drinking water pipe burst at Chowk Bazaar, NOT the Taj-ul-Masajid sandstone gate.',
    is_synthetic: true,
    report: {
      title: 'Main drinking water pipeline leak at Chowk Bazaar',
      description: 'Potable water gushing from underground pipeline under street paving near Moti Masjid entrance.',
      category: 'water_supply',
      severity: 'high',
      wardId: 'ward-12',
      locationName: 'Chowk Bazaar Market Lane',
      landmark: 'Moti Masjid gate',
      isAnonymous: false,
      reporterName: 'Farhan Beg',
      evidenceUrls: []
    }
  },
  {
    id: 'eval-sep-03',
    name: 'MP Nagar Zone I DB Mall Traffic Signal Malfunction (Same Ward 45, distinct)',
    category: 'road_hazard',
    expected_outcome: 'separate',
    rationale: 'Located in Ward 45 (MP Nagar), but is a traffic signal outage in Zone I (DB Mall), NOT the Zone II drainage sump backflow.',
    is_synthetic: true,
    report: {
      title: 'Traffic signal failure at DB City mall main intersection',
      description: 'Automated signal lights stuck on flashing yellow, causing massive vehicular gridlock in Zone I.',
      category: 'road_hazard',
      severity: 'high',
      wardId: 'ward-45',
      locationName: 'DB Mall Main Intersection, Zone I',
      landmark: 'Opposite Chetak Bridge ramp',
      isAnonymous: false,
      reporterName: 'Rohan Gupta',
      evidenceUrls: []
    }
  },
  {
    id: 'eval-sep-04',
    name: 'Kolar Road Danish Kunj Garbage Pile (Same Ward 33, different asset)',
    category: 'sanitation_waste',
    expected_outcome: 'separate',
    rationale: 'Located in Ward 33 (Kolar Road), but is an open solid waste pile at Danish Kunj, NOT the Sarvadharma bridge slab depression.',
    is_synthetic: true,
    report: {
      title: 'Uncollected municipal garbage heap near Danish Kunj entrance',
      description: 'Solid waste has not been collected for 4 days, stray cattle scattering garbage across service lane.',
      category: 'sanitation_waste',
      severity: 'medium',
      wardId: 'ward-33',
      locationName: 'Danish Kunj Main Gate Road',
      landmark: 'Near Danish Kunj arch',
      isAnonymous: false,
      reporterName: 'Kailash Soni',
      evidenceUrls: []
    }
  },
  {
    id: 'eval-sep-05',
    name: 'Arera Colony 10 No. Market Transformer Sparking (Same Ward 52, distinct)',
    category: 'public_lighting',
    expected_outcome: 'separate',
    rationale: 'Located in Ward 52 (Arera Colony), but is a commercial distribution transformer sparking at 10 No. Market, NOT the E-7 avenue streetlight blackout.',
    is_synthetic: true,
    report: {
      title: 'Distribution transformer sparking at 10 No. commercial market',
      description: 'Underground junction box sparking with audible humming near bus stop #10. Danger of fire.',
      category: 'public_lighting',
      severity: 'critical',
      wardId: 'ward-52',
      locationName: '10 No. Market Commercial Plaza',
      landmark: 'Opposite 10 No. Bus Stop',
      isAnonymous: false,
      reporterName: 'Hemant Nair',
      evidenceUrls: []
    }
  },
  {
    id: 'eval-sep-06',
    name: 'Bharat Bhavan Retaining Wall Seepage (Same Ward 07, separate asset)',
    category: 'heritage_infrastructure',
    expected_outcome: 'separate',
    rationale: 'Located in Ward 07 (Shamla Hills), but is a cultural institution retaining wall seepage at Bharat Bhavan, NOT VIP Road culvert.',
    is_synthetic: true,
    report: {
      title: 'Water seepage through stone retaining wall at Bharat Bhavan',
      description: 'Terraced stone retaining wall near amphitheater showing active water dampness and moss growth.',
      category: 'heritage_infrastructure',
      severity: 'low',
      wardId: 'ward-07',
      locationName: 'Bharat Bhavan Complex, Shamla Hills',
      landmark: 'Near Rangmandal theater',
      isAnonymous: false,
      reporterName: 'Anil Pandey',
      evidenceUrls: []
    }
  },
  {
    id: 'eval-sep-07',
    name: 'Taj-ul-Masajid Motia Talab Siltation (Same Ward 12, different issue)',
    category: 'lake_ecology',
    expected_outcome: 'separate',
    rationale: 'Located adjacent to Taj-ul-Masajid in Ward 12, but refers to the Motia Talab water body sediment, NOT the gate masonry.',
    is_synthetic: true,
    report: {
      title: 'Silt deposition in Motia Talab basin adjacent to Taj-ul-Masajid',
      description: 'Pond water level dropping with visible mud flats and plastic debris around the stepped ghats.',
      category: 'lake_ecology',
      severity: 'medium',
      wardId: 'ward-12',
      locationName: 'Motia Talab Stepped Ghats',
      landmark: 'Behind Taj-ul-Masajid',
      isAnonymous: false,
      reporterName: 'Qasim Ali',
      evidenceUrls: []
    }
  },
  {
    id: 'eval-sep-08',
    name: 'MP Nagar Zone II Jyoti Cinema Pothole (Same Ward 45, distinct failure)',
    category: 'road_hazard',
    expected_outcome: 'separate',
    rationale: 'Located in MP Nagar Zone II, but is an isolated asphalt road depression near Jyoti Cinema, NOT the commercial drainage sump backflow.',
    is_synthetic: true,
    report: {
      title: 'Isolated pothole near Jyoti Cinema parking',
      description: 'Pothole approx 1 foot diameter in asphalt near vehicle entry gate.',
      category: 'road_hazard',
      severity: 'low',
      wardId: 'ward-45',
      locationName: 'MP Nagar Zone II Jyoti Cinema Road',
      landmark: 'Jyoti Cinema parking',
      isAnonymous: true,
      evidenceUrls: []
    }
  },
  {
    id: 'eval-sep-09',
    name: 'Bairagarh Chichali Drainage Culvert (Same Ward 33, different location)',
    category: 'drainage_flood',
    expected_outcome: 'separate',
    rationale: 'Located in Ward 33 (Kolar Road), but is at Bairagarh Chichali (3km away), NOT Sarvadharma bridge approach.',
    is_synthetic: true,
    report: {
      title: 'Culvert blockage at Bairagarh Chichali village road',
      description: 'Local agricultural runoff culvert blocked by fallen tree branches.',
      category: 'drainage_flood',
      severity: 'low',
      wardId: 'ward-33',
      locationName: 'Bairagarh Chichali Village Road',
      landmark: 'Near Chichali primary school',
      isAnonymous: false,
      reporterName: 'Rameshwar Meena',
      evidenceUrls: []
    }
  },
  {
    id: 'eval-sep-10',
    name: 'Char Imli Gate Tree Branch Hazard (Same Ward 52, distinct)',
    category: 'environmental',
    expected_outcome: 'separate',
    rationale: 'Located in Ward 52 (Arera Colony), but is a fallen Gulmohar tree branch at Char Imli, NOT E-7 smart lighting outage.',
    is_synthetic: true,
    report: {
      title: 'Large Gulmohar tree branch hanging low over Char Imli entrance',
      description: 'Dead branch hanging over overhead power lines and vehicle driveway.',
      category: 'environmental',
      severity: 'medium',
      wardId: 'ward-52',
      locationName: 'Char Imli Access Road',
      landmark: 'Near Char Imli security gate',
      isAnonymous: false,
      reporterName: 'Suresh Bhatnagar',
      evidenceUrls: []
    }
  },

  // =========================================================================
  // GROUP 3: 5 AMBIGUOUS CASES WHERE CORRECT BEHAVIOR IS TO AVOID MERGING
  // =========================================================================
  {
    id: 'eval-amb-01',
    name: 'Vague VIP Road Pothole (Ambiguous overlap with Bhojtal lake weed choke)',
    category: 'road_hazard',
    expected_outcome: 'ambiguous_separate',
    rationale: 'Mentions VIP Road generally without specific landmark or culvert reference; insufficient evidence to merge with Bhojtal weed choke.',
    is_synthetic: true,
    report: {
      title: 'Road issue somewhere on VIP road',
      description: 'Saw water and bump on the road near VIP road drive.',
      category: 'road_hazard',
      severity: 'medium',
      wardId: 'ward-07',
      locationName: 'VIP Road',
      isAnonymous: true,
      evidenceUrls: []
    }
  },
  {
    id: 'eval-amb-02',
    name: 'Unspecified Old Bhopal Wall Crack (Ambiguous gate overlap)',
    category: 'heritage_infrastructure',
    expected_outcome: 'ambiguous_separate',
    rationale: 'Mentions a generic cracked stone wall in Old City without naming Taj-ul-Masajid or specific archway; must not be merged prematurely.',
    is_synthetic: true,
    report: {
      title: 'Old stone wall has cracks in old city',
      description: 'Historic looking wall has dampness and cracks near market area.',
      category: 'heritage_infrastructure',
      severity: 'medium',
      wardId: 'ward-12',
      locationName: 'Old City Area',
      isAnonymous: true,
      evidenceUrls: []
    }
  },
  {
    id: 'eval-amb-03',
    name: 'Generic MP Nagar Water Overflow (Ambiguous sump overlap)',
    category: 'drainage_flood',
    expected_outcome: 'ambiguous_separate',
    rationale: 'Mentions water on road in MP Nagar without specifying Zone I or Zone II or junction; keep separate for safety.',
    is_synthetic: true,
    report: {
      title: 'Water pooling in MP Nagar',
      description: 'Street drainage seems slow after rain in commercial area.',
      category: 'drainage_flood',
      severity: 'low',
      wardId: 'ward-45',
      locationName: 'MP Nagar',
      isAnonymous: true,
      evidenceUrls: []
    }
  },
  {
    id: 'eval-amb-04',
    name: 'Kolar Road Pothole (Ambiguous bridge overlap)',
    category: 'road_hazard',
    expected_outcome: 'ambiguous_separate',
    rationale: 'Mentions a generic bump on the 15km Kolar Road spine without specifying Sarvadharma bridge or rebar exposure; must remain separate.',
    is_synthetic: true,
    report: {
      title: 'Pothole on Kolar main road',
      description: 'Car shook while driving on Kolar road.',
      category: 'road_hazard',
      severity: 'medium',
      wardId: 'ward-33',
      locationName: 'Kolar Road',
      isAnonymous: true,
      evidenceUrls: []
    }
  },
  {
    id: 'eval-amb-05',
    name: 'Arera Colony Dark Street (Ambiguous E-7 overlap)',
    category: 'public_lighting',
    expected_outcome: 'ambiguous_separate',
    rationale: 'Mentions dark road in Arera Colony without specifying E-7 or 11 No. stop sector; keep separate.',
    is_synthetic: true,
    report: {
      title: 'Dim lighting in Arera Colony',
      description: 'Road lights seem off in some colony lane.',
      category: 'public_lighting',
      severity: 'low',
      wardId: 'ward-52',
      locationName: 'Arera Colony',
      isAnonymous: true,
      evidenceUrls: []
    }
  },

  // =========================================================================
  // GROUP 4: 5 CASES REPRESENTING RECURRENCE AFTER PREVIOUS INTERVENTIONS
  // =========================================================================
  {
    id: 'eval-rec-01',
    name: 'VIP Road Khanoo Gaon Seasonal Re-infestation (Post-2025 Harvester Clearing)',
    category: 'lake_ecology',
    expected_outcome: 'recurrence_merge',
    expected_target_incident_id: 'inc-001',
    rationale: 'Direct recurrence of water hyacinth mat at Khanoo Gaon culvert after the September 2025 mechanized harvesting intervention.',
    is_synthetic: true,
    report: {
      title: 'Water hyacinth regrowth at Khanoo Gaon culvert after monsoon clearing',
      description: 'The weed harvester cleared this culvert last September, but dense hyacinth mats have regrown over the intake screen, blocking Upper Lake inflow.',
      category: 'lake_ecology',
      severity: 'critical',
      wardId: 'ward-07',
      locationName: 'VIP Road Khanoo Gaon Inflow',
      landmark: 'Raja Bhoj Causeway culvert #03',
      isAnonymous: false,
      reporterName: 'Prof. Sudhir Nigam',
      evidenceUrls: []
    }
  },
  {
    id: 'eval-rec-02',
    name: 'Taj-ul-Masajid North Gate Mortar Deterioration (Post-2024 Lime Pointing)',
    category: 'heritage_infrastructure',
    expected_outcome: 'recurrence_merge',
    expected_target_incident_id: 'inc-002',
    rationale: 'Direct recurrence of sandstone mortar crumbling at Taj-ul-Masajid North Gate following the November 2024 lime pointing repair.',
    is_synthetic: true,
    report: {
      title: 'Repeated mortar failure on Taj-ul-Masajid northern archway',
      description: 'The hydraulic lime pointing done last winter has washed away; sandstone blocks are shifting again under roof seepage.',
      category: 'heritage_infrastructure',
      severity: 'high',
      wardId: 'ward-12',
      locationName: 'Taj-ul-Masajid North Gate Arcade',
      landmark: 'Near Motia Talab entrance',
      isAnonymous: false,
      reporterName: 'Tariq Siddiqui',
      evidenceUrls: []
    }
  },
  {
    id: 'eval-rec-03',
    name: 'MP Nagar Zone II Sump Chronic Monsoon Surge (Post-Jetting)',
    category: 'drainage_flood',
    expected_outcome: 'recurrence_merge',
    expected_target_incident_id: 'inc-003',
    rationale: 'Chronic recurrence of stormwater sump overflow at Sargam Cinema crossing despite previous suction jetting machine deployments.',
    is_synthetic: true,
    report: {
      title: 'Chronic sump backflow recurring at Sargam Cinema junction',
      description: 'Even after suction jetting cleared silt last week, commercial plastic packaging has clogged the outfall tributary again.',
      category: 'drainage_flood',
      severity: 'high',
      wardId: 'ward-45',
      locationName: 'MP Nagar Zone II Sargam Road',
      landmark: 'Behind Bank of Baroda',
      isAnonymous: false,
      reporterName: 'Sensor Relay #MPN-08',
      evidenceUrls: []
    }
  },
  {
    id: 'eval-rec-04',
    name: 'Sarvadharma Bridge Slab Joint Re-depression (Post-Asphalt Patch)',
    category: 'road_hazard',
    expected_outcome: 'recurrence_merge',
    expected_target_incident_id: 'inc-005',
    rationale: 'Chronic recurrence of road depression over bridge expansion joint slab on Kolar Road where cold-mix patches repeatedly wash out.',
    is_synthetic: true,
    report: {
      title: 'Bridge expansion joint pothole re-opened on Sarvadharma bridge',
      description: 'The temporary asphalt patch laid last month has caved in again under heavy bus traffic, exposing rebar once more.',
      category: 'road_hazard',
      severity: 'critical',
      wardId: 'ward-33',
      locationName: 'Sarvadharma Bridge Northern Incline',
      landmark: '100m before D-Mart junction',
      isAnonymous: false,
      reporterName: 'Harishankar Meena',
      evidenceUrls: []
    }
  },
  {
    id: 'eval-rec-05',
    name: 'Arera Colony E-7 Feeder Recurrent Circuit Breaker Trip',
    category: 'public_lighting',
    expected_outcome: 'recurrence_merge',
    expected_target_incident_id: 'inc-004',
    rationale: 'Repeated underground circuit breaker tripping along E-7 boulevard luminaires due to chronic moisture ingress.',
    is_synthetic: true,
    report: {
      title: 'Recurring circuit trip on Arera Colony E-7 streetlight feeder',
      description: 'Substation breaker tripped again for all 12 poles along the green belt avenue after light drizzle.',
      category: 'public_lighting',
      severity: 'medium',
      wardId: 'ward-52',
      locationName: 'E-7 Arera Colony Boulevard',
      landmark: 'Near Sai Baba Mandir',
      isAnonymous: false,
      reporterName: 'Ananya Deshmukh',
      evidenceUrls: []
    }
  }
];
