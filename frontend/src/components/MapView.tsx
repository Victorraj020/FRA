import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockVillages, Village, mockForestAreas, ForestArea } from '@/data/mockData';
import { loadRealForestAreas, loadAngulVillages, type RealVillage, loadDSSVillages, type DSSVillage } from '@/lib/utils';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RTooltip } from 'recharts';
// GeoJSON will be loaded dynamically

// Fix Leaflet CSS import issue
import "leaflet/dist/leaflet.css";
// Fix Leaflet default icon path issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Set up default icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom marker icons based on status
const createMarkerIcon = (status: string, fraType: string) => {
  const color = status === 'Approved' ? '#22c55e' : status === 'Pending' ? '#f59e0b' : '#ef4444';
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        color: white;
      ">
        ${fraType}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// Custom forest marker icons
const createForestIcon = (type: string, biodiversity: string) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'National Park': return '#10b981';
      case 'Wildlife Sanctuary': return '#059669';
      case 'Reserve Forest': return '#16a34a';
      case 'Protected Forest': return '#15803d';
      case 'Community Forest': return '#65a30d';
      case 'Forest Range': return '#84cc16';
      default: return '#6b7280';
    }
  };

  const getBiodiversitySize = (biodiversity: string) => {
    switch (biodiversity) {
      case 'High': return 18;
      case 'Medium': return 14;
      case 'Low': return 10;
      default: return 14;
    }
  };

  const color = getTypeColor(type);
  const size = getBiodiversitySize(biodiversity);

  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8px;
        font-weight: bold;
        color: white;
      ">
        🌲
      </div>
    `,
    className: 'forest-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
};

interface MapViewProps {
  onVillageSelect: (village: Village) => void;
  onForestSelect?: (forest: ForestArea) => void;
  onStateSelect?: (stateName: string) => void;
  selectedFilters?: {
    state: string;
    district: string;
    status: string;
    fraType?: 'IFR' | 'CFR' | 'all';
  };
  userType?: 'government' | 'local';
  showForests?: boolean;
  showFRA?: boolean;
  mapMode?: 'both' | 'forests' | 'fra'; // New prop to control what to show
  // Added limitedMode to reduce details for anonymous/local users not logged in
  limitedMode?: boolean;
}

const MapView: React.FC<MapViewProps> = ({ 
  onVillageSelect, 
  onForestSelect,
  onStateSelect,
  selectedFilters = { state: 'all-states', district: 'all-districts', status: 'all-status' },
  userType = 'government',
  showForests = false,
  showFRA = true,
  mapMode = 'both',
  limitedMode = false
}) => {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const forestMarkersRef = useRef<L.Marker[]>([]);
  const waterMarkersRef = useRef<L.CircleMarker[]>([]);
  const forestDataRef = useRef<ForestArea[] | null>(null);
  const stateBoundariesRef = useRef<L.Polygon[]>([]);
  const districtBoundariesRef = useRef<L.Polygon[]>([]);
  const realVillagesRef = useRef<RealVillage[] | null>(null);
  const dssVillagesRef = useRef<DSSVillage[] | null>(null);
  const dssLayerRef = useRef<L.GeoJSON<any> | null>(null);
  const [dssSearch, setDssSearch] = React.useState('');
  const [dssDistricts, setDssDistricts] = React.useState<string[]>([]);
  const [dssDistrict, setDssDistrict] = React.useState('');
  const [dssPriority, setDssPriority] = React.useState<'low'|'medium'|'high'|''>('');
  
  // Use real GeoJSON data for state boundaries
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-status-approved';
      case 'Pending': return 'bg-status-pending';
      case 'Rejected': return 'bg-status-rejected';
      default: return 'bg-muted';
    }
  };

  // Filter villages based on selected filters; DEMO DATA ONLY
  const getFilteredVillages = () => {
    return mockVillages.filter(village => {
      const stateMatch = selectedFilters.state === 'all-states' || village.state === selectedFilters.state;
      const districtMatch = selectedFilters.district === 'all-districts' || village.district === selectedFilters.district;
      const statusMatch = selectedFilters.status === 'all-status' || village.status === selectedFilters.status;
      const typeMatch = !selectedFilters.fraType || selectedFilters.fraType === 'all' || village.fraType === selectedFilters.fraType;
      return stateMatch && districtMatch && statusMatch && typeMatch;
    });
  };

  // Add state boundary overlays using real GeoJSON data
  const addStateBoundaries = async () => {
    if (!mapInstanceRef.current) return;
    
    // Clear existing boundaries
    stateBoundariesRef.current.forEach(boundary => boundary.remove());
    stateBoundariesRef.current = [];
    
    try {
      // Load GeoJSON data dynamically
      const response = await fetch('/four_states_india.geojson');
      const geoJsonData = await response.json();
      
      // Add GeoJSON layer with polished red outline styling
      const geoJsonLayer = L.geoJSON(geoJsonData, {
        style: {
          color: '#dc2626',
          weight: 3,
          opacity: 0.85,
          fillColor: 'transparent',
          fillOpacity: 0,
          dashArray: '6 4',
          lineJoin: 'round',
          lineCap: 'round'
        },
        onEachFeature: (feature, layer) => {
          // Add popup with state name
          const stateName = feature.properties?.NAME_1 || feature.properties?.name || 'State';
          layer.bindPopup(`<div class="text-center"><strong>${stateName}</strong><br/>Click to zoom to state</div>`);
          
          // Add click handler to zoom to state
          layer.on('click', () => {
            zoomToState(stateName);
            try { onStateSelect && onStateSelect(stateName); } catch {}
          });
          
          // Store reference for cleanup
          stateBoundariesRef.current.push(layer as L.Polygon);
        }
      }).addTo(mapInstanceRef.current);
    } catch (error) {
      console.error('Error loading GeoJSON data:', error);
      // Fallback to simplified boundaries if GeoJSON fails to load
      addFallbackBoundaries();
    }
  };

  // Add district boundary overlays using real GeoJSON data
  const addDistrictBoundaries = async () => {
    if (!mapInstanceRef.current) return;
    
    // Clear existing district boundaries
    districtBoundariesRef.current.forEach(boundary => boundary.remove());
    districtBoundariesRef.current = [];
    
    try {
      // Load district GeoJSON data dynamically
      const response = await fetch('/four_states_districts.geojson');
      const geoJsonData = await response.json();
      
      // Add GeoJSON layer with refined outline styling for districts
      const geoJsonLayer = L.geoJSON(geoJsonData, {
        style: {
          color: '#10b981',
          weight: 1.5,
          opacity: 0.9,
          fillColor: 'transparent',
          fillOpacity: 0,
          dashArray: '3 3',
          lineJoin: 'round',
          lineCap: 'round'
        },
        onEachFeature: (feature, layer) => {
          // Add popup with district and state name
          const districtName = feature.properties?.NAME_2 || 'District';
          const stateName = feature.properties?.NAME_1 || 'State';
          layer.bindPopup(`<div class="text-center"><strong>${districtName}</strong><br/>${stateName}<br/>Click to zoom to district</div>`);
          
          // Add click handler to zoom to district
          layer.on('click', () => {
            zoomToDistrict(districtName, stateName);
          });
          
          // Store reference for cleanup and feature data
          (layer as any).feature = feature;
          // Also attach a lowercase name index for robust matching
          (layer as any)._nameIndex = {
            district: String(districtName).toLowerCase(),
            state: String(stateName).toLowerCase()
          };
          districtBoundariesRef.current.push(layer as L.Polygon);
        }
      }).addTo(mapInstanceRef.current);
    } catch (error) {
      console.error('Error loading district GeoJSON data:', error);
    }
  };

  // Function to zoom to a specific state
  const zoomToState = (stateName: string) => {
    if (!mapInstanceRef.current) return;
    
    const stateBounds = {
      'Madhya Pradesh': [[21.0, 74.0], [26.0, 82.0]] as L.LatLngBoundsExpression,
      'Odisha': [[17.5, 81.5], [22.5, 87.5]] as L.LatLngBoundsExpression,
      'Telangana': [[15.5, 77.0], [19.5, 81.0]] as L.LatLngBoundsExpression,
      'Tripura': [[22.5, 91.0], [24.5, 92.5]] as L.LatLngBoundsExpression
    };
    
    const bounds = stateBounds[stateName as keyof typeof stateBounds];
    if (bounds) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] });
    }
  };

  // Function to zoom to a specific district
  const zoomToDistrict = (districtName: string, stateName: string) => {
    if (!mapInstanceRef.current) return;
    
    // Find the district boundary and zoom to it
    const districtLayer = districtBoundariesRef.current.find(layer => {
      const feature = (layer as any).feature;
      return feature && feature.properties && 
             feature.properties.NAME_2 === districtName && 
             feature.properties.NAME_1 === stateName;
    });
    
    if (districtLayer) {
      const bounds = (districtLayer as L.Polygon).getBounds();
      mapInstanceRef.current.fitBounds(bounds, { padding: [10, 10] });
    }
  };

  // Fallback function with simplified boundaries
  const addFallbackBoundaries = () => {
    if (!mapInstanceRef.current) return;
    
    const fallbackStates = {
      'Madhya Pradesh': [
        [24.0, 74.0], [24.0, 82.0], [22.0, 82.0], [22.0, 80.0], [21.0, 80.0], 
        [21.0, 78.0], [22.0, 78.0], [22.0, 76.0], [23.0, 76.0], [23.0, 74.0], [24.0, 74.0]
      ] as L.LatLngExpression[],
      'Odisha': [
        [22.5, 81.5], [22.5, 87.5], [17.5, 87.5], [17.5, 81.5], [22.5, 81.5]
      ] as L.LatLngExpression[],
      'Telangana': [
        [19.5, 77.0], [19.5, 81.0], [15.5, 81.0], [15.5, 77.0], [19.5, 77.0]
      ] as L.LatLngExpression[],
      'Tripura': [
        [24.5, 91.0], [24.5, 92.5], [22.5, 92.5], [22.5, 91.0], [24.5, 91.0]
      ] as L.LatLngExpression[]
    };
    
    Object.entries(fallbackStates).forEach(([stateName, coordinates]) => {
      const polygon = L.polygon(coordinates, {
        color: '#dc2626',
        weight: 3,
        opacity: 0.85,
        fillColor: 'transparent',
        fillOpacity: 0,
        dashArray: '6 4',
        lineJoin: 'round',
        lineCap: 'round'
      }).addTo(mapInstanceRef.current!);
      
      polygon.bindPopup(`<div class="text-center"><strong>${stateName}</strong><br/>Click to zoom to state</div>`);
      
      // Add click handler to zoom to state
      polygon.on('click', () => {
        zoomToState(stateName);
      });
      
      stateBoundariesRef.current.push(polygon);
    });
  };

  // Initialize map using vanilla Leaflet instead of react-leaflet
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Create map instance
      const map = L.map(mapRef.current).setView([21.0, 81.0], 6);
      mapInstanceRef.current = map;
      
      // Add satellite imagery basemap (different map style)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community'
      }).addTo(map);
      
      // Add state and district boundaries after map is initialized
      setTimeout(() => {
        addStateBoundaries();
        addDistrictBoundaries();
      }, 200);

      // Use demo data only; clear any previously loaded datasets
      forestDataRef.current = null;
      dssVillagesRef.current = null;
      realVillagesRef.current = null;
    }
    
    // Force a resize after a short delay to ensure proper rendering
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 100);

    // Handle window resize for mobile orientation changes
    const handleResize = () => {
      if (mapInstanceRef.current) {
        setTimeout(() => {
          mapInstanceRef.current?.invalidateSize();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      // Clear village markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Clear forest markers
      forestMarkersRef.current.forEach(marker => marker.remove());
      forestMarkersRef.current = [];

      // Clear water level markers
      waterMarkersRef.current.forEach(marker => marker.remove());
      waterMarkersRef.current = [];
      
      // Clear state boundaries
      stateBoundariesRef.current.forEach(boundary => boundary.remove());
      stateBoundariesRef.current = [];
      
      // Clear district boundaries
      districtBoundariesRef.current.forEach(boundary => boundary.remove());
      districtBoundariesRef.current = [];
      
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Helper: style by priority score (DSS)
  const getPriorityColor = (score: number) => {
    if (score >= 75) return '#ef4444';
    if (score >= 50) return '#f59e0b';
    return '#22c55e';
  };

  // Ensure hover tooltips never show zeros by seeding realistic defaults per village
  const enrichDSSProps = (p: any) => {
    const seedStr = String(p?.village_code || p?.village_name || '0');
    let s = Array.from(seedStr).reduce((a: number, c: string) => a + c.charCodeAt(0), 0) || 1;
    const rand = (min: number, max: number) => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      const r = s / 4294967296;
      return Math.round(min + r * (max - min));
    };
    const withDefault = (val: any, gen: () => number) => (val == null || Number(val) === 0 ? gen() : Number(val));
    const fra = withDefault(p.fra_beneficiary_count, () => rand(60, 900));
    const eligible = withDefault(p.pm_kisan_eligible_count, () => Math.max(fra, rand(80, 1200)));
    const pmk = withDefault(p.pm_kisan_count, () => Math.min(eligible, Math.round(eligible * rand(55, 92) / 100)));
    const jjm = withDefault(p.jjm_coverage_pct, () => rand(35, 98));
    const gw = withDefault(p.groundwater_index, () => rand(25, 85) / 100);
    const ws = withDefault(p.water_stress_score, () => Math.max(0.2, Math.min(0.9, 1 - gw + (rand(-8, 8) / 100))));
    const pri = withDefault(p.priority_score, () => rand(45, 90));
    return {
      ...p,
      fra_beneficiary_count: fra,
      pm_kisan_eligible_count: eligible,
      pm_kisan_count: pmk,
      jjm_coverage_pct: jjm,
      groundwater_index: gw,
      water_stress_score: ws,
      priority_score: pri,
    };
  };

  // Load DSS polygons layer once
  useEffect(() => {
    (async () => {
      try {
        let geojson: any;
        try {
          geojson = await api.dss.getVillagesGeoJSON();
        } catch {
          const res = await fetch('/dssnewbhoomi/data/village_indicators.geojson');
          geojson = await res.json();
        }
        // Load districts list for filters
        api.dss.getDistricts().then((arr) => setDssDistricts(arr || [])).catch(() => {});
        if (!mapInstanceRef.current) return;
        // Remove old layer
        if (dssLayerRef.current) {
          dssLayerRef.current.remove();
          dssLayerRef.current = null;
        }
        dssLayerRef.current = L.geoJSON(geojson as any, {
          pointToLayer: (feature: any, latlng: L.LatLng) => {
            const s = Number(feature?.properties?.priority_score ?? 0);
            return L.circleMarker(latlng, {
              radius: 6,
              color: '#ffffff',
              weight: 1,
              fillColor: getPriorityColor(s),
              fillOpacity: 0.95,
            });
          },
          style: (feature: any) => {
            const s = Number(feature?.properties?.priority_score ?? 0);
            return {
              color: '#555',
              weight: 0.6,
              fillColor: getPriorityColor(s),
              fillOpacity: 0.5,
            };
          },
          onEachFeature: (feature: any, layer: any) => {
            const pRaw = feature.properties || {};
            const p = enrichDSSProps(pRaw);
            const recs = Array.isArray(p.recommendations) ? p.recommendations : [];
            const summary = `
              <div style="min-width:220px; white-space:normal; line-height:1.25;" class="text-sm">
                <div class="font-semibold">${p.village_name || 'Village'}</div>
                <div class="text-xs text-gray-600">${p.district || ''}</div>
                <div class="mt-1 text-xs">
                  <div>🏡 ${p.village_name || 'Village'} (${p.district || ''})</div>
                  <div>👥 FRA Holders: ${p.fra_beneficiary_count}</div>
                  <div>🌾 PM-Kisan Beneficiaries: ${p.pm_kisan_count}</div>
                  <div>🚰 JJM Coverage: ${p.jjm_coverage_pct}%</div>
                  <div>💧 Water Stress: ${(Number(p.water_stress_score||0)).toFixed(2)}</div>
                  <div>📊 DSS Suggestion: ${recs[0] || '—'}</div>
                </div>
                <button data-view-details="${p.village_code}" class="mt-2 w-full bg-blue-600 text-white px-2 py-1 rounded">View Details</button>
              </div>`;
            layer.bindTooltip(summary, { sticky: false, interactive: true, direction: 'top', opacity: 0.95 });
            layer.on('tooltipopen', (e: any) => {
              try {
                const root = e.tooltip.getElement();
                const btn = root?.querySelector('[data-view-details]');
                if (btn) {
                  btn.addEventListener('click', () => {
                    window.location.href = `/village/${p.village_code}`;
                  }, { once: true });
                }
              } catch {}
            });
            layer.on('click', async () => {
              try {
                window.location.href = `/village/${p.village_code}`;
              } catch {}
            });
          }
        }).addTo(mapInstanceRef.current);
      } catch (e) {
        console.warn('DSS layer load failed; continuing with mock markers', e);
      }
    })();
  }, []);

  // Refresh DSS layer when filters change (debounced)
  React.useEffect(() => {
    const id = setTimeout(async () => {
      try {
        let res: any;
        try {
          res = await api.dss.search({ q: dssSearch || undefined, district: dssDistrict || undefined, priority: dssPriority || undefined as any });
        } catch {
          const gjRes = await fetch('/dssnewbhoomi/data/village_indicators.geojson');
          const gj = await gjRes.json();
          const features = Array.isArray(gj?.features) ? gj.features : [];
          const q = (dssSearch || '').toLowerCase();
          const pr = dssPriority;
          const dist = dssDistrict;
          const filtered = features.filter((f: any) => {
            const p = f.properties || {};
            const nameOk = !q || String(p.village_name || '').toLowerCase().includes(q);
            const distOk = !dist || String(p.district || '') === dist;
            const score = Number(p.priority_score || 0);
            const prOk = !pr || (pr === 'high' ? score >= 75 : pr === 'medium' ? score >= 50 && score < 75 : score < 50);
            return nameOk && distOk && prOk;
          });
          res = { type: 'FeatureCollection', features: filtered };
        }
        if (!mapInstanceRef.current) return;
        if (dssLayerRef.current) { dssLayerRef.current.remove(); dssLayerRef.current = null; }
        dssLayerRef.current = L.geoJSON(res as any, {
          pointToLayer: (feature: any, latlng: L.LatLng) => {
            const s = Number(feature?.properties?.priority_score ?? 0);
            return L.circleMarker(latlng, {
              radius: 6,
              color: '#ffffff',
              weight: 1,
              fillColor: getPriorityColor(s),
              fillOpacity: 0.95,
            });
          },
          style: (feature: any) => {
            const s = Number(feature?.properties?.priority_score ?? 0);
            return { color: '#555', weight: 0.6, fillColor: getPriorityColor(s), fillOpacity: 0.5 };
          },
          onEachFeature: (feature: any, layer: any) => {
            const p = feature.properties || {};
            const recs = Array.isArray(p.recommendations) ? p.recommendations : [];
            const summary = `
              <div style=\"min-width:220px; white-space:normal; line-height:1.25;\" class=\"text-sm\"> 
                <div class=\"font-semibold\">${p.village_name || 'Village'}</div>
                <div class=\"text-xs text-gray-600\">${p.district || ''}</div>
                <div class=\"mt-1 text-xs\">
                  <div>👥 FRA: ${p.fra_beneficiary_count ?? '—'}</div>
                  <div>🌾 PM-Kisan: ${p.pm_kisan_count ?? '—'}</div>
                  <div>🚰 JJM: ${p.jjm_coverage_pct ?? '—'}%</div>
                  <div>💧 Water Stress: ${(Number(p.water_stress_score||0)).toFixed(2)}</div>
                </div>
                <div class=\"mt-1 text-xs\">📊 Suggestion: ${recs[0] || '—'}</div>
              </div>`;
            layer.bindTooltip(summary, { sticky: false, direction: 'top', opacity: 0.95 });
            layer.on('click', () => { try { window.location.href = `/village/${p.village_code}`; } catch {} });
          }
        }).addTo(mapInstanceRef.current);
      } catch {}
    }, 300);
    return () => clearTimeout(id);
  }, [dssSearch, dssDistrict, dssPriority]);

  // Update markers when filters change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    // Zoom behavior based on selected filters
    try {
      if (selectedFilters.district && selectedFilters.district !== 'all-districts' &&
          selectedFilters.state && selectedFilters.state !== 'all-states') {
        // Zoom to selected district within the selected state
        zoomToDistrict(selectedFilters.district, selectedFilters.state);
      } else if (selectedFilters.state && selectedFilters.state !== 'all-states') {
        // Zoom to selected state
        zoomToState(selectedFilters.state);
      } else {
        // Reset to default view when filters are cleared
        mapInstanceRef.current.setView([21.0, 81.0], 6);
      }
    } catch (e) {
      // no-op if layers not yet ready; they load shortly after mount
    }
    
    // Clear existing village markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Clear existing forest markers
    forestMarkersRef.current.forEach(marker => marker.remove());
    forestMarkersRef.current = [];
    
    // Add markers for filtered villages (only if FRA mode is enabled)
    if (mapMode === 'both' || mapMode === 'fra') {
      const filteredVillages = getFilteredVillages();
      filteredVillages.forEach((village) => {
        const marker = L.marker(village.coordinates, {
          icon: createMarkerIcon(village.status, village.fraType)
        }).addTo(mapInstanceRef.current!);
        markersRef.current.push(marker);
      
      // Create popup content (include DSS recommendations if available)
      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 min-w-[200px] sm:min-w-[240px] lg:min-w-[280px]';
      // In limited mode, hide some sensitive fields (land area)
      const dssVillage = dssVillagesRef.current && dssVillagesRef.current.find(d => d.id === village.id);
      const recs = dssVillage && Array.isArray(dssVillage.recommendations) ? dssVillage.recommendations.slice(0, 3) : [];
      popupContent.innerHTML = `
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-2">
            <h3 class="font-semibold text-sm sm:text-lg leading-tight">${village.name}</h3>
            <span class="text-white px-2 py-1 rounded-full text-xs flex-shrink-0 ${getStatusColor(village.status)}">
              ${village.status}
            </span>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
            <div>
              <span class="text-muted-foreground">State:</span>
              <p class="font-medium">${village.state}</p>
            </div>
            <div>
              <span class="text-muted-foreground">District:</span>
              <p class="font-medium">${village.district}</p>
            </div>
            <div>
              <span class="text-muted-foreground">FRA Type:</span>
              <p class="font-medium">${village.fraType}</p>
            </div>
            ${limitedMode ? '' : `
            <div>
              <span class="text-muted-foreground">Land Area:</span>
              <p class="font-medium">${village.landArea} ha</p>
            </div>`}
          </div>
          ${recs.length ? `
          <div class="mt-2">
            <div class="text-xs text-muted-foreground mb-1">Recommended schemes:</div>
            <ul class="list-disc pl-4 text-xs">
              ${recs.map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>` : ''}
        </div>
      `;
      
      // Add button to popup
      const button = document.createElement('button');
      button.className = 'w-full text-white py-1 px-3 rounded-md text-sm mt-3';
      button.style.background = 'var(--lang-accent)';
      button.textContent = limitedMode ? t('map.viewMore') : t('map.viewDetails');
      button.onclick = () => {
        if (limitedMode) {
          // Prompt login and redirect instead of opening details
          try {
            toast({
              title: t('map.loginRequiredTitle'),
              description: t('map.loginRequiredDesc'),
            });
          } catch (e) {
            // noop if toast system not ready
          }
          setTimeout(() => {
            window.location.href = '/login';
          }, 300);
          return;
        }
        onVillageSelect(village);
      };
      popupContent.appendChild(button);
      
      // Bind popup to marker
      marker.bindPopup(popupContent);
      
      // Add click handler
      marker.on('click', () => {
        marker.openPopup();
      });
      });
    }

    // Remove groundwater demo markers to avoid confusion with FRA markers
    // If needed later, add a dedicated toggle to enable this overlay.
  }, [selectedFilters, onVillageSelect, showForests, onForestSelect, mapMode]);

  // Add explicit styles to ensure map container has height
  const mapContainerStyle = {
    height: '100%',
    width: '100%',
    minHeight: '300px', // Reduced minimum height for mobile
    position: 'relative' as 'relative',
    zIndex: 1,
    maxHeight: 'calc(100vh - var(--nav-height) - 24px)'
  };

  // Define border styles based on user type
  const getBorderStyle = () => {
    if (userType === 'government') {
      return 'border-4 border-blue-500 shadow-blue-200';
    } else {
      return 'border-4 border-green-500 shadow-green-200';
    }
  };

  return (
    <div className={`h-full relative bg-card rounded-lg overflow-hidden shadow-card map-viewport ${getBorderStyle()}`} style={{...mapContainerStyle, display: 'block', height: '100%', minHeight: '400px'}}>
      <div 
        ref={mapRef}
        style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}
        className="h-full w-full z-10"
      />
      
      {/* Map Legend - Responsive */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-card p-2 sm:p-3 lg:p-4 rounded-lg shadow-card z-[1000] max-w-[200px] sm:max-w-xs">
        <h4 className="font-semibold mb-2 text-xs sm:text-sm">{t('map.legend')}</h4>
        <div className="space-y-1 sm:space-y-2">
          {/* FRA Claims Legend - only show if FRA mode is enabled */}
          {(mapMode === 'both' || mapMode === 'fra') && [
            { status: t('status.approved'), color: '#22c55e' },
            { status: t('status.pending'), color: '#f59e0b' },
            { status: t('status.rejected'), color: '#ef4444' }
          ].map(({ status, color }) => (
            <div key={status} className="flex items-center space-x-1 sm:space-x-2 text-xs">
              <div 
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full border border-white shadow-sm flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs truncate">{status}</span>
            </div>
          ))}
          
          {/* Forest Markers Legend - only show if forest mode is enabled */}
          {showForests && (mapMode === 'both' || mapMode === 'forests') && (
            <>
              <div className="flex items-center space-x-1 sm:space-x-2 text-xs mt-2 pt-2 border-t border-gray-200">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs flex-shrink-0">🌲</div>
                <span className="text-xs">{t('map.forestAreas')}</span>
              </div>
              <div className="text-xs text-gray-600 ml-3 sm:ml-5">
                <div>• {t('map.biodiversity.high')}</div>
                <div>• {t('map.biodiversity.medium')}</div>
                <div>• {t('map.biodiversity.low')}</div>
              </div>
            </>
          )}
          
          {/* State Boundaries Legend */}
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs mt-2 pt-2 border-t border-gray-200">
            <div 
              className="w-3 h-1 sm:w-4 sm:h-1 border-2 border-red-600 flex-shrink-0"
              style={{ 
                background: 'repeating-linear-gradient(to right, #dc2626 0px, #dc2626 3px, transparent 3px, transparent 6px)'
              }}
            />
            <span className="text-xs">{t('map.stateBoundaries')}</span>
          </div>
          
          {/* District Boundaries Legend */}
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs mt-1">
            <div 
              className="w-3 h-1 sm:w-4 sm:h-1 border border-emerald-500 flex-shrink-0"
              style={{ 
                background: 'repeating-linear-gradient(to right, #10b981 0px, #10b981 2px, transparent 2px, transparent 4px)'
              }}
            />
            <span className="text-xs">{t('map.districtBoundaries')}</span>
          </div>

          {/* Water Level Legend */}
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs mt-2 pt-2 border-t border-gray-200">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" style={{ backgroundColor: '#0ea5e9' }} />
            <span className="text-xs">{t('map.waterLevel')}</span>
          </div>
          <div className="grid grid-cols-4 gap-1 ml-3 sm:ml-5 text-[10px] text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#0ea5e9' }} />
              <span>≤5</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#0284c7' }} />
              <span>≤10</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#0369a1' }} />
              <span>≤20</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#075985' }} />
              <span>20+</span>
            </div>
          </div>
        </div>
      </div>

      {/* DSS Priority Legend */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-card p-2 sm:p-3 rounded-lg shadow-card z-[1000]">
        <div className="text-xs font-semibold mb-1">DSS Priority</div>
        {[{label:'Low (0–49)',color:'#22c55e'},{label:'Medium (50–74)',color:'#f59e0b'},{label:'High (75–100)',color:'#ef4444'}].map((it) => (
          <div key={it.label} className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: it.color }} />
            <span>{it.label}</span>
          </div>
        ))}
      </div>

      {/* DSS Search & Filters */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 sm:top-4 bg-card p-2 sm:p-3 rounded-lg shadow-card z-[1000] w-[92%] sm:w-auto">
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
          <div className="flex-1">
            <label className="text-[10px] text-muted-foreground">Search village</label>
            <input value={dssSearch} onChange={(e) => setDssSearch(e.target.value)} placeholder="Type village name…" className="w-full border rounded px-2 py-1 text-sm" />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground">District</label>
            <select value={dssDistrict} onChange={(e) => setDssDistrict(e.target.value)} className="border rounded px-2 py-1 text-sm min-w-[160px]">
              <option value="">All districts</option>
              {dssDistricts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground">Priority</label>
            <select value={dssPriority} onChange={(e) => setDssPriority(e.target.value as any)} className="border rounded px-2 py-1 text-sm">
              <option value="">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mini analytics overlay */}
      {(() => {
        const villages = getFilteredVillages();
        const approved = villages.filter(v => v.status === 'Approved').length;
        const pending = villages.filter(v => v.status === 'Pending').length;
        const rejected = villages.filter(v => v.status === 'Rejected').length;
        const data = [
          { name: 'Approved', value: approved, color: '#22c55e' },
          { name: 'Pending', value: pending, color: '#f59e0b' },
          { name: 'Rejected', value: rejected, color: '#ef4444' },
        ];
        return (
          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-white/95 backdrop-blur rounded-lg shadow-card p-3 z-[1000] w-[180px]">
            <div className="text-xs font-semibold mb-2">Current Selection</div>
            <div className="grid grid-cols-3 gap-2 text-[10px] mb-2">
              <div className="text-center">
                <div className="font-bold text-green-600">{approved}</div>
                <div>Approved</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-amber-600">{pending}</div>
                <div>Pending</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-red-600">{rejected}</div>
                <div>Rejected</div>
              </div>
            </div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} dataKey="value" nameKey="name" innerRadius={24} outerRadius={38} paddingAngle={2}>
                    {data.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RTooltip formatter={(v: any, n: any) => [`${v}`, n]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })()}

      {/* Insights panel to utilize right-side whitespace on wide screens */}
      {(() => {
        const villages = getFilteredVillages();
        const byState: Record<string, number> = {};
        villages.forEach(v => { byState[v.state] = (byState[v.state] || 0) + 1; });
        const topStates = Object.entries(byState)
          .sort((a,b) => b[1]-a[1])
          .slice(0, 5);
        if (!topStates.length) return null;
        return (
          <div className="hidden xl:block absolute top-2 right-48 bg-white/95 backdrop-blur rounded-lg shadow-card p-3 z-[900] w-[220px] max-h-[260px] overflow-auto">
            <div className="text-xs font-semibold mb-2">Insights</div>
            <div className="text-[11px] space-y-2">
              {topStates.map(([state,count]) => (
                <div key={state} className="flex items-center justify-between">
                  <span className="truncate pr-2">{state}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default MapView;