import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { student } from '@/data/student';
import { modules } from '@/data/course';
import { Play, Lock, CheckCircle, Zap, BookOpen, MessageCircle, Star, Award, Sparkles, HelpCircle } from 'lucide-react';
import SpotlightCard from '@/components/ui/SpotlightCard';
import TextReveal from '@/components/ui/TextReveal';
import MagneticButton from '@/components/ui/MagneticButton';

const fade = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

function ProgressRing({ size = 40, pct = 47, stroke = 3 }: { size?: number; pct?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="flex-shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#grad)" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} className="transition-all duration-1000" />
      <defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3B82F6"/><stop offset="100%" stopColor="#8B5CF6"/></linearGradient></defs>
    </svg>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  const shortcuts = [
    { icon: BookOpen, label: 'Central de Materiais', desc: 'Templates e checklists', bg: 'rgba(59,130,246,0.1)', path: '/materiais' },
    { icon: MessageCircle, label: 'Comunidade', desc: 'Tire suas dúvidas', bg: 'rgba(139,92,246,0.1)', path: '/comunidade' },
    { icon: Star, label: 'Área de Bônus', desc: 'Conteúdos extras', bg: 'rgba(245,158,11,0.1)', path: '/bonus' },
    { icon: Award, label: 'Certificado', desc: 'Sua conquista', bg: 'rgba(16,185,129,0.1)', path: '/certificado' },
    { icon: Sparkles, label: 'Mentoria Premium', desc: 'Acelere com Ronny', bg: 'rgba(139,92,246,0.15)', path: '/mentoria' },
    { icon: HelpCircle, label: 'Suporte', desc: 'Precisa de ajuda?', bg: 'rgba(255,255,255,0.05)', path: '/comunidade' },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">

      {/* Welcome Hero — aurora background */}
      <motion.div {...fade} transition={{ duration: 0.5 }}
        className="aurora-bg glass-card p-6 lg:p-7 mb-5"
        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.06) 100%)', borderColor: 'rgba(59,130,246,0.2)', borderRadius: 20 }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            {/* AI badge */}
            <span className="ai-pulse font-inter text-[11px] font-semibold tracking-widest mb-3 inline-flex"
              style={{ color: '#3B82F6' }}>
              MÉTODO ZPPIA
            </span>

            <TextReveal
              text={`${greeting}, ${student.name} 👋`}
              className="font-sora font-bold text-xl lg:text-2xl text-white mb-1"
              delay={0.1}
            />
            <p className="font-inter text-base mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Continue de onde parou. Seu projeto está esperando por você.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <ProgressRing pct={student.progress} />
              <div>
                <p className="font-inter font-medium text-sm text-white">Módulo 3 de 5</p>
                <p className="font-inter text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{student.completedLessons} aulas concluídas</p>
              </div>
            </div>
            <MagneticButton
              className="btn-gradient text-sm mt-4 flex items-center gap-2"
              onClick={() => navigate('/modulo/m2/aula/l2-3')}
            >
              <Play size={14} /> Continuar: {student.currentLesson.title}
            </MagneticButton>
          </div>
          <div className="hidden lg:flex flex-col gap-2">
            {[`🎯 ${student.progress}% concluído`, `📖 ${student.completedLessons} aulas`, `✓ ${student.completedTasks} tarefas`].map(t => (
              <span key={t} className="px-3 py-1.5 rounded-lg font-inter font-medium text-[13px] border border-border"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.65)' }}>{t}</span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Daily Action */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.06 }}
        className="glass-card p-5 mb-5 flex gap-4" style={{ borderLeft: '3px solid hsl(217, 91%, 60%)' }}>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.1)' }}>
          <Zap size={20} className="text-zppia-blue" />
        </div>
        <div>
          <p className="font-inter font-medium text-[11px] text-zppia-blue tracking-widest">AÇÃO DO DIA</p>
          <p className="font-inter text-[15px] mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Assista a Aula 2 do Módulo 3 e complete o checklist de estrutura do projeto.
          </p>
          <button className="font-inter font-medium text-[13px] text-zppia-blue mt-2 hover:underline">Fazer agora →</button>
        </div>
      </motion.div>

      {/* Module Cards — com Spotlight e 3D tilt */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.12 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-sora font-bold text-lg text-white">Trilha do Método ZPPIA</h3>
          <button onClick={() => navigate('/trilha')} className="font-inter font-medium text-[13px] text-zppia-blue hover:underline">Ver tudo →</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0">
          {modules.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 + i * 0.06 }}
              style={{ minWidth: 220 }}
            >
              <SpotlightCard
                className="glass-card p-5 flex flex-col h-full cursor-pointer"
                style={{ minWidth: 220, borderRadius: 16 }}
                spotlightColor={m.status === 'locked' ? 'rgba(255,255,255,0.04)' : 'rgba(59,130,246,0.1)'}
                onClick={() => m.status !== 'locked' ? navigate(`/modulo/${m.id}`) : null}
              >
                <div className="flex items-center justify-between">
                  <span className="gradient-bg text-white font-sora font-bold text-[11px] px-2 py-0.5 rounded-md">Módulo {m.number}</span>
                  {m.status === 'completed' ? <CheckCircle size={16} className="text-zppia-green" /> :
                   m.status === 'in-progress' ? <Play size={16} className="text-zppia-blue" /> :
                   <Lock size={16} style={{ color: 'rgba(255,255,255,0.35)' }} />}
                </div>
                <h4 className="font-sora font-semibold text-base text-white mt-3 line-clamp-2">{m.title}</h4>
                <p className="font-inter text-[13px] mt-1.5 line-clamp-2" style={{ color: 'rgba(255,255,255,0.35)' }}>{m.shortDesc}</p>
                <div className="mt-3 progress-bar-track"><div className="progress-bar-fill" style={{ width: `${m.progress}%` }} /></div>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="font-inter text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{m.lessonCount} aulas</span>
                  <span className={`font-inter font-medium text-[13px] ${m.status === 'locked' ? '' : 'text-zppia-blue'}`}
                    style={m.status === 'locked' ? { color: 'rgba(255,255,255,0.35)' } : {}}>
                    {m.status === 'locked' ? 'Bloqueado' : 'Acessar →'}
                  </span>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Progress + Activity */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <SpotlightCard className="glass-card p-6" style={{ borderRadius: 16 }} spotlightColor="rgba(139,92,246,0.08)">
          <h3 className="font-sora font-bold text-base text-white mb-4">Seu Progresso</h3>
          <div className="flex flex-col items-center">
            <ProgressRing size={80} pct={student.progress} stroke={4} />
            <p className="font-sora font-[800] text-lg gradient-text mt-1">{student.progress}%</p>
            <p className="font-inter text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {student.completedLessons} de {student.totalLessons} aulas concluídas
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            {[['2/5', 'Módulos'], [String(student.completedLessons), 'Aulas'], [String(student.completedTasks), 'Tarefas'], ['4h', 'Estudados']].map(([n, l]) => (
              <div key={l} className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="font-sora font-bold text-lg text-white">{n}</p>
                <p className="font-inter text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{l}</p>
              </div>
            ))}
          </div>
        </SpotlightCard>

        <SpotlightCard className="glass-card p-6" style={{ borderRadius: 16 }} spotlightColor="rgba(59,130,246,0.08)">
          <h3 className="font-sora font-bold text-base text-white mb-4">Últimas Atividades</h3>
          <div className="flex flex-col">
            {student.activities.map((a, i) => (
              <div key={i} className="flex gap-3 items-start py-2 border-b border-border last:border-0">
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: a.color === 'blue' ? '#3B82F6' : a.color === 'green' ? '#10B981' : 'rgba(255,255,255,0.35)' }} />
                <div>
                  <p className="font-inter text-[13px] text-white">{a.text}</p>
                  <p className="font-inter text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{a.date}</p>
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </motion.div>

      {/* Shortcuts */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.36 }} className="mt-5">
        <h3 className="font-sora font-bold text-base text-white mb-3">Atalhos Rápidos</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {shortcuts.map(s => (
            <SpotlightCard
              key={s.label}
              className="glass-card p-4 flex items-center gap-3 cursor-pointer hover:border-zppia-blue/30 transition-colors"
              style={{ borderRadius: 16 }}
              spotlightColor="rgba(59,130,246,0.07)"
            >
              <div onClick={() => navigate(s.path)} className="flex items-center gap-3 w-full">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                  <s.icon size={18} className="text-zppia-blue" />
                </div>
                <div>
                  <p className="font-sora font-semibold text-sm text-white">{s.label}</p>
                  <p className="font-inter text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.desc}</p>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </motion.div>

      {/* News */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.42 }} className="mt-5">
        <h3 className="font-sora font-bold text-base text-white mb-3">Novidades</h3>
        <div className="flex flex-col gap-2.5">
          {[
            { color: '#3B82F6', text: 'Nova aula adicionada ao Módulo 4. Acesse agora.', date: 'Hoje' },
            { color: '#8B5CF6', text: 'Bônus exclusivo disponível: Biblioteca de Prompts v2.', date: '3 dias atrás' },
            { color: '#F59E0B', text: 'Próxima sessão de mentoria: data a confirmar.', date: '' },
          ].map((n, i) => (
            <SpotlightCard key={i} className="glass-card px-4 py-3 flex gap-3 items-start" style={{ borderRadius: 12 }}>
              <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: n.color }} />
              <div>
                <p className="font-inter text-sm text-white">{n.text}</p>
                {n.date && <p className="font-inter text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{n.date}</p>}
              </div>
            </SpotlightCard>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
