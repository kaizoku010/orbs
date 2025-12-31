// OTP Verification Screen
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import { Button, OtpInput } from '~/components/ui';
import { verifyOtp } from '~/mocks/services';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function VerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { identifier, method, isNew } = (location.state as { identifier?: string; method?: string; isNew?: boolean }) || {};

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!identifier) {
      navigate('/auth/login');
    }
  }, [identifier, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter the complete code');
      return;
    }

    setError('');
    setLoading(true);

    const result = await verifyOtp(identifier!, otp);

    if (result.success) {
      setVerified(true);
      // Wait for animation then navigate
      setTimeout(() => {
        navigate('/home');
      }, 1500);
    } else {
      setError(result.error || 'Invalid code');
    }

    setLoading(false);
  };

  const handleResend = () => {
    if (resendTimer === 0) {
      setResendTimer(30);
      // Simulate resending
      console.log('Resending OTP to', identifier);
    }
  };

  if (verified) {
    return (
      <div className="min-h-screen bg-washi-beige flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <CheckCircle size={80} className="text-kizuna-green mx-auto" />
          </motion.div>
          <h2 className="text-2xl font-bold text-charcoal mt-6">
            {isNew ? 'Welcome to KIZUNA!' : 'Welcome back!'}
          </h2>
          <p className="text-charcoal-muted mt-2">Taking you to your community...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-washi-beige flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-2 text-charcoal-muted hover:text-charcoal mb-8"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-charcoal">Verify your {method}</h1>
          <p className="text-charcoal-muted mt-2">
            We sent a 6-digit code to
          </p>
          <p className="font-medium text-charcoal mt-1">{identifier}</p>
        </div>

        {/* OTP Input */}
        <div className="mb-8">
          <OtpInput
            value={otp}
            onChange={setOtp}
            error={error}
          />
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          className="w-full"
          size="lg"
          loading={loading}
          disabled={otp.length !== 6}
        >
          Verify
        </Button>

        {/* Resend */}
        <div className="mt-6 text-center">
          {resendTimer > 0 ? (
            <p className="text-sm text-charcoal-muted">
              Resend code in <span className="font-medium">{resendTimer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-sm text-kizuna-green font-medium hover:underline"
            >
              Resend code
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

