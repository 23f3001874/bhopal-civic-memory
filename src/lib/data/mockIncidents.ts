import { BhopalWard, CivicIncident, CivicPulseMetrics } from '@/types/incident';

export const BHOPAL_WARDS: BhopalWard[] = [
  {
    id: 'ward-07',
    code: 'W-07',
    name: 'Shamla Hills & Lake View',
    zone: 2,
    counselorName: 'Shri Arvind Sharma',
    activeIncidents: 4,
    criticalIncidents: 1,
    resolvedThisMonth: 19,
    healthIndexScore: 92,
    keyLandmarks: ['Bharat Bhavan', 'VIP Road Overlook', 'Sair Sapata'],
    coordinates: { lat: 23.2428, lng: 77.3876 }
  },
  {
    id: 'ward-12',
    code: 'W-12',
    name: 'Old City & Bada Bagh Corridor',
    zone: 1,
    counselorName: 'Begum Ruksana Khan',
    activeIncidents: 11,
    criticalIncidents: 2,
    resolvedThisMonth: 28,
    healthIndexScore: 74,
    keyLandmarks: ['Taj-ul-Masajid', 'Moti Masjid', 'Chowk Bazaar'],
    coordinates: { lat: 23.2625, lng: 77.3995 }
  },
  {
    id: 'ward-24',
    code: 'W-24',
    name: 'TT Nagar & New Market Precinct',
    zone: 3,
    counselorName: 'Dr. Manish Verma',
    activeIncidents: 6,
    criticalIncidents: 0,
    resolvedThisMonth: 34,
    healthIndexScore: 88,
    keyLandmarks: ['New Market Square', 'TT Nagar Stadium', 'Roshanpura'],
    coordinates: { lat: 23.2356, lng: 77.4018 }
  },
  {
    id: 'ward-45',
    code: 'W-45',
    name: 'MP Nagar Commercial District (Zone I & II)',
    zone: 5,
    counselorName: 'Smt. Kavita Patidar',
    activeIncidents: 9,
    criticalIncidents: 2,
    resolvedThisMonth: 41,
    healthIndexScore: 81,
    keyLandmarks: ['DB City Mall Intersection', 'Chetak Bridge', 'Jyoti Cinema Area', 'Sargam Cinema Road'],
    coordinates: { lat: 23.2315, lng: 77.4332 }
  },
  {
    id: 'ward-52',
    code: 'W-52',
    name: 'Arera Colony & 10 No. Market',
    zone: 6,
    counselorName: 'Shri Rajesh Agrawal',
    activeIncidents: 3,
    criticalIncidents: 0,
    resolvedThisMonth: 25,
    healthIndexScore: 94,
    keyLandmarks: ['10 No. Bus Stop', 'Campian Ground', 'Char Imli Gate'],
    coordinates: { lat: 23.2122, lng: 77.4265 }
  },
  {
    id: 'ward-33',
    code: 'W-33',
    name: 'Kolar Road & Sarvadharma Corridor',
    zone: 8,
    counselorName: 'Smt. Deepa Chouhan',
    activeIncidents: 14,
    criticalIncidents: 3,
    resolvedThisMonth: 30,
    healthIndexScore: 68,
    keyLandmarks: ['Sarvadharma Bridge', 'Danish Kunj Gate', 'Bairagarh Chichali'],
    coordinates: { lat: 23.1789, lng: 77.4198 }
  },
  {
    id: 'ward-68',
    code: 'W-68',
    name: 'BHEL Township & Govindpura Industrial Sector',
    zone: 7,
    counselorName: 'Shri Vikram Singh Rajput',
    activeIncidents: 5,
    criticalIncidents: 1,
    resolvedThisMonth: 22,
    healthIndexScore: 85,
    keyLandmarks: ['Jubilee Gate BHEL', 'Govindpura ITI', 'Kasturba Hospital'],
    coordinates: { lat: 23.2501, lng: 77.4682 }
  }
];

export const INITIAL_INCIDENTS: CivicIncident[] = [
  {
    id: 'inc-001',
    trackingToken: 'CM-BPL-2026-0841',
    title: 'VIP Road Bhojtal Catchment Runoff & Invasive Weed Accumulation',
    description:
      'Significant accumulation of water hyacinth and plastic debris near the Khanoo Gaon culvert inlet, impeding natural flow into the Upper Lake basin. High risk of aquatic oxygen depletion ahead of monsoon crest.',
    category: 'lake_ecology',
    severity: 'critical',
    status: 'in_progress',
    wardId: 'ward-07',
    wardName: 'Shamla Hills & Lake View',
    zoneNumber: 2,
    locationName: 'VIP Road Khanoo Gaon inlet, Bhojtal',
    landmark: 'Opposite Raja Bhoj Statue Causeway',
    latitude: 23.2492,
    longitude: 77.3785,
    departmentAssigned: 'BMC Lake Conservation & Environmental Cell',
    reporterName: 'Prof. Sudhir Nigam (Lake Guardians Bhopal)',
    reporterPhoneMasked: '+91 98260 •••••',
    isAnonymous: false,
    createdAt: '2026-08-21T08:30:00.000Z',
    updatedAt: '2026-08-22T10:15:00.000Z',
    estimatedResolutionHours: 24,
    evidenceUrls: ['/images/bhojtal-run-off.jpg'],
    upvotes: 42,
    corroborationCount: 16,
    tags: ['Bhojtal', 'Water Quality', 'Ramsar Wetland', 'Eco-Emergency'],
    recurrenceStatus: 'chronic_failure',
    relatedReportsCount: 4,
    geographicSpan: 'VIP Road Causeway to Khanoo Gaon Inflow (approx 450m linear catchment zone)',
    relatedReports: [
      {
        id: 'rep-001-a',
        submittedAt: '2026-08-21T08:30:00.000Z',
        reporterName: 'Prof. Sudhir Nigam',
        isAnonymous: false,
        locationNote: 'Khanoo Gaon culvert mouth',
        description: 'Initial report regarding water hyacinth choking culvert opening.',
        newInsights: ['Identified primary intake obstruction point.']
      },
      {
        id: 'rep-001-b',
        submittedAt: '2026-08-21T14:10:00.000Z',
        reporterName: 'Arunav Sengupta',
        isAnonymous: false,
        locationNote: 'VIP Road overlook, 100m west',
        description: 'Water color turning turbid green; plastic accumulation expanding.',
        newInsights: ['Documented rapid downstream expansion of debris field.']
      },
      {
        id: 'rep-001-c',
        submittedAt: '2026-08-22T07:45:00.000Z',
        reporterName: 'Anonymous Citizen',
        isAnonymous: true,
        locationNote: 'Raja Bhoj Causeway',
        description: 'Foul odor noticeable during morning transit; weed barrier submerged.',
        newInsights: ['Reported temporary boom barrier failure.']
      }
    ],
    previousInterventions: [
      {
        id: 'int-1',
        date: '2025-09-12',
        department: 'BMC Lake Conservation Cell',
        actionTaken: 'Mechanized harvester weed clearing',
        result: 'Cleared 18 metric tons of hyacinth; temporary relief for 3 months.'
      },
      {
        id: 'int-2',
        date: '2024-07-20',
        department: 'Bhopal Smart City Development',
        actionTaken: 'Installation of HDPE floating trash boom',
        result: 'Boom dislodged during monsoon high-water crest.'
      }
    ],
    triageResult: {
      observations: [
        'Visible mats of dense water hyacinth spanning ~45 meters along the Khanoo Gaon inlet.',
        'Plastic packaging and solid refuse obstructing the 1.2m culvert opening.',
        'Water surface displaying greenish turbidity adjacent to VIP road causeway.'
      ],
      citizen_claims: [
        'Citizen asserts that the weed accumulation is actively depleting aquatic dissolved oxygen.',
        'Reporter states runoff has increased twofold since road culvert widening.'
      ],
      evidence: [
        'Photographic documentation of culvert blockage.',
        'Specific landmark verification at Khanoo Gaon weir (23.2492° N, 77.3785° E).',
        'Telemetry confirmation from nearby sensor node #BHT-04 showing elevated organic turbidity.'
      ],
      external_evidence: [
        {
          claim: 'Ramsar Site #1206 Bhoj Wetland protected catchment boundary (3,201 hectares).',
          source_name: 'Central Pollution Control Board (CPCB) NWMP & Ramsar Registry',
          source_url: 'https://rsis.ramsar.org/ris/1206',
          publication_date: '2024-12-31',
          evidence_strength: 'conclusive',
          is_primary_source: true,
          is_synthetic: false
        },
        {
          claim: 'NGT OA 12/2025(CZ) statutory buffer and sewage interception directives along VIP Road.',
          source_name: 'National Green Tribunal (Central Zone Bench, Bhopal)',
          source_url: 'https://greentribunal.gov.in/',
          publication_date: '2025-01-28',
          evidence_strength: 'conclusive',
          is_primary_source: true,
          is_synthetic: false
        }
      ],
      evidence_coverage_percent: 90,
      inferences: [
        'The inlet directly feeds into Ramsar Site #1206 (Upper Lake basin).',
        'Prolonged obstruction ahead of monsoon crest will cause upstream backflow over VIP Road.'
      ],
      root_cause_hypotheses: [
        'Hypothesis 1: High nutrient load in upstream stormwater runoff fostering rapid Eichhornia crassipes proliferation.',
        'Hypothesis 2: Absence of a coarse floating trash barrier at the outer culvert apron.'
      ],
      recommendations: [
        'Deploy floating mechanized weed harvester unit #03 to Khanoo Gaon basin',
        'Install heavy-duty HDPE floating trash boom across the 50m inlet channel',
        'Conduct dissolved oxygen and chemical oxygen demand (COD) laboratory assays at Kamla Park lab'
      ],
      uncertainty: [
        'Exact subsurface depth of the silt bed has not been sounded.',
        'Source of high nutrient runoff (residential vs commercial) remains unconfirmed without tributary testing.'
      ],
      urgency_score: 94,
      confidence_score: 0.96,
      suggested_department: 'BMC Lake Conservation & Environmental Cell',
      duplicate_risk_level: 'none',
      ecological_impact_assessment:
        'Upper Lake provides ~40% of Bhopal drinking water. Eutrophication and siltation at this inlet threaten primary water treatment intakes.',
      is_simulated: false
    },
    timeline: [
      {
        id: 'tl-1',
        timestamp: '2026-08-21T08:30:00.000Z',
        status: 'reported',
        author: 'Prof. Sudhir Nigam',
        role: 'citizen',
        note: 'Citizen report filed with photographic evidence of weed bloom and plastic choking.',
        actionType: 'created'
      },
      {
        id: 'tl-2',
        timestamp: '2026-08-21T08:32:15.000Z',
        status: 'triaged',
        author: 'Claude 3.5 Sonnet Operations Engine',
        role: 'claude_ai',
        note: 'Epistemic triage: Urgency 94/100. Categorized as critical ecological risk to Bhojtal Ramsar site. Action protocol dispatched to Lake Conservation Cell.',
        actionType: 'ai_triaged'
      }
    ]
  },
  {
    id: 'inc-002',
    trackingToken: 'CM-BPL-2026-0829',
    title: 'Heritage Masonry Displacement at Taj-ul-Masajid North Gate Arcade',
    description:
      'Red sandstone cornice blocks on the north arcade showing active mortar crumbling and structural shift following heavy rain seepage. Heavy pedestrian movement requires immediate safety perimeter.',
    category: 'heritage_infrastructure',
    severity: 'high',
    status: 'triaged',
    wardId: 'ward-12',
    wardName: 'Old City & Bada Bagh Corridor',
    zoneNumber: 1,
    locationName: 'Taj-ul-Masajid Northern Gate Corridor',
    landmark: 'Near Motia Talab Access Way',
    latitude: 23.2641,
    longitude: 77.3988,
    departmentAssigned: 'Bhopal Heritage & Urban Renewal Directorate',
    reporterName: 'Tariq Siddiqui',
    reporterPhoneMasked: '+91 94250 •••••',
    isAnonymous: false,
    createdAt: '2026-08-21T14:20:00.000Z',
    updatedAt: '2026-08-22T09:00:00.000Z',
    estimatedResolutionHours: 48,
    evidenceUrls: ['/images/heritage-gate.jpg'],
    upvotes: 29,
    corroborationCount: 11,
    tags: ['Heritage', 'Old Bhopal', 'Public Safety', 'Masonry'],
    recurrenceStatus: 'emerging_recurrent',
    relatedReportsCount: 2,
    geographicSpan: 'Taj-ul-Masajid North Arcade Gate to Motia Talab Link',
    relatedReports: [
      {
        id: 'rep-002-a',
        submittedAt: '2026-08-21T14:20:00.000Z',
        reporterName: 'Tariq Siddiqui',
        isAnonymous: false,
        locationNote: 'North Gate Arcade arch #3',
        description: 'Noticed red sandstone shift and mortar falling.',
        newInsights: ['Identified sandstone displacement on northern arch.']
      }
    ],
    previousInterventions: [
      {
        id: 'int-3',
        date: '2024-11-04',
        department: 'Bhopal Heritage Directorate',
        actionTaken: 'Surface pointing with hydraulic lime',
        result: 'Temporary stabilization; water seepage issue was not resolved at roof level.'
      }
    ],
    triageResult: {
      observations: [
        'Dressed red sandstone cornice block displaying ~15mm outward shift.',
        'Lime mortar weathering and active flaking visible along 3 stone course joints.',
        'High pedestrian foot traffic directly below the affected arcade.'
      ],
      citizen_claims: [
        'Citizen notes mortar began falling after overnight torrential rainfall.'
      ],
      evidence: [
        'Photographic evidence of sandstone separation joint.',
        'Geographic location within Taj-ul-Masajid heritage precinct (Zone 1).'
      ],
      external_evidence: [
        {
          claim: 'Zone 1 Old Bhopal historic heritage conservation corridor regulations.',
          source_name: 'Bhopal Heritage Cell / Directorate of Archaeology MP Gazette',
          source_url: 'https://www.bmconline.gov.in/',
          publication_date: '2021-08-10',
          evidence_strength: 'conclusive',
          is_primary_source: true,
          is_synthetic: false
        }
      ],
      evidence_coverage_percent: 85,
      inferences: [
        'Rainwater infiltration has weakened traditional lime mortar binder.',
        'Structural shift poses an immediate hazard to passing worshippers and tourists.'
      ],
      root_cause_hypotheses: [
        'Hypothesis 1: Blocked upper roof drainage channel causing localized water pooling and seepage through masonry joints.',
        'Hypothesis 2: Thermal expansion cycle fatigue in unreinforced 19th-century dressed stone.'
      ],
      recommendations: [
        'Erect protective pedestrian barricade and scaffolding net immediately',
        'Deploy heritage conservation engineer with ultrasonic joint tester',
        'Prepare hydraulic lime mortar consolidation mix'
      ],
      uncertainty: [
        'Internal tie-rod condition behind the facing stone is unknown without endoscopy.',
        'Stability of adjacent arch stones requires comprehensive non-destructive load testing.'
      ],
      urgency_score: 82,
      confidence_score: 0.94,
      suggested_department: 'Bhopal Heritage & Urban Renewal Directorate',
      duplicate_risk_level: 'low',
      is_simulated: false
    },
    timeline: [
      {
        id: 'tl-4',
        timestamp: '2026-08-21T14:20:00.000Z',
        status: 'reported',
        author: 'Tariq Siddiqui',
        role: 'citizen',
        note: 'Report filed noting falling mortar debris near public footpath.',
        actionType: 'created'
      }
    ]
  },
  {
    id: 'inc-003',
    trackingToken: 'CM-BPL-2026-0792',
    title: 'Stormwater Sump Backflow & Chronic Waterlogging at MP Nagar Zone II',
    description:
      'Underground stormwater drainage sump choked with commercial packaging silt and discarded construction debris. Street waterlogging reaches 1.5 feet during peak transit hours across Sargam Cinema crossing.',
    category: 'drainage_flood',
    severity: 'high',
    status: 'in_progress',
    wardId: 'ward-45',
    wardName: 'MP Nagar Commercial District (Zone I & II)',
    zoneNumber: 5,
    locationName: 'Zone II Junction near Sargam Cinema Road',
    landmark: 'Behind Bank of Baroda Regional Office',
    latitude: 23.2328,
    longitude: 77.4361,
    departmentAssigned: 'BMC Drainage & Sewerage Operations',
    reporterName: 'Vikram Joshi (MP Nagar Traders Association)',
    reporterPhoneMasked: '+91 98930 •••••',
    isAnonymous: false,
    createdAt: '2026-08-20T18:45:00.000Z',
    updatedAt: '2026-08-22T11:30:00.000Z',
    estimatedResolutionHours: 12,
    evidenceUrls: ['/images/waterlogging.jpg'],
    upvotes: 38,
    corroborationCount: 24,
    tags: ['MP Nagar', 'Waterlogging', 'Drainage Sump', 'Traffic Hazard', 'Demo Cluster'],
    recurrenceStatus: 'chronic_failure',
    relatedReportsCount: 7,
    geographicSpan: 'Zone II Sargam Cinema Crossroad to Chetak Bridge Underpass (approx 750m corridor)',
    relatedReports: [
      {
        id: 'rep-003-a',
        submittedAt: '2026-08-20T18:45:00.000Z',
        reporterName: 'Vikram Joshi',
        isAnonymous: false,
        locationNote: 'Sargam Cinema intersection',
        description: 'Har baar baarish me Sargam Cinema ke paas naala jam ho jata hai aur paani bhar jata hai.',
        newInsights: ['Identified primary junction backflow point.']
      },
      {
        id: 'rep-003-b',
        submittedAt: '2026-08-21T09:15:00.000Z',
        reporterName: 'Deepak Chhabra',
        isAnonymous: false,
        locationNote: 'Bank of Baroda crossing',
        description: 'Sump chamber lid vibrating with hydraulic pressure; water depth over 1 foot.',
        newInsights: ['Documented surcharge pressure in sump lid.']
      },
      {
        id: 'rep-003-c',
        submittedAt: '2026-08-21T16:30:00.000Z',
        reporterName: 'Anonymous Commuter',
        isAnonymous: true,
        locationNote: 'Chetak Bridge link',
        description: 'Traffic stalled due to deep water puddle near underpass.',
        newInsights: ['Traffic spillover onto Chetak transit ramp.']
      },
      {
        id: 'rep-003-d',
        submittedAt: '2026-08-22T08:00:00.000Z',
        reporterName: 'Sensor Relay #MPN-08',
        isAnonymous: true,
        locationNote: 'Transducer Chamber #08',
        description: 'Automated transducer reading > 38cm depth logged.',
        newInsights: ['Quantitative depth sensor verification.']
      }
    ],
    previousInterventions: [
      {
        id: 'int-4',
        date: '2025-08-10',
        department: 'BMC Drainage Operations',
        actionTaken: 'Deployment of high-capacity suction jetting machine #07',
        result: 'Cleared 4.2 metric tons of commercial plastic packaging silt; relieved waterlogging for 45 days until next heavy storm.'
      },
      {
        id: 'int-5',
        date: '2024-09-15',
        department: 'MP PWD Division II',
        actionTaken: 'Installation of coarse mild-steel trash interceptor grill',
        result: 'Grill was submerged and choked by non-biodegradable debris during first-flush monsoon.'
      }
    ],
    triageResult: {
      observations: [
        'Waterlogging depth measured at 38cm on carriageway across Sargam crossroad.',
        'Sump chamber lid vibrating with hydraulic backpressure under high inflow volume.',
        'Dense accumulation of commercial plastic packaging and thermocol blocking inlet grill.'
      ],
      citizen_claims: [
        'Traders assert that the junction floods within 15 minutes of any moderate rain shower.',
        'Reporter states previous suction jetting cleared only surface debris without addressing downstream bottleneck.'
      ],
      evidence: [
        'Automated transducer reading (>35cm depth) from node #MPN-08.',
        'Photographic evidence of submerged carriageway and stalled vehicles.',
        '24 corroborating citizen telemetry flags logged in Civic Memory.'
      ],
      external_evidence: [
        {
          claim: 'IMD Bhopal urban runoff surge threshold: Convective cloudbursts (>30mm/hr) exceed gravity drainage capacity in MP Nagar basin.',
          source_name: 'India Meteorological Department (IMD) / Central Water Commission',
          source_url: 'https://mausam.imd.gov.in/bhopal/',
          publication_date: '2023-01-01',
          evidence_strength: 'conclusive',
          is_primary_source: true,
          is_synthetic: false
        },
        {
          claim: 'BMC 85 Wards delimitation gazette: Zone 5 commercial infrastructure operations mandate.',
          source_name: 'Bhopal Municipal Corporation (BMC) Gazette',
          source_url: 'https://www.bmconline.gov.in/',
          publication_date: '2022-06-01',
          evidence_strength: 'conclusive',
          is_primary_source: true,
          is_synthetic: false
        },
        {
          claim: 'Simulated IoT Transducer Relay record #MPN-08 indicating 38cm road submergence.',
          source_name: 'Bhopal Civic Memory Synthetic Demo Registry',
          publication_date: '2026-08-20',
          evidence_strength: 'corroborative',
          is_primary_source: false,
          is_synthetic: true
        }
      ],
      evidence_coverage_percent: 88,
      inferences: [
        'Primary commercial transit spine compromised during peak evening commute.',
        'Chronic recurrence caused by downstream hydraulic bottleneck at Patra Nallah tributary confluence rather than simple surface silt.'
      ],
      root_cause_hypotheses: [
        'Hypothesis 1: Commercial plastic refuse and discarded packaging choking the downstream outfall transition into Patra Nallah.',
        'Hypothesis 2: Inadequate pipe diameter gradient (<0.3% slope) between Zone II sump chamber and main trunk storm line.'
      ],
      recommendations: [
        'Dispatch suction jetting unit #07 with high-pressure rotary cutters',
        'Open downstream relief bypass chamber into Patra Nallah outfall channel',
        'Enforce municipal commercial solid-waste disposal audits on Zone II market corridors'
      ],
      uncertainty: [
        'Condition of structural culvert lining between Section A and B cannot be visually inspected until water level is pumped down.',
        'Exact percentage contribution of upstream informal runoff vs commercial market refuse.'
      ],
      urgency_score: 84,
      confidence_score: 0.92,
      suggested_department: 'BMC Drainage & Sewerage Operations',
      duplicate_risk_level: 'high',
      is_simulated: false
    },
    timeline: [
      {
        id: 'tl-6',
        timestamp: '2026-08-20T18:45:00.000Z',
        status: 'reported',
        author: 'Vikram Joshi (Traders Association)',
        role: 'citizen',
        note: 'Citizen report filed with photo evidence of 1.5ft waterlogging near Sargam Cinema.',
        actionType: 'created'
      },
      {
        id: 'tl-7',
        timestamp: '2026-08-20T18:47:00.000Z',
        status: 'triaged',
        author: 'Claude 3.5 Sonnet Operations Engine',
        role: 'claude_ai',
        note: 'Triage complete: Urgency 84/100. Matched with historical chronic failure profile CM-BPL-2026-0792. Root-cause hypotheses indexed.',
        actionType: 'ai_triaged'
      },
      {
        id: 'tl-8',
        timestamp: '2026-08-21T06:00:00.000Z',
        status: 'in_progress',
        author: 'Zone 5 Rapid Action Crew',
        role: 'field_crew',
        note: 'Suction jetting unit on site; cleared 4 metric tons of commercial silt.',
        actionType: 'remediated'
      }
    ]
  },
  {
    id: 'inc-004',
    trackingToken: 'CM-BPL-2026-0750',
    title: 'Smart Streetlight Grid Outage along Arera Colony E-7 Main Boulevard',
    description:
      'Continuous 12-pole illumination failure along the E-7 green belt avenue between 11 No. Stop and Shahpura Lake feeder road. Reduced visibility posing pedestrian hazard.',
    category: 'public_lighting',
    severity: 'medium',
    status: 'resolved',
    wardId: 'ward-52',
    wardName: 'Arera Colony & 10 No. Market',
    zoneNumber: 6,
    locationName: 'E-7 Arera Colony Boulevard',
    landmark: 'Opposite Sai Baba Mandir turn',
    latitude: 23.2085,
    longitude: 77.4241,
    departmentAssigned: 'Bhopal Smart City Development Corp (BSCDCL)',
    reporterName: 'Ananya Deshmukh',
    reporterPhoneMasked: '+91 97130 •••••',
    isAnonymous: false,
    createdAt: '2026-08-19T20:10:00.000Z',
    updatedAt: '2026-08-21T16:00:00.000Z',
    resolvedAt: '2026-08-21T16:00:00.000Z',
    estimatedResolutionHours: 8,
    evidenceUrls: [],
    upvotes: 14,
    corroborationCount: 7,
    tags: ['Lighting', 'BSCDCL', 'Arera Colony', 'Resolved'],
    recurrenceStatus: 'isolated',
    relatedReportsCount: 1,
    triageResult: {
      observations: [
        '12 LED street lighting luminaires unlit along a 400m linear stretch.'
      ],
      citizen_claims: [
        'Pedestrians report total blackout from 11 No. stop to Shahpura link.'
      ],
      evidence: [
        'Telemetry outage signal from Substation Feeder E7-02.'
      ],
      external_evidence: [
        {
          claim: 'CPCB NWMP Station #1065 Shahpura Lake water and environmental zone boundary.',
          source_name: 'Central Pollution Control Board (CPCB) NWMP',
          source_url: 'https://cpcb.nic.in/nwmp-data/',
          publication_date: '2024-12-31',
          evidence_strength: 'conclusive',
          is_primary_source: true,
          is_synthetic: false
        }
      ],
      evidence_coverage_percent: 80,
      inferences: [
        'Single point of electrical feeder line failure rather than individual bulb damage.'
      ],
      root_cause_hypotheses: [
        'Hypothesis 1: Moisture short-circuit in underground junction box.'
      ],
      recommendations: [
        'Reset breaker at Substation E7-02',
        'Verify loop insulation resistance'
      ],
      uncertainty: [
        'Physical cable cut vs terminal moisture corrosion unconfirmed until pit opened.'
      ],
      urgency_score: 52,
      confidence_score: 0.98,
      suggested_department: 'BSCDCL Electrical Grid Operations',
      duplicate_risk_level: 'none',
      is_simulated: false
    },
    timeline: [
      {
        id: 'tl-9',
        timestamp: '2026-08-19T20:10:00.000Z',
        status: 'reported',
        author: 'Ananya Deshmukh',
        role: 'citizen',
        note: 'Reported complete black-out on avenue.',
        actionType: 'created'
      },
      {
        id: 'tl-10',
        timestamp: '2026-08-21T16:00:00.000Z',
        status: 'resolved',
        author: 'BSCDCL Grid Team',
        role: 'field_crew',
        note: 'Faulty underground armored cable replaced. All 12 luminaires operational and telemetry verified.',
        actionType: 'verified_resolved'
      }
    ]
  },
  {
    id: 'inc-005',
    trackingToken: 'CM-BPL-2026-0855',
    title: 'Kolar Road Sarvadharma Bridge Pavement Subsidence & Exposed Reinforcement',
    description:
      'Deep pothole cluster (approx 2m diameter) with exposed structural rebar on the bridge approach slab. Sudden braking observed causing two-wheeler skids.',
    category: 'road_hazard',
    severity: 'critical',
    status: 'reported',
    wardId: 'ward-33',
    wardName: 'Kolar Road & Sarvadharma Corridor',
    zoneNumber: 8,
    locationName: 'Sarvadharma Bridge Northern Incline',
    landmark: '100m before D-Mart junction',
    latitude: 23.1812,
    longitude: 77.4182,
    departmentAssigned: 'MP Public Works Department (PWD) / BMC Roads',
    reporterName: 'Harishankar Meena',
    reporterPhoneMasked: '+91 99810 •••••',
    isAnonymous: false,
    createdAt: '2026-08-22T06:15:00.000Z',
    updatedAt: '2026-08-22T06:15:00.000Z',
    estimatedResolutionHours: 18,
    evidenceUrls: [],
    upvotes: 37,
    corroborationCount: 22,
    tags: ['Kolar Road', 'Road Safety', 'Bridge Subsidence', 'High Traffic'],
    recurrenceStatus: 'emerging_recurrent',
    relatedReportsCount: 3,
    geographicSpan: 'Sarvadharma Bridge approach to Danish Kunj junction',
    triageResult: {
      observations: [
        'Cavity in bridge approach pavement approx 2m length and 15cm depth.',
        'Corroded longitudinal steel rebar exposed to vehicular tires.'
      ],
      citizen_claims: [
        'Multiple two-wheeler riders reported near accidents due to emergency braking.'
      ],
      evidence: [
        'Factual coordinate pinpoint on Sarvadharma bridge approach ramp.'
      ],
      external_evidence: [
        {
          claim: 'IMD Bhopal monsoon precipitation statistics: Kolar river basin hydrological catchment.',
          source_name: 'India Meteorological Department (IMD)',
          source_url: 'https://mausam.imd.gov.in/bhopal/',
          publication_date: '2023-01-01',
          evidence_strength: 'conclusive',
          is_primary_source: true,
          is_synthetic: false
        }
      ],
      evidence_coverage_percent: 85,
      inferences: [
        'Extreme acute hazard for two-wheeler commuters on heavy Kolar transit spine.'
      ],
      root_cause_hypotheses: [
        'Hypothesis 1: Bridge approach slab expansion joint seal failed, allowing sub-base erosion during monsoon.'
      ],
      recommendations: [
        'Deploy reflective warning barricades immediately',
        'Dispatch emergency mastic asphalt repair crew',
        'Conduct structural expansion joint integrity inspection'
      ],
      uncertainty: [
        'Structural bridge deck slab condition beneath the asphalt overlay requires ultrasonic radar.'
      ],
      urgency_score: 91,
      confidence_score: 0.95,
      suggested_department: 'MP PWD & BMC Rapid Road Maintenance Division',
      duplicate_risk_level: 'none',
      is_simulated: false
    },
    timeline: [
      {
        id: 'tl-11',
        timestamp: '2026-08-22T06:15:00.000Z',
        status: 'reported',
        author: 'Harishankar Meena',
        role: 'citizen',
        note: 'Citizen emergency alert logged regarding exposed steel rebar on bridge ramp.',
        actionType: 'created'
      }
    ]
  }
];

export const INITIAL_CIVIC_METRICS: CivicPulseMetrics = {
  totalActiveIncidents: 47,
  criticalAlerts: 7,
  resolvedLast7Days: 142,
  avgResolutionTimeHours: 19.4,
  bhojtalLakeQualityIndex: 82,
  overallCityHealthIndex: 86,
  activeWardsMonitored: 85,
  sensorAlertsToday: 12
};
