import React, { useState, useEffect } from 'react'
import "./homepage.css"
import Logo from "../../media/logo.png"
import Title from "../../media/try.svg"
import { fetchAllUsers } from "../mocks/services"
import { motion } from "framer-motion"
import { Star, Shield, Award, MapPin, Share2, Globe } from "lucide-react"
import { Link } from "react-router"

function HomePage() {
  const [stats, setStats] = useState({ users: 0, connections: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const uRes = await fetchAllUsers()
      if (uRes.success) {
        setStats({
          users: uRes.users.length,
          connections: uRes.users.reduce((acc, u) => acc + u.totalConnections, 0)
        })
      }
      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <div className='hm-page min-h-screen bg-washi-beige'>
      <header className='hmp-header p-6 fixed top-0 w-full z-50 flex justify-between items-center pointer-events-none'>
        <div className="pointer-events-auto">
          <img className='hmp-logo w-12 h-12' src={Logo} alt="Kizuna Logo" />
        </div>
      </header>

      <main className="relative z-10 pt-20">
        <div className='hmp-hero px-6 flex flex-col items-center mb-12'>
          <img className='hmp-logo mb-6 w-32 md:w-48' src={Logo} alt="Kizuna Logo Large" />
          <img className='hmp-svg-title max-w-2xl w-full' src={Title} alt="Kizuna Title" />
          <p className="mt-6 text-charcoal-muted text-center max-w-lg">
            Where community becomes connection. Explore your local delivery network in 3D.
          </p>
        </div>

        {/* Connection Network CTA */}
        <section className="px-4 md:px-12 pb-20">
          <div className="relative w-full rounded-[2rem] overflow-hidden bg-charcoal-dark border border-white/5 shadow-2xl group">
            {/* Abstract Background for CTA */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-br from-kizuna-green/20 via-transparent to-purple-500/10" />

            <div className="relative z-10 p-8 md:p-16 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                <Globe className="text-kizuna-green w-8 h-8" />
              </div>

              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                See the <span className="text-kizuna-green">Connections</span>
              </h2>

              <p className="text-white/60 max-w-xl text-lg mb-10">
                Join {stats.users}+ supporters in Kampala and visualize how our community is helping each other in real-time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/network"
                  className="px-8 py-4 bg-white text-black rounded-2xl font-bold text-lg hover:bg-kizuna-green hover:text-white transition-all transform active:scale-95 shadow-xl shadow-black/20 flex items-center gap-2"
                >
                  <Share2 size={20} />
                  Explore Live Network
                </Link>
                <button className="px-8 py-4 bg-white/5 backdrop-blur-md text-white border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">
                  How it Works
                </button>
              </div>

              {/* Stats Mini Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/5 w-full">
                <div>
                  <div className="text-2xl font-bold text-white">{stats.users}</div>
                  <div className="text-xs text-white/40 uppercase tracking-widest mt-1">Active Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.connections}</div>
                  <div className="text-xs text-white/40 uppercase tracking-widest mt-1">Global Connections</div>
                </div>
                <div className="hidden md:block">
                  <div className="text-2xl font-bold text-white">99.8%</div>
                  <div className="text-xs text-white/40 uppercase tracking-widest mt-1">Succesful Deliveries</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomePage