import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  // Added requiredRole to enforce role-based access for sensitive routes like government dashboard
  // NOTE: Keeping default behavior intact if requiredRole is not provided
  requiredRole?: 'government' | 'local' | 'ministry_tribal' | 'welfare_dept' | 'forest_revenue' | 'planning_develop' | 'ngo' | 'normal';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { currentUser, userRole } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login with return path
  if (!currentUser) {
    return <Navigate to={`/login`} state={{ from: location }} replace />;
  }

  // If a role is required, ensure it matches the signed-in user's role
  if (requiredRole && userRole !== requiredRole) {
    // Redirect mismatch users to appropriate dashboard based on their role
    const isGovernmentRole = userRole === 'government' || userRole === 'ministry_tribal' || 
                            userRole === 'welfare_dept' || userRole === 'forest_revenue' || 
                            userRole === 'planning_develop';
    
    if (isGovernmentRole) {
      return <Navigate to="/government-dashboard" replace />;
    } else {
      return <Navigate to="/local-dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
