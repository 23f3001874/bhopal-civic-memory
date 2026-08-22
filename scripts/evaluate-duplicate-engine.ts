import { SYNTHETIC_EVALUATION_DATASET } from '../src/lib/data/evaluationDataset';
import { findCandidateIncidents } from '../src/lib/supabase/service';
import { evaluateIncidentDuplicateWithClaude } from '../src/lib/ai/claude';
import { BHOPAL_WARDS } from '../src/lib/data/mockIncidents';

interface EvaluationMetrics {
  totalCases: number;
  correctDecisions: number;
  expectedMerges: number;
  actualCorrectMerges: number;
  expectedSeparates: number;
  actualCorrectSeparates: number;
  falseMerges: number; // Critical error: merging separate/ambiguous incidents
  missedMerges: number; // Missed duplicate or recurrence
  missedRecurrences: number;
  correctMergeRate: number;
  falseMergeRate: number;
  missedRecurrenceRate: number;
  overallAccuracy: number;
}

interface CaseEvaluationResult {
  id: string;
  name: string;
  expected: string;
  predicted: string;
  matchedId?: string;
  expectedTarget?: string;
  isCorrect: boolean;
  confidence: number;
  reasoning: string;
}

export async function runEvaluation(): Promise<{
  metrics: EvaluationMetrics;
  results: CaseEvaluationResult[];
  reportText: string;
}> {
  const results: CaseEvaluationResult[] = [];

  let expectedMerges = 0;
  let actualCorrectMerges = 0;
  let expectedSeparates = 0;
  let actualCorrectSeparates = 0;
  let falseMerges = 0;
  let missedMerges = 0;
  let totalRecurrenceCases = 0;
  let missedRecurrences = 0;
  let correctDecisions = 0;

  console.log(`\n======================================================================`);
  console.log(`  BHOPAL CIVIC MEMORY — EVALUATION RUNNER (BENCHMARK DATASET)`);
  console.log(`======================================================================`);
  console.log(`Evaluating ${SYNTHETIC_EVALUATION_DATASET.length} synthetic benchmark reports...\n`);

  for (const testCase of SYNTHETIC_EVALUATION_DATASET) {
    const ward = BHOPAL_WARDS.find((w) => w.id === testCase.report.wardId) || BHOPAL_WARDS[0];

    // 1. Candidate retrieval stage
    const candidates = await findCandidateIncidents(testCase.report);

    // 2. Claude reasoning stage
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

    const isMergeExpected =
      testCase.expected_outcome === 'merge' || testCase.expected_outcome === 'recurrence_merge';
    const isSeparateExpected =
      testCase.expected_outcome === 'separate' || testCase.expected_outcome === 'ambiguous_separate';

    const predictedOutcome = duplicateResult.is_duplicate ? 'merge' : 'separate';

    let isCorrect = false;

    if (isMergeExpected) {
      expectedMerges++;
      if (testCase.expected_outcome === 'recurrence_merge') {
        totalRecurrenceCases++;
      }

      if (duplicateResult.is_duplicate) {
        // Check if target matches expected ID
        if (
          !testCase.expected_target_incident_id ||
          duplicateResult.matched_incident_id === testCase.expected_target_incident_id
        ) {
          isCorrect = true;
          actualCorrectMerges++;
          correctDecisions++;
        } else {
          missedMerges++;
          if (testCase.expected_outcome === 'recurrence_merge') {
            missedRecurrences++;
          }
        }
      } else {
        missedMerges++;
        if (testCase.expected_outcome === 'recurrence_merge') {
          missedRecurrences++;
        }
      }
    } else if (isSeparateExpected) {
      expectedSeparates++;
      if (!duplicateResult.is_duplicate) {
        isCorrect = true;
        actualCorrectSeparates++;
        correctDecisions++;
      } else {
        falseMerges++; // Falsely merged!
      }
    }

    results.push({
      id: testCase.id,
      name: testCase.name,
      expected: testCase.expected_outcome,
      predicted: predictedOutcome,
      matchedId: duplicateResult.matched_incident_id,
      expectedTarget: testCase.expected_target_incident_id,
      isCorrect,
      confidence: duplicateResult.confidence_score,
      reasoning: duplicateResult.reasoning
    });
  }

  const totalCases = SYNTHETIC_EVALUATION_DATASET.length;
  const correctMergeRate = expectedMerges > 0 ? (actualCorrectMerges / expectedMerges) * 100 : 0;
  const falseMergeRate = expectedSeparates > 0 ? (falseMerges / expectedSeparates) * 100 : 0;
  const missedRecurrenceRate =
    totalRecurrenceCases > 0 ? (missedRecurrences / totalRecurrenceCases) * 100 : 0;
  const overallAccuracy = totalCases > 0 ? (correctDecisions / totalCases) * 100 : 0;

  const metrics: EvaluationMetrics = {
    totalCases,
    correctDecisions,
    expectedMerges,
    actualCorrectMerges,
    expectedSeparates,
    actualCorrectSeparates,
    falseMerges,
    missedMerges,
    missedRecurrences,
    correctMergeRate,
    falseMergeRate,
    missedRecurrenceRate,
    overallAccuracy
  };

  // Build report text
  let reportText = `\n======================================================================\n`;
  reportText += `  BHOPAL CIVIC MEMORY — EVALUATION REPORT SUMMARY\n`;
  reportText += `======================================================================\n`;
  reportText += `Total Evaluation Cases    : ${totalCases}\n`;
  reportText += `Correct Decisions         : ${correctDecisions} / ${totalCases} (${overallAccuracy.toFixed(1)}%)\n`;
  reportText += `----------------------------------------------------------------------\n`;
  reportText += `Correct Merge Rate        : ${actualCorrectMerges} / ${expectedMerges} (${correctMergeRate.toFixed(1)}%)\n`;
  reportText += `False Merge Rate (Safety) : ${falseMerges} / ${expectedSeparates} (${falseMergeRate.toFixed(1)}%)\n`;
  reportText += `Missed Recurrence Rate    : ${missedRecurrences} / ${totalRecurrenceCases} (${missedRecurrenceRate.toFixed(1)}%)\n`;
  reportText += `Overall Accuracy          : ${overallAccuracy.toFixed(1)}%\n`;
  reportText += `======================================================================\n\n`;

  reportText += `DETAILED CASE RESULTS:\n`;
  reportText += `----------------------------------------------------------------------------------------------------\n`;
  reportText += `ID              | Expected             | Predicted | Target   | Status  | Confidence\n`;
  reportText += `----------------------------------------------------------------------------------------------------\n`;

  results.forEach((r) => {
    const status = r.isCorrect ? 'PASS ✓' : 'FAIL ✗';
    const target = r.matchedId || 'none';
    reportText += `${r.id.padEnd(15)} | ${r.expected.padEnd(20)} | ${r.predicted.padEnd(9)} | ${target.padEnd(8)} | ${status.padEnd(7)} | ${(r.confidence * 100).toFixed(0)}%\n`;
  });

  reportText += `----------------------------------------------------------------------------------------------------\n`;

  console.log(reportText);

  return { metrics, results, reportText };
}

// If invoked directly via tsx/node
if (require.main === module) {
  runEvaluation().catch((err) => {
    console.error('Evaluation runner failed:', err);
    process.exit(1);
  });
}
