// AdminSidebar.jsx – Sporty "Gear Command" Sidebar
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  Layers, 
  ShoppingBag, 
  Users, 
  Box, 
  LogOut,
  ChevronRight,
  Zap,
  Target,
  Trophy
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { icon: Package, label: 'Products', path: '/admin/products', sub: 'Catalog' },
  { icon: Layers, label: 'Categories', path: '/admin/categories', sub: 'Sectors' },
  { icon: ShoppingBag, label: 'Orders', path: '/admin/orders', sub: 'Logistics' },
  { icon: Users, label: 'Customers', path: '/admin/customers', sub: 'Roster' },
  { icon: Box, label: 'Inventory', path: '/admin/inventory', sub: 'Supply' },
];

const AdminSidebar = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <div className="w-80 shrink-0 bg-[#0D1B2A] text-white flex flex-col border-r-4 border-[#00C896] h-screen sticky top-0 z-[100] overflow-hidden shadow-2xl">
      
      {/* ── Brand / Logo ── */}
      <div className="p-10 pb-16">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-1 bg-[#00C896] rounded-full" />
            <span className="text-[10px] font-heading font-black text-[#00C896] uppercase tracking-[0.3em]">Command Center</span>
        </div>
        <h1 className="font-heading font-black text-4xl uppercase tracking-tighter leading-none m-0">
          Gear <span className="text-[#00C896]">HQ</span>
        </h1>
        <p className="text-[9px] font-heading font-black text-white/30 uppercase tracking-widest mt-2 px-1">Tactical Inventory Operations</p>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-6 space-y-4">
        <p className="px-4 text-[9px] font-heading font-black text-white/20 uppercase tracking-[0.3em] mb-4">Core Protocols</p>
        
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              group relative flex items-center justify-between px-6 py-5 rounded-[1.5rem] transition-all duration-500
              ${isActive 
                ? 'bg-[#00C896] text-[#0D1B2A] shadow-[0_0_30px_rgba(0,200,150,0.2)]' 
                : 'text-white/40 hover:bg-white/5 hover:text-white'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-5 relative z-10">
                  <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-[#0D1B2A] text-[#00C896]' : 'bg-white/5 text-[#00C896]'}`}>
                    <item.icon size={20} strokeWidth={3} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-heading font-black uppercase tracking-widest">{item.label}</span>
                    <span className={`text-[9px] font-heading font-black uppercase tracking-widest transition-opacity ${isActive ? 'opacity-50' : 'opacity-0 group-hover:opacity-100'}`}>
                        {item.sub}
                    </span>
                  </div>
                </div>

                <div className={`transition-all duration-500 ${isActive ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>
                    <ChevronRight size={16} strokeWidth={4} />
                </div>

                {/* Background Glow on Active */}
                {isActive && (
                    <motion.div 
                        layoutId="activeGlow"
                        className="absolute inset-0 bg-[#00C896] rounded-[1.5rem] -z-10"
                        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                    />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Deployment Summary (Visual) ── */}
      <div className="px-10 py-10 bg-[#0D1B2A] border-t border-white/5 mt-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
              <Trophy size={80} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-heading font-black text-white/30 uppercase tracking-widest mb-4">Mission Status</p>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#00C896] animate-pulse" />
                <span className="text-[11px] font-heading font-black text-white uppercase tracking-widest">Active Link</span>
            </div>
            
            <button 
                onClick={onLogout}
                className="w-full flex items-center justify-between px-6 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all duration-300 font-heading font-black uppercase tracking-widest text-[10px] border-none bg-none cursor-pointer group/btn"
            >
                <div className="flex items-center gap-3">
                    <LogOut size={16} strokeWidth={3} />
                    <span>Terminate Session</span>
                </div>
                <Zap size={14} fill="currentColor" className="opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </button>
          </div>
      </div>

    </div>
  );
};

export default AdminSidebar;
