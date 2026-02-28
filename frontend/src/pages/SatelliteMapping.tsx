import React, { useState, useEffect, useRef } from 'react';
import {
    Satellite,
    LayoutDashboard,
    FileText,
    BarChart3,
    Settings,
    TreePine,
    Droplets,
    Sprout,
    Terminal,
    Play
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';

const GEE_CODE = `// ===================== AUTOMATED ASSET MAPPING (4 STATES) =====================
// Datasets: Hansen Forests, JRC Water, ESA WorldCover (2021)

// ======= Load Datasets =======
var hansen = ee.Image('UMD/hansen/global_forest_change_2020_v1_8');
var jrc = ee.Image("JRC/GSW1_3/GlobalSurfaceWater");
var worldCover = ee.Image('ESA/WorldCover/v200/2021');

// ======= Create Masks =======
var forestMask = hansen.select('treecover2000').gte(40); // ≥40% tree cover
var waterMask = jrc.select('occurrence').gte(50);        // ≥50% water occurrence
var croplandMask = worldCover.eq(40);                    // ESA Code 40 = Cropland

// ======= Define State Boundaries (bounding boxes) =======
var odisha = ee.Geometry.Rectangle([81.3, 17.5, 87.5, 22.3]);
var telangana = ee.Geometry.Rectangle([77.0, 15.8, 81.2, 19.5]);
var tripura = ee.Geometry.Rectangle([91.0, 22.5, 92.3, 24.5]);
var madhyaPradesh = ee.Geometry.Rectangle([74.0, 21.0, 82.0, 26.0]);

// ======= Visualization Styles =======
var forestVis = {palette: ['228B22'], opacity: 0.6}; // dark green
var riverVis = {palette: ['0000FF'], opacity: 0.5};  // blue
var cropVis = {palette: ['FFD700'], opacity: 0.5};   // yellow

// ======= Function to Display a State =======
function showStateAssets(stateName, bounds, zoomLevel) {
  var forestState = forestMask.clip(bounds);
  var waterState = waterMask.clip(bounds);
  var croplandState = croplandMask.clip(bounds);

  // Add layers for the state
  Map.addLayer(waterState.updateMask(waterState), riverVis, 'Water - ' + stateName);
  Map.addLayer(forestState.updateMask(forestState), forestVis, 'Forest - ' + stateName);
  Map.addLayer(croplandState.updateMask(croplandState), cropVis, 'Farmland - ' + stateName);
}

// ======= Display All 4 States =======
showStateAssets('Odisha', odisha, 7);
showStateAssets('Telangana', telangana, 7);
showStateAssets('Tripura', tripura, 8);
showStateAssets('Madhya Pradesh', madhyaPradesh, 6);

// ======= Optional: Draw borders for clarity =======
Map.addLayer(ee.Image().paint(odisha, 1, 2), {palette: ['red']}, 'Odisha Border');
Map.addLayer(ee.Image().paint(telangana, 1, 2), {palette: ['orange']}, 'Telangana Border');
Map.addLayer(ee.Image().paint(tripura, 1, 2), {palette: ['yellow']}, 'Tripura Border');
Map.addLayer(ee.Image().paint(madhyaPradesh, 1, 2), {palette: ['purple']}, 'Madhya Pradesh Border');

// ======= Center the map to show all states =======
var allStates = odisha.union(telangana).union(tripura).union(madhyaPradesh);
Map.centerObject(allStates, 5);

print("✅ Forests, Water Bodies, and Farmlands loaded for 4 states!");`;

const SatelliteMapping: React.FC = () => {
    const [activeTab, setActiveTab] = useState('satellite');
    const [showCode, setShowCode] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMapRef = useRef<L.Map | null>(null);

    const states = [
        { name: 'Odisha', bounds: [[17.5, 81.3], [22.3, 87.5]] as [number, number][], color: 'red' },
        { name: 'Telangana', bounds: [[15.8, 77.0], [19.5, 81.2]] as [number, number][], color: 'orange' },
        { name: 'Tripura', bounds: [[22.5, 91.0], [24.5, 92.3]] as [number, number][], color: 'yellow' },
        { name: 'Madhya Pradesh', bounds: [[21.0, 74.0], [26.0, 82.0]] as [number, number][], color: 'purple' },
    ];

    useEffect(() => {
        if (!showCode && mapRef.current && !leafletMapRef.current && activeTab === 'satellite') {
            window.setTimeout(() => {
                if (!mapRef.current) return;

                const map = L.map(mapRef.current, {
                    zoomControl: false,
                    attributionControl: false
                }).setView([21.0, 79.0], 5);

                leafletMapRef.current = map;

                L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png').addTo(map);

                states.forEach(state => {
                    const bounds = L.latLngBounds(state.bounds);
                    const rect = L.rectangle(bounds, { color: state.color, weight: 2, fillOpacity: 0.1 }).addTo(map);

                    rect.bindPopup(
                        '<div class="font-sans text-black p-1">' +
                        '<h3 class="font-bold border-b pb-1 mb-1">' + state.name + '</h3>' +
                        '<div class="text-xs space-y-1 mt-2">' +
                        '<div class="flex items-center gap-1"><div class="w-2 h-2 bg-green-600 rounded-full inline-block"></div> Forest Cover (Hansen)</div>' +
                        '<div class="flex items-center gap-1"><div class="w-2 h-2 bg-blue-600 rounded-full inline-block"></div> Surface Water (JRC)</div>' +
                        '<div class="flex items-center gap-1"><div class="w-2 h-2 bg-yellow-500 rounded-full inline-block"></div> Croplands (ESA)</div>' +
                        '</div>' +
                        '</div>'
                    );
                });

                // Add the actual map overlays if script has finished 'running'
                if (!isRunning) {
                    // Add simulated data points to mimic GEE analysis masks instead of the buggy screenshot
                    states.forEach(state => {
                        const bounds = L.latLngBounds(state.bounds);
                        // generate a few random circles within bounds for each type
                        const types = [
                            { color: '#16a34a', count: 15, radius: 15000 }, // Forest (Green)
                            { color: '#2563eb', count: 8, radius: 10000 },  // Water (Blue)
                            { color: '#eab308', count: 12, radius: 12000 }  // Cropland (Yellow)
                        ];

                        types.forEach(t => {
                            for (let i = 0; i < t.count; i++) {
                                const lat = bounds.getSouth() + Math.random() * (bounds.getNorth() - bounds.getSouth());
                                const lng = bounds.getWest() + Math.random() * (bounds.getEast() - bounds.getWest());
                                L.circle([lat, lng], {
                                    color: t.color,
                                    fillColor: t.color,
                                    fillOpacity: 0.6,
                                    radius: t.radius,
                                    stroke: false
                                }).addTo(map);
                            }
                        });
                    });
                }

            }, 100);
        }

        return () => {
            if (leafletMapRef.current) {
                leafletMapRef.current.remove();
                leafletMapRef.current = null;
            }
        };
    }, [showCode, activeTab, isRunning]);

    const handleRunScript = () => {
        setIsRunning(true);
        setTimeout(() => {
            setIsRunning(false);
        }, 3000);
    };

    return (
        <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
            {/* Dark Sidebar Overlay */}
            <aside className="w-72 bg-[#111111] border-r border-[#222] flex flex-col justify-between z-20">
                <div>
                    <div className="p-6">
                        <h1 className="text-xl font-bold tracking-wider text-green-500 flex items-center gap-2">
                            <Sprout className="w-6 h-6" />
                            FRA PORTAL
                        </h1>
                    </div>

                    <nav className="space-y-1 px-3 mt-4">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={"w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors " + (activeTab === 'overview' ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white')}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('applications')}
                            className={"w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors " + (activeTab === 'applications' ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white')}
                        >
                            <FileText className="w-5 h-5" />
                            Applications
                        </button>
                        <button
                            onClick={() => setActiveTab('satellite')}
                            className={"w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors " + (activeTab === 'satellite' ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white')}
                        >
                            <Satellite className="w-5 h-5 text-blue-400" />
                            <div className="text-left">
                                <div>Satellite AI</div>
                                <div className="text-[10px] text-gray-500 font-normal leading-tight mt-0.5">Analyzes land cover (forests/water/farmland) on the map</div>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('reports')}
                            className={"w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors " + (activeTab === 'reports' ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white')}
                        >
                            <BarChart3 className="w-5 h-5" />
                            Reports
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={"w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors " + (activeTab === 'settings' ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white')}
                        >
                            <Settings className="w-5 h-5" />
                            Settings
                        </button>
                    </nav>
                </div>

                <div className="p-4 border-t border-[#222]">
                    <div className="flex items-center gap-3 cursor-pointer hover:bg-[#1a1a1a] p-2 rounded-lg transition-colors">
                        <div className="w-10 h-10 rounded-full bg-blue-900 border border-blue-700 flex flex-shrink-0 items-center justify-center text-blue-300 font-bold">
                            PS
                        </div>
                        <div>
                            <p className="font-medium text-sm">Priya Sharma</p>
                            <p className="text-xs text-gray-500">District Collector</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative flex flex-col bg-[#0a0a0a]">
                {activeTab === 'satellite' ? (
                    <>
                        {/* Top Toolbar */}
                        <div className="h-16 border-b border-[#222] flex items-center justify-between px-6 bg-[#111111] z-10 w-full">
                            <div className="flex items-center gap-6">
                                <h2 className="text-lg font-semibold tracking-wide flex items-center gap-2">
                                    <Satellite className="w-5 h-5 text-blue-500" />
                                    Earth Engine Asset Mapping
                                </h2>
                                <div className="hidden md:flex gap-4">
                                    <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-950/40 px-2 py-1 rounded border border-green-900/50">
                                        <TreePine className="w-3 h-3" /> Forests (Hansen)
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-blue-400 bg-blue-950/40 px-2 py-1 rounded border border-blue-900/50">
                                        <Droplets className="w-3 h-3" /> Water (JRC)
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-yellow-400 bg-yellow-950/40 px-2 py-1 rounded border border-yellow-900/50">
                                        <div className="w-2 h-2 rounded-full bg-yellow-400" /> Cropland (ESA)
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={() => setShowCode(!showCode)}
                                    variant="outline"
                                    size="sm"
                                    className="bg-[#1a1a1a] text-gray-300 border-[#333] hover:bg-[#222] hover:text-white"
                                >
                                    <Terminal className="w-4 h-4 mr-2" />
                                    {showCode ? 'View Map' : 'View Core Script'}
                                </Button>
                                <Button
                                    onClick={handleRunScript}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-white border-transparent"
                                >
                                    <Play className="w-4 h-4 mr-2" />
                                    {isRunning ? 'Running Analysis...' : 'Run Analysis'}
                                </Button>
                            </div>
                        </div>

                        {/* Content Container */}
                        <div className="flex-1 relative flex overflow-hidden">
                            {showCode ? (
                                <div className="flex-1 p-6 overflow-y-auto bg-[#0d1117]">
                                    <div className="max-w-5xl mx-auto">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-gray-300 font-mono text-sm">AutomatedAssetMapping.js</h3>
                                        </div>
                                        <pre className="bg-black border border-[#30363d] p-6 rounded-lg text-[#c9d1d9] font-mono text-sm leading-relaxed overflow-x-auto shadow-2xl">
                                            <code>{GEE_CODE}</code>
                                        </pre>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 relative">
                                    {/* Map overlay UI to mimic Earth engine output */}
                                    {isRunning && (
                                        <div className="absolute inset-0 bg-black/60 z-[400] flex flex-col items-center justify-center backdrop-blur-sm">
                                            <Satellite className="w-12 h-12 text-blue-500 animate-bounce mb-4" />
                                            <div className="text-xl font-semibold mb-2">Analyzing Satellite Imagery...</div>
                                            <div className="text-sm text-gray-400 font-mono">Loading Hansen Forests, JRC Water, and ESA WorldCover</div>
                                            <div className="w-64 h-1.5 bg-[#222] rounded-full mt-4 overflow-hidden">
                                                <div className="h-full bg-blue-500 w-1/2 animate-pulse rounded-full"></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Fake Console Output at bottom */}
                                    <div className="absolute bottom-4 left-4 right-4 h-24 bg-black/80 backdrop-blur-md border border-[#333] z-[400] rounded-lg p-3 font-mono text-xs overflow-y-auto shadow-2xl">
                                        <div className="text-gray-400 mb-1">Earth Engine Console</div>
                                        {isRunning ? (
                                            <div className="text-yellow-400">Executing script across distributed workers...</div>
                                        ) : (
                                            <>
                                                <div className="text-green-400 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
                                                    ✅ Forests, Water Bodies, and Farmlands loaded for 4 states!
                                                </div>
                                                <div className="text-gray-300 mt-1">&gt; Rendered bounds for Odisha, Telangana, Tripura, Madhya Pradesh.</div>
                                            </>
                                        )}
                                    </div>

                                    <div
                                        ref={mapRef}
                                        className="w-full h-full bg-[#0a0a0a] z-10"
                                    />
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center p-6 text-gray-500">
                        Select "Satellite AI" from the menu to view the Earth Engine integration.
                    </div>
                )}
            </main>
        </div>
    );
};

export default SatelliteMapping;
