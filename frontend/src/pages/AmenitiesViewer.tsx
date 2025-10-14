import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type SheetRow = Record<string, any>;

const files = [
  { label: 'Odisha Village amenities (sample)', path: '/dssnewbhoomi/0disha_Village_amenities_2100.xlsx' },
  { label: 'Odisha Town amenities', path: '/dssnewbhoomi/odisha_Town_ameneties.xlsx' }
];

const MAX_ROWS = 200; // limit preview for performance

const AmenitiesViewer: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [rows, setRows] = React.useState<SheetRow[]>([]);
  const [columns, setColumns] = React.useState<string[]>([]);
  const [fileIdx, setFileIdx] = React.useState(0);
  const [sheetName, setSheetName] = React.useState<string>('');
  const [allSheets, setAllSheets] = React.useState<string[]>([]);
  const [q, setQ] = React.useState('');

  const loadFile = React.useCallback(async (idx: number, desiredSheet?: string) => {
    try {
      setLoading(true);
      setError(null);
      const file = files[idx];
      const res = await fetch(file.path);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const ab = await res.arrayBuffer();
      // Lazy-load xlsx via dynamic import from public CDN using eval to keep TS happy without types
      const mod = await (eval("import('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm')") as Promise<any>);
      const wb = mod.read(ab, { type: 'array' });
      const sheet = desiredSheet && wb.SheetNames.includes(desiredSheet) ? desiredSheet : wb.SheetNames[0];
      const ws = wb.Sheets[sheet];
      const json: SheetRow[] = mod.utils.sheet_to_json(ws, { defval: '', raw: true });
      const cols = Object.keys(json[0] || {});
      setRows(json.slice(0, MAX_ROWS));
      setColumns(cols);
      setAllSheets(wb.SheetNames.slice());
      setSheetName(sheet);
    } catch (e: any) {
      setError(e?.message || 'Failed to read XLSX');
      setRows([]);
      setColumns([]);
      setAllSheets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadFile(fileIdx);
  }, [fileIdx, loadFile]);

  const filtered = React.useMemo(() => {
    if (!q) return rows;
    const qq = q.toLowerCase();
    return rows.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(qq)));
  }, [rows, q]);

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-bold">Odisha Amenities (XLSX preview)</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => loadFile(fileIdx, sheetName)}>Reload</Button>
        </div>
      </div>

      <Card className="mb-3">
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">File</div>
              <select className="border rounded px-2 py-1 w-full" value={fileIdx} onChange={(e) => setFileIdx(Number(e.target.value))}>
                {files.map((f, i) => (
                  <option key={f.path} value={i}>{f.label}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Sheet</div>
              <select className="border rounded px-2 py-1 w-full" value={sheetName} onChange={(e) => loadFile(fileIdx, e.target.value)}>
                {allSheets.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <div className="text-xs text-muted-foreground mb-1">Search</div>
              <input className="border rounded px-2 py-1 w-full" placeholder="Type to filter…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </div>
          {error && <div className="text-red-600 mt-3">{error}</div>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Preview {loading ? '(loading...)' : ''}</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-auto border rounded">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  {columns.map((c) => (
                    <th key={c} className="text-left px-2 py-1 whitespace-nowrap border-b">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={i} className={i % 2 ? 'bg-muted/40' : ''}>
                    {columns.map((c) => (
                      <td key={c} className="px-2 py-1 whitespace-nowrap border-b">{String(r[c] ?? '')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-muted-foreground mt-2">Showing up to {Math.min(MAX_ROWS, rows.length)} rows.</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AmenitiesViewer;


