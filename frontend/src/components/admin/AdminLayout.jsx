// AdminLayout.jsx – Sporty Admin Foundation
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return (
      <div className="h-screen w-screen bg-[#0D1B2A] flex flex-col items-center justify-center font-heading font-black text-[#00C896] uppercase tracking-[0.5em] animate-pulse">
        Establishing Link...
      </div>
  );

  // Fallback protection (though AdminRoute already handles this)
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  return (
    <div className="flex bg-[#F1F3F5] min-h-screen font-sans selection:bg-[#00C896]/30">
      
      {/* ── Fixed Sidebar ── */}
      <AdminSidebar />
      
      {/* ── Tactical Content Node ── */}
      <div className="flex-1 min-w-0 flex flex-col relative">
        
        {/* Decorative Grid Overlay (Subtle) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
            style={{ backgroundImage: 'radial-gradient(#0D1B2A 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />

        <main className="p-10 md:p-14 lg:p-16 flex-1 relative z-10">
          <AnimatePresence mode="wait">
             <motion.div
                key={window.location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: 'circOut' }}
             >
                <Outlet />
             </motion.div>
          </AnimatePresence>
        </main>

        <footer className="px-16 py-8 border-t border-gray-100 flex justify-between items-center text-[9px] font-heading font-black uppercase tracking-[0.2em] text-gray-300">
            <span>SportZone Gear Command v2.0 - Tactical Operations</span>
            <span>Perimeter Secure: {new Date().toLocaleTimeString()}</span>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
