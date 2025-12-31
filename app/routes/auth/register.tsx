// Register Screen - Join the community
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Button, Input } from '~/components/ui';
import { User, Phone, Mail, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // Simulate registration
    await new Promise((r) => setTimeout(r, 1000));
    navigate('/auth/verify', { state: { identifier: formData.phone, method: 'phone', isNew: true } });
    setLoading(false);
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
          <h1 className="text-2xl font-bold text-charcoal">Join the community</h1>
          <p className="text-charcoal-muted mt-2">
            Start building bonds with your neighbors
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            type="text"
            label="Full Name"
            placeholder="What should we call you?"
            value={formData.name}
            onChange={handleChange('name')}
            icon={<User size={18} />}
            error={errors.name}
            required
          />

          <Input
            type="tel"
            label="Phone Number"
            placeholder="+234 801 234 5678"
            value={formData.phone}
            onChange={handleChange('phone')}
            icon={<Phone size={18} />}
            error={errors.phone}
            hint="We'll send you a verification code"
            required
          />

          <Input
            type="email"
            label="Email (optional)"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange('email')}
            icon={<Mail size={18} />}
            error={errors.email}
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={loading}
            icon={<ArrowRight size={18} />}
            iconPosition="right"
          >
            Create Account
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-charcoal-muted">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-kizuna-green font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Terms */}
        <p className="mt-6 text-xs text-charcoal-muted text-center">
          By creating an account, you agree to our{' '}
          <a href="#" className="underline">Terms of Service</a> and{' '}
          <a href="#" className="underline">Privacy Policy</a>
        </p>
      </motion.div>
    </div>
  );
}

