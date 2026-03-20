import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag, 
  Users, 
  Box, 
  BarChart3, 
  Tag, 
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: Layers, label: 'Categories', path: '/admin/categories' },
  { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
  { icon: Users, label: 'Customers', path: '/admin/customers' },
  { icon: Box, label: 'Inventory', path: '/admin/inventory' },
];

const AdminSidebar = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onLogout = () => {
    handleLogout();
    navigate('/login');
  };

  const stickyTop = isScrolled ? '70px' : '110px';
  const sidebarHeight = isScrolled ? 'calc(100vh - 70px)' : 'calc(100vh - 110px)';

  return (
    <div 
      style={{ top: stickyTop, height: sidebarHeight }}
      className="w-72 shrink-0 bg-primary text-white sticky flex flex-col border-r border-white/5 overflow-y-auto transition-all duration-300 z-40"
    >
      {/* Logo Area */}
      <div className="p-10">
        <h1 className="text-2xl font-black tracking-tighter m-0 uppercase leading-none italic">
          DR<span className="text-gray-400 not-italic">⋆</span>P<span className="text-xs align-top ml-1 opacity-40">ADMIN</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) => `
              group flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300
              ${isActive 
                ? 'bg-white text-primary font-black shadow-[4px_4px_0px_#999]' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-4">
                  <item.icon size={20} strokeWidth={isActive ? 3 : 2} />
                  <span className="text-sm uppercase tracking-widest font-bold">{item.label}</span>
                </div>
                <ChevronRight 
                  size={14} 
                  className={`transition-transform duration-300 transform ${isActive ? 'rotate-90 text-primary' : 'group-hover:translate-x-1 opacity-0 group-hover:opacity-100'}`} 
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-6 mt-10">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-5 py-4 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all duration-300 font-bold uppercase tracking-widest text-xs border-none bg-none cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
