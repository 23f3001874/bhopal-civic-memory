'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CivicIncident, BhopalWard, CivicPulseMetrics, CitizenReportInput } from '@/types/incident';
import { INITIAL_INCIDENTS, BHOPAL_WARDS, INITIAL_CIVIC_METRICS } from '@/lib/data/mockIncidents';
import { getIncidentFromDatabase, saveIncidentToDatabase } from '@/lib/supabase/service';
import { Language, TranslationKey, TRANSLATIONS } from '@/lib/i18n/translations';

interface CivicContextType {
  incidents: CivicIncident[];
  wards: BhopalWard[];
  metrics: CivicPulseMetrics;
  selectedWardId: string | 'all';
  setSelectedWardId: (id: string | 'all') => void;
  selectedCategory: string | 'all';
  setSelectedCategory: (cat: string | 'all') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, fallback?: string) => string;
  submitCitizenReport: (report: CitizenReportInput) => Promise<CivicIncident>;
  upvoteIncident: (incidentId: string) => Promise<void>;
  getIncidentById: (id: string) => CivicIncident | undefined;
  getWardById: (id: string) => BhopalWard | undefined;
  fetchIncidentAsync: (idOrToken: string) => Promise<CivicIncident | null>;
  isLoading: boolean;
}

const CivicContext = createContext<CivicContextType | undefined>(undefined);

export function CivicProvider({ children }: { children: React.ReactNode }) {
  const [incidents, setIncidents] = useState<CivicIncident[]>(INITIAL_INCIDENTS);
  const [wards] = useState<BhopalWard[]>(BHOPAL_WARDS);
  const [metrics, setMetrics] = useState<CivicPulseMetrics>(INITIAL_CIVIC_METRICS);
  const [selectedWardId, setSelectedWardId] = useState<string | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);

  // Set language with persistence
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('bhopal_civic_lang', lang);
    } catch {
      // ignore
    }
  };

  // Translation lookup helper
  const t = (key: TranslationKey, fallback?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return (langDict as Record<string, string>)[key] || fallback || key;
  };

  // Hydrate additional persisted incidents and language from localStorage on client mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('bhopal_civic_lang');
      if (savedLang === 'hi' || savedLang === 'en') {
        setLanguageState(savedLang);
      }

      const localData = localStorage.getItem('bhopal_civic_incidents');
      if (localData) {
        const parsedList: CivicIncident[] = JSON.parse(localData);
        if (Array.isArray(parsedList) && parsedList.length > 0) {
          setIncidents((prev) => {
            const existingIds = new Set(prev.map((i) => i.id));
            const newItems = parsedList.filter((i) => !existingIds.has(i.id));
            return [...newItems, ...prev];
          });
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const getIncidentById = (id: string) => {
    return incidents.find((inc) => inc.id === id || inc.trackingToken === id);
  };

  const fetchIncidentAsync = async (idOrToken: string): Promise<CivicIncident | null> => {
    const existing = getIncidentById(idOrToken);
    if (existing) return existing;

    const fromDb = await getIncidentFromDatabase(idOrToken);
    if (fromDb) {
      setIncidents((prev) => {
        if (prev.some((i) => i.id === fromDb.id)) return prev;
        return [fromDb, ...prev];
      });
      return fromDb;
    }
    return null;
  };

  const getWardById = (id: string) => {
    return wards.find((w) => w.id === id || w.code === id);
  };

  const upvoteIncident = async (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const updated = {
            ...inc,
            upvotes: inc.upvotes + 1,
            corroborationCount: inc.corroborationCount + 1
          };
          saveIncidentToDatabase(updated).catch(() => {});
          return updated;
        }
        return inc;
      })
    );
  };

  const submitCitizenReport = async (input: CitizenReportInput): Promise<CivicIncident> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      const createdIncident: CivicIncident = data.incident;

      // Update state
      setIncidents((prev) => [createdIncident, ...prev]);
      setMetrics((prev) => ({
        ...prev,
        totalActiveIncidents: prev.totalActiveIncidents + 1,
        criticalAlerts:
          createdIncident.severity === 'critical'
            ? prev.criticalAlerts + 1
            : prev.criticalAlerts
      }));

      return createdIncident;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CivicContext.Provider
      value={{
        incidents,
        wards,
        metrics,
        selectedWardId,
        setSelectedWardId,
        selectedCategory,
        setSelectedCategory,
        language,
        setLanguage,
        t,
        submitCitizenReport,
        upvoteIncident,
        getIncidentById,
        getWardById,
        fetchIncidentAsync,
        isLoading
      }}
    >
      {children}
    </CivicContext.Provider>
  );
}

export function useCivic() {
  const context = useContext(CivicContext);
  if (!context) {
    throw new Error('useCivic must be used within a CivicProvider');
  }
  return context;
}
