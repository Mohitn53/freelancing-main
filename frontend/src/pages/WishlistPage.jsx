// src/pages/WishlistPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { wishlistApi } from '../services/api';
import { Heart, ShoppingBag } from 'lucide-react';
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
    return <div className="min-h-[60vh] flex items-center justify-center font-black uppercase tracking-widest text-gray-300">Loading Wishlist...</div>;
  }

  if (!token) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <Heart size={40} className="text-red-200" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-4">Auth Required</h1>
        <p className="text-gray-500 mb-8 max-w-sm">Login to save your favorite drops and access them anywhere on any device.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/login" className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_#555] hover:-translate-y-1 transition-transform">Login to Save</Link>
          <Link to="/products" className="bg-white text-primary border-2 border-primary px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:-translate-y-1 transition-transform">Browse Collection</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <Heart size={40} className="text-red-200" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-4">Your wishlist is empty</h1>
        <p className="text-gray-500 mb-8 max-w-sm">Save items you love and they'll appear here. Start curating your personal collection today.</p>
        <Link 
          to="/products"
          className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_#555] hover:-translate-y-1 transition-transform"
        >
          Explore Drops
        </Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-16">
      <h1 className="text-4xl font-black tracking-tighter uppercase mb-12">Wishlist <span className="text-gray-300 ml-2">({items.length})</span></h1>
      
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
    </motion.div>
  );
};

export default WishlistPage;
