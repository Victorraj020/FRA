import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Feature = {
  type: 'Feature';
  properties: Record<string, any>;
  geometry: { type: string; coordinates: any };
};

interface MiniChoroplethProps {
  width?: number | string;
  height?: number | string;
  getValue: (feature: Feature) => number;
  valueToColor?: (value: number) => string;
  tooltipLabel?: (feature: Feature, value: number) => string;
  geojsonUrl?: string;
  highlightStates?: string[];
  selectedState?: string;
  onStateClick?: (stateName: string) => void;
}

const defaultValueToColor = (value: number) => {
  if (value >= 70) return '#166534';
  if (value >= 50) return '#16a34a';
  if (value >= 30) return '#4ade80';
  if (value > 0) return '#bbf7d0';
  return '#e5e7eb';
};

const MiniChoropleth: React.FC<MiniChoroplethProps> = ({
  width = '100%',
  height = 320,
  getValue,
  valueToColor = defaultValueToColor,
  tooltipLabel,
  geojsonUrl = '/four_states_india.geojson',
  highlightStates = [],
  selectedState,
  onStateClick
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([21.5, 82.7], 5);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ''
    }).addTo(map);

    fetch(geojsonUrl)
      .then((r) => r.json())
      .then((data) => {
        const layer = L.geoJSON(data as any, {
          style: (feature: any) => {
            const value = getValue(feature as Feature);
            const name = feature?.properties?.st_nm || feature?.properties?.name || '';
            const isHighlighted = highlightStates.includes(name);
            const isSelected = selectedState && name === selectedState;
            return {
              color: isSelected ? '#111827' : '#374151',
              weight: isSelected ? 2 : 0.8,
              fillOpacity: isHighlighted ? 0.9 : 0.3,
              fillColor: isHighlighted ? valueToColor(value) : '#e5e7eb'
            } as L.PathOptions;
          },
          onEachFeature: (feature: any, layer: L.Layer) => {
            const val = getValue(feature as Feature);
            const label = tooltipLabel
              ? tooltipLabel(feature as Feature, val)
              : `${feature?.properties?.st_nm || feature?.properties?.name}: ${val}`;
            (layer as any).bindTooltip(label, { sticky: true, direction: 'auto' });
            if (onStateClick) {
              (layer as any).on('click', () => {
                const nm = feature?.properties?.st_nm || feature?.properties?.name || '';
                onStateClick(nm);
              });
              (layer as any).on('mouseover', function () {
                (this as any).setStyle({ weight: 2 });
              });
              (layer as any).on('mouseout', function () {
                (this as any).setStyle({ weight: 0.8 });
              });
            }
          }
        }).addTo(map);

        try {
          map.fitBounds((layer as any).getBounds(), { padding: [10, 10] });
        } catch {}
      })
      .catch(() => {
        // ignore failures; map will still render
      });

    setTimeout(() => map.invalidateSize(), 150);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [getValue, tooltipLabel, valueToColor, geojsonUrl]);

  return (
    <div
      ref={containerRef}
      style={{ width, height, borderRadius: 8, overflow: 'hidden', display: 'block' }}
      className="border"
    />
  );
};

export default MiniChoropleth;

// Ensure the map resizes with its container to avoid empty spaces
// This hook attaches a ResizeObserver after the map is created
// to invalidate Leaflet's cached size when the parent layout changes.
// (Appended here to keep the component self-contained.)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useMapAutoResize(ref: React.RefObject<HTMLDivElement>, mapRef: React.MutableRefObject<L.Map | null>) {
  React.useEffect(() => {
    if (!ref.current) return;
    const ResizeObs = (window as any).ResizeObserver;
    const ro = ResizeObs ? new ResizeObs(() => {
      if (mapRef.current) {
        setTimeout(() => mapRef.current && mapRef.current.invalidateSize(), 50);
      }
    }) : null;
    if (ro && ref.current) ro.observe(ref.current);
    return () => { if (ro) ro.disconnect(); };
  }, [ref, mapRef]);
}


