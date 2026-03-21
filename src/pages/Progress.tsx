import { motion } from 'framer-motion';
import { modules } from '@/data/course';
import { student } from '@/data/student';

function ProgressDonut({ size = 120, pct = 47, stroke = 8 }: { size?: number; pct?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#pg)" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} className="transition-all duration-1000" />
      <defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3B82F6"/><stop offset="100%" stopColor="#8B5CF6"/></linearGradient></defs>
    </svg>
  );
}

const weekData = [40, 80, 60, 100, 30, 70, 50];
const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export default function Progress() {
  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-sora font-bold text-2xl text-white">Meu Progresso</h2>
        <p className="font-inter text-base mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Sua evolução no Método ZPPIA.</p>
      </motion.div>

      {/* Top cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {/* Donut */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="glass-card p-7 flex flex-col items-center">
          <div className="relative">
            <ProgressDonut />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-sora font-[800] text-[28px] gradient-text">{student.progress}%</span>
              <span className="font-inter text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>concluído</span>
            </div>
          </div>
          <div className="mt-4 progress-bar-track w-full"><div className="progress-bar-fill" style={{ width: `${student.progress}%` }} /></div>
          <p className="font-inter text-[13px] mt-2 text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>{student.completedLessons} de {student.totalLessons} aulas · {student.completedModules} de {student.totalModules} módulos</p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="glass-card p-6 grid grid-cols-2">
          {[[String(student.completedLessons), 'Aulas Concluídas'], [String(student.completedTasks), 'Tarefas Feitas'], [student.studyHours, 'Tempo de Estudo'], [String(student.streak), 'Dias Seguidos']].map(([n, l], i) => (
            <div key={l} className={`flex flex-col items-center justify-center py-4 ${i < 2 ? 'border-b border-border' : ''} ${i % 2 === 0 ? 'border-r border-border' : ''}`}>
              <span className="font-sora font-[800] text-[28px] gradient-text">{n}</span>
              <span className="font-inter text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{l}</span>
            </div>
          ))}
        </motion.div>

        {/* Weekly */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="glass-card p-6">
          <h3 className="font-sora font-bold text-base text-white mb-4">Atividade Semanal</h3>
          <div className="flex items-end justify-around gap-1 h-[100px]">
            {weekData.map((v, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-8 rounded-t-md gradient-bg transition-all duration-500" style={{ height: `${v}%` }} />
                <span className="font-inter text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{days[i]}</span>
              </div>
            ))}
          </div>
          <p className="font-inter text-[13px] text-center mt-3" style={{ color: 'rgba(255,255,255,0.35)' }}>Este mês: 14 aulas assistidas</p>
        </motion.div>
      </div>

      {/* Module progress */}
      <h3 className="font-sora font-bold text-lg text-white mt-6 mb-4">Progresso por Módulo</h3>
      <div className="flex flex-col gap-2.5">
        {modules.map((m, i) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 + i * 0.05 }}
            className="glass-card px-5 py-4 flex items-center gap-4">
            <span className="gradient-bg text-white font-sora font-bold text-[11px] px-2 py-1 rounded-md flex-shrink-0">M{m.number}</span>
            <div className="flex-1 min-w-0">
              <p className="font-sora font-semibold text-[15px] text-white">{m.title}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex-1 progress-bar-track h-1"><div className="progress-bar-fill h-1" style={{ width: `${m.progress}%` }} /></div>
                <span className="font-inter text-xs flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }}>{m.progress}%</span>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-md font-inter font-medium text-xs border flex-shrink-0 ${
              m.status === 'completed' ? 'text-zppia-green border-zppia-green/30 bg-zppia-green/10' :
              m.status === 'in-progress' ? 'text-zppia-blue border-zppia-blue/30 bg-zppia-blue/10' :
              'border-border'
            }`} style={m.status === 'locked' ? { color: 'rgba(255,255,255,0.35)' } : {}}>
              {m.status === 'completed' ? 'Concluído' : m.status === 'in-progress' ? 'Em andamento' : 'Bloqueado'}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Project */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="glass-card p-6 mt-5" style={{ background: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.3)' }}>
        <h3 className="font-sora font-bold text-lg text-white mb-4">Seu Projeto em Construção</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-[14px] gradient-bg flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">🚀</span>
          </div>
          <div className="flex-1">
            <p className="font-sora font-semibold text-lg text-white" data-placeholder>Projeto: Nome do seu projeto</p>
            <p className="font-inter text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>Fase atual: Escolha da Ideia</p>
            <div className="mt-2 progress-bar-track"><div className="progress-bar-fill" style={{ width: '40%' }} /></div>
            <p className="font-inter text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Etapa 2 de 5</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
