import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TreePine, 
  Users, 
  FileText, 
  BarChart3, 
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2,
  FileCheck,
  TrendingUp,
  DollarSign,
  Leaf
} from 'lucide-react';

const ForestRevenueDashboard: React.FC = () => {
  const { userRole, userPermissions } = useAuth();

  const forestStats = [
    { title: 'Forest Revenue', value: '₹45.2M', change: '+18%', icon: DollarSign, color: 'text-green-600' },
    { title: 'Forest Areas', value: '2,847', change: '+5%', icon: TreePine, color: 'text-emerald-600' },
    { title: 'Revenue Claims', value: '1,892', change: '+12%', icon: FileText, color: 'text-blue-600' },
    { title: 'Land Records', value: '15,432', change: '+8%', icon: MapPin, color: 'text-purple-600' }
  ];

  const recentActivities = [
    { id: 1, action: 'Revenue claim processed', location: 'Forest Block A', time: '2 hours ago', status: 'processed' },
    { id: 2, action: 'Land record updated', location: 'Village X', time: '4 hours ago', status: 'updated' },
    { id: 3, action: 'Forest mapping completed', location: 'Zone B', time: '6 hours ago', status: 'completed' },
    { id: 4, action: 'Revenue report generated', location: 'District Office', time: '1 day ago', status: 'generated' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header removed; GovHeader is provided by GovLayout */}
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
              <TreePine className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Forest & Revenue Department</h1>
              <p className="text-gray-600">Forest resource management and revenue tracking</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">
            {userRole?.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {forestStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Recent Forest & Revenue Activities
                </CardTitle>
                <CardDescription>
                  Latest updates on forest management and revenue operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={activity.status === 'processed' ? 'default' : 
                                  activity.status === 'updated' ? 'secondary' : 'outline'}
                          className="mb-1"
                        >
                          {activity.status}
                        </Badge>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileCheck className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Manage Revenue Claims
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Forest Mapping
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Revenue Analytics
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TreePine className="w-4 h-4 mr-2" />
                  Forest Resources
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Leaf className="w-4 h-4 mr-2" />
                  Land Records
                </Button>
              </CardContent>
            </Card>

            {/* Department Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Department Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {userPermissions.departmentSpecificFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForestRevenueDashboard;
