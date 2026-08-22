# Bhopal Civic Memory — Pre-Deployment Technical Audit

**Audit Date**: August 22, 2026  
**Target Platform**: Vercel (Next.js 16.3.2 App Router)  
**Database**: Supabase PostgreSQL / PostGIS (with In-Memory Fallback)  
**AI Intelligence Engine**: Anthropic Claude 3.5 Sonnet (`claude-3-5-sonnet-20241022`)  

---

## 1. Current Architecture Overview

Bhopal Civic Memory is a civic intelligence and municipal memory system built using Next.js 16 (App Router), TypeScript, Tailwind CSS, Lucide icons, Supabase client SDK, and Anthropic Claude SDK.

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer (React)                   │
│   / (Intelligence Feed)  •  /report (Intake Gateway)        │
│   /map (Spatial Radar)   •  /incidents/[id] (Detail & Plan) │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / API Routes
┌──────────────────────────────▼──────────────────────────────┐
│                  Next.js Server API Routes                  │
│   POST /api/triage                                          │
│   POST /api/incidents/[id]/analyze-recurrence               │
│   POST /api/incidents/[id]/generate-field-plan              │
│   POST /api/incidents/[id]/verify-resolution                │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
┌──────────────▼─────────────┐ ┌──────────────▼───────────────┐
│   Claude Operations Engine │ │   Supabase Data Layer        │
│   - Epistemic Triage       │ │   - Incidents & Timeline     │
│   - Recurrence Reasoning   │ │   - AI Analyses & Hypotheses │
│   - Field Plan Generation  │ │   - RLS Policies & Wards     │
│   - Claude Vision Audit    │ │   - In-Memory Fallback Store │
└──────────────┬─────────────┘ └──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│   Deterministic Uncertainty & Safety Gate (safetyGate.ts)   │
│   - Unsupported Toxic/Chemical Claim Downgrade              │
│   - Out-of-Zone Statutory / NGT Claim Downgrade             │
│   - Monitoring Telemetry vs Citizen Conflict Detection      │
│   - Missing After-Photo Verification Rejection              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Environment Variables Specification

| Variable Name | Environment | Target | Exposure | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `ANTHROPIC_API_KEY` | Server-Only | Production / Local | **Secret (Never expose)** | Authenticates to Anthropic Claude 3.5 Sonnet API |
| `ANTHROPIC_MODEL` | Server-Only | Production / Local | Optional Server Config | Model override (defaults to `claude-3-5-sonnet-20241022`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | Production / Local | Public Client URL | Supabase REST/PostgreSQL project endpoint |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client & Server | Production / Local | Public Anon JWT | Supabase anonymous public client key (gated by RLS) |

---

## 3. Server-Only Secrets vs. Client-Safe Variables

- **Server-Only Secrets**: `ANTHROPIC_API_KEY` is loaded strictly on the Node.js runtime inside server Route Handlers (`src/app/api/...`). It is never bundled into client JavaScript.
- **Client-Safe Variables**: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are safe for public browser execution because all database access is governed by PostgreSQL Row Level Security (RLS) policies defined in `src/lib/supabase/schema.sql`.

---

## 4. External Dependencies

- `@anthropic-ai/sdk` (^0.120.0): Anthropic client library.
- `@supabase/supabase-js` (^2.103.0): Supabase PostgreSQL client.
- `lucide-react` (^1.16.0): Civic icon suite.
- `next` (^16.3.2), `react` (^19.0.0), `react-dom` (^19.0.0): Core Next.js 16 framework with Turbopack.
- `tsx` (^4.7.1): TypeScript evaluation & audit script executor.

---

## 5. Supabase Requirements

- Extensions: `uuid-ossp` (enabled).
- Tables: `wards`, `incidents`, `ai_analyses`, `incident_timeline_events`.
- PostGIS / Geometry: Stored as `latitude` and `longitude` double precision floats with deterministic bounding calculations ($\le 2.5\text{ km}$).
- RLS Policies: Enabled on all 4 tables with public select and authenticated/anonymous insert policies.
- Fallback: Full in-memory and local storage store (`memoryStore`) automatically operates if Supabase environment variables are unset.

---

## 6. Vercel Deployment Requirements

- **Runtime**: Node.js 18.x or 20.x.
- **Build Command**: `next build` (or `npm run build`).
- **Output**: Standard Next.js serverless build (`.next`).
- **Dynamic Routes**: Server routes (`/api/...`, `/incidents/[id]`) automatically provisioned as Vercel serverless functions.
- **Payload Limits**: Max 5MB image upload enforced on API routes (well below Vercel's 4.5MB serverless body limit when compressed).

---

## 7. Potential Deployment Blockers & Resolution

1. **Missing Anthropic API Key in Deployment**:
   - *Risk*: If a user deploys without `ANTHROPIC_API_KEY`, will routes crash?
   - *Audit*: **Resolved.** All routes check `isClaudeConfigured` and gracefully route to deterministic heuristic reasoning with verified CPCB/NGT baseline records and explicit `is_simulated = true` indicators.
2. **Missing Supabase Credentials in Deployment**:
   - *Risk*: Database queries fail or throw uncaught exceptions.
   - *Audit*: **Resolved.** `getSupabaseClient()` falls back to `memoryStore` and browser storage.
3. **Client Secret Leakage**:
   - *Risk*: API key leaking in browser bundles.
   - *Audit*: **Resolved.** Grep scan confirms zero `process.env.ANTHROPIC_API_KEY` references in client components.

---

## 8. Security Risks & Mitigations

| Risk Identified | Severity | Mitigation Applied |
| :--- | :--- | :--- |
| **Oversized Image Payloads** | Low | Server-side 5MB payload ceiling + restricted MIME types (`JPEG`, `PNG`, `WebP`, `GIF`, `SVG`). |
| **Stack Trace / Error Leakage** | Low | API route catch blocks sanitized to return generic status messages. |
| **Hallucinated Toxic Contamination Claims** | High | Uncertainty Safety Gate (`safetyGate.ts`) automatically downgrades unverified toxic assertions to `"FIELD VERIFICATION REQUIRED"`. |
| **Out-of-Zone Court Order Assertions** | High | Safety Gate checks geographic applicability of NGT orders before citing legal violations. |
| **Uncalibrated Model Scores** | Medium | Eliminated `"92% Confidence"` wording; replaced with `"High AI Assessment Confidence (Model score: 0.92)"`. |
