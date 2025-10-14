// Demo data for FRA Portal
export const demoUsers = [
  {
    id: 'demo-gov-1',
    email: 'admin@fraportal.com',
    password: 'admin123',
    displayName: 'Government Admin',
    role: 'government' as const
  },
  {
    id: 'demo-local-1',
    email: 'user@fraportal.com',
    password: 'user123',
    displayName: 'Local User',
    role: 'local' as const
  },
  {
    id: 'demo-google-1',
    email: 'demo@fraportal.com',
    password: 'google123',
    displayName: 'Demo User',
    role: 'local' as const
  }
];

export const demoMessages = {
  welcome: 'Welcome to FRA Portal Demo!',
  loginInstructions: 'Use any email/password or click Google sign-in for demo access',
  features: [
    'Interactive Map View',
    'Claims Management',
    'Analytics Dashboard',
    'Mobile Responsive Design',
    'Role-based Access Control'
  ]
};
