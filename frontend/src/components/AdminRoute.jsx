import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1B2A]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-[#00C896] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(0,200,150,0.3)]"></div>
          <p className="font-heading font-black uppercase tracking-[0.4em] text-[10px] text-[#00C896]">Verifying Secure Link...</p>
        </div>
      </div>
    );
  }

  // Check if logged in AND role is admin
  const isAdmin = token && user && user.role === 'admin';

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
