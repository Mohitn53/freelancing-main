// Hero.jsx – Sports E-Commerce Hero
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, ChevronRight, Trophy, Shield, Star } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Trophy, label: '50K+', sub: 'Happy Athletes' },
    { icon: Shield, label: '500+', sub: 'Premium Brands' },
    { icon: Star, label: '4.9★', sub: 'Avg Rating' },
  ];

  return (
    <section className="w-full min-h-[92vh] relative flex items-center overflow-hidden bg-[#0D1B2A]">
      {/* ── Background Image ── */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 12, ease: 'linear' }}
          src="https://images.unsplash.com/photo-1595210382266-2d0077c1f541?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Athletes in action"
          className="w-full h-full object-cover object-center"
        />
        {/* Multi-layer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B2A]/95 via-[#0D1B2A]/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/80 via-transparent to-transparent" />
      </div>

      {/* ── Animated Teal Glow Blobs ── */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#00C896]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-[#00C896]/8 rounded-full blur-2xl pointer-events-none" />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 py-20">
        <div className="max-w-[700px]">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex items-center gap-2 mb-5"
          >
            <span className="flex items-center gap-1.5 bg-[#00C896] text-white font-heading font-black text-[11px] uppercase tracking-[0.18em] px-3 py-1.5 rounded">
              <Zap size={11} strokeWidth={3} />
              New Season 2026
            </span>
            <span className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-[#00C896] to-transparent opacity-60" />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-black text-white uppercase leading-[0.88] tracking-tight mb-5"
            style={{ fontSize: 'clamp(64px, 10vw, 140px)' }}
          >
            PLAY<br />
            <span className="text-[#00C896]">HARD.</span><br />
            WIN BIG.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
            className="text-white/70 text-lg md:text-xl font-normal leading-relaxed mb-9 max-w-[500px]"
          >
            Premium sports gear engineered for peak performance. From pitch to podium — gear up with the best.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="flex flex-wrap gap-4 mb-14"
          >
            <button
              id="hero-shop-btn"
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 bg-[#00C896] hover:bg-[#009b74] text-white font-heading font-black text-[15px] uppercase tracking-[0.1em] px-8 py-4 rounded transition-all hover:shadow-[0_8px_32px_rgba(0,200,150,0.4)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Shop Collection
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
            <button
              id="hero-new-arrivals-btn"
              onClick={() => navigate('/products?sort=created_at')}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white font-heading font-black text-[15px] uppercase tracking-[0.1em] px-8 py-4 rounded transition-all"
            >
              New Arrivals
            </button>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="flex items-center gap-8 flex-wrap"
          >
            {stats.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#00C896]/15 flex items-center justify-center border border-[#00C896]/30">
                  <Icon size={16} color="#00C896" strokeWidth={2} />
                </div>
                <div>
                  <p className="font-heading font-black text-white text-[17px] leading-none">{label}</p>
                  <p className="text-white/50 text-[11px] font-medium mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Spinning Brand Badge ── */}
      <motion.div
        className="absolute bottom-12 right-12 z-20 hidden xl:block"
        initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <div className="w-[130px] h-[130px] rounded-full flex items-center justify-center relative bg-[#00C896] shadow-[0_0_40px_rgba(0,200,150,0.5)]">
          <span className="font-heading font-black text-white text-[13px] uppercase tracking-wider text-center leading-tight">SPORT<br />ZONE</span>
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-[spin_18s_linear_infinite]">
            <defs>
              <path id="badgePath" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
            </defs>
            <text fontSize="7" fontWeight="900" letterSpacing="3px" fill="#fff" opacity="0.85">
              <textPath href="#badgePath">GEAR UP • PLAY HARD • WIN BIG • </textPath>
            </text>
          </svg>
        </div>
      </motion.div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-[10px] font-heading uppercase tracking-[0.25em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          className="w-5 h-8 border-2 border-white/20 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-[#00C896] rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
