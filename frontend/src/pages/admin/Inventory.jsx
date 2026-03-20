import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Search, 
  AlertTriangle, 
  ArrowUp, 
  ArrowDown, 
  History,
  RotateCcw,
  Package,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { productsApi } from '../../services/api';

const AdminInventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await productsApi.list(1); // Fetch first page
      if (res.success) {
        setItems(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const lowStock = items.filter(i => i.stock < 10 && i.stock > 0);
  const outOfStock = items.filter(i => i.stock === 0);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase m-0">Inventory Control</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Manage stock levels & logistics</p>
        </div>
        <div className="flex gap-4">
             <button className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-100 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-all cursor-pointer">
                <History size={16} /> Movement Log
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-red-50 p-8 rounded-[32px] border border-red-100 text-red-600 relative overflow-hidden group">
              <div className="absolute top-[-20px] right-[-20px] opacity-10 group-hover:scale-110 transition-transform">
                  <AlertCircle size={120} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">Out of Stock</p>
              <h3 className="text-4xl font-black m-0 relative z-10">{outOfStock.length}</h3>
              <p className="text-xs font-bold mt-4 relative z-10 uppercase tracking-tighter">Immediate restock required</p>
          </div>
          
          <div className="bg-orange-50 p-8 rounded-[32px] border border-orange-100 text-orange-600 relative overflow-hidden group">
              <div className="absolute top-[-20px] right-[-20px] opacity-10 group-hover:scale-110 transition-transform">
                  <AlertTriangle size={120} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">Low Stock Alert</p>
              <h3 className="text-4xl font-black m-0 relative z-10">{lowStock.length}</h3>
              <p className="text-xs font-bold mt-4 relative z-10 uppercase tracking-tighter">Below threshold of 10 units</p>
          </div>

          <div className="bg-green-50 p-8 rounded-[32px] border border-green-100 text-green-600 relative overflow-hidden group">
              <div className="absolute top-[-20px] right-[-20px] opacity-10 group-hover:scale-110 transition-transform">
                  <CheckCircle size={120} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">Healthy Level</p>
              <h3 className="text-4xl font-black m-0 relative z-10">{items.length - lowStock.length - outOfStock.length}</h3>
              <p className="text-xs font-bold mt-4 relative z-10 uppercase tracking-tighter">Optimized stock levels</p>
          </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden p-10">
          <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black tracking-tighter uppercase m-0">Critical Inventory List</h3>
              <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                  <button className="px-5 py-2 bg-white rounded-lg shadow-sm text-[10px] font-black uppercase text-primary border-none cursor-pointer">All Items</button>
                  <button className="px-5 py-2 text-[10px] font-black uppercase text-gray-400 hover:text-primary transition-colors border-none bg-none cursor-pointer">Deficit Only</button>
              </div>
          </div>

          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="border-b border-gray-50">
                          <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-300">Product Line</th>
                          <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-300">SKU</th>
                          <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-300">Current Stock</th>
                          <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-300 text-center">Trend</th>
                          <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-300">Replenishment</th>
                          <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-300 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                      {loading ? (
                         <tr><td colSpan="6" className="py-20 text-center text-gray-300 animate-pulse font-black uppercase tracking-widest">Scanning inventory...</td></tr>
                      ) : items.length === 0 ? (
                        <tr><td colSpan="6" className="py-20 text-center"><Package size={48} className="text-gray-100 mx-auto" /></td></tr>
                      ) : (
                        items.map(item => (
                            <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="py-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gray-100 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                                            <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="m-0 font-bold text-sm uppercase tracking-tight">{item.name}</p>
                                            <p className="m-0 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.category}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-8 text-xs font-bold text-gray-400 uppercase">#{item.id.split('-')[0]}</td>
                                <td className="py-8">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-base font-black ${item.stock < 10 ? 'text-red-500' : 'text-primary'}`}>{item.stock}</span>
                                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Units</span>
                                    </div>
                                </td>
                                <td className="py-8 text-center">
                                    <div className="inline-flex items-center gap-1 text-red-500 bg-red-50 px-3 py-1 rounded-lg">
                                        <ArrowDown size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">High Vol</span>
                                    </div>
                                </td>
                                <td className="py-8">
                                    <div className="w-40 bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.stock < 10 ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${Math.min(100, (item.stock / 50) * 100)}%` }}></div>
                                    </div>
                                </td>
                                <td className="py-8 text-right">
                                    <button className="px-6 py-3 bg-white border-2 border-primary rounded-xl text-[10px] font-black uppercase text-primary hover:bg-primary hover:text-white transition-all shadow-[2px_2px_0px_#ccc] cursor-pointer active:translate-y-1 active:shadow-none">
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
