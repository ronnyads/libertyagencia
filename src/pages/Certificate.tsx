import { motion } from 'framer-motion';
import { student } from '@/data/student';
import { Lock, Download } from 'lucide-react';

export default function Certificate() {
  const isComplete = student.progress >= 100;

  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-sora font-bold text-2xl text-white">Certificado de Conclusão</h2>
        <p className="font-inter text-base mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Sua conquista ao concluir o Método ZPPIA.</p>
      </motion.div>

      {!isComplete ? (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="glass-card p-10 text-center mt-8 max-w-lg mx-auto">
          <Lock size={48} style={{ color: 'rgba(255,255,255,0.35)' }} className="mx-auto" />
          <h3 className="font-sora font-bold text-[22px] text-white mt-4">Seu certificado está sendo preparado</h3>
          <p className="font-inter text-[15px] mt-2" style={{ color: 'rgba(255,255,255,0.65)' }}>Conclua todos os 5 módulos para liberar o certificado.</p>
          <div className="mt-4 progress-bar-track mx-auto max-w-xs"><div className="progress-bar-fill" style={{ width: `${student.progress}%` }} /></div>
          <p className="font-inter text-[13px] mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>{student.progress}% concluído · Faltam {student.totalLessons - student.completedLessons} aulas</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="mt-8 max-w-[720px] mx-auto rounded-3xl overflow-hidden border-2" style={{ borderColor: 'rgba(59,130,246,0.3)', boxShadow: '0 0 60px rgba(59,130,246,0.15)' }}>
          <div className="bg-grid p-12 text-center" style={{ background: 'linear-gradient(145deg, #0A0F1E, #060B18)' }}>
            <div className="flex items-center justify-center gap-1.5 mb-6">
              <div className="w-5 h-5 rounded gradient-bg" />
              <span className="font-sora font-[800] text-lg gradient-text">ZPPIA</span>
            </div>
            <p className="font-inter font-medium text-xs tracking-[0.2em] text-zppia-blue mb-4">CERTIFICADO DE CONCLUSÃO</p>
            <p className="font-sora text-2xl" style={{ color: 'rgba(255,255,255,0.65)' }}>Parabéns,</p>
            <p className="font-sora font-[800] text-4xl text-white border-b border-border pb-3 mb-3 mt-1" data-placeholder>{student.name}</p>
            <p className="font-inter text-base" style={{ color: 'rgba(255,255,255,0.65)' }}>Concluiu com êxito o curso</p>
            <p className="font-sora font-[800] text-3xl gradient-text mt-1">Método ZPPIA</p>
            <p className="font-inter text-sm mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Zero ao Primeiro Projeto com Inteligência Artificial</p>
            <p className="font-inter text-[15px] max-w-[520px] mx-auto mt-5" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
              Parabéns. Você concluiu o Método ZPPIA e agora possui uma base prática para construir seu primeiro projeto digital com IA.
            </p>
            <div className="flex justify-center gap-8 mt-5 pb-5 border-b border-border">
              {['27 Aulas Concluídas', '5 Módulos', '5 Tarefas'].map(s => (
                <span key={s} className="font-inter text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{s}</span>
              ))}
            </div>
            <div className="flex justify-between items-end mt-5">
              <div className="text-left">
                <p className="font-inter text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Data:</p>
                <p className="font-inter font-medium text-sm text-white" data-placeholder>21 de Março de 2026</p>
              </div>
              <div className="w-[60px] h-[60px] rounded-full border-2 flex items-center justify-center" style={{ borderColor: 'rgba(59,130,246,0.4)' }}>
                <span className="font-sora font-[800] text-xs gradient-text">ZPPIA</span>
              </div>
              <div className="text-right">
                <div className="w-20 h-[1px] mb-2 ml-auto" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <p className="font-sora font-semibold text-sm text-white">Ronny Oliveira</p>
                <p className="font-inter text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Criador do Método ZPPIA</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {isComplete && (
        <div className="flex justify-center gap-3 mt-5">
          <button className="btn-gradient text-sm flex items-center gap-2" data-placeholder><Download size={16} /> Baixar Certificado</button>
          <button className="btn-ghost-blue text-sm">Compartilhar LinkedIn</button>
        </div>
      )}
    </div>
  );
}
