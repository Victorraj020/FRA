import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/contexts/AuthContext';
import { Eye, EyeOff, Loader2, Shield, Users, Building2, Heart, TreePine, ClipboardList, UserCheck, ArrowRight, ChevronLeft } from 'lucide-react';

const ROLES = [
  {
    id: 'normal',
    title: 'Normal User',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    ring: 'ring-blue-400',
    credentials: { email: 'user@fraportal.com', password: 'user123' },
  },
  {
    id: 'government',
    title: 'Government',
    icon: Shield,
    color: 'from-red-500 to-red-600',
    ring: 'ring-red-400',
    credentials: { email: 'gov@fraportal.com', password: 'gov123' },
  },
  {
    id: 'ministry_tribal',
    title: 'Tribal Affairs',
    icon: Building2,
    color: 'from-green-500 to-green-600',
    ring: 'ring-green-400',
    credentials: { email: 'tribal@fraportal.com', password: 'tribal123' },
  },
  {
    id: 'welfare_dept',
    title: 'Welfare Dept.',
    icon: Heart,
    color: 'from-purple-500 to-purple-600',
    ring: 'ring-purple-400',
    credentials: { email: 'welfare@fraportal.com', password: 'welfare123' },
  },
  {
    id: 'forest_revenue',
    title: 'Forest & Revenue',
    icon: TreePine,
    color: 'from-emerald-500 to-emerald-600',
    ring: 'ring-emerald-400',
    credentials: { email: 'forest@fraportal.com', password: 'forest123' },
  },
  {
    id: 'planning_develop',
    title: 'Planning & Dev.',
    icon: ClipboardList,
    color: 'from-orange-500 to-orange-600',
    ring: 'ring-orange-400',
    credentials: { email: 'planning@fraportal.com', password: 'planning123' },
  },
  {
    id: 'ngo',
    title: 'NGO',
    icon: UserCheck,
    color: 'from-cyan-500 to-cyan-600',
    ring: 'ring-cyan-400',
    credentials: { email: 'ngo@fraportal.com', password: 'ngo123' },
  },
];

const ROLE_ROUTES: Record<string, string> = {
  normal: '/local-dashboard',
  government: '/government-dashboard',
  ministry_tribal: '/tribal-dashboard',
  welfare_dept: '/welfare-dashboard',
  forest_revenue: '/forest-revenue-dashboard',
  planning_develop: '/planning-development-dashboard',
  ngo: '/ngo-dashboard',
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [step, setStep] = useState<'role' | 'credentials'>('role');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedRoleData = ROLES.find(r => r.id === selectedRole);

  const handleRolePick = (roleId: string) => {
    const role = ROLES.find(r => r.id === roleId);
    if (!role) return;
    setSelectedRole(roleId);
    setEmail(role.credentials.email);
    setPassword(role.credentials.password);
    setError('');
    setStep('credentials');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    try {
      setError('');
      setLoading(true);
      await login(email, password, selectedRole as UserRole);
      navigate(ROLE_ROUTES[selectedRole] || '/local-dashboard');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle(selectedRole as UserRole);
      navigate(ROLE_ROUTES[selectedRole] || '/local-dashboard');
    } catch {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    if (selectedRoleData) {
      setEmail(selectedRoleData.credentials.email);
      setPassword(selectedRoleData.credentials.password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a1628]">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-green-900/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-900/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-emerald-900/20 rounded-full blur-3xl" />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto px-4 py-8">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 mb-4">
            <img src="/Symbol.jpg" alt="Emblem" className="h-10 w-10 object-contain rounded-xl"
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">FRA Portal</h1>
          <p className="text-sm text-slate-400 mt-1">Ministry of Tribal Affairs · Government of India</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

          {/* --- STEP 1: Role Selection --- */}
          {step === 'role' && (
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-white mb-1">Select your role</h2>
              <p className="text-sm text-slate-400 mb-6">Choose the portal you want to access</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ROLES.map(role => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleRolePick(role.id)}
                      className={`group flex flex-col items-center gap-2 p-4 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/10 hover:border-white/20 transition-all duration-200 hover:scale-[1.02] active:scale-95`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-slate-300 text-center leading-tight">{role.title}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <p className="text-xs text-slate-500">
                  New user?{' '}
                  <button onClick={() => navigate('/signup')} className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                    Create an account
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* --- STEP 2: Credentials --- */}
          {step === 'credentials' && selectedRoleData && (
            <div className="p-6 sm:p-8">
              {/* Back button + role header */}
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => { setStep('role'); setError(''); }}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${selectedRoleData.color} flex items-center justify-center shadow-md`}>
                  {React.createElement(selectedRoleData.icon, { className: 'w-4 h-4 text-white' })}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white leading-none">{selectedRoleData.title} Login</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Enter your credentials below</p>
                </div>
              </div>

              {/* Demo credentials banner */}
              <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-emerald-400 mb-0.5">Demo Credentials</p>
                  <p className="text-xs text-slate-400">
                    <span className="text-slate-300">{selectedRoleData.credentials.email}</span>
                    {' · '}
                    <span className="text-slate-300">{selectedRoleData.credentials.password}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fillDemo}
                  className="shrink-0 text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-lg font-medium transition-colors"
                >
                  Fill
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${selectedRoleData.color} hover:opacity-90 active:opacity-80 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2`}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {loading ? 'Signing in...' : 'Sign In'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              {/* Divider + Google (normal user only) */}
              {selectedRole === 'normal' && (
                <>
                  <div className="my-5 flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-xs text-slate-500 uppercase tracking-wider">or</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium py-3 rounded-xl transition-all duration-200 disabled:opacity-60"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#FBBC05" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    </svg>
                    Continue with Google
                  </button>
                </>
              )}

              <div className="mt-5 pt-4 border-t border-white/10 text-center">
                <p className="text-xs text-slate-500">
                  New user?{' '}
                  <button onClick={() => navigate('/signup')} className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                    Create an account
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          © 2024 Ministry of Tribal Affairs · Government of India
        </p>
      </div>
    </div>
  );
};

export default Login;
