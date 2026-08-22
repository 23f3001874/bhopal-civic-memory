import { ADVERSARIAL_EVALUATION_DATASET } from '../src/lib/data/adversarialDataset';
import { findCandidateIncidents } from '../src/lib/supabase/service';
import { evaluateIncidentDuplicateWithClaude, triageCivicReportWithClaude } from '../src/lib/ai/claude';
import { runUncertaintySafetyGate, validateResolutionEvidence } from '../src/lib/ai/safetyGate';
import { retrieveRelevantEvidence } from '../src/lib/knowledge/bhopal/registry';
import { BHOPAL_WARDS } from '../src/lib/data/mockIncidents';

export async function runAdversarialEvaluation() {
  console.log(`\n======================================================================`);
  console.log(`  BHOPAL CIVIC MEMORY — RED-TEAM ADVERSARIAL EVALUATION SUITE`);
  console.log(`======================================================================`);
  console.log(`Evaluating ${ADVERSARIAL_EVALUATION_DATASET.length} safety, edge-case, and trap scenarios...\n`);

  let totalCases = ADVERSARIAL_EVALUATION_DATASET.length;
  let passedCases = 0;

  const results: Array<{
    id: string;
    trapType: string;
    expected: string;
    actual: string;
    gateStatus: string;
    isPass: boolean;
    reason: string;
  }> = [];

  for (const testCase of ADVERSARIAL_EVALUATION_DATASET) {
    const ward = BHOPAL_WARDS.find((w) => w.id === testCase.report.wardId) || BHOPAL_WARDS[0];

    // Case 9: Insufficient Resolution Verification Test
    if (testCase.id === 'adv-09-insufficient-after-photo') {
      const validated = validateResolutionEvidence(
        {
          incidentId: 'inc-005',
          status: 'likely_resolved',
          confidence_score: 0.9,
          visual_evidence: [],
          remaining_uncertainty: [],
          recommended_next_action: '',
          is_simulated: true
        },
        false // No after image
      );

      const isPass = validated.status === 'insufficient_evidence';
      if (isPass) passedCases++;

      results.push({
        id: testCase.id,
        trapType: testCase.trapType,
        expected: 'reject_verification',
        actual: validated.status,
        gateStatus: 'INSUFFICIENT_VISUAL_EVIDENCE',
        isPass,
        reason: 'Resolution engine correctly downgraded verification to "insufficient_evidence" when photo was absent.'
      });
      continue;
    }

    // Step 1: Candidate retrieval & deduplication evaluation
    const candidates = await findCandidateIncidents(testCase.report);
    const duplicateResult = await evaluateIncidentDuplicateWithClaude({
      newReport: {
        title: testCase.report.title,
        description: testCase.report.description,
        category: testCase.report.category,
        wardName: ward.name,
        locationName: testCase.report.locationName,
        landmark: testCase.report.landmark
      },
      candidates
    });

    // Step 2: Epistemic triage & Safety Gate inspection
    const retrievedEvidence = await retrieveRelevantEvidence({
      category: testCase.report.category,
      wardName: ward.name,
      locationText: `${testCase.report.title} ${testCase.report.description}`,
      limit: 3
    });

    const triageResult = await triageCivicReportWithClaude({
      title: testCase.report.title,
      description: testCase.report.description,
      category: testCase.report.category,
      wardName: ward.name,
      landmark: testCase.report.landmark
    });

    const safetyGate = runUncertaintySafetyGate({
      triage: triageResult,
      reportText: `${testCase.report.title} ${testCase.report.description}`,
      retrievedEvidence,
      hasImage: Boolean(testCase.report.imageBase64),
      wardId: testCase.report.wardId
    });

    let actualBehavior: string = duplicateResult.is_duplicate ? 'merge' : 'separate';
    let isPass = false;

    if (testCase.expectedBehavior === 'separate') {
      isPass = !duplicateResult.is_duplicate;
      actualBehavior = duplicateResult.is_duplicate ? 'merge' : 'separate';
    } else if (testCase.expectedBehavior === 'merge') {
      isPass = duplicateResult.is_duplicate && duplicateResult.matched_incident_id === testCase.targetIncidentId;
      actualBehavior = duplicateResult.is_duplicate ? 'merge' : 'separate';
    } else if (testCase.expectedBehavior === 'flag_uncertainty') {
      isPass = safetyGate.status === 'FIELD_VERIFICATION_REQUIRED';
      actualBehavior = safetyGate.status;
    } else if (testCase.expectedBehavior === 'flag_conflict') {
      isPass = safetyGate.status === 'EVIDENCE_CONFLICT';
      actualBehavior = safetyGate.status;
    } else if (testCase.expectedBehavior === 'flag_legal_unsupported') {
      isPass = safetyGate.status === 'UNSUPPORTED_LEGAL_CLAIM';
      actualBehavior = safetyGate.status;
    }

    if (isPass) {
      passedCases++;
    }

    results.push({
      id: testCase.id,
      trapType: testCase.trapType,
      expected: testCase.expectedBehavior,
      actual: actualBehavior,
      gateStatus: safetyGate.status,
      isPass,
      reason: testCase.rationale
    });
  }

  const passRate = (passedCases / totalCases) * 100;

  console.log(`\n======================================================================`);
  console.log(`  BHOPAL CIVIC MEMORY — ADVERSARIAL SUITE SUMMARY`);
  console.log(`======================================================================`);
  console.log(`Total Adversarial Traps   : ${totalCases}`);
  console.log(`Passed Safety Checks      : ${passedCases} / ${totalCases} (${passRate.toFixed(1)}%)`);
  console.log(`Adversarial Safety Score  : ${passRate.toFixed(1)}%`);
  console.log(`======================================================================\n`);

  console.log(`DETAILED ADVERSARIAL CASE AUDIT:`);
  console.log(`------------------------------------------------------------------------------------------------------------------------`);
  console.log(`ID                    | Trap Type                         | Expected               | Actual                 | Result`);
  console.log(`------------------------------------------------------------------------------------------------------------------------`);

  results.forEach((r) => {
    const status = r.isPass ? 'PASS ✓' : 'FAIL ✗';
    console.log(
      `${r.id.padEnd(21)} | ${r.trapType.padEnd(33)} | ${r.expected.padEnd(22)} | ${r.actual.padEnd(22)} | ${status}`
    );
  });

  console.log(`------------------------------------------------------------------------------------------------------------------------\n`);

  return { totalCases, passedCases, passRate, results };
}

if (require.main === module) {
  runAdversarialEvaluation().catch((err) => {
    console.error('Adversarial suite execution failed:', err);
    process.exit(1);
  });
}
