import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Documentation: React.FC = () => {
  const navigate = useNavigate();

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
            <FileText className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold text-foreground mb-4">Documentation</h1>
            <p className="text-muted-foreground text-lg">
              Comprehensive guides and API documentation for the FRA Portal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">User Guides</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Getting Started with FRA Portal</li>
                <li>• How to Submit Forest Rights Claims</li>
                <li>• Understanding Claim Status</li>
                <li>• Using the Interactive Map</li>
                <li>• Managing Your Profile</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">API Documentation</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Authentication & Authorization</li>
                <li>• Forest Rights API Endpoints</li>
                <li>• Map Data Integration</li>
                <li>• File Upload & Processing</li>
                <li>• Webhook Notifications</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Developer Resources</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• SDK Downloads</li>
                <li>• Code Examples</li>
                <li>• Integration Tutorials</li>
                <li>• Best Practices</li>
                <li>• Community Support</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Frequently Asked Questions</li>
                <li>• Troubleshooting Guide</li>
                <li>• Contact Support Team</li>
                <li>• Feature Requests</li>
                <li>• Bug Reports</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
