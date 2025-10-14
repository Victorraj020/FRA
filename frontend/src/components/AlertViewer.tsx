import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  Megaphone, 
  FileText,
  MapPin,
  Calendar,
  Clock,
  Filter,
  Search,
  Download
} from 'lucide-react';
import { Alert as AlertType } from '@/data/mockData';

interface AlertViewerProps {
  alerts: AlertType[];
  onAlertClick?: (alert: AlertType) => void;
}

const AlertViewer: React.FC<AlertViewerProps> = ({ alerts, onAlertClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.village?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || alert.type === filterType;
    const matchesPriority = filterPriority === 'all' || alert.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesPriority && alert.isActive;
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'scheme': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'announcement': return <Megaphone className="w-5 h-5 text-purple-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'update': return <Info className="w-5 h-5 text-green-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'scheme': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'announcement': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'warning': return 'bg-red-100 text-red-800 border-red-200';
      case 'update': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="px-2 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Alerts & Announcements</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Stay updated with the latest information from the government</p>
      </div>

      {/* Filters */}
      <Card className="mx-2 sm:mx-0">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-32 text-sm">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="scheme">Schemes</SelectItem>
                  <SelectItem value="announcement">Announcements</SelectItem>
                  <SelectItem value="warning">Warnings</SelectItem>
                  <SelectItem value="update">Updates</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full sm:w-32 text-sm">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-3 sm:space-y-4 px-2 sm:px-0">
        {filteredAlerts.length === 0 ? (
          <Card className="mx-2 sm:mx-0">
            <CardContent className="p-6 sm:p-8 text-center">
              <Bell className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">No Alerts Found</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                {searchTerm || filterType !== 'all' || filterPriority !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'No active alerts at the moment'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`border transition-all duration-200 hover:shadow-md mx-2 sm:mx-0 ${
                isExpired(alert.expiresAt) ? 'opacity-60' : ''
              }`}
            >
              <CardHeader className="p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="break-words">{alert.title}</span>
                        {isExpired(alert.expiresAt) && (
                          <Badge variant="outline" className="text-gray-500 text-xs w-fit">
                            Expired
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-2 mt-1 text-xs sm:text-sm">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="break-words">
                          {alert.village && `${alert.village}, `}
                          {alert.district}, {alert.state}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={`${getTypeColor(alert.type)} text-xs`}>
                      {alert.type.toUpperCase()}
                    </Badge>
                    <Badge className={`${getPriorityColor(alert.priority)} text-xs`}>
                      {alert.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-3 sm:p-6 pt-0">
                <p className="text-sm sm:text-base text-foreground mb-4 leading-relaxed break-words">{alert.message}</p>
                
                {/* Attachments */}
                {alert.attachments && alert.attachments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs sm:text-sm font-medium text-foreground mb-2">Attachments:</h4>
                    <div className="flex flex-wrap gap-2">
                      {alert.attachments.map((attachment, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs px-2 py-1"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          <span className="truncate max-w-[120px]">{attachment}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-muted-foreground pt-4 border-t gap-2 sm:gap-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                    <span className="break-words">By: {alert.createdBy}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="break-words">Target: {alert.targetAudience}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="break-words">{new Date(alert.createdAt).toLocaleDateString()}</span>
                    </div>
                    {alert.expiresAt && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="break-words">
                          {isExpired(alert.expiresAt) ? 'Expired' : `Expires: ${new Date(alert.expiresAt).toLocaleDateString()}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary */}
      <Card className="bg-muted/30 mx-2 sm:mx-0">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <span className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              Showing {filteredAlerts.length} of {alerts.length} alerts
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center justify-center sm:justify-start space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>High Priority</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start space-x-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Medium Priority</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Low Priority</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertViewer;
