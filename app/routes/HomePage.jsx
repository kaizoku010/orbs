import React, { useState, useEffect } from 'react'
import "./homepage.css"
import Logo from "../../media/logo.png"
import Title from "../../media/try2.svg"
import { fetchAllUsers, fetchCurrentUser } from "../mocks/services"
import { motion } from "framer-motion"
import { Star, Shield, Award, MapPin, Share2, Globe, LogIn, UserPlus } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

function HomePage() {
  const [stats, setStats] = useState({ users: 0, connections: 0 })
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadData() {
      // Check if user is authenticated
      const userRes = await fetchCurrentUser()
      setIsAuthenticated(userRes.success && userRes.user !== null)

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

  const handleNetworkClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault()
      navigate('/auth/login')
    }
  }

  return (
    <div className='hm-page min-h-screen bg-washi-beige'>
      {/* <header className='hmp-header p-6 fixed top-0 w-full z-50 flex justify-between items-center pointer-events-none'>
        <div className="pointer-events-auto logo">
          <img className='hmp-logo py-3 px-3 w-12 h-12' src={Logo} alt="Kizuna Logo" />
        </div>
        <div className="pointer-events-auto flex gap-3">
          <Link
            to="/auth/login"
            className="px-6 py-2.5 bg-white/90 backdrop-blur-sm text-charcoal rounded-xl font-bold text-sm hover:bg-white transition-all shadow-lg border border-white/20 flex items-center gap-2"
          >
            <LogIn size={16} />
            Login
          </Link>
          <Link
            to="/auth/register"
            className="px-6 py-2.5 bg-kizuna-green text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-kizuna-green/20 flex items-center gap-2"
          >
            <UserPlus size={16} />
            Sign Up
          </Link>
        </div>
      </header> */}

      <main className="relative pt-0">
        <div className='hmp-hero px-0 flex flex-col items-center mb-12'>
          <img className='hmp-svg-title max-w-2xl w-full' src={Title} alt="Kizuna Title" />
        

        </div>
      </main>
      <div className='cta'>
<h1 className='we-are-orbs'>WE ARE ALL HERE TO HELP!</h1>
        <div className='cta-actions'>
  <p className="text-white cta-text text-left max-w-lg">
                Join {stats.users}+ supporters in Kampala and visualize how our community is helping each other in real-time.
                Kampala and visualize how our community is helping each other in real-time. Kampala and visualize how our community is helping each other in real-time.
          </p>  
            {/* Auth CTAs */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
    
            <Link
              to="/auth/login"
              className="cta-login-btn mb-6 text-white px-8 py-2 bg-kizuna-green rounded-2xl font-bold text-sm hover:bg-charcoal hover:text-white transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Login 
            </Link>
          </div>
       
        </div>
         
      </div>
      <div className='get-started'>
<Link
to="/auth/register"
className='cta-link'>
  GET STARTED HERE
</Link>
      </div>
    </div>
  )
}

export default HomePage