import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { productsApi, categoryApi } from '../services/api';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        setCategories(['All', 'Men', 'Women', 'Bags', 'Shoes']); // fallback
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      setLoading(true);
      try {
        const res = await productsApi.list(1, activeTab === 'All' ? '' : activeTab);
        if (res.data && res.data.length > 0) {
          setProducts(res.data.slice(0, 4));
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Failed to fetch arrivals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, [activeTab]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page" exit={{ opacity: 0 }}>
      {/* 1. Hero Section */}
      <Hero />
      
      {/* 2. New Arrivals container */}
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 mt-24 pb-24">
        
        {/* Arrivals Header Row (Title, Pills, Show More) */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <h2 className="text-4xl font-black tracking-tighter m-0 font-sans text-primary uppercase">New Arrivals</h2>
          
          <div className="flex items-center bg-[#f5f5f5] rounded-full p-1 border border-gray-100 shadow-sm overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-2 text-sm font-medium transition-all outline-none border-none bg-none cursor-pointer rounded-full font-sans whitespace-nowrap
                  ${activeTab === cat ? 'bg-primary text-secondary shadow-md font-bold' : 'text-gray-400 hover:text-primary'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          <button 
            onClick={() => navigate('/products')}
            className="text-sm font-bold flex items-center border-none bg-none cursor-pointer font-sans text-primary hover:opacity-60 transition-all uppercase tracking-widest group"
          >
            Show More <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
             {[1,2,3,4].map(i => (
               <div key={i} className="aspect-[3/4] bg-gray-50 animate-pulse rounded-2xl" />
             ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
             <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No products found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                name={product.name}
                subtitle={product.category}
                price={product.price}
                image={product.image_url}
              />
            ))}
          </div>
        )}

      </div>
    </motion.div>
  );
};

export default HomePage;
