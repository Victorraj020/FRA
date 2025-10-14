import React, { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/ContactSection';
import FRAApplicationForm from '@/components/FRAApplicationForm';
import FRAApplicationList from '@/components/FRAApplicationList';
import RoleSpecificDashboard from '@/components/RoleSpecificDashboard';
import { 
  MapPin, 
  FileText, 
  BarChart3, 
  LogOut, 
  User, 
  Users,
  Grid3X3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  Bell,
  Menu,
  X,
  TreePine,
  FileCheck,
  Edit
} from 'lucide-react';
import MapView from '@/components/MapView';
import ControlPanel from '@/components/ControlPanel';
import DetailsDrawer from '@/components/DetailsDrawer';
import AlertViewer from '@/components/AlertViewer';
import ForestLayout from '@/components/ForestLayout';
import PhotoSlider from '@/components/PhotoSlider';
import { Village, Alert as AlertType, ForestArea, mockAlerts } from '@/data/mockData';
import { FRAApplication } from '@/components/FRAApplicationForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import Groundwater3D from '@/components/Groundwater3D';

const LocalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [selectedForest, setSelectedForest] = useState<ForestArea | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [showFRAForm, setShowFRAForm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [alerts] = useState<AlertType[]>(mockAlerts);
  const [fraApplications, setFraApplications] = useState<FRAApplication[]>([
    {
      id: 'FRA-001',
      applicantName: 'Rajesh Kumar',
      village: 'Kendupali',
      district: 'Koraput',
      state: 'Odisha',
      landArea: '2.5 acres',
      landType: 'individual',
      claimType: 'individual_forest_rights',
      description: 'Traditional forest rights claim for agricultural land used by family for generations.',
      supportingDocuments: [],
      status: 'submitted',
      priority: 'medium',
      submittedAt: new Date('2024-01-10')
    },
    {
      id: 'FRA-002',
      applicantName: 'Community of Bhayender',
      village: 'Bhayender',
      district: 'Nalaspora',
      state: 'Madhya Pradesh',
      landArea: '15.0 acres',
      landType: 'community',
      claimType: 'community_forest_rights',
      description: 'Community forest rights for traditional forest management and conservation.',
      supportingDocuments: [],
      status: 'under_review',
      priority: 'high',
      submittedAt: new Date('2024-01-15'),
      reviewedBy: 'Forest Revenue Officer'
    }
  ]);
  const [photos] = useState([
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
  const [complaintForm, setComplaintForm] = useState({
    village: '',
    issue: '',
    description: '',
    priority: 'medium'
  });
  const [myComplaints, setMyComplaints] = useState([
    {
      id: 1,
      village: 'Kendupali',
      issue: 'Claim status shows as pending but should be approved',
      status: 'open',
      date: '2024-01-15',
      priority: 'high',
      response: ''
    },
    {
      id: 2,
      village: 'Village ABC',
      issue: 'Incorrect land area calculation',
      status: 'in-progress',
      date: '2024-01-14',
      priority: 'medium',
      response: 'We are reviewing your complaint and will update you soon.'
    }
  ]);
  const [filters, setFilters] = useState({
    state: 'all-states',
    district: 'all-districts',
    status: 'all-status'
  });
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const longPressTimer = useRef<number | null>(null);
  const GOV_PASSCODE = (import.meta as any)?.env?.VITE_GOV_PASSCODE || 'Hackathon';
  const { currentUser, logout, userPermissions } = useAuth();
  // Added: limitedMode for anonymous users
  const limitedMode = !currentUser;

  // Sync active tab from query param (?tab=map, etc.)
  const location = useLocation();
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['dashboard','map','alerts','complaints','fra-applications','role-dashboard','analytics'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const handleVillageSelect = (village: Village) => {
    setSelectedVillage(village);
    setIsDrawerOpen(true);
  };

  const handleForestSelect = (forest: ForestArea) => {
    setSelectedForest(forest);
    console.log('Selected forest:', forest);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedVillage(null);
  };

  const handleCloseControlPanel = () => {
    setIsControlPanelOpen(false);
  };

  const handleLogout = async () => {
    console.log('LocalDashboard: Logout button clicked');
    try {
      console.log('LocalDashboard: Starting logout process...');
      await logout();
      console.log('LocalDashboard: Logout completed');
      
      // Force redirect immediately
      window.location.href = '/';
      
    } catch (error) {
      console.error('LocalDashboard: Failed to log out:', error);
      window.location.href = '/';
    }
  };

  const handleSubmitComplaint = () => {
    if (complaintForm.village && complaintForm.issue && complaintForm.description) {
      const newComplaint = {
        id: Date.now(),
        village: complaintForm.village,
        issue: complaintForm.issue,
        status: 'open',
        date: new Date().toISOString().split('T')[0],
        priority: complaintForm.priority,
        response: ''
      };
      setMyComplaints([newComplaint, ...myComplaints]);
      setComplaintForm({ village: '', issue: '', description: '', priority: 'medium' });
      setShowComplaintForm(false);
    }
  };

  // FRA Application handlers
  const handleSubmitFRAApplication = (application: FRAApplication) => {
    setFraApplications([application, ...fraApplications]);
    setShowFRAForm(false);
  };

  const handleEditFRAApplication = (application: FRAApplication) => {
    // For now, just close the form - in a real app, you'd open an edit form
    console.log('Edit FRA application:', application);
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
            reviewedBy: currentUser?.displayName || 'System'
          }
        : app
    ));
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
    <div className="min-h-screen bg-background flex flex-col" id="top">
      {/* Header removed; GovHeader is provided by GovLayout */}

      {/* Photo Slider - Only show on Home/Dashboard tab */}
      {activeTab === 'dashboard' && (
        <div className="w-full px-4 py-4">
          <PhotoSlider
            photos={photos}
            isGovernmentUser={false}
            autoPlay={true}
            slideDelay={3000}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 relative">
        {/* Mobile Control Panel Toggle */}
        {isMobile && !selectedForest && (
          <div className="fixed right-4 bottom-24 z-50">
            <Button
              onClick={() => setIsControlPanelOpen(!isControlPanelOpen)}
              className="bg-white text-black shadow-lg border-2 border-white hover:bg-gray-100 transition-all duration-200 rounded-full px-4 py-2"
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
                  <MapView onVillageSelect={handleVillageSelect} selectedFilters={filters} userType="local" limitedMode={limitedMode} />
                  {/* 3D Groundwater visualization directly under the map */}
                  <div className="mt-4">
                    <Groundwater3D state={filters.state === 'all-states' ? 'All' : (filters.state as string)} />
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  <ForestLayout onForestSelect={handleForestSelect} userType="local" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dashboard/Home View */}
        {activeTab === 'dashboard' && (
          <div className="flex-1 p-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">FRA Implementation Status</h2>
              <p className="text-muted-foreground">Status on implementation of FRA in Odisha as on 31-12-2024</p>
            </div>
            
            {/* FRA Data Grid */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-lg p-6 shadow-lg border border-amber-200">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-amber-300">
                      <th className="text-left py-3 px-4 font-semibold text-amber-800 bg-amber-100">Activities</th>
                      <th className="text-center py-3 px-4 font-semibold text-amber-800 bg-amber-100">Individual Rights</th>
                      <th className="text-center py-3 px-4 font-semibold text-amber-800 bg-amber-100">Community Rights</th>
                      <th className="text-center py-3 px-4 font-semibold text-amber-800 bg-amber-100">Community Forest Resources Rights</th>
                      <th className="text-center py-3 px-4 font-semibold text-amber-800 bg-amber-100">Total of Community</th>
                      <th className="text-center py-3 px-4 font-semibold text-amber-800 bg-amber-100">Grand Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-3 px-4 font-medium text-amber-900">Claims Received</td>
                      <td className="py-3 px-4 text-center text-amber-800">691,948</td>
                      <td className="py-3 px-4 text-center text-amber-800">17,265</td>
                      <td className="py-3 px-4 text-center text-amber-800">15,179</td>
                      <td className="py-3 px-4 text-center text-amber-800">32,444</td>
                      <td className="py-3 px-4 text-center font-semibold text-amber-900">724,392</td>
                    </tr>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-3 px-4 font-medium text-amber-900">Claims Approved</td>
                      <td className="py-3 px-4 text-center text-amber-800">468,133</td>
                      <td className="py-3 px-4 text-center text-amber-800">6,323</td>
                      <td className="py-3 px-4 text-center text-amber-800">4,903</td>
                      <td className="py-3 px-4 text-center text-amber-800">11,226</td>
                      <td className="py-3 px-4 text-center font-semibold text-amber-900">479,359</td>
                    </tr>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-3 px-4 font-medium text-amber-900">Titles Distributed</td>
                      <td className="py-3 px-4 text-center text-amber-800">461,475</td>
                      <td className="py-3 px-4 text-center text-amber-800">4,784</td>
                      <td className="py-3 px-4 text-center text-amber-800">3,992</td>
                      <td className="py-3 px-4 text-center text-amber-800">8,776</td>
                      <td className="py-3 px-4 text-center font-semibold text-amber-900">470,251</td>
                    </tr>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-3 px-4 font-medium text-amber-900">Area Involved</td>
                      <td className="py-3 px-4 text-center text-amber-800">673,850.89 Acres</td>
                      <td className="py-3 px-4 text-center text-amber-800">278,154.02 Acres</td>
                      <td className="py-3 px-4 text-center text-amber-800">458,734.83 Acres</td>
                      <td className="py-3 px-4 text-center text-amber-800">736,888.85 Acres</td>
                      <td className="py-3 px-4 text-center font-semibold text-amber-900">1,410,739.74 Acres</td>
                    </tr>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-3 px-4 font-medium text-amber-900">Claims Rejected</td>
                      <td className="py-3 px-4 text-center text-amber-800">144,104</td>
                      <td className="py-3 px-4 text-center text-amber-800">404</td>
                      <td className="py-3 px-4 text-center text-amber-800">128</td>
                      <td className="py-3 px-4 text-center text-amber-800">532</td>
                      <td className="py-3 px-4 text-center font-semibold text-amber-900">144,636</td>
                    </tr>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-3 px-4 font-medium text-amber-900">Claims Pending</td>
                      <td className="py-3 px-4 text-center text-amber-800">86,369</td>
                      <td className="py-3 px-4 text-center text-amber-800">12,077</td>
                      <td className="py-3 px-4 text-center text-amber-800">11,059</td>
                      <td className="py-3 px-4 text-center text-amber-800">23,136</td>
                      <td className="py-3 px-4 text-center font-semibold text-amber-900">109,505</td>
                    </tr>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-3 px-4 font-medium text-amber-900">Correction of RoR & Maps</td>
                      <td className="py-3 px-4 text-center text-amber-800">—</td>
                      <td className="py-3 px-4 text-center text-amber-800">355,438</td>
                      <td className="py-3 px-4 text-center text-amber-800">—</td>
                      <td className="py-3 px-4 text-center text-amber-800">Demarcation made</td>
                      <td className="py-3 px-4 text-center font-semibold text-amber-900">428,966</td>
                    </tr>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-3 px-4 font-medium text-amber-900">Conversion Claims of Forest to Revenue Village</td>
                      <td className="py-3 px-4 text-center text-amber-800">—</td>
                      <td className="py-3 px-4 text-center text-amber-800">57</td>
                      <td className="py-3 px-4 text-center text-amber-800">—</td>
                      <td className="py-3 px-4 text-center text-amber-800">Declared Conversion of Forest to Revenue Village</td>
                      <td className="py-3 px-4 text-center font-semibold text-amber-900">165</td>
                    </tr>
                    <tr className="hover:bg-amber-50">
                      <td className="py-3 px-4 font-medium text-amber-900">Habitat Rights Recognition Claims</td>
                      <td className="py-3 px-4 text-center text-amber-800">—</td>
                      <td className="py-3 px-4 text-center text-amber-800">14</td>
                      <td className="py-3 px-4 text-center text-amber-800">—</td>
                      <td className="py-3 px-4 text-center text-amber-800">Habitat Rights Recognition Approved</td>
                      <td className="py-3 px-4 text-center font-semibold text-amber-900">10</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Alerts View */}
        {activeTab === 'alerts' && (
          <div className="flex-1 p-4">
            <AlertViewer alerts={alerts} />
          </div>
        )}

        {/* Complaints View */}
        {activeTab === 'complaints' && (
          <div className="flex-1 p-4">
            <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">My Complaints</h2>
                <p className="text-muted-foreground">Track your submitted complaints and issues</p>
              </div>
              <Button 
                onClick={() => setShowComplaintForm(true)}
                className="btn-primary w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit New Complaint
              </Button>
            </div>
            
            {/* Complaint Form Modal */}
            {showComplaintForm && (
              <Card className="mb-6 border-2">
                <CardHeader>
                  <CardTitle>Submit New Complaint</CardTitle>
                  <CardDescription>
                    Report an issue or discrepancy with forest rights claims
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Village Name</label>
                    <input
                      type="text"
                      value={complaintForm.village}
                      onChange={(e) => setComplaintForm({...complaintForm, village: e.target.value})}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      placeholder="Enter village name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Issue Type</label>
                    <input
                      type="text"
                      value={complaintForm.issue}
                      onChange={(e) => setComplaintForm({...complaintForm, issue: e.target.value})}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      placeholder="Brief description of the issue"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Detailed Description</label>
                    <textarea
                      value={complaintForm.description}
                      onChange={(e) => setComplaintForm({...complaintForm, description: e.target.value})}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md h-24"
                      placeholder="Provide detailed information about the issue"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Priority</label>
                    <select
                      value={complaintForm.priority}
                      onChange={(e) => setComplaintForm({...complaintForm, priority: e.target.value})}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSubmitComplaint} className="btn-primary">
                      Submit Complaint
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowComplaintForm(false)}
                      className="btn-outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="space-y-4">
              {myComplaints.map((complaint) => (
                <Card key={complaint.id} className="border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{complaint.village}</CardTitle>
                        <CardDescription>
                          Submitted on {complaint.date}
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
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-foreground">Issue:</h4>
                        <p className="text-muted-foreground">{complaint.issue}</p>
                      </div>
                      {complaint.response && (
                        <div>
                          <h4 className="font-medium text-foreground">Government Response:</h4>
                          <p className="text-muted-foreground bg-gray-50 p-3 rounded-md">
                            {complaint.response}
                          </p>
                        </div>
                      )}
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
            <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">FRA Applications</h2>
                <p className="text-muted-foreground">Submit and track your Forest Rights Act applications</p>
              </div>
              {userPermissions.canSubmitFRAApplications && (
                <Button 
                  onClick={() => setShowFRAForm(true)}
                  className="btn-primary w-full sm:w-auto"
                >
                  <FileCheck className="w-4 h-4 mr-2" />
                  New FRA Application
                </Button>
              )}
            </div>
            
            {/* FRA Application Form Modal */}
            {showFRAForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <FRAApplicationForm
                    onClose={() => setShowFRAForm(false)}
                    onSubmit={handleSubmitFRAApplication}
                  />
                </div>
              </div>
            )}
            
            <FRAApplicationList
              applications={fraApplications}
              onEdit={handleEditFRAApplication}
              onDelete={handleDeleteFRAApplication}
              onStatusChange={handleStatusChangeFRAApplication}
            />
          </div>
        )}

        {/* Role-Specific Dashboard */}
        {activeTab === 'role-dashboard' && (
          <div className="flex-1 p-4">
            <RoleSpecificDashboard />
          </div>
        )}

        {/* Analytics View */}
        {activeTab === 'analytics' && (
          <div className="flex-1 p-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Analytics Dashboard</h2>
              <p className="text-muted-foreground">{limitedMode ? 'Sign in to view detailed analytics' : 'View forest rights statistics and trends'}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{limitedMode ? '—' : '1,234'}</div>
                  <p className="text-sm text-muted-foreground">In your region</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Approved Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{limitedMode ? '—' : '856'}</div>
                  <p className="text-sm text-muted-foreground">{limitedMode ? 'Login required' : '69% approval rate'}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">My Complaints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">{limitedMode ? '—' : myComplaints.length}</div>
                  <p className="text-sm text-muted-foreground">{limitedMode ? 'Sign in to view' : 'Submitted complaints'}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Desktop Control Panel */}
        {!isMobile && !selectedForest && (
          <div className="w-80 p-4 pl-2">
            <ControlPanel 
              selectedFilters={filters}
              onFilterChange={setFilters}
              isMobile={false}
            />
          </div>
        )}
      </div>

      {/* Details Drawer (Read-only for local users) */}
      <DetailsDrawer
        village={selectedVillage}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        isMobile={isMobile}
        isGovernmentUser={false}
        // Pass limitedMode to hide sensitive fields when anonymous
        limitedMode={limitedMode}
      />

      {/* FAQ and Contact below the main dashboard - Only show on Home tab */}
      {activeTab === 'dashboard' && (
        <>
          <FAQSection />
          <ContactSection />
        </>
      )}

      {/* Footer removed from local user home */}
    </div>
  );
};

export default LocalDashboard;
