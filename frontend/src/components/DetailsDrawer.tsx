import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { X, MapPin, Users, TreePine, Calendar, FileText, Download, Edit, Save, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Village } from '@/data/mockData';
import { getDSSVillagesCached, type DSSVillage } from '@/lib/utils';

interface DetailsDrawerProps {
  village: Village | null;
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
  isGovernmentUser?: boolean;
  // Added limitedMode to show only summary for anonymous/local users not logged in
  limitedMode?: boolean;
  isEditing?: boolean;
  editedVillage?: Village | null;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onStatusChange?: (status: 'approved' | 'pending' | 'rejected') => void;
}

const DetailsDrawer: React.FC<DetailsDrawerProps> = ({ 
  village, 
  isOpen, 
  onClose, 
  isMobile = false,
  isGovernmentUser = false,
  limitedMode = false,
  isEditing = false,
  editedVillage,
  onEdit,
  onSave,
  onCancel,
  onStatusChange
}) => {
  const [dss, setDss] = useState<DSSVillage | null>(null);

  useEffect(() => {
    let mounted = true;
    if (village) {
      getDSSVillagesCached().then((rows) => {
        if (!mounted) return;
        const found = rows.find(r => String(r.id) === String(village.id) || (r.name === village.name && r.district === village.district));
        setDss(found || null);
      }).catch(() => {
        if (mounted) setDss(null);
      });
    } else {
      setDss(null);
    }
    return () => { mounted = false; };
  }, [village?.id, village?.name, village?.district]);

  if (!village) return null;

  const displayVillage = isEditing && editedVillage ? editedVillage : village;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-status-approved';
      case 'Pending': return 'bg-status-pending';
      case 'Rejected': return 'bg-status-rejected';
      default: return 'bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return '✓';
      case 'Pending': return '⏱';
      case 'Rejected': return '✗';
      default: return '?';
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 z-50 ${isMobile ? 'w-full' : 'w-96'} bg-background shadow-elevated transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="h-full overflow-y-auto mobile-scroll">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{displayVillage.name}</h2>
            <p className="text-sm text-muted-foreground">{displayVillage.district}, {displayVillage.state}</p>
          </div>
          <div className="flex items-center space-x-2">
            {isGovernmentUser && !isEditing && onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className={`space-y-6 ${isMobile ? 'p-3' : 'p-4'}`}>
          {/* Status Badge */}
          <div className="flex items-center justify-center">
            {isGovernmentUser && isEditing ? (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={displayVillage.status === 'Approved' ? 'default' : 'outline'}
                  onClick={() => onStatusChange?.('approved')}
                  className={displayVillage.status === 'Approved' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant={displayVillage.status === 'Pending' ? 'default' : 'outline'}
                  onClick={() => onStatusChange?.('pending')}
                  className={displayVillage.status === 'Pending' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                >
                  <Clock className="w-4 h-4 mr-1" />
                  Pending
                </Button>
                <Button
                  size="sm"
                  variant={displayVillage.status === 'Rejected' ? 'default' : 'outline'}
                  onClick={() => onStatusChange?.('rejected')}
                  className={displayVillage.status === 'Rejected' ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </div>
            ) : (
              <Badge className={`text-white px-4 py-2 text-sm ${getStatusColor(displayVillage.status)}`}>
                <span className="mr-2">{getStatusIcon(displayVillage.status)}</span>
                {displayVillage.status}
              </Badge>
            )}
          </div>

          {/* Basic Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className={`grid gap-4 text-sm ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <div>
                  <span className="text-muted-foreground">State</span>
                  <p className="font-medium">{village.state}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">District</span>
                  <p className="font-medium">{village.district}</p>
                </div>
                {limitedMode ? null : (
                  <div>
                    <span className="text-muted-foreground">Coordinates</span>
                    <p className="font-medium text-xs">{village.coordinates[0].toFixed(4)}, {village.coordinates[1].toFixed(4)}</p>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">FRA Type</span>
                  <p className="font-medium">
                    <Badge variant="outline" className="text-xs">
                      {village.fraType}
                    </Badge>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demographics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Demographics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-primary">{village.population.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Population</p>
                </div>
                {limitedMode ? null : (
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold text-secondary">{village.landArea}</p>
                    <p className="text-xs text-muted-foreground">Hectares</p>
                  </div>
                )}
              {dss?.indicators?.jjmCoveragePct != null && (
                <div className="col-span-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>JJM Coverage</span>
                    <span className="font-medium">{Math.round(dss.indicators.jjmCoveragePct)}%</span>
                  </div>
                  <Progress value={Math.max(0, Math.min(100, dss.indicators.jjmCoveragePct))} className="h-2" />
                </div>
              )}
              </div>
            </CardContent>
          </Card>

          {/* Forest Cover */}
          {limitedMode ? null : (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <TreePine className="w-4 h-4 mr-2" />
                Forest Cover
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Coverage</span>
                  <span className="font-medium">{village.forestCover}%</span>
                </div>
                <Progress value={village.forestCover} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Approximately {Math.round(village.landArea * village.forestCover / 100)} hectares under forest cover
                </p>
              </div>
            </CardContent>
          </Card>
          )}

          {/* DSS Recommendations */}
          {dss?.recommendations && dss.recommendations.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  DSS Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {dss.recommendations.slice(0, 5).map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          {limitedMode ? null : (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Status Updated</p>
                    <p className="text-xs text-muted-foreground">Last updated on {new Date(village.lastUpdated).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Document Verification</p>
                    <p className="text-xs text-muted-foreground">Completed verification process</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Application Submitted</p>
                    <p className="text-xs text-muted-foreground">Initial application received</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" onClick={() => {
                if (limitedMode) {
                  window.location.href = '/login';
                  return;
                }
              }}>
                <Download className="w-4 h-4 mr-2" />
                {limitedMode ? 'Login to Download' : 'Download Records'}
              </Button>
              {!isGovernmentUser && (
                <Button className="w-full justify-start" variant="outline" onClick={() => {
                  if (limitedMode) {
                    window.location.href = '/login';
                    return;
                  }
                }}>
                  <Edit className="w-4 h-4 mr-2" />
                  {limitedMode ? 'Login to Update' : 'Update Information'}
                </Button>
              )}
              <Button className="w-full justify-start" variant="outline" onClick={() => {
                if (limitedMode) {
                  window.location.href = '/login';
                  return;
                }
              }}>
                <FileText className="w-4 h-4 mr-2" />
                {limitedMode ? 'Login to View Documents' : 'View Documents'}
              </Button>
            </CardContent>
          </Card>

          {/* Government Edit Actions */}
          {isGovernmentUser && isEditing && (
            <Card className="border-2 border-black">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-black">Edit Mode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex space-x-2">
                  <Button 
                    onClick={onSave} 
                    className="flex-1 bg-black text-white hover:bg-gray-800"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button 
                    onClick={onCancel} 
                    variant="outline" 
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Changes will be immediately reflected in local user dashboards
                </p>
              </CardContent>
            </Card>
          )}

          {/* Additional Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Application ID</span>
                  <span className="font-medium">FRA-{village.id.padStart(6, '0')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Survey Number</span>
                  <span className="font-medium">SV-{Math.floor(Math.random() * 1000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GPS Accuracy</span>
                  <span className="font-medium text-green-600">High</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailsDrawer;