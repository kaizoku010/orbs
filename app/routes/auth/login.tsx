// Login Screen - Phone/Email authentication
import { useState, useEffect } from 'react';
import { useAuth } from '~/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Lock, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from '~/services/firebaseService';

export default function LoginPage() {


  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/network', { replace: true });
    }
  }, [user, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(email, password);
      // AuthProvider will handle the redirect via the useEffect above
    } catch (error: any) {
      console.error('[LoginPage] login error:', error);
      setErrors({ submit: error?.message || 'Invalid email or password' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center p-4 sm:p-6 font-sans overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-kizuna-green/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] bg-white rounded-[24px] shadow-2xl overflow-hidden shadow-kizuna-green/5 border border-slate-100"
      >
        <div className="p-8 pb-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-kizuna-green flex items-center justify-center text-white font-black text-lg">絆</div>
            <span className="font-black text-charcoal tracking-widest text-sm uppercase">Kizuna</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black text-charcoal uppercase tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">
              Sign in to connect with your community
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"><Mail size={18} /></div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="user@email.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-[14px] text-charcoal font-bold focus:outline-none focus:ring-2 focus:ring-kizuna-green/20 focus:border-kizuna-green transition-all placeholder:text-slate-300"
              />
            </div>
            {errors.email && <p className="text-[10px] font-black text-red-500 uppercase ml-1 italic">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"><Lock size={18} /></div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-[14px] text-charcoal font-bold focus:outline-none focus:ring-2 focus:ring-kizuna-green/20 focus:border-kizuna-green transition-all placeholder:text-slate-300"
              />
            </div>
            {errors.password && <p className="text-[10px] font-black text-red-500 uppercase ml-1 italic">{errors.password}</p>}
          </div>

          <div className="flex items-center gap-2 ml-1">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-kizuna-green focus:ring-kizuna-green/20 cursor-pointer"
            />
            <label htmlFor="rememberMe" className="text-xs font-bold text-slate-600 cursor-pointer select-none">
              Remember me for next time
            </label>
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-[14px]">
              <p className="text-[10px] font-black text-red-500 uppercase text-center">{errors.submit}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 text-white rounded-[14px] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl ${loading ? 'bg-slate-300' : 'bg-kizuna-green hover:brightness-110 shadow-kizuna-green/20'}`}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="p-8 pt-4 text-center space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-kizuna-green hover:underline">
              Join the community
            </Link>
          </p>

          <p className="text-[8px] text-slate-300 font-black uppercase tracking-tight leading-tight">
            By continuing, you agree to our{' '}
            <a href="#" className="underline">Terms of Service</a> and{' '}
            <a href="#" className="underline">Privacy Policy</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

