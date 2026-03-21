import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { modules } from '@/data/course';
import { student } from '@/data/student';
import { Check, Play, Lock, Clock, BookOpen, ClipboardList } from 'lucide-react';

const fade = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function Trilha() {
  const navigate = useNavigate();

  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">
      {/* Header */}
      <motion.div {...fade} className="glass-card p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-sora font-[800] text-2xl text-white">Sua Jornada de Aprendizado</h2>
          <p className="font-inter text-[15px] mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>5 módulos · 27 aulas · Do zero ao projeto real</p>
        </div>
        <div className="flex items-center gap-3">
          <svg width="64" height="64" className="flex-shrink-0">
            <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
            <circle cx="32" cy="32" r="28" fill="none" stroke="url(#tg)" strokeWidth="5" strokeDasharray={2*Math.PI*28} strokeDashoffset={2*Math.PI*28*(1-student.progress/100)} strokeLinecap="round" transform="rotate(-90 32 32)" />
            <defs><linearGradient id="tg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3B82F6"/><stop offset="100%" stopColor="#8B5CF6"/></linearGradient></defs>
          </svg>
          <span className="font-sora font-[800] text-xl gradient-text">{student.progress}%</span>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="relative max-w-[900px] mx-auto">
        {/* Connecting line */}
        <div className="hidden lg:block absolute left-8 top-8 bottom-8 w-0.5"
          style={{ background: 'linear-gradient(to bottom, #10B981 0%, #10B981 20%, #3B82F6 40%, rgba(255,255,255,0.1) 60%)' }} />

        {modules.map((m, i) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex gap-6 mb-4 relative">
            {/* Status circle */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
              m.status === 'completed' ? 'bg-zppia-green' : m.status === 'in-progress' ? 'gradient-bg' : 'border-2 border-border'
            }`}
              style={m.status === 'completed' ? { boxShadow: '0 0 20px rgba(16,185,129,0.4)' } : m.status === 'in-progress' ? { boxShadow: '0 0 20px rgba(59,130,246,0.4)' } : { background: 'rgba(255,255,255,0.05)' }}>
              {m.status === 'completed' ? <Check size={24} className="text-white" /> : m.status === 'in-progress' ? <Play size={24} className="text-white" /> : <Lock size={24} style={{ color: 'rgba(255,255,255,0.35)' }} />}
            </div>

            {/* Module card */}
            <div className="flex-1 glass-card p-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="gradient-bg text-white font-sora font-bold text-xs px-2 py-1 rounded-md">Módulo {m.number}</span>
                <span className={`px-2 py-1 rounded-md font-inter font-medium text-xs border ${
                  m.status === 'completed' ? 'text-zppia-green border-zppia-green/30 bg-zppia-green/10' :
                  m.status === 'in-progress' ? 'text-zppia-blue border-zppia-blue/30 bg-zppia-blue/10' :
                  'border-border'
                }`} style={m.status === 'locked' ? { color: 'rgba(255,255,255,0.35)' } : {}}>
                  {m.status === 'completed' ? 'Concluído ✓' : m.status === 'in-progress' ? 'Em andamento' : 'Bloqueado'}
                </span>
              </div>
              <h3 className="font-sora font-bold text-xl text-white mt-2">{m.title}</h3>
              <p className="font-inter text-sm mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>{m.fullDesc}</p>
              <p className="font-inter font-medium text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Resultado: {m.result}</p>

              <div className="flex flex-wrap gap-4 mt-3">
                {[
                  [BookOpen, `${m.lessonCount} aulas`],
                  [Clock, `~${m.duration}`],
                  [ClipboardList, `${m.taskCount} tarefa`],
                ].map(([Icon, text]) => (
                  <span key={text as string} className="flex items-center gap-1 font-inter text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {/* @ts-ignore */}
                    <Icon size={14} />
                    {text as string}
                  </span>
                ))}
              </div>

              {m.status !== 'locked' && (
                <>
                  <div className="mt-3 progress-bar-track"><div className="progress-bar-fill" style={{ width: `${m.progress}%` }} /></div>
                  <p className="font-inter text-xs text-right mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{m.progress}% concluído</p>
                </>
              )}

              <button onClick={() => m.status !== 'locked' ? navigate(`/modulo/${m.id}`) : null}
                className={`mt-3 px-4 py-2 rounded-lg font-sora font-semibold text-[13px] transition-all ${
                  m.status !== 'locked' ? 'btn-gradient' : 'border border-border cursor-not-allowed'
                }`} style={m.status === 'locked' ? { color: 'rgba(255,255,255,0.35)' } : {}}>
                {m.status === 'locked' ? '🔒 Bloqueado' : 'Acessar Módulo →'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
