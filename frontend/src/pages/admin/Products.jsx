// src/pages/admin/Products.jsx – Sporty Revamp
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Filter, MoreHorizontal, Edit2, Trash2, ExternalLink, 
  ChevronLeft, ChevronRight, Package, AlertCircle, Zap, ShieldCheck 
} from 'lucide-react';
import { productsApi, categoryApi } from '../../services/api';

const fmt = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '', category: 'Cricket', price: '', stock: '', image_url: '', description: ''
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryApi.list();
        if (res.success) setCategories(res.data);
      } catch (err) { console.error('Failed to fetch categories:', err); }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name || '',
        category: editProduct.category || 'Cricket',
        price: editProduct.price || '',
        stock: editProduct.stock || '',
        image_url: editProduct.image_url || '',
        description: editProduct.description || ''
      });
    } else {
      setFormData({ name: '', category: 'Cricket', price: '', stock: '', image_url: '', description: '' });
    }
  }, [editProduct, showModal]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productsApi.list(page);
      if (res.success) setProducts(res.data || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id) => {
    if (window.confirm('Purge this gear from the catalog?')) {
      try {
        await productsApi.delete(id);
        fetchProducts();
      } catch (err) {
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) };
      let res = editProduct ? await productsApi.update(editProduct.id, payload) : await productsApi.create(payload);
      if (res.success) {
        setShowModal(false);
        fetchProducts();
      }
    } catch (err) {
      alert('Failed to save product: ' + err.message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b-4 border-[#0D1B2A] pb-8">
        <div>
          <h1 className="font-heading font-black text-5xl tracking-tighter uppercase leading-none">Gear <span className="text-[#00C896]">Command</span></h1>
          <p className="text-gray-400 font-heading font-black uppercase tracking-[0.2em] text-[10px] mt-3">Elite Equipment Management Portal</p>
        </div>
        <button 
          onClick={() => { setEditProduct(null); setShowModal(true); }}
          className="bg-[#00C896] text-[#0D1B2A] px-10 py-5 rounded-2xl font-heading font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 group"
        >
          <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform" /> New Release
        </button>
      </div>

      {/* Control Strip */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        <div className="relative flex-1 group">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#00C896] transition-colors" />
          <input 
            type="text" 
            placeholder="Scan catalog by name, UID, or category..."
            className="w-full bg-white border-2 border-gray-100 rounded-2xl py-5 pl-14 pr-6 font-heading font-black uppercase text-xs tracking-widest outline-none focus:border-[#00C896] transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-3 px-8 bg-[#0D1B2A] text-[#00C896] rounded-2xl font-heading font-black uppercase tracking-widest text-[10px] hover:bg-[#1a2d42] transition-all">
            <Filter size={14} /> Filter
          </button>
          <button className="flex items-center gap-3 px-8 bg-white border-2 border-gray-100 text-gray-400 rounded-2xl font-heading font-black uppercase tracking-widest text-[10px] hover:border-[#00C896] hover:text-[#00C896] transition-all">
            Export <Zap size={14} fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Grid Display */}
      <div className="bg-white rounded-[2.5rem] border-2 border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#0D1B2A] text-white">
                <th className="px-8 py-6 font-heading font-black uppercase tracking-widest text-[10px] text-left">Equipment</th>
                <th className="px-8 py-6 font-heading font-black uppercase tracking-widest text-[10px] text-left">Classification</th>
                <th className="px-8 py-6 font-heading font-black uppercase tracking-widest text-[10px] text-left">Valuation</th>
                <th className="px-8 py-6 font-heading font-black uppercase tracking-widest text-[10px] text-left">Storage</th>
                <th className="px-8 py-6 font-heading font-black uppercase tracking-widest text-[10px] text-left">Status</th>
                <th className="px-8 py-6 font-heading font-black uppercase tracking-widest text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-8 py-10"><div className="h-4 bg-gray-50 rounded w-full"></div></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-24 text-center">
                    <Package size={64} strokeWidth={1} className="mx-auto text-gray-100 mb-4" />
                    <p className="font-heading font-black uppercase tracking-widest text-xs text-gray-300">No equipment registered in perimeter</p>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="group hover:bg-gray-50/50 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-[1.25rem] bg-gray-100 overflow-hidden shrink-0 border-2 border-gray-50 group-hover:rotate-2 transition-transform">
                          <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-heading font-black text-sm uppercase tracking-tight text-[#0D1B2A] group-hover:text-[#00C896] transition-colors">{p.name}</p>
                          <p className="text-[9px] text-gray-300 font-heading font-black uppercase tracking-widest mt-1">UID: {p.id.slice(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-1.5 bg-[#0D1B2A]/5 rounded-full text-[9px] font-heading font-black uppercase tracking-widest text-gray-400">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-heading font-black text-sm text-[#0D1B2A]">
                      {fmt(p.price)}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <span className={`text-[10px] font-heading font-black uppercase tracking-widest ${p.stock < 10 ? 'text-red-500' : 'text-gray-400'}`}>
                          {p.stock} UNITS
                        </span>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${p.stock < 10 ? 'bg-red-500' : 'bg-[#00C896]'}`} style={{ width: `${Math.min(100, (p.stock / 50) * 100)}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${p.stock > 0 ? 'bg-[#00C896]/10 border-[#00C896]/20 text-[#00C896]' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${p.stock > 0 ? 'bg-[#00C896]' : 'bg-red-500'} animate-pulse`}></div>
                        <span className="text-[9px] font-heading font-black uppercase tracking-widest">
                          {p.stock > 0 ? 'Active' : 'Missing'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                        <button onClick={() => { setEditProduct(p); setShowModal(true); }} className="p-3 bg-white text-gray-400 hover:text-[#00C896] hover:shadow-lg rounded-xl transition-all border border-gray-100 cursor-pointer">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-3 bg-white text-gray-400 hover:text-red-500 hover:shadow-lg rounded-xl transition-all border border-gray-100 cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <MoreHorizontal size={18} className="text-gray-200 group-hover:hidden" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Action Bar Footer */}
        <div className="px-8 py-8 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <p className="text-[10px] font-heading font-black text-gray-300 uppercase tracking-widest">
            Tracking <span className="text-[#0D1B2A]">{products.length}</span> Active Items in Grid
          </p>
          <div className="flex items-center gap-3">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-3 rounded-xl border-2 border-gray-200 text-gray-400 hover:border-[#00C896] hover:text-[#00C896] transition-all disabled:opacity-20 bg-white">
              <ChevronLeft size={16} strokeWidth={3} />
            </button>
            <div className="min-w-[40px] h-10 flex items-center justify-center bg-[#0D1B2A] text-[#00C896] rounded-xl text-xs font-heading font-black shadow-lg">
              {page}
            </div>
            <button disabled={products.length < 10} onClick={() => setPage(p => p + 1)} className="p-3 rounded-xl border-2 border-gray-200 text-gray-400 hover:border-[#00C896] hover:text-[#00C896] transition-all disabled:opacity-20 bg-white">
              <ChevronRight size={16} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Overlay Upgrade */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-[#0D1B2A]/60 backdrop-blur-md" />
            
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10 md:p-14 border-b-8 border-[#00C896]"
            >
              <h2 className="font-heading font-black text-4xl uppercase tracking-tighter mb-10 flex items-center gap-3">
                {editProduct ? 'Modify Release' : 'Initiate Release'} <ShieldCheck size={28} className="text-[#00C896]" />
              </h2>
              
              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-heading font-black uppercase tracking-widest text-gray-300 pl-1">Gear Designation</label>
                    <input type="text" required placeholder="Design name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-[#00C896] outline-none px-6 py-4 rounded-xl font-heading font-black uppercase text-xs" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-heading font-black uppercase tracking-widest text-gray-300 pl-1">Classification</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-[#00C896] outline-none px-6 py-4 rounded-xl font-heading font-black uppercase text-xs">
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      {categories.length === 0 && <option>Cricket</option>}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 text-white/50">
                  <div className="space-y-2">
                    <label className="text-[10px] font-heading font-black uppercase tracking-widest text-gray-300 pl-1">Metric Valuation (INR)</label>
                    <input type="number" required placeholder="0.00" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-[#00C896] outline-none px-6 py-4 rounded-xl font-heading font-black text-xs text-[#0D1B2A]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-heading font-black uppercase tracking-widest text-gray-300 pl-1">Storage Quota</label>
                    <input type="number" required placeholder="Quantity" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-[#00C896] outline-none px-6 py-4 rounded-xl font-heading font-black text-xs text-[#0D1B2A]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-heading font-black uppercase tracking-widest text-gray-300 pl-1">Visual Protocol (URL)</label>
                  <input type="text" required placeholder="https://..." value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#00C896] outline-none px-6 py-4 rounded-xl font-heading font-black text-xs text-[#0D1B2A]" />
                </div>

                <div className="pt-8 flex gap-4">
                  <button type="submit" className="flex-1 bg-[#0D1B2A] text-white py-5 rounded-2xl font-heading font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-[#00C896] hover:text-[#0D1B2A] transition-all border-none cursor-pointer">
                    {editProduct ? 'Commit Changes' : 'Execute Release'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="px-10 font-heading font-black text-[10px] uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors">Abort</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
