-- ============================================================================
-- Bhopal Civic Memory Database Schema (PostgreSQL / Supabase)
-- Production DDL for Civic Memory Incidents, Recurrence Profiles, AI Analyses,
-- Field Investigation Plans, PostGIS/Spatial Coordinates, and RLS Policies.
-- ============================================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- 1. WARDS TABLE (Bhopal Municipal Corporation 85 Wards / 19 Zones)
create table if not exists public.wards (
    id text primary key,
    code text not null unique,
    name text not null,
    zone integer not null,
    counselor_name text,
    health_index numeric default 85.0,
    latitude double precision not null,
    longitude double precision not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. INCIDENTS TABLE
create table if not exists public.incidents (
    id text primary key,
    tracking_token text not null unique, -- e.g. CM-BPL-2026-0792 (Civic Memory Token)
    title text not null,
    description text not null,
    category text not null check (category in (
        'lake_ecology', 'heritage_infrastructure', 'sanitation_waste', 
        'water_supply', 'road_hazard', 'drainage_flood', 
        'public_lighting', 'environmental'
    )),
    severity text not null check (severity in ('critical', 'high', 'medium', 'low')),
    status text not null default 'reported' check (status in (
        'reported', 'triaged', 'in_progress', 'verified', 'resolved', 'archived'
    )),
    ward_id text references public.wards(id) on delete set null,
    ward_name text not null,
    zone_number integer not null default 1,
    location_name text not null,
    landmark text,
    latitude double precision not null,
    longitude double precision not null,
    department_assigned text not null default 'Bhopal Municipal Corporation (BMC)',
    reporter_name text,
    reporter_phone_masked text,
    is_anonymous boolean not null default false,
    evidence_urls text[] default array[]::text[],
    image_base64 text,
    image_mime_type text,
    image_file_name text,
    upvotes integer default 1,
    corroboration_count integer default 1,
    tags text[] default array[]::text[],

    -- Civic Memory Recurrence Tracking
    recurrence_status text default 'isolated' check (recurrence_status in ('isolated', 'emerging_recurrent', 'chronic_failure')),
    related_reports_count integer default 1,
    related_reports jsonb default '[]'::jsonb,
    geographic_span text,
    previous_interventions jsonb default '[]'::jsonb,

    -- Field Plan & Resolution Verification
    field_investigation_plan jsonb,
    resolution_verification jsonb,

    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    resolved_at timestamp with time zone
);

-- 3. AI ANALYSES TABLE (Epistemic Triage Outputs)
create table if not exists public.ai_analyses (
    id uuid primary key default uuid_generate_v4(),
    incident_id text references public.incidents(id) on delete cascade not null,
    urgency_score integer not null check (urgency_score between 0 and 100),
    confidence_score numeric(3, 2) not null,
    suggested_department text not null,
    duplicate_risk_level text not null default 'none',
    ecological_impact_assessment text,
    observations jsonb default '[]'::jsonb,
    citizen_claims jsonb default '[]'::jsonb,
    evidence jsonb default '[]'::jsonb,
    external_evidence jsonb default '[]'::jsonb,
    inferences jsonb default '[]'::jsonb,
    root_cause_hypotheses jsonb default '[]'::jsonb,
    recommendations jsonb default '[]'::jsonb,
    uncertainty jsonb default '[]'::jsonb,
    evidence_coverage_percent integer default 85,
    is_simulated boolean not null default false,
    simulation_note text,
    model_used text,
    evidence_ids_used text[],
    ai_unavailable boolean not null default false,
    error_message text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. INCIDENT TIMELINE / IMMUTABLE AUDIT TRAIL
create table if not exists public.incident_timeline_events (
    id text primary key,
    incident_id text references public.incidents(id) on delete cascade not null,
    status text not null,
    author text not null,
    role text not null check (role in ('citizen', 'claude_ai', 'ward_officer', 'municipal_admin', 'field_crew')),
    note text not null,
    action_type text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.wards enable row level security;
alter table public.incidents enable row level security;
alter table public.ai_analyses enable row level security;
alter table public.incident_timeline_events enable row level security;

create policy "Public can view all wards" on public.wards for select using (true);
create policy "Public can view all incidents" on public.incidents for select using (true);
create policy "Public can insert incident reports" on public.incidents for insert with check (true);
create policy "Public can update incident records" on public.incidents for update using (true);
create policy "Public can view ai analyses" on public.ai_analyses for select using (true);
create policy "Public can insert ai analyses" on public.ai_analyses for insert with check (true);
create policy "Public can view timeline events" on public.incident_timeline_events for select using (true);
create policy "Public can add timeline events" on public.incident_timeline_events for insert with check (true);

-- 6. PERFORMANCE INDICES
create index if not exists idx_incidents_status on public.incidents(status);
create index if not exists idx_incidents_ward on public.incidents(ward_id);
create index if not exists idx_incidents_category on public.incidents(category);
create index if not exists idx_incidents_severity on public.incidents(severity);
create index if not exists idx_incidents_created_at on public.incidents(created_at desc);
create index if not exists idx_incidents_tracking_token on public.incidents(tracking_token);
create index if not exists idx_ai_analyses_incident_id on public.ai_analyses(incident_id);
create index if not exists idx_timeline_incident_id on public.incident_timeline_events(incident_id);
