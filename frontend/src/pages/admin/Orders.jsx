import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronLeft,
  ShoppingBag,
  ExternalLink,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Package,
  Eye,
  MoreVertical
} from 'lucide-react';
import { orderApi } from '../../services/api';

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
  packed: 'bg-blue-500/10 text-blue-600 border-blue-200',
  shipped: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
  delivered: 'bg-green-500/10 text-green-600 border-green-200',
  cancelled: 'bg-red-500/10 text-red-600 border-red-200',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderApi.listAdmin();
      if (res.success) {
        setOrders(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await orderApi.updateStatus(id, status);
      if (res.success) {
        fetchOrders();
        if (selectedOrder && selectedOrder.id === id) {
            setSelectedOrder({...selectedOrder, status});
        }
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase m-0">Order Management</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Track & fulfill your drops</p>
        </div>
        <div className="flex gap-2">
            <button className="px-6 py-4 bg-white border border-gray-100 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-500 hover:bg-gray-50 transition-all cursor-pointer shadow-sm">
                Refresh Feed
            </button>
        </div>
      </div>

      {/* Stats Row Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Orders</p>
              <h3 className="text-2xl font-black">{orders.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Pending</p>
              <h3 className="text-2xl font-black text-yellow-600">{orders.filter(o => o.status === 'pending').length}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Out for Delivery</p>
              <h3 className="text-2xl font-black text-indigo-600">{orders.filter(o => o.status === 'shipped').length}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Delivered</p>
              <h3 className="text-2xl font-black text-green-600">{orders.filter(o => o.status === 'delivered').length}</h3>
          </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 group w-full">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search orders by ID, Customer or Status..."
                    className="w-full bg-gray-50 border border-transparent focus:border-primary focus:bg-white outline-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button className="flex items-center gap-2 px-6 py-4 bg-gray-50 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-gray-400 hover:text-primary transition-all border-none cursor-pointer">
                <Filter size={14} /> Filter Feed
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50/30">
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Total</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {loading ? (
                         [1,2,3,4,5].map(i => <tr key={i} className="animate-pulse"><td colSpan="6" className="py-8 px-10"><div className="h-4 bg-gray-50 rounded w-full"></div></td></tr>)
                    ) : orders.map(order => (
                        <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                            <td className="px-10 py-8">
                                <span className="font-black text-xs uppercase tracking-tighter">#{order.id.split('-')[0]}</span>
                            </td>
                            <td className="px-10 py-8">
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm uppercase">{order.profiles?.name || 'Guest User'}</span>
                                    <span className="text-[10px] text-gray-400 font-bold lowercase tracking-normal">{order.profiles?.email}</span>
                                </div>
                            </td>
                            <td className="px-10 py-8">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                    {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                            </td>
                            <td className="px-10 py-8 font-black text-sm">
                                ₹{Number(order.total || order.total_amount || 0).toLocaleString('en-IN')}
                            </td>
                            <td className="px-10 py-8">
                                <select 
                                    className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest outline-none cursor-pointer transition-all ${statusColors[order.status]}`}
                                    value={order.status}
                                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="packed">Packed</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </td>
                            <td className="px-10 py-8 text-right">
                                <button className="p-3 bg-gray-50 hover:bg-primary hover:text-white rounded-2xl transition-all border-none bg-none cursor-pointer text-gray-400 shadow-sm"
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <Eye size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Details View (Optional Placeholder) */}
      <AnimatePresence>
        {selectedOrder && (
            <div className="fixed inset-0 z-[200] flex items-center justify-end p-0">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-primary/20 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
                <motion.div 
                    initial={{ x: '100%' }} 
                    animate={{ x: 0 }} 
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="relative w-full max-w-2xl h-screen bg-white shadow-2xl p-12 overflow-y-auto"
                >
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Order Details</span>
                            <h2 className="text-4xl font-black tracking-tighter uppercase m-0">#{selectedOrder.id.split('-')[0]}</h2>
                        </div>
                        <button onClick={() => setSelectedOrder(null)} className="p-4 bg-gray-50 hover:bg-gray-100 rounded-full border-none cursor-pointer">
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    <div className="space-y-10">
                        <section>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-4 pb-2 border-b border-gray-50">Customer Snapshot</h4>
                            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 flex items-center gap-6">
                                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl">
                                    <span className="text-2xl font-black uppercase">{(selectedOrder.profiles?.name || 'G')[0]}</span>
                                </div>
                                <div>
                                    <p className="m-0 font-black uppercase text-xl">{selectedOrder.profiles?.name || 'Guest'}</p>
                                    <p className="m-0 text-xs font-bold text-gray-400 mt-1">{selectedOrder.profiles?.email}</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-4 pb-2 border-b border-gray-50">Logistics</h4>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Method</p>
                                    <p className="font-bold text-sm uppercase">Standard Shipping</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Payment Status</p>
                                    <p className="font-bold text-sm uppercase text-green-500 flex items-center gap-1"><CheckCircle2 size={14}/> Paid (Online)</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-4 pb-2 border-b border-gray-50">Order Items</h4>
                            <div className="divide-y divide-gray-50 bg-gray-50/30 rounded-3xl p-4">
                                {/* Order items would be fetched or passed here */}
                                <div className="py-4 text-center text-[10px] font-black text-gray-300 uppercase italic">
                                    Item expansion to be implemented
                                </div>
                            </div>
                        </section>

                        <section className="pt-10 border-t border-gray-100 flex justify-between items-end text-right">
                             <div className="text-left">
                                <p className="text-[10px] font-black uppercase text-gray-300 mb-1">Status Control</p>
                                <div className="flex gap-2">
                                     <button className="px-6 py-3 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all border-none cursor-pointer">Cancel Drop</button>
                                     <button className="px-6 py-3 bg-indigo-50 text-indigo-500 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-500 hover:text-white transition-all border-none cursor-pointer">Print Invoice</button>
                                </div>
                             </div>
                             <div className="flex flex-col gap-2">
                                <p className="text-[10px] font-black uppercase text-gray-300 mb-[-5px]">Total Paid</p>
                                <h2 className="text-4xl font-black text-primary">₹{selectedOrder.total_amount.toLocaleString('en-IN')}</h2>
                             </div>
                        </section>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
