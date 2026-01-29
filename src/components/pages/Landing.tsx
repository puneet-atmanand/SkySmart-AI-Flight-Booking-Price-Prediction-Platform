import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { motion } from 'motion/react';
import { Plane, Sparkles } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600">
      {/* Animated Sky Gradient Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-blue-600/50 via-transparent to-sky-300/30"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </div>

      {/* Floating Clouds */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ x: -200, y: Math.random() * 100 + (i * 120) }}
          animate={{
            x: ['0%', '110%'],
          }}
          transition={{
            duration: 30 + i * 10,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 3,
          }}
          style={{
            top: `${i * 15}%`,
          }}
        >
          <div className="relative">
            <div className="w-32 h-12 bg-white/30 rounded-full blur-xl" />
            <div className="absolute top-2 left-8 w-24 h-8 bg-white/20 rounded-full blur-lg" />
          </div>
        </motion.div>
      ))}

      {/* Sparkle Effects */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        >
          <Sparkles className="w-4 h-4 text-white/60" />
        </motion.div>
      ))}

      {/* Parallax Effect on Mouse Move */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: mousePosition.x * 0.01,
          y: mousePosition.y * 0.01,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      >
        {/* Flying Planes */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`plane-${i}`}
            className="absolute"
            initial={{ x: -100, y: 100 + i * 250 }}
            animate={{
              x: ['0%', '120%'],
              y: [100 + i * 250, 80 + i * 250],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 5,
            }}
          >
            <Plane className="w-8 h-8 text-white/40 rotate-45" />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-white">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center"
        >
          {/* Logo/Brand */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
              <Plane className="w-10 h-10" />
              <span className="text-3xl font-bold">SkySmart</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Your Smart Travel
            <br />
            <span className="bg-gradient-to-r from-yellow-200 via-orange-200 to-pink-200 bg-clip-text text-transparent">
              Starts Here
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto"
          >
            AI-powered flight booking, fare predictions, and personalized travel assistance
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={() => navigate('/flights/search')}
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 rounded-xl shadow-2xl"
              >
                Start Your Journey
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/flights/search')}
                className="bg-accent text-accent-foreground hover:bg-accent/90 border-2 border-accent text-lg px-8 py-6 rounded-xl shadow-xl"
              >
                Enter SkySmart
              </Button>
            </motion.div>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: '🤖', title: 'AI-Powered', desc: 'Smart recommendations' },
              { icon: '💰', title: 'Best Prices', desc: 'Fare predictions' },
              { icon: '⚡', title: 'Instant Booking', desc: 'Quick & easy' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/80">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-indigo-900/50 to-transparent" />
    </div>
  );
}