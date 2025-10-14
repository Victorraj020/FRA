import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  MapPin, 
  TreePine, 
  BarChart3,
  FileText,
  Users,
  Clock,
  RefreshCw,
  Download,
  Eye,
  Filter
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatNumber } from '@/lib/locale';

interface AIInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'recommendation' | 'alert';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  category: 'forest' | 'revenue' | 'compliance' | 'infrastructure';
  data: any;
  createdAt: string;
  status: 'new' | 'reviewed' | 'actioned';
}

interface AIInsightsDashboardProps {
  region?: string;
  timeRange?: 'week' | 'month' | 'quarter' | 'year';
}

const AIInsightsDashboard: React.FC<AIInsightsDashboardProps> = ({
  region = 'all',
  timeRange = 'month'
}) => {
  const { userRole, userPermissions } = useAuth();
  const { t } = useTranslation();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);

  // Role-based category access policy
  const roleCategoryAccess: Record<string, Array<AIInsight['category']> | 'all'> = {
    government: 'all',
    ministry_tribal: ['forest', 'compliance', 'infrastructure'],
    welfare_dept: ['forest', 'infrastructure'],
    forest_revenue: ['revenue', 'compliance'],
    planning_develop: ['infrastructure', 'forest'],
    ngo: ['forest', 'compliance'],
    normal: ['forest'],
    null: ['forest']
  };

  const roleLabel: Record<string, string> = {
    government: 'Government',
    ministry_tribal: 'Tribal Affairs',
    welfare_dept: 'Welfare Dept.',
    forest_revenue: 'Forest Revenue',
    planning_develop: 'Planning & Dev',
    ngo: 'NGO',
    normal: 'Citizen',
    null: 'Guest'
  };

  useEffect(() => {
    loadInsights();
  }, [region, timeRange]);

  const loadInsights = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock insights data
    const mockInsights: AIInsight[] = [
      {
        id: '1',
        type: 'trend',
        title: 'Increasing Forest Rights Applications in Tribal Areas',
        description: 'AI analysis shows 23% increase in FRA applications in tribal-dominated regions over the last quarter.',
        confidence: 0.89,
        impact: 'high',
        category: 'forest',
        data: {
          applications: 156,
          increase: 23,
          regions: ['Koraput', 'Adilabad', 'Nalaspora'],
          trend: 'upward'
        },
        createdAt: new Date().toISOString(),
        status: 'new'
      },
      {
        id: '2',
        type: 'anomaly',
        title: 'Unusual Land Use Pattern Detected',
        description: 'Satellite imagery analysis reveals potential encroachment in protected forest areas near Kendupali village.',
        confidence: 0.76,
        impact: 'high',
        category: 'compliance',
        data: {
          location: 'Kendupali, Koraput',
          area: '2.3 hectares',
          risk: 'high',
          coordinates: { lat: 18.8, lng: 82.7 }
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'reviewed'
      },
      {
        id: '3',
        type: 'recommendation',
        title: 'Optimize Forest Revenue Collection',
        description: 'AI suggests implementing digital payment systems in 12 villages to increase revenue collection by 15%.',
        confidence: 0.82,
        impact: 'medium',
        category: 'revenue',
        data: {
          villages: 12,
          potentialIncrease: 15,
          currentRevenue: 2400000,
          estimatedGain: 360000
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'actioned'
      },
      {
        id: '4',
        type: 'alert',
        title: 'High-Risk FRA Application Detected',
        description: 'Application FRA-002 shows discrepancies between claimed area and satellite-detected boundaries.',
        confidence: 0.91,
        impact: 'high',
        category: 'compliance',
        data: {
          applicationId: 'FRA-002',
          claimedArea: '15.0 acres',
          detectedArea: '12.3 acres',
          discrepancy: 18
        },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'new'
      },
      {
        id: '5',
        type: 'trend',
        title: 'Infrastructure Development Impact',
        description: 'New road construction is affecting traditional forest access routes in 8 communities.',
        confidence: 0.78,
        impact: 'medium',
        category: 'infrastructure',
        data: {
          communities: 8,
          roadLength: '12.5 km',
          affectedArea: '45 hectares',
          mitigation: 'Alternative routes identified'
        },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'reviewed'
      }
    ];
    
    setInsights(mockInsights);
    setIsLoading(false);
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'trend': return <TrendingUp className="w-4 h-4" />;
      case 'anomaly': return <AlertTriangle className="w-4 h-4" />;
      case 'recommendation': return <Brain className="w-4 h-4" />;
      case 'alert': return <AlertTriangle className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'trend': return 'bg-blue-100 text-blue-800';
      case 'anomaly': return 'bg-red-100 text-red-800';
      case 'recommendation': return 'bg-green-100 text-green-800';
      case 'alert': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: AIInsight['impact']) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: AIInsight['category']) => {
    switch (category) {
      case 'forest': return <TreePine className="w-4 h-4" />;
      case 'revenue': return <BarChart3 className="w-4 h-4" />;
      case 'compliance': return <CheckCircle className="w-4 h-4" />;
      case 'infrastructure': return <MapPin className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const canSeeCategory = (category: AIInsight['category']) => {
    const allowed = roleCategoryAccess[userRole ?? 'null'];
    if (allowed === 'all') return true;
    return allowed.includes(category);
  };

  const filteredInsights = insights
    .filter(insight => selectedCategory === 'all' || insight.category === selectedCategory)
    .filter(insight => canSeeCategory(insight.category));

  const categories = [
    { id: 'all', label: t('ai.categories.all'), icon: Brain },
    { id: 'forest', label: t('ai.categories.forest'), icon: TreePine },
    { id: 'revenue', label: t('ai.categories.revenue'), icon: BarChart3 },
    { id: 'compliance', label: t('ai.categories.compliance'), icon: CheckCircle },
    { id: 'infrastructure', label: t('ai.categories.infrastructure'), icon: MapPin }
  ];

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-600">Loading AI insights...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t('ai.dashboardTitle')}</h2>
          <p className="text-muted-foreground">{t('ai.dashboardSubtitle')}</p>
        </div>
        <div className="flex gap-2">
          {/* Role badge and quick capabilities */}
          <Badge variant="outline" className="hidden md:inline-flex items-center gap-2">
            <Users className="w-4 h-4" /> {roleLabel[userRole ?? 'null']}
          </Badge>
          {!userPermissions?.canViewAnalytics && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">{t('ai.limitedView')}</Badge>
          )}
          <Button onClick={loadInsights} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('ai.refresh')}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            {t('ai.export')}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('ai.totalInsights')}</p>
                <p className="text-2xl font-bold">{formatNumber(insights.length, (navigator.language || 'en'))}</p>
              </div>
              <Brain className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('ai.highImpact')}</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatNumber(insights.filter(i => i.impact === 'high').length, (navigator.language || 'en'))}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('ai.newInsights')}</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatNumber(insights.filter(i => i.status === 'new').length, (navigator.language || 'en'))}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('ai.avgConfidence')}</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length * 100)}%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            {t('ai.filterByCategory')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights.map((insight) => (
          <Card 
            key={insight.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedInsight?.id === insight.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedInsight(insight)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1 rounded ${getInsightColor(insight.type)}`}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <Badge className={getInsightColor(insight.type)}>
                      {insight.type.toUpperCase()}
                    </Badge>
                    <Badge className={getImpactColor(insight.impact)}>
                      {insight.impact.toUpperCase()} IMPACT
                    </Badge>
                    <Badge variant="outline">
                      {(insight.confidence * 100).toFixed(0)}% Confidence
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{insight.title}</h3>
                  <p className="text-gray-600 mb-3">
                    {userPermissions?.canViewAnalytics ? (
                      insight.description
                    ) : (
                      t('ai.limitedDescription')
                    )}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(insight.category)}
                      <span className="capitalize">{insight.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(insight.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Badge variant={insight.status === 'new' ? 'default' : 'secondary'}>
                      {insight.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" disabled={!userPermissions?.canViewAnalytics}>
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insight Detail Modal */}
      {selectedInsight && (
        <Card className="fixed inset-4 z-50 overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getInsightIcon(selectedInsight.type)}
                  {selectedInsight.title}
                </CardTitle>
                <CardDescription>
                  {userPermissions?.canViewAnalytics ? selectedInsight.description : t('ai.limitedDetail')}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedInsight(null)}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">Confidence</div>
                  <div className="text-lg font-bold">{(selectedInsight.confidence * 100).toFixed(1)}%</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">Impact</div>
                  <div className="text-lg font-bold capitalize">{selectedInsight.impact}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">Status</div>
                  <div className="text-lg font-bold capitalize">{selectedInsight.status}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Data Details</h4>
                <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                  {userPermissions?.canViewAnalytics ? JSON.stringify(selectedInsight.data, null, 2) : t('ai.hidden')}
                </pre>
              </div>
              
              <div className="flex gap-2">
                <Button disabled={!userPermissions?.canEditClaims}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {t('ai.markReviewed')}
                </Button>
                <Button variant="outline" disabled={!userPermissions?.canGenerateReports}>
                  <Download className="w-4 h-4 mr-2" />
                  {t('ai.exportData')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIInsightsDashboard;
