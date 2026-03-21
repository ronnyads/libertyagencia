import { motion } from 'framer-motion';
import { Award, Download } from 'lucide-react';
import { useStudents, useStudentProgress } from '@/hooks/useStudents';
import { useModules } from '@/hooks/useModules';

export default function AdminCertificados() {
  const { data: students } = useStudents();
  const { data: modules } = useModules();
  const totalLessons = modules?.reduce((acc, m) => acc + (m.lesson_count ?? 0), 0) ?? 27;

  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="font-sora font-bold text-2xl text-white">Certificados</h2>
        <p className="font-inter text-base mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Visualize e gerencie os certificados emitidos.
        </p>
      </motion.div>

      <div className="flex gap-3 mb-6">
        {[
          { label: 'Certificados emitidos', value: '0', color: '#3B82F6' },
          { label: 'Alunos 100% concluídos', value: '0', color: '#10B981' },
          { label: 'Pendentes', value: String(students?.length ?? 0), color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="glass-card p-5 flex-1">
            <p className="font-sora font-bold text-2xl" style={{ color: s.color }}>{s.value}</p>
            <p className="font-inter text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
          {['Aluno', 'E-mail', 'Status', 'Ações'].map(h => (
            <span key={h} className="font-inter text-[11px] uppercase tracking-wider flex-1 first:flex-[2]"
              style={{ color: 'rgba(255,255,255,0.35)' }}>{h}</span>
          ))}
        </div>

        {!students || students.length === 0 ? (
          <div className="p-10 text-center">
            <Award size={32} style={{ color: 'rgba(255,255,255,0.2)' }} className="mx-auto mb-3" />
            <p className="font-inter text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Nenhum certificado emitido ainda.
            </p>
          </div>
        ) : students.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 px-5 py-3.5 border-b last:border-0 hover:bg-zppia-elevated transition-colors"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2.5 flex-[2] min-w-0">
              <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                <span className="font-sora font-bold text-[11px] text-white">{s.name?.charAt(0).toUpperCase() ?? 'A'}</span>
              </div>
              <span className="font-sora font-medium text-sm text-white truncate">{s.name ?? '—'}</span>
            </div>
            <span className="flex-1 font-inter text-[13px] truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.email}</span>
            <span className="flex-1 font-inter text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Pendente
            </span>
            <div className="flex-1 flex items-center gap-1">
              <button disabled
                className="w-8 h-8 rounded-full flex items-center justify-center opacity-30 cursor-not-allowed"
                title="Disponível quando o aluno concluir">
                <Download size={13} style={{ color: '#3B82F6' }} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
