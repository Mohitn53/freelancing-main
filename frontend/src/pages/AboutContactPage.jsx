// AboutContactPage.jsx – combined About + Contact in one premium page
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Instagram, Send, Check } from 'lucide-react';

const values = [
  { title: 'Minimal by Design', desc: 'Every piece we create strips away the excess. Nothing is here by accident.' },
  { title: 'Made to Last', desc: 'Slow fashion that invests in quality materials, not fast trends.' },
  { title: "Drop Culture", desc: "Limited releases. No restocks. If you see it – it's your drop." },
];

const AboutContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-20">

      {/* ─── Hero Text ─── */}
      <div className="max-w-3xl mb-24">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-[0.2em] mb-4">About dr⋆p.code</p>
        <h1 className="text-[clamp(48px,6vw,96px)] font-extrabold tracking-tighter leading-[0.9] mb-8">
          We dress<br />
          <span className="text-gray-300">the bold.</span>
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
          dr⋆p.code is a minimalist streetwear label born from the belief that great design needs no noise.
          We create timeless essentials for those who move through the world with intent.
        </p>
      </div>

      {/* ─── Values ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-28">
        {values.map((v, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="bg-[#f7f7f7] rounded-2xl p-8 hover:shadow-[4px_6px_0px_#111] transition-all duration-300 cursor-default border-2 border-transparent hover:border-primary"
          >
            <div className="text-3xl font-black tracking-tighter mb-4 text-primary">0{i + 1}</div>
            <h3 className="text-lg font-bold tracking-tight mb-2">{v.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* ─── Contact Section ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left info */}
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-[0.2em] mb-4">Get in Touch</p>
          <h2 className="text-4xl font-extrabold tracking-tighter mb-6">Let's talk.</h2>
          <p className="text-gray-500 text-base leading-relaxed mb-10">
            Whether you have a question about a drop, a collaboration idea, or just want to say hello —
            we read every message.
          </p>

          <div className="flex flex-col gap-5">
            <a href="mailto:hello@dropcode.in" className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-[2px_3px_0px_#555] group-hover:shadow-[3px_5px_0px_#555] transition-all">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="font-semibold text-sm">hello@dropcode.in</p>
              </div>
            </a>
            <a href="https://instagram.com/dropcode" target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-[2px_3px_0px_#555] group-hover:shadow-[3px_5px_0px_#555] transition-all">
                <Instagram size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Instagram</p>
                <p className="font-semibold text-sm">@dropcode</p>
              </div>
            </a>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-[2px_3px_0px_#555]">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Studio</p>
                <p className="font-semibold text-sm">Mumbai, India 🇮🇳</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#f7f7f7] rounded-2xl p-8 border-2 border-gray-100">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                <Check size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Message sent!</h3>
              <p className="text-gray-500 text-sm text-center">We'll get back to you within 24 hours.</p>
              <button onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }); }}
                className="text-sm text-gray-400 hover:text-primary transition-colors mt-2 cursor-pointer">
                Send another →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <h3 className="text-xl font-bold tracking-tight mb-1">Send a message</h3>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">Your Name</label>
                <input required type="text" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">Email Address</label>
                <input required type="email" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">Message</label>
                <textarea required rows={5} value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none" />
              </div>
              <button type="submit" disabled={loading}
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white rounded-xl font-semibold text-sm border-2 border-primary shadow-[2px_3px_0px_#111] hover:-translate-y-0.5 hover:shadow-[3px_5px_0px_#111] transition-all cursor-pointer disabled:opacity-60">
                {loading ? 'Sending...' : <><Send size={16} /> Send Message</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AboutContactPage;
