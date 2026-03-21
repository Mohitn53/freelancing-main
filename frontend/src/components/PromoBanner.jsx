// PromoBanner.jsx – Sports 3-column promo banners
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const promos = [
  {
    id: 'promo-running',
    label: '🔥 Hot Deal',
    title: 'Running\nShoes',
    offer: 'SALE 25% OFF',
    sub: 'Professional Series',
    bg: 'bg-[#E8271A]',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    textColor: 'text-white',
    accentColor: '#fff',
    darkOverlay: true,
  },
  {
    id: 'promo-jersey',
    label: '⚡ This Month',
    title: 'Sport\nJersey',
    offer: 'Use Code: SPORT360',
    sub: 'Big Sale — New Drops',
    bg: 'bg-[#0D1B2A]',
    img: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=600&q=80',
    textColor: 'text-white',
    accentColor: '#00C896',
    darkOverlay: true,
  },
  {
    id: 'promo-helmet',
    label: '🏆 SportZone',
    title: 'Cycling\nHelmet',
    offer: 'SALE 20% OFF',
    sub: 'Safety First Gear',
    bg: 'bg-[#F5A623]',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
    textColor: 'text-white',
    accentColor: '#0D1B2A',
    darkOverlay: true,
  },
];

const PromoBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full max-w-[1440px] mx-auto px-5 md:px-10 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {promos.map((p, i) => (
          <motion.div
            key={p.id}
            id={p.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative overflow-hidden rounded-xl cursor-pointer group"
            style={{ minHeight: 280 }}
            onClick={() => navigate('/products')}
          >
            {/* BG Image */}
            <img
              src={p.img}
              alt={p.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

            {/* Content */}
            <div className="relative z-10 p-6 h-full flex flex-col justify-between" style={{ minHeight: 280 }}>
              <div>
                <span
                  className="inline-block text-[10px] font-heading font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded"
                  style={{ backgroundColor: p.accentColor === '#fff' ? 'rgba(255,255,255,0.2)' : p.accentColor, color: '#fff' }}
                >
                  {p.label}
                </span>
              </div>

              <div>
                <p className="text-white/70 text-[11px] font-heading uppercase tracking-widest mb-1">{p.sub}</p>
                <h3
                  className="font-heading font-black text-white uppercase leading-[0.9] mb-3 whitespace-pre-line"
                  style={{ fontSize: 'clamp(28px, 3vw, 42px)' }}
                >
                  {p.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span
                    className="font-heading font-black text-[13px] uppercase tracking-wide py-1 px-3 rounded"
                    style={{
                      backgroundColor: p.accentColor,
                      color: p.accentColor === '#fff' || p.accentColor === '#F5A623' ? '#0D1B2A' : '#fff'
                    }}
                  >
                    {p.offer}
                  </span>
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white group-hover:bg-[#00C896] group-hover:scale-110 transition-all">
                    <ArrowRight size={15} strokeWidth={2.5} />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PromoBanner;
