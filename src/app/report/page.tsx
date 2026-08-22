'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCivic } from '@/lib/context/CivicContext';
import { IncidentCategory, IncidentSeverity } from '@/types/incident';
import {
  Camera,
  Upload,
  Sparkles,
  MapPin,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Send,
  HelpCircle,
  X,
  RefreshCw,
  Building,
  CheckCircle2,
  BookmarkCheck,
  Layers
} from 'lucide-react';

const CATEGORIES: { id: IncidentCategory; label: string; icon: string; desc: string }[] = [
  { id: 'drainage_flood', label: 'Drainage & Flood', icon: '🌊', desc: 'Waterlogging, choked sumps, Nallah overflow' },
  { id: 'lake_ecology', label: 'Lake Ecology (Bhoj Wetland)', icon: '🪷', desc: 'Bhojtal, Shahpura, algal blooms, weed choke' },
  { id: 'heritage_infrastructure', label: 'Heritage Infrastructure', icon: '🏛️', desc: 'Old City gates, stone masonry, historic structures' },
  { id: 'road_hazard', label: 'Roads & Bridges', icon: '🚧', desc: 'Potholes, exposed rebar, subsidence' },
  { id: 'sanitation_waste', label: 'Sanitation & Solid Waste', icon: '🗑️', desc: 'Garbage accumulation, commercial dump' },
  { id: 'public_lighting', label: 'Public Lighting & Grid', icon: '💡', desc: 'Feeder tripping, blackout on transit avenues' }
];

const SEVERITIES: { id: IncidentSeverity; label: string; color: string; desc: string }[] = [
  { id: 'critical', label: 'Critical Emergency', color: 'border-rose-500 bg-rose-950/40 text-rose-300', desc: 'Active hazard to life, water supply, or high-density transit' },
  { id: 'high', label: 'High Priority', color: 'border-amber-500 bg-amber-950/40 text-amber-300', desc: 'Severe disruption requiring response within 24 hours' },
  { id: 'medium', label: 'Standard Operational', color: 'border-cyan-500 bg-cyan-950/40 text-cyan-300', desc: 'Localized issue scheduled for routine municipal queue' },
  { id: 'low', label: 'Minor / Preventive', color: 'border-slate-600 bg-slate-900 text-slate-400', desc: 'Non-urgent maintenance or long-term observation' }
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
    name: 'Scenario 1 (Featured Judge Demo): Sargam Cinema Drainage Waterlogging',
    badge: 'Hindi/Hinglish • Recurring Cluster',
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
    badge: 'Ramsar Site #1206 • NGT Protected',
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
    badge: 'Heritage Zone 1 • Structural Alert',
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
  const { wards, submitCitizenReport } = useCivic();

  const [category, setCategory] = useState<IncidentCategory>('drainage_flood');
  const [severity, setSeverity] = useState<IncidentSeverity>('high');
  const [wardId, setWardId] = useState('ward-45');
  const [locationName, setLocationName] = useState('Zone II Junction near Sargam Cinema Road');
  const [landmark, setLandmark] = useState('Behind Bank of Baroda Regional Office');
  const [title, setTitle] = useState('Sargam Cinema crossroad par naala fir se overflow ho gaya hai');
  const [description, setDescription] = useState(
    'Har baar halki baarish me bhi Sargam Cinema ke paas naala jam ho jata hai aur sadak par 1.5 foot paani bhar jata hai. Pehle suction jetting machine aayi thi par commercial plastic kachra fir se fas gaya hai.'
  );
  const [reporterName, setReporterName] = useState('Vikram Joshi');
  const [reporterPhone, setReporterPhone] = useState('9893012345');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Photographic evidence state
  const [imageBase64, setImageBase64] = useState<string | null>(DEMO_SCENARIOS[0].imageSample);
  const [imageMimeType, setImageMimeType] = useState<string | null>('image/svg+xml');
  const [imageFileName, setImageFileName] = useState<string | null>('sargam-waterlogging-demo.svg');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedWard = wards.find((w) => w.id === wardId);

  const handleApplyScenario = (sc: DemoScenario) => {
    setCategory(sc.category);
    setSeverity(sc.severity);
    setWardId(sc.wardId);
    setLocationName(sc.locationName);
    setLandmark(sc.landmark);
    setTitle(sc.title);
    setDescription(sc.description);
    setImageBase64(sc.imageSample);
    setImageMimeType('image/svg+xml');
    setImageFileName(`${sc.id}.svg`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image exceeds 5MB limit. Please upload a smaller image.');
      return;
    }

    setImageMimeType(file.type);
    setImageFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !locationName) {
      setErrorMsg('Please fill in all required fields (title, description, location).');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const created = await submitCitizenReport({
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
        evidenceUrls: imageBase64 ? ['/evidence/citizen-uploaded-photo'] : [],
        imageBase64: imageBase64 || undefined,
        imageMimeType: imageMimeType || undefined,
        imageFileName: imageFileName || undefined
      });

      router.push(`/incidents/${created.id}`);
    } catch (err) {
      console.error('Submission failed:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Report submission failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-8">
      {/* Page Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/40 px-3 py-1 font-mono text-xs font-semibold text-cyan-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Bhopal Civic Memory Intake & Triage Gateway</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
          File Civic Memory Incident Report
        </h1>
        <p className="text-sm text-slate-400 font-sans">
          Submissions are parsed by Claude 3.5 Sonnet, cross-referenced with CPCB/NGT baseline evidence, and checked against historical recurrence files. Hindi & Hinglish text supported.
        </p>
      </div>

      {/* ONE-CLICK JUDGE DEMO SELECTOR */}
      <div className="rounded-2xl border border-cyan-500/50 bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-slate-950/90 p-5 space-y-3 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
            <BookmarkCheck className="h-4 w-4 text-cyan-400" />
            Quick Demo Scenario Pre-Loader (Judge Workflow)
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
            One-Click Preload
          </span>
        </div>
        <p className="text-xs text-slate-300 font-sans">
          Click a scenario below to instantly populate the form with realistic Hindi/Hinglish text, ward coordinates, and visual evidence:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {DEMO_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => handleApplyScenario(sc)}
              className="text-left rounded-xl border border-slate-700 bg-slate-900/80 p-3 hover:border-cyan-500 hover:bg-slate-800/90 transition-all space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                  {sc.category.replace('_', ' ')}
                </span>
                <span className="text-[9px] font-mono text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/60">
                  {sc.badge}
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1 font-sans">
                {sc.title}
              </div>
              <div className="text-[11px] text-slate-400 font-mono truncate">
                Ward: {sc.locationName}
              </div>
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-rose-800/80 bg-rose-950/40 p-4 text-xs font-mono text-rose-300 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Category Picker */}
        <div className="space-y-3">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            1. Civic Domain Classification
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
                  category === cat.id
                    ? 'border-cyan-500 bg-cyan-950/40 ring-1 ring-cyan-500 shadow-lg'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2 text-base">
                  <span>{cat.icon}</span>
                  <span className="font-mono text-xs font-semibold text-slate-200">
                    {cat.label}
                  </span>
                </div>
                <span className="mt-1 text-[11px] text-slate-400 font-sans line-clamp-2">
                  {cat.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Severity Picker */}
        <div className="space-y-3">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            2. Citizen-Perceived Severity
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SEVERITIES.map((sev) => (
              <button
                key={sev.id}
                type="button"
                onClick={() => setSeverity(sev.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  severity === sev.id
                    ? `${sev.color} ring-1 ring-current shadow-md`
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-mono text-xs font-bold">{sev.label}</div>
                <div className="mt-1 text-[10px] text-slate-400 font-sans">{sev.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Ward & Spatial Context */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
            <MapPin className="h-4 w-4 text-cyan-400" />
            <span>3. Ward & Spatial Pinpoint</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Administrative Ward & Zone
              </label>
              <select
                value={wardId}
                onChange={(e) => setWardId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                {wards.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.code} • Zone {w.zone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Street / Intersection Name *
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Zone II Junction near Sargam Cinema Road"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Prominent Landmark (Optional)
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Behind Bank of Baroda Regional Office"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Narrative & Photographic Evidence */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
            <FileText className="h-4 w-4 text-cyan-400" />
            <span>4. Incident Description & Evidence (Hindi / English)</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Incident Headline / Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of the issue..."
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Detailed Field Description (Hindi / Hinglish / English) *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the physical condition, recurrence observations, or impact..."
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none font-sans leading-relaxed"
              />
            </div>

            {/* Photo Upload Box */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-400">
                Photographic Evidence Attachment
              </label>

              {imageBase64 ? (
                <div className="relative overflow-hidden rounded-xl border border-cyan-600 bg-slate-950 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-cyan-300 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                      Visual Evidence Attached ({imageFileName || 'photo.jpg'})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setImageBase64(null);
                        setImageFileName(null);
                        setImageMimeType(null);
                      }}
                      className="text-xs text-slate-400 hover:text-rose-400 p-1 font-mono"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="h-48 overflow-hidden rounded-lg bg-black/60 flex items-center justify-center">
                    <img
                      src={imageBase64}
                      alt="Uploaded preview"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl bg-slate-950/40 cursor-pointer transition-colors space-y-2">
                  <Camera className="h-8 w-8 text-slate-500" />
                  <span className="text-xs font-mono text-slate-300">
                    Click to upload photo or drag & drop (Max 5MB)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Parsed directly by Claude 3.5 Sonnet Vision
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

        {/* Reporter Identity */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              <span>5. Reporter Attribution & Privacy</span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
              />
              <span className="text-xs font-mono text-slate-300">Submit Anonymously</span>
            </label>
          </div>

          {!isAnonymous && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Full Name / Organization
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="e.g. Vikram Joshi"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Phone Number (Masked Publicly)
                </label>
                <input
                  type="text"
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  placeholder="e.g. 9893012345"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submission Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-cyan-500 bg-gradient-to-r from-cyan-600 via-cyan-500 to-teal-500 py-4 px-6 font-mono text-sm font-bold text-slate-950 hover:opacity-95 transition-all shadow-xl shadow-cyan-950/50 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Running Candidate Retrieval & Claude Triage...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Submit to Bhopal Civic Memory & Trigger AI Triage</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
