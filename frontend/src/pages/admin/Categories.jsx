// src/pages/admin/Categories.jsx – Sporty Revamp
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Layers, X, Zap, ShieldCheck } from 'lucide-react';
import { categoryApi } from '../../services/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [catName, setCatName] = useState('');

  const fetchCats = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.list();
      if (res.success) setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCats(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editCat) await categoryApi.update(editCat.id, { name: catName });
      else await categoryApi.create({ name: catName });
      setShowModal(false);
      setCatName('');
      setEditCat(null);
      fetchCats();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Purge this classification? All linked gear will lose their category tag.')) {
      try {
        await categoryApi.delete(id);
        fetchCats();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="max-w-5xl space-y-12 animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b-4 border-[#0D1B2A] pb-8">
        <div>
          <h1 className="font-heading font-black text-5xl tracking-tighter uppercase leading-none text-[#0D1B2A]">Class <span className="text-[#00C896]">Manager</span></h1>
          <p className="text-gray-400 font-heading font-black uppercase tracking-[0.2em] text-[10px] mt-3">Define and categorize elite gear collections</p>
        </div>
        <button 
          onClick={() => { setEditCat(null); setCatName(''); setShowModal(true); }}
          className="bg-[#00C896] text-[#0D1B2A] px-10 py-5 rounded-2xl font-heading font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-all flex items-center gap-3 group"
        >
          <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform" /> Add Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
             [1,2,3].map(i => <div key={i} className="h-40 bg-gray-50 rounded-[2rem] animate-pulse border-2 border-gray-100"></div>)
        ) : categories.length === 0 ? (
             <div className="col-span-full py-32 text-center bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100">
                <Layers size={64} strokeWidth={1} className="text-gray-200 mx-auto mb-6" />
                <p className="text-gray-300 font-heading font-black uppercase tracking-widest text-xs">No classifications detected in grid</p>
             </div>
        ) : (
          categories.map((cat) => (
            <motion.div 
              key={cat.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-50 shadow-sm flex flex-col justify-between group hover:border-[#00C896]/30 transition-all hover:shadow-xl group"
            >
              <div className="flex items-center gap-6 mb-8">
                <div className="w-14 h-14 bg-[#0D1B2A] rounded-2xl flex items-center justify-center text-[#00C896] shadow-lg group-hover:rotate-6 transition-transform">
                  <Layers size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-heading font-black uppercase tracking-tighter text-2xl group-hover:text-[#00C896] transition-colors">{cat.name}</h3>
                  <p className="text-[9px] text-gray-300 font-heading font-black uppercase tracking-widest mt-1">ID: {cat.id.slice(0,8)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 pt-6 border-t border-gray-50">
                <button 
                  onClick={() => { setEditCat(cat); setCatName(cat.name); setShowModal(true); }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-[#00C896] hover:text-[#0D1B2A] rounded-xl transition-all text-gray-400 font-heading font-black uppercase text-[10px] tracking-widest disabled:opacity-30 border-none cursor-pointer"
                >
                  <Edit2 size={14} /> Update
                </button>
                <button 
                  onClick={() => handleDelete(cat.id)}
                  className="p-3 bg-gray-50 hover:bg-red-500 hover:text-white rounded-xl transition-all text-gray-400 border-none cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-[#0D1B2A]/60 backdrop-blur-md" />
            
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-md bg-white rounded-[3.5rem] shadow-2xl overflow-hidden p-12 border-b-8 border-[#00C896]"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="font-heading font-black text-3xl uppercase tracking-tighter m-0">
                    {editCat ? 'Modify Class' : 'Register Class'}
                </h2>
                <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full border-none cursor-pointer text-gray-300">
                    <X size={20} strokeWidth={3} />
                </button>
              </div>
              
              <form onSubmit={handleSave} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-heading font-black uppercase tracking-widest text-gray-300 pl-1">Designation Label</label>
                  <input type="text" required autoFocus placeholder="e.g. PERFORMANCE" value={catName} onChange={(e) => setCatName(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#00C896] outline-none px-6 py-5 rounded-2xl font-heading font-black uppercase tracking-tight text-xl transition-all" />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-[#0D1B2A] text-white py-5 rounded-2xl font-heading font-black uppercase tracking-widest text-xs shadow-xl hover:bg-[#00C896] hover:text-[#0D1B2A] transition-all border-none cursor-pointer group">
                    {editCat ? 'Update Record' : 'Initiate Category'} <Zap size={14} className="inline ml-2 group-hover:fill-current" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCategories;
