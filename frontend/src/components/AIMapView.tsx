import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  TreePine, 
  Droplets, 
  BarChart3, 
  Home, 
  Brain,
  Eye,
  Filter,
  RefreshCw
} from 'lucide-react';
import { AIAssetMappingService, LandAsset } from '@/services/aiAssetMapping';

interface AIMapViewProps {
  center: { lat: number; lng: number };
  zoom?: number;
  onAssetSelect?: (asset: LandAsset) => void;
  showAnalysis?: boolean;
}

const AIMapView: React.FC<AIMapViewProps> = ({
  center,
  zoom = 10,
  onAssetSelect,
  showAnalysis = true
}) => {
  const [assets, setAssets] = useState<LandAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<LandAsset | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);

  const aiService = AIAssetMappingService.getInstance();

  useEffect(() => {
    if (showAnalysis) {
      loadAssets();
    }
  }, [center, showAnalysis]);

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const result = await aiService.analyzeSatelliteImagery(center, 5);
      setAssets(result.landAssets);
    } catch (error) {
      console.error('Failed to load assets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAssetIcon = (type: LandAsset['type']) => {
    switch (type) {
      case 'forest': return <TreePine className="w-4 h-4 text-green-600" />;
      case 'agricultural': return <BarChart3 className="w-4 h-4 text-yellow-600" />;
      case 'water_body': return <Droplets className="w-4 h-4 text-blue-600" />;
      case 'homestead': return <Home className="w-4 h-4 text-purple-600" />;
      default: return <MapPin className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAssetColor = (type: LandAsset['type']) => {
    switch (type) {
      case 'forest': return 'bg-green-100 border-green-300 text-green-800';
      case 'agricultural': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'water_body': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'homestead': return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'barren': return 'bg-gray-100 border-gray-300 text-gray-800';
      case 'grassland': return 'bg-lime-100 border-lime-300 text-lime-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const filteredAssets = assets.filter(asset => 
    filterType === 'all' || asset.type === filterType
  );

  const assetTypes = [
    { id: 'all', label: 'All Types', icon: MapPin },
    { id: 'forest', label: 'Forest', icon: TreePine },
    { id: 'agricultural', label: 'Agricultural', icon: BarChart3 },
    { id: 'water_body', label: 'Water Body', icon: Droplets },
    { id: 'homestead', label: 'Homestead', icon: Home }
  ];

  return (
    <div className="space-y-4">
      {/* Map Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-500" />
                AI-Enhanced Map View
              </CardTitle>
              <CardDescription>
                Satellite imagery analysis and land asset detection
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadAssets}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnalysisPanel(!showAnalysisPanel)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showAnalysisPanel ? 'Hide' : 'Show'} Analysis
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 mb-4">
            Center: {center.lat.toFixed(4)}, {center.lng.toFixed(4)} | 
            Assets Detected: {assets.length} | 
            Analysis: {isLoading ? 'In Progress...' : 'Complete'}
          </div>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {assetTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <Button
                  key={type.id}
                  variant={filterType === type.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType(type.id)}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  {type.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Map Visualization (Mock) */}
      <Card>
        <CardContent className="p-0">
          <div className="relative h-96 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden">
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-yellow-100 to-blue-200 opacity-50"></div>
            
            {/* Mock Grid */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="absolute w-px h-full bg-gray-400" style={{ left: `${i * 5}%` }}></div>
              ))}
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="absolute h-px w-full bg-gray-400" style={{ top: `${i * 6.67}%` }}></div>
              ))}
            </div>

            {/* Asset Markers */}
            {filteredAssets.map((asset, index) => {
              const x = 20 + (Math.random() * 60); // Random position for demo
              const y = 20 + (Math.random() * 60);
              
              return (
                <div
                  key={asset.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  onClick={() => {
                    setSelectedAsset(asset);
                    onAssetSelect?.(asset);
                  }}
                >
                  <div className={`p-2 rounded-full border-2 ${getAssetColor(asset.type)} shadow-lg hover:shadow-xl transition-all`}>
                    {getAssetIcon(asset.type)}
                  </div>
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs font-medium whitespace-nowrap">
                    {asset.type.replace('_', ' ')}
                  </div>
                </div>
              );
            })}

            {/* Center Marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p>Analyzing satellite imagery...</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Asset List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Detected Assets ({filteredAssets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedAsset?.id === asset.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => {
                  setSelectedAsset(asset);
                  onAssetSelect?.(asset);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getAssetIcon(asset.type)}
                    <div>
                      <div className="font-medium capitalize">
                        {asset.type.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-gray-600">
                        {asset.area.toFixed(2)} hectares
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getAssetColor(asset.type)}>
                      {(asset.confidence * 100).toFixed(0)}%
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">
                      {asset.coordinates.lat.toFixed(4)}, {asset.coordinates.lng.toFixed(4)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Asset Details */}
      {selectedAsset && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getAssetIcon(selectedAsset.type)}
              Asset Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Basic Information</h4>
                <div className="space-y-1 text-sm">
                  <div><strong>Type:</strong> {selectedAsset.type.replace('_', ' ')}</div>
                  <div><strong>Area:</strong> {selectedAsset.area.toFixed(2)} hectares</div>
                  <div><strong>Confidence:</strong> {(selectedAsset.confidence * 100).toFixed(1)}%</div>
                  <div><strong>Resolution:</strong> {selectedAsset.metadata.resolution}</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Coordinates</h4>
                <div className="space-y-1 text-sm">
                  <div><strong>Latitude:</strong> {selectedAsset.coordinates.lat.toFixed(6)}</div>
                  <div><strong>Longitude:</strong> {selectedAsset.coordinates.lng.toFixed(6)}</div>
                  <div><strong>Detected:</strong> {new Date(selectedAsset.metadata.detectedAt).toLocaleDateString()}</div>
                  <div><strong>Source:</strong> {selectedAsset.metadata.satelliteSource}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIMapView;
