// AboutContactPage.jsx – Sports E-Commerce themed
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, MapPin, Phone, Instagram, Youtube, Twitter,
  Send, Check, Trophy, Zap, Users, Shield, Star, ArrowRight,
} from 'lucide-react';

const VALUES = [
  {
    icon: Trophy,
    num: '01',
    title: 'Built for Champions',
    desc: 'Every product in our store is tested for performance. We partner only with brands that athletes trust at the highest levels.',
  },
  {
    icon: Zap,
    num: '02',
    title: 'Speed & Quality',
    desc: 'Fast delivery, hassle-free returns, and gear that lasts. We cut no corners — because neither should you.',
  },
  {
    icon: Shield,
    num: '03',
    title: '100% Authentic',
    desc: 'No counterfeits, no compromises. Every item is sourced directly from authorised brand partners.',
  },
];

const STATS = [
  { value: '50K+', label: 'Happy Athletes' },
  { value: '500+', label: 'Premium Brands' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '30 Days', label: 'Easy Returns' },
];

const TEAM = [
  { name: 'Arjun Sharma', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  { name: 'Priya Nair', role: 'Head of Partnerships', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80' },
  { name: 'Rahul Mehta', role: 'Lead Designer', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
];

const AboutContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">

      {/* ── Hero Banner ── */}
      <div className="relative w-full overflow-hidden bg-[#0D1B2A]">
        <img
          src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=2000&q=80"
          alt="About SportZone"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 py-20">
          <p className="section-label mb-3">About Us</p>
          <h1
            className="font-heading font-black text-white uppercase leading-none mb-4"
            style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}
          >
            WE FUEL<br />
            <span className="text-[#00C896]">CHAMPIONS.</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl leading-relaxed font-sans">
            SportZone is India's premier online destination for premium sports gear, apparel, and performance equipment — trusted by athletes across every discipline.
          </p>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="bg-[#00C896]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-5 grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/20">
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center justify-center py-2 px-4 text-center">
              <p className="font-heading font-black text-white text-[28px] md:text-[36px] leading-none">{value}</p>
              <p className="text-white/80 text-[12px] font-medium uppercase tracking-widest mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Story Section ── */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-label mb-3">Our Story</p>
            <h2 className="font-heading font-black text-[#0a0a0a] uppercase leading-none mb-6" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
              FROM THE<br /><span className="text-[#00C896]">FIELD</span> TO<br />YOUR DOOR.
            </h2>
            <div className="flex flex-col gap-4 text-gray-500 text-[15px] leading-relaxed font-sans">
              <p>
                SportZone was founded in 2020 by a group of passionate athletes who were tired of compromising on gear quality. We believed that every player — amateur or professional — deserves access to the same equipment that champions use.
              </p>
              <p>
                Today, we partner with 500+ premium brands across cricket, football, running, cycling, swimming, and fitness to bring you authentic, performance-grade gear at accessible prices.
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/products'}
              className="mt-8 inline-flex items-center gap-2 bg-[#00C896] hover:bg-[#009b74] text-white font-heading font-black text-[13px] uppercase tracking-widest px-7 py-3.5 rounded transition-all cursor-pointer"
            >
              Shop Our Collection <ArrowRight size={16} />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1571019613914-85f342c6a11e?auto=format&fit=crop&w=800&q=80"
              alt="Athletes in action"
              className="w-full rounded-2xl object-cover aspect-[4/3]"
            />
            {/* Floating badge */}
            <div className="absolute -bottom-5 -left-5 bg-[#0D1B2A] rounded-xl p-4 shadow-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00C896] rounded-full flex items-center justify-center shrink-0">
                <Trophy size={18} color="#fff" strokeWidth={2} />
              </div>
              <div>
                <p className="font-heading font-black text-white text-[14px] uppercase leading-none">Since 2020</p>
                <p className="text-white/50 text-[11px] mt-0.5">Powering athletes everywhere</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Values ── */}
      <div className="bg-[#f5f7fa] py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <p className="section-label">Why SportZone</p>
            <h2 className="font-heading font-black text-[#0a0a0a] uppercase leading-none" style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
              OUR <span className="text-[#00C896]">VALUES</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="bg-white rounded-xl p-8 border-2 border-transparent hover:border-[#00C896] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#00C896]/10 border border-[#00C896]/30 flex items-center justify-center mb-5 group-hover:bg-[#00C896] transition-colors">
                  <v.icon size={22} color="#00C896" strokeWidth={2} className="group-hover:text-white" />
                </div>
                <div className="font-heading font-black text-[#00C896] text-[13px] uppercase tracking-widest mb-2">{v.num}</div>
                <h3 className="font-heading font-black text-[#0a0a0a] text-[20px] uppercase leading-tight mb-3">{v.title}</h3>
                <p className="text-gray-500 text-[14px] leading-relaxed font-sans">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>



      {/* ── Contact Section ── */}
      <div className="bg-[#0D1B2A] py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

            {/* Left: Info */}
            <div>
              <p className="section-label mb-3">Contact</p>
              <h2
                className="font-heading font-black text-white uppercase leading-none mb-4"
                style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
              >
                GET IN <span className="text-[#00C896]">TOUCH.</span>
              </h2>
              <p className="text-white/50 text-[15px] leading-relaxed font-sans mb-10 max-w-md">
                Have a question about an order, a gear recommendation, or want to partner with us? Our team is ready to help.
              </p>

              <div className="flex flex-col gap-6">
                {[
                  { icon: Phone, label: 'Phone', value: '+91 800 123 4567', href: 'tel:+918001234567' },
                  { icon: Mail, label: 'Email', value: 'hello@sportzone.in', href: 'mailto:hello@sportzone.in' },
                  { icon: MapPin, label: 'Location', value: 'Mumbai, Maharashtra, India', href: null },
                  { icon: Instagram, label: 'Instagram', value: '@sportzone.in', href: 'https://instagram.com' },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#00C896]/15 border border-[#00C896]/30 flex items-center justify-center shrink-0">
                      <Icon size={20} color="#00C896" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-white/40 text-[11px] font-heading uppercase tracking-widest">{label}</p>
                      {href ? (
                        <a href={href} target="_blank" rel="noreferrer" className="text-white font-heading font-black text-[15px] uppercase hover:text-[#00C896] transition-colors">
                          {value}
                        </a>
                      ) : (
                        <p className="text-white font-heading font-black text-[15px] uppercase">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social row */}
              <div className="flex items-center gap-3 mt-10">
                {[
                  { icon: Instagram, href: '#' },
                  { icon: Youtube, href: '#' },
                  { icon: Twitter, href: '#' },
                ].map(({ icon: Icon, href }, i) => (
                  <a key={i} href={href}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#00C896] flex items-center justify-center transition-all cursor-pointer text-white">
                    <Icon size={17} strokeWidth={1.8} />
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-white rounded-2xl p-8">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-14 gap-4 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#00C896] flex items-center justify-center">
                    <Check size={28} color="#fff" strokeWidth={3} />
                  </div>
                  <h3 className="font-heading font-black text-[#0a0a0a] text-[24px] uppercase">Message Sent!</h3>
                  <p className="text-gray-500 text-[14px] font-sans">Our team will get back to you within 24 hours.</p>
                  <button
                    id="send-another-btn"
                    onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="mt-2 text-sm text-[#00C896] font-heading font-black uppercase tracking-widest hover:text-[#009b74] transition-colors cursor-pointer"
                  >
                    Send Another →
                  </button>
                </motion.div>
              ) : (
                <form id="contact-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <p className="section-label">Send a Message</p>
                    <h3 className="font-heading font-black text-[#0a0a0a] text-[24px] uppercase leading-tight">We're here to help.</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-heading font-black uppercase tracking-widest text-gray-500">Your Name</label>
                      <input
                        id="contact-name"
                        required
                        type="text"
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="John Smith"
                        className="border-2 border-gray-200 focus:border-[#00C896] rounded px-4 py-3 text-[14px] outline-none transition-colors font-sans"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-heading font-black uppercase tracking-widest text-gray-500">Email Address</label>
                      <input
                        id="contact-email"
                        required
                        type="email"
                        value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                        placeholder="john@example.com"
                        className="border-2 border-gray-200 focus:border-[#00C896] rounded px-4 py-3 text-[14px] outline-none transition-colors font-sans"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-heading font-black uppercase tracking-widest text-gray-500">Subject</label>
                    <select
                      id="contact-subject"
                      value={form.subject}
                      onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                      className="border-2 border-gray-200 focus:border-[#00C896] rounded px-4 py-3 text-[14px] outline-none transition-colors font-sans cursor-pointer"
                    >
                      <option value="">Select a topic...</option>
                      <option value="order">Order / Delivery Query</option>
                      <option value="return">Return / Exchange</option>
                      <option value="gear">Gear Recommendation</option>
                      <option value="partner">Partnership / B2B</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-heading font-black uppercase tracking-widest text-gray-500">Message</label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us how we can help..."
                      className="border-2 border-gray-200 focus:border-[#00C896] rounded px-4 py-3 text-[14px] outline-none transition-colors resize-none font-sans"
                    />
                  </div>

                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 bg-[#00C896] hover:bg-[#009b74] text-white font-heading font-black text-[14px] uppercase tracking-widest py-4 rounded transition-all hover:shadow-[0_8px_24px_rgba(0,200,150,0.35)] hover:-translate-y-0.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : <><Send size={16} strokeWidth={2.5} /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default AboutContactPage;
