// ProductDetailsPage.jsx – Sporty Revamp
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Minus, Plus, ShoppingBag, Check, Zap, ShieldCheck, Trophy, ArrowLeft, Share2, Layers, Target } from 'lucide-react';
import { productsApi, wishlistApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const fmt = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [qty, setQty] = useState(1);
  const [isWished, setIsWished] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  
  const { addToCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await productsApi.get(id);
        setProduct(res.data);
      } catch {
        setProduct(null);
      }
      setLoading(false);
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  const handleWishlist = async () => {
    if (!token) { navigate('/login'); return; }
    setWishLoading(true);
    try {
      if (isWished) {
        await wishlistApi.remove(product.id);
        setIsWished(false);
      } else {
        await wishlistApi.add(product.id);
        setIsWished(true);
      }
    } catch {
      setIsWished(prev => !prev);
    }
    setWishLoading(false);
  };

  const handleAddToCart = () => {
    if (!token) { navigate('/login'); return; }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || product.image,
    }, selectedSize, qty, true);
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
  };

  if (loading) return (
    <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-32 flex flex-col items-center justify-center font-heading font-black uppercase tracking-widest text-[#00C896]/30 animate-pulse">
        Scannning Gear Profile...
    </div>
  );

  if (!product) return (
    <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-32 text-center">
      <h1 className="font-heading font-black text-4xl uppercase text-red-500">Gear Not Found</h1>
      <Link to="/products" className="mt-8 inline-block font-heading font-black uppercase text-[#00C896] underline decoration-2 underline-offset-8 transition-all hover:translate-x-2">Retract to Catalog</Link>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-white">
      
      {/* Dynamic Background Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-[#00C896]/5 blur-[120px] rounded-full -mr-[20vw] -mt-[10vh]" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] bg-[#0D1B2A]/5 blur-[120px] rounded-full -ml-[10vw] -mb-[10vh]" />
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-12 lg:py-24">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-4 mb-12">
            <button onClick={() => navigate(-1)} className="p-3 bg-gray-50 hover:bg-[#0D1B2A] hover:text-white rounded-xl transition-all border-none cursor-pointer">
                <ArrowLeft size={18} strokeWidth={3} />
            </button>
            <span className="font-heading font-black text-[10px] uppercase tracking-widest text-gray-300 transition-colors hover:text-[#00C896] cursor-default">
                {product?.category} / {product?.name}
            </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">
          
          {/* ════════════════════════ GALLERY ════════════════════════ */}
          <div className="space-y-6 relative group">
            <motion.div 
              initial={{ x: -30, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }}
              className="aspect-[4/5] bg-gray-50 rounded-[3rem] overflow-hidden relative shadow-inner border-2 border-gray-100"
            >
              <img
                src={product?.image_url || product?.image}
                alt={product?.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
                 <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl">
                    <Layers size={24} className="text-white" />
                 </div>
                 <div className="bg-[#0D1B2A] text-[#00C896] px-6 py-3 rounded-2xl font-heading font-black uppercase text-[10px] tracking-widest shadow-2xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    Elite Specification
                 </div>
              </div>
            </motion.div>

            {/* Micro Gallery / Features (Stylized) */}
            <div className="grid grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-square bg-gray-50 rounded-2xl border-2 border-transparent hover:border-[#00C896] transition-all cursor-pointer opacity-40 hover:opacity-100 overflow-hidden">
                        <img src={product?.image_url || product?.image} className="w-full h-full object-cover scale-150 rotate-12" alt="" />
                    </div>
                ))}
            </div>
          </div>

          {/* ════════════════════════ INFO PANEL ════════════════════════ */}
          <div className="space-y-12">
            
            {/* Title & Technicals */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <span className="bg-[#0D1B2A] text-white px-4 py-1.5 rounded-lg font-heading font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <Zap size={10} fill="currentColor" /> Pro Performance
                 </span>
                 <span className="text-[10px] font-heading font-black text-[#00C896] uppercase tracking-widest">
                    Equipment ID: SZ-{product?.id.slice(0,6).toUpperCase()}
                 </span>
              </div>
              
              <h1 className="font-heading font-black text-6xl md:text-7xl xl:text-8xl tracking-tighter uppercase leading-[0.85] text-[#0D1B2A]">
                {product?.name.split(' ').map((word, i) => (
                  <span key={i} className={i % 2 === 0 ? 'block' : 'block text-[#00C896]'}>{word} </span>
                ))}
              </h1>

              <div className="flex items-end gap-6 pt-4">
                 <p className="font-heading font-black text-5xl text-[#0D1B2A] tracking-tighter leading-none">{fmt(product?.price || 0)}</p>
                 <div className="flex flex-col gap-1 pb-1">
                    <p className="text-[9px] font-heading font-black uppercase tracking-widest text-[#00C896]">Valued including GPT</p>
                    <div className="h-0.5 w-12 bg-[#00C896]" />
                 </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-gray-50 p-8 rounded-[2.5rem] border-2 border-gray-100 relative group overflow-hidden transition-all hover:bg-[#0D1B2A]">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:text-white transition-colors">
                  <Target size={120} strokeWidth={1} />
               </div>
               <h3 className="font-heading font-black text-[10px] uppercase tracking-[0.2em] text-[#00C896] mb-4">Tactical Abstract</h3>
               <p className="font-heading font-black text-sm uppercase leading-relaxed text-gray-400 group-hover:text-white transition-colors relative z-10">
                 {product?.description || `High-performance mission gear engineered for the elite ${product?.category} athlete. Feature-set includes advanced thermal regulation, impact stabilization, and ultra-durable composite construction.`}
               </p>
            </div>

            {/* Size & Spec Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-heading font-black uppercase tracking-widest text-gray-300">Size Matrix</label>
                        <button className="text-[9px] font-heading font-black uppercase tracking-widest text-[#00C896] hover:underline decoration-2 border-none bg-none cursor-pointer">View Specs</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {SIZES.map(size => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`h-14 rounded-2xl font-heading font-black text-sm transition-all border-2 cursor-pointer
                                    ${selectedSize === size
                                    ? 'bg-[#00C896] text-[#0D1B2A] border-[#00C896] shadow-xl scale-105'
                                    : 'bg-white border-gray-100 text-gray-300 hover:border-[#00C896]/30'
                                    }`}
                            >{size}</button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-heading font-black uppercase tracking-widest text-gray-300">Payload Quantity</label>
                    <div className="flex items-center justify-between h-14 bg-gray-50 rounded-2xl px-6 border-2 border-gray-100">
                        <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-[#0D1B2A] hover:text-[#00C896] transition-colors border-none bg-none cursor-pointer">
                            <Minus size={20} strokeWidth={3} />
                        </button>
                        <span className="font-heading font-black text-xl">{qty}</span>
                        <button onClick={() => setQty(q => q + 1)} className="text-[#0D1B2A] hover:text-[#00C896] transition-colors border-none bg-none cursor-pointer">
                            <Plus size={20} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </div>

            {/* CTA GRID */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                    onClick={handleAddToCart}
                    className={`flex-[2] h-20 rounded-[1.5rem] font-heading font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95 group border-none cursor-pointer
                        ${cartAdded
                        ? 'bg-white border-4 border-[#00C896] text-[#00C896]'
                        : 'bg-[#00C896] text-[#0D1B2A]'
                        }`}
                >
                    <div className={`p-2 rounded-lg bg-white/20 group-hover:rotate-12 transition-transform ${cartAdded ? 'bg-[#00C896] text-white' : ''}`}>
                        {cartAdded ? <Check size={20} strokeWidth={4} /> : <ShoppingBag size={20} strokeWidth={3} />}
                    </div>
                    {cartAdded ? 'Secured in Bag' : 'Initialize Shipment'}
                </button>
                
                <button
                    onClick={handleWishlist}
                    className={`flex-1 h-20 rounded-[1.5rem] border-4 font-heading font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 active:scale-95 cursor-pointer
                        ${isWished
                        ? 'border-[#0D1B2A] bg-[#0D1B2A] text-white'
                        : 'border-gray-100 bg-white text-gray-300 hover:border-[#00C896] hover:text-[#00C896]'
                        }`}
                >
                    <Heart size={20} fill={isWished ? 'currentColor' : 'none'} strokeWidth={3} />
                    {isWished ? 'Saved' : 'Vault'}
                </button>
                
                <button className="h-20 w-20 flex items-center justify-center bg-gray-50 rounded-[1.5rem] border-4 border-transparent hover:border-gray-100 transition-all text-gray-300 hover:text-[#0D1B2A] cursor-pointer">
                    <Share2 size={24} />
                </button>
            </div>

            {/* Performance Footer */}
            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-gray-100">
                <div className="flex flex-col items-center text-center group">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-[#0D1B2A] group-hover:bg-[#00C896]/10 transition-colors">
                        <ShieldCheck size={24} />
                    </div>
                    <span className="text-[10px] font-heading font-black uppercase tracking-widest text-[#0D1B2A] mt-3">Authenticated</span>
                    <p className="text-[8px] font-heading font-black uppercase text-gray-300 mt-1">SportZone Verified</p>
                </div>
                 <div className="flex flex-col items-center text-center group">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-[#0D1B2A] group-hover:bg-[#00C896]/10 transition-colors">
                        <Trophy size={24} />
                    </div>
                    <span className="text-[10px] font-heading font-black uppercase tracking-widest text-[#0D1B2A] mt-3">Elite Tier</span>
                    <p className="text-[8px] font-heading font-black uppercase text-gray-300 mt-1">Premium Performance</p>
                </div>
                 <div className="flex flex-col items-center text-center group">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-[#0D1B2A] group-hover:bg-[#00C896]/10 transition-colors">
                        <ShoppingBag size={24} />
                    </div>
                    <span className="text-[10px] font-heading font-black uppercase tracking-widest text-[#0D1B2A] mt-3">Global Dist.</span>
                    <p className="text-[8px] font-heading font-black uppercase text-gray-300 mt-1">Locked Fulfillment</p>
                </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailsPage;
