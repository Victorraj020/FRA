import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Brain, 
  MapPin, 
  FileText, 
  Clock,
  Shield,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { FRAApplication } from './FRAApplicationForm';
import { AIAssetMappingService, AIAnalysisResult } from '@/services/aiAssetMapping';

interface AIFRAValidationProps {
  application: FRAApplication;
  onValidationComplete?: (isValid: boolean, confidence: number, issues: string[]) => void;
  onClose?: () => void;
}

interface ValidationResult {
  isValid: boolean;
  confidence: number;
  score: number;
  issues: string[];
  recommendations: string[];
  aiAnalysis?: AIAnalysisResult;
  validationDetails: {
    landAreaMatch: boolean;
    coordinatesValid: boolean;
    forestRightsEligible: boolean;
    documentationComplete: boolean;
    historicalEvidence: boolean;
  };
}

const AIFRAValidation: React.FC<AIFRAValidationProps> = ({
  application,
  onValidationComplete,
  onClose
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);

  const aiService = AIAssetMappingService.getInstance();

  useEffect(() => {
    startValidation();
  }, [application]);

  const startValidation = async () => {
    setIsValidating(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate validation progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 300);

      // Perform AI analysis if coordinates are available
      let aiAnalysis: AIAnalysisResult | undefined;
      if (application.coordinates) {
        try {
          aiAnalysis = await aiService.analyzeSatelliteImagery(application.coordinates, 5);
        } catch (err) {
          console.warn('AI analysis failed:', err);
        }
      }

      // Perform validation checks
      const result = await performValidation(application, aiAnalysis);
      
      clearInterval(progressInterval);
      setProgress(100);
      setValidationResult(result);
      onValidationComplete?.(result.isValid, result.confidence, result.issues);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation failed');
    } finally {
      setIsValidating(false);
    }
  };

  const performValidation = async (
    app: FRAApplication, 
    aiAnalysis?: AIAnalysisResult
  ): Promise<ValidationResult> => {
    // Simulate validation processing time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 0;
    let maxScore = 0;

    // Land area validation
    maxScore += 20;
    const landAreaMatch = validateLandArea(app.landArea, aiAnalysis);
    if (landAreaMatch) {
      score += 20;
    } else {
      issues.push('Land area does not match AI-detected boundaries');
      recommendations.push('Verify land area measurements with field survey');
    }

    // Coordinates validation
    maxScore += 15;
    const coordinatesValid = validateCoordinates(app.coordinates);
    if (coordinatesValid) {
      score += 15;
    } else {
      issues.push('Invalid or missing coordinates');
      recommendations.push('Provide accurate GPS coordinates for the claimed land');
    }

    // Forest rights eligibility
    maxScore += 25;
    const forestRightsEligible = validateForestRightsEligibility(app, aiAnalysis);
    if (forestRightsEligible) {
      score += 25;
    } else {
      issues.push('Land may not be eligible for forest rights');
      recommendations.push('Verify traditional forest use and community rights');
    }

    // Documentation completeness
    maxScore += 20;
    const documentationComplete = validateDocumentation(app);
    if (documentationComplete) {
      score += 20;
    } else {
      issues.push('Incomplete supporting documentation');
      recommendations.push('Upload all required documents and evidence');
    }

    // Historical evidence
    maxScore += 20;
    const historicalEvidence = validateHistoricalEvidence(app, aiAnalysis);
    if (historicalEvidence) {
      score += 20;
    } else {
      issues.push('Insufficient historical evidence of forest use');
      recommendations.push('Provide additional evidence of traditional forest use');
    }

    const confidence = score / maxScore;
    const isValid = confidence >= 0.7 && issues.length <= 2;

    return {
      isValid,
      confidence,
      score,
      issues,
      recommendations,
      aiAnalysis,
      validationDetails: {
        landAreaMatch,
        coordinatesValid,
        forestRightsEligible,
        documentationComplete,
        historicalEvidence
      }
    };
  };

  const validateLandArea = (claimedArea: string, aiAnalysis?: AIAnalysisResult): boolean => {
    if (!aiAnalysis) return true; // Skip if no AI analysis
    
    const claimedAreaNum = parseFloat(claimedArea.replace(/[^\d.]/g, ''));
    if (isNaN(claimedAreaNum)) return false;

    const totalDetectedArea = aiAnalysis.landAssets.reduce((sum, asset) => sum + asset.area, 0);
    const areaDifference = Math.abs(claimedAreaNum - totalDetectedArea) / claimedAreaNum;
    
    return areaDifference <= 0.3; // Allow 30% difference
  };

  const validateCoordinates = (coordinates?: { lat: number; lng: number }): boolean => {
    if (!coordinates) return false;
    return coordinates.lat >= -90 && coordinates.lat <= 90 && 
           coordinates.lng >= -180 && coordinates.lng <= 180;
  };

  const validateForestRightsEligibility = (app: FRAApplication, aiAnalysis?: AIAnalysisResult): boolean => {
    if (!aiAnalysis) return true; // Skip if no AI analysis

    const forestAssets = aiAnalysis.landAssets.filter(asset => asset.type === 'forest');
    const hasForestCover = forestAssets.length > 0;
    
    // Check if forest type matches claim type
    if (app.claimType === 'individual_forest_rights' && app.landType === 'individual') {
      return hasForestCover;
    }
    
    if (app.claimType === 'community_forest_rights' && app.landType === 'community') {
      return hasForestCover && forestAssets.some(asset => asset.area >= 5); // At least 5 hectares
    }
    
    if (app.claimType === 'community_forest_resource_rights' && app.landType === 'habitation') {
      return hasForestCover && forestAssets.some(asset => asset.area >= 10); // At least 10 hectares
    }
    
    return hasForestCover;
  };

  const validateDocumentation = (app: FRAApplication): boolean => {
    const hasRequiredDocs = app.supportingDocuments && app.supportingDocuments.length > 0;
    const hasDescription = app.description && app.description.length > 50;
    const hasCompleteInfo = app.applicantName && app.village && app.district && app.state;
    
    return hasRequiredDocs && hasDescription && hasCompleteInfo;
  };

  const validateHistoricalEvidence = (app: FRAApplication, aiAnalysis?: AIAnalysisResult): boolean => {
    if (!aiAnalysis) return true; // Skip if no AI analysis

    // Check if description mentions traditional use
    const traditionalKeywords = ['traditional', 'ancestral', 'generations', 'community', 'tribal', 'indigenous'];
    const hasTraditionalMention = traditionalKeywords.some(keyword => 
      app.description.toLowerCase().includes(keyword)
    );

    // Check forest data for evidence of long-term use
    const hasForestEvidence = aiAnalysis.forestData && 
      (aiAnalysis.forestData.canopyCover > 40 || aiAnalysis.forestData.biomass > 100);

    return hasTraditionalMention || hasForestEvidence;
  };

  const getValidationIcon = (isValid: boolean) => {
    if (isValid) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (isValidating) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            AI FRA Validation in Progress
          </CardTitle>
          <CardDescription>
            Validating application against AI-detected land data and forest rights criteria...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing validation checks...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>Land Area Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-500" />
              <span>Documentation Check</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Eligibility Assessment</span>
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
            Validation Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex gap-2 mt-4">
            <Button onClick={startValidation} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Validation
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

  if (!validationResult) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Validation Result Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {getValidationIcon(validationResult.isValid)}
                {validationResult.isValid ? 'Application Validated' : 'Validation Issues Found'}
              </CardTitle>
              <CardDescription>
                FRA Application ID: {application.id} | Confidence: {(validationResult.confidence * 100).toFixed(1)}%
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge className={getConfidenceColor(validationResult.confidence)}>
                {(validationResult.confidence * 100).toFixed(0)}% Confidence
              </Badge>
              {onClose && (
                <Button onClick={onClose} variant="outline" size="sm">
                  Close
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{validationResult.score}</div>
              <div className="text-gray-600">Validation Score</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{validationResult.issues.length}</div>
              <div className="text-gray-600">Issues Found</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{validationResult.recommendations.length}</div>
              <div className="text-gray-600">Recommendations</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {validationResult.aiAnalysis ? 'Yes' : 'No'}
              </div>
              <div className="text-gray-600">AI Analysis</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Details */}
      <Card>
        <CardHeader>
          <CardTitle>Validation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(validationResult.validationDetails).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
                <div className="flex items-center gap-2">
                  {value ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium">
                    {value ? 'Pass' : 'Fail'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Issues */}
      {validationResult.issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Issues Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {validationResult.issues.map((issue, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{issue}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
            {validationResult.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{recommendation}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Toggle */}
      {validationResult.aiAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              AI Land Analysis
            </CardTitle>
            <CardDescription>
              Detailed satellite imagery analysis and land classification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowAIAnalysis(!showAIAnalysis)}
              variant="outline"
              className="w-full"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showAIAnalysis ? 'Hide' : 'Show'} AI Analysis Details
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={() => window.print()}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
        <Button 
          onClick={() => onValidationComplete?.(validationResult.isValid, validationResult.confidence, validationResult.issues)}
          className={validationResult.isValid ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'}
        >
          {validationResult.isValid ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Application
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Review Required
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AIFRAValidation;
