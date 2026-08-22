# Bhopal Civic Memory — Vercel Deployment Guide

This guide provides step-by-step instructions to deploy **Bhopal Civic Memory** to Vercel for production and hackathon judging.

---

## 1. Prerequisites

- [Node.js 18.x or 20.x](https://nodejs.org/)
- [Vercel Account](https://vercel.com)
- [GitHub Account](https://github.com)
- Anthropic API Key (Optional for live mode; fallback mode runs without it)
- Supabase Project URL & Anon Key (Optional; in-memory fallback runs without it)

---

## 2. Deploy Option A: Vercel Web Dashboard (Recommended)

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Deploy Bhopal Civic Memory"
   git remote add origin https://github.com/<your-username>/bhopal-civic-memory.git
   git branch -M main
   git push -u origin main
   ```
2. Log in to [Vercel Dashboard](https://vercel.com).
3. Click **Add New...** $\rightarrow$ **Project**.
4. Import the `bhopal-civic-memory` GitHub repository.
5. In **Configure Project**:
   - **Framework Preset**: Next.js (automatically detected)
   - **Root Directory**: `./`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
6. Expand **Environment Variables** and add:
   - `ANTHROPIC_API_KEY`: `sk-ant-api03-...` (Your Claude API key)
   - `ANTHROPIC_MODEL`: `claude-3-5-sonnet-20241022`
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1...`
7. Click **Deploy**.

---

## 3. Deploy Option B: Vercel CLI

1. Authenticate with Vercel CLI:
   ```bash
   vercel login
   ```
2. Link and deploy the project:
   ```bash
   vercel
   ```
3. Set environment variables on Vercel:
   ```bash
   vercel env add ANTHROPIC_API_KEY
   vercel env add ANTHROPIC_MODEL
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
4. Deploy to production:
   ```bash
   vercel --prod
   ```

---

## 4. Post-Deployment Smoke Test Checklist

Once the deployment URL is active (e.g. `https://bhopal-civic-memory.vercel.app`):
- [ ] **Home Page (`/`)**: Verify intelligence feed, spatial radar widget, and metrics bar load.
- [ ] **Report Page (`/report`)**: Verify One-Click Demo Scenario Selector pre-loads Hindi/Hinglish text and photo.
- [ ] **Triage & Deduplication (`/api/triage`)**: Submit Scenario 1 and verify redirect to `/incidents/inc-003`.
- [ ] **Civic Memory Match Banner**: Verify `RELATED CIVIC MEMORY FOUND` banner displays 7 linked reports.
- [ ] **Evidence Layer**: Verify CPCB NWMP and NGT links render with Evidence Coverage metric.
- [ ] **Recurrence Analysis**: Click *"Why is this recurring?"* $\rightarrow$ verify root-cause hypotheses render.
- [ ] **Field Plan**: Click *"Generate Field Investigation Plan"* $\rightarrow$ verify non-authoritative plan renders.
- [ ] **Resolution Verification**: Click *"Verify Resolution"* $\rightarrow$ verify before vs after photo audit.
- [ ] **Map Page (`/map`)**: Verify interactive spatial radar pins for all 7 Bhopal wards.

---

## 5. Troubleshooting & Rollback

- **Anthropic API Rate Limits / Timeouts**: The application automatically catches API timeouts and routes to deterministic heuristic simulation with `is_simulated: true`.
- **Database Connectivity**: If Supabase credentials are misconfigured, the in-memory fallback store maintains full app functionality.
- **Rollback in Vercel**: Navigate to **Deployments** tab in Vercel, select the previous working deployment, and click **Promote to Production**.
