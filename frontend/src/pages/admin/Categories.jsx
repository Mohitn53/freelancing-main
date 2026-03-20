import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Layers,
  MoreVertical,
  X
} from 'lucide-react';
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
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editCat) {
        await categoryApi.update(editCat.id, { name: catName });
      } else {
        await categoryApi.create({ name: catName });
      }
      setShowModal(false);
      setCatName('');
      setEditCat(null);
      fetchCats();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category? Products won\'t be affected but cannot delete if category has active products.')) {
      try {
        await categoryApi.delete(id);
        fetchCats();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="max-w-4xl space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase m-0">Category Manager</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Classify your collections</p>
        </div>
        <button 
          onClick={() => { setEditCat(null); setCatName(''); setShowModal(true); }}
          className="bg-primary text-white border-none px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_#ccc] hover:translate-y-[-2px] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
             [1,2,3].map(i => (
                <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-gray-100"></div>
             ))
        ) : categories.length === 0 ? (
             <div className="col-span-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                <Layers size={48} className="text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No categories created yet</p>
             </div>
        ) : (
          categories.map((cat) => (
            <motion.div 
              key={cat.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                  <Layers size={24} />
                </div>
                <div>
                  <h3 className="m-0 font-black uppercase tracking-tighter text-lg">{cat.name}</h3>
                  <p className="m-0 text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">ID: {cat.id.split('-')[0]}...</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { setEditCat(cat); setCatName(cat.name); setShowModal(true); }}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-primary border-none bg-none cursor-pointer"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(cat.id)}
                  className="p-3 hover:bg-red-50 rounded-xl transition-colors text-gray-400 hover:text-red-500 border-none bg-none cursor-pointer"
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
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-md"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden p-10"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter m-0">
                    {editCat ? 'Update Class' : 'New Class'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full border-none bg-none cursor-pointer text-gray-400">
                    <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Category Label</label>
                  <input 
                    type="text" 
                    required
                    autoFocus
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-primary outline-none px-6 py-5 rounded-2xl font-black uppercase tracking-tight text-lg transition-all" 
                    placeholder="e.g. OUTERWEAR"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:translate-y-1 transition-all border-none cursor-pointer">
                    {editCat ? 'Save Changes' : 'Create Category'}
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
