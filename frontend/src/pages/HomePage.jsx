// HomePage.jsx – Sports E-Commerce
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Truck, RotateCcw, Headphones, ShieldCheck, ArrowRight, Flame } from 'lucide-react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import PromoBanner from '../components/PromoBanner';
import { productsApi, categoryApi } from '../services/api';

const FEATURES = [
  { icon: Truck, title: 'Free Delivery', sub: 'On orders above ₹1499' },
  { icon: Headphones, title: '24/7 Support', sub: 'Always here to help' },
  { icon: RotateCcw, title: 'Easy Returns', sub: '30-day hassle-free returns' },
  { icon: ShieldCheck, title: 'Secure Payment', sub: '100% trusted checkout' },
];

const SPORT_CATEGORIES = [
  { label: 'Running', emoji: '🏃', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80' },
  { label: 'Cricket', emoji: '🏏', img: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=400&q=80' },
  { label: 'Football', emoji: '⚽', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80' },
  { label: 'Cycling', emoji: '🚴', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80' },
  { label: 'Gym', emoji: '💪', img: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=400&q=80' },
  { label: 'Swimming', emoji: '🏊', img: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=400&q=80' },
];

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.list();
        if (res.success && res.data) {
          setCategories(['All', ...res.data.map(c => c.name)]);
        }
      } catch {
        setCategories(['All', 'Men', 'Women', 'Bags', 'Shoes']);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productsApi.list(1, activeTab === 'All' ? '' : activeTab);
        setProducts(res.data?.slice(0, 8) || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeTab]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page" exit={{ opacity: 0 }}>

      {/* ── 1. Hero ── */}
      <Hero />

      {/* ── 2. Feature Strip ── */}
      <div className="w-full bg-[#0D1B2A] py-5">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-white/10">
            {FEATURES.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-full bg-[#00C896]/15 border border-[#00C896]/30 flex items-center justify-center shrink-0">
                  <Icon size={16} color="#00C896" strokeWidth={2} />
                </div>
                <div>
                  <p className="font-heading font-black text-white text-[13px] uppercase tracking-wide leading-none">{title}</p>
                  <p className="text-white/40 text-[11px] mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. Promo Banners ── */}
      <div className="pt-14">
        <PromoBanner />
      </div>

      {/* ── 4. Sport Categories ── */}
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="section-label">Browse by Sport</p>
            <h2 className="font-heading font-black text-[36px] md:text-[48px] uppercase leading-none text-[#0a0a0a]">
              Your Sport,<br /><span className="text-[#00C896]">Your Gear.</span>
            </h2>
          </div>
          <button
            id="home-view-all-categories-btn"
            onClick={() => navigate('/products')}
            className="hidden md:flex items-center gap-2 font-heading font-black text-[13px] uppercase tracking-widest text-[#0a0a0a] hover:text-[#00C896] transition-colors cursor-pointer"
          >
            All Categories <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {SPORT_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              onClick={() => navigate('/products')}
              className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
            >
              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-3 gap-1">
                <span className="text-2xl">{cat.emoji}</span>
                <span className="font-heading font-black text-white text-[13px] uppercase tracking-wide">{cat.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── 5. Bestsellers Grid ── */}
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 pb-24">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
          <div>
            <p className="section-label">Top Performers</p>
            <h2 className="font-heading font-black text-[36px] md:text-[48px] uppercase leading-none text-[#0a0a0a] flex items-center gap-3">
              Bestsellers
              <Flame size={36} color="#E8271A" strokeWidth={2} />
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-[#f5f5f5] rounded p-1 overflow-x-auto max-w-full border border-gray-100">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`tab-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2 text-[12px] font-heading font-black uppercase tracking-widest transition-all outline-none border-none cursor-pointer rounded whitespace-nowrap
                  ${activeTab === cat
                    ? 'bg-[#00C896] text-white shadow'
                    : 'bg-transparent text-gray-500 hover:text-[#0a0a0a]'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            id="home-show-more-btn"
            onClick={() => navigate('/products')}
            className="hidden md:flex items-center gap-2 font-heading font-black text-[13px] uppercase tracking-widest text-[#0a0a0a] hover:text-[#00C896] transition-colors cursor-pointer group"
          >
            View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-[4/5] bg-gray-100 animate-pulse rounded-xl" />
                <div className="h-3 bg-gray-100 animate-pulse rounded w-3/4" />
                <div className="h-3 bg-gray-100 animate-pulse rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
            <p className="font-heading font-black text-gray-400 uppercase tracking-widest text-sm">No products in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                subtitle={product.category}
                price={product.price}
                image={product.image_url}
              />
            ))}
          </div>
        )}

        {/* Mobile Show More */}
        <div className="flex justify-center mt-10 md:hidden">
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 bg-[#00C896] text-white font-heading font-black text-[13px] uppercase tracking-widest px-8 py-3.5 rounded hover:bg-[#009b74] transition-all cursor-pointer"
          >
            View All Products <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* ── 6. Explore Featured / CTA Banner ── */}
      <div className="relative w-full overflow-hidden mb-0">
        <img
          src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=2000&q=80"
          alt="Explore our featured collection"
          className="w-full h-[420px] object-cover object-top"
        />
        <div className="absolute inset-0 bg-[#0D1B2A]/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-label mb-3">Explore Our Featured</p>
            <h2 className="font-heading font-black text-white uppercase leading-none mb-6" style={{ fontSize: 'clamp(36px, 6vw, 80px)' }}>
              UNLEASH YOUR<br /><span className="text-[#00C896]">PERFORMANCE</span>
            </h2>
            <button
              id="home-explore-featured-btn"
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 bg-[#00C896] hover:bg-[#009b74] text-white font-heading font-black text-[14px] uppercase tracking-widest px-10 py-4 rounded transition-all hover:shadow-[0_8px_32px_rgba(0,200,150,0.4)] hover:-translate-y-0.5 cursor-pointer"
            >
              Shop Now <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </div>

    </motion.div>
  );
};

export default HomePage;
