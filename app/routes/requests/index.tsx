// Browse Requests - Offer Support
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Input, Avatar } from '~/components/ui';
import { fetchOpenRequests, fetchAllCategories, fetchUserById, fetchCurrentUser } from '~/mocks/services';
import type { Request, Category, User } from '~/mocks/store';
import {
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  Clock,
  AlertCircle,
  Sparkles,
  X,
} from 'lucide-react';

export function meta() {
  return [{ title: 'Browse Requests - KIZUNA' }];
}

export default function BrowseRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function loadData() {
      // Check authentication first
      const userRes = await fetchCurrentUser();
      if (!userRes.success || !userRes.user) {
        navigate('/auth/login');
        return;
      }

      // Store current user
      setCurrentUser(userRes.user);

      const [reqRes, catRes] = await Promise.all([
        fetchOpenRequests(),
        fetchAllCategories(),
      ]);
      if (reqRes.success) {
        setRequests(reqRes.requests || []);
        // Fetch asker info for each request
        const askerIds = [...new Set((reqRes.requests || []).map((r) => r.askerId))];
        const userMap: Record<string, User> = {};
        await Promise.all(
          askerIds.map(async (id) => {
            const res = await fetchUserById(id);
            if (res.success && res.user) userMap[id] = res.user;
          })
        );
        setUsers(userMap);
      }
      if (catRes.success) setCategories(catRes.categories || []);
      setLoading(false);
    }
    loadData();
  }, [navigate]);

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      !searchQuery ||
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || req.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-washi-beige flex items-center justify-center">
        <span className="text-4xl text-kizuna-green animate-pulse" style={{ fontFamily: 'serif' }}>絆</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-washi-beige">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft size={20} className="text-charcoal" />
          </button>
          <h1 className="font-semibold text-charcoal flex-1">Offer Support</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg ${showFilters ? 'bg-kizuna-green/10 text-kizuna-green' : ''}`}
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto px-4 pb-3">
          <Input
            type="search"
            placeholder="Search requests..."
            icon={<Search size={18} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-gray-100"
            >
              <div className="max-w-2xl mx-auto px-4 py-3">
                <p className="text-xs text-charcoal-muted mb-2">Filter by category</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-kizuna-green text-white'
                          : 'bg-gray-100 text-charcoal hover:bg-gray-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="px-3 py-1.5 rounded-full text-sm bg-red-50 text-red-500 flex items-center gap-1"
                    >
                      <X size={14} /> Clear
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4">
        <p className="text-sm text-charcoal-muted mb-4">
          {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} in your area
        </p>

        {/* Request List */}
        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <Card className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-charcoal-muted" />
              </div>
              <h3 className="font-semibold text-charcoal mb-1">No requests found</h3>
              <p className="text-sm text-charcoal-muted">
                {searchQuery || selectedCategory
                  ? 'Try adjusting your filters'
                  : 'Check back later for new requests'}
              </p>
            </Card>
          ) : (
            filteredRequests.map((req, i) => {
              const asker = users[req.askerId];
              const category = categories.find((c) => c.id === req.categoryId);

              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={`/requests/${req.id}`}>
                    <Card hover className="cursor-pointer">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={asker?.avatar}
                            name={asker?.name || 'User'}
                            size="sm"
                            verified={asker?.verified}
                          />
                          <div>
                            <p className="text-sm font-medium text-charcoal">
                              {asker?.name || 'Community Member'}
                            </p>
                            <p className="text-xs text-charcoal-muted flex items-center gap-1">
                              <Clock size={10} />
                              {getTimeAgo(req.createdAt)}
                            </p>
                          </div>
                        </div>
                        {req.urgent && (
                          <span className="flex items-center gap-1 text-xs bg-red-50 text-red-500 px-2 py-1 rounded-full">
                            <AlertCircle size={12} />
                            Urgent
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <h3 className="font-semibold text-charcoal mb-1">{req.title}</h3>
                      <p className="text-sm text-charcoal-muted line-clamp-2 mb-3">
                        {req.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-3 text-xs text-charcoal-muted">
                          <span
                            className="flex items-center gap-1 px-2 py-1 rounded-full"
                            style={{ backgroundColor: `${category?.color}15`, color: category?.color }}
                          >
                            <Sparkles size={10} />
                            {category?.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {req.location.address.split(',')[0]}
                          </span>
                        </div>
                        <span className="text-lg font-bold text-kizuna-green">
                          UGX {req.budget.toLocaleString()}
                        </span>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}

