import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, role } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      // role vem do onAuthStateChange — pequeno delay para carregar
      setTimeout(() => {
        const storedRole = localStorage.getItem('zppia_role');
        if (storedRole === 'admin') navigate('/admin/dashboard', { replace: true });
        else navigate('/dashboard', { replace: true });
      }, 300);
    } else {
      setError(result.error || 'Email ou senha incorretos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-grid px-4" style={{ background: 'hsl(222, 60%, 5%)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="glass-card p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <div className="w-6 h-6 rounded gradient-bg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><circle cx="4" cy="6" r="2" fill="white"/><circle cx="8" cy="6" r="2" fill="white" fillOpacity="0.7"/></svg>
            </div>
            <span className="font-sora font-[800] text-2xl gradient-text">ZPPIA</span>
          </div>
          <p className="font-inter text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Acesse sua área</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-inter text-sm font-medium text-white block mb-1.5">E-mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-[10px] font-inter text-sm text-white border border-border focus:border-zppia-blue focus:outline-none transition-colors"
              style={{ background: 'rgba(255,255,255,0.03)' }}
              placeholder="seu@email.com" />
          </div>
          <div>
            <label className="font-inter text-sm font-medium text-white block mb-1.5">Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-[10px] font-inter text-sm text-white border border-border focus:border-zppia-blue focus:outline-none transition-colors"
              style={{ background: 'rgba(255,255,255,0.03)' }}
              placeholder="••••••••" />
          </div>
          {error && <p className="font-inter text-sm text-zppia-red">{error}</p>}
          <button type="submit" disabled={loading} className="btn-gradient w-full py-3 text-sm mt-2 disabled:opacity-60">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="font-inter text-[11px] text-center" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Aluno: aluno@zppia.com / zppia2025
          </p>
          <p className="font-inter text-[11px] text-center mt-1" style={{ color: 'rgba(255,255,255,0.18)' }}>
            Admin: ronny@zppia.com / admin2025
          </p>
        </div>
      </motion.div>
    </div>
  );
}
