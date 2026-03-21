import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, TrendingUp, Bell, Plus, Star, MessageCircle, Settings } from 'lucide-react';
import { useStudents } from '@/hooks/useStudents';
import { useModules } from '@/hooks/useModules';
import { useNotices } from '@/hooks/useNotices';

const quickActions = [
  { icon: Plus, label: 'Nova Aula', desc: 'Adicionar aula a um módulo', path: '/admin/modulos', bg: 'rgba(59,130,246,0.1)' },
  { icon: BookOpen, label: 'Novo Material', desc: 'Fazer upload de material', path: '/admin/materiais', bg: 'rgba(139,92,246,0.1)' },
  { icon: Star, label: 'Novo Bônus', desc: 'Adicionar conteúdo bônus', path: '/admin/bonus', bg: 'rgba(245,158,11,0.1)' },
  { icon: Bell, label: 'Novo Aviso', desc: 'Publicar novidade para alunos', path: '/admin/avisos', bg: 'rgba(59,130,246,0.1)' },
  { icon: Users, label: 'Ver Alunos', desc: 'Gerenciar base de alunos', path: '/admin/alunos', bg: 'rgba(16,185,129,0.1)' },
  { icon: Settings, label: 'Configurações', desc: 'Ajustar dados do curso', path: '/admin/config', bg: 'rgba(255,255,255,0.05)' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: students } = useStudents();
  const { data: modules } = useModules();
  const { data: notices } = useNotices();

  const totalLessons = modules?.reduce((s, m) => s + 0, 0) ?? 27;
  const activeNotices = notices?.filter(n => n.active).length ?? 0;

  const stats = [
    { icon: Users, label: 'Alunos Ativos', value: students?.length ?? 0, bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' },
    { icon: BookOpen, label: 'Aulas Publicadas', value: 27, bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' },
    { icon: TrendingUp, label: 'Média de Progresso', value: '47%', bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
    { icon: Bell, label: 'Avisos Ativos', value: activeNotices, bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-sora font-bold text-2xl text-white">Painel do Administrador</h2>
        <p className="font-inter text-base mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Gerencie tudo do Método ZPPIA em um só lugar.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="glass-card p-5 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
              <s.icon size={20} style={{ color: s.color }} />
            </div>
            <div>
              <p className="font-sora font-[800] text-[28px] gradient-text">{s.value}</p>
              <p className="font-inter text-[12px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <h3 className="font-sora font-bold text-base text-white mt-6 mb-3">Ações Rápidas</h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {quickActions.map((a, i) => (
          <motion.div key={a.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 + i * 0.04 }}
            onClick={() => navigate(a.path)}
            className="glass-card p-4 flex items-center gap-3 cursor-pointer hover:border-zppia-blue/30 transition-colors">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: a.bg }}>
              <a.icon size={18} className="text-zppia-blue" />
            </div>
            <div className="min-w-0">
              <p className="font-sora font-semibold text-sm text-white">{a.label}</p>
              <p className="font-inter text-[12px] truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{a.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent activity */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="glass-card p-6 mt-5">
        <h3 className="font-sora font-bold text-base text-white mb-4">Atividade Recente</h3>
        <div className="flex flex-col">
          {[
            { color: '#3B82F6', text: 'Área de admin configurada com sucesso.', date: 'Hoje' },
            { color: '#8B5CF6', text: 'Schema Supabase criado e seed inserido.', date: 'Hoje' },
            { color: '#10B981', text: 'Área do aluno gerada pelo Lovable.', date: 'Ontem' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-start py-2.5 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: item.color }} />
              <div className="flex-1 flex items-center justify-between gap-4">
                <span className="font-inter text-[13px] text-white">{item.text}</span>
                <span className="font-inter text-[12px] flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
