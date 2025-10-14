import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search, Filter, TrendingUp, Users, MapPin, FileCheck, AlertCircle, X } from 'lucide-react';
import { mockStates, mockStatistics, mockRecommendations } from '@/data/mockData';
import { loadStateSchemes, type SchemeCard } from '@/lib/utils';

interface ControlPanelProps {
  selectedFilters: {
    state: string;
    district: string;
    status: string;
  };
  onFilterChange: (filters: any) => void;
  onClose?: () => void;
  isMobile?: boolean;
  showForests?: boolean;
  onToggleForests?: (show: boolean) => void;
  mapMode?: 'both' | 'forests' | 'fra';
  onMapModeChange?: (mode: 'both' | 'forests' | 'fra') => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ selectedFilters, onFilterChange, onClose, isMobile = false, showForests = false, onToggleForests, mapMode = 'both', onMapModeChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();
  const [schemes, setSchemes] = useState<SchemeCard[] | null>(null);

  React.useEffect(() => {
    loadStateSchemes().then((data) => {
      setSchemes(data);
    }).catch(() => setSchemes([]));
  }, []);

  const pieData = [
    { name: 'Approved', value: mockStatistics.approvedClaims, color: 'hsl(var(--status-approved))' },
    { name: 'Pending', value: mockStatistics.pendingClaims, color: 'hsl(var(--status-pending))' },
    { name: 'Rejected', value: mockStatistics.rejectedClaims, color: 'hsl(var(--status-rejected))' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full bg-dashboard-sidebar overflow-y-auto mobile-scroll">
      {/* Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 bg-dashboard-sidebar border-b p-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold">{t('filters.controlPanel')}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      
      <Tabs defaultValue="filters" className="w-full">
        <TabsList className={`grid w-full grid-cols-4 bg-card ${isMobile ? 'm-2 mb-2' : 'm-4 mb-2'}`}>
          <TabsTrigger value="filters" className="text-xs">{t('filters.tab')}</TabsTrigger>
          <TabsTrigger value="stats" className="text-xs">{t('filters.statsTab')}</TabsTrigger>
          <TabsTrigger value="recommendations" className="text-xs">{t('filters.schemesTab')}</TabsTrigger>
          <TabsTrigger value="documents" className="text-xs">{t('filters.docsTab')}</TabsTrigger>
        </TabsList>

        <div className={`${isMobile ? 'px-2 pb-4' : 'px-4 pb-4'}`}>
          <TabsContent value="filters" className="space-y-4 mt-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  {t('filters.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t('filters.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('filters.state')}</label>
                    <Select 
                      value={selectedFilters.state} 
                      onValueChange={(value) => onFilterChange({ ...selectedFilters, state: value, district: '' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('filters.selectState')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-states">{t('filters.allStates')}</SelectItem>
                        {mockStates.map((state) => {
                          const isHighlightedState = ['Madhya Pradesh', 'Odisha', 'Telangana', 'Tripura'].includes(state.name);
                          return (
                            <SelectItem 
                              key={state.name} 
                              value={state.name}
                              className={isHighlightedState ? "text-red-500 font-semibold bg-red-50" : ""}
                            >
                              {isHighlightedState && "🔴 "}{state.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('filters.district')}</label>
                    <Select 
                      value={selectedFilters.district}
                      onValueChange={(value) => onFilterChange({ ...selectedFilters, district: value })}
                      disabled={!selectedFilters.state}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('filters.selectDistrict')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-districts">{t('filters.allDistricts')}</SelectItem>
                        {selectedFilters.state && mockStates
                          .find(s => s.name === selectedFilters.state)?.districts
                          .map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('filters.status')}</label>
                    <Select 
                      value={selectedFilters.status}
                      onValueChange={(value) => onFilterChange({ ...selectedFilters, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('filters.allStatus')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-status">{t('filters.allStatus')}</SelectItem>
                        <SelectItem value="Approved">{t('status.approved')}</SelectItem>
                        <SelectItem value="Pending">{t('status.pending')}</SelectItem>
                        <SelectItem value="Rejected">{t('status.rejected')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={() => onFilterChange({ state: 'all-states', district: 'all-districts', status: 'all-status' })}
                    variant="outline" 
                    className="w-full"
                    size="sm"
                  >
                    {t('filters.clear')}
                  </Button>
                  
                  {onToggleForests && (
                    <div className="pt-3 border-t">
                      <label className="flex items-center space-x-2 text-xs">
                        <input
                          type="checkbox"
                          checked={showForests}
                          onChange={(e) => onToggleForests(e.target.checked)}
                          className="rounded"
                        />
                        <span>{t('filters.showForests')}</span>
                      </label>
                    </div>
                  )}
                  
                  {onMapModeChange && (
                    <div className="pt-3 border-t">
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">{t('filters.mapMode')}</label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-xs">
                          <input
                            type="radio"
                            name="mapMode"
                            value="both"
                            checked={mapMode === 'both'}
                            onChange={(e) => onMapModeChange(e.target.value as 'both' | 'forests' | 'fra')}
                            className="rounded"
                          />
                          <span>{t('filters.modeBoth')}</span>
                        </label>
                        <label className="flex items-center space-x-2 text-xs">
                          <input
                            type="radio"
                            name="mapMode"
                            value="fra"
                            checked={mapMode === 'fra'}
                            onChange={(e) => onMapModeChange(e.target.value as 'both' | 'forests' | 'fra')}
                            className="rounded"
                          />
                          <span>{t('filters.modeFRA')}</span>
                        </label>
                        <label className="flex items-center space-x-2 text-xs">
                          <input
                            type="radio"
                            name="mapMode"
                            value="forests"
                            checked={mapMode === 'forests'}
                            onChange={(e) => onMapModeChange(e.target.value as 'both' | 'forests' | 'fra')}
                            className="rounded"
                          />
                          <span>{t('filters.modeForests')}</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4 mt-2">
            <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
              <Card className="p-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total Villages</p>
                    <p className="text-lg font-bold">{mockStatistics.totalVillages.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-status-approved" />
                  <div>
                    <p className="text-xs text-muted-foreground">Approved</p>
                    <p className="text-lg font-bold text-status-approved">{mockStatistics.approvedClaims.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-status-pending" />
                  <div>
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="text-lg font-bold text-status-pending">{mockStatistics.pendingClaims.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-secondary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Forest Cover</p>
                    <p className="text-lg font-bold text-secondary">{mockStatistics.forestCoverPercent}%</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Claims Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={mockStatistics.monthlyGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="approved" fill="hsl(var(--status-approved))" />
                    <Bar dataKey="pending" fill="hsl(var(--status-pending))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-3 mt-2">
            {(() => {
              const useReal = schemes && schemes.length > 0;
              const base = useReal ? (schemes as SchemeCard[]) : mockRecommendations;
              const filtered = useReal
                ? base.filter((s: any) => selectedFilters.state === 'all-states' || !s.location || s.location === selectedFilters.state)
                : base;
              return filtered.slice(0, 30).map((item: any, idx: number) => {
                const title = useReal ? (item.schemeName || item.title || 'Scheme') : item.title;
                const priority = useReal ? (item.priority || 'Medium') : item.priority;
                const description = useReal ? (item.description || item.sector || '') : item.description;
                const leftFoot = useReal ? (item.location || item.implementingAgency || '—') : `${item.villages} villages`;
                const officialUrl = useReal ? item.officialUrl : undefined;
                const rightFoot = useReal ? (item.implementingAgency || '') : `${item.estimatedImpact} impact`;
                return (
                  <Card key={idx} className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{title}</h4>
                        <Badge className={`text-white text-xs ${getPriorityColor(priority)}`}>{priority}</Badge>
                      </div>
                      {description && <p className="text-xs text-muted-foreground line-clamp-3">{description}</p>}
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground truncate max-w-[55%]">{leftFoot}</span>
                        {officialUrl ? (
                          <a href={officialUrl} target="_blank" rel="noreferrer" className="text-secondary font-medium hover:underline">Official Page</a>
                        ) : (
                          <span className="text-secondary font-medium truncate max-w-[40%]">{rightFoot}</span>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              });
            })()}
          </TabsContent>

          <TabsContent value="documents" className="space-y-4 mt-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Document Viewer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-6 text-center">
                  <FileCheck className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Select a village to view related documents
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    Upload Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ControlPanel;