// src/pages/CheckoutPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Truck, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-5 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 text-white shadow-[0_0_40px_rgba(34,197,94,0.3)]"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-4">Order Received</h1>
        <p className="text-gray-500 max-w-sm mb-10">Thank you for your order. We've sent a detailed confirmation to your email. Your streetwear is on its way.</p>
        <div className="flex gap-4">
          <Link to="/profile" className="bg-primary text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs shadow-[4px_4px_0px_#555]">View Orders</Link>
          <Link to="/" className="border-2 border-gray-200 px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs">Back Home</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-16">
      <div className="mb-12">
        <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Back to Bag
        </button>
        <h1 className="text-4xl font-black tracking-tighter uppercase mt-4">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Left: Info */}
        <div className="space-y-12">
          {/* Section 1: Shipping */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Truck size={20} className="text-primary" />
              </div>
              <h2 className="text-xl font-black tracking-tighter uppercase">Shipping Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" defaultValue={user?.name} className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-5 py-4 outline-none focus:border-primary transition-colors" />
              <input type="email" placeholder="Email Address" defaultValue={user?.email} className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-5 py-4 outline-none focus:border-primary transition-colors" />
              <input type="text" placeholder="Phone Number" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-5 py-4 outline-none focus:border-primary transition-colors md:col-span-2" />
              <input type="text" placeholder="Address Line 1" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-5 py-4 outline-none focus:border-primary transition-colors md:col-span-2" />
              <input type="text" placeholder="City" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-5 py-4 outline-none focus:border-primary transition-colors" />
              <input type="text" placeholder="Postal Code" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-5 py-4 outline-none focus:border-primary transition-colors" />
            </div>
          </div>

          {/* Section 2: Payment */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <CreditCard size={20} className="text-primary" />
              </div>
              <h2 className="text-xl font-black tracking-tighter uppercase">Payment Method</h2>
            </div>
            
            <div className="space-y-3">
              <label 
                className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                onClick={() => setPaymentMethod('card')}
              >
                <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-4 h-4 accent-primary cursor-pointer" />
                <div className="flex-1">
                  <p className="font-bold text-sm tracking-tight">Credit / Debit Card</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Visa, Mastercard, AMEX</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-5 bg-white rounded border border-gray-100" />
                  <div className="w-8 h-5 bg-white rounded border border-gray-100" />
                </div>
              </label>
              
              <label 
                className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-colors ${paymentMethod === 'wallet' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                onClick={() => setPaymentMethod('wallet')}
              >
                <input type="radio" name="payment" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} className="w-4 h-4 accent-primary cursor-pointer" />
                <div className="flex-1">
                  <p className="font-bold text-sm tracking-tight">External Wallet</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Paytm, Google Pay, PhonePe</p>
                </div>
              </label>

              <label 
                className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 accent-primary cursor-pointer" />
                <div className="flex-1">
                  <p className="font-bold text-sm tracking-tight">Cash on Delivery (COD)</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Pay when you receive</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Summary Box */}
        <div className="lg:pl-10">
          <div className="bg-white border-4 border-primary rounded-3xl p-8 shadow-[12px_12px_0px_#111]">
            <h2 className="text-2xl font-black tracking-tighter uppercase mb-8">Order Overview</h2>
            
            <div className="max-h-60 overflow-y-auto pr-2 space-y-4 mb-8 custom-scrollbar">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                    <img src={item.product?.image || item.product?.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-xs font-black uppercase truncate max-w-[150px]">{item.product?.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Size: {item.size} • Qty: {item.quantity}</p>
                  </div>
                  <div className="flex flex-col justify-center items-end">
                    <p className="text-sm font-black">{fmt((item.product?.price || 0) * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-8 border-t-2 border-dashed border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                <span className="font-bold">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">GST (18%)</span>
                <span className="font-bold">{fmt(tax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Shipping</span>
                <span className="text-green-600 font-black uppercase tracking-widest text-[10px]">Free</span>
              </div>
              <div className="flex justify-between pt-4">
                <span className="text-lg font-black uppercase tracking-tighter">Total Amount</span>
                <span className="text-2xl font-black">{fmt(total)}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={placingOrder || cartItems.length === 0}
              className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm mt-10 hover:bg-neon hover:text-primary transition-all shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <ShieldCheck size={20} /> {placingOrder ? 'Placing Order...' : 'Complete Payment'}
            </button>
            {orderError && (
              <p className="text-[10px] text-red-500 text-center mt-3 font-bold uppercase tracking-wider">
                {orderError}
              </p>
            )}
            <p className="text-[9px] text-gray-400 text-center mt-4 uppercase font-bold tracking-widest">
              By placing order you agree to our terms & conditions
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;
