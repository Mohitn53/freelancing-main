// src/pages/admin/Orders.jsx – Sporty Revamp
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, ChevronRight, ChevronLeft, ShoppingBag, ExternalLink, 
  CheckCircle2, Clock, Truck, XCircle, Package, Eye, MoreVertical, Zap, ShieldCheck, Trophy, BadgeAlert
} from 'lucide-react';
import { orderApi } from '../../services/api';

const statusConfigs = {
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-600', border: 'border-yellow-200' },
  processing: { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-200' },
  shipped: { bg: 'bg-indigo-500/10', text: 'text-indigo-600', border: 'border-indigo-200' },
  delivered: { bg: 'bg-[#00C896]/10', text: 'text-[#00C896]', border: 'border-[#009b74]/20' },
  cancelled: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-200' },
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
      if (res.success) setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await orderApi.updateStatus(id, status);
      if (res.success) {
        fetchOrders();
        if (selectedOrder && selectedOrder.id === id) setSelectedOrder({...selectedOrder, status});
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b-4 border-[#0D1B2A] pb-8">
        <div>
          <h1 className="font-heading font-black text-5xl tracking-tighter uppercase leading-none text-[#0D1B2A]">Order <span className="text-[#00C896]">Logistics</span></h1>
          <p className="text-gray-400 font-heading font-black uppercase tracking-[0.2em] text-[10px] mt-3">Track & fulfillment mission control</p>
        </div>
        <div className="flex gap-4">
            <button onClick={fetchOrders} className="px-8 py-5 bg-white border-2 border-gray-100 rounded-2xl font-heading font-black uppercase tracking-widest text-[10px] text-gray-500 hover:border-[#00C896] hover:text-[#00C896] transition-all cursor-pointer shadow-sm">
                Refresh Grid
            </button>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { label: 'Deployment Total', value: orders.length, color: 'text-[#0D1B2A]', icon: Package },
            { label: 'Pending Queue', value: orders.filter(o => o.status === 'pending').length, color: 'text-yellow-600', icon: Clock },
            { label: 'Active Transit', value: orders.filter(o => o.status === 'shipped' || o.status === 'processing').length, color: 'text-indigo-600', icon: Truck },
            { label: 'Victories (Delivered)', value: orders.filter(o => o.status === 'delivered').length, color: 'text-[#00C896]', icon: Trophy },
          ].map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border-2 border-gray-50 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 text-[#00C896]/5 group-hover:text-[#00C896]/20 transition-all scale-150"><s.icon size={56} strokeWidth={1} /></div>
                 <p className="text-[10px] font-heading font-black uppercase tracking-widest text-gray-300 mb-2 relative z-10">{s.label}</p>
                 <h3 className={`text-5xl font-heading font-black tracking-tighter relative z-10 ${s.color}`}>{s.value}</h3>
            </div>
          ))}
      </div>

      {/* Main Logistics Grid */}
      <div className="bg-white rounded-[3rem] border-2 border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-6 items-center bg-gray-50/30">
            <div className="relative flex-1 group w-full">
                <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#00C896] transition-colors" />
                <input type="text" placeholder="Scan orders by ID, Athlete profile, or Status Code..." 
                    className="w-full bg-white border-2 border-gray-100 focus:border-[#00C896] outline-none rounded-[1.5rem] py-5 pl-16 pr-6 font-heading font-black uppercase text-xs tracking-widest transition-all"
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button className="flex items-center gap-3 px-10 py-5 bg-[#0D1B2A] text-[#00C896] rounded-[1.5rem] font-heading font-black uppercase tracking-widest text-[10px] hover:bg-[#1a2d42] transition-all border-none cursor-pointer">
                <Filter size={16} /> Filter Grid
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#0D1B2A] text-white">
                        <th className="px-10 py-6 text-[10px] font-heading font-black uppercase tracking-widest">Tracking ID</th>
                        <th className="px-10 py-6 text-[10px] font-heading font-black uppercase tracking-widest">Athlete Profile</th>
                        <th className="px-10 py-6 text-[10px] font-heading font-black uppercase tracking-widest">Commit Date</th>
                        <th className="px-10 py-6 text-[10px] font-heading font-black uppercase tracking-widest">Valuation</th>
                        <th className="px-10 py-6 text-[10px] font-heading font-black uppercase tracking-widest">Logistics Status</th>
                        <th className="px-10 py-6 text-[10px] font-heading font-black uppercase tracking-widest text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {loading ? (
                         [1,2,3,4,5].map(i => <tr key={i} className="animate-pulse"><td colSpan="6" className="py-12 px-10"><div className="h-4 bg-gray-50 rounded w-full"></div></td></tr>)
                    ) : orders.map(order => (
                        <tr key={order.id} className="group hover:bg-gray-50/50 transition-all">
                            <td className="px-10 py-8">
                                <span className="font-heading font-black text-xs uppercase tracking-tight text-[#0D1B2A] group-hover:text-[#00C896] transition-colors">DEPL-{order.id.slice(0,8).toUpperCase()}</span>
                            </td>
                            <td className="px-10 py-8">
                                <div className="flex flex-col max-w-[150px]">
                                    <span className="font-heading font-black text-sm uppercase truncate text-[#0D1B2A]">{order.profiles?.name || 'GUEST ATHLETE'}</span>
                                    <span className="text-[10px] text-gray-300 font-heading font-black uppercase tracking-widest mt-1 truncate">{order.profiles?.email}</span>
                                </div>
                            </td>
                            <td className="px-10 py-8">
                                <span className="text-[10px] font-heading font-black uppercase tracking-widest text-gray-300">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </span>
                            </td>
                            <td className="px-10 py-8 font-heading font-black text-sm text-[#0D1B2A]">
                                ₹{Number(order.total || order.total_amount || 0).toLocaleString('en-IN')}
                            </td>
                            <td className="px-10 py-8">
                                <select 
                                    className={`px-5 py-2.5 rounded-full border-2 text-[9px] font-heading font-black uppercase tracking-widest outline-none cursor-pointer transition-all ${statusConfigs[order.status]?.bg} ${statusConfigs[order.status]?.text} ${statusConfigs[order.status]?.border}`}
                                    value={order.status}
                                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                >
                                    <option value="pending">PENDING</option>
                                    <option value="processing">GEAR SECURED (PACKED)</option>
                                    <option value="shipped">SHIPPED</option>
                                    <option value="delivered">DELIVERED</option>
                                    <option value="cancelled">CANCELLED</option>
                                </select>
                            </td>
                            <td className="px-10 py-8 text-right">
                                <button className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-[#00C896] hover:text-[#0D1B2A] rounded-2xl transition-all border-none bg-none cursor-pointer text-gray-300 shadow-sm"
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <Eye size={18} strokeWidth={3} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Details Slide-Over (Upgrade) */}
      <AnimatePresence>
        {selectedOrder && (
            <div className="fixed inset-0 z-[200] flex items-center justify-end p-0">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#0D1B2A]/40 backdrop-blur-md" onClick={() => setSelectedOrder(null)} />
                <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="relative w-full max-w-3xl h-screen bg-white shadow-2xl overflow-y-auto border-l-8 border-[#00C896]"
                >
                    <div className="p-12 md:p-20">
                    <div className="flex justify-between items-start mb-16">
                        <div>
                            <span className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-[#00C896] mb-3 block">Deployment Analysis</span>
                            <h2 className="text-6xl font-heading font-black tracking-tighter uppercase m-0 leading-none text-[#0D1B2A]">#{selectedOrder.id.slice(0,8).toUpperCase()}</h2>
                        </div>
                        <button onClick={() => setSelectedOrder(null)} className="w-16 h-16 bg-gray-50 hover:bg-[#ff4d4d]/10 hover:text-[#ff4d4d] rounded-full flex items-center justify-center transition-all border-none cursor-pointer">
                            <XCircle size={32} strokeWidth={1} />
                        </button>
                    </div>

                    <div className="space-y-16">
                        <section className="bg-gray-50 p-10 rounded-[3rem] border-2 border-gray-100 flex items-center gap-10">
                            <div className="w-20 h-20 bg-[#00C896] rounded-[1.5rem] flex items-center justify-center text-[#0D1B2A] shadow-2xl rotate-3">
                                <span className="text-4xl font-heading font-black uppercase">{(selectedOrder.profiles?.name || 'G')[0]}</span>
                            </div>
                            <div>
                                <p className="font-heading font-black uppercase text-3xl tracking-tighter text-[#0D1B2A]">{selectedOrder.profiles?.name || 'GUEST ATHLETE'}</p>
                                <p className="text-[10px] font-heading font-black uppercase tracking-widest text-[#00C896] mt-1">{selectedOrder.profiles?.email}</p>
                            </div>
                        </section>

                        <div className="grid grid-cols-2 gap-12">
                            <section>
                                <h4 className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-gray-300 mb-6 pb-2 border-b border-gray-50">Logistics Protocol</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs uppercase font-heading font-black group">
                                        <span className="text-gray-300">Method</span>
                                        <span className="text-[#0D1B2A] flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg"><Truck size={14}/> Ground Priority</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs uppercase font-heading font-black">
                                        <span className="text-gray-300">Security Check</span>
                                        <span className="text-[#00C896] flex items-center gap-2"><ShieldCheck size={14} strokeWidth={3}/> Validated</span>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <h4 className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-gray-300 mb-6 pb-2 border-b border-gray-50">Transaction Node</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs uppercase font-heading font-black">
                                         <span className="text-gray-300">Gateway</span>
                                         <span className="text-[#0D1B2A]">{selectedOrder.payment_method?.toUpperCase() || 'EXTERNAL'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs uppercase font-heading font-black">
                                         <span className="text-gray-300">Pay Status</span>
                                         <span className="text-[#00C896] bg-[#00C896]/10 px-3 py-1 rounded-lg">Settled</span>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <section>
                            <h4 className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-gray-300 mb-8 pb-2 border-b border-gray-50">Hardware Manifest</h4>
                            <div className="bg-gray-50/50 rounded-[2.5rem] p-4 text-center">
                                <div className="py-12 flex flex-col items-center">
                                    <Package size={48} strokeWidth={1} className="text-gray-200 mb-4 animate-bounce" />
                                    <p className="text-[10px] font-heading font-black text-gray-300 uppercase tracking-widest">Expansion Protocol pending for item details</p>
                                </div>
                            </div>
                        </section>

                        <section className="pt-12 border-t-4 border-[#0D1B2A] flex flex-col md:flex-row justify-between items-center gap-8">
                             <div className="flex gap-4 w-full md:w-auto">
                                 <button onClick={() => window.print()} className="flex-1 md:flex-none px-10 py-5 bg-[#0D1B2A] text-white rounded-2xl font-heading font-black uppercase tracking-widest text-[10px] hover:bg-[#00C896] hover:text-[#0D1B2A] transition-all shadow-xl">Secure Invoice</button>
                                 <button className="flex-1 md:flex-none px-10 py-5 border-2 border-red-100 text-red-500 rounded-2xl font-heading font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">Abort Mission</button>
                             </div>
                             <div className="text-right w-full md:w-auto">
                                <p className="text-[10px] font-heading font-black uppercase text-gray-300 mb-1">Final Valuation</p>
                                <h2 className="text-6xl font-heading font-black text-[#0D1B2A] leading-none">₹{selectedOrder.total_amount.toLocaleString('en-IN')}</h2>
                             </div>
                        </section>
                    </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
