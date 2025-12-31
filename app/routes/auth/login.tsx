// Login Screen - Phone/Email authentication
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Button, Input } from '~/components/ui';
import { Phone, Mail, ArrowRight, User, Briefcase } from 'lucide-react';
import { login, loginAsTestUser, TEST_USER_ALICE, TEST_USER_BOB } from '~/mocks/services';

export default function LoginPage() {
  const navigate = useNavigate();
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState<'alice' | 'bob' | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(identifier, authMethod);

    if (result.success) {
      // Navigate to OTP verification
      navigate('/auth/verify', { state: { identifier, method: authMethod } });
    } else {
      setError(result.error || 'Something went wrong');
    }

    setLoading(false);
  };

  // Quick login for test users
  const handleQuickLogin = async (type: 'alice' | 'bob') => {
    setQuickLoading(type);
    setError('');

    const result = await loginAsTestUser(type);

    if (result.success) {
      navigate('/home');
    } else {
      setError(result.error || 'Something went wrong');
    }

    setQuickLoading(null);
  };

  return (
    <div className="min-h-screen bg-washi-beige flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-4xl text-kizuna-green" style={{ fontFamily: 'serif' }}>絆</span>
            <span className="text-xl font-semibold text-charcoal tracking-wider">KIZUNA</span>
          </Link>
          <h1 className="text-2xl font-bold text-charcoal">Welcome back</h1>
          <p className="text-charcoal-muted mt-2">
            Sign in to connect with your community
          </p>
        </div>

        {/* Auth Method Toggle */}
        <div className="bg-white rounded-lg p-1 flex mb-6">
          <button
            type="button"
            onClick={() => setAuthMethod('phone')}
            className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
              authMethod === 'phone'
                ? 'bg-kizuna-green text-white'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <Phone size={16} className="inline mr-2" />
            Phone
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('email')}
            className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
              authMethod === 'email'
                ? 'bg-kizuna-green text-white'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <Mail size={16} className="inline mr-2" />
            Email
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type={authMethod === 'email' ? 'email' : 'tel'}
            label={authMethod === 'phone' ? 'Phone Number' : 'Email Address'}
            placeholder={authMethod === 'phone' ? '+234 801 234 5678' : 'you@example.com'}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            icon={authMethod === 'phone' ? <Phone size={18} /> : <Mail size={18} />}
            error={error}
            required
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={loading}
            icon={<ArrowRight size={18} />}
            iconPosition="right"
          >
            Continue
          </Button>
        </form>

        {/* Quick Login - Test Users */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-washi-beige text-charcoal-muted">Quick Login (Dev)</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {/* Alice - Asker */}
            <button
              onClick={() => handleQuickLogin('alice')}
              disabled={quickLoading !== null}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:border-kizuna-green hover:bg-white disabled:opacity-50"
              style={{ borderColor: '#E8DFD0', backgroundColor: 'rgba(255,255,255,0.5)' }}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-kizuna-green">
                <img
                  src={TEST_USER_ALICE.avatar}
                  alt={TEST_USER_ALICE.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <p className="font-medium text-charcoal text-sm">{TEST_USER_ALICE.name.split(' ')[0]}</p>
                <p className="text-xs text-charcoal-muted flex items-center justify-center gap-1">
                  <User size={10} /> Asker
                </p>
              </div>
              {quickLoading === 'alice' && (
                <span className="text-xs text-kizuna-green">Logging in...</span>
              )}
            </button>

            {/* Bob - Supporter */}
            <button
              onClick={() => handleQuickLogin('bob')}
              disabled={quickLoading !== null}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:border-kizuna-green hover:bg-white disabled:opacity-50"
              style={{ borderColor: '#E8DFD0', backgroundColor: 'rgba(255,255,255,0.5)' }}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-aizome-blue">
                <img
                  src={TEST_USER_BOB.avatar}
                  alt={TEST_USER_BOB.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <p className="font-medium text-charcoal text-sm">{TEST_USER_BOB.name.split(' ')[0]}</p>
                <p className="text-xs text-charcoal-muted flex items-center justify-center gap-1">
                  <Briefcase size={10} /> Supporter
                </p>
              </div>
              {quickLoading === 'bob' && (
                <span className="text-xs text-kizuna-green">Logging in...</span>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-charcoal-muted">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-kizuna-green font-medium hover:underline">
              Join the community
            </Link>
          </p>
        </div>

        {/* Terms */}
        <p className="mt-6 text-xs text-charcoal-muted text-center">
          By continuing, you agree to our{' '}
          <a href="#" className="underline">Terms of Service</a> and{' '}
          <a href="#" className="underline">Privacy Policy</a>
        </p>
      </motion.div>
    </div>
  );
}

