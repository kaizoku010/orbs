// Splash Screen - Fast brand moment
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';

export default function SplashScreen() {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Quick splash - navigate after 1.5s
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(() => navigate('/home'), 200);
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: show ? 1 : 0 }}
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: '#F4EDE2' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-3"
      >
        {/* Kanji */}
        <span
          className="text-7xl font-light"
          style={{ fontFamily: 'serif', color: '#252525' }}
        >
          絆
        </span>
        {/* Logo text */}
        <span className="text-xl font-semibold tracking-[0.25em]" style={{ color: '#252525' }}>
          KIZUNA
        </span>
        {/* Loading bar */}
        <div className="w-20 h-0.5 rounded-full overflow-hidden mt-4" style={{ backgroundColor: '#E8DFD0' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.3, ease: 'easeInOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: '#252525' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
