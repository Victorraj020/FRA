import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  FileText, 
  Download, 
  Copy, 
  Trash2, 
  Eye,
  Loader2,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  FileImage
} from 'lucide-react';
import Tesseract from 'tesseract.js';

interface OCRResult {
  id: string;
  fileName: string;
  extractedText: string;
  confidence: number;
  processingTime: number;
  timestamp: Date;
  imageUrl: string;
}

const OCRProcessor: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [results, setResults] = useState<OCRResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<OCRResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setIsProcessing(true);
    setProgress(0);
    setStatus('Starting OCR processing...');

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError(`File ${file.name} is not a valid image format`);
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          setError(`File ${file.name} is too large. Maximum size is 10MB`);
          continue;
        }

        setStatus(`Processing ${file.name}...`);
        
        const imageUrl = URL.createObjectURL(file);
        
        try {
          const result = await Tesseract.recognize(file, 'eng', {
            logger: (m) => {
              if (m.status === 'recognizing text') {
                setProgress(Math.round(m.progress * 100));
              }
            }
          });

          // Validate result structure
          if (!result || !result.data) {
            throw new Error('Invalid OCR result structure');
          }

          const ocrResult: OCRResult = {
            id: Date.now().toString() + i,
            fileName: file.name,
            extractedText: result.data.text || '',
            confidence: result.data.confidence || 0,
            processingTime: result.data.confidence || 0, // Use overall confidence as processing time indicator
            timestamp: new Date(),
            imageUrl
          };

          setResults(prev => [ocrResult, ...prev]);
          setStatus(`Completed processing ${file.name}`);
        } catch (ocrError) {
          console.error(`OCR processing failed for ${file.name}:`, ocrError);
          setError(`Failed to process ${file.name}: ${ocrError instanceof Error ? ocrError.message : 'Unknown error'}`);
          URL.revokeObjectURL(imageUrl);
        }
      }
      
      setStatus('All files processed successfully!');
    } catch (err) {
      console.error('File upload error:', err);
      setError(`OCR processing failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDownloadText = (result: OCRResult) => {
    const blob = new Blob([result.extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.fileName.split('.')[0]}_extracted_text.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteResult = (id: string) => {
    setResults(prev => {
      const updated = prev.filter(result => result.id !== id);
      if (selectedResult?.id === id) {
        setSelectedResult(updated.length > 0 ? updated[0] : null);
      }
      return updated;
    });
  };

  const clearAllResults = () => {
    // Clean up object URLs to prevent memory leaks
    results.forEach(result => {
      URL.revokeObjectURL(result.imageUrl);
    });
    setResults([]);
    setSelectedResult(null);
  };

  // Cleanup on component unmount
  React.useEffect(() => {
    return () => {
      results.forEach(result => {
        URL.revokeObjectURL(result.imageUrl);
      });
    };
  }, [results]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 80) return 'High';
    if (confidence >= 60) return 'Medium';
    return 'Low';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Document Digitizer</h2>
          <p className="text-gray-600">Extract text from images and documents using AI-powered OCR</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Images
          </Button>
          {results.length > 0 && (
            <Button
              variant="outline"
              onClick={clearAllResults}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* File Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        disabled={isProcessing}
        className="hidden"
      />

      {/* Processing Status */}
      {isProcessing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">{status}</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-gray-500">Processing... {progress}%</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results Grid */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Results List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Processed Documents</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result) => (
                <Card 
                  key={result.id}
                  className={`cursor-pointer transition-colors ${
                    selectedResult?.id === result.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedResult(result)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <FileImage className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {result.fileName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {result.timestamp.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getConfidenceColor(result.confidence)} text-white`}
                            >
                              {getConfidenceText(result.confidence)} Confidence
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {Math.round(result.confidence)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteResult(result.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Selected Result Details */}
          <div className="space-y-4">
            {selectedResult ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Extracted Text</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyText(selectedResult.extractedText)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadText(selectedResult)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Image Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Original Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={selectedResult.imageUrl}
                      alt={selectedResult.fileName}
                      className="w-full h-48 object-contain bg-gray-50 rounded"
                    />
                  </CardContent>
                </Card>

                {/* Extracted Text */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Extracted Text</CardTitle>
                    <CardDescription>
                      Confidence: {Math.round(selectedResult.confidence)}% | 
                      Characters: {selectedResult.extractedText.length}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={selectedResult.extractedText}
                      readOnly
                      className="min-h-32 font-mono text-sm"
                      placeholder="No text extracted..."
                    />
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a document to view extracted text</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {results.length === 0 && !isProcessing && (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents processed yet</h3>
              <p className="text-gray-500 mb-6">
                Upload images or documents to extract text using OCR technology
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Your First Document
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tips for Better OCR Results</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Use high-resolution images (300 DPI or higher)</li>
            <li>• Ensure good contrast between text and background</li>
            <li>• Avoid blurry or rotated images</li>
            <li>• For handwritten text, use clear, legible handwriting</li>
            <li>• Supported formats: JPG, PNG, GIF, BMP, TIFF</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default OCRProcessor;
