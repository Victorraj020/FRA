import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockForestAreas, ForestArea } from '@/data/mockData';
import { loadRealForestAreas } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  TreePine, 
  MapPin, 
  Shield, 
  Eye, 
  Info,
  ChevronDown,
  X
} from 'lucide-react';

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

// Custom forest area icons based on type
const createForestIcon = (type: string, biodiversity: string) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'National Park': return '#10b981'; // emerald
      case 'Wildlife Sanctuary': return '#059669'; // emerald-600
      case 'Reserve Forest': return '#16a34a'; // green-600
      case 'Protected Forest': return '#15803d'; // green-700
      case 'Community Forest': return '#65a30d'; // lime-600
      case 'Forest Range': return '#84cc16'; // lime-500
      default: return '#6b7280'; // gray-500
    }
  };

  const getBiodiversitySize = (biodiversity: string) => {
    switch (biodiversity) {
      case 'High': return 20;
      case 'Medium': return 16;
      case 'Low': return 12;
      default: return 16;
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
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
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

interface ForestLayoutProps {
  userType?: 'government' | 'local';
  onForestSelect?: (forest: ForestArea) => void;
}

const ForestLayout: React.FC<ForestLayoutProps> = ({ 
  userType = 'government',
  onForestSelect 
}) => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const stateBoundariesRef = useRef<L.Polygon[]>([]);
  const districtBoundariesRef = useRef<L.Polygon[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [forestAreas, setForestAreas] = useState<ForestArea[]>(mockForestAreas);
  const [selectedType, setSelectedType] = useState('all-types');
  const [selectedState, setSelectedState] = useState('all-states');
  const [selectedBiodiversity, setSelectedBiodiversity] = useState('all-biodiversity');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedForest, setSelectedForest] = useState<ForestArea | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Filter forests based on search and filters
  const getFilteredForests = () => {
    return forestAreas.filter(forest => {
      const matchesSearch = forest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          forest.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all-types' || forest.type === selectedType;
      const matchesState = selectedState === 'all-states' || forest.state === selectedState;
      const matchesBiodiversity = selectedBiodiversity === 'all-biodiversity' || forest.biodiversity === selectedBiodiversity;
      
      return matchesSearch && matchesType && matchesState && matchesBiodiversity;
    });
  };

  // Add state boundary overlays
  const addStateBoundaries = async () => {
    if (!mapInstanceRef.current) return;
    
    stateBoundariesRef.current.forEach(boundary => boundary.remove());
    stateBoundariesRef.current = [];
    
    try {
      const response = await fetch('/four_states_india.geojson');
      const geoJsonData = await response.json();
      
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
          const stateName = feature.properties?.NAME_1 || feature.properties?.name || 'State';
          layer.bindPopup(`<div class="text-center"><strong>${stateName}</strong><br/>State Boundary</div>`);
          stateBoundariesRef.current.push(layer as L.Polygon);
        }
      }).addTo(mapInstanceRef.current);
    } catch (error) {
      console.error('Error loading GeoJSON data:', error);
    }
  };

  // Add district boundary overlays
  const addDistrictBoundaries = async () => {
    if (!mapInstanceRef.current) return;
    
    districtBoundariesRef.current.forEach(boundary => boundary.remove());
    districtBoundariesRef.current = [];
    
    try {
      const response = await fetch('/four_states_districts.geojson');
      const geoJsonData = await response.json();
      
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
          const districtName = feature.properties?.NAME_2 || 'District';
          const stateName = feature.properties?.NAME_1 || 'State';
          layer.bindPopup(`<div class="text-center"><strong>${districtName}</strong><br/>${stateName}</div>`);
          districtBoundariesRef.current.push(layer as L.Polygon);
        }
      }).addTo(mapInstanceRef.current);
    } catch (error) {
      console.error('Error loading district GeoJSON data:', error);
    }
  };

  // Initialize map
  useEffect(() => {
    // Load real forest dataset
    loadRealForestAreas().then((data) => {
      if (data && data.length > 0) {
        setForestAreas(data);
      }
    }).catch(() => {
      // keep mocks on failure
    });

    if (mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([21.0, 81.0], 6);
      mapInstanceRef.current = map;
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      setTimeout(() => {
        addStateBoundaries();
        addDistrictBoundaries();
      }, 200);
    }
    
    // Multiple resize calls to ensure proper rendering on mobile
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 100);
    
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 500);

    // Handle window resize for mobile orientation changes
    const handleResize = () => {
      if (mapInstanceRef.current) {
        setTimeout(() => {
          mapInstanceRef.current?.invalidateSize();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      stateBoundariesRef.current.forEach(boundary => boundary.remove());
      stateBoundariesRef.current = [];
      districtBoundariesRef.current.forEach(boundary => boundary.remove());
      districtBoundariesRef.current = [];
      
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when filters change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    const filteredForests = getFilteredForests();
    filteredForests.forEach((forest) => {
      const marker = L.marker(forest.coordinates, {
        icon: createForestIcon(forest.type, forest.biodiversity)
      }).addTo(mapInstanceRef.current!);
      markersRef.current.push(marker);
      
      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 min-w-[280px]';
      popupContent.innerHTML = `
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-lg">${forest.name}</h3>
            <Badge className="bg-green-100 text-green-800">
              ${forest.type}
            </Badge>
          </div>
          
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span class="text-muted-foreground">State:</span>
              <p class="font-medium">${forest.state}</p>
            </div>
            <div>
              <span class="text-muted-foreground">District:</span>
              <p class="font-medium">${forest.district}</p>
            </div>
            <div>
              <span class="text-muted-foreground">Area:</span>
              <p class="font-medium">${forest.area} ha</p>
            </div>
            <div>
              <span class="text-muted-foreground">Forest Cover:</span>
              <p class="font-medium">${forest.forestCover}%</p>
            </div>
            <div>
              <span class="text-muted-foreground">Biodiversity:</span>
              <p class="font-medium">${forest.biodiversity}</p>
            </div>
            <div>
              <span class="text-muted-foreground">Protection:</span>
              <p class="font-medium">${forest.protectionStatus}</p>
            </div>
          </div>
          
          <p class="text-sm text-muted-foreground">${forest.description}</p>
        </div>
      `;
      
      const button = document.createElement('button');
      button.className = 'w-full bg-primary text-white py-2 px-3 rounded-md text-sm mt-3 hover:bg-primary/90';
      button.textContent = 'View Details';
      button.onclick = () => {
        setSelectedForest(forest);
        setShowDetails(true);
        if (onForestSelect) onForestSelect(forest);
        if (forest.name.toLowerCase().includes('satkosia')) {
          navigate('/satkosia');
        }
      };
      popupContent.appendChild(button);
      
      marker.bindPopup(popupContent);
      marker.on('click', () => marker.openPopup());
    });
  }, [searchTerm, selectedType, selectedState, selectedBiodiversity, onForestSelect, forestAreas]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'National Park': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Wildlife Sanctuary': return 'bg-green-100 text-green-800 border-green-200';
      case 'Reserve Forest': return 'bg-lime-100 text-lime-800 border-lime-200';
      case 'Protected Forest': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Community Forest': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Forest Range': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBiodiversityColor = (biodiversity: string) => {
    switch (biodiversity) {
      case 'High': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getProtectionColor = (status: string) => {
    switch (status) {
      case 'Protected': return 'text-green-600';
      case 'Semi-Protected': return 'text-yellow-600';
      case 'Community Managed': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const forestTypes = ['National Park', 'Wildlife Sanctuary', 'Reserve Forest', 'Protected Forest', 'Community Forest', 'Forest Range'];
  const states = ['Madhya Pradesh', 'Odisha', 'Telangana', 'Tripura'];
  const biodiversityLevels = ['High', 'Medium', 'Low'];

  return (
    <div className="h-full flex flex-col max-h-screen forest-layout-container">
      {/* Header with Search and Filters */}
      <div className="bg-white p-3 sm:p-4 border-b shadow-sm flex-shrink-0">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search forests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm sm:text-base"
            />
          </div>
          
          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">Forest Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-types">All Types</SelectItem>
                    {forestTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">State</label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-states">All States</SelectItem>
                    {states.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">Biodiversity</label>
                <Select value={selectedBiodiversity} onValueChange={setSelectedBiodiversity}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-biodiversity">All Levels</SelectItem>
                    {biodiversityLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Map */}
        <div className="flex-1 relative min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] lg:max-h-[calc(100vh-200px)] forest-map-container">
          <div 
            ref={mapRef}
            className="h-full w-full"
            style={{ minHeight: '300px' }}
          />
          
          {/* Map Legend - Responsive positioning */}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white p-2 sm:p-3 lg:p-4 rounded-lg shadow-lg z-[1000] max-w-[200px] sm:max-w-xs">
            <h4 className="font-semibold mb-2 sm:mb-3 text-xs sm:text-sm">Forest Types</h4>
            <div className="space-y-1 sm:space-y-2">
              {forestTypes.map(type => (
                <div key={type} className="flex items-center space-x-1 sm:space-x-2 text-xs">
                  <div 
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                    style={{ 
                      backgroundColor: type === 'National Park' ? '#10b981' :
                                     type === 'Wildlife Sanctuary' ? '#059669' :
                                     type === 'Reserve Forest' ? '#16a34a' :
                                     type === 'Protected Forest' ? '#15803d' :
                                     type === 'Community Forest' ? '#65a30d' : '#84cc16'
                    }}
                  />
                  <span className="text-xs truncate">{type}</span>
                </div>
              ))}
              
              <div className="pt-1 sm:pt-2 border-t border-gray-200">
                <div className="flex items-center space-x-1 sm:space-x-2 text-xs">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-600 flex-shrink-0" />
                  <span className="text-xs">State Boundaries</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 text-xs mt-1">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="text-xs">District Boundaries</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forest List Sidebar - Fixed height with proper scrolling */}
        <div className="w-full lg:w-96 bg-white border-t lg:border-l lg:border-t-0 flex flex-col h-[300px] sm:h-[400px] lg:h-[calc(100vh-200px)] forest-sidebar-container">
          <div className="p-3 sm:p-4 border-b flex-shrink-0">
            <h3 className="text-base sm:text-lg font-semibold">Forest Areas ({getFilteredForests().length})</h3>
            <p className="text-xs sm:text-sm text-gray-600">Click on a forest to view details</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 forest-scroll-container">
            {getFilteredForests().map((forest) => (
              <Card 
                key={forest.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setSelectedForest(forest);
                  setShowDetails(true);
                  if (onForestSelect) onForestSelect(forest);
                }}
              >
                <CardHeader className="pb-2 p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xs sm:text-sm font-medium leading-tight">{forest.name}</CardTitle>
                    <Badge className={`text-xs flex-shrink-0 ${getTypeColor(forest.type)}`}>
                      {forest.type}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {forest.state}, {forest.district}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 p-3 sm:p-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Area:</span>
                      <p className="font-medium">{forest.area} ha</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Cover:</span>
                      <p className="font-medium">{forest.forestCover}%</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Biodiversity:</span>
                      <p className={`font-medium ${getBiodiversityColor(forest.biodiversity)}`}>
                        {forest.biodiversity}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Protection:</span>
                      <p className={`font-medium ${getProtectionColor(forest.protectionStatus)}`}>
                        {forest.protectionStatus}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Forest Details Modal - Responsive */}
      {selectedForest && showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold pr-2">{selectedForest.name}</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">State:</span>
                  <p className="font-medium">{selectedForest.state}</p>
                </div>
                <div>
                  <span className="text-gray-600">District:</span>
                  <p className="font-medium">{selectedForest.district}</p>
                </div>
                <div>
                  <span className="text-gray-600">Area:</span>
                  <p className="font-medium">{selectedForest.area} ha</p>
                </div>
                <div>
                  <span className="text-gray-600">Forest Cover:</span>
                  <p className="font-medium">{selectedForest.forestCover}%</p>
                </div>
                <div>
                  <span className="text-gray-600">Biodiversity:</span>
                  <p className={`font-medium ${getBiodiversityColor(selectedForest.biodiversity)}`}>{selectedForest.biodiversity}</p>
                </div>
                <div>
                  <span className="text-gray-600">Protection:</span>
                  <p className={`font-medium ${getProtectionColor(selectedForest.protectionStatus)}`}>{selectedForest.protectionStatus}</p>
                </div>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed mt-5">{selectedForest.description}</p>

              <div className="mt-5">
                <Button className="w-full" onClick={() => {
                  if (selectedForest && selectedForest.name.toLowerCase().includes('satkosia')) {
                    navigate('/satkosia');
                  }
                }}>View Details</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForestLayout;
