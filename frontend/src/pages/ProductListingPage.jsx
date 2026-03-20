// ProductListingPage.jsx – live backend data, 12/page, INR pricing, rate-limited
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { productsApi, categoryApi } from '../services/api';

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('created_at');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.list();
        if (res.success && res.data) {
          const catNames = res.data.map(c => c.name);
          setCategories(['All', ...catNames]);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setCategories(['All', 'Men', 'Women', 'Bags', 'Shoes', 'Accessories']); // fallback
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productsApi.list(page, category === 'All' ? '' : category, sort);
      if (res.data) {
        setProducts(res.data.map(p => ({ ...p, image: p.image_url })));
        setTotalPages(res.totalPages || 1);
        setTotal(res.total || res.data.length);
      } else {
        setProducts([]);
        setTotalPages(1);
        setTotal(0);
      }
    } catch {
      setProducts([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, category, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight m-0 font-sans">All Products</h1>
          <p className="text-sm text-gray-500 mt-1">{total} items found</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm font-sans outline-none hover:border-primary transition-colors cursor-pointer"
          >
            <option value="created_at">Newest First</option>
            <option value="price">Price: Low to High</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 flex-wrap mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setPage(1); }}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all border font-sans cursor-pointer
              ${category === cat
                ? 'bg-primary text-white border-primary shadow-[2px_3px_0px_#111]'
                : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(12).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-gray-100 rounded-xl mb-3" />
              <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${category}-${page}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.map(p => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                subtitle={p.subtitle || p.category}
                price={p.price}
                image={p.image_url || p.image}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="py-20 text-center text-gray-500 font-sans">
          No products found for this category.
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-14">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 font-medium text-sm disabled:opacity-40 hover:border-primary transition-colors cursor-pointer"
          >←</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
            Math.max(0, page - 2), Math.min(totalPages, page + 1)
          ).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-medium cursor-pointer transition-all
                ${p === page
                  ? 'bg-primary text-white border-primary shadow-[2px_3px_0px_#111]'
                  : 'border-gray-200 hover:border-primary'
                }`}
            >{p}</button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 font-medium text-sm disabled:opacity-40 hover:border-primary transition-colors cursor-pointer"
          >→</button>
        </div>
      )}
    </motion.div>
  );
};

export default ProductListingPage;
