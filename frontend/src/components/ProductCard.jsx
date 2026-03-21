// ProductCard.jsx – Sports E-commerce themed
import React, { useState } from 'react';
import { Heart, ShoppingCart, Check, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { wishlistApi } from '../services/api';

const ProductCard = ({ id, image, name, subtitle, price, isWished: initWished = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWished, setIsWished] = useState(initWished);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { token } = useAuth();

  const handleQuickView = (e) => {
    e.stopPropagation();
    navigate(`/products/${id || 1}`);
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!token) { navigate('/login'); return; }
    addToCart({ id, image, name, price }, 'M', 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const fmt = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (!token) { navigate('/login'); return; }
    const nextState = !isWished;
    setIsWished(nextState);
    try {
      if (nextState) { await wishlistApi.add(id); }
      else { await wishlistApi.remove(id); }
    } catch {
      setIsWished(!nextState);
    }
  };

  return (
    <motion.div
      className="flex flex-col cursor-pointer group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleQuickView}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {/* ── Image Container ── */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#f3f4f6] mb-3">
        <motion.img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.06 : 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* ── NEW Badge ── */}
        <div className="absolute top-3 left-3 bg-[#00C896] text-white font-heading font-black text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 rounded">
          NEW
        </div>

        {/* ── Wishlist Button ── */}
        <button
          id={`wishlist-${id}`}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm shadow-sm hover:bg-[#E8271A] hover:text-white transition-all z-10 cursor-pointer"
          onClick={toggleWishlist}
        >
          <Heart
            size={15}
            fill={isWished ? '#E8271A' : 'none'}
            color={isWished ? '#E8271A' : '#0a0a0a'}
            strokeWidth={2}
          />
        </button>

        {/* ── Hover Action Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.22 }}
          className="absolute bottom-0 left-0 right-0 flex gap-2 p-3"
        >
          {/* Add to Cart */}
          <button
            id={`addtocart-${id}`}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded font-heading font-black text-[12px] uppercase tracking-wide transition-all cursor-pointer
              ${added ? 'bg-green-500 text-white' : 'bg-[#00C896] hover:bg-[#009b74] text-white'}`}
            onClick={handleAdd}
          >
            {added ? <><Check size={14} strokeWidth={3} /> Added!</> : <><ShoppingCart size={14} strokeWidth={2} /> Add to Cart</>}
          </button>

          {/* Quick View */}
          <button
            id={`quickview-${id}`}
            className="w-10 h-10 flex items-center justify-center rounded bg-white text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white transition-all cursor-pointer"
            onClick={handleQuickView}
          >
            <Eye size={16} strokeWidth={2} />
          </button>
        </motion.div>
      </div>

      {/* ── Info Row ── */}
      <div className="flex flex-col gap-1.5 px-1">
        <span className="text-[11px] text-[#00C896] font-heading font-bold uppercase tracking-widest">{subtitle}</span>
        <h3 className="font-heading font-black text-[15px] text-[#0a0a0a] uppercase tracking-tight leading-tight group-hover:text-[#00C896] transition-colors m-0">
          {name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="font-heading font-black text-[16px] text-[#0a0a0a]">{fmt(price)}</span>
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map(s => (
              <div key={s} className={`w-2 h-2 rounded-full ${s <= 4 ? 'bg-[#F5A623]' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
