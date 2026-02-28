import { Toaster } from "@/components/ui/toaster";
import './i18n';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import SecretShortcut from "@/components/SecretShortcut";
import Landing from "./pages/Landing";
import SatkosiaDashboard from "@/components/ui/satkosia_dashboard (1)";
import LimitedLanding from "./pages/LimitedLanding";
import RoleSelection from "./pages/RoleSelection";
import GovernmentDashboard from "./pages/GovernmentDashboard";
import LocalDashboard from "./pages/LocalDashboard";
import TribalDashboard from "./pages/TribalDashboard";
import WelfareDashboard from "./pages/WelfareDashboard";
import ForestRevenueDashboard from "./pages/ForestRevenueDashboard";
import PlanningDevelopmentDashboard from "./pages/PlanningDevelopmentDashboard";
import NGODashboard from "./pages/NGODashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Documentation from "./pages/Documentation";
import Security from "./pages/Security";
import Status from "./pages/Status";
import AIChatbot from "@/components/AIChatbot";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import MoTAInfo from "./pages/MoTAInfo";
import AIInsights from "./pages/AIInsights";
import VillageDetails from "./pages/VillageDetails";
import AmenitiesViewer from "./pages/AmenitiesViewer";
import VillagesList from "./pages/VillagesList";
import GovLayout from "@/components/GovLayout";
import SatelliteMapping from "./pages/SatelliteMapping";
// Footer removed per request

const queryClient = new QueryClient();

// Component to handle role-based routing
const RoleBasedRouter = () => {
  const { currentUser, userRole, loading } = useAuth();

  console.log('=== ROLEBASEDROUTER RENDER ===');
  console.log('RoleBasedRouter - currentUser:', currentUser);
  console.log('RoleBasedRouter - userRole:', userRole);
  console.log('RoleBasedRouter - loading:', loading);

  // Show loading state while authentication is being checked
  if (loading) {
    console.log('Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user, show limited version of the normal user dashboard
  if (!currentUser) {
    console.log('No current user, showing limited local dashboard');
    return <LocalDashboard />;
  }

  // If user exists but no role is set, redirect to role selection
  if (!userRole) {
    console.log('User exists but no role set, redirecting to role selection');
    return <RoleSelection />;
  }

  // Handle different user roles with specific dashboards
  switch (userRole) {
    case 'government':
      console.log('Redirecting to government dashboard for role:', userRole);
      return <GovernmentDashboard />;
    case 'ministry_tribal':
      console.log('Redirecting to tribal dashboard for role:', userRole);
      return <TribalDashboard />;
    case 'welfare_dept':
      console.log('Redirecting to welfare dashboard for role:', userRole);
      return <WelfareDashboard />;
    case 'forest_revenue':
      console.log('Redirecting to forest revenue dashboard for role:', userRole);
      return <ForestRevenueDashboard />;
    case 'planning_develop':
      console.log('Redirecting to planning development dashboard for role:', userRole);
      return <PlanningDevelopmentDashboard />;
    case 'ngo':
      console.log('Redirecting to NGO dashboard for role:', userRole);
      return <NGODashboard />;
    case 'normal':
      console.log('Redirecting to local dashboard for role:', userRole);
      return <LocalDashboard />;
    default:
      console.log('Fallback to local dashboard');
      return <LocalDashboard />;
  }
};

// Legacy route helpers to preserve old URLs
const LegacyMapRedirect = () => {
  const { userRole } = useAuth();
  switch (userRole) {
    case 'government':
      return <Navigate to="/government-dashboard?tab=map" replace />;
    case 'ministry_tribal':
      return <Navigate to="/tribal-dashboard" replace />;
    case 'welfare_dept':
      return <Navigate to="/welfare-dashboard" replace />;
    case 'forest_revenue':
      return <Navigate to="/forest-revenue-dashboard" replace />;
    case 'planning_develop':
      return <Navigate to="/planning-development-dashboard" replace />;
    case 'ngo':
      return <Navigate to="/ngo-dashboard" replace />;
    default:
      return <Navigate to="/local-dashboard?tab=map" replace />;
  }
};

const LegacyAnalyticsRedirect = () => {
  const { userRole } = useAuth();
  if (userRole === 'government') return <Navigate to="/government-dashboard?tab=analytics" replace />;
  return <Navigate to="/local-dashboard?tab=analytics" replace />;
};

const LegacyFRAApplicationsRedirect = () => {
  const { userRole } = useAuth();
  if (userRole === 'government') return <Navigate to="/government-dashboard?tab=fra-applications" replace />;
  return <Navigate to="/local-dashboard?tab=fra-applications" replace />;
};

const LegacyComplaintsRedirect = () => {
  const { userRole } = useAuth();
  if (userRole === 'government') return <Navigate to="/government-dashboard?tab=complaints" replace />;
  return <Navigate to="/local-dashboard?tab=complaints" replace />;
};

const LegacyAlertsRedirect = () => {
  const { userRole } = useAuth();
  if (userRole === 'government') return <Navigate to="/government-dashboard?tab=alerts" replace />;
  return <Navigate to="/local-dashboard?tab=alerts" replace />;
};

const LegacyAIInsightsRedirect = () => {
  const { userRole } = useAuth();
  if (userRole === 'government') return <Navigate to="/government-dashboard?tab=ai-insights" replace />;
  if (userRole === 'forest_revenue') return <Navigate to="/forest-revenue-dashboard" replace />;
  if (userRole === 'ministry_tribal') return <Navigate to="/tribal-dashboard" replace />;
  return <Navigate to="/" replace />;
};

const AppContent = () => {
  const location = useLocation();
  // Footer disabled globally

  return (
    <GovLayout>
      <div className="min-h-screen flex flex-col">
        <SecretShortcut />
        <div className="flex-1 pb-24">
          <Routes>
            <Route path="/" element={<RoleBasedRouter />} />
            <Route path="/limited" element={<LimitedLanding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/signup" element={<SignUp />} />
            {/* Wrapped with role-based protection. Only government role can access. */}
            {/* <Route path="/government-dashboard" element={<GovernmentDashboard />} /> */}
            <Route
              path="/government-dashboard"
              element={
                <ProtectedRoute requiredRole="government">
                  <GovernmentDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/local-dashboard" element={<LocalDashboard />} />
            <Route
              path="/tribal-dashboard"
              element={
                <ProtectedRoute requiredRole="ministry_tribal">
                  <TribalDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/welfare-dashboard"
              element={
                <ProtectedRoute requiredRole="welfare_dept">
                  <WelfareDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forest-revenue-dashboard"
              element={
                <ProtectedRoute requiredRole="forest_revenue">
                  <ForestRevenueDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/planning-development-dashboard"
              element={
                <ProtectedRoute requiredRole="planning_develop">
                  <PlanningDevelopmentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ngo-dashboard"
              element={
                <ProtectedRoute requiredRole="ngo">
                  <NGODashboard />
                </ProtectedRoute>
              }
            />


            <Route path="/docs" element={<Documentation />} />
            <Route path="/security" element={<Security />} />
            <Route path="/status" element={<Status />} />
            <Route path="/satkosia" element={<SatkosiaDashboard />} />
            <Route path="/mota-info" element={<MoTAInfo />} />
            <Route path="/village/:code" element={<VillageDetails />} />
            <Route path="/villages" element={<VillagesList />} />
            <Route path="/satellite-mapping" element={<SatelliteMapping />} />
            <Route path="/amenities" element={<AmenitiesViewer />} />
            {/* Legacy/alias routes mapping to tabbed dashboards */}
            <Route path="/map" element={<LegacyMapRedirect />} />
            <Route path="/analytics" element={<LegacyAnalyticsRedirect />} />
            <Route path="/fra-applications" element={<LegacyFRAApplicationsRedirect />} />
            <Route path="/complaints" element={<LegacyComplaintsRedirect />} />
            <Route path="/alerts" element={<LegacyAlertsRedirect />} />
            <Route path="/ai-insights" element={<AIInsights />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <AIChatbot />
        <PWAInstallPrompt />
      </div>
    </GovLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
