# Bhopal Civic Memory — Judge Demo Runbook

**Purpose**: A crisp, 90-second deterministic demonstration sequence for hackathon judges demonstrating why Bhopal Civic Memory transcends basic complaint-management ticketing by discovering historical recurrence roots and grounding AI in real external evidence.

---

## 1. Demo Reset Strategy

To ensure deterministic reproducibility before presenting:
1. Hard refresh your browser (`Ctrl + F5` or `Cmd + Shift + R`).
2. The initial seed state in `src/lib/data/mockIncidents.ts` contains:
   - `inc-001` (Bhojtal VIP Road Ramsar Wetland weed bloom)
   - `inc-002` (Taj-ul-Masajid North Gate historic masonry shift)
   - `inc-003` (MP Nagar Zone II Sargam Cinema chronic drainage cluster — **Featured Judge Demo**)
   - `inc-004` (Arera Colony E-7 Streetlight Feeder outage)
   - `inc-005` (Kolar Road Sarvadharma Bridge slab joint depression)

---

## 2. 90-Second Demo Sequence

### Step 1: Navigate to Intake Gateway (`/report`) — 0:00 to 0:20
- Point out the **Quick Demo Scenario Pre-Loader**.
- Click **`Scenario 1 (Featured Judge Demo): Sargam Cinema Drainage Waterlogging`**.
- Highlight that the system seamlessly accepts:
  - Hindi / Hinglish field text: *"Har baar halki baarish me bhi Sargam Cinema ke paas naala jam ho jata hai..."*
  - Ward & coordinate binding (MP Nagar Zone II, Ward 45).
  - Attached photographic evidence (waterlogging depth 38cm).
- Click **`Submit to Bhopal Civic Memory`**.

### Step 2: Civic Memory Match & Epistemic Triage (`/incidents/inc-003`) — 0:20 to 0:45
- Show the prominent **`RELATED CIVIC MEMORY FOUND`** banner.
- Explain: *"Rather than creating a 25th duplicate ticket, Civic Memory recognized this is part of a 7-report chronic recurrence cluster."*
- Point to the **Evidence Coverage (88%)** progress bar:
  - CPCB / MPPCB Lake Monitoring records.
  - IMD Bhopal urban runoff surge thresholds (>30mm/hr capacity limits).
  - Explicit `PRIMARY VERIFIED SOURCE` vs `SYNTHETIC / DEMO DATA` tags.
- Click the **`"Why?"`** button next to Inferences to reveal the auditable reasoning chain linking observations to IMD precipitation baselines.

### Step 3: Recurrence Analysis & Field Investigation Plan — 0:45 to 1:15
- Click **`Why is this recurring?`**:
  - Claude / Recurrence engine diagnoses the underlying physical mechanism: *Solid commercial plastic packaging entrapment at Patra Nallah tributary confluence*.
  - Points out competing alternative hypotheses and required uncertainty reduction data.
- Click **`Generate Field Investigation Plan`**:
  - Renders the structured non-destructive survey protocol (*endoscopic camera inspection, silt soundings, and pressure transducer checks*).
  - Shows explicit disclaimer: *"Civic Memory Field Investigation Plan (Not an official BMC work order)"*.

### Step 4: Resolution Verification (Claude Vision Audit) — 1:15 to 1:30
- Click **`Verify Resolution (After-Photo Audit)`**:
  - Compares Before & After evidence.
  - Returns `LIKELY RESOLVED (Model score: 0.92)` while explicitly noting remaining storm uncertainties (*subsurface silt capacity requires post-precipitation telemetry*).

---

## 3. Backup Plans & Reliability Protocols

| Failure Scenario | Fallback Behavior |
| :--- | :--- |
| **No Internet / Offline Demo** | In-memory store (`memoryStore`) + deterministic heuristics run locally without network requests. |
| **Anthropic API Rate Limit or Timeout** | Automatically falls back to deterministic heuristics with `is_simulated = true` and amber advisory notice. |
| **Supabase Project Paused** | In-memory database maintains full CRUD and incident transitions in browser local storage. |
| **After-Photo Missing** | Uncertainty Safety Gate automatically rejects verification with `insufficient_evidence` without crashing. |
