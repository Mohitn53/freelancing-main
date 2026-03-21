// src/pages/WishlistPage.jsx – Sporty Revamp
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { wishlistApi } from '../services/api';
import { Heart, ShoppingBag, Trophy, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await wishlistApi.get();
        if (res.success && res.data) {
          setItems(res.data.map(item => item.products).filter(Boolean));
        }
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [token, authLoading]);

  if (loading || authLoading) {
    return <div className="min-h-[70vh] flex items-center justify-center font-heading font-black uppercase tracking-widest text-[#00C896]/30 animate-pulse">Scanning Locker...</div>;
  }

  if (!token) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-[#0D1B2A] rounded-3xl flex items-center justify-center mb-8 rotate-3 shadow-xl border-4 border-[#ff4d4d]/20">
          <Heart size={40} className="text-[#ff4d4d]" fill="currentColor" strokeWidth={2.5} />
        </div>
        <h1 className="font-heading font-black text-5xl tracking-tight uppercase mb-4 text-[#0a0a0a]">Wishlist <span className="text-[#00C896]">Vault</span></h1>
        <p className="text-gray-500 mb-10 max-w-sm font-sans font-medium">Log in to your athlete profile to save your favorite gear and access them anywhere.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/login" className="bg-[#00C896] text-[#0D1B2A] px-12 py-4 rounded-xl font-heading font-black uppercase tracking-widest text-sm shadow-lg hover:scale-105 transition-all">Login to Unlock</Link>
          <Link to="/products" className="bg-white text-[#0a0a0a] border-2 border-[#0a0a0a] px-12 py-4 rounded-xl font-heading font-black uppercase tracking-widest text-sm hover:bg-[#0a0a0a] hover:text-white transition-all">Browse Collection</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mb-8 rotate-3 border-2 border-dashed border-gray-200">
           <Heart size={40} className="text-gray-200" />
        </div>
        <h1 className="font-heading font-black text-5xl tracking-tight uppercase mb-4 text-[#0a0a0a]">Your locker is <span className="text-gray-300">empty</span></h1>
        <p className="text-gray-500 mb-10 max-w-sm font-sans font-medium">Capture the items you love while they remain in stock. Your personal curation starts here.</p>
        <Link 
          to="/products"
          className="bg-[#0D1B2A] text-[#00C896] px-12 py-5 rounded-xl font-heading font-black uppercase tracking-widest text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-3 border border-white/5"
        >
          Explore Latest Drops <Zap size={18} fill="currentColor" />
        </Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-16">
      <div className="flex items-end gap-4 mb-20 border-b-4 border-[#0a0a0a] pb-8">
        <div>
          <h1 className="font-heading font-black text-6xl tracking-tighter uppercase leading-none">Wish <span className="text-[#00C896]">List</span></h1>
          <p className="font-heading font-black text-xs text-gray-400 uppercase tracking-widest mt-2 px-1">Tracking your personal elite selection</p>
        </div>
        <div className="ml-auto flex items-center gap-3 mb-1">
           <Trophy size={48} strokeWidth={1} className="text-gray-100" />
           <span className="font-heading font-black text-4xl text-gray-200 uppercase leading-none">[{items.length}]</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        <AnimatePresence>
          {items.map(product => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              name={product.name}
              subtitle={product.subtitle || product.category}
              price={product.price}
              image={product.image_url || product.image}
              isWished={true}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Support */}
      <div className="mt-24 py-12 border-t border-gray-100 flex flex-col items-center justify-center text-center">
         <ShieldCheck size={32} className="text-[#00C896] mb-4" />
         <p className="font-heading font-black text-xs uppercase tracking-[0.2em] text-gray-300">Elite Squad Priority Protection</p>
      </div>
    </motion.div>
  );
};

export default WishlistPage;
