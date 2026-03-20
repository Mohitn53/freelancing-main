import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  ShoppingBag,
  MoreHorizontal,
  ChevronRight
} from 'lucide-react';
import { adminApi } from '../../services/api';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.listUsers();
      if (res.success) {
        setCustomers(res.data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tighter uppercase m-0">Customer Base</h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Manage your community member data</p>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-center mb-10">
          <div className="relative flex-1 group w-full">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or email address..."
              className="w-full bg-gray-50 border border-transparent focus:border-primary focus:bg-white outline-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
             <div className="bg-primary/5 px-6 py-4 rounded-2xl border border-primary/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary leading-none m-0">Total Active</p>
                <p className="text-2xl font-black text-primary m-0 mt-1 leading-none">{customers.length}</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             [1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-gray-50 rounded-3xl animate-pulse"></div>)
          ) : filteredCustomers.length === 0 ? (
             <div className="col-span-full py-20 text-center">
                <Users size={48} className="text-gray-100 mx-auto mb-4" />
                <p className="text-gray-300 font-bold uppercase tracking-widest text-xs">No matching customers found</p>
             </div>
          ) : (
            filteredCustomers.map((user) => (
              <div key={user.id} className="bg-white border border-gray-100 rounded-[32px] p-8 hover:border-primary hover:shadow-xl transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-gray-100 rounded-full border-none bg-none cursor-pointer text-gray-400">
                        <MoreHorizontal size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="text-2xl font-black uppercase">{(user.name || user.email || 'U')[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="m-0 font-black uppercase tracking-tighter text-lg truncate">{user.name || 'Anonymous'}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-2 h-2 rounded-full ${user.role === 'admin' ? 'bg-indigo-500' : 'bg-green-500'}`}></span>
                        <p className="m-0 text-[10px] text-gray-400 font-black uppercase tracking-widest">{user.role}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-400 group-hover:text-primary transition-colors">
                    <Mail size={16} />
                    <span className="text-xs font-bold truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <Calendar size={16} />
                    <span className="text-xs font-bold">Joined {new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-50 flex justify-between items-center">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Total Spent</span>
                      <span className="text-lg font-black tracking-tighter">₹0</span>
                   </div>
                   <button className="flex items-center gap-1 px-4 py-2 bg-gray-50 hover:bg-black hover:text-white rounded-xl text-[10px] font-black uppercase transition-all border-none cursor-pointer">
                      Profile <ChevronRight size={14} />
                   </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
