import React, { useState } from 'react';
import { Heart, Plus, Check } from 'lucide-react';
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
    if (!token) {
      navigate('/login');
      return;
    }
    addToCart({ id, image, name, price }, 'M', 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const fmt = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (!token) {
      navigate('/login');
      return;
    }

    const nextState = !isWished;
    setIsWished(nextState); // Optimistic

    try {
      if (nextState) {
        await wishlistApi.add(id);
      } else {
        await wishlistApi.remove(id);
      }
    } catch (err) {
      console.error('Wishlist sync failed:', err);
      setIsWished(!nextState); // Rollback
    }
  };

  return (
    <motion.div 
      className="flex flex-col cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleQuickView}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#f5f5f5] mb-3">
        <motion.img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        
        {/* Quick Add Plus */}
        <button 
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-10 border-none cursor-pointer transition-all duration-300
            ${added ? 'bg-green-500 scale-110' : 'bg-white/80 backdrop-blur-sm hover:bg-primary hover:text-white shadow-sm'}`}
          onClick={handleAdd}
        >
          {added ? <Check size={16} color="#fff" strokeWidth={3} /> : <Plus size={18} strokeWidth={2.5} />}
        </button>
      </div>

      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h3 className="font-sans font-semibold text-[15px] m-0 text-primary tracking-tight group-hover:text-gray-600 transition-colors uppercase">{name}</h3>
          <span className="text-xs text-gray-400 font-medium">{subtitle}</span>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <button 
            onClick={toggleWishlist}
            className="p-1 hover:scale-110 transition-transform cursor-pointer"
          >
            <Heart 
              size={15} 
              fill={isWished ? '#ff4d4f' : 'none'} 
              color={isWished ? '#ff4d4f' : '#ccc'} 
              strokeWidth={2}
            />
          </button>
          <span className="font-bold text-[14px] text-primary">{fmt(price)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

