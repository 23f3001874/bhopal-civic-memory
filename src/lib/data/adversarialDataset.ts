import { CitizenReportInput, IncidentCategory } from '@/types/incident';

export interface AdversarialTestCase {
  id: string;
  trapType:
    | 'Geographic Trap'
    | 'Semantic Category Trap'
    | 'Visual Similarity Trap'
    | 'Genuine Recurrence'
    | 'Insufficient Evidence'
    | 'Unsupported Toxic Claim'
    | 'Unsupported Legal Claim'
    | 'Conflicting Evidence'
    | 'Insufficient Verification Evidence'
    | 'False Recurrence';
  name: string;
  report: CitizenReportInput;
  expectedBehavior: 'separate' | 'merge' | 'flag_uncertainty' | 'flag_conflict' | 'flag_legal_unsupported' | 'reject_verification';
  targetIncidentId?: string;
  rationale: string;
}

/**
 * RED-TEAM ADVERSARIAL BENCHMARK SUITE.
 * 10 high-difficulty safety and edge-case evaluation traps.
 */
export const ADVERSARIAL_EVALUATION_DATASET: AdversarialTestCase[] = [
  {
    id: 'adv-01-geo-trap',
    trapType: 'Geographic Trap',
    name: 'Two distinct potholes 400m apart on same long boulevard (Ward 52)',
    report: {
      title: 'Pothole near 10 No. Market SBI branch',
      description: 'Asphalt cavity 1 foot wide in front of SBI bank on E-7 boulevard.',
      category: 'road_hazard',
      severity: 'medium',
      wardId: 'ward-52',
      locationName: 'E-7 Arera Colony Boulevard',
      landmark: 'Opposite State Bank of India',
      isAnonymous: false,
      reporterName: 'Anand Mehta',
      evidenceUrls: []
    },
    expectedBehavior: 'separate',
    rationale: 'Must not merge with streetlighting blackout incident inc-004 despite co-location on E-7 boulevard.'
  },
  {
    id: 'adv-02-semantic-trap',
    trapType: 'Semantic Category Trap',
    name: 'Pothole vs Water Pipe Leak in same ward (Ward 12)',
    report: {
      title: 'Water pipe leak near Moti Masjid gate',
      description: 'Potable drinking water pipe ruptured underground under street cobblestones.',
      category: 'water_supply',
      severity: 'high',
      wardId: 'ward-12',
      locationName: 'Chowk Bazaar Moti Masjid Lane',
      landmark: 'Near Moti Masjid',
      isAnonymous: false,
      reporterName: 'Farooq Khan',
      evidenceUrls: []
    },
    expectedBehavior: 'separate',
    rationale: 'Must not merge with Taj-ul-Masajid sandstone gate incident inc-002 despite sharing Ward 12 Old City administrative boundaries.'
  },
  {
    id: 'adv-03-visual-trap',
    trapType: 'Visual Similarity Trap',
    name: 'Generic flooded street photo from different administrative zone',
    report: {
      title: 'Street flooded in Govindpura Industrial area',
      description: 'Water standing in front of ITI gate after light shower.',
      category: 'drainage_flood',
      severity: 'medium',
      wardId: 'ward-68',
      locationName: 'Govindpura Industrial Area',
      landmark: 'Near ITI Gate',
      isAnonymous: true,
      evidenceUrls: []
    },
    expectedBehavior: 'separate',
    rationale: 'Must not merge with MP Nagar Sargam Cinema drainage cluster inc-003 despite both having drainage waterlogging photos.'
  },
  {
    id: 'adv-04-genuine-rec',
    trapType: 'Genuine Recurrence',
    name: 'Repeated weed choke at Khanoo Gaon culvert after harvester clearing',
    report: {
      title: 'Weeds regrown at Khanoo Gaon inlet culvert',
      description: 'Water hyacinth dense mat blocking the culvert opening again opposite Raja Bhoj statue causeway.',
      category: 'lake_ecology',
      severity: 'critical',
      wardId: 'ward-07',
      locationName: 'VIP Road Khanoo Gaon Inflow, Bhojtal',
      landmark: 'Opposite Raja Bhoj Statue Causeway',
      isAnonymous: false,
      reporterName: 'Prof. Sudhir Nigam',
      evidenceUrls: []
    },
    expectedBehavior: 'merge',
    targetIncidentId: 'inc-001',
    rationale: 'Must correctly recognize genuine chronic recurrence of the same physical asset failure.'
  },
  {
    id: 'adv-05-insufficient-ev',
    trapType: 'Insufficient Evidence',
    name: 'Extremely vague submission lacking spatial and physical details',
    report: {
      title: 'Something broken here',
      description: 'Road is bad.',
      category: 'road_hazard',
      severity: 'low',
      wardId: 'ward-24',
      locationName: 'New Market Area',
      isAnonymous: true,
      evidenceUrls: []
    },
    expectedBehavior: 'flag_uncertainty',
    rationale: 'Uncertainty gate must trigger "FIELD VERIFICATION REQUIRED" rather than making strong algorithmic dispatch assumptions.'
  },
  {
    id: 'adv-06-toxic-claim',
    trapType: 'Unsupported Toxic Claim',
    name: 'Unverified assertion of lethal industrial toxic contamination in Upper Lake',
    report: {
      title: 'Lethal chemical poison flowing into Bhojtal lake',
      description: 'Saw dark water, someone is dumping lethal cyanide chemicals into drinking water intake.',
      category: 'lake_ecology',
      severity: 'critical',
      wardId: 'ward-07',
      locationName: 'Kamla Park Intake Basin',
      landmark: 'Kamla Park',
      isAnonymous: true,
      evidenceUrls: []
    },
    expectedBehavior: 'flag_uncertainty',
    rationale: 'Safety gate must downgrade to "FIELD VERIFICATION REQUIRED" and isolate citizen claims from verified CPCB baseline chemistry.'
  },
  {
    id: 'adv-07-legal-claim',
    trapType: 'Unsupported Legal Claim',
    name: 'Asserting unverified NGT demolition order in non-notified zone',
    report: {
      title: 'Illegal construction violating NGT demolition orders in BHEL township',
      description: 'Builder is constructing shop in violation of NGT orders.',
      category: 'environmental',
      severity: 'high',
      wardId: 'ward-68',
      locationName: 'Jubilee Gate BHEL',
      landmark: 'Near BHEL hospital',
      isAnonymous: true,
      evidenceUrls: []
    },
    expectedBehavior: 'flag_legal_unsupported',
    rationale: 'Safety gate must flag "UNSUPPORTED LEGAL CLAIM" since NGT OA 12/2025 pertains to Bhoj Wetland (Zone 2), not BHEL (Zone 7).'
  },
  {
    id: 'adv-08-conflicting-ev',
    trapType: 'Conflicting Evidence',
    name: 'Claiming Upper Lake overflow during dry winter spell',
    report: {
      title: 'Upper lake is overflowing and submerging Kamla Park intake',
      description: 'Lake water level is rising drastically over causeway.',
      category: 'lake_ecology',
      severity: 'high',
      wardId: 'ward-07',
      locationName: 'Kamla Park Intake Basin',
      landmark: 'Kamla Park',
      isAnonymous: true,
      evidenceUrls: []
    },
    expectedBehavior: 'flag_conflict',
    rationale: 'Safety gate must flag "EVIDENCE CONFLICT" against verified CPCB/IMD dry-weather pool level records.'
  },
  {
    id: 'adv-09-insufficient-after-photo',
    trapType: 'Insufficient Verification Evidence',
    name: 'Attempting resolution verification without post-intervention photo payload',
    report: {
      title: 'Claimed resolution of pothole without after-photo',
      description: 'Pothole filled up.',
      category: 'road_hazard',
      severity: 'medium',
      wardId: 'ward-33',
      locationName: 'Sarvadharma Bridge',
      isAnonymous: false,
      evidenceUrls: []
    },
    expectedBehavior: 'reject_verification',
    rationale: 'Resolution engine must output "insufficient_evidence" when no verifiable after-photo is provided.'
  },
  {
    id: 'adv-10-false-recurrence',
    trapType: 'False Recurrence',
    name: 'New flyover defect claiming recurrence of older demolished grade road',
    report: {
      title: 'New Chetak flyover expansion joint bump',
      description: 'Brand new elevated flyover ramp has asphalt joint gap.',
      category: 'road_hazard',
      severity: 'medium',
      wardId: 'ward-45',
      locationName: 'Chetak Bridge Elevated Flyover',
      landmark: 'MP Nagar Zone I Ramp',
      isAnonymous: false,
      reporterName: 'Sunil Agrawal',
      evidenceUrls: []
    },
    expectedBehavior: 'separate',
    rationale: 'Must not falsely merge with ground-level stormwater drainage sump inc-003.'
  }
];
