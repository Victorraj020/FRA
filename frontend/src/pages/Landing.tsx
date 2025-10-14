import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  FileText, 
  BarChart3, 
  Shield, 
  Users, 
  Globe, 
  CheckCircle, 
  ArrowRight,
  Leaf,
  Database,
  Smartphone,
  Lock
} from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Hidden government login trigger: Ctrl+Alt+G, asks for passcode
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && (e.key === 'g' || e.key === 'G')) {
        const pass = window.prompt('Enter government access passcode');
        if (pass && pass === import.meta.env.VITE_GOV_PASSCODE) {
          navigate('/login?role=government');
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);
  const features = [
    {
      icon: MapPin,
      title: t('landing.features.mapping.title'),
      description: t('landing.features.mapping.desc')
    },
    {
      icon: BarChart3,
      title: t('landing.features.analytics.title'),
      description: t('landing.features.analytics.desc')
    },
    {
      icon: Shield,
      title: t('landing.features.security.title'),
      description: t('landing.features.security.desc')
    },
    {
      icon: Users,
      title: t('landing.features.users.title'),
      description: t('landing.features.users.desc')
    },
    {
      icon: Globe,
      title: t('landing.features.states.title'),
      description: t('landing.features.states.desc')
    },
    {
      icon: Smartphone,
      title: t('landing.features.mobile.title'),
      description: t('landing.features.mobile.desc')
    }
  ];

  const stats = [
    { label: t('landing.stats.states'), value: "28+", icon: MapPin },
    { label: t('landing.stats.villages'), value: "10,000+", icon: Database },
    { label: t('landing.stats.users'), value: "500+", icon: Users },
    { label: t('landing.stats.data'), value: "50,000+", icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="bg-dashboard-nav text-dashboard-nav-foreground shadow-lg border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center border-2 border-white">
                  <MapPin className="w-4 h-4 sm:w-6 sm:h-6 text-black" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold">{t('app.title')}</h1>
                  <p className="text-xs sm:text-sm opacity-90 hidden sm:block">{t('app.subtitle')}</p>
                </div>
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/20 bg-white/5"
                >
                  {t('landing.nav.userLogin')}
                </Button>
              </Link>
              <Link to="/signup">
                <Button 
                  className="bg-white text-dashboard-nav hover:bg-white/90 shadow-md"
                >
                  {t('landing.nav.signUp')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-muted/30"></div>
        <div className="relative container mx-auto text-center">
          <Badge className="mb-6 bg-black text-white border-0 px-4 py-2">
            <Leaf className="w-4 h-4 mr-2" />
            {t('landing.hero.badge')}
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            {t('landing.hero.headline1')}
            <span className="block text-black">
              {t('landing.hero.headline2')}
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('landing.hero.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t('landing.cta.getStarted')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-black text-black hover:bg-black hover:text-white px-8 py-4 text-lg font-semibold"
              >
                {t('auth.signIn')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t('landing.features.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border shadow-md">
                  <CardHeader>
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t('landing.tech.title')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('landing.tech.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "React 18", description: "Modern UI Framework" },
              { name: "TypeScript", description: "Type-Safe Development" },
              { name: "Firebase", description: "Secure Authentication" },
              { name: "Tailwind CSS", description: "Utility-First Styling" },
              { name: "Leaflet", description: "Interactive Maps" },
              { name: "Recharts", description: "Data Visualization" },
              { name: "shadcn/ui", description: "Beautiful Components" },
              { name: "Vite", description: "Fast Build Tool" }
            ].map((tech, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center mb-4 mx-auto border">
                  <div className="w-8 h-8 bg-black rounded"></div>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{tech.name}</h3>
                <p className="text-sm text-muted-foreground">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                {t('landing.security.title')}
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                {t('landing.security.subtitle')}
              </p>
              
              <div className="space-y-4">
                {[
                  t('landing.security.points.auth'),
                  t('landing.security.points.encryption'),
                  t('landing.security.points.api'),
                  t('landing.security.points.audits'),
                  t('landing.security.points.gdpr'),
                  t('landing.security.points.rbac')
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-black flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-8 shadow-xl border">
                <div className="text-center">
                  <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{t('landing.security.card.title')}</h3>
                  <p className="text-muted-foreground mb-6">
                    {t('landing.security.card.desc')}
                  </p>
                  <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                    <Shield className="w-4 h-4 mr-2" />
                    {t('landing.security.card.badge')}
                  </Badge>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            {t('landing.cta.title')}
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('landing.cta.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t('landing.cta.startTrial')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold"
              >
                {t('auth.signIn')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dashboard-nav text-dashboard-nav-foreground py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border-2 border-white">
                  <MapPin className="w-4 h-4 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t('app.title')}</h3>
                  <p className="text-sm opacity-90">{t('app.subtitle')}</p>
                </div>
              </div>
              <p className="text-sm opacity-80 max-w-md">
                {t('landing.footer.tagline')}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t('landing.footer.product.title')}</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>{t('landing.footer.product.features')}</li>
                <li>{t('landing.footer.product.security')}</li>
                <li>{t('landing.footer.product.pricing')}</li>
                <li>{t('landing.footer.product.docs')}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t('landing.footer.support.title')}</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>{t('landing.footer.support.help')}</li>
                <li>{t('landing.footer.support.contact')}</li>
                <li>{t('landing.footer.support.status')}</li>
                <li>{t('landing.footer.support.community')}</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm opacity-80">
            <p>&copy; 2024 {t('app.title')}. {t('landing.footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
