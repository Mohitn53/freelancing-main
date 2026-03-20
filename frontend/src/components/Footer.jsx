import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-secondary py-16 mt-20">
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 flex flex-col md:flex-row justify-between items-start gap-12">
        {/* Logo & Desc */}
        <div className="max-w-[300px] flex flex-col gap-4">
          <Link to="/" className="font-sans font-extrabold text-3xl tracking-tighter lowercase text-secondary transition-transform hover:scale-105 inline-block w-fit">
            dr⋆p.code
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed">
            Take Your Fashion Game to the Next Level with Our Minimal Streetwear Collection.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-16">
          <div className="flex flex-col gap-4 text-sm text-gray-400">
            <Link to="/about-contact" className="hover:text-white transition-colors">About & Contact</Link>
            <Link to="/products" className="hover:text-white transition-colors">Shop</Link>
          </div>
          <div className="flex flex-col gap-4 text-sm text-gray-400">
            <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-4">
          <h4 className="font-sans font-medium text-base tracking-tight text-white m-0">Join Our News Collection</h4>
          <div className="flex items-center border-b border-gray-600 pb-2">
            <input 
              type="email" 
              placeholder="Enter your email ->" 
              className="bg-transparent border-none text-white flex-1 outline-none font-sans text-sm placeholder:text-gray-500" 
            />
            <button className="flex items-center hover:opacity-80 transition-opacity">
              <ArrowRight size={18} color="#fff" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
