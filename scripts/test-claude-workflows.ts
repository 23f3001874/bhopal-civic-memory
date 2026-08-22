import {
  triageCivicReportWithClaude,
  evaluateIncidentDuplicateWithClaude,
  analyzeRecurrenceWithClaude,
  generateFieldPlanWithClaude,
  verifyResolutionWithClaudeVision,
  CLAUDE_MODEL,
  isClaudeConfigured
} from '../src/lib/ai/claude';
import { runUncertaintySafetyGate, validateResolutionEvidence } from '../src/lib/ai/safetyGate';
import { INITIAL_INCIDENTS, BHOPAL_WARDS } from '../src/lib/data/mockIncidents';
import { retrieveRelevantEvidence } from '../src/lib/knowledge/bhopal/registry';

export async function runWorkflowTests() {
  console.log(`\n======================================================================`);
  console.log(`  BHOPAL CIVIC MEMORY — CLAUDE WORKFLOW INTEGRATION TEST SUITE`);
  console.log(`======================================================================`);
  console.log(`Claude Model Configured   : ${CLAUDE_MODEL}`);
  console.log(`Anthropic API Key Present : ${isClaudeConfigured ? 'YES (Live Mode)' : 'NO (Deterministic Fallback Mode)'}`);
  console.log(`======================================================================\n`);

  let totalTests = 0;
  let passedTests = 0;

  const demoIncident = INITIAL_INCIDENTS[2]; // inc-003 Sargam Cinema drainage

  // TEST A & B: Live Path vs Deterministic Fallback Handling
  totalTests++;
  try {
    const triage = await triageCivicReportWithClaude({
      title: 'Sargam Cinema drainage overflow',
      description: 'Waterlogging at intersection',
      category: 'drainage_flood',
      wardName: 'MP Nagar'
    });
    const expectedSimulated = !isClaudeConfigured;
    if (triage.is_simulated === expectedSimulated) {
      console.log(`[PASS ✓] Test A/B: Triage correctly set is_simulated=${triage.is_simulated} (Model: ${triage.model_used || 'Fallback'})`);
      passedTests++;
    } else {
      console.log(`[FAIL ✗] Test A/B: Unexpected is_simulated flag`);
    }
  } catch (err) {
    console.log(`[FAIL ✗] Test A/B error:`, err);
  }

  // TEST C: Malformed JSON Fallback Resilience
  totalTests++;
  try {
    // Calling with empty input to test resilience
    const duplicate = await evaluateIncidentDuplicateWithClaude({
      newReport: {
        title: '',
        description: '',
        category: 'drainage_flood',
        wardName: 'MP Nagar',
        locationName: 'Sargam'
      },
      candidates: []
    });
    if (duplicate.match_type === 'distinct_incident') {
      console.log(`[PASS ✓] Test C: Zero candidate / malformed input safely yielded distinct incident`);
      passedTests++;
    } else {
      console.log(`[FAIL ✗] Test C: Failed resilience check`);
    }
  } catch (err) {
    console.log(`[FAIL ✗] Test C error:`, err);
  }

  // TEST D: Unsupported Toxic Contamination Claim Safety Gate Rejection
  totalTests++;
  try {
    const evidence = await retrieveRelevantEvidence({
      category: 'lake_ecology',
      wardName: 'Shamla Hills',
      locationText: 'Kamla park cyanide poisoning',
      limit: 3
    });
    const safety = runUncertaintySafetyGate({
      triage: demoIncident.triageResult!,
      reportText: 'Someone dumped lethal cyanide toxic chemical into the lake water supply',
      retrievedEvidence: evidence,
      wardId: 'ward-07'
    });
    if (safety.status === 'FIELD_VERIFICATION_REQUIRED') {
      console.log(`[PASS ✓] Test D: Unsupported toxic claim downgraded to "FIELD_VERIFICATION_REQUIRED"`);
      passedTests++;
    } else {
      console.log(`[FAIL ✗] Test D: Toxic claim was not downgraded (Got: ${safety.status})`);
    }
  } catch (err) {
    console.log(`[FAIL ✗] Test D error:`, err);
  }

  // TEST E: Insufficient Evidence Output
  totalTests++;
  try {
    const safety = runUncertaintySafetyGate({
      triage: demoIncident.triageResult!,
      reportText: 'Road bad',
      retrievedEvidence: [],
      hasImage: false
    });
    if (safety.status === 'FIELD_VERIFICATION_REQUIRED') {
      console.log(`[PASS ✓] Test E: Vague report (<8 words) without photo downgraded to "FIELD_VERIFICATION_REQUIRED"`);
      passedTests++;
    } else {
      console.log(`[FAIL ✗] Test E: Vague report not downgraded (Got: ${safety.status})`);
    }
  } catch (err) {
    console.log(`[FAIL ✗] Test E error:`, err);
  }

  // TEST F: Resolution Without After-Photo Returns insufficient_evidence
  totalTests++;
  try {
    const validated = validateResolutionEvidence(
      {
        incidentId: 'inc-003',
        status: 'likely_resolved',
        confidence_score: 0.9,
        visual_evidence: [],
        remaining_uncertainty: [],
        recommended_next_action: '',
        is_simulated: true
      },
      false // No after-photo
    );
    if (validated.status === 'insufficient_evidence') {
      console.log(`[PASS ✓] Test F: Resolution without after-photo rejected with "insufficient_evidence"`);
      passedTests++;
    } else {
      console.log(`[FAIL ✗] Test F: Resolution without photo was not rejected`);
    }
  } catch (err) {
    console.log(`[FAIL ✗] Test F error:`, err);
  }

  // TEST G: Recurrence Analysis Framing Hypotheses with Evidence IDs
  totalTests++;
  try {
    const evidence = await retrieveRelevantEvidence({
      category: 'drainage_flood',
      wardName: 'MP Nagar',
      locationText: 'Sargam Cinema drainage sump',
      limit: 3
    });
    const recurrence = await analyzeRecurrenceWithClaude({
      incident: demoIncident,
      retrievedEvidence: evidence
    });
    if (recurrence.current_hypotheses.length > 0 && recurrence.evidence_to_reduce_uncertainty.length > 0) {
      console.log(`[PASS ✓] Test G: Recurrence analysis returned ${recurrence.current_hypotheses.length} hypotheses with uncertainty reduction protocols`);
      passedTests++;
    } else {
      console.log(`[FAIL ✗] Test G: Missing recurrence hypotheses`);
    }
  } catch (err) {
    console.log(`[FAIL ✗] Test G error:`, err);
  }

  // TEST H: Field Plan Remains Explicitly Non-Official
  totalTests++;
  try {
    const evidence = await retrieveRelevantEvidence({
      category: 'drainage_flood',
      wardName: 'MP Nagar',
      locationText: 'Sargam Cinema drainage',
      limit: 3
    });
    const plan = await generateFieldPlanWithClaude({
      incident: demoIncident,
      retrievedEvidence: evidence
    });
    if (plan.disclaimer.includes('Not an official BMC work order')) {
      console.log(`[PASS ✓] Test H: Field Plan explicitly contains non-authoritative BMC disclaimer`);
      passedTests++;
    } else {
      console.log(`[FAIL ✗] Test H: Missing non-authoritative disclaimer`);
    }
  } catch (err) {
    console.log(`[FAIL ✗] Test H error:`, err);
  }

  // TEST I: Resolution Verification Receives Both Images & Evaluates
  totalTests++;
  try {
    const verification = await verifyResolutionWithClaudeVision({
      incident: demoIncident,
      afterImageBase64: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="blue" width="100" height="100"/></svg>'
    });
    if (verification.status && verification.remaining_uncertainty.length > 0) {
      console.log(`[PASS ✓] Test I: Resolution verification evaluated before/after with remaining uncertainty noted`);
      passedTests++;
    } else {
      console.log(`[FAIL ✗] Test I: Resolution verification missing uncertainty evaluation`);
    }
  } catch (err) {
    console.log(`[FAIL ✗] Test I error:`, err);
  }

  console.log(`\n======================================================================`);
  console.log(`  WORKFLOW TEST SUMMARY: ${passedTests} / ${totalTests} Passed (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
  console.log(`======================================================================\n`);

  return { totalTests, passedTests };
}

if (require.main === module) {
  runWorkflowTests().catch((err) => {
    console.error('Test suite failed:', err);
    process.exit(1);
  });
}
