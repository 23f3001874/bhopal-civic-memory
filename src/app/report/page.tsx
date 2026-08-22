'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCivic } from '@/lib/context/CivicContext';
import { IncidentCategory, IncidentSeverity } from '@/types/incident';
import {
  Camera,
  MapPin,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Send,
  RefreshCw,
  CheckCircle2,
  BookmarkCheck,
  Sparkles
} from 'lucide-react';

const CATEGORIES: { id: IncidentCategory; label: string; icon: string; desc: string }[] = [
  { id: 'drainage_flood', label: 'Drainage & Flood', icon: '🌊', desc: 'Waterlogging, choked sumps, nallah backflow' },
  { id: 'lake_ecology', label: 'Lake Ecology', icon: '🪷', desc: 'Bhojtal, weed choke, wetland runoff' },
  { id: 'heritage_infrastructure', label: 'Heritage Infrastructure', icon: '🏛️', desc: 'Old City gates, stone masonry, historic structures' },
  { id: 'road_hazard', label: 'Roads & Bridges', icon: '🚧', desc: 'Potholes, exposed rebar, pavement depression' },
  { id: 'sanitation_waste', label: 'Sanitation & Solid Waste', icon: '🗑️', desc: 'Uncollected refuse, commercial debris' },
  { id: 'public_lighting', label: 'Public Lighting', icon: '💡', desc: 'Streetlight feeder outage, corridor blackout' }
];

const SEVERITIES: { id: IncidentSeverity; label: string; desc: string }[] = [
  { id: 'critical', label: 'Critical', desc: 'Active hazard to life or major infrastructure' },
  { id: 'high', label: 'High Priority', desc: 'Severe disruption requiring 24h response' },
  { id: 'medium', label: 'Standard', desc: 'Routine municipal maintenance queue' },
  { id: 'low', label: 'Minor / Advisory', desc: 'Non-urgent observation or preventive maintenance' }
];

interface DemoScenario {
  id: string;
  name: string;
  badge: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  wardId: string;
  locationName: string;
  landmark: string;
  title: string;
  description: string;
  imageSample: string;
  isHindi: boolean;
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'demo-sargam-drainage',
    name: 'Featured Demo: Sargam Cinema Chronic Drainage Recurrence',
    badge: 'Hindi / Hinglish • Recurring Cluster',
    category: 'drainage_flood',
    severity: 'high',
    wardId: 'ward-45',
    locationName: 'MP Nagar Zone II Sargam Road Crossing',
    landmark: 'Behind Bank of Baroda Regional Office',
    title: 'Sargam Cinema crossroad par naala fir se overflow ho gaya hai',
    description: 'Har baar halki baarish me bhi Sargam Cinema ke paas naala jam ho jata hai aur sadak par 1.5 foot paani bhar jata hai. Pehle suction jetting machine aayi thi par commercial plastic kachra fir se fas gaya hai.',
    imageSample: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="350" viewBox="0 0 600 350"><rect width="600" height="350" fill="%230f172a"/><rect x="50" y="180" width="500" height="120" fill="%231e293b"/><path d="M50 240 Q150 210 250 240 T450 240 T550 240 L550 300 L50 300 Z" fill="%230284c7" opacity="0.7"/><text x="300" y="100" fill="%2338bdf8" font-family="monospace" font-size="16" font-weight="bold" text-anchor="middle">PHOTOGRAPHIC EVIDENCE: MP NAGAR ZONE II DRAINAGE</text><text x="300" y="140" fill="%2394a3b8" font-family="monospace" font-size="12" text-anchor="middle">Sargam Cinema Sump Overflow - 38cm Water Depth Submergence</text><circle cx="300" cy="240" r="30" fill="%23ef4444" opacity="0.5"/><text x="300" y="245" fill="%23ffffff" font-family="monospace" font-size="10" text-anchor="middle">CHOKED INLET</text></svg>',
    isHindi: true
  },
  {
    id: 'demo-bhojtal-culvert',
    name: 'Scenario 2: Bhojtal VIP Road Water Hyacinth Bloom',
    badge: 'Ramsar Wetland #1206',
    category: 'lake_ecology',
    severity: 'critical',
    wardId: 'ward-07',
    locationName: 'VIP Road Khanoo Gaon Inflow, Bhojtal',
    landmark: 'Opposite Raja Bhoj Statue Causeway',
    title: 'Water hyacinth weed mat choking Khanoo Gaon inlet culvert',
    description: 'Dense green hyacinth weed mat and plastic debris completely obstructing the 1.2m culvert inlet into Upper Lake. Risk of dissolved oxygen drop ahead of monsoon crest.',
    imageSample: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="350" viewBox="0 0 600 350"><rect width="600" height="350" fill="%23022c22"/><rect x="50" y="160" width="500" height="140" fill="%23064e3b"/><path d="M50 220 Q180 180 300 220 T550 220 L550 300 L50 300 Z" fill="%2310b981" opacity="0.6"/><text x="300" y="90" fill="%2334d399" font-family="monospace" font-size="16" font-weight="bold" text-anchor="middle">ECOLOGICAL EVIDENCE: BHOJTAL CATCHMENT (RAMSAR #1206)</text><text x="300" y="130" fill="%23a7f3d0" font-family="monospace" font-size="12" text-anchor="middle">VIP Road Khanoo Gaon Culvert - Eichhornia Crassipes Mat</text></svg>',
    isHindi: false
  },
  {
    id: 'demo-taj-gate',
    name: 'Scenario 3: Taj-ul-Masajid North Gate Masonry Shift',
    badge: 'Heritage Zone 1 Alert',
    category: 'heritage_infrastructure',
    severity: 'high',
    wardId: 'ward-12',
    locationName: 'Taj-ul-Masajid Northern Gate Arcade',
    landmark: 'Near Motia Talab walkway',
    title: 'Sandstone cornice crumbling at Taj-ul-Masajid north archway',
    description: 'Dressed red sandstone block shifted ~15mm outward on the 3rd archway course after overnight rain. Mortar flaking is active above public walkway.',
    imageSample: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="350" viewBox="0 0 600 350"><rect width="600" height="350" fill="%233b0764"/><rect x="150" y="100" width="300" height="200" fill="%23581c87"/><circle cx="300" cy="180" r="80" fill="%231e1b4b"/><text x="300" y="70" fill="%23d8b4fe" font-family="monospace" font-size="16" font-weight="bold" text-anchor="middle">HERITAGE EVIDENCE: TAJ-UL-MASAJID NORTH GATE</text><text x="300" y="320" fill="%23e9d5ff" font-family="monospace" font-size="12" text-anchor="middle">Dressed Red Sandstone Mortar Separation Joint</text></svg>',
    isHindi: false
  }
];

export default function ReportPage() {
  const router = useRouter();
  const { wards } = useCivic();

  const [category, setCategory] = useState<IncidentCategory>('drainage_flood');
  const [severity, setSeverity] = useState<IncidentSeverity>('high');
  const [wardId, setWardId] = useState<string>('ward-45');
  const [locationName, setLocationName] = useState<string>('Zone II Junction near Sargam Cinema Road');
  const [landmark, setLandmark] = useState<string>('Behind Bank of Baroda Regional Office');
  const [title, setTitle] = useState<string>('Sargam Cinema crossroad par naala fir se overflow ho gaya hai');
  const [description, setDescription] = useState<string>(
    'Har baar halki baarish me bhi Sargam Cinema ke paas naala jam ho jata hai aur sadak par 1.5 foot paani bhar jata hai. Pehle suction jetting machine aayi thi par commercial plastic kachra fir se fas gaya hai.'
  );
  const [reporterName, setReporterName] = useState<string>('Vikram Joshi');
  const [reporterPhone, setReporterPhone] = useState<string>('9893012345');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  const [imageBase64, setImageBase64] = useState<string | null>(DEMO_SCENARIOS[0].imageSample);
  const [imageFileName, setImageFileName] = useState<string | null>('sargam-waterlogging-demo.svg');
  const [imageMimeType, setImageMimeType] = useState<string | null>('image/svg+xml');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectScenario = (scenario: DemoScenario) => {
    setCategory(scenario.category);
    setSeverity(scenario.severity);
    setWardId(scenario.wardId);
    setLocationName(scenario.locationName);
    setLandmark(scenario.landmark);
    setTitle(scenario.title);
    setDescription(scenario.description);
    setImageBase64(scenario.imageSample);
    setImageFileName(`${scenario.id}.svg`);
    setImageMimeType('image/svg+xml');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image file size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageBase64(reader.result as string);
      setImageFileName(file.name);
      setImageMimeType(file.type);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        title,
        description,
        category,
        severity,
        wardId,
        locationName,
        landmark,
        reporterName: isAnonymous ? undefined : reporterName,
        reporterPhone: isAnonymous ? undefined : reporterPhone,
        isAnonymous,
        imageBase64,
        imageFileName,
        imageMimeType
      };

      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit and triage report.');
      }

      if (data.matched && data.incident?.id) {
        router.push(`/incidents/${data.incident.id}?matched=true`);
      } else if (data.incident?.id) {
        router.push(`/incidents/${data.incident.id}`);
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 space-y-8">
      {/* Page Header */}
      <div className="space-y-2 pb-6 border-b border-slate-800/80">
        <div className="inline-flex items-center gap-1.5 text-xs text-sky-400 font-semibold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Intake & Triage Gateway</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          File Civic Memory Report
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Reports are triaged by Claude, cross-referenced with CPCB/NGT baseline records, and matched against historical recurrence clusters. Hindi and English supported.
        </p>
      </div>

      {/* Demo Scenario Selector */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <BookmarkCheck className="h-4 w-4 text-sky-400" />
            <span>Pre-load Demo Scenario</span>
          </div>
          <span className="text-[11px] text-slate-500">Quick Judge Presets</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {DEMO_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              onClick={() => handleSelectScenario(scenario)}
              className="text-left rounded-lg border border-slate-800 bg-slate-950/60 p-3 hover:border-slate-700 hover:bg-slate-900 transition-colors space-y-1 group"
            >
              <div className="text-[11px] font-medium text-sky-400">{scenario.badge}</div>
              <div className="text-xs font-medium text-slate-200 group-hover:text-white line-clamp-1">
                {scenario.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-rose-800/60 bg-rose-950/30 p-3.5 text-xs text-rose-300 flex items-center gap-2.5">
          <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Report Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Category Selection */}
        <div className="space-y-2.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            1. Civic Domain
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex flex-col items-start p-3 rounded-lg border text-left transition-colors ${
                  category === cat.id
                    ? 'border-sky-500 bg-sky-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 text-sm">
                  <span>{cat.icon}</span>
                  <span className="text-xs font-medium">{cat.label}</span>
                </div>
                <span className="mt-1 text-[11px] text-slate-400 line-clamp-1">
                  {cat.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Severity */}
        <div className="space-y-2.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            2. Perceived Urgency
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {SEVERITIES.map((sev) => (
              <button
                key={sev.id}
                type="button"
                onClick={() => setSeverity(sev.id)}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  severity === sev.id
                    ? 'border-sky-500 bg-sky-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-medium">{sev.label}</div>
                <div className="mt-0.5 text-[10px] text-slate-400 line-clamp-1">{sev.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Location */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <MapPin className="h-4 w-4 text-sky-400" />
            <span>3. Ward & Location</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Ward & Zone
              </label>
              <select
                value={wardId}
                onChange={(e) => setWardId(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
              >
                {wards.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.code} • Zone {w.zone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Street / Intersection *
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Sargam Cinema Road"
                required
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-400 mb-1">
                Prominent Landmark (Optional)
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Behind Bank of Baroda"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 4. Incident Narrative & Evidence */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <FileText className="h-4 w-4 text-sky-400" />
            <span>4. Description & Evidence</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Incident Headline *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of the issue..."
                required
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Field Description (Hindi or English) *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the physical condition, recurrence observations, or impact..."
                required
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-sky-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Photo Attachment */}
            <div className="space-y-2">
              <label className="block text-xs text-slate-400">
                Photographic Evidence
              </label>

              {imageBase64 ? (
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-sky-400" />
                      Attached: {imageFileName || 'photo.jpg'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setImageBase64(null);
                        setImageFileName(null);
                        setImageMimeType(null);
                      }}
                      className="text-xs text-slate-400 hover:text-rose-400"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="h-40 overflow-hidden rounded bg-black/40 flex items-center justify-center">
                    <img
                      src={imageBase64}
                      alt="Uploaded preview"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 border border-dashed border-slate-800 hover:border-slate-700 rounded-lg bg-slate-950/40 cursor-pointer transition-colors space-y-1">
                  <Camera className="h-6 w-6 text-slate-500" />
                  <span className="text-xs text-slate-300">
                    Click to upload photo (Max 5MB)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Parsed by Claude Vision
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* 5. Reporter Identity */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <ShieldCheck className="h-4 w-4 text-sky-400" />
              <span>5. Reporter Attribution</span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-sky-500 focus:ring-0"
              />
              <span className="text-xs text-slate-300">Submit Anonymously</span>
            </label>
          </div>

          {!isAnonymous && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="e.g. Vikram Joshi"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  placeholder="e.g. 9893012345"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit CTA */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-500 py-3.5 px-6 text-sm font-semibold text-slate-950 hover:bg-sky-400 transition-colors shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Running Candidate Matching & AI Triage...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Submit to Civic Memory & Triage</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
