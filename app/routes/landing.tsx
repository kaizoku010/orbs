// Landing Page - Hero, features, categories, CTA
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Button, Card, Avatar } from '~/components/ui';
import { fetchAllCategories, fetchNearbyCaptains } from '~/mocks/services';
import type { Category, User } from '~/mocks/store';
import { 
  ArrowRight, 
  MapPin, 
  Shield, 
  Users, 
  Star,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [captains, setCaptains] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [catRes, capRes] = await Promise.all([
        fetchAllCategories(),
        fetchNearbyCaptains(6.5244, 3.3792),
      ]);
      if (catRes.success) setCategories(catRes.categories || []);
      if (capRes.success) setCaptains(capRes.users || []);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-washi-beige">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-washi-beige/80 backdrop-blur-md border-b border-washi-beige-dark">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl text-kizuna-green" style={{ fontFamily: 'serif' }}>絆</span>
            <span className="font-semibold text-charcoal tracking-wider">KIZUNA</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/auth/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/auth/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal leading-tight"
            >
              Where community
              <br />
              <span className="text-kizuna-green">becomes connection</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-lg text-charcoal-muted max-w-lg"
            >
              A relational network where people support each other through
              trusted connections. Everyone is a superhero in their community.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link to="/auth/register">
                <Button size="lg" icon={<ArrowRight size={20} />} iconPosition="right">
                  Join the Community
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button variant="outline" size="lg">
                  Ask for Help
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-8 bg-kizuna-green">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
            {[
              { value: '2,500+', label: 'Community Helpers' },
              { value: '15,000+', label: 'Bonds Formed' },
              { value: '4.8', label: 'Average Trust' },
              { value: '12', label: 'Skill Categories' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-2">
            Find help in any category
          </h2>
          <p className="text-charcoal-muted mb-10">
            From drivers to tutors, security to creative arts — your community has it all.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card hover className="text-center">
                  <div
                    className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${cat.color}15` }}
                  >
                    <Sparkles size={24} style={{ color: cat.color }} />
                  </div>
                  <h3 className="font-medium text-charcoal">{cat.name}</h3>
                  <p className="text-xs text-charcoal-muted mt-1">
                    {cat.subcategories.length} services
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why KIZUNA Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-12 text-center">
            Why choose KIZUNA?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Trust & Safety',
                description: 'Every captain is verified. Ratings, reviews, and transparent profiles ensure you always know who you\'re working with.',
              },
              {
                icon: MapPin,
                title: 'Local First',
                description: 'Support your neighbors. KIZUNA connects you with skilled people in your community, strengthening local bonds.',
              },
              {
                icon: Users,
                title: 'Community Driven',
                description: 'More than transactions — build lasting relationships. Repeat connections earn rewards and deeper trust.',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-kizuna-green/10 flex items-center justify-center">
                  <feature.icon size={28} className="text-kizuna-green" />
                </div>
                <h3 className="text-lg font-semibold text-charcoal mb-2">{feature.title}</h3>
                <p className="text-charcoal-muted text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Community Helpers Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-2">
            Meet trusted community helpers
          </h2>
          <p className="text-charcoal-muted mb-10">
            Your neighbors who are ready to lend a hand today.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {captains.slice(0, 4).map((helper, i) => (
              <motion.div
                key={helper.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card hover>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar
                      src={helper.avatar}
                      name={helper.name}
                      size="lg"
                      verified={helper.verified}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-charcoal truncate">{helper.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-charcoal-muted">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span>{helper.rating}</span>
                        <span className="mx-1">·</span>
                        <span>{helper.totalConnections} connections</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-charcoal-muted line-clamp-2">{helper.bio}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {helper.skills.slice(0, 2).map(skill => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-0.5 bg-washi-beige rounded-full text-charcoal-muted"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-aizome-blue">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Ready to join your community?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 mb-8"
          >
            Whether you need help or want to offer your skills — KIZUNA connects you
            with people who care. Start building bonds today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/auth/register">
              <Button size="lg" className="bg-white text-aizome-blue hover:bg-gray-100">
                I need help
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-aizome-blue"
              >
                I want to help
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-charcoal">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-3xl text-kizuna-green" style={{ fontFamily: 'serif' }}>絆</span>
              <span className="font-semibold text-white tracking-wider">KIZUNA</span>
            </div>
            <p className="text-sm text-gray-400">
              © 2025 KIZUNA. Where community becomes connection.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

