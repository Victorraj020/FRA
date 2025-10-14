import React from 'react';
import { Home, Info, PhoneCall, User, ChevronDown, LogOut, LogIn, Mail, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const GovHeader: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currentUser, logout, userRole, userPermissions } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleSignIn = () => navigate('/login');
  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      window.location.href = '/';
    }
  };

  // Removed My Role navigation per request

  const goToMap = () => {
    switch (userRole) {
      case 'government':
        navigate('/government-dashboard?tab=map');
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
      case 'normal':
      default:
        navigate('/local-dashboard?tab=map');
    }
  };

  const goToFraApplications = () => {
    switch (userRole) {
      case 'government':
        navigate('/government-dashboard?tab=fra-applications');
        break;
      case 'normal':
      default:
        navigate('/local-dashboard?tab=fra-applications');
    }
  };

  const goToComplaints = () => {
    switch (userRole) {
      case 'government':
        navigate('/government-dashboard?tab=complaints');
        break;
      case 'normal':
      default:
        navigate('/local-dashboard?tab=complaints');
    }
  };

  const goToAnalytics = () => {
    switch (userRole) {
      case 'government':
        navigate('/government-dashboard?tab=analytics');
        break;
      case 'normal':
      default:
        navigate('/local-dashboard?tab=analytics');
    }
  };

  const goToAlerts = () => {
    switch (userRole) {
      case 'government':
        navigate('/government-dashboard?tab=alerts');
        break;
      case 'normal':
      default:
        navigate('/local-dashboard?tab=alerts');
    }
  };

  const goToOCR = () => {
    switch (userRole) {
      case 'government':
        navigate('/government-dashboard?tab=ocr');
        break;
      case 'normal':
      default:
        navigate('/local-dashboard?tab=ocr');
    }
  };

  // Removed AI Insights navigation per request

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50 bg-card">
      <div className="w-full text-xs bg-muted text-muted-foreground">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <span>GOVERNMENT OF INDIA | MINISTRY OF TRIBAL AFFAIRS</span>
          <div className="flex items-center gap-4">
            <button className="hover:text-primary transition-colors">Screen Reader Access</button>
            <div className="flex items-center gap-2">
              <button aria-label="A-" className="px-2 border rounded">A-</button>
              <button aria-label="A" className="px-2 border rounded">A</button>
              <button aria-label="A+" className="px-2 border rounded">A+</button>
            </div>
            {/* Language selector */}
            <select
              aria-label={t('lang.label', { defaultValue: 'Language' })}
              className="bg-white/80 text-foreground border rounded px-2 py-1 text-xs"
              value={i18n.language}
              onChange={(e) => { i18n.changeLanguage(e.target.value); localStorage.setItem('app_language', e.target.value); }}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="te">తెలుగు</option>
              <option value="or">ଓଡ଼ିଆ</option>
              <option value="bn">বাংলা</option>
            </select>
          </div>
        </div>
      </div>
      <div className="w-full border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-sm text-muted-foreground">MINISTRY OF TRIBAL AFFAIRS</div>
              <div className="text-xl font-semibold">Government of India</div>
            </div>
            {/* Emblem on the right side of the text */}
            <img
              src="/Symbol.jpg"
              alt="Government of India Emblem"
              className="h-12 md:h-14 w-auto"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a className="hover:text-primary flex items-center gap-1" href="/"><Home className="w-4 h-4"/>Home</a>
            <button className="hover:text-primary" onClick={goToMap}>Map</button>
             {userPermissions?.canViewAnalytics && (
               <button className="hover:text-primary" onClick={goToAnalytics}>Analytics</button>
             )}
            <button className="hover:text-primary" onClick={goToFraApplications}>FRA Applications</button>
             <button className="hover:text-primary" onClick={goToComplaints}>Complaints</button>
            {userPermissions?.canManageAlerts && (
              <button className="hover:text-primary" onClick={goToAlerts}>Alerts</button>
            )}
            <button className="hover:text-primary" onClick={goToOCR}>Document Digitizer</button>
            <a className="hover:text-primary flex items-center gap-1" href="/mota-info"><Info className="w-4 h-4"/>MoTA</a>
            <a className="hover:text-primary flex items-center gap-1" href="/status"><PhoneCall className="w-4 h-4"/>Status</a>
          </nav>
          {/* Auth controls */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="border-gray-300 text-foreground bg-white/70 flex items-center space-x-2 rounded-full px-3 py-1"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                  </span>
                  <span className="text-xs text-muted-foreground">({userRole || 'guest'})</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </Button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                          </h3>
                          <p className="text-sm text-gray-600">{currentUser.email}</p>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2"><Mail className="w-4 h-4" /><span>{currentUser.email}</span></div>
                        {userRole === 'government' && (
                          <div className="flex items-center space-x-2 text-green-600"><Shield className="w-4 h-4" /><span>Government Administrator</span></div>
                        )}
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleLogout}
                          className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <LogOut className="w-4 h-4 mr-2" /> Logout
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignIn}
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <LogIn className="w-4 h-4 mr-2" /> Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default GovHeader;


