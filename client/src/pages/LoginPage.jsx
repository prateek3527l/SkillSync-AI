import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Mail, 
  Lock, 
  AlertCircle, 
  Loader, 
  Eye, 
  EyeOff, 
  Zap, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loadingState, setLoadingState] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingState(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to login');
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      
      {/* Back to Home Button - absolute top left */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-20 inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 px-3.5 py-2 rounded-xl shadow-sm"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to homepage</span>
      </Link>

      {/* LEFT COLUMN: Branding and Marketing Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:col-span-5 bg-indigo-900 dark:bg-slate-900 border-r border-indigo-950/20 dark:border-slate-800/80 p-12 flex-col justify-between relative overflow-hidden text-white">
        
        {/* Glow Effects */}
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[300px] rounded-full bg-indigo-400 blur-[100px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[350px] h-[250px] rounded-full bg-violet-400 blur-[80px]" />
        </div>

        {/* Branding Logo */}
        <div className="flex items-center space-x-3 relative z-10">
          <div className="w-9 h-9 bg-white text-indigo-900 rounded-xl flex items-center justify-center shadow-md">
            <Zap className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
            SkillSync <span className="text-xs font-semibold bg-indigo-950 border border-indigo-800/50 text-indigo-400 px-2 py-0.5 rounded-full">AI</span>
          </span>
        </div>

        {/* Marketing Core Statement */}
        <div className="space-y-6 relative z-10 max-w-md">
          <div className="inline-flex items-center space-x-2 bg-indigo-950/50 text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-800/50">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Career Accelerator</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight leading-tight text-white">
            Build a career path around your actual skills.
          </h2>
          
          <p className="text-slate-300 text-sm leading-relaxed">
            Practice customized technical interview questions, optimize resume formats for ATS bots, and manage job applications.
          </p>

          {/* Simple Visual Preview card */}
          <div className="bg-indigo-950/40 border border-indigo-800/30 rounded-2xl p-4 space-y-3 mt-8">
            <div className="flex justify-between items-center text-[10px] text-indigo-300 font-bold uppercase tracking-wider">
              <span>Next Simulation Module</span>
              <span className="text-emerald-400">System Ready</span>
            </div>
            <p className="text-xs text-white font-medium leading-relaxed">
              "Tell me about a time you resolved a major service failure in production."
            </p>
            <div className="w-full bg-indigo-950/80 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-xs text-indigo-300/60 relative z-10">
          Secure enterprise-level 256-bit encryption.
        </p>
      </div>

      {/* RIGHT COLUMN: Form Area */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center py-16 px-6 sm:px-12 lg:px-20 relative">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md">
          
          <div>
            {/* Show branding on mobile only */}
            <div className="flex lg:hidden items-center justify-center space-x-2.5 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">SkillSync AI</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white text-center lg:text-left">
              Welcome back
            </h2>
            <p className="mt-2 text-slate-500 text-xs text-center lg:text-left">
              Enter your credentials to access your SkillSync portfolio dashboard.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 p-3.5 rounded-xl flex items-start text-xs leading-normal animate-fadeIn">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 block w-full px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 block w-full px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingState}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:bg-indigo-600/60 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-indigo-600/10 active:scale-[0.99] duration-150 flex items-center justify-center space-x-2"
            >
              {loadingState ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/80 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                Create account
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}