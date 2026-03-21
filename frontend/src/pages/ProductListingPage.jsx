// ProductListingPage.jsx – Sporty Revamp
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, Zap, Target, Layers, ArrowLeft, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productsApi, categoryApi } from '../services/api';

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All-Access']);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState('All-Access');
  const [sort, setSort] = useState('created_at');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.list();
        if (res.success && res.data) {
          setCategories(['All-Access', ...res.data.map(c => c.name)]);
        }
      } catch {
        setCategories(['All-Access', 'Cricket', 'Football', 'Tennis', 'Gym', 'Equipment']);
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productsApi.list(page, category === 'All-Access' ? '' : category, sort);
      if (res.data) {
        setProducts(res.data.map(p => ({ ...p, image: p.image_url })));
        setTotalPages(res.totalPages || 1);
        setTotal(res.total || res.data.length);
      } else {
        setProducts([]);
        setTotalPages(1);
        setTotal(0);
      }
    } catch {
      setProducts([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, category, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-white">

      {/* ── Sport Tech Header Banner ── */}
      <div className="relative w-full bg-[#0D1B2A] overflow-hidden">
        {/* Animated Background Overlay */}
        <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-[#00C896]/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-white/5 blur-[80px] rounded-full" />
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <img
          src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=2000&q=80"
          alt="Sports Catalog"
          className="absolute inset-0 w-full h-full object-cover opacity-20 filter grayscale hover:grayscale-0 transition-all duration-1000"
        />
        
        <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 py-16 md:py-24">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-1 h-0.5 bg-[#00C896] rounded-full" />
             <p className="font-heading font-black text-[#00C896] uppercase tracking-[0.3em] text-[10px]">Elite Equipment Depot</p>
          </div>
          <h1 className="font-heading font-black text-white uppercase leading-[0.9] m-0" style={{ fontSize: 'clamp(48px, 10vw, 120px)' }}>
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C896] to-white">Arena</span>
          </h1>
          <div className="mt-8 flex items-center gap-10">
              <div className="flex flex-col">
                  <span className="font-heading font-black text-white text-3xl leading-none">{total}</span>
                  <span className="font-heading font-black text-white/30 uppercase text-[9px] tracking-widest mt-1">Available Units</span>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="flex flex-col">
                  <span className="font-heading font-black text-[#00C896] text-3xl leading-none">{categories.length - 1}</span>
                  <span className="font-heading font-black text-white/30 uppercase text-[9px] tracking-widest mt-1">Specialized Sectors</span>
              </div>
          </div>
        </div>
      </div>

      {/* ── Sporty Tactical Filter Bar ── */}
      <div className="sticky top-[72px] z-50 bg-[#0D1B2A] border-b-4 border-[#00C896] shadow-2xl">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-5 flex items-center gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 text-[#00C896] shrink-0 mr-4 border-r border-white/10 pr-6">
            <SlidersHorizontal size={18} strokeWidth={3} />
            <span className="font-heading font-black text-[10px] uppercase tracking-[0.2em]">Filter Sector</span>
          </div>
          
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-6 py-2.5 text-[11px] font-heading font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap border-2 cursor-pointer
                  ${category === cat
                    ? 'bg-[#00C896] text-[#0D1B2A] border-[#00C896] shadow-[0_0_20px_rgba(0,200,150,0.3)] scale-105'
                    : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20 hover:text-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Protocol */}
          <div className="ml-auto shrink-0 relative flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 text-white/20 mr-2">
                <Target size={14} />
                <span className="text-[9px] font-heading font-black uppercase tracking-widest">Sort Protocol</span>
            </div>
            <div className="relative">
                <select
                value={sort}
                onChange={e => { setSort(e.target.value); setPage(1); }}
                className="bg-white/5 border-2 border-white/10 hover:border-[#00C896] text-white rounded-xl px-5 py-2.5 text-[10px] font-heading font-black uppercase tracking-widest outline-none cursor-pointer transition-all appearance-none pr-10"
                >
                <option value="created_at" className="bg-[#0D1B2A]">Fresh Deployment</option>
                <option value="price" className="bg-[#0D1B2A]">Valuation Asc</option>
                <option value="name" className="bg-[#0D1B2A]">Alpha Sequence</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#00C896]" strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Gear Grid ── */}
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-16 lg:py-24">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-6">
                <div className="aspect-[4/5] bg-gray-50 rounded-[2rem] border-2 border-gray-100" />
                <div className="space-y-3 px-2">
                    <div className="h-2 bg-gray-100 rounded w-1/4" />
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${category}-${page}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: 'circOut' }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
            >
              {products.map(p => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  subtitle={p.subtitle || p.category}
                  price={p.price}
                  image={p.image_url || p.image}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="py-40 text-center bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center">
            <Layers size={64} strokeWidth={1} className="text-gray-200 mb-6" />
            <p className="font-heading font-black text-gray-400 text-sm uppercase tracking-[0.2em]">Zero Data Points Detected for current sector</p>
            <button onClick={() => setCategory('All-Access')} className="mt-8 text-[10px] font-heading font-black uppercase text-[#00C896] hover:underline decoration-2 underline-offset-8">Return to Global Grid</button>
          </div>
        )}

        {/* ── Round Navigation (Pagination) ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-24">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-14 h-14 flex items-center justify-center rounded-2xl border-4 border-gray-50 bg-white text-[#0D1B2A] disabled:opacity-20 hover:border-[#00C896] hover:text-[#00C896] transition-all cursor-pointer shadow-sm disabled:cursor-not-allowed group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
            </button>
            
            <div className="flex bg-gray-50 p-2 rounded-[1.5rem] border-2 border-gray-100">
                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                Math.max(0, page - 2), Math.min(totalPages, page + 1)
                ).map(p => (
                <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-12 h-12 flex items-center justify-center rounded-xl font-heading font-black text-sm transition-all border-none cursor-pointer
                    ${p === page
                        ? 'bg-[#00C896] text-[#0D1B2A] shadow-xl scale-110'
                        : 'text-gray-300 hover:text-[#0D1B2A]'
                    }`}
                >{p}</button>
                ))}
            </div>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-14 h-14 flex items-center justify-center rounded-2xl border-4 border-gray-50 bg-white text-[#0D1B2A] disabled:opacity-20 hover:border-[#00C896] hover:text-[#00C896] transition-all cursor-pointer shadow-sm disabled:cursor-not-allowed group"
            >
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </button>
          </div>
        )}
      </div>

      {/* Sporty SEO Footer Block */}
      <div className="bg-[#0D1B2A] py-16 px-5 border-t-8 border-[#00C896]">
         <div className="max-w-[800px] mx-auto text-center space-y-6">
            <Zap size={40} className="text-[#00C896] mx-auto animate-bounce" fill="currentColor" />
            <h2 className="font-heading font-black text-white text-3xl uppercase tracking-tighter">Engineered for Victory</h2>
            <p className="font-heading font-black text-white/30 text-[10px] uppercase tracking-[0.3em] leading-relaxed">
                Explore the most advanced performance gear in the galaxy. From precision-crafted English Willow to aerodynamic mission-balls.
                SportZone is your primary tactical depot for high-stakes competition.
            </p>
         </div>
      </div>
    </motion.div>
  );
};

export default ProductListingPage;
