// Profile View - Public profile display
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Button, Card, Avatar } from '~/components/ui';
import { Badge, BadgeList } from '~/components/badges';
import { fetchCurrentUser, fetchUserBadges } from '~/mocks/services';
import type { User } from '~/mocks/store';
import type { Badge as BadgeType } from '~/mocks/data/badges';
import {
  ArrowLeft,
  MapPin,
  Star,
  Calendar,
  Shield,
  Edit2,
  Settings,
  ChevronRight,
  Heart,
} from 'lucide-react';

export function meta() {
  return [{ title: 'Profile - KIZUNA' }];
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [userRes, badgeRes] = await Promise.all([
        fetchCurrentUser(),
        fetchUserBadges('user-001'),
      ]);

      // Check if user is authenticated
      if (!userRes.success || !userRes.user) {
        navigate('/auth/login');
        return;
      }

      if (userRes.success) setUser(userRes.user!);
      if (badgeRes.success) setBadges(badgeRes.badges || []);
      setLoading(false);
    }
    loadData();
  }, [navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-washi-beige flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl text-kizuna-green animate-pulse" style={{ fontFamily: 'serif' }}>絆</span>
        </div>
      </div>
    );
  }

  const trustLabel = ['Newcomer', 'Member', 'Trusted', 'Verified', 'Community Pillar'][user.trustLevel - 1];

  return (
    <div className="min-h-screen bg-washi-beige">
      {/* Header */}
      <header className="bg-kizuna-green text-white">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <div className="flex gap-2">
              <Link to="/profile/edit" className="p-2 hover:bg-white/10 rounded-lg">
                <Edit2 size={20} />
              </Link>
              <Link to="/profile/settings" className="p-2 hover:bg-white/10 rounded-lg">
                <Settings size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <div className="max-w-2xl mx-auto px-4 pb-8 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Avatar
              src={user.avatar}
              name={user.name}
              size="xl"
              verified={user.verified}
              className="mx-auto border-4 border-white shadow-lg"
            />
          </motion.div>
          <h1 className="text-2xl font-bold mt-4">{user.name}</h1>
          <p className="text-white/80 mt-1 flex items-center justify-center gap-1">
            <MapPin size={14} />
            {user.location.address}
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 -mt-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="text-center">
            <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
              <Star size={18} className="fill-yellow-500" />
              <span className="text-xl font-bold text-charcoal">{user.rating}</span>
            </div>
            <p className="text-xs text-charcoal-muted">Rating</p>
          </Card>
          <Card className="text-center">
            <div className="text-xl font-bold text-charcoal mb-1">{user.totalConnections}</div>
            <p className="text-xs text-charcoal-muted">Connections</p>
          </Card>
          <Card className="text-center">
            <div className="flex items-center justify-center gap-1 text-kizuna-green mb-1">
              <Shield size={18} />
              <span className="text-xl font-bold text-charcoal">{user.trustLevel}</span>
            </div>
            <p className="text-xs text-charcoal-muted">Trust Level</p>
          </Card>
        </div>

        {/* Trust Badge */}
        <Card className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-kizuna-green/10 flex items-center justify-center">
              <Shield className="text-kizuna-green" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-charcoal">{trustLabel}</h3>
              <p className="text-sm text-charcoal-muted">Trust level {user.trustLevel} of 5</p>
            </div>
            {user.verified && (
              <span className="text-xs bg-kizuna-green/10 text-kizuna-green px-2 py-1 rounded-full font-medium">
                Verified
              </span>
            )}
          </div>
        </Card>

        {/* Bio */}
        <Card className="mb-6">
          <h3 className="font-semibold text-charcoal mb-2">About</h3>
          <p className="text-charcoal-muted">{user.bio}</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-charcoal-muted">
            <Calendar size={14} />
            <span>Member since {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
        </Card>

        {/* Skills */}
        <Card className="mb-6">
          <h3 className="font-semibold text-charcoal mb-3">Skills & Expertise</h3>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 bg-washi-beige rounded-full text-sm text-charcoal capitalize"
              >
                {skill.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </Card>

        {/* Badges */}
        {badges.length > 0 && (
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-charcoal">Badges Earned</h3>
              <Link to="/profile/badges" className="text-sm text-kizuna-green flex items-center gap-1">
                See all <ChevronRight size={16} />
              </Link>
            </div>
            <BadgeList badges={badges.slice(0, 6)} size="md" />
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-charcoal-muted">
                <Heart size={14} className="text-kizuna-green" />
                <span>{user.xp.toLocaleString()} XP earned</span>
              </div>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="pb-8">
          <Link to="/profile/edit">
            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

