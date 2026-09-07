import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import {
  Mail,
  Lock,
  User,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Zap,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loadingState, setLoadingState] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoadingState(true);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to register');
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300 relative">

      {/* Back to Home Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200/80 dark:border-slate-800 px-3.5 py-2 rounded-xl shadow-sm"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to home</span>
      </Link>

      {/* LEFT COLUMN: Branding Panel */}
      <div className="hidden lg:flex lg:col-span-5 bg-slate-900 border-r border-slate-800 p-12 flex-col justify-between relative overflow-hidden text-white">

        {/* Glow backdrop */}
        <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[350px] rounded-full bg-indigo-600/30 blur-[120px]" />
          <div className="absolute bottom-[5%] right-[-5%] w-[350px] h-[280px] rounded-full bg-purple-600/20 blur-[100px]" />
        </div>

        {/* Branding Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            SkillSync <span className="badge badge-primary font-mono text-[10px]">AI</span>
          </span>
        </div>

        {/* Core Value Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 relative z-10 max-w-md"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Career Accelerator</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight leading-tight text-white">
            Build your career around verified developer skills.
          </h2>

          <p className="text-slate-400 text-xs leading-relaxed">
            Create an account to track applications, complete mock interviews, scan ATS resumes, and build dynamic developer portfolios.
          </p>

          <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-2xl space-y-3">
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Account Benefits</span>
              <span className="text-emerald-400 font-mono">100% FREE</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Unlimited Python Resume Microservice scans</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Interview simulation sessions</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Footer */}
        <div className="flex items-center gap-2 text-xs text-slate-400 relative z-10">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Enterprise 256-bit SSL encrypted registration</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Auth Form */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center py-16 px-6 sm:px-12 lg:px-20 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full space-y-6 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl"
        >
          <div>
            {/* Mobile Branding */}
            <div className="flex lg:hidden items-center justify-center gap-2 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">SkillSync AI</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white text-center lg:text-left">
              Create an Account
            </h2>
            <p className="mt-1.5 text-slate-500 dark:text-slate-400 text-xs text-center lg:text-left">
              Join SkillSync AI to evaluate resumes, take mock interviews, and build portfolios.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 p-3.5 rounded-xl flex items-start text-xs leading-normal"
              >
                <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="space-y-3.5">
              {/* Full Name Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field pl-10 text-xs"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10 text-xs"
                    placeholder="name@work-email.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10 pr-10 text-xs"
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
                <div className="flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${password.length >= 6 ? 'text-emerald-500' : 'text-slate-300'}`} />
                  <span className="text-[10px] text-slate-400 font-medium">Must be at least 6 characters</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingState}
              className="btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loadingState ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create SkillSync Account</span>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                Sign in
              </Link>
            </p>
          </div>

        </motion.div>
      </div>

    </div>
  );
}
