import React, { useState, useEffect } from 'react';
import { Activity, ArrowLeft, CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  uptime: string;
  lastIncident?: string;
}

const Status: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'FRA Portal API',
      status: 'operational',
      uptime: '99.9%',
    },
    {
      name: 'Authentication Service',
      status: 'operational',
      uptime: '99.8%',
    },
    {
      name: 'Map Services',
      status: 'operational',
      uptime: '99.7%',
    },
    {
      name: 'File Upload Service',
      status: 'degraded',
      uptime: '98.5%',
      lastIncident: 'Increased response times detected'
    },
    {
      name: 'Database',
      status: 'operational',
      uptime: '99.9%',
    },
    {
      name: 'Email Notifications',
      status: 'operational',
      uptime: '99.6%',
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'outage':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'outage':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center mb-12">
            <Activity className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold text-foreground mb-4">System Status</h1>
            <p className="text-muted-foreground text-lg">
              Real-time status of all FRA Portal services
            </p>
          </div>

          {/* Overall Status */}
          <div className="bg-card p-6 rounded-lg border mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold mb-2">All Systems Operational</h3>
                <p className="text-muted-foreground">All services are running normally</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">99.7%</div>
                <div className="text-sm text-muted-foreground">Overall Uptime</div>
              </div>
            </div>
          </div>

          {/* Services Status */}
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-semibold">Service Status</h3>
            {services.map((service, index) => (
              <div key={index} className="bg-card p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <h4 className="font-semibold">{service.name}</h4>
                      {service.lastIncident && (
                        <p className="text-sm text-muted-foreground">{service.lastIncident}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">{service.uptime} uptime</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(service.status)}`}>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Incidents */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Recent Incidents</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-yellow-500 pl-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">File Upload Service - Degraded Performance</h4>
                  <span className="text-sm text-muted-foreground">2 hours ago</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Some users may experience slower file upload times. We're investigating the issue.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Scheduled Maintenance Completed</h4>
                  <span className="text-sm text-muted-foreground">1 day ago</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Database optimization completed successfully. All services restored.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
