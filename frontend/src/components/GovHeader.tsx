import React from 'react';
import { Home, Info, PhoneCall, User, ChevronDown, LogOut, LogIn, Mail, Shield, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Megaphone } from 'lucide-react';

const TICKER_MESSAGES = [
  "New FRA guidelines issued for PVTGs (Particularly Vulnerable Tribal Groups).",
  "Application processing times have been reduced by 20% across 5 states.",
  "Scheduled maintenance on Friday, 11:00 PM to 2:00 AM IST.",
  "Over 10,000 community land rights distributed in Maharashtra this quarter."
];

const GovHeader: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currentUser, logout, userRole, userPermissions } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [highContrast, setHighContrast] = React.useState(false);
  const navigate = useNavigate();

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    if (!highContrast) {
      document.documentElement.classList.add('contrast-more', 'grayscale');
    } else {
      document.documentElement.classList.remove('contrast-more', 'grayscale');
    }
  };

  const handleSignIn = () => { navigate('/login'); setIsMobileMenuOpen(false); };
  const handleLogout = async () => {
    setIsMobileMenuOpen(false);
    try { await logout(); } finally { window.location.href = '/'; }
  };

  const goToMap = () => {
    setIsMobileMenuOpen(false);
    switch (userRole) {
      case 'government': navigate('/government-dashboard?tab=map'); break;
      case 'ministry_tribal': navigate('/tribal-dashboard'); break;
      case 'welfare_dept': navigate('/welfare-dashboard'); break;
      case 'forest_revenue': navigate('/forest-revenue-dashboard'); break;
      case 'planning_develop': navigate('/planning-development-dashboard'); break;
      case 'ngo': navigate('/ngo-dashboard'); break;
      default: navigate('/local-dashboard?tab=map');
    }
  };

  const goToFraApplications = () => {
    setIsMobileMenuOpen(false);
    switch (userRole) {
      case 'government': navigate('/government-dashboard?tab=fra-applications'); break;
      default: navigate('/local-dashboard?tab=fra-applications');
    }
  };

  const goToComplaints = () => {
    setIsMobileMenuOpen(false);
    switch (userRole) {
      case 'government': navigate('/government-dashboard?tab=complaints'); break;
      default: navigate('/local-dashboard?tab=complaints');
    }
  };

  const goToAnalytics = () => {
    setIsMobileMenuOpen(false);
    switch (userRole) {
      case 'government': navigate('/government-dashboard?tab=analytics'); break;
      default: navigate('/local-dashboard?tab=analytics');
    }
  };

  const goToAlerts = () => {
    setIsMobileMenuOpen(false);
    switch (userRole) {
      case 'government': navigate('/government-dashboard?tab=alerts'); break;
      default: navigate('/local-dashboard?tab=alerts');
    }
  };

  const goToOCR = () => {
    setIsMobileMenuOpen(false);
    switch (userRole) {
      case 'government': navigate('/government-dashboard?tab=ocr'); break;
      default: navigate('/local-dashboard?tab=ocr');
    }
  };

  const navLinks = [
    { label: 'Home', onClick: () => { setIsMobileMenuOpen(false); navigate('/'); }, icon: <Home className="w-4 h-4" /> },
    { label: 'Map', onClick: goToMap },
    ...(userPermissions?.canViewAnalytics ? [{ label: 'Analytics', onClick: goToAnalytics }] : []),
    { label: 'FRA Applications', onClick: goToFraApplications },
    { label: 'Complaints', onClick: goToComplaints },
    ...(userPermissions?.canManageAlerts ? [{ label: 'Alerts', onClick: goToAlerts }] : []),
    { label: 'Document Digitizer', onClick: goToOCR },
    { label: 'MoTA', onClick: () => { setIsMobileMenuOpen(false); navigate('/mota-info'); }, icon: <Info className="w-4 h-4" /> },
    { label: 'Status', onClick: () => { setIsMobileMenuOpen(false); navigate('/status'); }, icon: <PhoneCall className="w-4 h-4" /> },
  ];

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50 bg-card">
      {/* Top bar */}
      <div className="w-full text-xs bg-muted text-muted-foreground">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between flex-wrap gap-2">
          <span className="hidden sm:block">GOVERNMENT OF INDIA | MINISTRY OF TRIBAL AFFAIRS</span>
          <span className="sm:hidden text-[10px]">GOVT. OF INDIA · MoTA</span>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={toggleHighContrast} className="hover:text-primary transition-colors hidden sm:block">
              {highContrast ? "Standard View" : "High Contrast"}
            </button>
            <div className="hidden sm:flex items-center gap-1">
              <button aria-label="A-" className="px-1.5 border rounded text-xs">A-</button>
              <button aria-label="A" className="px-1.5 border rounded text-xs">A</button>
              <button aria-label="A+" className="px-1.5 border rounded text-xs">A+</button>
            </div>
            <select
              aria-label={t('lang.label', { defaultValue: 'Language' })}
              className="bg-white/80 text-foreground border rounded px-2 py-0.5 text-xs"
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

      {/* Main header bar */}
      <div className="w-full border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div>
              <div className="text-xs text-muted-foreground hidden sm:block">MINISTRY OF TRIBAL AFFAIRS</div>
              <div className="text-base sm:text-xl font-semibold leading-tight">Government of India</div>
            </div>
            <img
              src="/Symbol.jpg"
              alt="Government of India Emblem"
              className="h-10 sm:h-12 md:h-14 w-auto"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5 text-sm flex-1 justify-center">
            {navLinks.map(link => (
              <button
                key={link.label}
                onClick={link.onClick}
                className="hover:text-primary flex items-center gap-1 whitespace-nowrap transition-colors"
              >
                {link.icon}{link.label}
              </button>
            ))}
          </nav>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
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
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
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

          {/* Mobile: hamburger button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-b shadow-lg">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map(link => (
              <button
                key={link.label}
                onClick={link.onClick}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-muted text-sm font-medium text-foreground transition-colors text-left w-full"
              >
                {link.icon}{link.label}
              </button>
            ))}

            <div className="border-t mt-2 pt-2">
              {currentUser ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{currentUser.displayName || currentUser.email?.split('@')[0]}</span>
                    <span className="ml-1 text-xs">({userRole})</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg w-full text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg w-full text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(10%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee { display: inline-flex; animation: marquee 40s linear infinite; white-space: nowrap; }
        .animate-marquee:hover { animation-play-state: paused; }
      `}</style>

      {/* Live Ticker Section */}
      <div className="bg-white border-b border-gray-200 p-2 overflow-hidden flex items-center w-full">
        <Megaphone className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 animate-pulse ml-4" />
        <div className="flex-1 overflow-hidden relative h-6">
          <div className="absolute animate-marquee space-x-16 cursor-default">
            {TICKER_MESSAGES.map((msg, idx) => (
              <span key={idx} className="text-sm text-gray-700 tracking-wide">{msg}</span>
            ))}
            {/* Duplicate for seamless infinite scrolling */}
            {TICKER_MESSAGES.map((msg, idx) => (
              <span key={`dup-${idx}`} className="text-sm text-gray-700 tracking-wide">{msg}</span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default GovHeader;
