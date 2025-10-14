import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Users, 
  FileText, 
  BarChart3, 
  CheckCircle,
  ArrowRight,
  AlertCircle,
  Building2,
  Heart,
  TreePine,
  ClipboardList,
  UserCheck,
  Loader2
} from 'lucide-react';

const RoleSelection: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role);
    setShowLoginForm(true);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password, selectedRole as unknown as UserRole);
      
      // Navigate based on role
      switch (selectedRole) {
        case 'normal':
          navigate('/local-dashboard');
          break;
        case 'government':
          navigate('/government-dashboard');
          break;
        case 'ministry_tribal':
          navigate('/tribal-dashboard');
          break;
        case 'welfare_dept':
          navigate('/welfare-dashboard');
          break;
        case 'forest_revenue':
          navigate('/forest-revenue-dashboard');
          break;
        case 'planning_develop':
          navigate('/planning-development-dashboard');
          break;
        case 'ngo':
          navigate('/ngo-dashboard');
          break;
        default:
          navigate('/local-dashboard');
      }
    } catch (error) {
      setError('Failed to log in. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle(selectedRole as unknown as UserRole);
      
      // Navigate based on role
      switch (selectedRole) {
        case 'normal':
          navigate('/local-dashboard');
          break;
        case 'government':
          navigate('/government-dashboard');
          break;
        case 'ministry_tribal':
          navigate('/tribal-dashboard');
          break;
        case 'welfare_dept':
          navigate('/welfare-dashboard');
          break;
        case 'forest_revenue':
          navigate('/forest-revenue-dashboard');
          break;
        case 'planning_develop':
          navigate('/planning-development-dashboard');
          break;
        case 'ngo':
          navigate('/ngo-dashboard');
          break;
        default:
          navigate('/local-dashboard');
      }
    } catch (error) {
      setError('Google login failed. Please try again.');
      console.error('Google login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: 'normal',
      title: 'Normal User',
      icon: Users,
      description: 'General public access to view forest rights information',
      features: [
        'View forest rights claims status',
        'Submit complaints and issues',
        'Track claim progress',
        'Access basic analytics',
        'View approved claims',
        'Report discrepancies'
      ],
      color: 'bg-blue-500 text-white',
      badgeColor: 'bg-blue-100 text-blue-800',
      credentials: { email: 'user@fraportal.com', password: 'user123' }
    },
    {
      id: 'government',
      title: 'Government User',
      icon: Shield,
      description: 'Full administrative access to manage forest rights claims',
      features: [
        'Approve, deny, or set claims to pending',
        'View and respond to user complaints',
        'Edit claim details and status',
        'Access comprehensive analytics',
        'Manage user permissions',
        'Generate reports and insights'
      ],
      color: 'bg-red-500 text-white',
      badgeColor: 'bg-red-100 text-red-800',
      credentials: { email: 'gov@fraportal.com', password: 'gov123' }
    },
    {
      id: 'ministry_tribal',
      title: 'Ministry of Tribal Affairs',
      icon: Building2,
      description: 'Specialized access for tribal affairs management',
      features: [
        'Manage tribal forest rights',
        'Review tribal claims',
        'Coordinate with local authorities',
        'Generate tribal reports',
        'Monitor tribal welfare',
        'Access tribal analytics'
      ],
      color: 'bg-green-500 text-white',
      badgeColor: 'bg-green-100 text-green-800',
      credentials: { email: 'tribal@fraportal.com', password: 'tribal123' }
    },
    {
      id: 'welfare_dept',
      title: 'Welfare Department (DAJGUA)',
      icon: Heart,
      description: 'Welfare department access for social services',
      features: [
        'Manage welfare claims',
        'Review social benefits',
        'Coordinate welfare programs',
        'Generate welfare reports',
        'Monitor social services',
        'Access welfare analytics'
      ],
      color: 'bg-purple-500 text-white',
      badgeColor: 'bg-purple-100 text-purple-800',
      credentials: { email: 'welfare@fraportal.com', password: 'welfare123' }
    },
    {
      id: 'forest_revenue',
      title: 'Forest & Revenue Department',
      icon: TreePine,
      description: 'Forest and revenue management access',
      features: [
        'Manage forest resources',
        'Review revenue claims',
        'Coordinate forest activities',
        'Generate forest reports',
        'Monitor forest health',
        'Access forest analytics'
      ],
      color: 'bg-emerald-500 text-white',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      credentials: { email: 'forest@fraportal.com', password: 'forest123' }
    },
    {
      id: 'planning_develop',
      title: 'Planning & Development Authority',
      icon: ClipboardList,
      description: 'Planning and development management access',
      features: [
        'Manage development projects',
        'Review planning applications',
        'Coordinate development activities',
        'Generate planning reports',
        'Monitor project progress',
        'Access development analytics'
      ],
      color: 'bg-orange-500 text-white',
      badgeColor: 'bg-orange-100 text-orange-800',
      credentials: { email: 'planning@fraportal.com', password: 'planning123' }
    },
    {
      id: 'ngo',
      title: 'NGO',
      icon: UserCheck,
      description: 'Non-governmental organization access',
      features: [
        'View forest rights information',
        'Submit NGO reports',
        'Track community projects',
        'Access NGO analytics',
        'Coordinate with government',
        'Monitor community welfare'
      ],
      color: 'bg-cyan-500 text-white',
      badgeColor: 'bg-cyan-100 text-cyan-800',
      credentials: { email: 'ngo@fraportal.com', password: 'ngo123' }
    }
  ];

  if (showLoginForm) {
    const selectedRoleData = roles.find(role => role.id === selectedRole);
    
    return (
      <div className="min-h-screen bg-background">
        {/* Login Form */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${selectedRoleData?.color}`}>
                  {selectedRoleData && React.createElement(selectedRoleData.icon, { className: "w-8 h-8" })}
                </div>
                <CardTitle className="text-2xl font-bold">{selectedRoleData?.title} Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access the {selectedRoleData?.title} dashboard
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
                
                {selectedRole === 'normal' && (
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mt-4"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </Button>
                  </div>
                )}
                
                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h4 className="font-semibold text-blue-800 mb-2">Demo Credentials:</h4>
                  <p className="text-sm text-blue-700">
                    <strong>Email:</strong> {selectedRoleData?.credentials.email}<br />
                    <strong>Password:</strong> {selectedRoleData?.credentials.password}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Top 4 roles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-8">
          {roles.slice(0, 4).map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <Card 
                key={role.id} 
                className={`group card-interactive border-2 cursor-pointer transition-all duration-200 hover:shadow-lg h-full flex flex-col ${
                  isSelected ? 'border-black shadow-lg ring-4 ring-gray-200' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleRoleSelection(role.id)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${role.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl font-bold">{role.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col">
                  
                  <div className="mt-auto pt-4 border-t">
                    <Button
                      className={`w-full ${role.color} hover:opacity-90`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoleSelection(role.id);
                      }}
                      disabled={loading}
                    >
                      {role.title === 'Normal User' ? 'Login as User' : 
                       role.title === 'Government User' ? 'Login as Gov' :
                       role.title === 'Ministry of Tribal Affairs' ? 'Login as Tribal' :
                       role.title === 'Welfare Department (DAJGUA)' ? 'Login as Welfare' :
                       role.title === 'Forest & Revenue Department' ? 'Login as Forest' :
                       role.title === 'Planning & Development Authority' ? 'Login as Planning' :
                       role.title === 'NGO' ? 'Login as NGO' :
                       `Login as ${role.title.split(' ')[0]}`}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom 3 roles */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
          {roles.slice(4).map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <Card 
                key={role.id} 
                className={`group card-interactive border-2 cursor-pointer transition-all duration-200 hover:shadow-lg h-full flex flex-col ${
                  isSelected ? 'border-black shadow-lg ring-4 ring-gray-200' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleRoleSelection(role.id)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${role.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl font-bold">{role.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col">
                  
                  <div className="mt-auto pt-4 border-t">
                    <Button
                      className={`w-full ${role.color} hover:opacity-90`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoleSelection(role.id);
                      }}
                      disabled={loading}
                    >
                      {role.title === 'Normal User' ? 'Login as User' : 
                       role.title === 'Government User' ? 'Login as Gov' :
                       role.title === 'Ministry of Tribal Affairs' ? 'Login as Tribal' :
                       role.title === 'Welfare Department (DAJGUA)' ? 'Login as Welfare' :
                       role.title === 'Forest & Revenue Department' ? 'Login as Forest' :
                       role.title === 'Planning & Development Authority' ? 'Login as Planning' :
                       role.title === 'NGO' ? 'Login as NGO' :
                       `Login as ${role.title.split(' ')[0]}`}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-16 max-w-6xl mx-auto">
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="w-6 h-6 text-black" />
                <CardTitle className="text-xl">User Role Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Government Users</h4>
                  <p className="text-muted-foreground text-sm">
                    Full administrative control over forest rights claims. Can approve, deny, 
                    edit status, and respond to user complaints.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Normal Users</h4>
                  <p className="text-muted-foreground text-sm">
                    Can view forest rights information, track claim progress, and submit complaints 
                    or issues.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Specialized Departments</h4>
                  <p className="text-muted-foreground text-sm">
                    Each department has specific access rights and features tailored to their 
                    responsibilities in forest rights management.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
