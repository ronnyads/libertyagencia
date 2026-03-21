import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { modules } from '@/data/course';
import { Check, Play, Lock, Download, Star, BookOpen, Clock, ClipboardList, FileText, Layout, Terminal } from 'lucide-react';

const typeIcons: Record<string, typeof FileText> = { pdf: FileText, template: Layout, checklist: Check, prompt: Terminal };

export default function ModulePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const m = modules.find(mod => mod.id === id) || modules[0];
  const nextModule = modules.find(mod => mod.number === m.number + 1);

  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 mb-6"
        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.08))', borderColor: 'rgba(59,130,246,0.25)', borderRadius: 20 }}>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <span className="gradient-bg text-white font-sora font-bold text-xs px-2 py-1 rounded-md">Módulo {m.number}</span>
            <h1 className="font-sora font-[800] text-3xl lg:text-4xl text-white mt-2">{m.title}</h1>
            <p className="font-inter text-[17px] mt-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>{m.fullDesc}</p>

            <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <p className="font-sora font-medium text-[13px] text-zppia-blue">🎯 Objetivo:</p>
              <p className="font-inter text-sm mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>{m.result}</p>
            </div>

            <div className="flex flex-wrap gap-5 mt-4">
              {[[BookOpen, `${m.lessonCount} aulas`], [Clock, `~${m.duration}`], [ClipboardList, `${m.taskCount} tarefa`], [Star, `${m.progress}% concluído`]].map(([Icon, text]) => (
                <span key={text as string} className="flex items-center gap-1 font-inter text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {/* @ts-ignore */}
                  <Icon size={14} />{text as string}
                </span>
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
            <svg width="80" height="80"><circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5"/><circle cx="40" cy="40" r="34" fill="none" stroke="url(#mg)" strokeWidth="5" strokeDasharray={2*Math.PI*34} strokeDashoffset={2*Math.PI*34*(1-m.progress/100)} strokeLinecap="round" transform="rotate(-90 40 40)"/><defs><linearGradient id="mg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3B82F6"/><stop offset="100%" stopColor="#8B5CF6"/></linearGradient></defs></svg>
          </div>
        </div>
        <div className="mt-5">
          <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${m.progress}%` }} /></div>
          <p className="font-inter text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{m.lessons.filter(l => l.status === 'completed').length} de {m.lessonCount} aulas concluídas</p>
        </div>
      </motion.div>

      {/* Lessons */}
      <h3 className="font-sora font-bold text-lg text-white mb-3">Aulas do Módulo</h3>
      <div className="flex flex-col gap-2 mb-4">
        {m.lessons.map((l, i) => (
          <motion.div key={l.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => l.status !== 'locked' ? navigate(`/modulo/${m.id}/aula/${l.id}`) : null}
            className={`glass-card px-5 py-4 flex items-center gap-4 transition-all ${l.status !== 'locked' ? 'cursor-pointer hover:border-zppia-blue/30' : ''}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
              l.status === 'completed' ? 'bg-zppia-green' : l.status === 'current' ? 'gradient-bg' : ''
            }`} style={l.status === 'locked' ? { background: 'hsl(222, 40%, 9%)' } : {}}>
              {l.status === 'completed' ? <Check size={12} className="text-white" /> : l.status === 'current' ? <Play size={12} className="text-white" /> : <Lock size={12} style={{ color: 'rgba(255,255,255,0.35)' }} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-inter font-medium text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Aula {l.number}</p>
              <p className={`font-sora font-semibold text-base ${l.status === 'locked' ? '' : 'text-white'}`} style={l.status === 'locked' ? { color: 'rgba(255,255,255,0.35)' } : {}}>{l.title}</p>
              <p className="font-inter text-[13px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{l.duration}</p>
            </div>
            <span className={`font-inter font-medium text-xs ${l.status === 'completed' ? 'text-zppia-green' : l.status === 'current' ? 'text-zppia-blue' : ''}`}>
              {l.status === 'completed' ? 'Concluída ✓' : l.status === 'current' ? '▶ Continuar' : '🔒'}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Materials */}
      <div className="glass-card p-6 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-sora font-bold text-base text-white">Materiais do Módulo</h3>
          <button className="font-inter font-medium text-[13px] text-zppia-blue hover:underline">Ver todos →</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {m.materials.map(mat => {
            const Icon = typeIcons[mat.type] || FileText;
            return (
              <div key={mat.name} className="flex items-center gap-3 p-3 rounded-lg bg-zppia-surface hover:bg-zppia-elevated transition-colors">
                <Icon size={18} className="text-zppia-blue flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-inter font-medium text-sm text-white">{mat.name}</p>
                  <p className="font-inter text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{mat.desc}</p>
                </div>
                <Download size={16} className="text-zppia-blue flex-shrink-0 cursor-pointer" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Module Task */}
      <div className="glass-card p-6 mt-4" style={{ background: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.2)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Star size={20} className="text-zppia-gold" />
          <h3 className="font-sora font-bold text-lg text-white">Tarefa Final do Módulo</h3>
        </div>
        <p className="font-inter text-[15px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Escreva em 3 frases qual é a sua ideia de projeto e por que ela resolve um problema real.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {['Defini um problema real que quero resolver', 'Identifiquei quem tem esse problema', 'Validei que existe demanda mínima', 'Escolhi minha ideia de projeto'].map(item => (
            <label key={item} className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" className="w-[18px] h-[18px] rounded border-2 border-zppia-gold accent-zppia-gold" />
              <span className="font-inter text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{item}</span>
            </label>
          ))}
        </div>
        <button className="btn-gradient w-full mt-4 text-sm">Marcar tarefa como concluída</button>
      </div>

      {/* Next Module */}
      {nextModule && (
        <div className="glass-card p-6 mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-inter font-medium text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Próximo:</p>
            <p className="font-sora font-semibold text-lg text-white mt-1">Módulo {nextModule.number} — {nextModule.title}</p>
            <p className="font-inter text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{nextModule.result}</p>
          </div>
          <button onClick={() => navigate(`/modulo/${nextModule.id}`)} className="btn-gradient text-sm">Continuar →</button>
        </div>
      )}
    </div>
  );
}
