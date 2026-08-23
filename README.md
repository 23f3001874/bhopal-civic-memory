# Bhopal Civic Memory (भोपाल नागरिक स्मृति)

> **A city should remember what keeps happening.**  
> An epistemic civic intelligence system that transforms recurring citizen complaints into persistent institutional memory, verified by grounded evidence and Claude reasoning.

---

## 1. The Problem: Cities Have No Memory

Bhopal does not have a complaint problem. It has a **memory problem**.

In standard municipal grievance portals:
1. A citizen reports a flooded culvert near Sargam Cinema.
2. A municipal dispatch team clears surface debris and marks the ticket **Resolved**.
3. Three weeks later, the next heavy storm hits, and the culvert floods again.
4. Another citizen files a new ticket. The system treats it as a brand-new complaint.
5. The city pays for six temporary cleanouts in a single monsoon without ever investigating the sub-surface hydraulic gradient.

```text
Conventional Grievance Flow:
Citizen ──▶ Complaint ──▶ Ticket ──▶ Dispatch ──▶ "Resolved" ──▶ FORGET ──▶ Starts from Zero

Bhopal Civic Memory Flow:
Citizen Report ──▶ Bounded Spatial Retrieval ──▶ RELATED CIVIC MEMORY FOUND
                         │
                         ├──▶ Epistemic Triage (Observation ≠ Claim ≠ Evidence)
                         ├──▶ Temporal Recurrence Diagnosis ("Why does this keep happening?")
                         ├──▶ Targeted Field Investigation Packet (Invert slope check)
                         ├──▶ Photographic Resolution Audit (Claude Vision Before/After)
                         └──▶ PERSISTENT INSTITUTIONAL MEMORY (Accumulates over cycles)
```

---

## 2. Complete Technical Architecture

```text
                                  CITIZEN INTAKE
                  (Hindi / Hinglish / English Text + Coordinates + Photo)
                                         │
                                         ▼
                   ┌───────────────────────────────────────────┐
                   │       DETERMINISTIC RETRIEVAL & SAFETY    │
                   │              (lib/ai/safetyGate.ts)       │
                   │  • Spatial-temporal ward candidate filter │
                   │  • Out-of-zone statutory boundary check   │
                   │  • Toxic / speculative claim quarantine   │
                   │  • Optical sufficiency verification       │
                   └─────────────────────┬─────────────────────┘
                                         │
                          Bounded Candidate Packet + Evidence
                                         │
                                         ▼
                   ┌───────────────────────────────────────────┐
                   │          CLAUDE REASONING ENGINE          │
                   │       (claude-sonnet-4-5-20250929)        │
                   │                                           │
                   │  1. Epistemic Triage & Claim Decomposition│
                   │  2. Civic Memory Recurrence Clustering    │
                   │  3. Field Investigation Plan Generation   │
                   │  4. Claude Vision Resolution Audit        │
                   └─────────────────────┬─────────────────────┘
                                         │
                         Validated Epistemic Output
                                         │
                                         ▼
                   ┌───────────────────────────────────────────┐
                   │          GROUNDED KNOWLEDGE LAYER         │
                   │                                           │
                   │  • CPCB NWMP Water Quality Baselines      │
                   │  • IMD Climatological Precipitation Data  │
                   │  • NGT Central Zone Environmental Rulings │
                   │  • BMC 85-Ward Boundary & Elevation Grid  │
                   └─────────────────────┬─────────────────────┘
                                         │
                                         ▼
                   ┌───────────────────────────────────────────┐
                   │        INCIDENT DOSSIER & PERSISTENCE     │
                   │                                           │
                   │  • Persistent Incident Dossier (/incidents)│
                   │  • Geospatial Operations Console (/map)   │
                   │  • Real-Time Intelligence Feed (/)        │
                   │  • Supabase PostgreSQL / Hybrid Store     │
                   └───────────────────────────────────────────┘
```

---

## 3. Four Epistemic Capabilities

### 01 / Multilingual Intake & Epistemic Separation
Citizens describe issues in natural language (Hindi, Hinglish, or English):
> *"Har baar halki baarish mein bhi Sargam Cinema ke paas nala jam ho jata hai."*

Claude decomposes the input into seven strict epistemic dimensions so human operators never mistake citizen speculation for verified fact:
* **Direct Observation**: Surface water level reaching 40cm across the carriageway.
* **Citizen Claim**: Sump capacity is inadequate.
* **External Evidence**: CPCB station data confirms high siltation index during monsoons.
* **Reasoned Inference**: Runoff velocity exceeds culvert intake capacity.
* **Root-Cause Hypothesis**: Invert slope degraded by 12% below original hydraulic blueprint.
* **Uncertainty**: Sub-surface conduit structural integrity cannot be verified without physical CCTV probe.

### 02 / Bounded Recurrence Matching
To prevent hallucinations and reduce token waste, Claude is **never handed the entire civic database**:
1. The system programmatically narrows historical incidents down to a tight candidate set using geospatial proximity ($< 150\text{m}$), ward boundaries, temporal windows, and domain taxonomy.
2. Claude evaluates this small candidate packet to determine whether the report represents:
   - A **Duplicate Report** (same ongoing occurrence),
   - A **Recurrence Cycle** (chronic failure returning after past intervention), or
   - A **Distinct Incident** (unrelated physical issue in the same neighborhood).

### 03 / Municipal Field Investigation Packets
Instead of a vague *"Please inspect"* dispatch ticket, the system generates an actionable engineering investigation packet:
* **Specific Inspection Points**: Culvert intake grate, junction manhole #4, outfall invert level.
* **Required Tools**: Silt depth gauge, digital level meter, pipe CCTV camera.
* **Safety Protocols**: Toxic gas detection ($H_2S / CH_4$) prior to subterranean inspection.
* **Deterministic Safety Warning**: Flagged as a decision-support hypothesis requiring human engineering sign-off.

### 04 / Vision-Audited Resolution
When a municipal contractor submits a "Resolved" photo:
* Claude Vision compares the **Before** and **After** photographs.
* Evaluates debris removal, drainage clearance, and structural reinstatement.
* Emits an explicit **Uncertainty Flag** if subterranean pipe flow or hydraulic performance remains unverified by surface photography alone.

---

## 4. Grounded Bhopal Evidence Registry

Every AI hypothesis is grounded against verified external baselines loaded in `src/lib/knowledge/bhopal/`:

| Source Authority | Dataset / Record | Purpose in System |
| :--- | :--- | :--- |
| **CPCB / MPPCB** | NWMP Water Quality Stations (1061–1065) | Dissolved Oxygen & BOD baselines for Bhoj Wetland catchment |
| **IMD Bhopal** | Climatological Rain Normals (Bairagarh Station) | Precipitation return thresholds ($> 45\text{mm/hr}$ extreme event triggers) |
| **NGT Central Zone** | OA 12/2025(CZ) Buffer Zone Injunctions | Enforcing non-encroachment boundaries along Upper & Lower Lake |
| **BMC Gazette** | 85-Ward Boundary & Elevation Grid | Validating ward jurisdiction and stormwater outfall alignments |

---

## 5. Deterministic Safety Gates (`safetyGate.ts`)

Before any AI output reaches human operators, it passes through programmatic safety checks:
1. **Jurisdiction Gate**: Rejects or flags coordinates outside BMC's 85-ward statutory boundary.
2. **Toxic Claim Gate**: Strips unverified personal accusations or inflammatory claims from citizen text while preserving physical failure descriptions.
3. **Contradiction Gate**: Flags whenever citizen claims conflict with live CPCB/IMD telemetry (e.g., reporting drought when precipitation is at $60\text{mm}$).
4. **Optical Sufficiency Gate**: Rejects blurry or black images submitted as resolution proof before invoking Claude Vision.

---

## 6. Project Structure

```text
bhopal-civic-memory/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Warm editorial landing page + Live Intelligence feed
│   │   ├── report/page.tsx             # Multilingual citizen intake terminal
│   │   ├── map/page.tsx                # Geospatial intelligence operations console
│   │   ├── incidents/[id]/page.tsx     # Full Epistemic Incident Dossier & Reasoning Chain
│   │   └── api/
│   │       ├── triage/route.ts         # Live Claude multilingual triage endpoint
│   │       └── incidents/[id]/
│   │           ├── analyze-recurrence/ # Claude temporal recurrence matching
│   │           ├── generate-field-plan/# Municipal field investigation generator
│   │           └── verify-resolution/  # Claude Vision before/after resolution audit
│   ├── components/
│   │   ├── layout/CivicShell.tsx       # Floating glass navigation & dynamic context header
│   │   └── ui/
│   │       ├── CivicMapCanvas.tsx      # SVG Bhojtal wetland map & interactive hotspot radar
│   │       ├── IncidentCard.tsx        # High-density telemetry card format
│   │       └── StatusBadge.tsx         # Epistemic & severity indicators
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── claude.ts               # Anthropic SDK client & typed prompt schemas
│   │   │   ├── safetyGate.ts           # Deterministic programmatic safety checks
│   │   │   └── embeddings.ts           # Semantic candidate ranking
│   │   ├── knowledge/bhopal/           # Verified CPCB, NGT, IMD & BMC baselines
│   │   └── supabase/                   # PostgreSQL schema, migrations, and service client
└── public/
    ├── bhojtal-landscape.png           # Visual anchor: Bhojtal Upper Lake at golden hour
    └── bhopal-map-clean.jpg            # Spatial grid & satellite basemap
```

---

## 7. Quick Start & Local Setup

### Prerequisites
* Node.js 18+ or 20+
* npm or pnpm
* Anthropic API Key (`claude-sonnet-4-5-20250929`)

### 1. Clone & Install
```bash
git clone https://github.com/23f3001874/bhopal-civic-memory.git
cd bhopal-civic-memory
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
ANTHROPIC_API_KEY=sk-ant-api03-...
ANTHROPIC_MODEL=claude-sonnet-4-5-20250929

# Optional: Supabase credentials (falls back automatically to in-memory verified mock store)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 8. Live Demonstration Scenario (Sargam Cinema, Ward 45)

To evaluate the full epistemic workflow in under 60 seconds:
1. Navigate to **`/report`**.
2. Click **"Load Sargam Cinema Drainage Scenario"** (pre-loads Hindi intake text, Ward 45 coordinates, and culvert photo).
3. Submit the report. Notice the real-time execution:
   * Claude extracts observations and bounds them to CPCB NWMP Station #1062.
   * Identifies **`RELATED CIVIC MEMORY FOUND`**: 7 previous reports across 11 months and 2 failed desilting interventions.
   * Generates a 5-point root-cause hypothesis explaining why the culvert invert slope chokes under rainfall $> 30\text{mm/hr}$.
   * Creates an actionable engineering field packet with toxic gas safety checks.
   * Evaluates contractor before/after photos via **Claude Vision**, marking the surface clear while noting sub-surface performance remains unverified.

---

## 9. Evaluation & Adversarial Hardening

The repository includes an automated evaluation test suite in `src/lib/data/adversarialDataset.ts`:
* **Adversarial Prompt Injection**: Attempting to force Claude into authorizing budget payouts or bypassing municipal engineer sign-offs → *Deterministic safety gate overrides with 100% rejection*.
* **Hallucination Resistance**: Fabricated lake stations outside Bhopal → *Strictly rejected against the verified knowledge registry*.
* **Telemetry Contradiction**: Claiming severe drought during a logged 50mm storm → *Flagged with contradictory telemetry alert*.

---

## 10. License & Credits

Built for the **Claude Impact Lab** — focused on solving real-world civic challenges in Bhopal through grounded, non-hallucinatory AI reasoning.

* **Author**: Team NavDisha / Bhopal Civic Memory
* **Production Deployment**: [https://bhopal-civic-memory.vercel.app](https://bhopal-civic-memory.vercel.app)
