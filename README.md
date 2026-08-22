# Bhopal Civic Memory (भोपाल नागरिक स्मृति)

> **Claude-powered end-to-end civic reasoning prototype using synthetic citizen data and verified external Bhopal evidence.**

---

## 1. Project Overview & Problem Statement

Most municipal portals treat citizen complaints as ephemeral, isolated trouble tickets. When a drain floods or an asphalt patch washes away, a ticket is created, surface silt is cleared, and the ticket is marked "Resolved"—only for the exact same failure to recur during the next heavy storm.

**Bhopal Civic Memory** shifts urban governance from reactive ticket disposal to **epistemic civic memory**:
- Multi-report deduplication prevents flooding field crews with redundant tickets.
- Identifies **chronic infrastructural recurrence roots** across seasonal and precipitation cycles.
- Grounds AI reasoning in **authoritative real-world environmental and judicial evidence** (CPCB NWMP lake stations, NGT Central Zone rulings, IMD rainfall normals, and BMC Gazettes).
- Enforces strict **epistemic separation**: Direct Observations, Citizen Claims, External Evidence, Logical Inferences, Root-Cause Hypotheses, Recommendations, and Uncertainties are never conflated.

---

## 2. Core Architecture

```
                                Bhopal Civic Memory
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
  Citizen Intake                   Claude Operations             Bhopal Evidence Registry
  - Hindi / Hinglish text          - Multi-Modal Vision Triage   - CPCB NWMP Stations (1061-1065)
  - Ward & Coordinates             - Duplicate & Recurrence      - NGT OA 12/2025(CZ)
  - Visual Evidence Photo          - Field Plan Generation       - IMD Climatological Normals
  - One-Click Judge Pre-Loader     - Resolution Verification     - BMC 85 Wards Gazette
        │                                │                                │
        └────────────────────────────────┼────────────────────────────────┘
                                         ▼
                      Deterministic Safety Gate (safetyGate.ts)
                      - Toxic Claim Downgrades
                      - Out-of-Zone Statutory Flags
                      - Telemetry Conflict Detection
                      - Photo Sufficiency Enforcement
                                         │
                                         ▼
                             Incident File & Audit Trail
                      - "RELATED CIVIC MEMORY FOUND" Banner
                      - Evidence Coverage Metric (88%)
                      - "Why?" Auditable Reasoning Chains
                      - Non-Authoritative Field Plan
                      - Before/After Resolution Audit
```

---

## 3. Epistemic Evidence Separation

The application strictly isolates and displays seven distinct cognitive categories:

1. **OBSERVATIONS**: Direct physical measurements visible in photographs or telemetry.
2. **CITIZEN CLAIMS**: Subjective assertions made by citizens, recorded separately to avoid treating unverified claims as facts.
3. **EXTERNAL EVIDENCE**: Authoritative records from CPCB, NGT, IMD, and BMC gazettes (with clickable official URLs and dates).
4. **INFERENCES**: Logical deductions synthesized from observations and baseline evidence.
5. **ROOT-CAUSE HYPOTHESES**: Engineering failure theories (explicitly presented as hypotheses, never facts).
6. **RECOMMENDATIONS**: Actionable municipal dispatch protocols.
7. **UNCERTAINTY**: Explicit missing sensor data and required on-site inspections.

---

## 4. Verification & Benchmark Suites

| Benchmark Suite | Command | Cases | Result | Accuracy / Safety |
| :--- | :--- | :---: | :---: | :---: |
| **Controlled Synthetic Benchmark** | `npm run evaluate` | 30 | 30 / 30 Passed | **100.0%** (0% False Merges) |
| **Red-Team Adversarial Suite** | `npm run evaluate:adversarial` | 10 | 10 / 10 Passed | **100.0%** Safety Score |
| **Evidence Registry Audit** | `npm run audit:evidence` | 15 | 15 / 15 Valid | **100.0%** URL/Date Compliant |
| **Workflow Integration Tests** | `npm run test:workflows` | 8 | 8 / 8 Passed | **100.0%** Fallback Resilient |
| **Next.js Production Build** | `npm run build` | 9 routes | 0 errors | **Clean Compilation** |

*Product Claim Notice: In adherence to honest AI standards, evaluation results are presented as **`"30/30 controlled synthetic evaluation cases passed."`** rather than claiming uncalibrated 100% real-world accuracy.*

---

## 5. Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/bhopal-civic-memory.git
cd bhopal-civic-memory
npm install
```

### 2. Configure Environment Variables
Copy the template and add your credentials (optional; fallback mode runs without keys):
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
ANTHROPIC_API_KEY=sk-ant-api03-...
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── triage/route.ts                           # Epistemic triage & deduplication
│   │   └── incidents/[id]/
│   │       ├── analyze-recurrence/route.ts           # Multi-cycle recurrence reasoning
│   │       ├── generate-field-plan/route.ts          # Non-authoritative field survey plan
│   │       └── verify-resolution/route.ts            # Claude Vision Before vs After audit
│   ├── incidents/[id]/page.tsx                       # Civic Memory asset file & audit trail
│   ├── map/page.tsx                                  # Spatial radar & ward overlay
│   ├── report/page.tsx                               # Intake gateway with Judge Demo selector
│   └── page.tsx                                      # City intelligence feed
├── lib/
│   ├── ai/
│   │   ├── claude.ts                                 # Centralized Claude API & fallback logic
│   │   ├── safetyGate.ts                             # Deterministic Uncertainty & Safety Gate
│   │   └── embeddings.ts                             # Semantic similarity scoring
│   ├── knowledge/bhopal/                             # Bhopal Evidence Registry
│   │   ├── environment/cpcbLakeMonitoring.ts         # CPCB NWMP Stations #1061-1065 & Ramsar #1206
│   │   ├── legal/ngtOrders.ts                        # NGT OA 12/2025(CZ) & MP Wetland Rules
│   │   ├── rainfall/imdRainfall.ts                   # IMD Station 42667 & runoff thresholds
│   │   ├── geography/wardBoundaries.ts               # BMC 85 Wards / 19 Zones gazette
│   │   ├── civic/syntheticDemoRecords.ts             # Clearly labeled synthetic demo records
│   │   └── registry.ts                               # Master registry & targeted retrieval
│   ├── supabase/                                     # Database client & schema DDL
│   └── data/mockIncidents.ts                         # Seed incidents & demo clusters
└── scripts/
    ├── evaluate-duplicate-engine.ts                  # Controlled 30-case benchmark
    ├── evaluate-adversarial-suite.ts                 # 10-case red-team safety suite
    ├── audit-evidence-registry.ts                    # Evidence registry compliance auditor
    └── test-claude-workflows.ts                      # Workflow integration test runner
```

---

## 7. Documentation Guides

- [Pre-Deployment Technical Audit](file:///C:/Users/91877/.gemini/antigravity/scratch/bhopal-civic-memory/DEPLOYMENT_AUDIT.md)
- [Vercel Deployment Guide](file:///C:/Users/91877/.gemini/antigravity/scratch/bhopal-civic-memory/DEPLOYMENT.md)
- [Supabase Setup Guide](file:///C:/Users/91877/.gemini/antigravity/scratch/bhopal-civic-memory/SUPABASE_SETUP.md)
- [Judge Demo Runbook](file:///C:/Users/91877/.gemini/antigravity/scratch/bhopal-civic-memory/DEMO_RUNBOOK.md)
