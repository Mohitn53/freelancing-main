// Navbar.jsx – Sports E-commerce themed navigation
import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, Heart, User, X, LogOut, ChevronDown, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productsApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const MotionBtn = motion.button;
const MotionLink = motion.create(Link);

const NAV_LINKS = [
  { label: 'Shop', to: '/products' },
  { label: 'Collections', to: '/products?sort=created_at' },
  { label: 'About & Contact', to: '/about-contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);
  const searchTimerRef = useRef(null);
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, handleLogout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, []);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (!value || value.length < 2) { setSearchResults([]); setSearchLoading(false); return; }
    searchTimerRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await productsApi.search(value);
        setSearchResults(res.data || []);
      } catch { setSearchResults([]); }
      setSearchLoading(false);
    }, 300);
  };

  const handleResultClick = (id) => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    navigate(`/products/${id}`);
  };

  return (
    <>
      <nav
        className={`h-[72px] sticky top-0 z-[100] transition-all duration-300
          ${isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.09)] border-b border-gray-100'
            : 'bg-white border-b-2 border-[#00C896]'
          }`}
      >
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 h-full flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="w-9 h-9 bg-[#00C896] rounded-full flex items-center justify-center shadow-[0_0_0_3px_rgba(0,200,150,0.2)] group-hover:shadow-[0_0_0_5px_rgba(0,200,150,0.25)] transition-all">
              <Zap size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <span
              className="font-heading font-black text-[22px] uppercase tracking-tight text-[#0a0a0a] leading-none"
            >
              Sport<span className="text-[#00C896]">Zone</span>
            </span>
          </Link>

          {/* ── Nav Links (Desktop) ── */}
          <div className="hidden md:flex items-center gap-7 flex-1 justify-center">
            {NAV_LINKS.map((link) => (
              <MotionLink
                key={link.label}
                to={link.to}
                className="font-heading font-700 text-[15px] uppercase tracking-wider text-[#0a0a0a] hover:text-[#00C896] transition-colors relative group"
                whileHover={{ y: -1 }}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00C896] group-hover:w-full transition-all duration-300" />
              </MotionLink>
            ))}
            {user?.role === 'admin' && (
              <MotionLink
                to="/admin"
                className="font-heading font-black text-[13px] uppercase tracking-widest bg-[#E8271A] text-white px-4 py-1.5 rounded hover:bg-red-700 transition-all"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                Admin
              </MotionLink>
            )}
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <MotionBtn
              id="navbar-search-btn"
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-[#E8FBF5] text-[#0a0a0a] hover:text-[#00C896] transition-colors cursor-pointer"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => { setSearchOpen(true); setTimeout(() => document.getElementById('search-input')?.focus(), 100); }}
            >
              <Search size={19} strokeWidth={2} />
            </MotionBtn>

            {/* Cart */}
            <MotionBtn
              id="navbar-cart-btn"
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-[#E8FBF5] text-[#0a0a0a] hover:text-[#00C896] transition-colors cursor-pointer"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart size={19} strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#00C896] text-white text-[10px] font-black rounded-full flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </MotionBtn>

            {/* Wishlist */}
            <MotionBtn
              id="navbar-wishlist-btn"
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-[#E8FBF5] text-[#0a0a0a] hover:text-[#E8271A] transition-colors cursor-pointer"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate('/wishlist')}
            >
              <Heart size={19} strokeWidth={2} />
            </MotionBtn>

            {/* Profile / Auth */}
            {user ? (
              <>
                <MotionBtn
                  id="navbar-profile-btn"
                  className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-[#E8FBF5] text-[#0a0a0a] hover:text-[#00C896] transition-colors cursor-pointer"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => navigate('/profile')}
                >
                  <User size={19} strokeWidth={2} />
                </MotionBtn>
                <MotionBtn
                  id="navbar-logout-btn"
                  className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-red-50 text-[#0a0a0a] hover:text-[#E8271A] transition-colors cursor-pointer"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => { handleLogout(); navigate('/'); }}
                >
                  <LogOut size={19} strokeWidth={2} />
                </MotionBtn>
              </>
            ) : (
              <MotionBtn
                id="navbar-login-btn"
                className="hidden sm:flex items-center gap-1.5 bg-[#00C896] text-white font-heading font-black text-[13px] uppercase tracking-widest px-5 py-2.5 rounded hover:bg-[#009b74] transition-all cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/login')}
              >
                Login
              </MotionBtn>
            )}
          </div>
        </div>
      </nav>

      {/* ── Search Overlay ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-start justify-center pt-20 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              ref={searchRef}
              initial={{ opacity: 0, y: -24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border-t-4 border-[#00C896]"
              onClick={e => e.stopPropagation()}
            >
              {/* Input row */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                <Search size={20} className="text-[#00C896] shrink-0" />
                <input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={e => handleSearchChange(e.target.value)}
                  placeholder="Search shoes, jerseys, gear..."
                  className="flex-1 text-base outline-none font-sans placeholder:text-gray-300 text-[#0a0a0a]"
                />
                <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-[#E8271A] transition-colors cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              {/* Results */}
              {searchQuery.length >= 2 && (
                <div className="max-h-80 overflow-y-auto">
                  {searchLoading ? (
                    <div className="p-6 text-center text-sm text-gray-400">Searching…</div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-400">No results for "{searchQuery}"</div>
                  ) : (
                    searchResults.map(r => (
                      <button key={r.id} onClick={() => handleResultClick(r.id)}
                        className="w-full flex items-center gap-4 px-6 py-3 hover:bg-[#E8FBF5] transition-colors text-left cursor-pointer border-b border-gray-50">
                        <img src={r.image_url} alt={r.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                        <div>
                          <p className="font-heading font-semibold text-sm uppercase tracking-wide">{r.name}</p>
                          <p className="text-xs text-[#00C896] font-bold mt-0.5">₹{Number(r.price).toLocaleString('en-IN')}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Popular tags */}
              {searchQuery.length < 2 && (
                <div className="px-6 py-4">
                  <p className="text-[11px] text-gray-400 mb-3 font-bold uppercase tracking-widest">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {['Running Shoes', 'Jersey', 'Helmet', 'Shorts', 'Gym Bag', 'Cricket'].map((tag) => (
                      <button key={tag} onClick={() => handleSearchChange(tag)}
                        className="px-4 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-[#00C896] hover:text-white transition-colors cursor-pointer font-medium">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
