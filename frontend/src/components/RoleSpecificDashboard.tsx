import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  TreePine,
  Building2,
  Heart,
  DollarSign,
  TrendingUp,
  FileCheck,
  MessageSquare,
  Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const RoleSpecificDashboard: React.FC = () => {
  const { userRole, userPermissions } = useAuth();

  const getRoleInfo = () => {
    switch (userRole) {
      case 'government':
        return {
          title: 'Government Administrator',
          description: 'Full system access and administrative control',
          icon: Shield,
          color: 'bg-red-500',
          features: [
            'Manage all FRA applications',
            'Approve or reject claims',
            'Edit village and forest data',
            'Generate comprehensive reports',
            'Manage user permissions',
            'System configuration'
          ],
          stats: [
            { label: 'Total Applications', value: '1,234', icon: FileText },
            { label: 'Pending Review', value: '89', icon: Clock },
            { label: 'Approved This Month', value: '156', icon: CheckCircle },
            { label: 'Active Users', value: '2,847', icon: Users }
          ]
        };
      
      case 'ministry_tribal':
        return {
          title: 'Ministry of Tribal Affairs',
          description: 'Specialized access for tribal affairs management',
          icon: Building2,
          color: 'bg-green-500',
          features: [
            'Manage tribal forest rights',
            'Review tribal claims',
            'Coordinate with local authorities',
            'Generate tribal reports',
            'Monitor tribal welfare',
            'Access tribal analytics'
          ],
          stats: [
            { label: 'Tribal Applications', value: '456', icon: FileText },
            { label: 'Under Review', value: '23', icon: Clock },
            { label: 'Approved This Month', value: '67', icon: CheckCircle },
            { label: 'Tribal Communities', value: '89', icon: Users }
          ]
        };
      
      case 'welfare_dept':
        return {
          title: 'Welfare Department (DAJGUA)',
          description: 'Social welfare and community development focus',
          icon: Heart,
          color: 'bg-blue-500',
          features: [
            'Welfare tracking and analysis',
            'Social impact assessment',
            'Community welfare reports',
            'Beneficiary management',
            'View all complaints',
            'Generate welfare reports'
          ],
          stats: [
            { label: 'Welfare Cases', value: '789', icon: Heart },
            { label: 'Active Beneficiaries', value: '1,234', icon: Users },
            { label: 'Resolved This Month', value: '45', icon: CheckCircle },
            { label: 'Community Programs', value: '12', icon: Building2 }
          ]
        };
      
      case 'forest_revenue':
        return {
          title: 'Forest Revenue Department',
          description: 'Revenue tracking and forest mapping expertise',
          icon: TreePine,
          color: 'bg-emerald-500',
          features: [
            'Revenue tracking and analysis',
            'Forest mapping and GIS data',
            'Land records management',
            'Revenue analytics',
            'Edit forest data',
            'Generate revenue reports'
          ],
          stats: [
            { label: 'Revenue Generated', value: '₹2.4M', icon: DollarSign },
            { label: 'Forest Areas Mapped', value: '156', icon: MapPin },
            { label: 'Land Records Updated', value: '89', icon: FileText },
            { label: 'Revenue Growth', value: '+15%', icon: TrendingUp }
          ]
        };
      
      case 'planning_develop':
        return {
          title: 'Planning & Development Department',
          description: 'Development planning and infrastructure analysis',
          icon: TrendingUp,
          color: 'bg-purple-500',
          features: [
            'Development planning',
            'Infrastructure analysis',
            'Project tracking',
            'Development reports',
            'View all complaints',
            'Generate planning reports'
          ],
          stats: [
            { label: 'Active Projects', value: '23', icon: Building2 },
            { label: 'Development Plans', value: '8', icon: FileText },
            { label: 'Infrastructure Projects', value: '15', icon: MapPin },
            { label: 'Budget Allocated', value: '₹5.2M', icon: DollarSign }
          ]
        };
      
      case 'ngo':
        return {
          title: 'NGO Representative',
          description: 'Community support and advocacy tools',
          icon: Users,
          color: 'bg-orange-500',
          features: [
            'Community support tools',
            'Advocacy and awareness',
            'Impact assessment',
            'Community reports',
            'Submit FRA applications',
            'View analytics'
          ],
          stats: [
            { label: 'Communities Served', value: '45', icon: Users },
            { label: 'Applications Assisted', value: '123', icon: FileCheck },
            { label: 'Success Rate', value: '78%', icon: CheckCircle },
            { label: 'Active Programs', value: '7', icon: Building2 }
          ]
        };
      
      case 'normal':
        return {
          title: 'Community Member',
          description: 'Access to forest rights information and services',
          icon: Users,
          color: 'bg-blue-500',
          features: [
            'Submit FRA applications',
            'Track application status',
            'Submit complaints',
            'View basic information',
            'Access map data',
            'View alerts'
          ],
          stats: [
            { label: 'My Applications', value: '3', icon: FileText },
            { label: 'Pending Review', value: '1', icon: Clock },
            { label: 'Approved Claims', value: '2', icon: CheckCircle },
            { label: 'Complaints Submitted', value: '1', icon: MessageSquare }
          ]
        };
      
      default:
        return {
          title: 'Guest User',
          description: 'Limited access to public information',
          icon: Users,
          color: 'bg-gray-500',
          features: [
            'View basic information',
            'Access public data',
            'Limited map access'
          ],
          stats: [
            { label: 'Public Data', value: 'Available', icon: FileText },
            { label: 'Map Access', value: 'Limited', icon: MapPin },
            { label: 'Features', value: 'Basic', icon: Settings }
          ]
        };
    }
  };

  const roleInfo = getRoleInfo();
  const IconComponent = roleInfo.icon;

  return (
    <div className="space-y-6">
      {/* Role Header */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${roleInfo.color} text-white`}>
              <IconComponent className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-2xl">{roleInfo.title}</CardTitle>
              <CardDescription className="text-lg">{roleInfo.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Role-specific Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Your Capabilities
          </CardTitle>
          <CardDescription>
            Features and permissions available to your role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleInfo.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role-specific Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {roleInfo.stats.map((stat, index) => {
          const StatIcon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <StatIcon className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Department-specific Information */}
      {userRole && userPermissions.departmentSpecificFeatures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Department-Specific Features
            </CardTitle>
            <CardDescription>
              Specialized tools and features for your department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userPermissions.departmentSpecificFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {userRole?.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Permission Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Permission Summary
          </CardTitle>
          <CardDescription>
            Overview of your access rights and limitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-700">Allowed Actions</h4>
              <div className="space-y-1">
                {userPermissions.canEditClaims && <div className="text-sm text-green-600">✓ Edit Claims</div>}
                {userPermissions.canApproveClaims && <div className="text-sm text-green-600">✓ Approve Claims</div>}
                {userPermissions.canViewAllComplaints && <div className="text-sm text-green-600">✓ View All Complaints</div>}
                {userPermissions.canEditComplaints && <div className="text-sm text-green-600">✓ Edit Complaints</div>}
                {userPermissions.canSubmitFRAApplications && <div className="text-sm text-green-600">✓ Submit FRA Applications</div>}
                {userPermissions.canViewAnalytics && <div className="text-sm text-green-600">✓ View Analytics</div>}
                {userPermissions.canManageUsers && <div className="text-sm text-green-600">✓ Manage Users</div>}
                {userPermissions.canUploadDocuments && <div className="text-sm text-green-600">✓ Upload Documents</div>}
                {userPermissions.canGenerateReports && <div className="text-sm text-green-600">✓ Generate Reports</div>}
                {userPermissions.canAccessMap && <div className="text-sm text-green-600">✓ Access Map</div>}
                {userPermissions.canEditVillageData && <div className="text-sm text-green-600">✓ Edit Village Data</div>}
                {userPermissions.canManageAlerts && <div className="text-sm text-green-600">✓ Manage Alerts</div>}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">File Upload Limits</h4>
              <div className="space-y-1">
                <div className="text-sm">Max file size: {userPermissions.maxFileUploadSize}MB</div>
                <div className="text-sm">Allowed types: {userPermissions.allowedFileTypes.join(', ')}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">System Access</h4>
              <div className="space-y-1">
                <div className="text-sm">Role: {userRole?.replace('_', ' ').toUpperCase() || 'GUEST'}</div>
                <div className="text-sm">Department features: {userPermissions.departmentSpecificFeatures.length}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSpecificDashboard;
