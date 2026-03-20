import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Search, Bell, User } from 'lucide-react';

const AdminLayout = () => {
  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      <AdminSidebar />
      
      <div className="flex-1 min-w-0 flex flex-col bg-[#F8F9FA]">
        {/* Content Area */}
        <main className="p-10 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
