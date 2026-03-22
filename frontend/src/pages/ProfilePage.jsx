// src/pages/ProfilePage.jsx – Sporty Revamp
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, MapPin, CreditCard, LogOut, ChevronRight, Plus, Check, Edit2, Trash2, ShoppingBag, ShieldCheck, Zap, Trophy, ShieldAlert, History } from 'lucide-react';
import { profileApi, orderApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const fmt = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

const TABS = [
  { id: 'profile', label: 'Identity', icon: User },
  { id: 'orders', label: 'History', icon: History },
  { id: 'addresses', label: 'Logistics', icon: MapPin },
  { id: 'payments', label: 'Vault', icon: CreditCard },
];

const StatusBadge = ({ status }) => {
  const configs = { 
    Delivered: { bg: 'bg-[#00C896]/10', text: 'text-[#00C896]', icon: Check }, 
    'In Transit': { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: Package }, 
    Pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', icon: Zap }, 
    Cancelled: { bg: 'bg-red-500/10', text: 'text-red-500', icon: ShieldAlert } 
  };
  const config = configs[status] || { bg: 'bg-gray-100', text: 'text-gray-400', icon: ShieldCheck };
  const Icon = config.icon;
  return (
    <span className={`text-[9px] font-heading font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-2 border border-current/20 ${config.bg} ${config.text}`}>
       <Icon size={10} strokeWidth={4} /> {status}
    </span>
  );
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ full_name: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '', is_default: false });
  const [newPayment, setNewPayment] = useState({ brand: 'Visa', last4: '', exp_month: '', exp_year: '', is_default: false });
  const [loading, setLoading] = useState(true);

  const { token, handleLogout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [profRes, ordRes, addrRes, payRes] = await Promise.all([
          profileApi.get(),
          profileApi.orders(),
          profileApi.addresses(),
          profileApi.paymentMethods()
        ]);

        if (profRes.success) setProfile(profRes.data);
        if (ordRes.success) setOrders(ordRes.data || []);
        if (addrRes.success) setAddresses(addrRes.data || []);
        if (payRes.success) setPayments(payRes.data || []);
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, authLoading, navigate]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await profileApi.update({ name: profile.name, phone: profile.phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Confirm order cancellation?')) return;
    try {
      const res = await orderApi.cancel(orderId);
      if (res.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
      }
    } catch (err) {
      console.error('Cancel order failed:', err);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Erase this logistics point?')) return;
    try {
      await profileApi.deleteAddress(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch (err) { console.error('Delete failed:', err); }
  };

  const handleAddPayment = async () => {
    if (!newPayment.last4 || !newPayment.exp_month || !newPayment.exp_year) {
        alert('All gear fields required for initialization');
        return;
    }
    try {
      const res = await profileApi.addPaymentMethod(newPayment);
      if (res.success) {
        setPayments(prev => [...prev.filter(p => !newPayment.is_default || !p.is_default), res.data]);
        setShowPaymentForm(false);
        setNewPayment({ brand: 'Visa', last4: '', exp_month: '', exp_year: '', is_default: false });
      }
    } catch (err) { console.error('Add payment failed:', err); }
  };

  const handleDeletePayment = async (id) => {
    if (!window.confirm('Deactivate this financial chip?')) return;
    try {
      await profileApi.deletePaymentMethod(id);
      setPayments(prev => prev.filter(p => p.id !== id));
    } catch (err) { console.error('Delete failed:', err); }
  };

  const handleAddAddress = async () => {
    try {
      const res = await profileApi.addAddress(newAddress);
      if (res.success) {
        setAddresses(prev => [...prev, res.data]);
        setShowAddressForm(false);
        setNewAddress({ full_name: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '', is_default: false });
      }
    } catch (err) {
      console.error('Failed to add address:', err);
    }
  };

  const initials = profile?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  if (loading || authLoading) {
    return <div className="min-h-[70vh] flex items-center justify-center font-heading font-black uppercase tracking-widest text-[#00C896]/30 animate-pulse">Syncing Dashboard...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-16">
      
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Sidebar Nav Dashboard */}
        <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24">
          <div className="bg-[#0D1B2A] rounded-[2.5rem] p-8 overflow-hidden relative group border-b-4 border-[#00C896]">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C896]/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#00C896]/20 transition-all duration-700" />
             
             <div className="flex flex-col items-center pb-8 border-b border-white/5 mb-8 relative z-10">
                <div className="w-24 h-24 bg-[#00C896] text-[#0D1B2A] rounded-3xl rotate-6 flex items-center justify-center text-3xl font-heading font-black mb-6 shadow-2xl transition-transform group-hover:rotate-0">
                  {initials}
                </div>
                <h3 className="font-heading font-black text-2xl tracking-tighter uppercase text-white mb-2">{profile?.name || 'Athlete'}</h3>
                <p className="font-heading font-black text-[10px] text-[#00C896] uppercase tracking-[0.2em]">Rank: Elite Squad</p>
             </div>

             <nav className="flex flex-col gap-3 relative z-10">
                {TABS.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-4 px-6 py-4 rounded-xl text-[10px] font-heading font-black uppercase tracking-widest transition-all text-left border-2
                        ${isActive
                          ? 'bg-white text-[#0D1B2A] border-white shadow-xl translate-x-1'
                          : 'text-white/40 border-white/5 hover:border-white/10 hover:text-white hover:translate-x-1'
                        }`}
                    >
                      <Icon size={18} strokeWidth={isActive ? 3 : 2} className={isActive ? 'text-[#00C896]' : ''} />
                      {tab.label}
                      {isActive && <Trophy size={14} fill="currentColor" className="ml-auto text-[#00C896]" />}
                    </button>
                  );
                })}
                <button 
                  onClick={() => { handleLogout(); navigate('/'); }}
                  className="flex items-center gap-4 px-6 py-4 rounded-xl text-[10px] font-heading font-black uppercase tracking-widest text-[#ff4d4d]/60 border-2 border-transparent hover:bg-[#ff4d4d]/10 hover:text-[#ff4d4d] transition-all text-left mt-8"
                >
                  <LogOut size={18} /> Logout Session
                </button>
             </nav>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {/* ─── Profile Details ─── */}
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-end gap-3 mb-12">
                   <h2 className="font-heading font-black text-5xl tracking-tighter uppercase leading-none">Athlete <span className="text-[#00C896]">Identity</span></h2>
                   <div className="h-1 flex-1 bg-gray-100 mb-2 rounded-full hidden md:block" />
                </div>

                <div className="bg-white border-2 border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-heading font-black uppercase tracking-widest text-gray-300 pl-1">Legal Name</label>
                      <input type="text" value={profile?.name || ''}
                        onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                        className="bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-heading font-black uppercase text-sm outline-none focus:border-[#00C896] transition-all" />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-heading font-black uppercase tracking-widest text-gray-300 pl-1">Mobile Access</label>
                      <input type="tel" value={profile?.phone || ''}
                        onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+91 MOBILE"
                        className="bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-heading font-black uppercase text-sm outline-none focus:border-[#00C896] transition-all placeholder:text-gray-200" />
                    </div>
                    <div className="flex flex-col gap-3 md:col-span-2">
                       <label className="text-[10px] font-heading font-black uppercase tracking-widest text-gray-300 pl-1">Registry Email</label>
                       <input type="email" value={profile?.email || ''} disabled
                        className="bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 font-heading font-black uppercase text-sm text-gray-200 cursor-not-allowed" />
                       <div className="flex items-center gap-2 mt-1 px-1">
                          <ShieldCheck size={12} className="text-gray-200" />
                          <p className="text-[9px] text-gray-200 font-heading font-black uppercase tracking-widest">Permanent Authentication Protocol Locked</p>
                       </div>
                    </div>
                  </div>
                  
                  <button onClick={handleSaveProfile} disabled={saving}
                    className={`flex items-center gap-3 px-12 py-5 rounded-2xl font-heading font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95
                      ${saved ? 'bg-[#00C896] text-[#0D1B2A]' : 'bg-[#0D1B2A] text-white hover:bg-[#1a2d42]'}`}>
                    {saved ? <><Check size={18} strokeWidth={4} /> Identity Saved</> : saving ? 'Transmitting...' : 'Commit Changes'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ─── Orders History ─── */}
            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-end gap-3 mb-12">
                   <h2 className="font-heading font-black text-5xl tracking-tighter uppercase leading-none">History <span className="text-[#00C896]">Log</span></h2>
                   <div className="h-1 flex-1 bg-gray-100 mb-2 rounded-full hidden md:block" />
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-32 bg-gray-50 rounded-[2.5rem] border-4 border-dashed border-gray-100 flex flex-col items-center">
                    <ShoppingBag size={64} strokeWidth={1} className="mb-6 text-gray-200" />
                    <p className="font-heading font-black uppercase tracking-widest text-sm text-gray-300">Deployment queue is currently empty</p>
                    <Link to="/products" className="mt-8 font-heading font-black text-xs text-[#00C896] uppercase hover:underline">Launch Selection</Link>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {orders.map(order => (
                      <div key={order.id} className="bg-white border-2 border-gray-100 rounded-[2rem] p-8 hover:border-[#00C896]/30 transition-all shadow-sm group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8 pb-8 border-b border-gray-50">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-[#0D1B2A]">
                                 <Package size={20} />
                              </div>
                              <div>
                                 <p className="font-heading font-black text-xs uppercase tracking-tight">Deployment #{order.id.slice(-8).toUpperCase()}</p>
                                 <p className="text-[10px] text-gray-300 font-heading font-black uppercase tracking-widest mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-8">
                              <div className="text-right">
                                 <p className="text-[10px] text-gray-300 font-heading font-black uppercase tracking-widest mb-1">Commit Total</p>
                                 <p className="font-heading font-black text-2xl text-[#0D1B2A]">{fmt(order.total_amount || 0)}</p>
                              </div>
                              <StatusBadge status={order.status} />
                           </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mb-4">
                           {order.order_items?.map((it, i) => (
                             <div key={i} className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-3 rounded-2xl group-hover:bg-white transition-all">
                                <img src={it.products?.image_url} className="w-14 h-14 object-cover rounded-xl" alt="" />
                                <div className="pr-4">
                                   <p className="font-heading font-black text-[10px] uppercase truncate max-w-[120px]">{it.products?.name}</p>
                                   <p className="text-[9px] font-heading font-black text-[#00C896] uppercase tracking-widest mt-0.5">SZ {it.size || '?'} • QTY {it.quantity}</p>
                                </div>
                             </div>
                           ))}
                        </div>

                        {['pending', 'processing'].includes(order.status?.toLowerCase()) && (
                          <div className="flex justify-end pt-4">
                             <button onClick={() => handleCancelOrder(order.id)} className="text-[10px] font-heading font-black uppercase underline decoration-2 underline-offset-4 text-red-500 hover:text-red-700 transition-colors">Abort Order</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── Logistics (Addresses) ─── */}
            {activeTab === 'addresses' && (
              <motion.div key="addresses" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-end justify-between mb-12 gap-3">
                   <h2 className="font-heading font-black text-5xl tracking-tighter uppercase leading-none">Logistics <span className="text-[#00C896]">Hub</span></h2>
                   <button onClick={() => setShowAddressForm(true)} className="w-14 h-14 bg-[#00C896] text-[#0D1B2A] flex items-center justify-center rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all">
                      <Plus size={24} strokeWidth={3} />
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {addresses.map(addr => (
                     <div key={addr.id} className={`bg-white border-2 rounded-[2rem] p-8 relative shadow-sm transition-all group ${addr.is_default ? 'border-[#009b74] bg-[#00C896]/5' : 'border-gray-100 hover:border-[#00C896]/20'}`}>
                        <div className="flex items-start justify-between mb-6">
                           <div className="w-10 h-10 bg-gray-100 group-hover:bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-[#0D1B2A] transition-colors">
                              <MapPin size={18} />
                           </div>
                           {addr.is_default && <span className="text-[9px] font-heading font-black bg-[#00C896] text-[#0D1B2A] px-3 py-1 rounded-full uppercase">Primary</span>}
                        </div>
                        <h4 className="font-heading font-black text-xl uppercase tracking-tighter mb-3">{addr.full_name}</h4>
                        <p className="text-xs font-medium text-gray-400 leading-relaxed font-sans mb-10">{addr.line1}, {addr.line2 && addr.line2 + ','} {addr.city}, {addr.state} [{addr.pincode}]</p>
                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                           <div className="text-[10px] font-heading font-black uppercase text-gray-200">{addr.phone}</div>
                           <div className="flex gap-4">
                              <button className="text-[10px] font-heading font-black text-[#00C896] uppercase hover:underline decoration-2">Edit</button>
                              <button onClick={() => handleDeleteAddress(addr.id)} className="text-[10px] font-heading font-black text-red-400 uppercase hover:underline decoration-2">Purge</button>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>

                {showAddressForm && (
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-12 bg-gray-50 p-10 rounded-[2.5rem] border-4 border-dashed border-gray-200">
                     <h3 className="font-heading font-black text-2xl uppercase mb-8">Register New Entry</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {['full_name', 'phone', 'line1', 'line2', 'city', 'state', 'pincode'].map(f => (
                           <div key={f} className={`flex flex-col gap-2 ${f === 'line1' || f === 'line2' ? 'md:col-span-2' : ''}`}>
                             <label className="text-[10px] font-heading font-black uppercase tracking-widest text-gray-300 pl-1">{f.replace('_', ' ')}</label>
                             <input type="text" value={newAddress[f]} onChange={e => setNewAddress(p => ({ ...p, [f]: e.target.value }))} className="bg-white border-2 border-gray-100 rounded-xl px-5 py-4 font-heading font-black text-xs uppercase outline-none focus:border-[#00C896] transition-all" />
                           </div>
                        ))}
                     </div>
                     <div className="flex gap-6 mt-12">
                        <button onClick={handleAddAddress} className="bg-[#0D1B2A] text-white px-10 py-4 rounded-xl font-heading font-black uppercase text-xs tracking-widest hover:bg-[#00C896] hover:text-[#0D1B2A] transition-all shadow-xl">Commit Address</button>
                        <button onClick={() => setShowAddressForm(false)} className="text-gray-300 font-heading font-black text-xs uppercase tracking-widest hover:text-[#0D1B2A]">Discard</button>
                     </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ─── Vault (Payments) ─── */}
            {activeTab === 'payments' && (
              <motion.div key="payments" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-end gap-3 mb-12">
                   <h2 className="font-heading font-black text-5xl tracking-tighter uppercase leading-none">The <span className="text-[#00C896]">Vault</span></h2>
                   <div className="h-1 flex-1 bg-gray-100 mb-2 rounded-full hidden md:block" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {payments.map(pm => (
                      <div key={pm.id} className={`bg-[#0D1B2A] rounded-2xl p-8 relative overflow-hidden group border-b-4 ${pm.is_default ? 'border-[#00C896]' : 'border-white/5 shadow-sm'}`}>
                         <div className="absolute top-0 right-0 p-4 text-[#00C896]/20 group-hover:text-[#00C896]/50 transition-colors flex gap-2">
                            <button onClick={() => handleDeletePayment(pm.id)} className="bg-red-500/20 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all border-none cursor-pointer">
                                <Trash2 size={16} />
                            </button>
                            <CreditCard size={48} strokeWidth={1} />
                         </div>
                         <div className="relative z-10">
                            <p className="text-white/30 font-heading font-black text-[10px] uppercase tracking-widest mb-6">{pm.brand} ELITE CHIP</p>
                            <p className="text-white font-heading font-black text-xl tracking-[0.3em] mb-8">•••• •••• •••• {pm.last4}</p>
                            <div className="flex justify-between items-end">
                               <div>
                                  <p className="text-white/20 text-[8px] uppercase font-heading font-black tracking-widest mb-1">Expiration</p>
                                  <p className="text-white font-heading font-black text-xs tracking-widest">{pm.exp_month}/{pm.exp_year}</p>
                               </div>
                               {pm.is_default && <span className="text-[9px] font-heading font-black bg-[#00C896] text-[#0D1B2A] px-3 py-1 rounded-full uppercase">Primary Activation</span>}
                            </div>
                         </div>
                      </div>
                    ))}
                    
                    {!showPaymentForm && (
                        <button onClick={() => setShowPaymentForm(true)} className="border-4 border-dashed border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 text-gray-200 hover:border-[#00C896] hover:text-[#00C896] transition-all group cursor-pointer bg-none">
                            <div className="w-14 h-14 bg-gray-50 rounded-[1.5rem] flex items-center justify-center group-hover:bg-[#00C896]/10 transition-all">
                                <Plus size={32} />
                            </div>
                            <span className="font-heading font-black text-xs uppercase tracking-widest">Initialize New Chip</span>
                        </button>
                    )}

                    {showPaymentForm && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="col-span-1 md:col-span-2 bg-gray-50 p-10 rounded-[2.5rem] border-2 border-[#00C896]/20">
                             <h3 className="font-heading font-black text-xs uppercase tracking-[0.2em] text-[#00C896] mb-8">Initialize Secure Token</h3>
                             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-heading font-black uppercase text-gray-300">Carrier</label>
                                    <select value={newPayment.brand} onChange={e => setNewPayment({...newPayment, brand: e.target.value})} className="w-full bg-white border-2 border-transparent focus:border-[#00C896] outline-none px-6 py-4 rounded-xl font-heading font-black uppercase text-xs">
                                        <option>Visa</option><option>Mastercard</option><option>Amex</option><option>Rupay</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-heading font-black uppercase text-gray-300">Last 4 Digits</label>
                                    <input type="text" maxLength="4" placeholder="0000" value={newPayment.last4} onChange={e => setNewPayment({...newPayment, last4: e.target.value.replace(/\D/g,'')})} className="w-full bg-white border-2 border-transparent focus:border-[#00C896] outline-none px-6 py-4 rounded-xl font-heading font-black uppercase text-xs" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-heading font-black uppercase text-gray-300">Exp Month</label>
                                    <input type="text" maxLength="2" placeholder="MM" value={newPayment.exp_month} onChange={e => setNewPayment({...newPayment, exp_month: e.target.value.replace(/\D/g,'')})} className="w-full bg-white border-2 border-transparent focus:border-[#00C896] outline-none px-6 py-4 rounded-xl font-heading font-black uppercase text-xs" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-heading font-black uppercase text-gray-300">Exp Year</label>
                                    <input type="text" maxLength="4" placeholder="YYYY" value={newPayment.exp_year} onChange={e => setNewPayment({...newPayment, exp_year: e.target.value.replace(/\D/g,'')})} className="w-full bg-white border-2 border-transparent focus:border-[#00C896] outline-none px-6 py-4 rounded-xl font-heading font-black uppercase text-xs" />
                                </div>
                             </div>
                             <div className="flex gap-6 mt-12">
                                <button onClick={handleAddPayment} className="bg-[#00C896] text-[#0D1B2A] px-10 py-4 rounded-xl font-heading font-black uppercase text-xs tracking-widest hover:shadow-[0_0_20px_rgba(0,200,150,0.5)] transition-all">Authorize Vault</button>
                                <button onClick={() => setShowPaymentForm(false)} className="text-gray-300 font-heading font-black text-xs uppercase tracking-widest hover:text-red-500">Decline</button>
                             </div>
                        </motion.div>
                    )}
                </div>
                
                <div className="mt-16 bg-[#ff4d4d]/5 border border-[#ff4d4d]/10 p-6 rounded-2xl flex gap-4 items-start">
                   <ShieldAlert size={20} className="text-[#ff4d4d] shrink-0" />
                   <div>
                      <h5 className="font-heading font-black text-xs uppercase text-[#ff4d4d] mb-1">Security Notice</h5>
                      <p className="text-[10px] text-[#ff4d4d]/40 font-medium font-sans">Raw card data is never stored on SportZone kernels. All tokens are transmitted via PCI-DSS encrypted pipelines.</p>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
