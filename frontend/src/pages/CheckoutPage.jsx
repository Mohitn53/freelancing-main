// src/pages/CheckoutPage.jsx – Sporty Revamp
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Truck, ShieldCheck, ArrowLeft, CheckCircle2, Zap, Trophy, ShieldAlert } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { orderApi } from '../services/api';

const fmt = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

const CheckoutPage = () => {
  const { cartItems, setCartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handlePlaceOrder = async () => {
    if (!cartItems.length) return;

    setPlacingOrder(true);
    setOrderError('');

    try {
      const items = cartItems
        .map((item) => ({
          product_id: item.product_id || item.product?.id,
          quantity: item.quantity,
          price: item.product?.price || item.price || 0,
          size: item.size || 'M',
        }))
        .filter((item) => item.product_id);

      if (!items.length) {
        throw new Error('Your cart is invalid. Please refresh and try again.');
      }

      await orderApi.create({
        items,
        total_amount: total,
        payment_method: paymentMethod,
      });

      setPlaced(true);
      setTimeout(() => {
        setCartItems([]);
        navigate('/profile');
      }, 3000);
    } catch (err) {
      setOrderError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (placed) {
    return (
      <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-5 text-center bg-[#0D1B2A] overflow-hidden">
        {/* Success burst background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#00C896]/5 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00C896]/10 rounded-full blur-[100px]" />
        </div>

        <motion.div 
          initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          className="relative z-10 w-32 h-32 bg-[#00C896] rounded-[2.5rem] flex items-center justify-center mb-10 text-[#0D1B2A] shadow-[0_0_50px_rgba(0,200,150,0.4)]"
        >
          <Trophy size={64} fill="currentColor" />
        </motion.div>
        
        <h1 className="relative z-10 font-heading font-black text-6xl tracking-tighter uppercase mb-4 text-white">Order <span className="text-[#00C896]">Placed</span></h1>
        <p className="relative z-10 text-white/40 max-w-sm mb-12 font-heading font-black uppercase text-xs tracking-widest">Victory is yours. Your performance gear is now in the fulfillment queue.</p>
        
        <div className="relative z-10 flex gap-4">
          <Link to="/profile" className="bg-[#00C896] text-[#0D1B2A] px-10 py-5 rounded-xl font-heading font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">My Squad Profile</Link>
          <Link to="/" className="border-2 border-white/10 text-white hover:border-[#009b74] px-10 py-5 rounded-xl font-heading font-black uppercase tracking-widest text-xs transition-all">Back Home</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-16">
      <div className="mb-16 pb-8 border-b-4 border-[#0a0a0a]">
        <button onClick={() => navigate('/cart')} className="flex items-center gap-2 font-heading font-black uppercase text-[10px] tracking-widest text-gray-300 hover:text-[#00C896] transition-colors mb-6">
          <ArrowLeft size={14} /> Retract to Bag
        </button>
        <h1 className="font-heading font-black text-6xl tracking-tighter uppercase mt-4">Final <span className="text-[#00C896]">Checkout</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-20">
        {/* Left: Info */}
        <div className="space-y-16">
          {/* Section 1: Shipping */}
          <section className="space-y-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-[#0D1B2A] rounded-2xl flex items-center justify-center -rotate-3 p-1">
                <Truck size={24} className="text-[#00C896]" />
              </div>
              <h2 className="font-heading font-black text-2xl tracking-tight uppercase">Athlete Logistics</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-8 rounded-[2rem] border-2 border-gray-100">
               <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-heading font-black uppercase tracking-widest text-gray-400 pl-1">Full Identity</label>
                 <input type="text" placeholder="Full name" defaultValue={user?.name} className="w-full bg-white border-2 border-gray-100 rounded-xl px-5 py-4 font-sans text-sm font-bold outline-none focus:border-[#00C896] transition-all" />
               </div>
               <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-heading font-black uppercase tracking-widest text-gray-400 pl-1">Communication ID</label>
                 <input type="email" placeholder="Email address" defaultValue={user?.email} className="w-full bg-white border-2 border-gray-100 rounded-xl px-5 py-4 font-sans text-sm font-bold outline-none focus:border-[#00C896] transition-all" />
               </div>
               <div className="flex flex-col gap-2 md:col-span-2">
                 <label className="text-[10px] font-heading font-black uppercase tracking-widest text-gray-400 pl-1">Destination Address</label>
                 <input type="text" placeholder="Complete address" className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-4 font-sans text-sm font-bold outline-none focus:border-[#00C896] transition-all" />
               </div>
               <div className="grid grid-cols-2 gap-4 md:col-span-2">
                 <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-heading font-black uppercase tracking-widest text-gray-400 pl-1">Zone (City)</label>
                   <input type="text" placeholder="City" className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-4 font-sans text-sm font-bold outline-none focus:border-[#00C896] transition-all" />
                 </div>
                 <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-heading font-black uppercase tracking-widest text-gray-400 pl-1">Postal Tag</label>
                   <input type="text" placeholder="Pincode" className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-4 font-sans text-sm font-bold outline-none focus:border-[#00C896] transition-all" />
                 </div>
               </div>
            </div>
          </section>

          {/* Section 2: Payment */}
          <section className="space-y-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-[#0D1B2A] rounded-2xl flex items-center justify-center rotate-3 p-1">
                <CreditCard size={24} className="text-[#00C896]" />
              </div>
              <h2 className="font-heading font-black text-2xl tracking-tight uppercase">Pay Channel</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'card', label: 'Electronic Card', sub: 'Mastercard, Visa, AMEX', icon: CreditCard },
                { id: 'wallet', label: 'Fast Wallet', sub: 'Paytm, GPAY, UPI', icon: Zap },
                { id: 'cod', label: 'COD Protocol', sub: 'Pay upon delivery', icon: Truck },
              ].map(opt => (
                <label 
                  key={opt.id}
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`flex flex-col p-6 border-2 rounded-2xl cursor-pointer transition-all hover:bg-gray-50/50 relative
                    ${paymentMethod === opt.id ? 'border-[#00C896] bg-[#00C896]/5' : 'border-gray-100'} ${opt.id === 'cod' ? 'md:col-span-2' : ''}`}
                >
                  <div className="flex items-center justify-between mb-4">
                     <opt.icon size={24} strokeWidth={2.5} className={paymentMethod === opt.id ? 'text-[#00C896]' : 'text-gray-200'} />
                     <input type="radio" checked={paymentMethod === opt.id} readOnly className="w-4 h-4 accent-[#00C896]" />
                  </div>
                  <p className="font-heading font-black text-sm uppercase tracking-tight">{opt.label}</p>
                  <p className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-gray-300 mt-1">{opt.sub}</p>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Summary Dark Card */}
        <aside className="lg:pl-6">
          <div className="bg-[#0D1B2A] rounded-3xl p-8 sticky top-24 shadow-2xl overflow-hidden text-white border-l-4 border-[#00C896]">
            <h2 className="font-heading font-black text-2xl tracking-tight uppercase mb-8">Manifest</h2>
            
            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 mb-10 custom-scrollbar">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-3 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/10">
                    <img src={item.product?.image || item.product?.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0 pr-1">
                    <p className="font-heading font-black text-[10px] uppercase truncate">{item.product?.name}</p>
                    <p className="text-[9px] font-heading font-black text-[#00C896] uppercase tracking-widest mt-1">SZ {item.size} • QTY {item.quantity}</p>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="font-heading font-black text-xs text-white/50 line-through mb-0.5">{fmt((item.product?.price || 0) * 1.2 * item.quantity)}</p>
                    <p className="font-heading font-black text-xs">{fmt((item.product?.price || 0) * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t border-white/5">
              <div className="flex justify-between text-white/30 font-heading font-black text-[10px] uppercase tracking-widest">
                <span>Sub-Calculation</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-white/30 font-heading font-black text-[10px] uppercase tracking-widest">
                <span>Integrated Tax (18%)</span>
                <span>{fmt(tax)}</span>
              </div>
              <div className="flex justify-between py-6 border-y border-white/5">
                <span className="font-heading font-black text-sm uppercase tracking-tight">TOTAL DUE</span>
                <span className="font-heading font-black text-3xl text-[#00C896] leading-none">{fmt(total)}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={placingOrder || cartItems.length === 0}
              className="w-full bg-[#00C896] text-[#0D1B2A] py-5 rounded-2xl font-heading font-black uppercase tracking-widest text-sm mt-10 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 group"
            >
              {placingOrder ? (
                <Zap size={20} className="animate-pulse" />
              ) : (
                <ShieldCheck size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              )}
              {placingOrder ? 'TRANSMITTING...' : 'COMMIT ORDER'}
            </button>
            
            {orderError && (
              <div className="flex items-center gap-2 text-red-400 p-3 bg-red-400/10 rounded-xl border border-red-400/20 mt-4">
                 <ShieldAlert size={14} />
                 <p className="text-[9px] font-heading font-black uppercase tracking-wider">{orderError}</p>
              </div>
            )}
            
            <p className="text-[8px] text-white/20 text-center mt-6 uppercase font-heading font-black tracking-widest">
              Secured Channel Activation Protocol Active
            </p>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;
