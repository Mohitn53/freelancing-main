import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertCircle
} from 'lucide-react';
import { productsApi } from '../../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Men',
    price: '',
    stock: '',
    image_url: '',
    description: ''
  });

  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name || '',
        category: editProduct.category || 'Men',
        price: editProduct.price || '',
        stock: editProduct.stock || '',
        image_url: editProduct.image_url || '',
        description: editProduct.description || ''
      });
    } else {
      setFormData({
        name: '',
        category: 'Men',
        price: '',
        stock: '',
        image_url: '',
        description: ''
      });
    }
  }, [editProduct, showModal]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productsApi.list(page);
      if (res.success) {
        setProducts(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
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
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      let res;
      if (editProduct) {
        res = await productsApi.update(editProduct.id, payload);
      } else {
        res = await productsApi.create(payload);
      }

      if (res.success) {
        setShowModal(false);
        fetchProducts();
      }
    } catch (err) {
      alert('Failed to save product: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase m-0">Product Catalog</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Manage your streetwear drops</p>
        </div>
        <button 
          onClick={() => { setEditProduct(null); setShowModal(true); }}
          className="bg-primary text-white border-none px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-[5px_5px_0px_#999] hover:translate-y-[-2px] transition-all flex items-center gap-2 cursor-pointer active:translate-y-0 active:shadow-none"
        >
          <Plus size={18} /> New Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search products by name, ID or category..."
            className="w-full bg-gray-50 border border-transparent focus:border-primary focus:bg-white outline-none rounded-xl py-3 pl-12 pr-4 text-sm font-bold transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl font-bold uppercase tracking-widest text-[10px] text-gray-400 hover:text-primary hover:border-primary transition-all cursor-pointer">
            <Filter size={14} /> Filter
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl font-bold uppercase tracking-widest text-[10px] text-gray-400 hover:text-primary hover:border-primary transition-all cursor-pointer">
            Export CSV
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Price</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-8 py-10">
                      <div className="h-4 bg-gray-50 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4 text-gray-300">
                      <Package size={64} strokeWidth={1} />
                      <p className="font-black uppercase tracking-widest text-xs">No products found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                          <img 
                            src={product.image_url} 
                            alt="" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        </div>
                        <div>
                          <p className="m-0 font-bold text-sm uppercase tracking-tight text-primary">{product.name}</p>
                          <p className="m-0 text-[9px] text-gray-400 font-bold uppercase tracking-widest truncate w-40">{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-500">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-black text-sm">
                      ₹{product.price.toLocaleString('en-IN')}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                          {product.stock} in stock
                        </span>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${product.stock < 10 ? 'bg-red-500' : 'bg-primary'}`} 
                            style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                          {product.stock > 0 ? 'Active' : 'Sold Out'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-white hover:text-primary rounded-lg transition-colors text-gray-400 border-none bg-none cursor-pointer">
                          <ExternalLink size={16} />
                        </button>
                        <button 
                          onClick={() => { setEditProduct(product); setShowModal(true); }}
                          className="p-2 hover:bg-white hover:text-primary rounded-lg transition-colors text-gray-400 border-none bg-none cursor-pointer"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-gray-400 border-none bg-none cursor-pointer"
                        >
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

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Showing <span className="text-primary font-black">{products.length}</span> products
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-400 cursor-pointer bg-white"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="min-w-[32px] h-8 flex items-center justify-center bg-primary text-white rounded-xl text-xs font-black shadow-md">
              {page}
            </div>
            <button 
              disabled={products.length < 10}
              onClick={() => setPage(p => p + 1)}
              className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-400 cursor-pointer bg-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Form Modal (Simplified placeholder for now) */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-sm px-6 py-4"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden p-12"
            >
              <h2 className="text-3xl font-black uppercase tracking-tighter m-0 mb-8">
                {editProduct ? 'Update DROP' : 'Release New DROP'}
              </h2>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Product Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-primary outline-none px-5 py-4 rounded-2xl font-bold uppercase transition-all" 
                      placeholder="e.g. Core Heavy Hoodie" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Category</label>
                    <select 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-primary outline-none px-5 py-4 rounded-2xl font-bold uppercase transition-all"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option>Men</option>
                      <option>Women</option>
                      <option>Bags</option>
                      <option>Shoes</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Price (INR)</label>
                    <input 
                      type="number" 
                      required
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-primary outline-none px-5 py-4 rounded-2xl font-bold uppercase transition-all" 
                      placeholder="0.00" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Initial Stock</label>
                    <input 
                      type="number" 
                      required
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-primary outline-none px-5 py-4 rounded-2xl font-bold uppercase transition-all" 
                      placeholder="50" 
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Image URL</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-primary outline-none px-5 py-4 rounded-2xl font-bold uppercase transition-all" 
                    placeholder="https://..." 
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description</label>
                  <textarea 
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-primary outline-none px-5 py-4 rounded-2xl font-bold transition-all min-h-[100px]" 
                    placeholder="Product details..." 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="pt-6 flex gap-4">
                  <button type="submit" className="flex-1 bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_10px_20px_rgba(0,0,0,0.1)] active:translate-y-1 transition-all border-none cursor-pointer">
                    {editProduct ? 'Save Changes' : 'Confirm Release'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-10 bg-gray-100 text-gray-400 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all border-none cursor-pointer"
                  >
                    Cancel
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

export default AdminProducts;
