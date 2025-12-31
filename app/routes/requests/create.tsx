// Create Request - Ask for Help flow
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Button, Card, Input, Modal, useToastActions } from '~/components/ui';
import { fetchAllCategories, createRequest } from '~/mocks/services';
import type { Category } from '~/mocks/store';
import {
  ArrowLeft,
  MapPin,
  Clock,
  AlertCircle,
  ChevronRight,
  Check,
  Sparkles,
} from 'lucide-react';

export function meta() {
  return [{ title: 'Ask for Help - KIZUNA' }];
}

export default function CreateRequestPage() {
  const navigate = useNavigate();
  const toast = useToastActions();
  const [categories, setCategories] = useState<Category[]>([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    categoryId: '',
    subcategory: '',
    title: '',
    description: '',
    budget: '',
    urgent: false,
    deliverable: false,
    location: {
      lat: 6.5244,
      lng: 3.3792,
      address: 'Victoria Island, Lagos',
    },
    scheduledFor: '',
  });

  useEffect(() => {
    fetchAllCategories().then((res) => {
      if (res.success) setCategories(res.categories || []);
    });
  }, []);

  const selectedCategory = categories.find((c) => c.id === formData.categoryId);

  const handleCategorySelect = (catId: string) => {
    setFormData({ ...formData, categoryId: catId, subcategory: '' });
  };

  const handleSubcategorySelect = (sub: string) => {
    setFormData({ ...formData, subcategory: sub });
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.budget) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    const result = await createRequest({
      ...formData,
      budget: parseInt(formData.budget),
    });

    if (result.success) {
      toast.success('Request posted!', 'Your community will see it shortly');
      navigate('/home');
    } else {
      toast.error('Failed to post', result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-washi-beige">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-4">
          <button onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))} className="p-2 -ml-2">
            <ArrowLeft size={20} className="text-charcoal" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-charcoal">Ask for Help</h1>
            <p className="text-xs text-charcoal-muted">Step {step} of 3</p>
          </div>
        </div>
        {/* Progress */}
        <div className="h-1 bg-gray-100">
          <motion.div
            className="h-full bg-kizuna-green"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Step 1: Category Selection */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-bold text-charcoal mb-2">What do you need help with?</h2>
            <p className="text-charcoal-muted mb-6">Choose a category that best fits your request</p>

            {!formData.categoryId ? (
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <Card
                    key={cat.id}
                    hover
                    className="cursor-pointer"
                    onClick={() => handleCategorySelect(cat.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${cat.color}15` }}
                      >
                        <Sparkles size={18} style={{ color: cat.color }} />
                      </div>
                      <span className="font-medium text-charcoal">{cat.name}</span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setFormData({ ...formData, categoryId: '', subcategory: '' })}
                  className="text-sm text-kizuna-green mb-4 flex items-center gap-1"
                >
                  <ArrowLeft size={14} /> Change category
                </button>
                <h3 className="font-semibold text-charcoal mb-3">
                  {selectedCategory?.name} - Choose a type
                </h3>
                <div className="space-y-2">
                  {selectedCategory?.subcategories.map((sub) => (
                    <Card
                      key={sub}
                      hover
                      className="cursor-pointer"
                      onClick={() => handleSubcategorySelect(sub)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-charcoal">{sub}</span>
                        <ChevronRight size={18} className="text-charcoal-muted" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-bold text-charcoal mb-2">Tell us more</h2>
              <p className="text-charcoal-muted">
                {selectedCategory?.name} → {formData.subcategory}
              </p>
            </div>

            <Input
              label="Title"
              placeholder="What do you need? (e.g., Need a driver to the airport)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Description
              </label>
              <textarea
                placeholder="Provide details: when, where, any specific requirements..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-charcoal placeholder-charcoal-muted/50 focus:outline-none focus:ring-2 focus:ring-kizuna-green/20 focus:border-kizuna-green resize-none"
                rows={4}
                required
              />
            </div>

            <Input
              type="number"
              label="Budget (UGX)"
              placeholder="How much are you offering?"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              hint="This helps helpers understand the scope"
              required
            />

            <Button onClick={() => setStep(3)} className="w-full" size="lg">
              Continue
            </Button>
          </motion.div>
        )}

        {/* Step 3: Options & Confirm */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-bold text-charcoal mb-2">Almost done!</h2>
              <p className="text-charcoal-muted">Set options and review your request</p>
            </div>

            {/* Urgent Toggle */}
            <Card>
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <AlertCircle size={20} className="text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium text-charcoal">Urgent Request</p>
                    <p className="text-sm text-charcoal-muted">Need help ASAP</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.urgent}
                  onChange={(e) => setFormData({ ...formData, urgent: e.target.checked })}
                  className="w-5 h-5 text-kizuna-green rounded"
                />
              </label>
            </Card>

            {/* Location */}
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-aizome-blue/10 flex items-center justify-center">
                  <MapPin size={20} className="text-aizome-blue" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-charcoal">Location</p>
                  <p className="text-sm text-charcoal-muted">{formData.location.address}</p>
                </div>
                <button className="text-sm text-kizuna-green">Change</button>
              </div>
            </Card>

            {/* Summary */}
            <Card className="bg-washi-beige border-none">
              <h3 className="font-semibold text-charcoal mb-3">Request Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Category</span>
                  <span className="text-charcoal">{selectedCategory?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Type</span>
                  <span className="text-charcoal">{formData.subcategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Budget</span>
                  <span className="text-charcoal font-semibold">UGX {parseInt(formData.budget || '0').toLocaleString()}</span>
                </div>
                {formData.urgent && (
                  <div className="flex justify-between">
                    <span className="text-charcoal-muted">Priority</span>
                    <span className="text-red-500 font-medium">Urgent</span>
                  </div>
                )}
              </div>
            </Card>

            <Button
              onClick={handleSubmit}
              className="w-full"
              size="lg"
              loading={loading}
              icon={<Check size={18} />}
            >
              Post Request
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
}

