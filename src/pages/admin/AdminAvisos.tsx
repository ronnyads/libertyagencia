import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useNotices, useUpsertNotice, useDeleteNotice, type DBNotice } from '@/hooks/useNotices';
import { toast } from 'sonner';

const typeColor = { update: '#3B82F6', bonus: '#8B5CF6', mentorship: '#F59E0B' };
const typeLabel = { update: 'Atualização', bonus: 'Bônus', mentorship: 'Mentoria' };

const EMPTY: Partial<DBNotice> = { message: '', type: 'update', active: true };

function NoticeModal({ notice, onClose }: { notice: Partial<DBNotice>; onClose: () => void }) {
  const [form, setForm] = useState(notice);
  const upsert = useUpsertNotice();

  const save = () => {
    if (!form.message) return toast.error('Mensagem é obrigatória.');
    upsert.mutate(form, {
      onSuccess: () => { toast.success('Aviso salvo!'); onClose(); },
      onError: () => toast.error('Erro ao salvar.'),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(3,7,18,0.85)' }} onClick={onClose}>
      <div className="glass-card p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <h3 className="font-sora font-bold text-lg text-white mb-5">{form.id ? 'Editar Aviso' : 'Novo Aviso'}</h3>
        <div className="space-y-4">
          <div>
            <label className="font-inter text-[12px] mb-1 block" style={{ color: 'rgba(255,255,255,0.35)' }}>Mensagem</label>
            <textarea value={form.message || ''} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg font-inter text-sm text-white border border-border focus:border-zppia-blue focus:outline-none resize-y min-h-[80px]"
              style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.65)' }}
              placeholder="Mensagem para os alunos..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-inter text-[12px] mb-1 block" style={{ color: 'rgba(255,255,255,0.35)' }}>Tipo</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as any }))}
                className="w-full px-3 py-2.5 rounded-lg font-inter text-sm text-white border border-border focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <option value="update">Atualização</option>
                <option value="bonus">Bônus</option>
                <option value="mentorship">Mentoria</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-inter text-[12px] mb-1 block" style={{ color: 'rgba(255,255,255,0.35)' }}>Status</label>
              <div className="flex items-center gap-2 mt-1.5">
                <button onClick={() => setForm(p => ({ ...p, active: !p.active }))}
                  className="w-10 h-5 rounded-full transition-colors relative flex-shrink-0"
                  style={{ background: form.active ? 'linear-gradient(135deg,#3B82F6,#8B5CF6)' : 'rgba(255,255,255,0.1)' }}>
                  <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all"
                    style={{ left: form.active ? '20px' : '2px' }} />
                </button>
                <span className="font-inter text-sm text-white">{form.active ? 'Ativo' : 'Inativo'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-ghost-blue flex-1">Cancelar</button>
          <button onClick={save} disabled={upsert.isPending} className="btn-gradient flex-1">
            {upsert.isPending ? 'Salvando...' : 'Salvar Aviso'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminAvisos() {
  const { data: notices } = useNotices();
  const del = useDeleteNotice();
  const upsert = useUpsertNotice();
  const [modal, setModal] = useState<Partial<DBNotice> | null>(null);

  const toggleActive = (n: DBNotice) => {
    upsert.mutate({ id: n.id, active: !n.active }, { onSuccess: () => toast.success('Status atualizado!') });
  };

  return (
    <div className="p-4 lg:p-6 max-w-[900px] mx-auto">
      {modal && <NoticeModal notice={modal} onClose={() => setModal(null)} />}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-sora font-bold text-2xl text-white">Avisos e Novidades</h2>
          <p className="font-inter text-base mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Publique comunicados para os alunos.</p>
        </div>
        <button onClick={() => setModal(EMPTY)} className="btn-gradient text-sm flex items-center gap-1.5">
          <Plus size={16} /> Novo Aviso
        </button>
      </motion.div>

      <div className="glass-card overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
          {['Mensagem', 'Tipo', 'Status', 'Ações'].map(h => (
            <span key={h} className="font-inter text-[11px] uppercase tracking-wider flex-1 first:flex-[3]"
              style={{ color: 'rgba(255,255,255,0.35)' }}>{h}</span>
          ))}
        </div>
        {!notices || notices.length === 0 ? (
          <p className="p-8 text-center font-inter text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Nenhum aviso. Clique em "Novo Aviso".
          </p>
        ) : notices.map((n, i) => {
          const color = typeColor[n.type] ?? '#3B82F6';
          return (
            <div key={n.id} className="flex items-center gap-3 px-5 py-3.5 border-b last:border-0 hover:bg-zppia-elevated transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-start gap-2.5 flex-[3] min-w-0">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
                <span className="font-inter text-sm text-white truncate">{n.message}</span>
              </div>
              <span className="flex-1 font-inter text-[12px]"
                style={{ color }}>{typeLabel[n.type]}</span>
              <div className="flex-1">
                <button onClick={() => toggleActive(n)}
                  className="w-8 h-4 rounded-full transition-colors relative flex-shrink-0"
                  style={{ background: n.active ? 'linear-gradient(135deg,#3B82F6,#8B5CF6)' : 'rgba(255,255,255,0.1)' }}>
                  <span className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all"
                    style={{ left: n.active ? '17px' : '2px' }} />
                </button>
              </div>
              <div className="flex-1 flex items-center gap-1">
                <button onClick={() => setModal(n)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zppia-blue/20 transition-colors">
                  <Pencil size={13} className="text-zppia-blue" />
                </button>
                <button onClick={() => { if (confirm('Excluir aviso?')) del.mutate(n.id, { onSuccess: () => toast.success('Excluído!') }); }}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/20 transition-colors">
                  <Trash2 size={13} style={{ color: '#EF4444' }} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
