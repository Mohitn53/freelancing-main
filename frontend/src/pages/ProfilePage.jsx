// ProfilePage.jsx – full profile with order history, addresses, payment methods
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, MapPin, CreditCard, LogOut, ChevronRight, Plus, Check, Edit2, Trash2, ShoppingBag } from 'lucide-react';
import { profileApi, orderApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const fmt = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

const TABS = [
  { id: 'profile', label: 'Profile Settings', icon: User },
  { id: 'orders', label: 'Order History', icon: Package },
  { id: 'addresses', label: 'Address Book', icon: MapPin },
  { id: 'payments', label: 'Payment Methods', icon: CreditCard },
];

const StatusBadge = ({ status }) => {
  const colors = { Delivered: 'bg-green-50 text-green-600', 'In Transit': 'bg-blue-50 text-blue-600', Pending: 'bg-yellow-50 text-yellow-700', Cancelled: 'bg-red-50 text-red-600' };
  return <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colors[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
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
  const [newAddress, setNewAddress] = useState({ full_name: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '', is_default: false });
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
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await orderApi.cancel(orderId);
      if (res.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
      }
    } catch (err) {
      console.error('Cancel order failed:', err);
      alert('Failed to cancel order.');
    }
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

  const handleDeleteAddress = async (id) => {
    try {
      const res = await profileApi.deleteAddress(id);
      if (res.success) {
        setAddresses(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete address:', err);
    }
  };

  const initials = profile?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  if (loading || authLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center font-black uppercase tracking-widest text-gray-300">Loading your profile...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-16">

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 shrink-0">
          {/* Avatar */}
          <div className="flex flex-col items-center pb-8 border-b border-gray-100 mb-6 font-sans">
            <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-black mb-4 shadow-[4px_6px_0px_#555]">
              {initials}
            </div>
            <h3 className="font-black text-xl tracking-tighter uppercase">{profile?.name || 'User'}</h3>
            <p className="text-gray-400 text-xs mt-1 font-bold uppercase tracking-widest">{profile?.email}</p>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-2">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all text-left cursor-pointer border-2
                    ${activeTab === tab.id
                      ? 'bg-primary text-white border-primary shadow-[4px_4px_0px_#555]'
                      : 'text-gray-400 border-transparent hover:border-primary hover:text-primary'
                    }`}
                >
                  <Icon size={18} />
                  {tab.label}
                  {activeTab === tab.id && <ChevronRight size={14} className="ml-auto" />}
                </button>
              );
            })}
            <button 
              onClick={() => { handleLogout(); navigate('/'); }}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 border-2 border-transparent hover:border-red-100 transition-all text-left cursor-pointer mt-6"
            >
              <LogOut size={18} /> Logout
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {/* ─── Profile Settings ─── */}
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <h2 className="text-3xl font-black tracking-tighter uppercase mb-10">Profile Settings</h2>
                <div className="flex flex-col gap-8 max-w-2xl bg-gray-50/50 p-8 rounded-3xl border-2 border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Full Name</label>
                      <input type="text" value={profile?.name || ''}
                        onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                        className="bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 font-sans outline-none focus:border-primary transition-colors text-sm font-bold shadow-sm" />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Phone Number</label>
                      <input type="tel" value={profile?.phone || ''}
                        onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+91 98765 43210"
                        className="bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 font-sans outline-none focus:border-primary transition-colors text-sm font-bold shadow-sm" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Email Address</label>
                    <input type="email" value={profile?.email || ''} disabled
                      className="bg-gray-100 border-2 border-gray-100 rounded-2xl px-5 py-4 font-sans text-gray-400 text-sm font-bold cursor-not-allowed" />
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest pl-2">Email cannot be changed for security</p>
                  </div>
                  <button onClick={handleSaveProfile} disabled={saving}
                    className={`w-fit flex items-center gap-3 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all cursor-pointer border-2
                      ${saved ? 'bg-green-500 text-white border-green-500' : 'bg-primary text-white border-primary shadow-[4px_6px_0px_#111] hover:-translate-y-1'}`}>
                    {saved ? <><Check size={18} /> Profile Updated</> : saving ? 'Updating...' : 'Save Changes'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ─── Orders ─── */}
            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <h2 className="text-3xl font-black tracking-tighter uppercase mb-10">Order History</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <ShoppingBag size={48} className="mx-auto mb-4 text-gray-200" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No orders found yet</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {orders.map(order => (
                      <div key={order.id} className="bg-white border-2 border-gray-100 rounded-3xl p-6 hover:border-primary transition-colors shadow-sm group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-50 pb-6">
                          <div>
                            <p className="font-black text-sm tracking-tight uppercase">Order #{order.id.slice(-8)}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Amount</p>
                              <p className="font-black text-lg">{fmt(order.total_amount || order.total || 0)}</p>
                            </div>
                            <StatusBadge status={order.status} />
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-6">
                          {order.order_items?.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 bg-gray-50 pr-4 rounded-xl overflow-hidden border border-gray-100">
                              <img src={item.products?.image_url} alt="" className="w-16 h-16 object-cover" />
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-tight">{item.products?.name}</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <div className="mt-6 flex justify-end">
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="px-4 py-2 border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer"
                            >
                              Cancel Order
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── Addresses ─── */}
            {activeTab === 'addresses' && (
              <motion.div key="addresses" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-black tracking-tighter uppercase">Address Book</h2>
                  <button onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-3 px-6 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-primary shadow-[4px_6px_0px_#111] hover:-translate-y-1 transition-all cursor-pointer">
                    <Plus size={16} /> New Address
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map(addr => (
                    <div key={addr.id} className={`bg-white border-2 rounded-3xl p-8 relative shadow-sm transition-all ${addr.is_default ? 'border-primary' : 'border-gray-100 hover:border-gray-200'}`}>
                      {addr.is_default && <span className="absolute top-6 right-6 text-[9px] font-black bg-neon text-primary px-3 py-1 rounded-full uppercase tracking-widest">Default Address</span>}
                      <p className="font-black text-base uppercase mb-3 pr-20">{addr.full_name}</p>
                      <p className="text-sm font-medium text-gray-500 leading-relaxed mb-4">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />{addr.city}, {addr.state} – {addr.pincode}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-bold mb-6 uppercase tracking-widest">
                         <span className="text-primary font-black">MOBILE:</span> {addr.phone}
                      </div>
                      <div className="flex gap-4 pt-4 border-t border-gray-50">
                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors cursor-pointer"><Edit2 size={13} /> Edit</button>
                        <button onClick={() => handleDeleteAddress(addr.id)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={13} /> Remove</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Address Form */}
                {showAddressForm && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-10 bg-gray-50 rounded-3xl p-8 border-2 border-dashed border-gray-300">
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-8">Add New Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {['full_name', 'phone', 'line1', 'line2', 'city', 'state', 'pincode'].map(field => (
                        <div key={field} className={`flex flex-col gap-2 ${field === 'line1' || field === 'line2' ? 'md:col-span-2' : ''}`}>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">{field.replace('_', ' ')}</label>
                          <input type="text" value={newAddress[field]}
                            placeholder={`Enter ${field.replace('_', ' ')}`}
                            onChange={e => setNewAddress(p => ({ ...p, [field]: e.target.value }))}
                            className="bg-white border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-primary transition-colors shadow-sm" />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4 mt-10">
                      <button onClick={handleAddAddress}
                        className="flex-1 md:flex-none px-10 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-primary shadow-[4px_6px_0px_#111] hover:-translate-y-1 transition-all cursor-pointer">
                        Save Address
                      </button>
                      <button onClick={() => setShowAddressForm(false)}
                        className="flex-1 md:flex-none px-10 py-4 bg-white text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-gray-200 hover:border-primary hover:text-primary transition-all cursor-pointer">
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ─── Payment Methods ─── */}
            {activeTab === 'payments' && (
              <motion.div key="payments" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <h2 className="text-3xl font-black tracking-tighter uppercase mb-10">Payment Methods</h2>
                <div className="flex flex-col gap-4 max-w-xl">
                  {payments.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 mb-6">
                       <CreditCard size={32} className="mx-auto mb-3 text-gray-200" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">No saved cards found</p>
                    </div>
                  ) : (
                    payments.map(pm => (
                      <div key={pm.id} className={`bg-white border-2 rounded-2xl p-6 flex items-center justify-between shadow-sm ${pm.is_default ? 'border-primary' : 'border-gray-100 hover:border-gray-200'}`}>
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-10 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center">
                            <CreditCard size={20} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-black text-sm uppercase tracking-tight">{pm.brand} Card •••• {pm.last4}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Expires {pm.exp_month}/{pm.exp_year.toString().slice(-2)}</p>
                          </div>
                        </div>
                        {pm.is_default && <span className="text-[9px] font-black bg-neon text-primary px-3 py-1 rounded-full uppercase tracking-widest">Default</span>}
                      </div>
                    ))
                  )}
                  <div className="border-4 border-dashed border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-gray-300 hover:border-primary hover:text-primary transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary/5">
                       <Plus size={24} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Add New Payment Method</span>
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
