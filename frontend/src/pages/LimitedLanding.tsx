import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowRight } from 'lucide-react';
import MapView from '@/components/MapView';

const LimitedLanding: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-dashboard-nav text-dashboard-nav-foreground shadow-lg border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center border-2 border-white">
                <MapPin className="w-4 h-4 sm:w-6 sm:h-6 text-black" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">{t('app.title')}</h1>
                <p className="text-xs sm:text-sm opacity-90 hidden sm:block">{t('app.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/20 bg-white/5">{t('landing.nav.userLogin')}</Button>
              </Link>
              <Link to="/role-selection">
                <Button className="bg-white text-dashboard-nav hover:bg-white/90">{t('limited.selectRole')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative py-4 sm:py-6">
          <div className="container mx-auto px-4 sm:px-6">
            <Badge className="mb-3 bg-black text-white border-0">{t('limited.badge')}</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">{t('limited.title')}</h2>
            <p className="text-muted-foreground mb-4 max-w-2xl">{t('limited.description')}</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <Card className="overflow-hidden">
                  <div className="h-[60vh]">
                    <MapView 
                      // required callbacks are no-ops in limited mode
                      onVillageSelect={() => {}}
                      onStateSelect={() => {}}
                      userType="local"
                      showForests={false}
                      showFRA={true}
                      mapMode="fra"
                      limitedMode={true}
                    />
                  </div>
                </Card>
              </div>
              <div className="space-y-3">
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">{t('limited.canSee.title')}</h3>
                  <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                    <li>{t('limited.canSee.basic')}</li>
                    <li>{t('limited.canSee.boundaries')}</li>
                    <li>{t('limited.canSee.totals')}</li>
                  </ul>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">{t('limited.restricted.title')}</h3>
                  <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                    <li>{t('limited.restricted.details')}</li>
                    <li>{t('limited.restricted.tools')}</li>
                    <li>{t('limited.restricted.ai')}</li>
                  </ul>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">{t('limited.needAccess.title')}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t('limited.needAccess.desc')}</p>
                  <div className="flex gap-2">
                    <Link to="/login" className="w-full">
                      <Button className="w-full">{t('auth.signIn')} <ArrowRight className="ml-2 w-4 h-4" /></Button>
                    </Link>
                    <Link to="/signup" className="w-full">
                      <Button variant="outline" className="w-full">{t('limited.createAccount')}</Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-dashboard-nav text-dashboard-nav-foreground py-8 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 text-sm opacity-80 text-center">
          <p>&copy; 2024 {t('app.title')} · {t('limited.badge')}</p>
        </div>
      </footer>
    </div>
  );
};

export default LimitedLanding;


