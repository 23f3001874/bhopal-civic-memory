# Bhopal Civic Memory — Supabase Setup Guide

This guide outlines the step-by-step procedure to provision and configure a live Supabase PostgreSQL database for Bhopal Civic Memory.

---

## 1. Create a Supabase Project

1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **New Project**.
3. Set **Project Name** to `bhopal-civic-memory`.
4. Choose a database password and select region (e.g., `South Asia (Mumbai)` for minimal latency to Bhopal).
5. Click **Create new project** and wait for database provisioning to complete.

---

## 2. Enable Required Extensions & Run Schema DDL

1. In your Supabase project dashboard, navigate to the **SQL Editor** tab on the left sidebar.
2. Click **New Query**.
3. Copy the entire contents of [`src/lib/supabase/schema.sql`](file:///C:/Users/91877/.gemini/antigravity/scratch/bhopal-civic-memory/src/lib/supabase/schema.sql) and paste it into the editor.
4. Click **Run**.
5. Verify that the following tables and extensions are created:
   - Extension: `uuid-ossp`
   - Table: `public.wards` (with 85 Wards / 19 Zones seed structure)
   - Table: `public.incidents` (with tracking tokens, categories, severity, recurrence fields, and coordinates)
   - Table: `public.ai_analyses` (with epistemic JSONB fields, external evidence, and hypotheses)
   - Table: `public.incident_timeline_events` (with immutable audit trail events)

---

## 3. Verify Row Level Security (RLS) Policies

Navigate to **Authentication** $\rightarrow$ **Policies** and verify that RLS is enabled:
- `wards`: Public can view all wards.
- `incidents`: Public can view all incidents, insert reports, and update corroboration/status.
- `ai_analyses`: Public can view and insert AI triage records.
- `incident_timeline_events`: Public can view and append audit trail records.

---

## 4. Retrieve API Credentials & Configure Environment

1. Navigate to **Project Settings** $\rightarrow$ **API**.
2. Copy the **Project URL** (e.g. `https://your-project.supabase.co`).
3. Copy the **anon / public** API Key (JWT).
4. Configure in `.env.local` (or Vercel Environment Variables):
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## 5. Verify Connectivity

Start the development server or build the application:
```bash
npm run build
npm run test:workflows
```

When Supabase is configured:
- Creating a report on `/report` persists records directly to the `incidents` table in Supabase.
- If Supabase credentials are not provided or network is offline, Bhopal Civic Memory automatically falls back to its deterministic in-memory store (`memoryStore`) without interruption.
