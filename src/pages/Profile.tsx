import { motion } from 'framer-motion';
import { student } from '@/data/student';
import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const achievements = [
  { emoji: '🏁', title: 'Primeiro Módulo Concluído', desc: 'Completou o Módulo 1', earned: true },
  { emoji: '⚡', title: 'Executor', desc: 'Completou 3 tarefas práticas', earned: true },
  { emoji: '🏆', title: 'Método Completo', desc: 'Concluiu todos os 5 módulos', earned: false },
];

export default function Profile() {
  const [notifs, setNotifs] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [emails, setEmails] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

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
          <span className="font-sora font-[800] text-[28px] text-white">SN</span>
        </div>
        <div className="text-center sm:text-left">
          <h3 className="font-sora font-bold text-2xl text-white" data-placeholder>{student.name}</h3>
          <p className="font-inter text-[15px]" style={{ color: 'rgba(255,255,255,0.35)' }} data-placeholder>{student.email}</p>
          <p className="font-inter text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Membro desde {student.memberSince}</p>
          <button className="btn-ghost-blue text-sm mt-2">Editar Perfil</button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Course info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="glass-card p-6">
          <h3 className="font-sora font-bold text-base text-white mb-4">Acesso ao Curso</h3>
          <p className="font-inter font-semibold text-[15px] text-white">Método ZPPIA</p>
          <p className="font-inter text-sm mt-1" style={{ color: 'rgba(255,255,255,0.35)' }} data-placeholder>Acesso: Vitalício</p>
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
    </div>
  );
}
