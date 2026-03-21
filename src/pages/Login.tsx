import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Zap, Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const { login, role, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn && isLoggedIn) {
      if (role === 'admin') navigate('/admin/dashboard', { replace: true });
      else navigate('/dashboard', { replace: true });
    }
  }, [loggedIn, isLoggedIn, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) setLoggedIn(true);
    else setError(result.error || 'E-mail ou senha incorretos.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#030712' }}>

      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 60%)', filter: 'blur(120px)' }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-[420px] mx-4"
      >
        {/* Card glow */}
        <div className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))', filter: 'blur(1px)' }} />

        <div className="relative rounded-2xl p-8"
          style={{
            background: 'rgba(12,18,37,0.85)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}>

          {/* Header */}
          <div className="text-center mb-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="flex items-center justify-center gap-2 mb-5"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center relative"
                style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', boxShadow: '0 0 24px rgba(59,130,246,0.4)' }}>
                <svg width="18" height="18" viewBox="0 0 12 12" fill="none">
                  <circle cx="3.5" cy="6" r="2.5" fill="white" />
                  <circle cx="8.5" cy="6" r="2.5" fill="white" fillOpacity="0.6" />
                  <line x1="5.5" y1="6" x2="6.5" y2="6" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>
              <span className="font-sora font-[800] text-3xl" style={{ background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ZPPIA
              </span>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h1 className="font-sora font-bold text-xl text-white mb-1">Bem-vindo de volta</h1>
              <p className="font-inter text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Acesse sua área e continue aprendendo
              </p>
            </motion.div>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Email */}
            <div>
              <label className="font-inter text-[13px] font-medium block mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                E-mail
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'rgba(255,255,255,0.25)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl font-inter text-sm text-white transition-all outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    caretColor: '#3B82F6',
                  }}
                  onFocus={e => { e.target.style.border = '1px solid rgba(59,130,246,0.5)'; e.target.style.background = 'rgba(59,130,246,0.06)'; }}
                  onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="font-inter text-[13px] font-medium block mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Senha
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'rgba(255,255,255,0.25)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl font-inter text-sm text-white transition-all outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    caretColor: '#3B82F6',
                  }}
                  onFocus={e => { e.target.style.border = '1px solid rgba(59,130,246,0.5)'; e.target.style.background = 'rgba(59,130,246,0.06)'; }}
                  onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 transition-opacity hover:opacity-100"
                  style={{ color: 'rgba(255,255,255,0.3)', opacity: 0.7 }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -4, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  <p className="font-inter text-[13px]" style={{ color: '#FCA5A5' }}>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-sora font-semibold text-[15px] text-white relative overflow-hidden transition-all mt-2 disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(59,130,246,0.35), 0 0 0 1px rgba(255,255,255,0.08) inset',
              }}
            >
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <Zap size={15} className="opacity-80" />
                    <span>Entrar na plataforma</span>
                  </>
                )}
              </span>
            </button>
          </motion.form>

          {/* Divider + credentials hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 pt-5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <p className="font-inter text-[11px] text-center leading-relaxed" style={{ color: 'rgba(255,255,255,0.18)' }}>
              Dificuldades de acesso? Entre em contato com o suporte.
            </p>
          </motion.div>
        </div>

        {/* Bottom badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-1.5 mt-5"
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(59,130,246,0.5)' }} />
          <p className="font-inter text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Método ZPPIA · Plataforma segura
          </p>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(139,92,246,0.5)' }} />
        </motion.div>
      </motion.div>
    </div>
  );
}
