// src/pages/CartPage.jsx – Sporty Revamp
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const fmt = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

const CartPage = () => {
  const { cartItems, setCartItems } = useCart();
  const { token, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const updateQty = (id, size, delta) => {
    setCartItems(prev => prev.map(item => 
      (item.product_id === id && item.size === size) 
        ? { ...item, quantity: Math.max(1, item.quantity + delta) } 
        : item
    ));
  };

  const removeItem = (id, size) => {
    setCartItems(prev => prev.filter(item => !(item.product_id === id && item.size === size)));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);

  if (authLoading) return <div className="min-h-[70vh] flex items-center justify-center font-heading font-black uppercase tracking-widest text-[#00C896]/30 animate-pulse">Syncing Bag...</div>;

  if (!token) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-[#0D1B2A] rounded-3xl flex items-center justify-center mb-8 rotate-3 shadow-xl">
          <ShoppingBag size={40} color="#00C896" strokeWidth={2.5} />
        </div>
        <h1 className="font-heading font-black text-5xl tracking-tight uppercase mb-4 text-[#0a0a0a]">Authentication <span className="text-[#00C896]">Required</span></h1>
        <p className="text-gray-500 mb-10 max-w-sm font-sans font-medium">Log in to your athlete profile to view your shopping bag and synchronise your gear.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/login" className="bg-[#00C896] text-[#0D1B2A] px-12 py-4 rounded-xl font-heading font-black uppercase tracking-widest text-sm shadow-lg hover:scale-105 transition-all">Login Now</Link>
          <Link to="/signup" className="bg-white text-[#0a0a0a] border-2 border-[#0a0a0a] px-12 py-4 rounded-xl font-heading font-black uppercase tracking-widest text-sm hover:bg-[#0a0a0a] hover:text-white transition-all">Sign Up</Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mb-8 -rotate-3 border-2 border-dashed border-gray-200">
          <ShoppingBag size={40} className="text-gray-300" />
        </div>
        <h1 className="font-heading font-black text-5xl tracking-tight uppercase mb-4 text-[#0a0a0a]">Your bag is <span className="text-gray-300">empty</span></h1>
        <p className="text-gray-500 mb-10 max-w-sm font-sans font-medium">The stadium is waiting. Explore our latest performance gear and start your collection.</p>
        <Link 
          to="/products"
          className="bg-[#00C896] text-[#0D1B2A] px-12 py-5 rounded-xl font-heading font-black uppercase tracking-widest text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-3"
        >
          Browse All Gear <Zap size={18} fill="currentColor" />
        </Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-16">
      <div className="flex items-end gap-4 mb-12">
        <h1 className="font-heading font-black text-5xl tracking-tight uppercase leading-none">Your <span className="text-[#00C896]">Bag</span></h1>
        <span className="font-heading font-black text-xl text-gray-300 uppercase mb-1">[{cartItems.length} items]</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 items-start">
        {/* List */}
        <div className="space-y-6">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div 
                key={`${item.product_id}-${item.size}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col sm:flex-row gap-6 p-4 rounded-2xl bg-white border-2 border-gray-100 hover:border-[#00C896]/30 transition-all group"
              >
                <div className="w-full sm:w-32 aspect-square rounded-xl overflow-hidden bg-gray-50 shrink-0">
                  <img 
                    src={item.product?.image || item.product?.image_url} 
                    alt={item.product?.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-heading font-black text-xl uppercase leading-tight tracking-tight">{item.product?.name}</h3>
                      <p className="font-heading font-black text-xl text-[#0D1B2A]">{fmt((item.product?.price || 0) * item.quantity)}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="text-[10px] font-heading font-black uppercase tracking-widest bg-gray-100 px-3 py-1 rounded text-gray-500">Size: {item.size}</span>
                       <span className="text-[10px] font-heading font-black uppercase tracking-widest bg-gray-100 px-3 py-1 rounded text-gray-500">Cat: {item.product?.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                      <button 
                        onClick={() => updateQty(item.product_id, item.size, -1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-all text-gray-400 hover:text-[#0D1B2A]"
                      >
                        <Minus size={14} strokeWidth={3} />
                      </button>
                      <span className="px-5 font-heading font-black text-sm min-w-[40px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQty(item.product_id, item.size, 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-all text-gray-400 hover:text-[#0D1B2A]"
                      >
                        <Plus size={14} strokeWidth={3} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.product_id, item.size)}
                      className="flex items-center gap-2 font-heading font-black text-[10px] uppercase tracking-widest text-red-500/40 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={13} strokeWidth={2.5} /> Remove Gear
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary Card */}
        <div className="bg-[#0D1B2A] rounded-3xl p-8 sticky top-24 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C896]/10 rounded-full blur-3xl -mr-16 -mt-16" />
          
          <h2 className="font-heading font-black text-2xl tracking-tight uppercase text-white mb-8 flex items-center gap-3">
            Summary <Zap size={20} className="text-[#00C896]" fill="currentColor" />
          </h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-white/50">
              <span className="font-heading font-black text-xs uppercase tracking-widest">Base Amount</span>
              <span className="font-heading font-black text-sm text-white">{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-white/50">
              <span className="font-heading font-black text-xs uppercase tracking-widest">GST (Integrated)</span>
              <span className="font-heading font-black text-sm text-white">{fmt(subtotal * 0.18)}</span>
            </div>
            <div className="flex justify-between items-center py-4 border-y border-white/5">
              <span className="font-heading font-black text-xs uppercase tracking-widest text-[#00C896]">Priority Shipping</span>
              <span className="font-heading font-black text-[10px] text-[#00C896] bg-[#00C896]/10 px-3 py-1 rounded-full uppercase tracking-tighter">Complimentary</span>
            </div>
            <div className="pt-4 flex justify-between items-end">
              <div>
                <span className="block font-heading font-black text-[10px] uppercase tracking-widest text-white/30 mb-1">Payable Total</span>
                <span className="font-heading font-black text-4xl text-white leading-none">{fmt(subtotal * 1.18)}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-[#00C896] text-[#0D1B2A] py-5 rounded-2xl font-heading font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl active:scale-95"
          >
            Go to Checkout <ArrowRight size={20} strokeWidth={3} />
          </button>
          
          <div className="flex items-center justify-center gap-2 mt-8 py-3 border-t border-white/5">
            <ShieldCheck size={14} className="text-[#00C896]" />
            <p className="text-[9px] text-white/30 uppercase font-heading font-black tracking-widest">
              Secured Checkout Protocol Enabled
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;
