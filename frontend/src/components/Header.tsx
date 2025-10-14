import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { MapPin, BarChart3, Grid3X3, Menu, X, LogIn, LogOut, User, Bell, ChevronDown, Mail, Shield, Calendar, FileText, MessageSquare, Settings, Brain } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onToggleControlPanel?: () => void;
  isControlPanelOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onTabChange, 
  onToggleControlPanel,
  isControlPanelOpen = false 
}) => {
  const isMobile = useIsMobile();
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const { currentUser, logout, userRole, userPermissions } = useAuth();
  const navigate = useNavigate();
  const desktopProfileDropdownRef = useRef<HTMLDivElement>(null);
  const mobileProfileDropdownRef = useRef<HTMLDivElement>(null);

  // Role-based tabs
  const getTabs = () => {
    const baseTabs = [
      { id: 'dashboard', label: t('tabs.home'), icon: Grid3X3 },
    ];

    if (userPermissions.canAccessMap) {
      baseTabs.push({ id: 'map', label: t('tabs.map'), icon: MapPin });
    }

    // Add role-specific tabs
    if (userPermissions.canViewAnalytics) {
      baseTabs.push({ id: 'analytics', label: t('tabs.analytics'), icon: BarChart3 });
    }

    if (userPermissions.canSubmitFRAApplications) {
      baseTabs.push({ id: 'fra-applications', label: t('tabs.fraApplications'), icon: FileText });
    }

    // Complaints only for community-facing roles
    if (userRole === 'normal' || userRole === 'ngo') {
      baseTabs.push({ id: 'complaints', label: t('tabs.complaints'), icon: MessageSquare });
    }

    // Add alerts tab only for roles that can manage/view alerts per permissions
    if (userPermissions.canManageAlerts) {
      baseTabs.push({ id: 'alerts', label: t('tabs.alerts'), icon: Bell });
    }

    // AI Insights for data-heavy admin roles
    if (userRole === 'government' || userRole === 'ministry_tribal' || userRole === 'forest_revenue') {
      baseTabs.push({ id: 'ai-insights', label: t('tabs.aiInsights'), icon: Brain });
    }

    // Add role-specific dashboard tab for all authenticated users
    if (userRole) {
      baseTabs.push({ id: 'role-dashboard', label: t('tabs.myRole'), icon: Settings });
    }

    return baseTabs;
  };

  const tabs = getTabs();

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);

    // Route to appropriate pages for key tabs
    if (tabId === 'dashboard') {
      // Send users to their role home views
      switch (userRole) {
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
        case 'normal':
        default:
          // Local/anonymous users have a dedicated local dashboard
          navigate('/local-dashboard?tab=dashboard');
      }
    }

    if (tabId === 'role-dashboard') {
      switch (userRole) {
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
        case 'normal':
        default:
          navigate('/local-dashboard');
      }
    }

    // Map routing should open the Map tab of the current experience
    if (tabId === 'map') {
      switch (userRole) {
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
        case 'normal':
        default:
          // For unauthenticated and normal users, open local dashboard map tab
          navigate('/local-dashboard?tab=map');
      }
    }

    // Feature tabs should open the role-specific dashboards where those sections exist
    if (tabId === 'analytics' || tabId === 'fra-applications' || tabId === 'alerts' || tabId === 'complaints' || tabId === 'ai-insights') {
      switch (userRole) {
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
        case 'normal':
        default:
          navigate('/local-dashboard');
      }
    }

    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleLogout = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('=== HEADER LOGOUT STARTED ===');
    
    try {
      // Set loading state
      setIsLoggingOut(true);
      console.log('Loading state set to true');
      
      // Close dropdowns immediately
      setIsProfileDropdownOpen(false);
      setIsMobileMenuOpen(false);
      console.log('Dropdowns closed');
      
      // Call the logout function from AuthContext
      console.log('Calling logout from AuthContext');
      await logout();
      console.log('AuthContext logout completed');
      
      // Force immediate navigation using window.location for reliability
      console.log('Forcing navigation to home page');
      window.location.href = '/';
      
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, force navigation
      window.location.href = '/';
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const targetNode = event.target as Node;
      const clickedInsideDesktop = desktopProfileDropdownRef.current
        ? desktopProfileDropdownRef.current.contains(targetNode)
        : false;
      const clickedInsideMobile = mobileProfileDropdownRef.current
        ? mobileProfileDropdownRef.current.contains(targetNode)
        : false;

      if (!clickedInsideDesktop && !clickedInsideMobile) setIsProfileDropdownOpen(false);
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dashboard-nav text-dashboard-nav-foreground shadow-lg border-b" style={{ borderColor: 'var(--lang-accent)' }}>
      <div className="container mx-auto px-4 sm:px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2">
              {/* Left logo image (served from /frontend/public/1.png) */}
              <img
                src="/1.png"
                alt="Government of India"
                className="h-8 sm:h-10 w-auto rounded bg-white p-1 border-2"
                style={{ borderColor: 'var(--lang-accent)' }}
                onError={(e) => {
                  // Fallback: hide broken image and keep layout
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">{t('app.title')}</h1>
                <p className="text-xs sm:text-sm opacity-90 hidden sm:block">{t('app.subtitle')}</p>
              </div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Language selector */}
            <select
              aria-label={t('lang.label')}
              className="mr-3 bg-white/10 text-white border-white/40 rounded px-2 py-1 text-sm"
              value={i18n.language}
              onChange={(e) => { i18n.changeLanguage(e.target.value); localStorage.setItem('app_language', e.target.value); }}
            >
              <option className="text-black" value="en">{t('lang.english')}</option>
              <option className="text-black" value="hi">{t('lang.hindi')}</option>
              <option className="text-black" value="te">{t('lang.telugu')}</option>
              <option className="text-black" value="or">{t('lang.odia')}</option>
              <option className="text-black" value="bn">{t('lang.bengali')}</option>
            </select>
            <nav className="flex items-center gap-5">
              {tabs.map((tab) => {
                return (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    onClick={() => handleTabChange(tab.id)}
                    className={`group flex items-center font-medium text-white text-sm px-4 py-1.5 transition-colors hover:bg-transparent ${
                      activeTab === tab.id ? '' : ''
                    }`}
                  >
                    <span className={`${
                      activeTab === tab.id 
                        ? 'text-white border-b-2 border-white pb-0.5' 
                        : 'text-white/70 group-hover:text-white transition-colors'
                    }`}>{tab.label}</span>
                  </Button>
                );
              })}
            </nav>
            
            {/* Authentication Button - Positioned at the far right */}
            <div className="ml-6 pl-4 border-l border-white/10">
              {currentUser ? (
                <div className="relative" ref={desktopProfileDropdownRef}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleProfileDropdown}
                    className="border-transparent text-white hover:bg-white/15 bg-transparent flex items-center space-x-2 rounded-full px-3 py-1"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </Button>
                  
                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="p-4">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                            </h3>
                            <p className="text-sm text-gray-600">{currentUser.email}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center space-x-3 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{currentUser.email}</span>
                          </div>
                          
                          {userRole === 'government' && (
                            <div className="flex items-center space-x-3 text-sm text-gray-600">
                              <Shield className="w-4 h-4 text-green-600" />
                              <span className="text-green-600 font-medium">{t('auth.govAdmin')}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-3 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Member since {new Date().getFullYear()}</span>
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoggingOut ? (
                              <>
                                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                                {t('auth.loggingOut')}
                              </>
                            ) : (
                              <>
                                <LogOut className="w-4 h-4 mr-2" />
                                {t('auth.logout')}
                              </>
                            )}
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
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent transition-all duration-200 hover:shadow-lg hover:scale-105"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {t('auth.signIn')}
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Mobile Sign In Button - Right side */}
            {!currentUser && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignIn}
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent transition-all duration-200 hover:shadow-lg hover:scale-105 touch-target"
              >
                <LogIn className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}
            
            {/* Mobile User Info and Logout - Right side */}
            {currentUser && (
              <div className="relative" ref={mobileProfileDropdownRef}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleProfileDropdown}
                  className="border-white/40 text-white hover:bg-white/20 bg-white/10 touch-target flex items-center space-x-1"
                >
                  <User className="w-4 h-4" />
                <span className="text-xs font-medium hidden sm:inline">
                    {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </Button>
                
                {/* Mobile Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                          </h3>
                          <p className="text-xs text-gray-600">{currentUser.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{currentUser.email}</span>
                        </div>
                        
                        {userRole === 'government' && (
                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <Shield className="w-3 h-3 text-green-600" />
                            <span className="text-green-600 font-medium">Government Administrator</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="border-t border-gray-200 pt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoggingOut ? (
                            <>
                              <div className="w-3 h-3 mr-1 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                              {t('auth.loggingOut')}
                            </>
                          ) : (
                            <>
                              <LogOut className="w-3 h-3 mr-1" />
                              {t('auth.logout')}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {onToggleControlPanel && (
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleControlPanel}
                className="border-white/40 text-white hover:bg-white/20 bg-white/10 touch-target"
              >
                {isControlPanelOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="border-white/40 text-white hover:bg-white/20 bg-white/10 touch-target"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobile && isMobileMenuOpen && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <nav className="flex flex-col space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    onClick={() => handleTabChange(tab.id)}
                    className="w-full justify-start font-medium text-white hover:bg-transparent"
                  >
                    <span className={`${
                      activeTab === tab.id 
                        ? 'text-white border-b-2 border-white pb-0.5' 
                        : 'text-white/80'
                    }`}>{tab.label}</span>
                  </Button>
                );
              })}
              
              {/* Mobile Authentication Button */}
              <div className="pt-2 border-t border-white/20">
                {currentUser ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 bg-white/10 rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">
                            {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                          </h4>
                          <p className="text-xs text-white/80">{currentUser.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-xs text-white/80">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-3 h-3" />
                          <span>{currentUser.email}</span>
                        </div>
                        
                        {userRole === 'government' && (
                          <div className="flex items-center space-x-2">
                            <Shield className="w-3 h-3 text-green-400" />
                            <span className="text-green-400 font-medium">Government Administrator</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Mobile menu logout button clicked directly');
                        handleLogout();
                      }}
                      disabled={isLoggingOut}
                      className="w-full justify-start border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoggingOut ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                          Logging out...
                        </>
                      ) : (
                        <>
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleSignIn}
                    className="w-full justify-start border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent transition-all duration-200 hover:shadow-lg"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    {t('auth.signIn')}
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;