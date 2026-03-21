// src/pages/LoginPage.jsx – Sporty Revamp
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, Zap, Trophy, ShieldCheck } from 'lucide-react';
import { authApi } from '../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const json = await authApi.login({ email, password });
      handleLogin(json.data.accessToken, json.data.user);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0D1B2A]">
      {/* ── Background Elements ── */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1920&q=80" 
          alt="Athlete background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-transparent to-[#0D1B2A]/80" />
      </div>

      {/* ── Floating Sport Icons ── */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 text-[#00C896]/10 hidden lg:block"
      >
        <Zap size={120} strokeWidth={1} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 text-[#00C896]/10 hidden lg:block"
      >
        <Trophy size={140} strokeWidth={1} />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-5"
      >
        {/* Logo Badge */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-[#00C896] rounded-2xl rotate-12 flex items-center justify-center shadow-[4px_4px_20px_rgba(0,200,150,0.4)]">
            <Zap className="text-[#0D1B2A] -rotate-12" size={32} fill="currentColor" />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="font-heading font-black text-4xl text-white uppercase tracking-tight mb-2">
              Welcome <span className="text-[#00C896]">Back</span>
            </h1>
            <p className="text-white/50 text-sm font-medium">Ready for your next challenge?</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-[#00C896]">Athlete ID (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#00C896] transition-colors" size={18} />
                <input 
                  required
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:border-[#00C896] transition-all font-sans"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-[#00C896]">Passkey</label>
                <a href="#" className="text-[10px] font-bold text-white/40 hover:text-[#00C896] uppercase tracking-wider transition-colors">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#00C896] transition-colors" size={18} />
                <input 
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder:text-white/20 outline-none focus:border-[#00C896] transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#00C896] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-[#ff4d4d] text-xs font-bold bg-[#ff4d4d]/10 p-3 rounded-lg border border-[#ff4d4d]/20"
              >
                <ShieldCheck size={14} /> {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#00C896] hover:bg-[#009b74] text-[#0D1B2A] py-4 rounded-xl font-heading font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_30px_rgba(0,200,150,0.3)] disabled:opacity-50 disabled:scale-100"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Enter the Arena <ArrowRight size={18} strokeWidth={3} /></>}
            </button>
          </form>

          <div className="mt-10 text-center text-xs">
            <span className="text-white/40 font-medium font-sans">New to the squad? </span>
            <Link to="/signup" className="text-[#00C896] font-heading font-black uppercase tracking-widest hover:underline underline-offset-4 decoration-2">Create Account</Link>
          </div>
        </div>
        
        {/* Footer trust badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-white/20 text-[10px] uppercase font-heading font-bold tracking-widest">
          <ShieldCheck size={12} /> SSL Secure Authentication
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
