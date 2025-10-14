import React from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type VillageRow = {
  village_code: number | string;
  village_name: string;
  state?: string;
  district?: string;
  block?: string;
  fra_beneficiary_count?: number;
  pm_kisan_count?: number;
  jjm_coverage_pct?: number;
  water_stress_score?: number;
  priority_score?: number;
  recommendations?: string[];
};

const getPriorityColor = (s: number) => {
  if (s >= 75) return '#ef4444';
  if (s >= 50) return '#f59e0b';
  return '#22c55e';
};

const VillagesList: React.FC = () => {
  const [rows, setRows] = React.useState<VillageRow[]>([]);
  const [q, setQ] = React.useState('');
  const [district, setDistrict] = React.useState('');
  const [priority, setPriority] = React.useState('');
  const [districts, setDistricts] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let gj: any;
        try {
          gj = await api.dss.getVillagesGeoJSON();
        } catch {
          const resp = await fetch('/dssnewbhoomi/data/village_indicators.geojson');
          gj = await resp.json();
        }
        const feats = Array.isArray(gj?.features) ? gj.features : [];
        const out: VillageRow[] = feats.map((f: any) => {
          const p = f?.properties || {};
          return {
            village_code: p.village_code,
            village_name: p.village_name,
            state: p.state,
            district: p.district,
            block: p.block,
            fra_beneficiary_count: p.fra_beneficiary_count,
            pm_kisan_count: p.pm_kisan_count,
            jjm_coverage_pct: p.jjm_coverage_pct,
            water_stress_score: p.water_stress_score,
            priority_score: p.priority_score,
            recommendations: Array.isArray(p.recommendations) ? p.recommendations : [],
          } as VillageRow;
        });
        setRows(out);
        const dset = Array.from(new Set(out.map(r => r.district).filter(Boolean))) as string[];
        setDistricts(dset.sort());
      } catch (e: any) {
        setError(e?.message || 'Failed to load villages');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = rows.filter((r) => {
    const qok = !q || String(r.village_name || '').toLowerCase().includes(q.toLowerCase());
    const dok = !district || r.district === district;
    const s = Number(r.priority_score || 0);
    const pok = !priority || (priority === 'low' ? s < 50 : priority === 'medium' ? s >= 50 && s < 75 : s >= 75);
    return qok && dok && pok;
  });

  return (
    <div className="container mx-auto px-4 py-4 max-w-6xl">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-bold">Villages</h1>
        <div className="flex items-center gap-2">
          <div className="text-xs">{loading ? 'Loading…' : `${filtered.length} / ${rows.length}`}</div>
        </div>
      </div>

      <Card className="mb-3">
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input className="border rounded px-2 py-1 text-sm flex-1" placeholder="Search village…" value={q} onChange={(e) => setQ(e.target.value)} />
            <select className="border rounded px-2 py-1 text-sm" value={district} onChange={(e) => setDistrict(e.target.value)}>
              <option value="">All districts</option>
              {districts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select className="border rounded px-2 py-1 text-sm" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="">Priority: All</option>
              <option value="low">Low (0–49)</option>
              <option value="medium">Medium (50–74)</option>
              <option value="high">High (75–100)</option>
            </select>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 text-xs">
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-sm" style={{background:'#22c55e'}}></span>Low (0–49)</div>
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-sm" style={{background:'#f59e0b'}}></span>Medium (50–74)</div>
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-sm" style={{background:'#ef4444'}}></span>High (75–100)</div>
          </div>
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((r) => {
          const s = Number(r.priority_score || 0);
          const color = getPriorityColor(s);
          const rec0 = (r.recommendations || [])[0];
          return (
            <Card key={r.village_code} className="group relative">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{r.village_name}</div>
                    <div className="text-xs text-muted-foreground">{r.district}{r.block ? ` • ${r.block}` : ''}</div>
                  </div>
                  <div className="px-2 py-1 text-xs rounded text-white" style={{background: color}}>{s || 0}/100</div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div>👥 FRA: {r.fra_beneficiary_count ?? '—'}</div>
                  <div>🌾 PM-Kisan: {r.pm_kisan_count ?? '—'}</div>
                  <div>🚰 JJM: {r.jjm_coverage_pct ?? '—'}%</div>
                  <div>💧 Stress: {Number(r.water_stress_score || 0).toFixed(2)}</div>
                </div>
                {rec0 && <div className="mt-2 text-xs">📊 {rec0}</div>}
                <div className="mt-3 flex justify-end">
                  <Button size="sm" onClick={() => { window.location.href = `/village/${r.village_code}`; }}>View Details</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default VillagesList;


