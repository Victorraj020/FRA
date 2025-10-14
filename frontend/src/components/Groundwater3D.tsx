import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

declare global {
  interface Window {
    Plotly?: any;
  }
}

// Small helper to load Plotly from CDN once
const loadPlotly = async (): Promise<any> => {
  if (window.Plotly) return window.Plotly;
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.plot.ly/plotly-2.27.0.min.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Plotly'));
    document.body.appendChild(script);
  });
  return window.Plotly;
};

// Generate mock groundwater grid (replace with real data later)
function generateGroundwaterGrid(size: number, seed = 0) {
  const z: number[][] = [];
  for (let y = 0; y < size; y++) {
    const row: number[] = [];
    for (let x = 0; x < size; x++) {
      const nx = (x - size / 2) / size;
      const ny = (y - size / 2) / size;
      // Simple smooth variations + a few sink holes to mimic wells/depressions
      const base = 120 + 40 * Math.sin(4 * nx + seed) * Math.cos(3 * ny + seed * 0.7);
      const sink1 = 70 * Math.exp(-((nx + 0.25) ** 2 + (ny - 0.2) ** 2) * 40);
      const sink2 = 55 * Math.exp(-((nx - 0.15) ** 2 + (ny + 0.25) ** 2) * 55);
      row.push(base - sink1 - sink2);
    }
    z.push(row);
  }
  return z;
}

const Groundwater3D: React.FC<{ state?: string; district?: string }> = ({ state = 'All', district = 'All' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [resolution, setResolution] = useState<'low' | 'med' | 'high'>('med');
  const [seed, setSeed] = useState<number>(0);
  const [overlayEnabled, setOverlayEnabled] = useState<boolean>(true);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.25);

  useEffect(() => {
    let mounted = true;
    let plotlyRef: any = null;

    const draw = async () => {
      const Plotly = await loadPlotly();
      if (!mounted || !containerRef.current) return;

      const size = resolution === 'low' ? 40 : resolution === 'high' ? 90 : 60;
      const z = generateGroundwaterGrid(size, seed);

      // Try to load a texture image from public/overlay.png and convert to grayscale surfacecolor
      const loadOverlay = async (): Promise<number[][] | null> => {
        if (!overlayEnabled) return null;
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = '/overlay.png';
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error('overlay load failed'));
          });
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          if (!ctx) return null;
          ctx.drawImage(img, 0, 0, size, size);
          const data = ctx.getImageData(0, 0, size, size).data;
          const surfacecolor: number[][] = [];
          for (let y = 0; y < size; y++) {
            const row: number[] = [];
            for (let x = 0; x < size; x++) {
              const i = (y * size + x) * 4;
              const r = data[i] / 255;
              const g = data[i + 1] / 255;
              const b = data[i + 2] / 255;
              // luminance grayscale
              row.push(0.2126 * r + 0.7152 * g + 0.0722 * b);
            }
            surfacecolor.push(row);
          }
          return surfacecolor;
        } catch {
          return null;
        }
      };
      const overlay = await loadOverlay();

      const surface = {
        z,
        type: 'surface',
        colorscale: 'Earth',
        showscale: true,
        colorbar: {
          title: 'Water Level (m)',
          titleside: 'right',
          thickness: 14,
          len: 0.9
        },
        contours: {
          z: {
            show: true,
            usecolormap: false,
            highlightcolor: '#333333',
            highlightwidth: 1.2,
            project: { z: true }
          }
        },
        lighting: {
          ambient: 0.55,
          diffuse: 0.75,
          specular: 0.25,
          roughness: 0.9,
          fresnel: 0.2
        },
        lightposition: { x: 160, y: -160, z: 300 },
        hoverinfo: 'x+y+z'
      } as any;

      const titleSuffix = state && state !== 'All' ? ` — ${state}` : '';
      const layout = {
        margin: { l: 0, r: 0, t: 0, b: 0 },
        paper_bgcolor: 'transparent',
        scene: {
          xaxis: { title: 'x', backgroundcolor: 'rgba(0,0,0,0)', gridcolor: 'rgba(0,0,0,0.08)' },
          yaxis: { title: 'y', backgroundcolor: 'rgba(0,0,0,0)', gridcolor: 'rgba(0,0,0,0.08)' },
          zaxis: { title: 'Elevation (m)', gridcolor: 'rgba(0,0,0,0.08)' },
          aspectmode: 'manual',
          aspectratio: { x: 1, y: 1, z: 0.25 },
          camera: { eye: { x: 1.7, y: -2.1, z: 0.55 } }
        },
        showlegend: false,
      } as any;

      const config = {
        displaylogo: false,
        responsive: true,
        modeBarButtonsToRemove: ['toImage']
      } as any;

      const traces: any[] = [surface];
      if (overlay) {
        traces.push({
          z: z.map((row) => row.map((v) => v + 0.5)),
          type: 'surface',
          surfacecolor: overlay,
          colorscale: 'Gray',
          showscale: false,
          opacity: Math.min(Math.max(overlayOpacity, 0), 1),
          hoverinfo: 'skip',
          lighting: { ambient: 0.7, diffuse: 0.3 },
        });
      }

      await Plotly.react(containerRef.current, traces, layout, config);
      plotlyRef = Plotly;
    };

    draw();

    const handleResize = () => {
      if (plotlyRef && containerRef.current) {
        plotlyRef.Plots.resize(containerRef.current);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      mounted = false;
      window.removeEventListener('resize', handleResize);
    };
  }, [resolution, seed, state, district, overlayEnabled, overlayOpacity]);

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">3D Groundwater Levels {state && state !== 'All' ? `— ${state}` : ''}</CardTitle>
        <div className="flex items-center gap-2">
          <Select value={resolution} onValueChange={(v: any) => setResolution(v)}>
            <SelectTrigger className="h-8 w-[130px]"><SelectValue placeholder="Resolution" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low detail</SelectItem>
              <SelectItem value="med">Medium</SelectItem>
              <SelectItem value="high">High detail</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setSeed((s) => s + 1)}>Randomize</Button>
          <div className="flex items-center gap-2 pl-2">
            <span className="text-xs text-muted-foreground">Texture</span>
            <Switch checked={overlayEnabled} onCheckedChange={setOverlayEnabled} />
          </div>
          <div className="flex items-center gap-2 w-40">
            <span className="text-xs text-muted-foreground">Opacity</span>
            <Slider value={[Math.round(overlayOpacity * 100)]} onValueChange={(v) => setOverlayOpacity((v?.[0] ?? 25) / 100)} step={5} min={0} max={100} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} style={{ width: '100%', height: 420 }} />
        <p className="text-xs text-muted-foreground mt-2">
          Showing synthetic groundwater surface for demo. Wire to real district/year data when available.
        </p>
      </CardContent>
    </Card>
  );
};

export default Groundwater3D;


