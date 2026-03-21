// Footer.jsx – Sports E-Commerce themed
import React from 'react';
import { ArrowRight, Zap, MapPin, Phone, Mail, Instagram, Youtube, Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0D1B2A] text-white mt-20">

      {/* ── Newsletter Strip ── */}
      <div className="border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-heading font-black text-[13px] uppercase tracking-[0.2em] text-[#00C896] mb-1">Join the Zone</p>
            <h3 className="font-heading font-black text-[28px] md:text-[36px] uppercase leading-none">
              Get Exclusive <span className="text-[#00C896]">Deals</span>
            </h3>
          </div>
          <div className="flex w-full md:w-auto max-w-md">
            <input
              type="email"
              id="footer-email"
              placeholder="Enter your email address..."
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-5 py-3.5 rounded-l outline-none text-[14px] focus:border-[#00C896] transition-colors font-sans"
            />
            <button
              id="footer-subscribe-btn"
              className="bg-[#00C896] hover:bg-[#009b74] px-6 py-3.5 rounded-r font-heading font-black text-[13px] uppercase tracking-wide text-white transition-colors flex items-center gap-2 cursor-pointer"
            >
              Subscribe
              <ArrowRight size={15} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="flex flex-col gap-5">
          <Link to="/" className="flex items-center gap-2 w-fit group">
            <div className="w-9 h-9 bg-[#00C896] rounded-full flex items-center justify-center">
              <Zap size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <span className="font-heading font-black text-[22px] uppercase tracking-tight leading-none">
              Sport<span className="text-[#00C896]">Zone</span>
            </span>
          </Link>
          <p className="text-gray-400 text-[14px] leading-relaxed font-sans">
            Your ultimate destination for premium sports gear, athletic apparel, and performance equipment.
          </p>
          <div className="flex flex-col gap-2.5 text-[13px] text-gray-400">
            <a href="tel:+918001234567" className="flex items-center gap-2 hover:text-[#00C896] transition-colors">
              <Phone size={14} color="#00C896" /> +91 800 123 4567
            </a>
            <a href="mailto:hello@sportzone.in" className="flex items-center gap-2 hover:text-[#00C896] transition-colors">
              <Mail size={14} color="#00C896" /> hello@sportzone.in
            </a>
            <span className="flex items-center gap-2">
              <MapPin size={14} color="#00C896" /> Mumbai, India
            </span>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-heading font-black text-[15px] uppercase tracking-[0.15em] text-white mb-5">Categories</h4>
          <ul className="flex flex-col gap-3">
            {['Running & Jogging', 'Cricket Gear', 'Football', 'Cycling', 'Gym & Fitness', 'Swimming'].map(item => (
              <li key={item}>
                <Link
                  to="/products"
                  className="text-gray-400 text-[14px] hover:text-[#00C896] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-[#00C896] opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-heading font-black text-[15px] uppercase tracking-[0.15em] text-white mb-5">Quick Links</h4>
          <ul className="flex flex-col gap-3">
            {[
              { label: 'Shop All', to: '/products' },
              { label: 'About Us', to: '/about-contact' },
              { label: 'Contact', to: '/about-contact' },
              { label: 'Wishlist', to: '/wishlist' },
              { label: 'My Orders', to: '/profile' },
              { label: 'Return Policy', to: '/about-contact' },
            ].map(link => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="text-gray-400 text-[14px] hover:text-[#00C896] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-[#00C896] opacity-0 group-hover:opacity-100 transition-opacity" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-heading font-black text-[15px] uppercase tracking-[0.15em] text-white mb-5">Follow Us</h4>
          <p className="text-gray-400 text-[13px] leading-relaxed mb-5">
            Stay connected for the latest drops, athlete stories, and exclusive offers.
          </p>
          <div className="flex gap-3">
            {[
              { Icon: Instagram, label: 'Instagram', color: '#E1306C' },
              { Icon: Youtube, label: 'YouTube', color: '#FF0000' },
              { Icon: Twitter, label: 'Twitter/X', color: '#1DA1F2' },
              { Icon: Facebook, label: 'Facebook', color: '#1877F2' },
            ].map(({ Icon, label, color }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#00C896] transition-all group cursor-pointer"
              >
                <Icon size={17} strokeWidth={1.8} />
              </a>
            ))}
          </div>

          {/* Promo Tag */}
          <div className="mt-6 p-4 rounded-xl border border-[#00C896]/30 bg-[#00C896]/8">
            <p className="font-heading font-black text-[#00C896] text-[12px] uppercase tracking-wider mb-1">First Order?</p>
            <p className="text-white text-[13px] font-sans">Use code <span className="font-heading font-black text-[#F5A623]">SPORT10</span> for 10% off</p>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-[12px] font-sans">
            © 2026 SportZone. All rights reserved. Crafted with ❤️ in India.
          </p>
          <div className="flex items-center gap-5 text-[12px] text-gray-500">
            <Link to="/about-contact" className="hover:text-[#00C896] transition-colors">Privacy Policy</Link>
            <Link to="/about-contact" className="hover:text-[#00C896] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
