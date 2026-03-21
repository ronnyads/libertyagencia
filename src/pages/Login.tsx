import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/dashboard');
    } else {
      setError('Email ou senha incorretos.');
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
          <p className="font-inter text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Acesse sua área de aluno</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-inter text-sm font-medium text-white block mb-1.5">E-mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-[10px] font-inter text-sm text-white border border-border focus:border-zppia-blue focus:outline-none transition-colors"
              style={{ background: 'rgba(255,255,255,0.03)' }}
              placeholder="aluno@zppia.com" data-placeholder="" />
          </div>
          <div>
            <label className="font-inter text-sm font-medium text-white block mb-1.5">Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-[10px] font-inter text-sm text-white border border-border focus:border-zppia-blue focus:outline-none transition-colors"
              style={{ background: 'rgba(255,255,255,0.03)' }}
              placeholder="••••••••" data-placeholder="" />
          </div>
          {error && <p className="font-inter text-sm text-zppia-red">{error}</p>}
          <button type="submit" className="btn-gradient w-full py-3 text-sm mt-2">Entrar</button>
        </form>

        <p className="font-inter text-xs text-center mt-6" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Demo: aluno@zppia.com / zppia2025
        </p>
      </motion.div>
    </div>
  );
}
