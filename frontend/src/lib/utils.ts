import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Forest data loading utilities
import type { ForestArea } from '@/data/mockData';
// Load from public/ so paths are stable after monorepo restructure
import forestDataUrl from '/forest_protected_areas_four_states_enriched.json?url';
import stateSchemesUrl from '/state_schemes_cards.json?url';
// Villages (ANGUL) dataset in repo root/frontend
import angulVillagesGeoJsonUrl from '/village_points_from_names_ANGUL.geojson?url';
// DSS village indicators (per-village decision support)
// We resolve the file at runtime to avoid bundler resolution issues outside the app root.

type EnrichedForestRow = {
  wikidata_id: string;
  name: string;
  description: string | null;
  state: string | null;
  designation: string | null;
  iucn_category: string | null;
  area_ha: number | null;
  inception: string | null;
  coordinates: string | null; // "Point(lon lat)"
  official_website: string | null;
  source: string | null;
  source_url: string | null;
  wikipedia_title: string | null;
  wikipedia_url: string | null;
};

function parsePointStringToLatLng(point: string | null): [number, number] | null {
  if (!point) return null;
  const match = point.match(/Point\(([-+]?\d*\.?\d+)\s+([-.\d]+)\)/);
  if (!match) return null;
  const lon = parseFloat(match[1]);
  const lat = parseFloat(match[2]);
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
  return [lat, lon];
}

export async function loadRealForestAreas(fetchImpl: typeof fetch = fetch): Promise<ForestArea[]> {
  try {
    const res = await fetchImpl(forestDataUrl);
    if (!res.ok) throw new Error(`Failed to fetch forest data: ${res.status}`);
    const raw: EnrichedForestRow[] = await res.json();

    const toType = (designation: string | null): ForestArea['type'] => {
      const d = (designation || '').toLowerCase();
      if (d.includes('national park') || d === 'park') return 'National Park';
      if (d.includes('wildlife sanctuary') || d.includes('sanctuary')) return 'Wildlife Sanctuary';
      if (d.includes('protected')) return 'Protected Forest';
      if (d.includes('reserve')) return 'Reserve Forest';
      if (d.includes('community')) return 'Community Forest';
      return 'Forest Range';
    };

    const result: ForestArea[] = raw
      .map((row, idx) => {
        const coords = parsePointStringToLatLng(row.coordinates);
        if (!coords) return null;
        const [lat, lon] = coords;
        return {
          id: row.wikidata_id || String(idx + 1),
          name: row.name || 'Unnamed Area',
          type: toType(row.designation),
          state: row.state || 'Unknown',
          district: '—',
          coordinates: [lat, lon],
          area: row.area_ha || 0,
          forestCover: 0,
          biodiversity: 'Medium',
          protectionStatus: 'Protected',
          establishedYear: row.inception ? new Date(row.inception).getFullYear() : 0,
          description: row.description || '',
          threats: [],
          conservationMeasures: [],
          lastSurvey: new Date().toISOString().slice(0, 10),
          isActive: true,
        } as ForestArea;
      })
      .filter(Boolean) as ForestArea[];

    return result;
  } catch (e) {
    console.error('loadRealForestAreas error', e);
    return [];
  }
}

// Schemes loader and type
export type SchemeCard = {
  title: string;
  schemeName: string;
  priority?: 'High' | 'Medium' | 'Low' | null;
  status?: string | null;
  location?: string | null;
  description?: string | null;
  sector?: string | null;
  implementingAgency?: string | null;
  officialUrl?: string | null;
};

export async function loadStateSchemes(fetchImpl: typeof fetch = fetch): Promise<SchemeCard[]> {
  try {
    const res = await fetchImpl(stateSchemesUrl);
    if (!res.ok) throw new Error(`Failed to fetch schemes: ${res.status}`);
    const rows: any[] = await res.json();
    return rows.map((r) => ({
      title: (r.title || r.scheme_name || '').toString().trim(),
      schemeName: (r.scheme_name || r.title || '').toString().trim(),
      priority: r.priority && typeof r.priority === 'string' ? (r.priority.charAt(0).toUpperCase() + r.priority.slice(1).toLowerCase()) as any : null,
      status: r.status ?? null,
      location: r.location ?? null,
      description: r.description ?? null,
      sector: r.sector ?? null,
      implementingAgency: r.implementing_agency ?? null,
      officialUrl: r.official_page_url ?? null,
    }));
  } catch (e) {
    console.error('loadStateSchemes error', e);
    return [];
  }
}

// Village data types and loader (ANGUL-only for now)
export type RealVillage = {
  id: string;
  name: string;
  state: string;
  district: string;
  coordinates: [number, number];
  fraType?: 'IFR' | 'CFR' | '';
  landArea?: number | null;
  status?: 'Approved' | 'Pending' | 'Rejected' | '';
  population?: number | null;
  forestCover?: number | null;
  lastUpdated?: string | null;
};

type AngulGeoJson = {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: {
      name?: string;
      source?: string;
      state?: string;
      district?: string;
      fraType?: string;
      landArea?: number;
      status?: string;
      population?: number;
      forestCover?: number;
      lastUpdated?: string;
    };
    geometry: {
      type: 'Point';
      coordinates: [number, number]; // [lon, lat]
    };
  }>;
};

export async function loadAngulVillages(fetchImpl: typeof fetch = fetch): Promise<RealVillage[]> {
  try {
    const res = await fetchImpl(angulVillagesGeoJsonUrl);
    if (!res.ok) throw new Error(`Failed to fetch ANGUL villages: ${res.status}`);
    const gj: AngulGeoJson = await res.json();
    const districtName = 'Angul';
    const stateName = 'Odisha';

    return (gj.features || [])
      .filter((f) => f.geometry && f.geometry.type === 'Point' && Array.isArray(f.geometry.coordinates))
      .map((f, idx) => {
        const [lon, lat] = f.geometry.coordinates;
        const p = f.properties || {};
        const fra = (p.fraType || '').toUpperCase();
        const status = (p.status || '').toLowerCase();
        return {
          id: `${p.name || 'v'}-${idx}`,
          name: p.name || 'Unnamed',
          state: p.state || stateName,
          district: p.district || districtName,
          coordinates: [lat, lon],
          fraType: fra === 'IFR' || fra === 'CFR' ? (fra as any) : '',
          landArea: typeof p.landArea === 'number' ? p.landArea : null,
          status: status === 'approved' || status === 'pending' || status === 'rejected' ? (status.charAt(0).toUpperCase() + status.slice(1)) as any : '',
          population: typeof p.population === 'number' ? p.population : null,
          forestCover: typeof p.forestCover === 'number' ? p.forestCover : null,
          lastUpdated: p.lastUpdated || null,
        } as RealVillage;
      });
  } catch (e) {
    console.error('loadAngulVillages error', e);
    return [];
  }
}

// DSS: Load villages with indicators and recommendations
export type DSSVillage = RealVillage & {
  villageCode?: number;
  block?: string | null;
  indicators?: {
    fraBeneficiaries?: number | null;
    pmKisanCount?: number | null;
    pmKisanEligible?: number | null;
    jjmCoveragePct?: number | null;
    groundwaterIndex?: number | null;
    waterStressScore?: number | null;
    priorityScore?: number | null;
    populationTotal?: number | null;
    households?: number | null;
  };
  recommendations?: string[];
};

export async function loadDSSVillages(fetchImpl: typeof fetch = fetch): Promise<DSSVillage[]> {
  try {
    // Compute relative path from frontend dev server root to DSS file
    // In dev, vite serves from project root; in prod, you can move the file to public/.
    const url = (typeof window !== 'undefined')
      ? `${window.location.origin}/dssnewbhoomi/data/village_indicators_light.geojson`
      : '/dssnewbhoomi/data/village_indicators_light.geojson';
    const res = await fetchImpl(url);
    if (!res.ok) throw new Error(`Failed to fetch DSS villages: ${res.status}`);
    const gj = await res.json();
    const features = Array.isArray(gj?.features) ? gj.features : [];
    return features
      .filter((f: any) => f?.geometry?.type === 'Point' && Array.isArray(f.geometry.coordinates))
      .map((f: any, idx: number) => {
        const p = f.properties || {};
        const [lon, lat] = f.geometry.coordinates;
        return {
          id: String(p.village_code ?? idx + 1),
          villageCode: p.village_code ?? null,
          name: String(p.village_name ?? 'Village'),
          state: String(p.state ?? 'Odisha'),
          district: String(p.district ?? 'Angul'),
          block: p.block ?? null,
          coordinates: [lat, lon],
          fraType: '',
          landArea: null,
          status: '',
          population: Number.isFinite(p.population_total) ? p.population_total : null,
          forestCover: Number.isFinite(p.forest_cover) ? p.forest_cover : null,
          lastUpdated: null,
          indicators: {
            fraBeneficiaries: Number.isFinite(p.fra_beneficiary_count) ? p.fra_beneficiary_count : null,
            pmKisanCount: Number.isFinite(p.pm_kisan_count) ? p.pm_kisan_count : null,
            pmKisanEligible: Number.isFinite(p.pm_kisan_eligible_count) ? p.pm_kisan_eligible_count : null,
            jjmCoveragePct: Number.isFinite(p.jjm_coverage_pct) ? p.jjm_coverage_pct : null,
            groundwaterIndex: Number.isFinite(p.groundwater_index) ? p.groundwater_index : null,
            waterStressScore: Number.isFinite(p.water_stress_score) ? p.water_stress_score : null,
            priorityScore: Number.isFinite(p.priority_score) ? p.priority_score : null,
            populationTotal: Number.isFinite(p.population_total) ? p.population_total : null,
            households: Number.isFinite(p.households) ? p.households : null,
          },
          recommendations: Array.isArray(p.recommendations) ? p.recommendations.map((r: any) => String(r)) : [],
        } as DSSVillage;
      });
  } catch (e) {
    console.error('loadDSSVillages error', e);
    return [];
  }
}

// Cached accessor so multiple components can reuse the loaded DSS data
let __dssVillageCache: DSSVillage[] | null = null;
let __dssVillagePromise: Promise<DSSVillage[]> | null = null;

export function getDSSVillagesCached(fetchImpl: typeof fetch = fetch): Promise<DSSVillage[]> {
  if (__dssVillageCache) return Promise.resolve(__dssVillageCache);
  if (__dssVillagePromise) return __dssVillagePromise;
  __dssVillagePromise = loadDSSVillages(fetchImpl).then((rows) => {
    __dssVillageCache = rows;
    return rows;
  }).finally(() => {
    __dssVillagePromise = null;
  });
  return __dssVillagePromise;
}
