// ProductDetailsPage.jsx – real backend data, INR, wishlist toggle, add-to-cart notification
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Heart, Minus, Plus, ShoppingBag, Check } from 'lucide-react';
import { productsApi, wishlistApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  }, [id]);

  const handleWishlist = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
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
      setIsWished(prev => !prev); // toggle locally even if auth fails
    }
    setWishLoading(false);
  };

  const handleAddToCart = () => {
    if (!token) {
      navigate('/login');
      return;
    }
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
    <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-16">
      <div className="grid grid-cols-2 gap-12">
        <div className="animate-pulse aspect-[4/5] bg-gray-100 rounded-2xl" />
        <div className="space-y-4 pt-4">
          <div className="h-8 bg-gray-100 rounded w-3/4" />
          <div className="h-6 bg-gray-100 rounded w-1/4" />
          <div className="h-24 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-32 text-center text-gray-500 font-sans">
      Product not found
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Gallery */}
        <div className="h-[600px] bg-[#f5f5f5] rounded-2xl overflow-hidden relative">
          <img
            src={product?.image_url || product?.image}
            alt={product?.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
          {/* Wishlist on image */}
          <button
            onClick={handleWishlist}
            disabled={wishLoading}
            className={`absolute top-5 right-5 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all cursor-pointer border-2
              ${isWished ? 'border-red-400' : 'border-gray-200 hover:border-primary'}`}
          >
            <Heart
              size={20}
              fill={isWished ? '#ff4d4f' : 'none'}
              color={isWished ? '#ff4d4f' : '#111'}
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6 lg:pl-6 pt-2">
          <div>
            <p className="text-sm text-gray-400 font-medium mb-2 uppercase tracking-wider">{product?.category || 'Streetwear'}</p>
            <h1 className="text-4xl font-bold tracking-tighter font-sans text-primary leading-none mb-4">{product?.name}</h1>
            <p className="text-3xl font-semibold text-primary">{fmt(product?.price || 0)}</p>
            <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>
          </div>

          <p className="text-gray-500 leading-relaxed text-base">
            {product?.description || `Premium quality ${product?.name?.toLowerCase()} designed for maximum comfort and streetwear styling. Made from breathable fabrics for a structured yet soft feel.`}
          </p>

          {/* Size */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm font-sans">Select Size</h4>
              <button className="text-xs text-gray-400 underline cursor-pointer hover:text-primary transition-colors">Size Guide</button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer
                    ${selectedSize === size
                      ? 'bg-primary text-white border-primary shadow-[2px_3px_0px_#111]'
                      : 'border-gray-200 hover:border-primary'
                    }`}
                >{size}</button>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-sm font-sans">Quantity</h4>
            <div className="flex items-center border-2 border-gray-200 rounded-xl w-fit overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <Minus size={16} />
              </button>
              <span className="px-5 font-semibold text-lg">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition-all border-2 cursor-pointer
                ${cartAdded
                  ? 'bg-green-500 text-white border-green-500 shadow-[2px_3px_0px_#166534]'
                  : 'bg-primary text-white border-primary shadow-[2px_3px_0px_#111] hover:-translate-y-0.5 hover:shadow-[3px_5px_0px_#111]'
                }`}
            >
              {cartAdded ? <><Check size={18} /> Added!</> : <><ShoppingBag size={18} /> Add to Cart</>}
            </button>
            <button
              onClick={handleWishlist}
              className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold text-sm transition-all border-2 cursor-pointer
                ${isWished
                  ? 'bg-red-50 text-red-500 border-red-300'
                  : 'border-gray-200 text-primary hover:border-primary shadow-[2px_3px_0px_#e5e7eb] hover:shadow-[2px_3px_0px_#111]'
                }`}
            >
              <Heart size={18} fill={isWished ? '#ff4d4f' : 'none'} color={isWished ? '#ff4d4f' : 'currentColor'} />
              {isWished ? 'Wishlisted' : 'Wishlist'}
            </button>
          </div>

          {/* Product Meta */}
          <div className="border-t border-gray-100 pt-6 flex flex-col gap-2">
            <p className="text-xs text-gray-400"><span className="font-medium text-primary">SKU:</span> DRP-{product?.id?.toString().padStart(4, '0') || '0001'}</p>
            <p className="text-xs text-gray-400"><span className="font-medium text-primary">Ships in:</span> 3–5 business days</p>
            <p className="text-xs text-gray-400"><span className="font-medium text-primary">Returns:</span> Free 30-day returns</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailsPage;
