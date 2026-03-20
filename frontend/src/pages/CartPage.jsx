// src/pages/CartPage.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
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

  if (authLoading) return <div className="min-h-[60vh] flex items-center justify-center font-black uppercase tracking-widest text-gray-300">Syncing Cart...</div>;

  if (!token) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-primary" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-4">Authentication Required</h1>
        <p className="text-gray-500 mb-8 max-w-sm">Please login to view your shopping bag and sync your saved items across devices.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/login" className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_#555] hover:-translate-y-1 transition-transform">Login Now</Link>
          <Link to="/signup" className="bg-white text-primary border-2 border-primary px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:-translate-y-1 transition-transform">Create Account</Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-gray-300" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added anything to your cart yet. Explore our latest drops and find your base.</p>
        <Link 
          to="/products"
          className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_#555] hover:-translate-y-1 transition-transform"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-16">
      <h1 className="text-4xl font-black tracking-tighter uppercase mb-12">Shopping Bag <span className="text-gray-300 ml-2">({cartItems.length})</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
        {/* List */}
        <div className="space-y-8">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div 
                key={`${item.product_id}-${item.size}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-gray-100 group"
              >
                <div className="w-full sm:w-32 aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                  <img src={item.product?.image || item.product?.image_url} alt={item.product?.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-bold tracking-tight uppercase">{item.product?.name}</h3>
                      <p className="font-black text-lg">{fmt((item.product?.price || 0) * item.quantity)}</p>
                    </div>
                    <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-4">Size: {item.size} • Qty: {item.quantity}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <button 
                        onClick={() => updateQty(item.product_id, item.size, -1)}
                        className="px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 font-bold text-sm min-w-[40px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQty(item.product_id, item.size, 1)}
                        className="px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.product_id, item.size)}
                      className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="bg-[#f9f9f9] border-2 border-gray-100 rounded-3xl p-8 sticky top-24">
          <h2 className="text-xl font-black tracking-tighter uppercase mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="font-bold">{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Shipping</span>
              <span className="text-green-600 font-bold uppercase tracking-wider">Free</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Tax</span>
              <span className="font-bold">{fmt(subtotal * 0.18)}</span>
            </div>
            <div className="pt-4 border-t border-gray-200 flex justify-between">
              <span className="font-bold uppercase tracking-tighter">Total</span>
              <span className="text-2xl font-black">{fmt(subtotal * 1.18)}</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:-translate-y-1 transition-transform shadow-[4px_6px_0px_#555]"
          >
            Checkout <ArrowRight size={18} />
          </button>
          
          <p className="text-[10px] text-gray-400 text-center mt-6 uppercase font-bold tracking-[0.2em]">
            Secure encrypted payments
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;
