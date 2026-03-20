// Navbar.jsx – with working search, 3D buttons, cart count badge
import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, Heart, User, X, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productsApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const MotionBtn = motion.button;
const MotionLink = motion(Link);

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

  // Close search on outside click
  useEffect(() => {
    const handler = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  const handleSearchChange = (value) => {
    setSearchQuery(value);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    if (!value || value.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    searchTimerRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await productsApi.search(value);
        setSearchResults(res.data || []);
      } catch {
        setSearchResults([]);
      }
      setSearchLoading(false);
    }, 300);
  };

  const handleResultClick = (id) => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    navigate(`/products/${id}`);
  };

  const btnHover = { y: -2, x: -1, boxShadow: '3px 5px 0px #111' };
  const btnTap = { y: 2, x: 1, boxShadow: '0px 0px 0px #111' };
  const iconBtnClass = "relative flex items-center justify-center bg-white border-2 border-primary cursor-pointer p-2 rounded-xl text-primary transition-colors shadow-[2px_3px_0px_#111]";

  return (
    <>
      <nav className={`h-[70px] sticky top-0 z-[100] bg-white transition-all duration-300 ${isScrolled ? 'border-b border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.04)]' : 'border-b border-transparent'}`}>
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 h-full flex items-center justify-between">

          {/* Left: Nav Links */}
          <div className="flex-1 flex items-center gap-8">
            <MotionLink to="/products" className="text-sm font-medium text-primary flex items-center transition-colors"
              whileHover={{ y: -2 }} whileTap={{ y: 1 }}>
              Shop <span className="text-[10px] ml-1 mt-0.5">▾</span>
            </MotionLink>
            <MotionLink to="/about-contact" className="text-sm font-medium text-primary" whileHover={{ y: -2 }} whileTap={{ y: 1 }}>About & Contact</MotionLink>
            
            {user?.role === 'admin' && (
              <MotionLink 
                to="/admin" 
                className="text-xs font-black uppercase tracking-widest bg-primary text-white px-4 py-1.5 rounded-full hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Admin Panel
              </MotionLink>
            )}
          </div>

          {/* Center: Logo */}
          <Link to="/" className="flex-1 flex justify-center text-primary font-sans font-extrabold text-2xl tracking-tighter lowercase transition-transform hover:scale-105">
            dr⋆p.code
          </Link>

          {/* Right: Icons */}
          <div className="flex-1 flex items-center justify-end gap-3">
            {/* Search */}
            <MotionBtn className={iconBtnClass} whileHover={btnHover} whileTap={btnTap}
              onClick={() => { setSearchOpen(true); setTimeout(() => document.getElementById('search-input')?.focus(), 100); }}>
              <Search size={20} strokeWidth={1.5} />
            </MotionBtn>

            {/* Cart */}
            <MotionBtn className={iconBtnClass} whileHover={btnHover} whileTap={btnTap} onClick={() => navigate('/cart')}>
              <ShoppingCart size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </div>
              )}
            </MotionBtn>

            {/* Wishlist */}
            <MotionBtn className={iconBtnClass} whileHover={btnHover} whileTap={btnTap} onClick={() => navigate('/wishlist')}>
              <Heart size={20} strokeWidth={1.5} />
            </MotionBtn>

            {/* Profile / Login */}
            {user ? (
              <>
                <MotionBtn className={iconBtnClass} whileHover={btnHover} whileTap={btnTap} onClick={() => navigate('/profile')}>
                  <User size={20} strokeWidth={1.5} />
                </MotionBtn>
                <MotionBtn className={iconBtnClass} whileHover={btnHover} whileTap={btnTap} onClick={() => { handleLogout(); navigate('/'); }}>
                  <LogOut size={20} strokeWidth={1.5} />
                </MotionBtn>
              </>
            ) : (
              <MotionBtn className={iconBtnClass} whileHover={btnHover} whileTap={btnTap} onClick={() => navigate('/login')}>
                <User size={20} strokeWidth={1.5} />
              </MotionBtn>
            )}
          </div>
        </div>
      </nav>

      {/* ─── Search Overlay ─── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-start justify-center pt-24 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div ref={searchRef}
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Input */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                <Search size={20} className="text-gray-400 shrink-0" />
                <input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={e => handleSearchChange(e.target.value)}
                  placeholder="Search for hoodies, tees, joggers..."
                  className="flex-1 text-base outline-none font-sans placeholder:text-gray-300"
                />
                <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-primary transition-colors cursor-pointer">
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
                        className="w-full flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors text-left cursor-pointer border-b border-gray-50">
                        <img src={r.image_url} alt={r.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                        <div>
                          <p className="font-semibold text-sm">{r.name}</p>
                          <p className="text-xs text-gray-400">₹{Number(r.price).toLocaleString('en-IN')}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}

              {searchQuery.length < 2 && (
                <div className="px-6 py-4">
                  <p className="text-xs text-gray-300 mb-3 font-medium">POPULAR SEARCHES</p>
                  <div className="flex flex-wrap gap-2">
                    {['Hoodie', 'Tee', 'Jogger', 'Minimal', 'Oversized'].map((tag) => (
                      <button key={tag} onClick={() => handleSearchChange(tag)}
                        className="px-4 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-primary hover:text-white transition-colors cursor-pointer">
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
