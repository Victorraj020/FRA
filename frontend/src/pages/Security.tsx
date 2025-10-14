import React from 'react';
import { Shield, ArrowLeft, Lock, Eye, FileCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Security: React.FC = () => {
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
            <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold text-foreground mb-4">Security & Privacy</h1>
            <p className="text-muted-foreground text-lg">
              Your data security and privacy are our top priorities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-card p-6 rounded-lg border">
              <Lock className="w-8 h-8 mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-4">Data Encryption</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• End-to-end encryption for all data transmission</li>
                <li>• AES-256 encryption for data at rest</li>
                <li>• SSL/TLS certificates for secure connections</li>
                <li>• Regular security audits and penetration testing</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <Eye className="w-8 h-8 mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-4">Privacy Protection</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• GDPR compliant data handling</li>
                <li>• Minimal data collection principles</li>
                <li>• User consent for all data processing</li>
                <li>• Right to data deletion and portability</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <FileCheck className="w-8 h-8 mb-4 text-purple-600" />
              <h3 className="text-xl font-semibold mb-4">Compliance</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• ISO 27001 certified security management</li>
                <li>• SOC 2 Type II compliance</li>
                <li>• Regular compliance audits</li>
                <li>• Government data protection standards</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <Users className="w-8 h-8 mb-4 text-orange-600" />
              <h3 className="text-xl font-semibold mb-4">Access Control</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Multi-factor authentication (MFA)</li>
                <li>• Role-based access control (RBAC)</li>
                <li>• Regular access reviews</li>
                <li>• Audit logs for all user activities</li>
              </ul>
            </div>
          </div>

          <div className="bg-card p-8 rounded-lg border">
            <h3 className="text-2xl font-semibold mb-6">Security Contact</h3>
            <p className="text-muted-foreground mb-4">
              If you discover a security vulnerability or have security concerns, please contact our security team immediately.
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> security@fraportal.gov.in</p>
              <p><strong>Response Time:</strong> Within 24 hours</p>
              <p><strong>Bug Bounty:</strong> We appreciate responsible disclosure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
