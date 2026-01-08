// Home Dashboard - Waabi-inspired bento grid with media
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Avatar } from '~/components/ui';
import {
  fetchCurrentUser,
  fetchOpenRequests,
  fetchAllCategories,
  fetchUserBadges,
  logout,
} from '~/mocks/services';
import type { User, Category, Request } from '~/mocks/store';
import type { Badge as BadgeType } from '~/mocks/data/badges';
import {
  Plus,
  Bell,
  MapPin,
  ArrowRight,
  Search,
  Heart,
  Users,
  Shield,
  Star,
  Image,
  Zap,
  MessageCircle,
  LogOut,
} from 'lucide-react';

// Kizuna brand colors
const colors = {
  green: '#3C8F5A',
  greenDark: '#2D6B44',
  beige: '#F4EDE2',
  beigeDark: '#E8DFD0',
  charcoal: '#252525',
  blue: '#264653',
};

export function meta() {
  return [
    { title: 'KIZUNA - Home' },
    { name: 'description', content: 'Your community dashboard' },
  ];
}

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [userRes, reqRes, catRes, badgeRes] = await Promise.all([
        fetchCurrentUser(),
        fetchOpenRequests(),
        fetchAllCategories(),
        fetchUserBadges('user-001'), // Current user ID
      ]);

      // Check if user is authenticated
      if (!userRes.success || !userRes.user) {
        navigate('/auth/login');
        return;
      }

      if (userRes.success) setUser(userRes.user!);
      if (reqRes.success) setRequests(reqRes.requests || []);
      if (catRes.success) setCategories(catRes.categories || []);
      if (badgeRes.success) setBadges(badgeRes.badges || []);
      setLoading(false);
    }
    loadData();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F4EDE2' }}>
        <span className="text-4xl animate-pulse" style={{ fontFamily: 'serif', color: '#252525' }}>絆</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4EDE2' }}>
      {/* Minimal Header */}
      <header className="sticky top-0 z-50" style={{ backgroundColor: '#F4EDE2' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl" style={{ fontFamily: 'serif', color: '#252525' }}>絆</span>
            <span className="text-sm font-medium tracking-[0.2em]" style={{ color: '#252525' }}>KIZUNA</span>
          </Link>
          <div className="flex items-center gap-6">
            <button className="p-2 relative">
              <Bell size={20} style={{ color: '#252525' }} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2"
              >
                <Avatar src={user?.avatar} name={user?.name || 'User'} size="sm" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                  />
                  {/* Menu */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-12 z-50 w-56 rounded-xl shadow-lg border overflow-hidden"
                    style={{ backgroundColor: 'white', borderColor: colors.beigeDark }}
                  >
                    {/* User Info */}
                    <div className="p-4 border-b" style={{ borderColor: colors.beigeDark }}>
                      <p className="font-medium" style={{ color: colors.charcoal }}>{user?.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#6B6B6B' }}>{user?.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowMenu(false)}
                      >
                        <Users size={16} style={{ color: '#6B6B6B' }} />
                        <span className="text-sm" style={{ color: colors.charcoal }}>Profile</span>
                      </Link>
                      <Link
                        to="/requests"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowMenu(false)}
                      >
                        <Search size={16} style={{ color: '#6B6B6B' }} />
                        <span className="text-sm" style={{ color: colors.charcoal }}>Browse Requests</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t py-2" style={{ borderColor: colors.beigeDark }}>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} style={{ color: '#EF4444' }} />
                        <span className="text-sm" style={{ color: '#EF4444' }}>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-7xl font-light leading-tight mb-6" style={{ color: colors.charcoal }}>
              Built to help.<br />
              <span className="font-normal">Born to connect.</span>
            </h1>
          </motion.div>
        </section>

        {/* Bento Grid - Hero Media Section */}
        <section className="grid grid-cols-12 gap-3 mb-6">
          {/* Large text block */}
          <motion.div
            className="col-span-12 md:col-span-4 row-span-2 p-6 rounded-2xl flex flex-col justify-between min-h-[280px]"
            style={{ backgroundColor: colors.charcoal }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            <p className="text-sm" style={{ color: '#9CA3AF' }}>
              Kizuna connects people who need help with those who can provide it.
              A relational network built on trust, community, and human connection.
            </p>
            <div>
              <p className="text-3xl font-light" style={{ color: colors.beige }}>
                Real people.<br />Real support.
              </p>
            </div>
          </motion.div>

          {/* Image placeholder 1 */}
          <motion.div
            className="col-span-6 md:col-span-4 rounded-2xl flex items-center justify-center min-h-[135px]"
            style={{ backgroundColor: colors.beigeDark }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          >
            <div className="text-center">
              <Image size={32} style={{ color: '#9CA3AF' }} className="mx-auto mb-2" />
              <span className="text-xs" style={{ color: '#9CA3AF' }}>Community photo</span>
            </div>
          </motion.div>

          {/* Image placeholder 2 */}
          <motion.div
            className="col-span-6 md:col-span-4 rounded-2xl flex items-center justify-center min-h-[135px]"
            style={{ backgroundColor: colors.green }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          >
            <div className="text-center">
              <Users size={32} style={{ color: 'white' }} className="mx-auto mb-2" />
              <span className="text-xs font-medium" style={{ color: 'white' }}>500+ Connections</span>
            </div>
          </motion.div>

          {/* Image placeholder 3 */}
          <motion.div
            className="col-span-4 md:col-span-2 rounded-2xl flex items-center justify-center min-h-[135px]"
            style={{ backgroundColor: 'white', border: `1px solid ${colors.beigeDark}` }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          >
            <Heart size={24} style={{ color: colors.green }} />
          </motion.div>

          {/* Image placeholder 4 */}
          <motion.div
            className="col-span-8 md:col-span-6 rounded-2xl flex items-center justify-center min-h-[135px]"
            style={{ backgroundColor: colors.beigeDark }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          >
            <div className="text-center">
              <Image size={32} style={{ color: '#9CA3AF' }} className="mx-auto mb-2" />
              <span className="text-xs" style={{ color: '#9CA3AF' }}>Helper in action</span>
            </div>
          </motion.div>
        </section>

        {/* Action Cards Row */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <Link to="/requests/create">
            <motion.div
              className="p-8 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] min-h-[200px] flex flex-col justify-between"
              style={{ backgroundColor: colors.charcoal }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs tracking-widest" style={{ color: '#6B6B6B' }}>01</span>
                <Plus size={24} style={{ color: colors.beige }} />
              </div>
              <div>
                <h2 className="text-3xl font-light mb-2" style={{ color: colors.beige }}>Ask for help</h2>
                <div className="flex items-center gap-2" style={{ color: colors.beige }}>
                  <span className="text-sm">Get started</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </motion.div>
          </Link>

          <Link to="/requests">
            <motion.div
              className="p-8 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] min-h-[200px] flex flex-col justify-between"
              style={{ backgroundColor: 'white', border: `1px solid ${colors.beigeDark}` }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs tracking-widest" style={{ color: '#6B6B6B' }}>02</span>
                <Search size={24} style={{ color: colors.charcoal }} />
              </div>
              <div>
                <h2 className="text-3xl font-light mb-2" style={{ color: colors.charcoal }}>Offer support</h2>
                <div className="flex items-center gap-2" style={{ color: colors.charcoal }}>
                  <span className="text-sm">Browse requests</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </motion.div>
          </Link>
        </section>

        {/* Features Bento Grid */}
        <section className="mb-6">
          <h2 className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: '#6B6B6B' }}>
            Why Kizuna
          </h2>
          <div className="grid grid-cols-12 gap-3">
            {/* Feature 1 - Large */}
            <motion.div
              className="col-span-12 md:col-span-8 p-8 rounded-2xl min-h-[300px] flex flex-col justify-between"
              style={{ backgroundColor: colors.green }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            >
              <div className="flex items-center justify-center flex-1">
                <div className="text-center">
                  <Image size={48} style={{ color: 'rgba(255,255,255,0.5)' }} className="mx-auto mb-3" />
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Feature showcase image</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-light mb-1" style={{ color: 'white' }}>
                  Trust-based connections
                </h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Every helper is verified. Every connection is meaningful.
                </p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="col-span-6 md:col-span-4 p-6 rounded-2xl flex flex-col justify-between min-h-[145px]"
              style={{ backgroundColor: colors.charcoal }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            >
              <Shield size={24} style={{ color: colors.green }} />
              <p className="text-sm font-medium" style={{ color: colors.beige }}>Verified helpers</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="col-span-6 md:col-span-4 p-6 rounded-2xl flex flex-col justify-between min-h-[145px]"
              style={{ backgroundColor: 'white', border: `1px solid ${colors.beigeDark}` }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            >
              <Star size={24} style={{ color: colors.green }} />
              <p className="text-sm font-medium" style={{ color: colors.charcoal }}>Earn badges</p>
            </motion.div>

            {/* Image placeholder */}
            <motion.div
              className="col-span-12 md:col-span-4 rounded-2xl flex items-center justify-center min-h-[145px]"
              style={{ backgroundColor: colors.beigeDark }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            >
              <div className="text-center">
                <Image size={32} style={{ color: '#9CA3AF' }} className="mx-auto mb-2" />
                <span className="text-xs" style={{ color: '#9CA3AF' }}>Happy community</span>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="col-span-12 md:col-span-4 p-6 rounded-2xl"
              style={{ backgroundColor: colors.blue }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
            >
              <p className="text-4xl font-light mb-1" style={{ color: 'white' }}>4.9★</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Average rating</p>
            </motion.div>
          </div>
        </section>

        {/* Nearby Requests */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium tracking-widest uppercase" style={{ color: '#6B6B6B' }}>Nearby requests</h2>
            <Link to="/requests" className="text-sm flex items-center gap-1" style={{ color: colors.charcoal }}>
              See all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {requests.slice(0, 3).map((req, i) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.05 }}
              >
                <Link to={`/requests/${req.id}`}>
                  <div
                    className="p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] h-full"
                    style={{ backgroundColor: 'white', border: `1px solid ${colors.beigeDark}` }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-lg font-semibold" style={{ color: colors.charcoal }}>
                        UGX {req.budget.toLocaleString()}
                      </span>
                      {req.urgent && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                          Urgent
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium mb-1" style={{ color: colors.charcoal }}>{req.title}</h3>
                    <p className="text-sm line-clamp-2 mb-3" style={{ color: '#6B6B6B' }}>{req.description}</p>
                    <div className="flex items-center gap-1 text-xs" style={{ color: '#9CA3AF' }}>
                      <MapPin size={12} />
                      {req.location.address.split(',')[0]}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* The Kizuna Way - Image with text overlay */}
        <section className="mb-6">
          <div className="grid grid-cols-12 gap-3">
            {/* Large hero image with text overlay */}
            <motion.div
              className="col-span-12 md:col-span-8 rounded-2xl relative overflow-hidden min-h-[400px] flex items-end"
              style={{ backgroundColor: colors.charcoal }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
            >
              {/* Image placeholder background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <Image size={80} style={{ color: '#6B6B6B' }} />
              </div>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* Text content */}
              <div className="relative z-10 p-8">
                <h2 className="text-4xl md:text-5xl font-light mb-3" style={{ color: 'white' }}>
                  The Kizuna<br />way.
                </h2>
                <p className="text-sm max-w-md" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  More than a platform. A movement to strengthen communities through mutual support.
                </p>
              </div>
            </motion.div>

            {/* Side stats column */}
            <div className="col-span-12 md:col-span-4 flex flex-col gap-3">
              <motion.div
                className="flex-1 p-6 rounded-2xl flex flex-col justify-between"
                style={{ backgroundColor: colors.green }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }}
              >
                <Zap size={24} style={{ color: 'white' }} />
                <div>
                  <p className="text-3xl font-light" style={{ color: 'white' }}>24hr</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Average response time</p>
                </div>
              </motion.div>
              <motion.div
                className="flex-1 p-6 rounded-2xl flex flex-col justify-between"
                style={{ backgroundColor: 'white', border: `1px solid ${colors.beigeDark}` }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
              >
                <Users size={24} style={{ color: colors.green }} />
                <div>
                  <p className="text-3xl font-light" style={{ color: colors.charcoal }}>2,500+</p>
                  <p className="text-sm" style={{ color: '#6B6B6B' }}>Active community members</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Physical presence bento */}
        <section className="mb-6">
          <div className="grid grid-cols-12 gap-3">
            {/* Text block */}
            <motion.div
              className="col-span-12 md:col-span-4 p-8 rounded-2xl flex flex-col justify-between min-h-[200px]"
              style={{ backgroundColor: colors.beigeDark }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 }}
            >
              <p className="text-sm" style={{ color: '#6B6B6B' }}>How it works</p>
              <div>
                <h3 className="text-2xl font-light mb-2" style={{ color: colors.charcoal }}>
                  Real help,<br />real neighbors.
                </h3>
                <p className="text-sm" style={{ color: '#6B6B6B' }}>
                  Connect with verified helpers in your neighborhood.
                </p>
              </div>
            </motion.div>

            {/* Image with overlay */}
            <motion.div
              className="col-span-6 md:col-span-4 rounded-2xl relative overflow-hidden min-h-[200px]"
              style={{ backgroundColor: colors.charcoal }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <Image size={48} style={{ color: '#6B6B6B' }} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-xs font-medium" style={{ color: 'white' }}>Kampala, Uganda</p>
              </div>
            </motion.div>

            {/* Image placeholder */}
            <motion.div
              className="col-span-6 md:col-span-4 rounded-2xl relative overflow-hidden min-h-[200px]"
              style={{ backgroundColor: colors.blue }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15 }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <Image size={48} style={{ color: 'rgba(255,255,255,0.5)' }} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-xs font-medium" style={{ color: 'white' }}>Community meetup</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Dark section - Stories/Insights */}
        <section className="mb-6">
          <motion.div
            className="rounded-2xl p-8 md:p-12"
            style={{ backgroundColor: colors.charcoal }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-medium tracking-widest uppercase" style={{ color: '#6B6B6B' }}>
                Community stories
              </h2>
              <Link to="/stories" className="text-sm flex items-center gap-1" style={{ color: colors.beige }}>
                Read all <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Story card 1 */}
              <div className="group cursor-pointer">
                <div
                  className="rounded-xl overflow-hidden mb-4 relative min-h-[180px] flex items-center justify-center"
                  style={{ backgroundColor: '#3a3a3a' }}
                >
                  <Image size={32} style={{ color: '#6B6B6B' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <p className="text-xs mb-2" style={{ color: '#6B6B6B' }}>Featured</p>
                <h3 className="font-medium mb-2 group-hover:underline" style={{ color: colors.beige }}>
                  How Sarah built a network of 50 helpers in Kololo
                </h3>
                <p className="text-sm" style={{ color: '#9CA3AF' }}>
                  From asking for a ride to becoming a community pillar.
                </p>
              </div>

              {/* Story card 2 */}
              <div className="group cursor-pointer">
                <div
                  className="rounded-xl overflow-hidden mb-4 relative min-h-[180px] flex items-center justify-center"
                  style={{ backgroundColor: '#3a3a3a' }}
                >
                  <Image size={32} style={{ color: '#6B6B6B' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <p className="text-xs mb-2" style={{ color: '#6B6B6B' }}>Impact</p>
                <h3 className="font-medium mb-2 group-hover:underline" style={{ color: colors.beige }}>
                  "Kizuna helped me when no one else could"
                </h3>
                <p className="text-sm" style={{ color: '#9CA3AF' }}>
                  A single mother's story of community support.
                </p>
              </div>

              {/* Story card 3 */}
              <div className="group cursor-pointer">
                <div
                  className="rounded-xl overflow-hidden mb-4 relative min-h-[180px] flex items-center justify-center"
                  style={{ backgroundColor: '#3a3a3a' }}
                >
                  <Image size={32} style={{ color: '#6B6B6B' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <p className="text-xs mb-2" style={{ color: '#6B6B6B' }}>Business</p>
                <h3 className="font-medium mb-2 group-hover:underline" style={{ color: colors.beige }}>
                  Small businesses thriving through Kizuna
                </h3>
                <p className="text-sm" style={{ color: '#9CA3AF' }}>
                  Local entrepreneurs finding new customers daily.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Trusted by section */}
        <section className="mb-6">
          <div className="grid grid-cols-12 gap-3">
            <motion.div
              className="col-span-12 md:col-span-5 p-8 rounded-2xl"
              style={{ backgroundColor: 'white', border: `1px solid ${colors.beigeDark}` }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25 }}
            >
              <h3 className="text-2xl md:text-3xl font-light mb-4" style={{ color: colors.charcoal }}>
                Trusted by<br />the best in<br />the community.
              </h3>
              <p className="text-sm" style={{ color: '#6B6B6B' }}>
                Join thousands of Ugandans building stronger neighborhoods.
              </p>
            </motion.div>

            {/* Testimonial */}
            <motion.div
              className="col-span-12 md:col-span-7 p-8 rounded-2xl relative overflow-hidden min-h-[250px]"
              style={{ backgroundColor: colors.charcoal }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
            >
              <div className="absolute top-6 right-6 opacity-20">
                <MessageCircle size={60} style={{ color: colors.green }} />
              </div>
              <div className="flex flex-col justify-between h-full">
                <p className="text-lg md:text-xl font-light leading-relaxed max-w-lg" style={{ color: colors.beige }}>
                  "I found my math tutor through Kizuna. Now my son is top of his class. The trust system made all the difference."
                </p>
                <div className="flex items-center gap-3 mt-6">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.green }}
                  >
                    <span className="text-white text-sm font-medium">GA</span>
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: colors.beige }}>Grace Auma</p>
                    <p className="text-xs" style={{ color: '#6B6B6B' }}>Kamwokya, Kampala</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      {/* FULL WIDTH SECTION - Breaks out of container */}
      <section className="w-full mb-6">
        <motion.div
          className="relative overflow-hidden min-h-[450px] md:min-h-[550px] flex items-end"
          style={{ backgroundColor: colors.charcoal }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.35 }}
        >
          {/* Background image placeholder */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Image size={120} style={{ color: '#6B6B6B' }} />
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          {/* Content */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16 md:py-24">
            <div className="max-w-2xl">
              <p className="text-sm tracking-widest uppercase mb-4" style={{ color: colors.green }}>
                The Kizuna Promise
              </p>
              <h2 className="text-4xl md:text-6xl font-light mb-6 leading-tight" style={{ color: 'white' }}>
                Setting new<br />standards for<br />community.
              </h2>
              <p className="text-lg mb-8 max-w-lg" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Every connection is verified. Every helper is real. Every interaction builds trust that lasts.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/requests/create">
                  <button
                    className="px-8 py-3 rounded-full font-medium transition-all hover:scale-105"
                    style={{ backgroundColor: colors.green, color: 'white' }}
                  >
                    Ask for help
                  </button>
                </Link>
                <Link to="/requests">
                  <button
                    className="px-8 py-3 rounded-full font-medium transition-all hover:scale-105 border"
                    style={{ backgroundColor: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                  >
                    Explore requests
                  </button>
                </Link>
              </div>
            </div>
          </div>
          {/* Stats overlay on right */}
          <div className="hidden lg:block absolute right-16 bottom-16">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <p className="text-4xl font-light" style={{ color: 'white' }}>98%</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Satisfaction</p>
              </div>
              <div className="text-center p-6 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <p className="text-4xl font-light" style={{ color: 'white' }}>2.5K+</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Helpers</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Resume container */}
      <main className="max-w-7xl mx-auto px-6">

        {/* CTA Section with gradient */}
        <section className="mb-8">
          <motion.div
            className="p-10 md:p-16 rounded-2xl text-center relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${colors.green} 0%, #2d7a47 100%)` }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
              style={{ background: 'white', transform: 'translate(30%, -30%)' }}
            />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10"
              style={{ background: 'white', transform: 'translate(-30%, 30%)' }}
            />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-light mb-4" style={{ color: 'white' }}>
                Build community<br />with us.
              </h2>
              <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Join the relational network where neighbors become allies and community becomes connection.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/requests/create">
                  <button
                    className="px-8 py-3 rounded-full font-medium transition-all hover:scale-105"
                    style={{ backgroundColor: 'white', color: colors.green }}
                  >
                    Ask for help
                  </button>
                </Link>
                <Link to="/requests">
                  <button
                    className="px-8 py-3 rounded-full font-medium transition-all hover:scale-105 border"
                    style={{ backgroundColor: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                  >
                    Offer support
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t" style={{ borderColor: colors.beigeDark }}>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: '#9CA3AF' }}>© 2025 Kizuna</span>
            <span className="text-2xl" style={{ fontFamily: 'serif', color: colors.charcoal }}>絆</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
