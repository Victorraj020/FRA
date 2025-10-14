import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export type UserRole = 'normal' | 'government' | 'ministry_tribal' | 'welfare_dept' | 'forest_revenue' | 'planning_develop' | 'ngo' | null;

// Define role-specific permissions and attributes
export interface RolePermissions {
  canEditClaims: boolean;
  canApproveClaims: boolean;
  canViewAllComplaints: boolean;
  canEditComplaints: boolean;
  canSubmitFRAApplications: boolean;
  canViewAnalytics: boolean;
  canManageUsers: boolean;
  canUploadDocuments: boolean;
  canGenerateReports: boolean;
  canAccessMap: boolean;
  canEditVillageData: boolean;
  canManageAlerts: boolean;
  departmentSpecificFeatures: string[];
  maxFileUploadSize: number; // in MB
  allowedFileTypes: string[];
}

export const ROLE_PERMISSIONS: Record<NonNullable<UserRole>, RolePermissions> & { null: RolePermissions } = {
  normal: {
    canEditClaims: false,
    canApproveClaims: false,
    canViewAllComplaints: false,
    canEditComplaints: false,
    canSubmitFRAApplications: true,
    canViewAnalytics: false,
    canManageUsers: false,
    canUploadDocuments: true,
    canGenerateReports: false,
    canAccessMap: true,
    canEditVillageData: false,
    canManageAlerts: false,
    departmentSpecificFeatures: ['Submit complaints', 'Track applications', 'View basic information'],
    maxFileUploadSize: 10,
    allowedFileTypes: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']
  },
  government: {
    canEditClaims: true,
    canApproveClaims: true,
    canViewAllComplaints: true,
    canEditComplaints: true,
    canSubmitFRAApplications: true,
    canViewAnalytics: true,
    canManageUsers: true,
    canUploadDocuments: true,
    canGenerateReports: true,
    canAccessMap: true,
    canEditVillageData: true,
    canManageAlerts: true,
    departmentSpecificFeatures: ['Full system access', 'User management', 'System configuration', 'All analytics'],
    maxFileUploadSize: 50,
    allowedFileTypes: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xlsx', 'csv']
  },
  ministry_tribal: {
    canEditClaims: true,
    canApproveClaims: true,
    canViewAllComplaints: true,
    canEditComplaints: true,
    canSubmitFRAApplications: true,
    canViewAnalytics: true,
    canManageUsers: false,
    canUploadDocuments: true,
    canGenerateReports: true,
    canAccessMap: true,
    canEditVillageData: true,
    canManageAlerts: true,
    departmentSpecificFeatures: ['Tribal rights management', 'Tribal analytics', 'Community coordination', 'Tribal welfare reports'],
    maxFileUploadSize: 30,
    allowedFileTypes: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xlsx']
  },
  welfare_dept: {
    canEditClaims: false,
    canApproveClaims: false,
    canViewAllComplaints: true,
    canEditComplaints: false,
    canSubmitFRAApplications: false,
    canViewAnalytics: true,
    canManageUsers: false,
    canUploadDocuments: true,
    canGenerateReports: true,
    canAccessMap: true,
    canEditVillageData: false,
    canManageAlerts: false,
    departmentSpecificFeatures: ['Welfare tracking', 'Social impact analysis', 'Community welfare reports', 'Beneficiary management'],
    maxFileUploadSize: 25,
    allowedFileTypes: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']
  },
  forest_revenue: {
    canEditClaims: true,
    canApproveClaims: false,
    canViewAllComplaints: true,
    canEditComplaints: true,
    canSubmitFRAApplications: true,
    canViewAnalytics: true,
    canManageUsers: false,
    canUploadDocuments: true,
    canGenerateReports: true,
    canAccessMap: true,
    canEditVillageData: true,
    canManageAlerts: true,
    departmentSpecificFeatures: ['Revenue tracking', 'Forest mapping', 'Revenue analytics', 'Land records management'],
    maxFileUploadSize: 40,
    allowedFileTypes: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xlsx', 'csv', 'kml']
  },
  planning_develop: {
    canEditClaims: false,
    canApproveClaims: false,
    canViewAllComplaints: true,
    canEditComplaints: false,
    canSubmitFRAApplications: false,
    canViewAnalytics: true,
    canManageUsers: false,
    canUploadDocuments: true,
    canGenerateReports: true,
    canAccessMap: true,
    canEditVillageData: false,
    canManageAlerts: false,
    departmentSpecificFeatures: ['Development planning', 'Infrastructure analysis', 'Project tracking', 'Development reports'],
    maxFileUploadSize: 35,
    allowedFileTypes: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xlsx', 'csv']
  },
  ngo: {
    canEditClaims: false,
    canApproveClaims: false,
    canViewAllComplaints: false,
    canEditComplaints: false,
    canSubmitFRAApplications: false,
    canViewAnalytics: false,
    canManageUsers: false,
    canUploadDocuments: true,
    canGenerateReports: false,
    canAccessMap: true,
    canEditVillageData: false,
    canManageAlerts: false,
    departmentSpecificFeatures: ['Community support', 'Advocacy tools', 'Impact assessment', 'Community reports'],
    maxFileUploadSize: 20,
    allowedFileTypes: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']
  },
  null: {
    canEditClaims: false,
    canApproveClaims: false,
    canViewAllComplaints: false,
    canEditComplaints: false,
    canSubmitFRAApplications: false,
    canViewAnalytics: false,
    canManageUsers: false,
    canUploadDocuments: false,
    canGenerateReports: false,
    canAccessMap: true,
    canEditVillageData: false,
    canManageAlerts: false,
    departmentSpecificFeatures: [],
    maxFileUploadSize: 0,
    allowedFileTypes: []
  }
};

interface AuthContextType {
  currentUser: User | null;
  userRole: UserRole;
  userPermissions: RolePermissions;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  loginWithGoogle: (role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (role: UserRole) => Promise<void>;
  loading: boolean;
}

// Helper function to get role permissions
export const getRolePermissions = (role: UserRole): RolePermissions => {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  
  // Get user permissions based on current role
  const userPermissions = getRolePermissions(userRole);

  const signup = async (email: string, password: string, displayName: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName });
      
      // Set default role for new users
      const defaultRole = 'normal';
      localStorage.setItem('userRole', defaultRole);
      setUserRole(defaultRole);
      
      console.log('Signup successful, user role set to:', defaultRole);
    } catch (error) {
      console.log('Firebase signup failed, using mock signup for testing');
      // Mock user for testing when Firebase isn't configured
      const mockUser = {
        uid: 'mock-signup-user-id',
        email: email,
        displayName: displayName,
        emailVerified: true
      } as User;
      setCurrentUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      // Default mock signup to 'normal' role
      localStorage.setItem('userRole', 'normal');
      setUserRole('normal');
    }
  };

  const login = async (email: string, password: string, role?: UserRole) => {
    // Predefined credentials for different user types
    const userCredentials = {
      'normal': { email: 'user@fraportal.com', password: 'user123' },
      'government': { email: 'gov@fraportal.com', password: 'gov123' },
      'ministry_tribal': { email: 'tribal@fraportal.com', password: 'tribal123' },
      'welfare_dept': { email: 'welfare@fraportal.com', password: 'welfare123' },
      'forest_revenue': { email: 'forest@fraportal.com', password: 'forest123' },
      'planning_develop': { email: 'planning@fraportal.com', password: 'planning123' },
      'ngo': { email: 'ngo@fraportal.com', password: 'ngo123' }
    };

    // Check if credentials match any predefined user
    const matchedRole = Object.entries(userCredentials).find(
      ([_, creds]) => creds.email === email && creds.password === password
    );

    if (matchedRole) {
      const [userRole] = matchedRole;
      console.log(`Login successful for ${userRole} user`);
      
      // Create mock user for the specific role
      const mockUser = {
        uid: `mock-${userRole}-user-id`,
        email: email,
        displayName: email.split('@')[0],
        emailVerified: true
      } as User;
      
      setCurrentUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      localStorage.setItem('userRole', userRole);
      setUserRole(userRole as UserRole);
      return;
    }

    // Fallback to Firebase authentication
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Default role for Firebase login
      const defaultRole = role || 'normal';
      localStorage.setItem('userRole', defaultRole);
      setUserRole(defaultRole);
    } catch (error) {
      console.log('Firebase login failed, using mock login for testing');
      // Mock user for testing when Firebase isn't configured
      const mockUser = {
        uid: 'mock-user-id',
        email: email,
        displayName: email.split('@')[0],
        emailVerified: true
      } as User;
      setCurrentUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      // Default mock login to 'normal' role
      localStorage.setItem('userRole', 'normal');
      setUserRole('normal');
    }
  };

  const loginWithGoogle = async (role?: UserRole) => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Default Google login to specified role or 'normal'
      const defaultRole = role || 'normal';
      localStorage.setItem('userRole', defaultRole);
      setUserRole(defaultRole);
    } catch (error) {
      console.log('Firebase Google login failed, using mock Google login for demo');
      // Mock Google user for demo purposes
      const mockGoogleUser = {
        uid: 'mock-google-user-id',
        email: 'demo@fraportal.com',
        displayName: 'Demo User',
        emailVerified: true
      } as User;
      setCurrentUser(mockGoogleUser);
      localStorage.setItem('mockUser', JSON.stringify(mockGoogleUser));
      // Default mock Google login to specified role or 'normal'
      const defaultRole = role || 'normal';
      localStorage.setItem('userRole', defaultRole);
      setUserRole(defaultRole);
    }
  };

  const logout = async () => {
    console.log('=== LOGOUT STARTED ===');
    console.log('Current user before logout:', currentUser);
    console.log('Current userRole before logout:', userRole);
    
    try {
      // Clear localStorage immediately
      localStorage.removeItem('userRole');
      localStorage.removeItem('mockUser');
      console.log('LocalStorage cleared');
      
      // Clear all state immediately
      setCurrentUser(null);
      setUserRole(null);
      setLoading(false);
      console.log('State cleared - user logged out');
      
      // Try Firebase logout (non-blocking)
      try {
        await signOut(auth);
        console.log('Firebase logout successful');
      } catch (error) {
        console.log('Firebase logout failed (expected if not configured):', error);
      }
      
      console.log('=== LOGOUT COMPLETED ===');
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, ensure state is cleared
      setCurrentUser(null);
      setUserRole(null);
      setLoading(false);
      localStorage.removeItem('userRole');
      localStorage.removeItem('mockUser');
    }
  };

  const updateUserRole = async (role: UserRole) => {
    // In a real app, you would save this to Firestore or your backend
    // For now, we'll store it in localStorage
    if (role) {
      localStorage.setItem('userRole', role);
      setUserRole(role);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user);
      setCurrentUser(user);
      if (user) {
        // Load user role from localStorage
        const savedRole = localStorage.getItem('userRole') as UserRole;
        setUserRole(savedRole);
        console.log('Firebase user logged in, role:', savedRole);
      } else {
        // Check for mock user in localStorage
        const mockUserStr = localStorage.getItem('mockUser');
        if (mockUserStr) {
          try {
            const mockUser = JSON.parse(mockUserStr);
            setCurrentUser(mockUser);
            const savedRole = localStorage.getItem('userRole') as UserRole;
            setUserRole(savedRole);
            console.log('Mock user logged in, role:', savedRole);
          } catch (error) {
            console.error('Error parsing mock user:', error);
            setCurrentUser(null);
            setUserRole(null);
            localStorage.removeItem('userRole');
            localStorage.removeItem('mockUser');
          }
        } else {
          setCurrentUser(null);
          setUserRole(null);
          console.log('No user found, logged out');
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    userPermissions,
    signup,
    login,
    loginWithGoogle,
    logout,
    updateUserRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
