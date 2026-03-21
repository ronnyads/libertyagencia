import { motion } from 'framer-motion';
import { useState } from 'react';
import { LogOut, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const achievements = [
  { emoji: '🏁', title: 'Primeiro Módulo Concluído', desc: 'Completou o Módulo 1', earned: true },
  { emoji: '⚡', title: 'Executor', desc: 'Completou 3 tarefas práticas', earned: true },
  { emoji: '🏆', title: 'Método Completo', desc: 'Concluiu todos os 5 módulos', earned: false },
];

function getInitials(name: string) {
  return name.trim().split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'SN';
}

export default function Profile() {
  const [notifs, setNotifs] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [emails, setEmails] = useState(true);
  const { logout, studentName, userId } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(studentName || '');
  const [saving, setSaving] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleSave = async () => {
    if (!nameInput.trim()) return;
    setSaving(true);
    try {
      if (userId) {
        await supabase.from('profiles').update({ name: nameInput.trim() }).eq('id', userId);
      }
      await supabase.auth.updateUser({ data: { name: nameInput.trim() } });
      toast.success('Perfil atualizado!');
      setEditing(false);
    } catch {
      toast.error('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const displayName = nameInput || studentName || 'Seu Nome';
  const initials = getInitials(displayName);

  const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`w-11 h-6 rounded-full transition-all relative ${on ? 'gradient-bg' : 'bg-zppia-surface'}`}>
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${on ? 'left-6' : 'left-1'}`} />
    </button>
  );

  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-sora font-bold text-2xl text-white">Meu Perfil</h2>
      </motion.div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
        className="glass-card p-7 mt-5 mb-5 flex flex-col sm:flex-row items-center gap-5">
        <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
          <span className="font-sora font-[800] text-[28px] text-white">{initials}</span>
        </div>
        <div className="text-center sm:text-left">
          <h3 className="font-sora font-bold text-2xl text-white">{displayName}</h3>
          <p className="font-inter text-[15px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{studentName ? '' : 'aluno@zppia.com'}</p>
          <button onClick={() => { setNameInput(studentName || ''); setEditing(true); }} className="btn-ghost-blue text-sm mt-2">
            Editar Perfil
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Course info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="glass-card p-6">
          <h3 className="font-sora font-bold text-base text-white mb-4">Acesso ao Curso</h3>
          <p className="font-inter font-semibold text-[15px] text-white">Método ZPPIA</p>
          <p className="font-inter text-sm mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Acesso: Vitalício</p>
          <p className="font-inter text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Plataforma: ZPPIA Academy</p>
          <div className="border-t border-border mt-3 pt-3">
            <p className="font-inter text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>Mentor: Ronny Oliveira</p>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="glass-card p-6">
          <h3 className="font-sora font-bold text-base text-white mb-4">Conquistas</h3>
          <div className="flex flex-col">
            {achievements.map(a => (
              <div key={a.title} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${a.earned ? 'gradient-bg' : 'bg-zppia-surface opacity-40'}`}
                  style={a.earned ? { boxShadow: '0 0 12px rgba(59,130,246,0.2)' } : {}}>
                  <span className="text-lg">{a.emoji}</span>
                </div>
                <div>
                  <p className={`font-sora font-medium text-sm ${a.earned ? 'text-white' : ''}`} style={!a.earned ? { color: 'rgba(255,255,255,0.35)' } : {}}>{a.title}</p>
                  <p className="font-inter text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Logout */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="mt-4">
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-inter font-medium text-sm transition-colors"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
          <LogOut size={16} />
          Sair da conta
        </button>
      </motion.div>

      {/* Preferences */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="glass-card p-6 mt-4">
        <h3 className="font-sora font-bold text-base text-white mb-4">Preferências</h3>
        {[
          { label: 'Notificações de novidades', desc: 'Avisos sobre atualizações e bônus', on: notifs, toggle: () => setNotifs(!notifs) },
          { label: 'Lembretes de estudo', desc: 'Notificações para manter o ritmo', on: reminders, toggle: () => setReminders(!reminders) },
          { label: 'E-mails do mentor', desc: 'Mensagens exclusivas de Ronny Oliveira', on: emails, toggle: () => setEmails(!emails) },
        ].map(p => (
          <div key={p.label} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
            <div>
              <p className="font-inter font-medium text-sm text-white">{p.label}</p>
              <p className="font-inter text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{p.desc}</p>
            </div>
            <Toggle on={p.on} onChange={p.toggle} />
          </div>
        ))}
      </motion.div>

      {/* Edit Profile Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(3,7,18,0.8)', backdropFilter: 'blur(8px)' }}
          onClick={e => { if (e.target === e.currentTarget) setEditing(false); }}>
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-card p-8 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-sora font-bold text-xl text-white">Editar Perfil</h3>
              <button onClick={() => setEditing(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <X size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
              </button>
            </div>

            <label className="block font-inter font-medium text-sm text-white mb-2">Nome</label>
            <input
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder="Seu nome completo"
              className="w-full px-4 py-3 rounded-xl font-inter text-sm text-white mb-6"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', outline: 'none' }}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus
            />

            <div className="flex gap-3">
              <button onClick={() => setEditing(false)} className="flex-1 py-2.5 rounded-xl font-inter font-medium text-sm"
                style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }}>
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving || !nameInput.trim()} className="flex-1 btn-gradient py-2.5 rounded-xl font-inter font-medium text-sm text-white disabled:opacity-50">
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
