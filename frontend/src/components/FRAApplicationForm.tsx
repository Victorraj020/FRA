import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Upload, CheckCircle, AlertCircle, X, MapPin, Brain } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AIAssetAnalysis from './AIAssetAnalysis';
import AIFRAValidation from './AIFRAValidation';

interface FRAApplicationFormProps {
  onClose: () => void;
  onSubmit: (application: FRAApplication) => void;
}

export interface FRAApplication {
  id: string;
  applicantName: string;
  village: string;
  district: string;
  state: string;
  landArea: string;
  landType: 'individual' | 'community' | 'habitation';
  claimType: 'individual_forest_rights' | 'community_forest_rights' | 'community_forest_resource_rights';
  description: string;
  supportingDocuments: File[];
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedAt?: Date;
  reviewedBy?: string;
  reviewNotes?: string;
  priority: 'low' | 'medium' | 'high';
  estimatedValue?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

const FRAApplicationForm: React.FC<FRAApplicationFormProps> = ({ onClose, onSubmit }) => {
  const { userPermissions } = useAuth();
  const [formData, setFormData] = useState<Partial<FRAApplication>>({
    applicantName: '',
    village: '',
    district: '',
    state: '',
    landArea: '',
    landType: 'individual',
    claimType: 'individual_forest_rights',
    description: '',
    supportingDocuments: [],
    status: 'draft',
    priority: 'medium'
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [showAIValidation, setShowAIValidation] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<any>(null);

  const handleInputChange = (field: keyof FRAApplication, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const isValidType = userPermissions.allowedFileTypes.includes(fileExtension || '');
      const isValidSize = file.size <= userPermissions.maxFileUploadSize * 1024 * 1024;
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setErrors(prev => ({
        ...prev,
        files: `Some files were rejected. Allowed types: ${userPermissions.allowedFileTypes.join(', ')}. Max size: ${userPermissions.maxFileUploadSize}MB`
      }));
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
    setFormData(prev => ({ ...prev, supportingDocuments: [...prev.supportingDocuments || [], ...validFiles] }));
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      supportingDocuments: prev.supportingDocuments?.filter((_, i) => i !== index) || []
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.applicantName?.trim()) newErrors.applicantName = 'Applicant name is required';
    if (!formData.village?.trim()) newErrors.village = 'Village is required';
    if (!formData.district?.trim()) newErrors.district = 'District is required';
    if (!formData.state?.trim()) newErrors.state = 'State is required';
    if (!formData.landArea?.trim()) newErrors.landArea = 'Land area is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const application: FRAApplication = {
      id: `FRA-${Date.now()}`,
      applicantName: formData.applicantName!,
      village: formData.village!,
      district: formData.district!,
      state: formData.state!,
      landArea: formData.landArea!,
      landType: formData.landType!,
      claimType: formData.claimType!,
      description: formData.description!,
      supportingDocuments: formData.supportingDocuments || [],
      status: 'submitted',
      priority: formData.priority!,
      submittedAt: new Date()
    };

    onSubmit(application);
    onClose();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Forest Rights Act (FRA) Application
            </CardTitle>
            <CardDescription>
              Submit your forest rights claim application with supporting documents
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applicantName">Applicant Name *</Label>
                <Input
                  id="applicantName"
                  value={formData.applicantName || ''}
                  onChange={(e) => handleInputChange('applicantName', e.target.value)}
                  className={errors.applicantName ? 'border-red-500' : ''}
                />
                {errors.applicantName && (
                  <p className="text-sm text-red-500 mt-1">{errors.applicantName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="village">Village *</Label>
                <Input
                  id="village"
                  value={formData.village || ''}
                  onChange={(e) => handleInputChange('village', e.target.value)}
                  className={errors.village ? 'border-red-500' : ''}
                />
                {errors.village && (
                  <p className="text-sm text-red-500 mt-1">{errors.village}</p>
                )}
              </div>
              <div>
                <Label htmlFor="district">District *</Label>
                <Input
                  id="district"
                  value={formData.district || ''}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className={errors.district ? 'border-red-500' : ''}
                />
                {errors.district && (
                  <p className="text-sm text-red-500 mt-1">{errors.district}</p>
                )}
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state || ''}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && (
                  <p className="text-sm text-red-500 mt-1">{errors.state}</p>
                )}
              </div>
            </div>
          </div>

          {/* Land Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Land Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="landArea">Land Area *</Label>
                <Input
                  id="landArea"
                  value={formData.landArea || ''}
                  onChange={(e) => handleInputChange('landArea', e.target.value)}
                  placeholder="e.g., 2.5 acres"
                  className={errors.landArea ? 'border-red-500' : ''}
                />
                {errors.landArea && (
                  <p className="text-sm text-red-500 mt-1">{errors.landArea}</p>
                )}
              </div>
              <div>
                <Label htmlFor="landType">Land Type</Label>
                <Select
                  value={formData.landType}
                  onValueChange={(value) => handleInputChange('landType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="habitation">Habitation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="claimType">Claim Type</Label>
                <Select
                  value={formData.claimType}
                  onValueChange={(value) => handleInputChange('claimType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual_forest_rights">Individual Forest Rights</SelectItem>
                    <SelectItem value="community_forest_rights">Community Forest Rights</SelectItem>
                    <SelectItem value="community_forest_resource_rights">Community Forest Resource Rights</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleInputChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Provide detailed information about your forest rights claim..."
              className={errors.description ? 'border-red-500' : ''}
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Supporting Documents</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload supporting documents (Max {userPermissions.maxFileUploadSize}MB per file)
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Allowed formats: {userPermissions.allowedFileTypes.join(', ')}
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  accept={userPermissions.allowedFileTypes.map(type => `.${type}`).join(',')}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
              </div>
            </div>

            {errors.files && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.files}</AlertDescription>
              </Alert>
            )}

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Uploaded Files:</h4>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{file.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Analysis Section */}
          {formData.coordinates && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-500" />
                AI-Powered Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAIAnalysis(true)}
                  className="flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Analyze Land Assets
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAIValidation(true)}
                  className="flex items-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  Validate Application
                </Button>
              </div>
              {aiAnalysisResult && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    AI analysis completed. {aiAnalysisResult.landAssets.length} land assets detected with {(aiAnalysisResult.analysisMetadata.modelAccuracy * 100).toFixed(1)}% accuracy.
                  </AlertDescription>
                </Alert>
              )}
              {validationResult && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    AI validation completed. Confidence: {(validationResult.confidence * 100).toFixed(1)}% - {validationResult.isValid ? 'Application appears valid' : 'Issues detected - review required'}.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Submit Application
            </Button>
          </div>
        </form>
      </CardContent>
      
      {/* AI Analysis Modal */}
      {showAIAnalysis && formData.coordinates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <AIAssetAnalysis
              coordinates={formData.coordinates}
              onAnalysisComplete={(result) => {
                setAiAnalysisResult(result);
                setShowAIAnalysis(false);
              }}
              onClose={() => setShowAIAnalysis(false)}
            />
          </div>
        </div>
      )}

      {/* AI Validation Modal */}
      {showAIValidation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <AIFRAValidation
              application={{
                ...formData,
                id: `FRA-${Date.now()}`,
                coordinates: formData.coordinates || { lat: 0, lng: 0 }
              } as FRAApplication}
              onValidationComplete={(isValid, confidence, issues) => {
                setValidationResult({ isValid, confidence, issues });
                setShowAIValidation(false);
              }}
              onClose={() => setShowAIValidation(false)}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default FRAApplicationForm;
