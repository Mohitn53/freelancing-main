// src/components/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full min-h-[90vh] relative flex items-center justify-center overflow-hidden">
      {/* 1. Background Big Image */}
      <div className="absolute inset-x-5 md:inset-x-10 top-4 bottom-8 rounded-3xl overflow-hidden z-0 shadow-2xl">
        <div className="absolute inset-0 bg-black/20 z-10" /> {/* Subtle darkening overlay */}
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "linear" }}
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1920&q=80" 
          alt="Hero Background" 
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* 2. Content Overlay */}
      <div className="relative z-20 text-center flex flex-col items-center gap-8 px-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-white text-xs md:text-sm font-black uppercase tracking-[0.5em] mb-4 bg-primary px-4 py-2 rounded-full inline-block">
            Fall / Winter / Summer 2026
          </p>
          <h1 className="text-[clamp(60px,12vw,160px)] font-black leading-[0.8] tracking-tighter text-white uppercase drop-shadow-2xl">
            Timeless<br />
            Essentials
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <p className="text-white/80 text-lg md:text-xl font-medium max-w-xl leading-relaxed drop-shadow-lg">
            Curated streetwear designed for the modern minimalists. High-quality fabrics that adapt to your lifestyle.
          </p>
          
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/products')}
              className="bg-white text-primary px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-neon hover:text-primary transition-all shadow-[6px_6px_0px_#111] active:translate-y-1 active:shadow-none"
            >
              Shop Collection
            </button>
            <button 
              onClick={() => navigate('/products?category=Men')}
              className="bg-transparent text-white border-2 border-white/50 backdrop-blur-md px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all active:translate-y-1"
            >
              New Arrivals
            </button>
          </div>
        </motion.div>
      </div>

      {/* 3. Spinning Branding Badge */}
      <motion.div 
        className="absolute bottom-16 right-16 z-30 hidden xl:block"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <div className="w-[140px] h-[140px] bg-white rounded-full flex items-center justify-center relative shadow-2xl">
          <span className="text-4xl text-primary font-black">dr⋆p</span>
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-[spin_20s_linear_infinite]">
            <defs>
              <path id="badgePath" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
            </defs>
            <text fontSize="7.5" fontWeight="900" letterSpacing="2.5px" fill="#111">
              <textPath href="#badgePath">
                KEEP THE TREND — DROP THE CODE — ORIGINAL — 
              </textPath>
            </text>
          </svg>
        </div>
      </motion.div>

      {/* 4. Left Designer Tag */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute bottom-16 left-16 z-30 hidden md:block"
      >
        <div className="flex items-center gap-4">
          <div className="w-[2px] h-24 bg-white/20" />
          <div className="text-white/60">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1">Designed in</p>
            <p className="text-sm font-bold uppercase tracking-widest text-white">Mumbai, India</p>
            <p className="text-[10px] font-medium mt-2">© 2026 dropcode.studio</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
