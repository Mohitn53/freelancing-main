// src/pages/admin/Inventory.jsx – Sporty Revamp
import React, { useState, useEffect } from 'react';
import { 
  Box, Search, AlertTriangle, ArrowUp, ArrowDown, History, RotateCcw, Package, 
  CheckCircle, AlertCircle, Zap, ShieldCheck, Trophy, BadgeAlert
} from 'lucide-react';
import { productsApi } from '../../services/api';

const AdminInventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await productsApi.list(1);
      if (res.success) setItems(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  const lowStock = items.filter(i => i.stock < 10 && i.stock > 0);
  const outOfStock = items.filter(i => i.stock === 0);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b-4 border-[#0D1B2A] pb-8">
        <div>
          <h1 className="font-heading font-black text-5xl tracking-tighter uppercase leading-none text-[#0D1B2A]">Inventory <span className="text-[#00C896]">Control</span></h1>
          <p className="text-gray-400 font-heading font-black uppercase tracking-[0.2em] text-[10px] mt-3">Advanced stock levels & movement management</p>
        </div>
        <div className="flex gap-4">
             <button className="flex items-center gap-3 px-8 py-5 bg-white border-2 border-gray-100 rounded-2xl font-heading font-black uppercase tracking-widest text-[10px] hover:border-[#00C896] hover:text-[#00C896] transition-all cursor-pointer shadow-sm">
                <History size={16} strokeWidth={3} /> Movement Log
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Depleted Stock', value: outOfStock.length, bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-500/10', icon: AlertCircle, sub: 'Immediate restocking required' },
            { label: 'Deficit Alert', value: lowStock.length, bg: 'bg-orange-500/10', text: 'text-orange-600', border: 'border-orange-500/10', icon: AlertTriangle, sub: 'Critical units below threshold' },
            { label: 'Healthy Supply', value: items.length - lowStock.length - outOfStock.length, bg: 'bg-[#00C896]/10', text: 'text-[#00C896]', border: 'border-[#00C896]/10', icon: ShieldCheck, sub: 'Optimized logistics status' }
          ].map((s, i) => (
            <div key={i} className={`${s.bg} p-10 rounded-[3rem] border-2 ${s.border} relative overflow-hidden group shadow-sm flex flex-col justify-between h-56 transition-all hover:shadow-xl`}>
                 <div className="absolute top-[-20px] right-[-20px] p-4 text-current opacity-5 group-hover:scale-110 transition-transform scale-150 rotate-12"><s.icon size={140} strokeWidth={1} /></div>
                 <div>
                    <p className="text-[10px] font-heading font-black uppercase tracking-widest mb-3 relative z-10 opacity-70">{s.label}</p>
                    <h3 className={`text-6xl font-heading font-black tracking-tighter relative z-10 leading-none ${s.text}`}>{s.value}</h3>
                 </div>
                 <p className={`text-[10px] font-heading font-black mt-8 relative z-10 uppercase tracking-widest truncate ${s.text} opacity-50`}>{s.sub}</p>
            </div>
          ))}
      </div>

      <div className="bg-white rounded-[3rem] border-2 border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-6 items-center bg-gray-50/20">
              <h3 className="font-heading font-black text-2xl tracking-tighter uppercase m-0 text-[#0D1B2A]">Critical <span className="text-[#00C896]">List</span></h3>
              <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-100 ml-auto scale-95 md:scale-100">
                  <button className="px-6 py-3 bg-white text-[#0D1B2A] rounded-xl shadow-lg text-[10px] font-heading font-black uppercase border-none cursor-pointer">Global Feed</button>
                  <button className="px-6 py-3 text-gray-400 hover:text-[#0D1B2A] transition-colors rounded-xl font-heading font-black uppercase text-[10px] border-none bg-none cursor-pointer">Deficit Only</button>
              </div>
          </div>

          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="bg-[#0D1B2A] text-white">
                          <th className="px-10 py-6 text-[10px] font-heading font-black uppercase tracking-widest">Equipment Line</th>
                          <th className="px-10 py-6 text-[10px] font-heading font-black uppercase tracking-widest">SKU Tag</th>
                          <th className="px-10 py-6 text-[10px] font-heading font-black uppercase tracking-widest">Storage Status</th>
                          <th className="px-10 py-6 text-[10px] font-heading font-black uppercase tracking-widest text-center">Velocity</th>
                          <th className="px-10 py-6 text-[10px] font-heading font-black uppercase tracking-widest">Supply Band</th>
                          <th className="px-10 py-6 text-[10px] font-heading font-black uppercase tracking-widest text-right">Action Protocol</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                      {loading ? (
                         <tr><td colSpan="6" className="py-24 text-center text-gray-200 animate-pulse font-heading font-black uppercase tracking-widest text-lg">Scanning perimeter...</td></tr>
                      ) : items.length === 0 ? (
                        <tr><td colSpan="6" className="py-24 text-center"><Package size={80} strokeWidth={1} className="text-gray-100 mx-auto" /></td></tr>
                      ) : (
                        items.map(item => (
                            <tr key={item.id} className="group hover:bg-gray-50/50 transition-all">
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden shrink-0 border-2 border-gray-50 group-hover:rotate-2 transition-transform">
                                            <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-heading font-black text-sm uppercase tracking-tight text-[#0D1B2A]">{item.name}</p>
                                            <p className="text-[10px] text-gray-300 font-heading font-black uppercase tracking-widest mt-1">{item.category}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <span className="text-[10px] font-heading font-black uppercase text-gray-300 tracking-widest truncate max-w-[80px] block">#{item.id.slice(0,8)}</span>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex items-end gap-2">
                                        <span className={`text-2xl font-heading font-black leading-none ${item.stock < 10 ? 'text-red-500' : 'text-[#0D1B2A]'}`}>{item.stock}</span>
                                        <span className="text-[10px] font-heading font-black text-gray-300 uppercase tracking-widest pb-0.5">Units</span>
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-center text-red-500">
                                    <div className="inline-flex items-center gap-2 bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/20">
                                        <ArrowDown size={14} strokeWidth={3} />
                                        <span className="text-[9px] font-heading font-black uppercase tracking-widest">High Vol</span>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="w-40 bg-gray-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                                        <div className={`h-full ${item.stock < 10 ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-[#00C896]'} transition-all`} style={{ width: `${Math.min(100, (item.stock / 50) * 100)}%` }}></div>
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    <button className="px-8 py-4 bg-white border-2 border-[#0D1B2A] text-[#0D1B2A] hover:bg-[#00C896] hover:border-[#00C896] hover:text-[#0D1B2A] rounded-2xl font-heading font-black uppercase text-[10px] tracking-widest transition-all shadow-xl active:scale-95 cursor-pointer">
                                        Quick Restock
                                    </button>
                                </td>
                            </tr>
                        ))
                      )}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};

export default AdminInventory;
