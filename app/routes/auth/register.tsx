import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Phone, Mail, ArrowRight, ArrowLeft, Camera,
  MapPin, Sparkles, Check, Shield, Info, Loader2, Plus, Image as ImageIcon
} from 'lucide-react';
import { register } from '~/mocks/services/authService';
import { uploadToCloudinary } from '~/lib/cloudinary';

const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jabari',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sheba',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Kofi',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Nala',
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    avatar: AVATARS[0],
    lat: 0.3476,
    lng: 32.5825,
    role: 'individual' as const
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.phone) newErrors.phone = 'Phone is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleGetLocation = () => {
    setGettingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }));
        setGettingLocation(false);
      }, (error) => {
        console.error("Error getting location:", error);
        setGettingLocation(false);
      });
    } else {
      setGettingLocation(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, avatar: url }));
    } catch (err) {
      console.error("Upload failed", err);
      setErrors(prev => ({ ...prev, avatar: "Upload failed. Try again." }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await register(formData);
    if (res.success) {
      // In a real app we'd redirect to verify or dashboard
      // For now, let's go straight to the network
      navigate('/network');
    } else {
      setErrors({ submit: res.error || 'Registration failed' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center p-4 sm:p-6 font-sans overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-kizuna-green/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] bg-white rounded-[24px] shadow-2xl overflow-hidden shadow-kizuna-green/5 border border-slate-100 flex flex-col min-h-[600px]"
      >
        {/* Header / Progress */}
        <div className="p-8 pb-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-kizuna-green flex items-center justify-center text-white font-black text-lg">絆</div>
              <span className="font-black text-charcoal tracking-widest text-sm uppercase">Kizuna</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3].map(s => (
                <div key={s} className={`h-1 rounded-full transition-all duration-500 ${step >= s ? 'w-8 bg-kizuna-green' : 'w-2 bg-slate-100'}`} />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-1"
            >
              <h1 className="text-2xl font-black text-charcoal uppercase tracking-tight">
                {step === 1 && "Create your identity"}
                {step === 2 && "Personalize your profile"}
                {step === 3 && "Secure your location"}
              </h1>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">
                {step === 1 && "Start your journey in the network"}
                {step === 2 && "Let the community know who you are"}
                {step === 3 && "So neighbors can find and help you"}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-8 pt-4 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"><User size={18} /></div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="What should we call you?"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-[14px] text-charcoal font-bold focus:outline-none focus:ring-2 focus:ring-kizuna-green/20 focus:border-kizuna-green transition-all placeholder:text-slate-300"
                    />
                  </div>
                  {errors.name && <p className="text-[10px] font-black text-red-500 uppercase ml-1 italic">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"><Phone size={18} /></div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+256 700 000 000"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-[14px] text-charcoal font-bold focus:outline-none focus:ring-2 focus:ring-kizuna-green/20 focus:border-kizuna-green transition-all placeholder:text-slate-300"
                    />
                  </div>
                  {errors.phone && <p className="text-[10px] font-black text-red-500 uppercase ml-1 italic">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email (Optional)</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"><Mail size={18} /></div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-[14px] text-charcoal font-bold focus:outline-none focus:ring-2 focus:ring-kizuna-green/20 focus:border-kizuna-green transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">Pick your Avatar or Upload</label>
                  <div className="flex flex-wrap justify-center gap-3">
                    <label className={`w-14 h-14 rounded-full border-2 ${!AVATARS.includes(formData.avatar) ? 'border-kizuna-green' : 'border-dashed border-slate-200'} relative overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-kizuna-green transition-all ${uploading ? 'animate-pulse' : ''}`}>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />

                      {uploading ? (
                        <Loader2 size={16} className="animate-spin text-kizuna-green" />
                      ) : !AVATARS.includes(formData.avatar) ? (
                        <>
                          <img src={formData.avatar} className="w-full h-full object-cover" alt="Custom avatar" />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Camera size={14} className="text-white" />
                          </div>
                        </>
                      ) : (
                        <Camera size={16} className={errors.avatar ? 'text-red-400' : 'text-slate-300'} />
                      )}
                    </label>

                    {AVATARS.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData({ ...formData, avatar: url })}
                        disabled={uploading}
                        className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all p-1 bg-slate-50 ${formData.avatar === url ? 'border-kizuna-green scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                      >
                        <img src={url} className="w-full h-full object-cover rounded-full" alt="" />
                      </button>
                    ))}
                  </div>
                  {errors.avatar && <p className="text-[10px] font-black text-red-500 uppercase text-center mt-2 italic">{errors.avatar}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    placeholder="Tell your neighbors how you can help or what you do..."
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[14px] text-charcoal font-bold focus:outline-none focus:ring-2 focus:ring-kizuna-green/20 focus:border-kizuna-green transition-all placeholder:text-slate-300 resize-none text-sm leading-relaxed"
                  />
                  <div className="flex justify-between items-center text-[8px] font-black text-slate-300 uppercase tracking-tighter">
                    <span>Be authentic & clear</span>
                    <span>{formData.bio.length} / 200</span>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-[18px] text-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto text-kizuna-green">
                    <MapPin size={32} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-charcoal uppercase tracking-tight">Visualizing your node</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-bold uppercase tracking-tighter">We'll place your connection point on the grid. neighbors will see your approximate location.</p>
                  </div>

                  {formData.lat !== 0 && (
                    <div className="flex justify-center gap-4 text-[9px] font-black text-kizuna-green bg-white py-2 px-4 rounded-full border border-slate-100 uppercase tracking-widest shadow-sm">
                      <span>LAT: {formData.lat.toFixed(4)}</span>
                      <span>LNG: {formData.lng.toFixed(4)}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={gettingLocation}
                    className="w-full py-4 bg-charcoal text-white rounded-[14px] font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-2 group border border-black/10 shadow-xl"
                  >
                    {gettingLocation ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} className="group-hover:translate-y-[-2px] transition-transform" />}
                    {gettingLocation ? "Locating..." : "Auto-detect Location"}
                  </button>
                </div>

                <div className="flex items-center gap-3 p-4 bg-kizuna-green/5 border border-kizuna-green/10 rounded-[14px]">
                  <div className="p-2 bg-white rounded-lg text-kizuna-green shadow-sm"><Shield size={16} /></div>
                  <p className="text-[9px] text-kizuna-green font-black uppercase tracking-tight leading-tight">Your exact position is never shared. we secure your privacy first.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="p-8 pt-0 mt-auto">
          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-4 bg-slate-50 text-slate-400 rounded-[14px] hover:bg-slate-100 transition-all font-black text-xs uppercase tracking-widest"
              >
                <ArrowLeft size={18} />
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={uploading}
                className={`flex-1 py-4 text-white rounded-[14px] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg ${uploading ? 'bg-slate-300 cursor-not-allowed' : 'bg-kizuna-green hover:brightness-110 shadow-kizuna-green/10'}`}
              >
                {uploading ? (
                  <>Processing... <Loader2 size={18} className="animate-spin" /></>
                ) : (
                  <>Continue <ArrowRight size={18} /></>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || uploading}
                className={`flex-1 py-4 text-white rounded-[14px] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl ${loading || uploading ? 'bg-slate-300' : 'bg-kizuna-green hover:brightness-110 shadow-kizuna-green/20'}`}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                {loading ? "Establishing Connection..." : "Join the Grid"}
              </button>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
              Already have an account? <Link to="/auth/login" className="text-kizuna-green hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
