// src/pages/admin/Customers.jsx – Sporty Revamp
import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Mail, Calendar, ChevronRight, Zap, ShieldCheck, Trophy, Target 
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
      if (res.success) setCustomers(res.data.users || []);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b-4 border-[#0D1B2A] pb-8">
        <div>
          <h1 className="font-heading font-black text-5xl tracking-tighter uppercase leading-none text-[#0D1B2A]">Athlete <span className="text-[#00C896]">Roster</span></h1>
          <p className="text-gray-400 font-heading font-black uppercase tracking-[0.2em] text-[10px] mt-3">Community membership & profile management</p>
        </div>
        <div className="flex bg-[#0D1B2A] text-[#00C896] px-8 py-5 rounded-2xl border-2 border-[#00C896]/20 shadow-xl">
           <div className="flex flex-col">
              <p className="text-[10px] font-heading font-black uppercase tracking-widest leading-none m-0 opacity-50">Active Squad</p>
              <p className="text-3xl font-heading font-black m-0 mt-2 leading-none flex items-center gap-2">{customers.length} <Users size={20} /></p>
           </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border-2 border-gray-100 shadow-sm overflow-hidden">
        <div className="relative group mb-12">
            <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#00C896] transition-colors" />
            <input type="text" placeholder="Scan roster by name, email, or athlete ID..." 
                className="w-full bg-gray-50 border-2 border-transparent focus:border-[#00C896] focus:bg-white outline-none rounded-[1.5rem] py-6 pl-16 pr-8 font-heading font-black uppercase text-xs tracking-widest transition-all shadow-inner"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             [1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-gray-50 rounded-[2.5rem] animate-pulse"></div>)
          ) : filteredCustomers.length === 0 ? (
             <div className="col-span-full py-32 text-center bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100">
                <Users size={64} strokeWidth={1} className="text-gray-100 mx-auto mb-6" />
                <p className="text-gray-300 font-heading font-black uppercase tracking-widest text-xs">No matching athletes in current sector</p>
             </div>
          ) : (
            filteredCustomers.map((user) => (
              <div key={user.id} className="bg-white border-2 border-gray-50 rounded-[2.5rem] p-8 hover:border-[#00C896]/30 transition-all group relative overflow-hidden flex flex-col justify-between hover:shadow-2xl">
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                    <div className="w-10 h-10 bg-[#0D1B2A] text-[#00C896] rounded-full flex items-center justify-center shadow-lg"><Zap size={20} fill="currentColor" /></div>
                </div>

                <div>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-16 h-16 bg-[#0D1B2A] text-white rounded-2xl flex items-center justify-center font-heading font-black text-2xl group-hover:bg-[#00C896] group-hover:text-[#0D1B2A] transition-colors shadow-xl group-hover:rotate-6">
                      {(user.name || user.email || 'A')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="font-heading font-black uppercase tracking-tighter text-xl truncate m-0 group-hover:text-[#00C896] transition-colors">{user.name || 'Anonymous'}</h3>
                      <div className="flex items-center gap-2 mt-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${user.role === 'admin' ? 'bg-[#00C896] shadow-[0_0_8px_#00C896]' : 'bg-gray-200'}`}></span>
                          <p className="text-[10px] text-gray-400 font-heading font-black uppercase tracking-widest">{user.role}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-3 text-gray-300 group-hover:text-gray-500 transition-colors">
                      <Mail size={14} className="group-hover:text-[#00C896]" />
                      <span className="text-[10px] font-heading font-black uppercase truncate tracking-tight">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <Calendar size={14} />
                      <span className="text-[10px] font-heading font-black uppercase tracking-tight">Inducted {new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50 flex justify-between items-end">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-heading font-black uppercase tracking-widest text-gray-300 mb-1">Total Valuation</span>
                      <span className="text-2xl font-heading font-black tracking-tighter text-[#0D1B2A]">₹0</span>
                   </div>
                   <button className="h-12 w-12 bg-gray-50 hover:bg-[#0D1B2A] hover:text-[#00C896] rounded-xl flex items-center justify-center transition-all border-none cursor-pointer">
                      <ChevronRight size={20} strokeWidth={3} />
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
