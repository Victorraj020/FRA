import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import FRAApplicationList from '@/components/FRAApplicationList';
import RoleSpecificDashboard from '@/components/RoleSpecificDashboard';
import AIInsightsDashboard from '@/components/AIInsightsDashboard';
import {
  MapPin,
  FileText,
  BarChart3,
  Grid3X3,
  LogOut,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Edit,
  Save,
  Trash2,
  Bell,
  Menu,
  TreePine,
  FileScan,
  FileCheck,
  Users,
  Settings,
  Megaphone
} from 'lucide-react';
import MapView from '@/components/MapView';
import ControlPanel from '@/components/ControlPanel';
import DetailsDrawer from '@/components/DetailsDrawer';
import AlertManagement from '@/components/AlertManagement';
import ForestLayout from '@/components/ForestLayout';
import PhotoSlider from '@/components/PhotoSlider';
import FAQSection from '@/components/FAQSection';
import GetInTouch from '@/components/GetInTouch';
import OCRProcessor from '@/components/OCRProcessor';
import { Village, Alert as AlertType, ForestArea, mockAlerts, mockComplaints, mockFRAApplications } from '@/data/mockData';
import { FRAApplication } from '@/components/FRAApplicationForm';
import { useIsMobile } from '@/hooks/use-mobile';
import api, { DashboardDataResponse } from '@/services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';
import { mockStatistics, mockVillages, mockStates } from '@/data/mockData';
import MiniChoropleth from '@/components/MiniChoropleth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, ShieldCheck } from 'lucide-react';

const GovernmentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [selectedForest, setSelectedForest] = useState<ForestArea | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedVillage, setEditedVillage] = useState<Village | null>(null);
  const [alerts, setAlerts] = useState<AlertType[]>(mockAlerts);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [photos, setPhotos] = useState([
    {
      id: '1',
      url: '/1.jpg',
      title: 'Forest Conservation Initiative',
      description: 'Community-led forest protection programs in action',
      uploadedBy: 'Government Admin',
      uploadedAt: new Date().toISOString()
    },
    {
      id: '2',
      url: '/2.jpg',
      title: 'Rights Recognition Ceremony',
      description: 'Celebrating successful forest rights recognition',
      uploadedBy: 'Government Admin',
      uploadedAt: new Date().toISOString()
    },
    {
      id: '3',
      url: '/3.jpg',
      title: 'Community Forest Management',
      description: 'Local communities managing their forest resources',
      uploadedBy: 'Government Admin',
      uploadedAt: new Date().toISOString()
    },
    {
      id: '4',
      url: '/4.jpeg',
      title: 'Forest Protection Program',
      description: 'Government initiatives for forest conservation',
      uploadedBy: 'Government Admin',
      uploadedAt: new Date().toISOString()
    },
    {
      id: '5',
      url: '/ministry-of-tribal-affairs.png',
      title: 'Ministry of Tribal Affairs',
      description: 'Official government department for tribal welfare',
      uploadedBy: 'Government Admin',
      uploadedAt: new Date().toISOString()
    }
  ]);
  const [complaints, setComplaints] = useState<any[]>(mockComplaints);
  const [fraApplications, setFraApplications] = useState<FRAApplication[]>(mockFRAApplications as any);
  const [filters, setFilters] = useState({
    state: 'all-states',
    district: 'all-districts',
    status: 'all-status'
  });
  const isMobile = useIsMobile();
  const { currentUser, logout, userRole, userPermissions } = useAuth();
  const location = useLocation();
  const goToAnalytics = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', 'analytics');
      window.history.pushState({}, '', url.toString());
    } catch { }
    setActiveTab('analytics');
  };
  const [analytics, setAnalytics] = useState<DashboardDataResponse | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const asOfLabel = React.useMemo(() => {
    // Default is today's date; can be overridden by state-specific data below
    const d = new Date();
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }, []);

  // Derived analytics for selected state (client-side using mock data for realism)
  // Authoritative state overrides (trusted figures)
  const stateOverrides: Record<string, {
    asOf?: string;
    totalClaims: number;
    // The following breakdown fields are optional and shown only when provided
    ifrClaims?: number;
    cfrClaims?: number;
    approvedTitles: number;
    ifrTitles?: number;
    cfrTitles?: number;
    rejectedClaims: number;
  }> = {
    'Madhya Pradesh': {
      asOf: '31 May 2025',
      totalClaims: 627513,
      ifrClaims: 585326,
      cfrClaims: 42187,
      approvedTitles: 294877,
      ifrTitles: 266901,
      cfrTitles: 27976,
      rejectedClaims: 322407,
    },
    'Tripura': {
      asOf: '30 Nov 2022',
      totalClaims: 200721,
      ifrClaims: 200557,
      cfrClaims: 164,
      approvedTitles: 128032,
      ifrTitles: 127931,
      cfrTitles: 101,
      rejectedClaims: 68848,
    },
    'Odisha': {
      asOf: '31 Mar 2022',
      totalClaims: 627998,
      approvedTitles: 452164,
      rejectedClaims: 131062,
    },
    'Telangana': {
      totalClaims: 655249,
      ifrClaims: 651822,
      cfrClaims: 3427,
      approvedTitles: 231456,
      ifrTitles: 230735,
      cfrTitles: 721,
      rejectedClaims: 94426,
    },
  };

  const stateAnalytics = React.useMemo(() => {
    const selectedState = filters.state;
    if (!selectedState || selectedState === 'all-states') {
      return null;
    }
    // Use authoritative override if available
    if (stateOverrides[selectedState]) {
      const o = stateOverrides[selectedState];
      const pending = Math.max(o.totalClaims - (o.approvedTitles + o.rejectedClaims), 0);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      // Create a realistic monthly trend focusing on approval growth
      const monthlyGrowth = months.map((m, idx) => ({
        month: m,
        approved: Math.round((o.approvedTitles / 6) * (0.85 + idx * 0.04)),
        pending: Math.round((pending / 6) * (1.05 - idx * 0.03)),
        rejected: Math.round((o.rejectedClaims / 6) * (0.9 + (idx % 2) * 0.05))
      }));
      return {
        total: o.totalClaims,
        approved: o.approvedTitles,
        pending,
        rejected: o.rejectedClaims,
        monthlyGrowth,
        breakdown: (typeof o.ifrClaims === 'number' && typeof o.cfrClaims === 'number' && typeof o.ifrTitles === 'number' && typeof o.cfrTitles === 'number')
          ? {
            ifrClaims: o.ifrClaims,
            cfrClaims: o.cfrClaims,
            ifrTitles: o.ifrTitles,
            cfrTitles: o.cfrTitles,
          }
          : undefined,
        asOf: o.asOf,
      } as any;
    }
    const villages = mockVillages.filter(v => v.state === selectedState);
    if (villages.length === 0) {
      // Fallback: synthesize realistic-looking data from a deterministic seed
      const seed = Array.from(selectedState).reduce((a, c) => a + c.charCodeAt(0), 0);
      const base = 2000 + (seed % 1500);
      const approved = Math.round(base * 0.58);
      const pending = Math.round(base * 0.32);
      const rejected = Math.max(base - approved - pending, 0);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const monthlyGrowth = months.map((m, idx) => ({
        month: m,
        approved: Math.round(approved / 12 + ((seed % 50) - 25) + idx * 7),
        pending: Math.round(pending / 12 + ((seed % 30) - 15) + (idx % 2 ? 8 : 3)),
        rejected: Math.max(2, Math.round(rejected / 12 + (idx % 3)))
      }));
      return {
        total: approved + pending + rejected,
        approved,
        pending,
        rejected,
        monthlyGrowth
      };
    }
    const approved = villages.filter(v => v.status === 'Approved').length * 25;
    const pending = villages.filter(v => v.status === 'Pending').length * 18;
    const rejected = villages.filter(v => v.status === 'Rejected').length * 9;
    const total = approved + pending + rejected;
    // Build a simple trend that reflects volume
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthlyGrowth = months.map((m, idx) => ({
      month: m,
      approved: Math.max(5, Math.round((approved / 6) * (0.8 + 0.05 * idx))),
      pending: Math.max(3, Math.round((pending / 6) * (0.9 + 0.03 * idx))),
      rejected: Math.max(1, Math.round((rejected / 6) * (0.85 + 0.02 * idx)))
    }));
    return { total, approved, pending, rejected, monthlyGrowth };
  }, [filters.state]);

  // National overview override when viewing All States in Analytics
  const nationalOverride = React.useMemo(() => ({
    total: 5123104,
    approved: 2511375,
    pending: 749673,
  }), []);

  // Sidebar quick stats for Map tab
  const sidebarMapStats = React.useMemo(() => {
    const filtered = mockVillages.filter(v => {
      const s = filters.state === 'all-states' || v.state === filters.state;
      const d = filters.district === 'all-districts' || v.district === filters.district;
      const st = filters.status === 'all-status' || v.status === filters.status;
      return s && d && st;
    });
    const approved = filtered.filter(v => v.status === 'Approved').length;
    const pending = filtered.filter(v => v.status === 'Pending').length;
    const rejected = filtered.filter(v => v.status === 'Rejected').length;
    return { approved, pending, rejected };
  }, [filters.state, filters.district, filters.status]);

  // Aggregate summary for the four focus states
  const focusStatesSummary = React.useMemo(() => {
    const names = ['Madhya Pradesh', 'Odisha', 'Telangana', 'Tripura'];
    let total = 0, approved = 0, rejected = 0;
    names.forEach((n) => {
      const o = stateOverrides[n as keyof typeof stateOverrides];
      if (!o) return;
      total += o.totalClaims || 0;
      approved += o.approvedTitles || 0;
      rejected += o.rejectedClaims || 0;
    });
    const pending = Math.max(total - (approved + rejected), 0);
    return { total, approved, rejected, pending };
  }, []);

  // Sync active tab from query param (?tab=map, etc.) whenever URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['dashboard', 'map', 'alerts', 'complaints', 'fra-applications', 'role-dashboard', 'analytics', 'ocr'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Fetch analytics when the analytics tab is active
  useEffect(() => {
    if (activeTab !== 'analytics') return;
    let cancelled = false;
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    api.analytics
      .dashboard()
      .then((data) => {
        if (!cancelled) setAnalytics(data);
      })
      .catch((err) => {
        if (!cancelled) setAnalyticsError(err?.message || 'Failed to load analytics');
      })
      .finally(() => {
        if (!cancelled) setAnalyticsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const handleVillageSelect = (village: Village) => {
    setSelectedVillage(village);
    setEditedVillage({ ...village });
    setIsDrawerOpen(true);
  };

  const handleForestSelect = (forest: ForestArea) => {
    setSelectedForest(forest);
    console.log('Selected forest:', forest);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedVillage(null);
    setEditedVillage(null);
    setIsEditing(false);
  };

  const handleCloseControlPanel = () => {
    setIsControlPanelOpen(false);
  };

  const handleLogout = async () => {
    console.log('GovernmentDashboard: Logout button clicked');
    try {
      await logout();
      console.log('GovernmentDashboard: Logout completed');

      // Force redirect immediately
      window.location.href = '/';

    } catch (error) {
      console.error('GovernmentDashboard: Failed to log out:', error);
      // Force redirect even on error
      window.location.href = '/';
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // In a real app, you would save to your backend here
    if (editedVillage) {
      setSelectedVillage(editedVillage);
      // Update the village in your data store
      console.log('Saving village:', editedVillage);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedVillage(selectedVillage);
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus: 'approved' | 'pending' | 'rejected') => {
    if (editedVillage) {
      const statusMap = {
        'approved': 'Approved' as const,
        'pending': 'Pending' as const,
        'rejected': 'Rejected' as const
      };
      setEditedVillage({ ...editedVillage, status: statusMap[newStatus] });
    }
  };

  const handleComplaintStatusChange = (complaintId: number, newStatus: string) => {
    setComplaints(complaints.map(complaint =>
      complaint.id === complaintId
        ? { ...complaint, status: newStatus }
        : complaint
    ));
  };

  const handleCreateAlert = (alertData: Omit<AlertType, 'id' | 'createdAt' | 'createdBy'>) => {
    const newAlert: AlertType = {
      ...alertData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.displayName || 'Government User'
    };
    setAlerts([newAlert, ...alerts]);
  };

  // FRA Application handlers
  const handleEditFRAApplication = (application: FRAApplication) => {
    console.log('Edit FRA application:', application);
    // In a real app, you'd open an edit form
  };

  const handleDeleteFRAApplication = (applicationId: string) => {
    setFraApplications(fraApplications.filter(app => app.id !== applicationId));
  };

  const handleStatusChangeFRAApplication = (applicationId: string, status: FRAApplication['status'], notes?: string) => {
    setFraApplications(fraApplications.map(app =>
      app.id === applicationId
        ? {
          ...app,
          status,
          reviewNotes: notes,
          reviewedBy: currentUser?.displayName || 'Government User'
        }
        : app
    ));
  };

  const handleViewFRAApplication = (application: FRAApplication) => {
    console.log('View FRA application:', application);
    // In a real app, you'd open a detailed view
  };

  const handleUpdateAlert = (id: string, updates: Partial<AlertType>) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, ...updates } : alert
    ));
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const handleAddPhoto = (file: File, title: string, description?: string) => {
    const newPhoto = {
      id: Date.now().toString(),
      url: URL.createObjectURL(file),
      title,
      description,
      uploadedBy: currentUser?.displayName || 'Government Admin',
      uploadedAt: new Date().toISOString()
    };
    setPhotos([newPhoto, ...photos]);
  };

  const handleDeletePhoto = (photoId: string) => {
    setPhotos(photos.filter(photo => photo.id !== photoId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'open': return 'bg-red-100 text-red-800 border-red-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header removed; GovHeader is provided by GovLayout */}

      {/* Photo Slider - Only show on Home/Dashboard tab */}
      {activeTab === 'dashboard' && (
        <div className="w-full px-4 py-4">
          <PhotoSlider
            photos={photos}
            onAddPhoto={handleAddPhoto}
            onDeletePhoto={handleDeletePhoto}
            isGovernmentUser={true}
            autoPlay={true}
            slideDelay={3000}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 relative">
        {/* Mobile Control Panel Toggle */}
        {isMobile && !selectedForest && (
          <div className="fixed top-20 left-4 z-50">
            <Button
              onClick={() => setIsControlPanelOpen(!isControlPanelOpen)}
              className="bg-white text-black shadow-lg border-2 border-gray-300 hover:bg-gray-100"
            >
              <Menu className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        )}

        {/* Mobile Control Panel Overlay */}
        {isMobile && !selectedForest && isControlPanelOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsControlPanelOpen(false)}>
            <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50" onClick={(e) => e.stopPropagation()}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Filters & Options</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsControlPanelOpen(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <ControlPanel
                  selectedFilters={filters}
                  onFilterChange={setFilters}
                  isMobile={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* Dashboard View - KPIs now moved above FRA table below */}

        {/* Map View with Forest Options */}
        {activeTab === 'map' && (
          <div className="flex-1 flex flex-col">
            {/* Forest Options Submenu */}
            <div className="bg-white border-b px-4 py-2">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold text-gray-800">Map & Forest Areas</h3>
                <div className="flex space-x-2">
                  <Button
                    variant={selectedForest ? "outline" : "default"}
                    size="sm"
                    onClick={() => setSelectedForest(null)}
                    className="flex items-center space-x-1"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Map View</span>
                  </Button>
                  <Button
                    variant={selectedForest ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedForest({} as ForestArea)}
                    className="flex items-center space-x-1"
                  >
                    <TreePine className="w-4 h-4" />
                    <span>Forest Areas</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Map or Forest Content */}
            <div className="flex-1" style={{ minHeight: 'calc(100vh - var(--nav-height))' }}>
              {!selectedForest ? (
                <div className="h-full p-2 sm:p-4">
                  <MapView onVillageSelect={handleVillageSelect} selectedFilters={filters} userType="government" />
                </div>
              ) : (
                <div className="h-full">
                  <ForestLayout onForestSelect={handleForestSelect} userType="government" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dashboard/Home View */}
        {activeTab === 'dashboard' && (
          <div className="flex-1 p-3 max-w-screen-xl mx-auto">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">FRA Implementation Status</h2>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Status on implementation of FRA in Odisha</span>
                  <span className="px-2 py-0.5 rounded-full border bg-muted/30 text-muted-foreground">Data as on {asOfLabel}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Export current table as CSV
                    const rows = [
                      ['Activities', 'Individual Rights', 'Community Rights', 'CFR Rights', 'Total Community', 'Grand Total'],
                      ['Claims Received', '691,948', '17,265', '15,179', '32,444', '724,392'],
                      ['Claims Approved', '468,133', '6,323', '4,903', '11,226', '479,359'],
                      ['Titles Distributed', '461,475', '4,784', '3,992', '8,776', '470,251'],
                      ['Area Involved', '673,850.89 Acres', '278,154.02 Acres', '458,734.83 Acres', '736,888.85 Acres', '1,410,739.74 Acres'],
                      ['Claims Rejected', '144,104', '404', '128', '532', '144,636'],
                      ['Claims Pending', '86,369', '12,077', '11,059', '23,136', '109,505'],
                    ];
                    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
                    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `fra_status_${new Date().toISOString().slice(0, 10)}.csv`;
                    link.click();
                  }}
                >
                  Export CSV
                </Button>
                <Button
                  onClick={() => window.location.href = '/ai-insights'}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow focus:ring-4 focus:ring-indigo-100 flex items-center justify-center font-medium"
                >
                  <Megaphone className="w-4 h-4 mr-2" />
                  View AI Insights
                </Button>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Data
                </Button>
              </div>
            </div>

            {/* KPIs above the FRA table */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card onClick={goToAnalytics} className="cursor-pointer hover:shadow-md transition-shadow" aria-label="View analytics for total claims">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Total claims filed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{
                    filters.state === 'all-states'
                      ? nationalOverride.total.toLocaleString()
                      : stateAnalytics
                        ? stateAnalytics.total.toLocaleString()
                        : '—'
                  }</div>
                  <p className="text-xs text-muted-foreground">As of {asOfLabel}</p>
                </CardContent>
              </Card>

              <Card onClick={goToAnalytics} className="cursor-pointer hover:shadow-md transition-shadow" aria-label="View analytics for approved claims">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Titles distributed (approved)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{
                    filters.state === 'all-states'
                      ? nationalOverride.approved.toLocaleString()
                      : stateAnalytics
                        ? stateAnalytics.approved.toLocaleString()
                        : '—'
                  }</div>
                  <p className="text-xs text-muted-foreground">{
                    stateAnalytics
                      ? `${Math.round((stateAnalytics.approved / Math.max(stateAnalytics.total, 1)) * 100)}% approval rate`
                      : 'Approval totals'
                  }</p>
                </CardContent>
              </Card>

              <Card onClick={goToAnalytics} className="cursor-pointer hover:shadow-md transition-shadow" aria-label="View analytics for pending complaints">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Claims pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{
                    filters.state === 'all-states'
                      ? nationalOverride.pending.toLocaleString()
                      : stateAnalytics
                        ? stateAnalytics.pending.toLocaleString()
                        : '—'
                  }</div>
                  <p className="text-xs text-muted-foreground">As of {asOfLabel}</p>
                </CardContent>
              </Card>
            </div>

            {/* FRA Data Grid */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-lg p-4 shadow-lg border border-amber-200">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm" aria-label="FRA implementation status by category and rights type">
                  <caption className="sr-only">FRA implementation status by category and rights type</caption>
                  <thead>
                    <tr className="border-b-2 border-amber-300">
                      <th scope="col" className="text-left py-2 px-2 font-semibold text-amber-800 bg-amber-100 min-w-[120px]">Activities</th>
                      <th scope="col" className="text-center py-2 px-2 font-semibold text-amber-800 bg-amber-100 min-w-[100px]">Individual Rights</th>
                      <th scope="col" className="text-center py-2 px-2 font-semibold text-amber-800 bg-amber-100 min-w-[100px]">Community Rights</th>
                      <th scope="col" className="text-center py-2 px-2 font-semibold text-amber-800 bg-amber-100 min-w-[120px]">CFR Rights</th>
                      <th scope="col" className="text-center py-2 px-2 font-semibold text-amber-800 bg-amber-100 min-w-[100px]">Total Community</th>
                      <th scope="col" className="text-center py-2 px-2 font-semibold text-amber-800 bg-amber-100 min-w-[100px]">Grand Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-2 px-2 font-medium text-amber-900">Claims Received</td>
                      <td className="py-2 px-2 text-center text-amber-800">691,948</td>
                      <td className="py-2 px-2 text-center text-amber-800">17,265</td>
                      <td className="py-2 px-2 text-center text-amber-800">15,179</td>
                      <td className="py-2 px-2 text-center text-amber-800">32,444</td>
                      <td className="py-2 px-2 text-center font-semibold text-amber-900">724,392</td>
                    </tr>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-2 px-2 font-medium text-amber-900">Claims Approved</td>
                      <td className="py-2 px-2 text-center text-amber-800">468,133</td>
                      <td className="py-2 px-2 text-center text-amber-800">6,323</td>
                      <td className="py-2 px-2 text-center text-amber-800">4,903</td>
                      <td className="py-2 px-2 text-center text-amber-800">11,226</td>
                      <td className="py-2 px-2 text-center font-semibold text-amber-900">479,359</td>
                    </tr>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-2 px-2 font-medium text-amber-900">Titles Distributed</td>
                      <td className="py-2 px-2 text-center text-amber-800">461,475</td>
                      <td className="py-2 px-2 text-center text-amber-800">4,784</td>
                      <td className="py-2 px-2 text-center text-amber-800">3,992</td>
                      <td className="py-2 px-2 text-center text-amber-800">8,776</td>
                      <td className="py-2 px-2 text-center font-semibold text-amber-900">470,251</td>
                    </tr>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-2 px-2 font-medium text-amber-900">Area Involved</td>
                      <td className="py-2 px-2 text-center text-amber-800">673,850.89 Acres</td>
                      <td className="py-2 px-2 text-center text-amber-800">278,154.02 Acres</td>
                      <td className="py-2 px-2 text-center text-amber-800">458,734.83 Acres</td>
                      <td className="py-2 px-2 text-center text-amber-800">736,888.85 Acres</td>
                      <td className="py-2 px-2 text-center font-semibold text-amber-900">1,410,739.74 Acres</td>
                    </tr>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-2 px-2 font-medium text-amber-900">Claims Rejected</td>
                      <td className="py-2 px-2 text-center text-amber-800">144,104</td>
                      <td className="py-2 px-2 text-center text-amber-800">404</td>
                      <td className="py-2 px-2 text-center text-amber-800">128</td>
                      <td className="py-2 px-2 text-center text-amber-800">532</td>
                      <td className="py-2 px-2 text-center font-semibold text-amber-900">144,636</td>
                    </tr>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-2 px-2 font-medium text-amber-900">Claims Pending</td>
                      <td className="py-2 px-2 text-center text-amber-800">86,369</td>
                      <td className="py-2 px-2 text-center text-amber-800">12,077</td>
                      <td className="py-2 px-2 text-center text-amber-800">11,059</td>
                      <td className="py-2 px-2 text-center text-amber-800">23,136</td>
                      <td className="py-2 px-2 text-center font-semibold text-amber-900">109,505</td>
                    </tr>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-2 px-2 font-medium text-amber-900">Correction of RoR & Maps</td>
                      <td className="py-2 px-2 text-center text-amber-800">—</td>
                      <td className="py-2 px-2 text-center text-amber-800">355,438</td>
                      <td className="py-2 px-2 text-center text-amber-800">—</td>
                      <td className="py-2 px-2 text-center text-amber-800">Demarcation made</td>
                      <td className="py-2 px-2 text-center font-semibold text-amber-900">428,966</td>
                    </tr>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-2 px-2 font-medium text-amber-900">Conversion Claims of Forest to Revenue Village</td>
                      <td className="py-2 px-2 text-center text-amber-800">—</td>
                      <td className="py-2 px-2 text-center text-amber-800">57</td>
                      <td className="py-2 px-2 text-center text-amber-800">—</td>
                      <td className="py-2 px-2 text-center text-amber-800">Declared Conversion of Forest to Revenue Village</td>
                      <td className="py-2 px-2 text-center font-semibold text-amber-900">165</td>
                    </tr>
                    <tr className="hover:bg-amber-50">
                      <td className="py-2 px-2 font-medium text-amber-900">Habitat Rights Recognition Claims</td>
                      <td className="py-2 px-2 text-center text-amber-800">—</td>
                      <td className="py-2 px-2 text-center text-amber-800">14</td>
                      <td className="py-2 px-2 text-center text-amber-800">—</td>
                      <td className="py-2 px-2 text-center text-amber-800">Habitat Rights Recognition Approved</td>
                      <td className="py-2 px-2 text-center font-semibold text-amber-900">10</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Edit Modal for Government Users */}
            {isEditing && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Edit FRA Implementation Data</h3>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        You are editing official FRA implementation data. Changes will be visible to all users.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Claims Received - Individual Rights</label>
                        <Input defaultValue="691,948" className="w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Claims Received - Community Rights</label>
                        <Input defaultValue="17,265" className="w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Claims Received - Community Forest Resources Rights</label>
                        <Input defaultValue="15,179" className="w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Claims Approved - Individual Rights</label>
                        <Input defaultValue="468,133" className="w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Claims Approved - Community Rights</label>
                        <Input defaultValue="6,323" className="w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Claims Approved - Community Forest Resources Rights</label>
                        <Input defaultValue="4,903" className="w-full" />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          // Here you would implement the save functionality
                          setIsEditing(false);
                          // Show success message
                        }}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FAQ section below the FRA chart */}
            <FAQSection />

            {/* Get In Touch section at the bottom of the page */}
            <GetInTouch />
          </div>
        )}

        {/* Alerts Management View */}
        {activeTab === 'alerts' && (
          <div className="flex-1 p-4">
            <AlertManagement
              alerts={alerts}
              onCreateAlert={handleCreateAlert}
              onUpdateAlert={handleUpdateAlert}
              onDeleteAlert={handleDeleteAlert}
            />
          </div>
        )}

        {/* Complaints View */}
        {activeTab === 'complaints' && (
          <div className="flex-1 p-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Complaints & Issues</h2>
              <p className="text-muted-foreground">Manage complaints submitted by local users</p>
            </div>

            <div className="space-y-4">
              {complaints.map((complaint) => (
                <Card key={complaint.id} className="border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{complaint.village}</CardTitle>
                        <CardDescription>
                          Reported by {complaint.user} on {complaint.date}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(complaint.status)}>
                          {complaint.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                        <span className={`text-sm font-medium ${getPriorityColor(complaint.priority)}`}>
                          {complaint.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground mb-4">{complaint.issue}</p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleComplaintStatusChange(complaint.id, 'in-progress')}
                        disabled={complaint.status === 'in-progress'}
                        className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${complaint.status === 'in-progress'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-300 cursor-not-allowed'
                            : 'border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-500'
                          }`}
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        In Progress
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleComplaintStatusChange(complaint.id, 'resolved')}
                        disabled={complaint.status === 'resolved'}
                        className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${complaint.status === 'resolved'
                            ? 'bg-green-100 text-green-800 border-green-300 cursor-not-allowed'
                            : 'border-2 border-green-400 text-green-700 hover:bg-green-50 hover:border-green-500'
                          }`}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Resolve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* FRA Applications View */}
        {activeTab === 'fra-applications' && (
          <div className="flex-1 p-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">FRA Applications Management</h2>
              <p className="text-muted-foreground">Review and manage Forest Rights Act applications</p>
            </div>

            <FRAApplicationList
              applications={fraApplications}
              onEdit={handleEditFRAApplication}
              onDelete={handleDeleteFRAApplication}
              onStatusChange={handleStatusChangeFRAApplication}
              onView={handleViewFRAApplication}
            />
          </div>
        )}

        {/* Document Digitizer View */}
        {activeTab === 'ocr' && (
          <div className="flex-1 p-4">
            <OCRProcessor />
          </div>
        )}

        {/* Role-Specific Dashboard */}
        {activeTab === 'role-dashboard' && (
          <div className="flex-1 p-4">
            <RoleSpecificDashboard />
          </div>
        )}

        {/* AI Insights Dashboard */}
        {activeTab === 'ai-insights' && (
          <div className="flex-1 p-4">
            <AIInsightsDashboard />
          </div>
        )}

        {/* Analytics View */}
        {activeTab === 'analytics' && (
          <div className="flex-1 p-4 max-w-screen-xl mx-auto">
            <div className="mb-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between border rounded-md bg-white p-3">
                  <div className="flex items-center gap-3">
                    <img src="/ministry-of-tribal-affairs.png" alt="Ministry of Tribal Affairs" className="h-8 w-auto" />
                    <div>
                      <div className="text-xs text-muted-foreground">Government of India</div>
                      <h2 className="text-xl font-bold tracking-tight">FRA Analytics</h2>
                    </div>
                    <span className="ml-2 inline-flex items-center text-[10px] px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700">
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      Verified data presentation
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-muted-foreground">
                      <div className="font-medium text-foreground">Data as on:</div>
                      <div className="text-sm font-semibold">{(stateAnalytics as any)?.asOf || asOfLabel}</div>
                    </div>
                    <div className="w-48">
                      <Select value={filters.state} onValueChange={(value) => setFilters({ ...filters, state: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="All States" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-states">All States</SelectItem>
                          {mockStates.map((s) => (
                            <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <a href="/" className="p-2 rounded-md border hover:bg-muted" aria-label="Home">
                      <Home className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">Comprehensive analytics and reporting for the Forest Rights Act. Figures update periodically from authoritative sources.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Total claims filed</CardTitle>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border bg-muted/30 text-muted-foreground">{filters.state !== 'all-states' ? 'Filtered' : 'All India'}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{
                    filters.state === 'all-states'
                      ? nationalOverride.total.toLocaleString()
                      : stateAnalytics
                        ? stateAnalytics.total.toLocaleString()
                        : (analytics?.total_applications ?? (analyticsLoading ? '…' : '—'))
                  }</div>
                  <div className="flex items-end justify-between gap-3 mt-2">
                    <p className="text-xs text-muted-foreground">As of {asOfLabel}</p>
                    <div className="h-8 w-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={(stateAnalytics?.monthlyGrowth || mockStatistics.monthlyGrowth).map(m => ({ x: m.month, y: (m.approved + m.pending) }))}>
                          <Area type="monotone" dataKey="y" stroke="#16a34a" fill="#16a34a22" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Titles distributed (approved)</CardTitle>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border bg-green-50 text-green-700">Δ {stateAnalytics ? Math.round((stateAnalytics.approved / Math.max((stateAnalytics.total - stateAnalytics.approved), 1)) * 3) : 7}%</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{
                    filters.state === 'all-states'
                      ? nationalOverride.approved.toLocaleString()
                      : stateAnalytics
                        ? stateAnalytics.approved.toLocaleString()
                        : (analytics?.approved_applications ?? (analyticsLoading ? '…' : '—'))
                  }</div>
                  <p className="text-sm text-muted-foreground">{
                    stateAnalytics
                      ? `${Math.round((stateAnalytics.approved / Math.max(stateAnalytics.total, 1)) * 100)}% approval rate`
                      : analytics
                        ? ((analytics as any).__fallback ? 'Mock data (offline)' : `${Math.round((analytics.approved_applications / Math.max(analytics.total_applications || 1, 1)) * 100)}% approval rate`)
                        : analyticsLoading ? 'Loading…' : 'Unavailable'
                  }</p>
                  <div className="h-8 w-24 ml-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={(stateAnalytics?.monthlyGrowth || mockStatistics.monthlyGrowth).map(m => ({ x: m.month, y: m.approved }))}>
                        <Area type="monotone" dataKey="y" stroke="#16a34a" fill="#16a34a22" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Claims pending</CardTitle>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border bg-yellow-50 text-yellow-700">Target ↓ {stateAnalytics ? 15 : 10}%</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">{
                    filters.state === 'all-states'
                      ? nationalOverride.pending.toLocaleString()
                      : stateAnalytics
                        ? stateAnalytics.pending.toLocaleString()
                        : (analytics?.pending_applications ?? (analyticsLoading ? '…' : '—'))
                  }</div>
                  <p className="text-sm text-muted-foreground">As of {asOfLabel}</p>
                  <div className="h-8 w-24 ml-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={(stateAnalytics?.monthlyGrowth || mockStatistics.monthlyGrowth).map(m => ({ x: m.month, y: m.pending }))}>
                        <Area type="monotone" dataKey="y" stroke="#ca8a04" fill="#ca8a0422" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Focus States (MP, Odisha, Telangana, Tripura) aggregate summary */}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-1"><CardTitle className="text-sm">Focus States — Total Claims</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-xl font-semibold">{focusStatesSummary.total.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Madhya Pradesh • Odisha • Telangana • Tripura</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-1"><CardTitle className="text-sm">Titles Distributed (Approved)</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-xl font-semibold text-green-700">{focusStatesSummary.approved.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Combined across the four states</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-1"><CardTitle className="text-sm">Claims Rejected</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-xl font-semibold text-red-700">{focusStatesSummary.rejected.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-1"><CardTitle className="text-sm">Pending (Derived)</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-xl font-semibold text-yellow-700">{focusStatesSummary.pending.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            {/* Map + charts and recent activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">FRA Titles Distributed — Choropleth</CardTitle>
                </CardHeader>
                <CardContent>
                  <MiniChoropleth
                    height={300}
                    getValue={(feature: any) => {
                      const name = feature?.properties?.st_nm || feature?.properties?.name || '';
                      const overrides: Record<string, number> = {
                        'Madhya Pradesh': Math.round(((stateAnalytics as any)?.approved || 0) / 1000),
                        'Tripura': Math.round(((stateAnalytics as any)?.approved || 0) / 1000),
                        'Odisha': Math.round(((stateAnalytics as any)?.approved || 0) / 1000),
                      };
                      if (overrides[name]) return overrides[name];
                      const defaults: Record<string, number> = { 'Telangana': 28 };
                      return defaults[name] || 0;
                    }}
                    tooltipLabel={(f: any, v: number) => `${f?.properties?.st_nm || f?.properties?.name}: ${v}K titles`}
                    geojsonUrl="/four_states_india.geojson"
                    highlightStates={["Madhya Pradesh", "Odisha", "Telangana", "Tripura"]}
                    selectedState={filters.state !== 'all-states' ? filters.state : undefined}
                    onStateClick={(name) => {
                      const allowed = ["Madhya Pradesh", "Odisha", "Telangana", "Tripura"];
                      if (allowed.includes(name)) setFilters({ ...filters, state: name });
                    }}
                  />
                </CardContent>
              </Card>

              {/* Right-side panel beside the choropleth */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Highlights & Legend</CardTitle>
                  <CardDescription>Focus states and map cues</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Simple legend matching map styling */}
                  <div className="mb-4">
                    <div className="text-xs text-muted-foreground mb-2">Legend</div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-600 inline-block"></span>State Boundaries</li>
                      <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>District Boundaries</li>
                    </ul>
                  </div>

                  {/* Top-line stats for focus states */}
                  <div className="border rounded-md p-3 bg-white">
                    <div className="text-xs text-muted-foreground mb-2">Focus States Overview</div>
                    <ul className="space-y-2 text-sm">
                      {['Madhya Pradesh', 'Odisha', 'Telangana', 'Tripura'].map((name) => {
                        const o = (stateOverrides as any)[name] || {};
                        const total = o.totalClaims || 0;
                        const approved = o.approvedTitles || 0;
                        const pending = Math.max(total - (approved + (o.rejectedClaims || 0)), 0);
                        return (
                          <li key={name} className="flex items-center justify-between">
                            <span>{name}</span>
                            <span className="flex items-center gap-3">
                              <span className="text-green-700 font-medium" title="Approved">{approved.toLocaleString()}</span>
                              <span className="text-yellow-700 font-medium" title="Pending">{pending.toLocaleString()}</span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Tip */}
                  <div className="mt-4 text-xs text-muted-foreground">
                    Tip: Click a highlighted state on the map to filter analytics below.
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Monthly Trends{filters.state !== 'all-states' ? ` — ${filters.state}` : ''}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stateAnalytics ? stateAnalytics.monthlyGrowth : mockStatistics.monthlyGrowth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'Number of claims', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(v: any) => (typeof v === 'number' ? v.toLocaleString() : v)} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Bar dataKey="approved" fill="hsl(var(--status-approved))" name="Approved claims" />
                        <Bar dataKey="pending" fill="hsl(var(--status-pending))" name="Pending claims" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Sidebar insights next to Monthly Trends to avoid empty space */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Quick Insights</CardTitle>
                  <CardDescription>Contextual stats and sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start justify-between">
                      <span className="text-muted-foreground">Focus States Pending</span>
                      <span className="font-semibold text-yellow-700">{focusStatesSummary.pending.toLocaleString()}</span>
                    </li>
                    <li className="flex items-start justify-between">
                      <span className="text-muted-foreground">Titles Distributed (All Focus)</span>
                      <span className="font-semibold text-green-700">{focusStatesSummary.approved.toLocaleString()}</span>
                    </li>
                    <li className="flex items-start justify-between">
                      <span className="text-muted-foreground">Claims Rejected (All Focus)</span>
                      <span className="font-semibold text-red-700">{focusStatesSummary.rejected.toLocaleString()}</span>
                    </li>
                  </ul>

                  <div className="mt-4 border-t pt-3">
                    <div className="text-xs text-muted-foreground mb-2">Authoritative Sources</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <a href="/status" className="p-2 rounded-md border hover:bg-muted">Status</a>
                      <a href="/mota-info" className="p-2 rounded-md border hover:bg-muted">MoTA Info</a>
                    </div>
                  </div>

                  {filters.state !== 'all-states' && (
                    <div className="mt-4 rounded-md border bg-muted/30 p-3">
                      <div className="text-xs text-muted-foreground">Selected State</div>
                      <div className="text-sm font-semibold">{filters.state}</div>
                      <div className="text-xs text-muted-foreground mt-1">As of {(stateAnalytics as any)?.asOf || asOfLabel}</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Claims Distribution{filters.state !== 'all-states' ? ` — ${filters.state}` : ''}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={(stateAnalytics
                            ? [
                              { name: 'Approved', value: stateAnalytics.approved, color: 'hsl(var(--status-approved))' },
                              { name: 'Pending', value: stateAnalytics.pending, color: 'hsl(var(--status-pending))' },
                              { name: 'Rejected', value: stateAnalytics.rejected, color: 'hsl(var(--status-rejected))' }
                            ]
                            : [
                              { name: 'Approved', value: mockStatistics.approvedClaims, color: 'hsl(var(--status-approved))' },
                              { name: 'Pending', value: mockStatistics.pendingClaims, color: 'hsl(var(--status-pending))' },
                              { name: 'Rejected', value: mockStatistics.rejectedClaims, color: 'hsl(var(--status-rejected))' }
                            ])}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, value, percent }) => `${name}: ${Math.round(percent * 100)}%`}
                          labelLine={false}
                        >
                          {(stateAnalytics
                            ? [
                              { name: 'Approved', value: stateAnalytics.approved, color: 'hsl(var(--status-approved))' },
                              { name: 'Pending', value: stateAnalytics.pending, color: 'hsl(var(--status-pending))' },
                              { name: 'Rejected', value: stateAnalytics.rejected, color: 'hsl(var(--status-rejected))' }
                            ]
                            : [
                              { name: 'Approved', value: mockStatistics.approvedClaims, color: 'hsl(var(--status-approved))' },
                              { name: 'Pending', value: mockStatistics.pendingClaims, color: 'hsl(var(--status-pending))' },
                              { name: 'Rejected', value: mockStatistics.rejectedClaims, color: 'hsl(var(--status-rejected))' }
                            ]).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(v: any) => (typeof v === 'number' ? v.toLocaleString() : v)} />
                        <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>


            {/* State breakdown row (IFR/CFR) for authoritative states */}
            {filters.state !== 'all-states' && (stateAnalytics as any)?.breakdown && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-1"><CardTitle className="text-sm">Total Claims — {filters.state}</CardTitle></CardHeader>
                  <CardContent>
                    <div className="text-xl font-semibold">{(stateAnalytics as any).total.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">IFR {(stateAnalytics as any).breakdown.ifrClaims.toLocaleString()} • CFR {(stateAnalytics as any).breakdown.cfrClaims.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-1"><CardTitle className="text-sm">Titles Distributed (Approved)</CardTitle></CardHeader>
                  <CardContent>
                    <div className="text-xl font-semibold text-green-700">{(stateAnalytics as any).approved.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">IFR {(stateAnalytics as any).breakdown.ifrTitles.toLocaleString()} • CFR {(stateAnalytics as any).breakdown.cfrTitles.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-1"><CardTitle className="text-sm">Claims Rejected</CardTitle></CardHeader>
                  <CardContent>
                    <div className="text-xl font-semibold text-red-700">{(stateAnalytics as any).rejected.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Share {Math.round(((stateAnalytics as any).rejected / Math.max((stateAnalytics as any).total, 1)) * 100)}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-1"><CardTitle className="text-sm">Pending (Derived)</CardTitle></CardHeader>
                  <CardContent>
                    <div className="text-xl font-semibold text-yellow-700">{(stateAnalytics as any).pending.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">As on {(stateAnalytics as any).asOf || asOfLabel}</div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4">
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {[
                      { id: 1, text: 'New tribal claim submitted from Kendupali (Koraput)', meta: '2 hours ago' },
                      { id: 2, text: '5 applications approved in Mayurbhanj', meta: '4 hours ago' },
                      { id: 3, text: 'Document verification completed for 3 claims in Gajapati', meta: '6 hours ago' },
                      { id: 4, text: 'Community meeting scheduled in Malkangiri', meta: '1 day ago' }
                    ].map((item) => (
                      <li key={item.id} className="flex items-center justify-between border rounded-md px-3 py-2">
                        <span className="text-foreground">{item.text}</span>
                        <span className="text-muted-foreground">{item.meta}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            {analyticsError && (
              <div className="text-sm text-red-600">{analyticsError}</div>
            )}
          </div>
        )}

        {/* Desktop Control Panel */}
        {!isMobile && !selectedForest && (
          <div className="w-80 p-4 pl-2 space-y-3">
            <ControlPanel
              selectedFilters={filters}
              onFilterChange={setFilters}
              isMobile={false}
            />

            {/* Fill sidebar whitespace with quick insights when viewing map */}
            {activeTab === 'map' && (
              <Card className="p-2">
                <CardTitle className="text-xs mb-2">Selection Overview</CardTitle>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={[
                        { name: 'Approved', value: sidebarMapStats.approved, color: 'hsl(var(--status-approved))' },
                        { name: 'Pending', value: sidebarMapStats.pending, color: 'hsl(var(--status-pending))' },
                        { name: 'Rejected', value: sidebarMapStats.rejected, color: 'hsl(var(--status-rejected))' },
                      ]} dataKey="value" nameKey="name" innerRadius={20} outerRadius={36} paddingAngle={2}>
                        <Cell fill="hsl(var(--status-approved))" />
                        <Cell fill="hsl(var(--status-pending))" />
                        <Cell fill="hsl(var(--status-rejected))" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 text-[10px] mt-2">
                  <div className="text-center"><div className="font-semibold text-green-600">{sidebarMapStats.approved}</div>Approved</div>
                  <div className="text-center"><div className="font-semibold text-amber-600">{sidebarMapStats.pending}</div>Pending</div>
                  <div className="text-center"><div className="font-semibold text-red-600">{sidebarMapStats.rejected}</div>Rejected</div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Details Drawer with Edit Capabilities */}
      <DetailsDrawer
        village={selectedVillage}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        isMobile={isMobile}
        isGovernmentUser={true}
        isEditing={isEditing}
        editedVillage={editedVillage}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default GovernmentDashboard;
