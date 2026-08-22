import { BHOPAL_EVIDENCE_REGISTRY, getEvidenceRegistryStats } from '../src/lib/knowledge/bhopal/registry';

export function runEvidenceAudit() {
  console.log(`\n======================================================================`);
  console.log(`  BHOPAL CIVIC MEMORY — EVIDENCE REGISTRY INTEGRITY AUDIT`);
  console.log(`======================================================================\n`);

  const stats = getEvidenceRegistryStats();
  console.log(`Total Ingested Records    : ${stats.totalRecords}`);
  console.log(`Primary External Records  : ${stats.primaryExternalCount}`);
  console.log(`Synthetic Demo Records    : ${stats.syntheticDemoCount}`);
  console.log(`----------------------------------------------------------------------`);
  console.log(`Breakdown by Source Type:`);
  Object.entries(stats.breakdownBySourceType).forEach(([type, count]) => {
    console.log(` - ${type.padEnd(25)}: ${count}`);
  });
  console.log(`======================================================================\n`);

  let passed = 0;
  let failed = 0;

  console.log(`DETAILED RECORD-BY-RECORD VALIDATION:`);
  console.log(`-----------------------------------------------------------------------------------------------------------------------------`);
  console.log(`ID                    | Type                 | Primary | Synthetic | URL Available | Date Available | Status`);
  console.log(`-----------------------------------------------------------------------------------------------------------------------------`);

  BHOPAL_EVIDENCE_REGISTRY.forEach((record) => {
    const hasSourceName = Boolean(record.source_name && record.source_name.trim().length > 0);
    const hasPubDate = Boolean(record.publication_date && record.publication_date.trim().length > 0);
    const hasUrl = Boolean(record.source_url && record.source_url.startsWith('http'));

    // Rule: Primary external sources must have verified URL and date
    let isValid = false;
    if (record.is_primary_source && !record.is_synthetic) {
      isValid = hasSourceName && hasPubDate && hasUrl;
    } else if (record.is_synthetic) {
      isValid = hasSourceName && hasPubDate && record.source_type === 'synthetic_demo';
    }

    if (isValid) {
      passed++;
    } else {
      failed++;
    }

    const status = isValid ? 'VALID ✓' : 'INVALID ✗';
    console.log(
      `${record.id.padEnd(21)} | ${record.source_type.padEnd(20)} | ${String(record.is_primary_source).padEnd(7)} | ${String(record.is_synthetic).padEnd(9)} | ${(hasUrl ? 'Yes' : 'None').padEnd(13)} | ${(hasPubDate ? record.publication_date : 'None')?.padEnd(14)} | ${status}`
    );
  });

  console.log(`-----------------------------------------------------------------------------------------------------------------------------\n`);
  console.log(`Audit Summary: ${passed} / ${BHOPAL_EVIDENCE_REGISTRY.length} records passed strict compliance check (${((passed / BHOPAL_EVIDENCE_REGISTRY.length) * 100).toFixed(1)}%).\n`);

  return { total: BHOPAL_EVIDENCE_REGISTRY.length, passed, failed };
}

if (require.main === module) {
  runEvidenceAudit();
}
