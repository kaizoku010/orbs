// Login Screen - Phone/Email authentication
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, ArrowRight, User, Briefcase, Lock, Loader2 } from 'lucide-react';
import { login, loginAsTestUser, TEST_USER_ALICE, TEST_USER_BOB } from '~/mocks/services';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState<'alice' | 'bob' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load saved credentials on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('kizuna_saved_email');
      const savedPassword = localStorage.getItem('kizuna_saved_password');
      const savedRemember = localStorage.getItem('kizuna_remember_me');

      if (savedRemember === 'true' && savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
        if (savedPassword) {
          setPassword(savedPassword);
        }
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.phone = 'Phone is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const result = await login({ email, password });

    if (result.success) {
      // Save credentials if "Remember Me" is checked
      if (typeof window !== 'undefined') {
        if (rememberMe) {
          localStorage.setItem('kizuna_saved_email', email);
          localStorage.setItem('kizuna_saved_password', password);
          localStorage.setItem('kizuna_remember_me', 'true');
        } else {
          // Clear saved credentials if "Remember Me" is unchecked
          localStorage.removeItem('kizuna_saved_phone');
          localStorage.removeItem('kizuna_saved_password');
          localStorage.removeItem('kizuna_remember_me');
        }
      }

      navigate('/network');
    } else {
      setErrors({ submit: result.error || 'Invalid phone or password' });
    }

    setLoading(false);
  };

  // Quick login for test users
  const handleQuickLogin = async (type: 'alice' | 'bob') => {
    setQuickLoading(type);
    setErrors({});

    const result = await loginAsTestUser(type);

    if (result.success) {
      navigate('/network');
    } else {
      setErrors({ submit: result.error || 'Something went wrong' });
    }

    setQuickLoading(null);
  };

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center p-4 sm:p-6 font-sans overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-kizuna-green/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] bg-white rounded-[24px] shadow-2xl overflow-hidden shadow-kizuna-green/5 border border-slate-100"
      >
        {/* Header */}
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

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"><Phone size={18} /></div>
              <input
                type="tel"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="user@email.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-[14px] text-charcoal font-bold focus:outline-none focus:ring-2 focus:ring-kizuna-green/20 focus:border-kizuna-green transition-all placeholder:text-slate-300"
              />
            </div>
            {errors.phone && <p className="text-[10px] font-black text-red-500 uppercase ml-1 italic">{errors.phone}</p>}
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

          {/* Remember Me Checkbox */}
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

        {/* Quick Login - Test Users */}
        <div className="px-8 pb-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[9px]">
              <span className="px-4 bg-white text-slate-400 font-black uppercase tracking-widest">Quick Login (Dev)</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {/* Alice - Asker */}
            <button
              onClick={() => handleQuickLogin('alice')}
              disabled={quickLoading !== null}
              className="flex flex-col items-center gap-2 p-4 rounded-[14px] border-2 border-slate-100 transition-all hover:border-kizuna-green hover:bg-slate-50 disabled:opacity-50 bg-white"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-kizuna-green">
                <img
                  src={TEST_USER_ALICE.avatar}
                  alt={TEST_USER_ALICE.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <p className="font-black text-charcoal text-xs uppercase">{TEST_USER_ALICE.name.split(' ')[0]}</p>
                <p className="text-[9px] text-slate-400 flex items-center justify-center gap-1 font-black uppercase tracking-wider">
                  <User size={10} /> Asker
                </p>
              </div>
              {quickLoading === 'alice' && (
                <Loader2 size={14} className="animate-spin text-kizuna-green" />
              )}
            </button>

            {/* Bob - Supporter */}
            <button
              onClick={() => handleQuickLogin('bob')}
              disabled={quickLoading !== null}
              className="flex flex-col items-center gap-2 p-4 rounded-[14px] border-2 border-slate-100 transition-all hover:border-kizuna-green hover:bg-slate-50 disabled:opacity-50 bg-white"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
                <img
                  src={TEST_USER_BOB.avatar}
                  alt={TEST_USER_BOB.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <p className="font-black text-charcoal text-xs uppercase">{TEST_USER_BOB.name.split(' ')[0]}</p>
                <p className="text-[9px] text-slate-400 flex items-center justify-center gap-1 font-black uppercase tracking-wider">
                  <Briefcase size={10} /> Supporter
                </p>
              </div>
              {quickLoading === 'bob' && (
                <Loader2 size={14} className="animate-spin text-kizuna-green" />
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
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

