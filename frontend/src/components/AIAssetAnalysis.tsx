import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  TreePine, 
  Droplets, 
  Road, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Brain,
  Satellite,
  BarChart3,
  FileText,
  Eye,
  Download
} from 'lucide-react';
import { AIAssetMappingService, AIAnalysisResult, LandAsset } from '@/services/aiAssetMapping';

interface AIAssetAnalysisProps {
  coordinates: { lat: number; lng: number };
  onAnalysisComplete?: (result: AIAnalysisResult) => void;
  onClose?: () => void;
  applicationId?: string;
}

const AIAssetAnalysis: React.FC<AIAssetAnalysisProps> = ({
  coordinates,
  onAnalysisComplete,
  onClose,
  applicationId
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<LandAsset | null>(null);

  const aiService = AIAssetMappingService.getInstance();

  useEffect(() => {
    startAnalysis();
  }, [coordinates]);

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      const result = await aiService.analyzeSatelliteImagery(coordinates, 5);
      
      clearInterval(progressInterval);
      setProgress(100);
      setAnalysisResult(result);
      onAnalysisComplete?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getAssetTypeIcon = (type: LandAsset['type']) => {
    switch (type) {
      case 'forest': return <TreePine className="w-4 h-4" />;
      case 'agricultural': return <BarChart3 className="w-4 h-4" />;
      case 'water_body': return <Droplets className="w-4 h-4" />;
      case 'homestead': return <MapPin className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getAssetTypeColor = (type: LandAsset['type']) => {
    switch (type) {
      case 'forest': return 'bg-green-100 text-green-800';
      case 'agricultural': return 'bg-yellow-100 text-yellow-800';
      case 'water_body': return 'bg-blue-100 text-blue-800';
      case 'homestead': return 'bg-purple-100 text-purple-800';
      case 'barren': return 'bg-gray-100 text-gray-800';
      case 'grassland': return 'bg-lime-100 text-lime-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
    }
  };

  if (isAnalyzing) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            AI Asset Analysis in Progress
          </CardTitle>
          <CardDescription>
            Analyzing satellite imagery and land classification data...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing satellite imagery...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Satellite className="w-4 h-4 text-blue-500" />
              <span>Satellite Data Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-500" />
              <span>ML Model Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-green-500" />
              <span>Data Integration</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Analysis Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex gap-2 mt-4">
            <Button onClick={startAnalysis} variant="outline">
              Retry Analysis
            </Button>
            {onClose && (
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysisResult) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                AI Asset Analysis Complete
              </CardTitle>
              <CardDescription>
                Analysis completed for coordinates: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
              </CardDescription>
            </div>
            {onClose && (
              <Button onClick={onClose} variant="outline" size="sm">
                Close
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Processing Time: {analysisResult.analysisMetadata.processingTime.toFixed(1)}s</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-500" />
              <span>Model Accuracy: {(analysisResult.analysisMetadata.modelAccuracy * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-500" />
              <span>Assets Detected: {analysisResult.landAssets.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-500" />
              <span>Data Sources: {analysisResult.analysisMetadata.dataSources.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detected Land Assets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Detected Land Assets
          </CardTitle>
          <CardDescription>
            AI-detected land use classification and boundaries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysisResult.landAssets.map((asset) => (
              <Card 
                key={asset.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedAsset?.id === asset.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedAsset(asset)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getAssetTypeIcon(asset.type)}
                      <span className="font-medium capitalize">{asset.type.replace('_', ' ')}</span>
                    </div>
                    <Badge className={getAssetTypeColor(asset.type)}>
                      {(asset.confidence * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Area: {asset.area.toFixed(2)} hectares</div>
                    <div>Coordinates: {asset.coordinates.lat.toFixed(4)}, {asset.coordinates.lng.toFixed(4)}</div>
                    <div>Resolution: {asset.metadata.resolution}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Forest Data */}
      {analysisResult.forestData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TreePine className="w-5 h-5" />
              Forest Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {analysisResult.forestData.canopyCover.toFixed(0)}%
                </div>
                <div className="text-sm text-green-700">Canopy Cover</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {analysisResult.forestData.biomass.toFixed(0)}
                </div>
                <div className="text-sm text-blue-700">Biomass (t/ha)</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {analysisResult.forestData.carbonStock.toFixed(0)}
                </div>
                <div className="text-sm text-purple-700">Carbon Stock (t/ha)</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {analysisResult.forestData.biodiversityIndex.toFixed(2)}
                </div>
                <div className="text-sm text-orange-700">Biodiversity Index</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Forest Type: {analysisResult.forestData.forestType}</div>
              <div className="text-sm font-medium mb-2">Tree Species Detected:</div>
              <div className="flex flex-wrap gap-1">
                {analysisResult.forestData.treeSpecies.map((species, index) => (
                  <Badge key={index} variant="secondary">{species}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Groundwater Data */}
      {analysisResult.groundwaterData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5" />
              Groundwater Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {analysisResult.groundwaterData.waterTableDepth.toFixed(1)}m
                </div>
                <div className="text-sm text-blue-700">Water Table Depth</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 capitalize">
                  {analysisResult.groundwaterData.waterQuality}
                </div>
                <div className="text-sm text-green-700">Water Quality</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {analysisResult.groundwaterData.rechargeRate.toFixed(0)}
                </div>
                <div className="text-sm text-purple-700">Recharge Rate (mm/year)</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {analysisResult.groundwaterData.seasonalVariation.toFixed(1)}m
                </div>
                <div className="text-sm text-orange-700">Seasonal Variation</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge className={getRiskColor(analysisResult.riskAssessment.environmentalRisk)}>
                {analysisResult.riskAssessment.environmentalRisk.toUpperCase()}
              </Badge>
              <div className="text-sm text-gray-600 mt-1">Environmental Risk</div>
            </div>
            <div className="text-center">
              <Badge className={getRiskColor(analysisResult.riskAssessment.legalRisk)}>
                {analysisResult.riskAssessment.legalRisk.toUpperCase()}
              </Badge>
              <div className="text-sm text-gray-600 mt-1">Legal Risk</div>
            </div>
            <div className="text-center">
              <Badge className={getRiskColor(analysisResult.riskAssessment.socialRisk)}>
                {analysisResult.riskAssessment.socialRisk.toUpperCase()}
              </Badge>
              <div className="text-sm text-gray-600 mt-1">Social Risk</div>
            </div>
            <div className="text-center">
              <Badge className={getRiskColor(analysisResult.riskAssessment.overallRisk)}>
                {analysisResult.riskAssessment.overallRisk.toUpperCase()}
              </Badge>
              <div className="text-sm text-gray-600 mt-1">Overall Risk</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analysisResult.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{recommendation}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={() => window.print()}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
        <Button onClick={() => onAnalysisComplete?.(analysisResult)}>
          <CheckCircle className="w-4 h-4 mr-2" />
          Use Analysis
        </Button>
      </div>
    </div>
  );
};

export default AIAssetAnalysis;
