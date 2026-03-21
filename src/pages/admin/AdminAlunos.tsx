import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Pencil, Trash2, Plus, X } from 'lucide-react';
import { useStudents, useStudentProgress } from '@/hooks/useStudents';
import { useModules, useUpdateModule } from '@/hooks/useModules';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

function StudentDetail({ studentId, onClose }: { studentId: string; onClose: () => void }) {
  const { data: progress } = useStudentProgress(studentId);
  const { data: modules } = useModules();
  const updateModule = useUpdateModule();
  const { data: students } = useStudents();
  const student = students?.find(s => s.id === studentId);

  const getModuleProgress = (moduleId: string) => {
    if (!progress) return 0;
    const lessons = progress.filter(p => p.module_id === moduleId);
    return lessons.length;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(3,7,18,0.85)' }} onClick={onClose}>
      <div className="glass-card p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center">
              <span className="font-sora font-bold text-xl text-white">
                {student?.name?.charAt(0).toUpperCase() ?? 'A'}
              </span>
            </div>
            <div>
              <h3 className="font-sora font-bold text-lg text-white">{student?.name ?? 'Aluno'}</h3>
              <p className="font-inter text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{student?.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zppia-elevated">
            <X size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
          </button>
        </div>

        <h4 className="font-sora font-semibold text-sm text-white mb-3">Progresso por Módulo</h4>
        <div className="flex flex-col gap-2 mb-6">
          {modules?.map(mod => {
            const done = getModuleProgress(mod.id);
            return (
              <div key={mod.id} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="gradient-bg text-white font-sora font-bold text-[11px] px-2 py-1 rounded-md flex-shrink-0">M{mod.number}</span>
                <span className="flex-1 font-inter text-sm text-white">{mod.title}</span>
                <span className="font-inter text-[12px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{done} aulas</span>
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <h4 className="font-sora font-semibold text-sm mb-3" style={{ color: '#F59E0B' }}>Overrides do Admin</h4>
          <div className="flex flex-col gap-2">
            {modules?.map(mod => (
              <div key={mod.id} className="flex items-center justify-between">
                <span className="font-inter text-sm text-white">Módulo {mod.number}: {mod.title}</span>
                <select
                  value={mod.status}
                  onChange={e => updateModule.mutate({ id: mod.id, status: e.target.value }, { onSuccess: () => toast.success('Status atualizado!') })}
                  className="px-2 py-1 rounded-lg font-inter text-[12px] text-white border border-border focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <option value="locked">Bloqueado</option>
                  <option value="in-progress">Em andamento</option>
                  <option value="completed">Concluído</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={async () => {
            if (confirm('Revogar acesso deste aluno?')) {
              await supabase.from('profiles').update({ role: 'student' }).eq('id', studentId);
              toast.success('Acesso revogado.');
              onClose();
            }
          }}
          className="w-full py-2.5 rounded-xl font-inter font-medium text-sm transition-colors"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
          Revogar Acesso
        </button>
      </div>
    </div>
  );
}

export default function AdminAlunos() {
  const { data: students, isLoading } = useStudents();
  const [search, setSearch] = useState('');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [adding, setAdding] = useState(false);

  const filtered = students?.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const addStudent = async () => {
    if (!form.name || !form.email || !form.password) return toast.error('Preencha todos os campos.');
    setAdding(true);
    const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password });
    if (error || !data.user) { toast.error('Erro ao criar usuário: ' + error?.message); setAdding(false); return; }
    await supabase.from('profiles').upsert({ id: data.user.id, name: form.name, role: 'student' });
    toast.success('Aluno adicionado!');
    setShowAdd(false);
    setForm({ name: '', email: '', password: '' });
    setAdding(false);
  };

  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">
      {detailId && <StudentDetail studentId={detailId} onClose={() => setDetailId(null)} />}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(3,7,18,0.85)' }} onClick={() => setShowAdd(false)}>
          <div className="glass-card p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="font-sora font-bold text-lg text-white mb-5">Adicionar Aluno</h3>
            <div className="space-y-4">
              {[{ label: 'Nome completo', key: 'name', type: 'text', placeholder: 'João Silva' },
                { label: 'E-mail', key: 'email', type: 'email', placeholder: 'joao@email.com' },
                { label: 'Senha temporária', key: 'password', type: 'password', placeholder: '••••••••' }].map(f => (
                <div key={f.key}>
                  <label className="font-inter text-[12px] mb-1 block" style={{ color: 'rgba(255,255,255,0.35)' }}>{f.label}</label>
                  <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 rounded-lg font-inter text-sm text-white border border-border focus:border-zppia-blue focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.03)' }} />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="btn-ghost-blue flex-1">Cancelar</button>
              <button onClick={addStudent} disabled={adding} className="btn-gradient flex-1">{adding ? 'Criando...' : 'Criar Aluno'}</button>
            </div>
          </div>
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-sora font-bold text-2xl text-white">Gerenciamento de Alunos</h2>
          <p className="font-inter text-base mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Visualize e gerencie os alunos do Método ZPPIA.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-ghost-blue text-sm flex items-center gap-1.5">
          <Plus size={16} /> Adicionar Aluno
        </button>
      </motion.div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.35)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar aluno..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl font-inter text-sm text-white border border-border focus:border-zppia-blue focus:outline-none transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)' }} />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
          {['Aluno', 'E-mail', 'Função', 'Ações'].map(h => (
            <span key={h} className="font-inter text-[11px] uppercase tracking-wider flex-1 first:flex-[2]"
              style={{ color: 'rgba(255,255,255,0.35)' }}>{h}</span>
          ))}
        </div>

        {isLoading ? (
          <div className="p-8 text-center font-inter text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center font-inter text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Nenhum aluno encontrado.</div>
        ) : filtered.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 px-5 py-3.5 border-b last:border-0 hover:bg-zppia-elevated transition-colors cursor-pointer"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2.5 flex-[2] min-w-0">
              <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                <span className="font-sora font-bold text-[11px] text-white">{s.name?.charAt(0).toUpperCase() ?? 'A'}</span>
              </div>
              <span className="font-sora font-medium text-sm text-white truncate">{s.name ?? '—'}</span>
            </div>
            <span className="flex-1 font-inter text-[13px] truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.email}</span>
            <span className="flex-1 font-inter text-[12px] font-medium" style={{ color: s.role === 'admin' ? '#F59E0B' : '#10B981' }}>
              {s.role === 'admin' ? 'Admin' : 'Aluno'}
            </span>
            <div className="flex-1 flex items-center gap-1">
              <button onClick={() => setDetailId(s.id)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zppia-blue/20 transition-colors">
                <Eye size={13} className="text-zppia-blue" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
